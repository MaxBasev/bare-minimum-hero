import quotes, { russianQuotes } from './quotes.js';
import {
	emergencyTexts,
	emergencyAchievements,
	russianEmergencyTexts,
	russianEmergencyAchievements
} from './emergency-quotes.js';
import {
	barelyUsefulTips,
	russianTips
} from './tips.js';
import {
	streakAchievements,
	streakMessages,
	streakRecoveryMessages,
	russianStreakAchievements,
	russianStreakMessages,
	russianStreakRecoveryMessages
} from './streak-quotes.js';
import { mysteryBonuses, russianMysteryBonuses } from './mystery-bonus.js';
import { translations, formatDate, formatNextAvailableDate } from './translations.js';

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

	// Shareable image elements
	const downloadImageBtn = document.getElementById('download-image-btn');
	const shareableContent = document.getElementById('shareable-content');
	const shareQuoteText = document.getElementById('share-quote-text');

	// Language selector elements
	const languageSelect = document.getElementById('language-select');
	const languageLabel = document.getElementById('language-label');

	// Display current date
	const today = new Date();

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
		lastBonusDate = '',
		userLanguage = 'en'
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
		'lastBonusDate',
		'userLanguage'
	]);

	// Set initial language from storage
	languageSelect.value = userLanguage;

	// Get translations for current language
	let currentLang = userLanguage;
	let t = translations[currentLang];

	// Update UI with current language
	updateUILanguage();

	// Language change handler
	languageSelect.addEventListener('change', async () => {
		currentLang = languageSelect.value;
		t = translations[currentLang];

		// Save language preference
		await chrome.storage.local.set({ userLanguage: currentLang });

		// Update UI with new language
		updateUILanguage();

		// Refresh tip with new language
		displayRandomTip(getRandomTipIndex());
	});

	// Function to update UI with selected language
	function updateUILanguage() {
		// Update date display
		dateDisplay.textContent = formatDate(today, currentLang);

		// Update static text elements
		languageLabel.textContent = t.languageLabel;
		document.querySelector('#question-container h2').textContent = t.title;
		document.querySelector('.button-text').textContent = t.mainButton;
		emergencyButton.innerHTML = `<span class="sos-icon">🆘</span> ${t.emergencyButton}`;
		document.querySelector('.tooltip').textContent = t.emergencyTooltip;
		downloadImageBtn.innerHTML = `<span class="download-icon">💾</span> ${t.downloadButton}`;

		// Points section
		document.querySelector('.points-label').textContent = t.pointsLabel;
		updatePointComment(heroPoints);

		// Streak section
		document.querySelector('.streak-label').textContent = t.streakLabel;
		streakDays.textContent = currentStreak === 1 ? t.day : t.days;

		// Tips section
		document.querySelector('.tips-header span').textContent = t.tipsHeader;
		refreshTip.title = t.refreshTip;

		// About section
		document.querySelector('#about-container h3').textContent = t.aboutTitle;
		document.querySelector('.about-quote p').innerHTML = t.aboutQuote;
		document.querySelector('#about-container p:nth-of-type(1)').innerHTML = t.aboutP1;
		document.querySelector('#about-container p:nth-of-type(2)').innerHTML = t.aboutP2;
		document.querySelector('.about-minimal').innerHTML = t.aboutMinimal;
		document.querySelector('#about-container p:nth-of-type(3)').innerHTML = t.aboutP3;
		document.querySelector('.about-tldr h4').innerHTML = t.aboutTLDR;
		document.querySelector('.about-tldr p').innerHTML = t.aboutTLDRText;
		document.querySelector('.about-close').textContent = t.aboutClose;

		// Emergency mode
		achievementText.textContent = t.achievementText;
		document.querySelector('.close-emergency').textContent = t.closeEmergency;

		// Update streak display
		updateStreakDisplay(currentStreak);

		// Check if streak is in recovery mode
		if (streakBroken) {
			displayStreakRecoveryMessage();
		} else {
			displayRandomStreakMessage(currentStreak);
		}
	}

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
			const achievements = currentLang === 'ru' ? russianStreakAchievements : streakAchievements;
			for (const achievement of achievements) {
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

		// Get random quote based on language
		const quotesArray = currentLang === 'ru' ? russianQuotes : quotes;
		const randomQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)];

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
		// Get appropriate emergency texts based on language
		const emTexts = currentLang === 'ru' ? russianEmergencyTexts : emergencyTexts;
		const emAchievements = currentLang === 'ru' ? russianEmergencyAchievements : emergencyAchievements;

		// Get random emergency text and achievement
		const randomEmergencyText = emTexts[Math.floor(Math.random() * emTexts.length)];
		const randomAchievement = emAchievements[Math.floor(Math.random() * emAchievements.length)];

		// Reset emergency text container
		emergencyText.innerHTML = '';
		achievementText.textContent = t.achievementText;

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
		emergencyButton.innerHTML = `<span class="sos-icon">🆘</span> ${formatNextAvailableDate(getNextAvailableDate(today), currentLang)}`;
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

	// Add click handler for download image button
	downloadImageBtn?.addEventListener('click', () => {
		// Copy the quote text to shareable container
		shareQuoteText.textContent = quoteText.textContent;

		// Create image and download it
		createShareableImage();
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

		const messages = currentLang === 'ru' ? russianStreakMessages : streakMessages;
		const randomMessage = messages[Math.floor(Math.random() * messages.length)];
		streakMessage.textContent = randomMessage;
	}

	// Display streak recovery message
	function displayStreakRecoveryMessage() {
		const messages = currentLang === 'ru' ? russianStreakRecoveryMessages : streakRecoveryMessages;
		const randomMessage = messages[Math.floor(Math.random() * messages.length)];
		streakMessage.textContent = randomMessage;
		streakMessage.innerHTML += `<br><button id="reset-streak-btn">${t.resetStreak}</button>`;

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
		streakDays.textContent = streak === 1 ? t.day : t.days;

		// Use appropriate achievement set based on language
		const achievements = currentLang === 'ru' ? russianStreakAchievements : streakAchievements;

		// Find current achievement
		let currentAch = null;
		for (let i = achievements.length - 1; i >= 0; i--) {
			if (streak >= achievements[i].days) {
				currentAch = achievements[i];
				break;
			}
		}

		// Find next achievement
		let nextAch = null;
		for (let i = 0; i < achievements.length; i++) {
			if (streak < achievements[i].days) {
				nextAch = achievements[i];
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
			nextAchievement.textContent = t.nextAchievement
				.replace('{label}', nextAch.label)
				.replace('{days}', nextAch.days);
			nextAchievement.classList.remove('hidden');
		} else {
			nextAchievement.textContent = t.allAchievements;
		}
	}

	// Update point comment based on points
	function updatePointComment(points) {
		if (points === 0) {
			pointComment.textContent = t.pointComments.zero;
		} else if (points <= 3) {
			pointComment.textContent = t.pointComments.low;
		} else if (points <= 6) {
			pointComment.textContent = t.pointComments.medium;
		} else if (points <= 10) {
			pointComment.textContent = t.pointComments.high;
		} else if (points <= 20) {
			pointComment.textContent = t.pointComments.veryHigh;
		} else if (points <= 50) {
			pointComment.textContent = t.pointComments.superHigh;
		} else {
			pointComment.textContent = t.pointComments.legendary;
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
			emergencyButton.innerHTML = `<span class="sos-icon">🆘</span> ${formatNextAvailableDate(nextAvailableDate, currentLang)}`;
		}
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
	function displayRandomTip(lastIndex = -1) {
		// Get tips based on current language
		const tips = currentLang === 'ru' ? russianTips : barelyUsefulTips;

		// Get a new random index different from the last one
		const newIndex = getRandomTipIndex(lastIndex, tips.length);

		// Display the tip
		tipText.textContent = tips[newIndex];

		// Save the index for next time
		chrome.storage.local.set({ lastTipIndex: newIndex });
	}

	// Function to get a random tip index different from the last one
	function getRandomTipIndex(lastIndex = -1, tipsLength = barelyUsefulTips.length) {
		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * tipsLength);
		} while (newIndex === lastIndex && tipsLength > 1);

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
				const bonusArray = currentLang === 'ru' ? russianMysteryBonuses : mysteryBonuses;
				const randomBonus = bonusArray[Math.floor(Math.random() * bonusArray.length)];

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

	// Function to create and download shareable image
	function createShareableImage() {
		// Show loading state
		downloadImageBtn.disabled = true;
		downloadImageBtn.textContent = 'Creating image...';

		// We'll use a simpler approach with Canvas API directly
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Set canvas size (same as our template)
		const width = 500;
		const height = 600;
		canvas.width = width;
		canvas.height = height;

		// Create a logo Image object
		const logo = new Image();
		logo.crossOrigin = 'anonymous';
		logo.src = 'images/BMH_Logo_trans.png';

		// Once the image has loaded, we can draw everything
		logo.onload = () => {
			try {
				// Draw background
				ctx.fillStyle = '#f1ebe1';
				ctx.fillRect(0, 0, width, height);

				// Draw logo at the top - correctly sized to be fully visible
				// Calculate the aspect ratio and apply it to keep proportions
				const logoMaxWidth = 170; // уменьшен по сравнению с оригиналом
				const logoAspectRatio = logo.width / logo.height;
				const logoWidth = logoMaxWidth;
				const logoHeight = logoWidth / logoAspectRatio;

				// Center the logo horizontally at the top of the image
				const logoX = (width - logoWidth) / 2;
				const logoY = 40; // достаточный отступ сверху
				ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

				// Draw quote box
				const quoteBoxY = logoY + logoHeight + 30;
				const quoteBoxHeight = 250;
				ctx.fillStyle = '#ffffff';
				roundRect(ctx, 40, quoteBoxY, width - 80, quoteBoxHeight, 15, true);

				// Draw quote marks
				ctx.fillStyle = 'rgba(221, 193, 153, 0.3)';
				ctx.font = '60px Georgia, serif';
				ctx.fillText('"', 60, quoteBoxY + 50);
				ctx.fillText('"', width - 80, quoteBoxY + quoteBoxHeight - 40);

				// Draw the quote text
				ctx.fillStyle = '#4a4a4a';
				ctx.font = 'bold 24px Nunito, sans-serif';
				wrapText(ctx, quoteText.textContent, width / 2, quoteBoxY + 70, width - 150, 30);

				// Position the footer elements
				const footerStartY = quoteBoxY + quoteBoxHeight + 40;
				const footerSpacing = 50;

				// Draw caption directly (no star)
				ctx.fillStyle = '#5d7b93';
				ctx.font = 'bold 20px Nunito, sans-serif';
				ctx.textAlign = 'center';
				ctx.fillText('I did the bare minimum today.', width / 2, footerStartY);

				// Draw URL
				ctx.fillStyle = '#8597a6';
				ctx.font = '16px Nunito, sans-serif';
				ctx.fillText('bareminimumhero.com', width / 2, footerStartY + footerSpacing);

				// Convert to image and download
				const image = canvas.toDataURL('image/png');
				const downloadLink = document.createElement('a');

				// Get current date for filename
				const today = new Date();
				const dateString = today.toISOString().split('T')[0];

				// Set download attributes
				downloadLink.href = image;
				downloadLink.download = `bare-minimum-hero-${dateString}.png`;

				// Add to document, click, and remove
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);

				// Reset button
				downloadImageBtn.disabled = false;
				downloadImageBtn.innerHTML = '<span class="download-icon">💾</span> Download Your Hero Moment';

				// Create confetti effect for successful download
				createConfetti(15, false, false);
			} catch (error) {
				console.error('Error creating image:', error);

				// Reset button on error
				downloadImageBtn.disabled = false;
				downloadImageBtn.innerHTML = '<span class="download-icon">💾</span> Try Again';
			}
		};

		// Handle logo loading error
		logo.onerror = () => {
			console.error('Error loading logo image');

			// Fallback to the text-only version
			try {
				// Draw background
				ctx.fillStyle = '#f1ebe1';
				ctx.fillRect(0, 0, width, height);

				// Нарисуем альтернативный логотип и заголовок
				const logoY = 60;

				// Нарисуем упрощенную иконку
				const iconSize = 60;
				ctx.fillStyle = '#5d88a3';
				roundRect(ctx, (width - iconSize) / 2, logoY, iconSize, iconSize, 10, true, false);

				// Нарисуем стилизованную звезду в иконке
				ctx.fillStyle = '#e8dfca';
				ctx.font = '36px Georgia, serif';
				ctx.textAlign = 'center';
				ctx.fillText('⭐', width / 2, logoY + 42);

				// Название под иконкой
				ctx.fillStyle = '#5d7b93';
				ctx.font = 'bold 30px Nunito, sans-serif';
				ctx.fillText('Bare Minimum Hero', width / 2, logoY + 90);

				// Draw quote box with adjusted position
				const quoteBoxY = logoY + 120;
				const quoteBoxHeight = 250;
				ctx.fillStyle = '#ffffff';
				roundRect(ctx, 40, quoteBoxY, width - 80, quoteBoxHeight, 15, true);

				// Draw quote marks
				ctx.fillStyle = 'rgba(221, 193, 153, 0.3)';
				ctx.font = '60px Georgia, serif';
				ctx.fillText('"', 60, quoteBoxY + 50);
				ctx.fillText('"', width - 80, quoteBoxY + quoteBoxHeight - 40);

				// Draw the quote text
				ctx.fillStyle = '#4a4a4a';
				ctx.font = 'bold 24px Nunito, sans-serif';
				wrapText(ctx, quoteText.textContent, width / 2, quoteBoxY + 70, width - 150, 30);

				// Position the footer elements
				const footerStartY = quoteBoxY + quoteBoxHeight + 40;
				const footerSpacing = 50;

				// Draw caption directly (no star)
				ctx.fillStyle = '#5d7b93';
				ctx.font = 'bold 20px Nunito, sans-serif';
				ctx.textAlign = 'center';
				ctx.fillText('I did the bare minimum today.', width / 2, footerStartY);

				// Draw URL
				ctx.fillStyle = '#8597a6';
				ctx.font = '16px Nunito, sans-serif';
				ctx.fillText('bareminimumhero.com', width / 2, footerStartY + footerSpacing);

				// Convert to image and download
				const image = canvas.toDataURL('image/png');
				const downloadLink = document.createElement('a');

				const today = new Date();
				const dateString = today.toISOString().split('T')[0];

				downloadLink.href = image;
				downloadLink.download = `bare-minimum-hero-${dateString}.png`;

				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);

				downloadImageBtn.disabled = false;
				downloadImageBtn.innerHTML = '<span class="download-icon">💾</span> Download Your Hero Moment';

				createConfetti(15, false, false);
			} catch (error) {
				console.error('Error creating fallback image:', error);

				downloadImageBtn.disabled = false;
				downloadImageBtn.innerHTML = '<span class="download-icon">💾</span> Try Again';
			}
		};
	}

	// Helper function to create rounded rectangles on canvas
	function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
		if (typeof stroke === 'undefined') {
			stroke = true;
		}
		if (typeof radius === 'undefined') {
			radius = 5;
		}
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		if (fill) {
			ctx.fill();
		}
		if (stroke) {
			ctx.stroke();
		}
	}

	// Helper function to wrap text in canvas
	function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
		ctx.textAlign = 'center';
		const words = text.split(' ');
		let line = '';
		let testLine = '';
		let lineCount = 0;

		for (let n = 0; n < words.length; n++) {
			testLine = line + words[n] + ' ';
			const metrics = ctx.measureText(testLine);
			const testWidth = metrics.width;

			if (testWidth > maxWidth && n > 0) {
				ctx.fillText(line, x, y + (lineCount * lineHeight));
				line = words[n] + ' ';
				lineCount++;
			} else {
				line = testLine;
			}
		}

		ctx.fillText(line, x, y + (lineCount * lineHeight));
	}

	// Get next available date for emergency button
	function getNextAvailableDate(date) {
		const nextDate = new Date(date);
		nextDate.setDate(nextDate.getDate() + 1);
		return nextDate;
	}
}); 