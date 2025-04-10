import quotes from './quotes.js';
import {
	emergencyTexts,
	emergencyAchievements
} from './emergency-quotes.js';
import {
	barelyUsefulTips
} from './tips.js';
import {
	streakAchievements,
	streakMessages,
	streakRecoveryMessages
} from './streak-quotes.js';
import { mysteryBonuses } from './mystery-bonus.js';

document.addEventListener('DOMContentLoaded', async () => {
	// Get DOM elements
	const dateDisplay = document.getElementById('date-display');
	const barelyButton = document.getElementById('barely-button');
	const questionContainer = document.getElementById('question-container');
	const quoteContainer = document.getElementById('quote-container');
	const quoteText = document.getElementById('quote-text');
	const pointsCount = document.getElementById('points-count');
	const pointComment = document.getElementById('point-comment');
	const heroBadge = document.querySelector('.hero-badge');
	const emergencyButton = document.getElementById('emergency-button');
	const emergencyContainer = document.getElementById('emergency-container');
	const emergencyText = document.getElementById('emergency-text');
	const achievementText = document.getElementById('achievement-text');
	const aboutContainer = document.getElementById('about-container');
	const tipText = document.getElementById('tip-text');
	const refreshTip = document.getElementById('refresh-tip');

	// Streak related elements
	const streakCount = document.getElementById('streak-count');
	const streakDays = document.getElementById('streak-days');
	const currentAchievement = document.getElementById('current-achievement');
	const nextAchievement = document.getElementById('next-achievement');
	const streakMessage = document.getElementById('streak-message');

	// Mystery bonus elements
	const mysteryBonusContainer = document.getElementById('mystery-bonus-container');
	const bonusReward = document.getElementById('bonus-reward');

	// Display current date
	const today = new Date();
	const options = { weekday: 'long', day: 'numeric', month: 'long' };
	dateDisplay.textContent = today.toLocaleDateString('en-US', options);

	// Format date for comparison
	const dateString = today.toISOString().split('T')[0];

	// Load data from local storage
	const {
		lastClickDate,
		heroPoints = 0,
		lastQuote = '',
		lastEmergencyDate = '',
		lastTipIndex = -1,
		currentStreak = 0,
		lastStreakDate = '',
		highestStreak = 0,
		lastAchievement = '',
		streakBroken = false,
		lastBonusDate = ''
	} = await chrome.storage.local.get([
		'lastClickDate',
		'heroPoints',
		'lastQuote',
		'lastEmergencyDate',
		'lastTipIndex',
		'currentStreak',
		'lastStreakDate',
		'highestStreak',
		'lastAchievement',
		'streakBroken',
		'lastBonusDate'
	]);

	// Update points counter
	pointsCount.textContent = heroPoints;
	updatePointComment(heroPoints);

	// Display a random tip
	displayRandomTip(lastTipIndex);

	// Update streak display
	updateStreakDisplay(currentStreak);

	// Check if streak is in recovery mode
	if (streakBroken) {
		displayStreakRecoveryMessage();
	} else {
		displayRandomStreakMessage(currentStreak);
	}

	// Add tip refresh button handler
	refreshTip.addEventListener('click', () => {
		displayRandomTip(getRandomTipIndex());
		refreshTip.classList.add('rotate');
		setTimeout(() => {
			refreshTip.classList.remove('rotate');
		}, 300);
	});

	// Check if user has clicked the button today
	if (lastClickDate === dateString) {
		// User has already clicked the button today
		barelyButton.disabled = true;
		quoteText.textContent = lastQuote;
		questionContainer.classList.add('hidden');
		quoteContainer.classList.remove('hidden');
	}

	// Check if emergency mode can be used
	checkEmergencyAvailability(lastEmergencyDate);

	// Button click handler
	barelyButton.addEventListener('click', async () => {
		// Increase points counter
		const newPoints = heroPoints + 1;

		// Calculate new streak
		let newStreak = currentStreak;
		let streakAchieved = false;
		let achievementUnlocked = null;

		// Check if there was a streak break (more than 1 day passed since last click)
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayString = yesterday.toISOString().split('T')[0];

		if (!lastClickDate || lastClickDate === yesterdayString) {
			// Continuing or starting a streak
			newStreak = currentStreak + 1;

			// Check if a new achievement was reached
			for (const achievement of streakAchievements) {
				if (newStreak === achievement.days) {
					streakAchieved = true;
					achievementUnlocked = achievement;
					break;
				}
			}
		} else if (lastClickDate !== dateString) {
			// Streak was broken (more than 1 day passed)
			newStreak = 1;
		}

		// Update highest streak if needed
		const newHighestStreak = Math.max(highestStreak, newStreak);

		// Get random quote
		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		// Add click animation
		barelyButton.classList.add('clicked');

		// Create confetti effect
		createConfetti();

		// Animate hero badge
		heroBadge.classList.add('celebrate');

		// Check for random mystery bonus
		const gotBonus = checkMysteryBonus(lastBonusDate);

		// Display quote and hide question with delay for better animation
		setTimeout(() => {
			quoteText.textContent = randomQuote;
			questionContainer.classList.add('hidden');
			quoteContainer.classList.remove('hidden');

			// Update points counter on page
			animatePointsCounter(heroPoints, newPoints);
			updatePointComment(newPoints);

			// Update streak counter
			animateStreakCounter(currentStreak, newStreak);
			updateStreakDisplay(newStreak);

			// Show streak achievement if unlocked
			if (streakAchieved && achievementUnlocked) {
				showStreakAchievement(achievementUnlocked);
			}

			// Disable button
			barelyButton.disabled = true;
		}, 600);

		// Save data to local storage
		await chrome.storage.local.set({
			lastClickDate: dateString,
			heroPoints: newPoints,
			lastQuote: randomQuote,
			currentStreak: newStreak,
			lastStreakDate: dateString,
			highestStreak: newHighestStreak,
			lastAchievement: achievementUnlocked ? achievementUnlocked.label : lastAchievement,
			streakBroken: false
		});

		// Update streak message
		displayRandomStreakMessage(newStreak);
	});

	// Emergency button click handler
	emergencyButton.addEventListener('click', async () => {
		// Get random emergency text and achievement
		const randomEmergencyText = emergencyTexts[Math.floor(Math.random() * emergencyTexts.length)];
		const randomAchievement = emergencyAchievements[Math.floor(Math.random() * emergencyAchievements.length)];

		// Reset emergency text container
		emergencyText.innerHTML = '';
		achievementText.textContent = randomAchievement;

		// Create larger confetti effect
		createConfetti(60, true);

		// Show emergency container - simpler approach
		emergencyContainer.classList.remove('hidden');

		// Animate text appearance
		animateEmergencyText(randomEmergencyText.lines);

		// Save last emergency date
		const today = new Date();
		await chrome.storage.local.set({
			lastEmergencyDate: today.toISOString().split('T')[0]
		});

		// Disable emergency button
		emergencyButton.disabled = true;
		// Добавляем span для иконки и укорачиваем текст
		emergencyButton.innerHTML = `<span class="sos-icon">🆘</span> ${getNextAvailableDate(today)}`;
	});

	// Back to normal button setup
	document.addEventListener('click', (e) => {
		if (e.target.closest('#emergency-container')) {
			emergencyContainer.classList.add('hidden');
		}

		// Close streak achievement banner
		if (e.target.closest('.streak-banner')) {
			document.querySelector('.streak-banner')?.remove();
		}
	});

	// Add badge click handler for About display
	heroBadge.addEventListener('click', () => {
		aboutContainer.classList.toggle('hidden');

		// Removed auto-hide timer to allow user to read at their own pace
	});

	// Add close handler for About
	document.querySelector('.about-close')?.addEventListener('click', () => {
		aboutContainer.classList.add('hidden');
	});

	// Function to check if streak needs resetting
	async function checkStreakStatus() {
		if (!lastClickDate || lastClickDate === dateString) return;

		// Get the last click date
		const lastClick = new Date(lastClickDate);

		// Get yesterday date
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		// If last click was before yesterday, streak is broken
		if (lastClick < yesterday && !streakBroken && currentStreak > 0) {
			await chrome.storage.local.set({ streakBroken: true });
			displayStreakRecoveryMessage();
		}
	}

	// Check if streak was broken
	checkStreakStatus();

	// Animate streak counter
	function animateStreakCounter(from, to) {
		let current = from;
		const increment = (to - from) > 0 ? 1 : -1;

		streakCount.classList.add('updating');

		const timer = setInterval(() => {
			current += increment;
			streakCount.textContent = current;
			streakDays.textContent = current === 1 ? 'day' : 'days';

			if (current === to) {
				clearInterval(timer);
				setTimeout(() => {
					streakCount.classList.remove('updating');
				}, 500);
			}
		}, 100);
	}

	// Show streak achievement banner
	function showStreakAchievement(achievement) {
		// Create streak banner
		const streakBanner = document.createElement('div');
		streakBanner.className = 'streak-banner';

		// Banner content
		streakBanner.innerHTML = `
			<div class="streak-banner-title">🏆 New Title Unlocked:</div>
			<div class="streak-banner-description">${achievement.label}</div>
			<div class="streak-banner-subtitle">You showed up for ${achievement.days} days straight. That's more than your last relationship.</div>
			<div class="close-streak-banner">Tap to close</div>
		`;

		// Add to body
		document.body.appendChild(streakBanner);

		// Auto remove after 10 seconds
		setTimeout(() => {
			streakBanner.remove();
		}, 10000);
	}

	// Display random streak message
	function displayRandomStreakMessage(streak) {
		if (streak <= 0) {
			streakMessage.textContent = '';
			return;
		}

		const randomMessage = streakMessages[Math.floor(Math.random() * streakMessages.length)];
		streakMessage.textContent = randomMessage;
	}

	// Display streak recovery message
	function displayStreakRecoveryMessage() {
		const randomMessage = streakRecoveryMessages[Math.floor(Math.random() * streakRecoveryMessages.length)];
		streakMessage.textContent = randomMessage;
		streakMessage.innerHTML += `<br><button id="reset-streak-btn">Reset Streak With Dignity 🧹</button>`;

		// Add reset button handler
		document.getElementById('reset-streak-btn')?.addEventListener('click', async () => {
			await chrome.storage.local.set({
				streakBroken: false,
				currentStreak: 0
			});

			// Update UI
			animateStreakCounter(parseInt(streakCount.textContent), 0);
			updateStreakDisplay(0);
			displayRandomStreakMessage(0);
		});
	}

	// Update streak display
	function updateStreakDisplay(streak) {
		// Update streak counter
		streakCount.textContent = streak;
		streakDays.textContent = streak === 1 ? 'day' : 'days';

		// Find current achievement
		let currentAch = null;
		for (let i = streakAchievements.length - 1; i >= 0; i--) {
			if (streak >= streakAchievements[i].days) {
				currentAch = streakAchievements[i];
				break;
			}
		}

		// Find next achievement
		let nextAch = null;
		for (let i = 0; i < streakAchievements.length; i++) {
			if (streak < streakAchievements[i].days) {
				nextAch = streakAchievements[i];
				break;
			}
		}

		// Update achievements display
		if (currentAch) {
			currentAchievement.textContent = `${currentAch.label} ✅`;
			currentAchievement.classList.remove('hidden');
		} else {
			currentAchievement.classList.add('hidden');
		}

		if (nextAch) {
			nextAchievement.textContent = `Next: ${nextAch.label} at ${nextAch.days} days`;
			nextAchievement.classList.remove('hidden');
		} else {
			nextAchievement.textContent = `You've reached all achievements!`;
		}
	}

	// Function to update points comment
	function updatePointComment(points) {
		if (points === 0) {
			pointComment.textContent = '(starting from zero)';
		} else if (points <= 3) {
			pointComment.textContent = '(it\'s a start)';
		} else if (points <= 6) {
			pointComment.textContent = '(you\'re on a roll-ish)';
		} else if (points <= 10) {
			pointComment.textContent = '(okay wow look at you go)';
		} else if (points <= 20) {
			pointComment.textContent = '(impressive consistency!)';
		} else if (points <= 50) {
			pointComment.textContent = '(unofficial productivity guru)';
		} else {
			pointComment.textContent = '(legendary minimum achiever)';
		}
	}

	// Create confetti effect
	function createConfetti(count = 30, emergency = false, bonus = false) {
		const confettiContainer = document.createElement('div');
		confettiContainer.className = 'confetti-container';
		document.body.appendChild(confettiContainer);

		const colors = emergency
			? ['#e7906b', '#f6c177', '#7aa2f7', '#bb9af7', '#fff']
			: bonus
				? ['#ffcb6b', '#ffae33', '#ffd700', '#ffe863', '#fff9c4']
				: ['#7ca5bd', '#ddc199', '#e8dfca', '#5d7b93', '#fff'];

		for (let i = 0; i < count; i++) {
			const confetti = document.createElement('div');
			confetti.className = 'confetti';
			confetti.style.left = Math.random() * 100 + '%';
			confetti.style.width = (Math.random() * 8 + 5) + 'px';
			confetti.style.height = (Math.random() * 8 + 5) + 'px';
			confetti.style.animationDelay = Math.random() * 3 + 's';
			confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

			// For bonus confetti, add some special shapes
			if (bonus && Math.random() > 0.7) {
				const shapes = ['✨', '🎉', '🎁', '🎊', '💫', '⭐'];
				confetti.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
				confetti.style.fontSize = (Math.random() * 12 + 8) + 'px';
				confetti.style.backgroundColor = 'transparent';
				confetti.style.width = 'auto';
				confetti.style.height = 'auto';
			}

			confettiContainer.appendChild(confetti);
		}

		setTimeout(() => {
			confettiContainer.remove();
		}, 3000);
	}

	// Animate points counter
	function animatePointsCounter(from, to) {
		let current = from;
		const increment = (to - from) > 0 ? 1 : -1;

		pointsCount.classList.add('updating');

		const timer = setInterval(() => {
			current += increment;
			pointsCount.textContent = current;

			if (current === to) {
				clearInterval(timer);
				setTimeout(() => {
					pointsCount.classList.remove('updating');
				}, 500);
			}
		}, 100);
	}

	// Check if emergency mode is available
	function checkEmergencyAvailability(lastDate) {
		if (!lastDate) {
			return; // Never used before, so it's available
		}

		const lastEmergencyDate = new Date(lastDate);
		const today = new Date();

		// Calculate date one week after last use
		const nextAvailableDate = new Date(lastEmergencyDate);
		nextAvailableDate.setDate(nextAvailableDate.getDate() + 7);

		if (today < nextAvailableDate) {
			// Not available yet
			emergencyButton.disabled = true;
			// Добавляем span для иконки SOS и укорачиваем текст
			emergencyButton.innerHTML = `<span class="sos-icon">🆘</span> ${getNextAvailableDate(nextAvailableDate)}`;
		}
	}

	// Format next available date
	function getNextAvailableDate(date) {
		if (typeof date === 'string') {
			date = new Date(date);
		}

		const nextDate = new Date(date);
		nextDate.setDate(nextDate.getDate() + 7);

		return `Until ${nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
	}

	// Animate emergency text appearance
	function animateEmergencyText(lines) {
		lines.forEach((line, index) => {
			const lineElement = document.createElement('span');
			lineElement.textContent = line;
			lineElement.style.animationDelay = `${index * 0.8}s`;
			emergencyText.appendChild(lineElement);
		});
	}

	// Display a random tip
	function displayRandomTip(index) {
		if (index === -1) {
			index = getRandomTipIndex();
		}
		tipText.textContent = barelyUsefulTips[index];
		chrome.storage.local.set({ lastTipIndex: index });
	}

	// Get a random tip index
	function getRandomTipIndex() {
		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * barelyUsefulTips.length);
		} while (newIndex === lastTipIndex && barelyUsefulTips.length > 1);
		return newIndex;
	}

	// Check for random mystery bonus
	function checkMysteryBonus(lastBonusDate) {
		// Mystery bonus should be rare - 15% chance per click
		const bonusChance = 0.15;

		// Don't show bonus too often - at least 3 days between bonuses
		const minDaysBetweenBonuses = 3;

		// Check if enough days have passed since last bonus
		let daysSinceLastBonus = Infinity;
		if (lastBonusDate) {
			const lastBonus = new Date(lastBonusDate);
			const today = new Date();
			daysSinceLastBonus = Math.floor((today - lastBonus) / (1000 * 60 * 60 * 24));
		}

		// Only proceed if enough days have passed
		if (daysSinceLastBonus >= minDaysBetweenBonuses) {
			// Random roll for bonus
			const roll = Math.random();
			if (roll <= bonusChance) {
				// Got a bonus!
				const randomBonus = mysteryBonuses[Math.floor(Math.random() * mysteryBonuses.length)];

				// Update the bonus display
				bonusReward.textContent = `Reward: ${randomBonus}`;

				// Show the bonus with a small delay for dramatic effect
				setTimeout(() => {
					mysteryBonusContainer.classList.remove('hidden');

					// Create special bonus confetti
					createConfetti(20, false, true);

					// Auto-hide bonus after some time
					setTimeout(() => {
						mysteryBonusContainer.classList.add('hidden');
					}, 8000);
				}, 1500);

				// Save the date of this bonus
				chrome.storage.local.set({
					lastBonusDate: new Date().toISOString().split('T')[0]
				});

				return true;
			}
		}

		return false;
	}
}); 