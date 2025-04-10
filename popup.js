import quotes from './quotes.js';

// Barely Useful Tips array
const barelyUsefulTips = [
	"💧 Drink water. You're not a plant, but close enough.",
	"📧 Replying to one email is technically communication.",
	"🛌 Lying horizontally still counts as existing.",
	"🗑️ Deleting a file = emotional release.",
	"📅 Rescheduling is just time travel for grown-ups.",
	"🧠 Thinking about working is half the battle. Maybe.",
	"😶 Ignoring Slack for 10 minutes builds character.",
	"🫠 Melting emotionally still counts as a process.",
	"🍞 Toast is a valid meal. So is air.",
	"🔌 Restarting your device is basically therapy.",
	"📦 Organizing your desktop = controlling chaos.",
	"📣 Whispering 'no' to your inbox is self-care.",
	"🐌 Slow progress is still progress. Ask a snail.",
	"📓 Unchecked boxes are just dreams in progress.",
	"🌬️ Deep sighs are unofficial breathing exercises.",
	"🥱 Yawning loudly = asserting dominance in Zoom calls.",
	"📱 Scrolling mindlessly counts as market research if you're sad.",
	"💬 You thought about journaling. That's emotional effort.",
	"🧘 Meditating for 17 seconds still counts. Technically.",
	"📦 Moving a task to tomorrow makes you a visionary.",
	"🖥️ Staring at your screen = digital mindfulness.",
	"🙃 Turning off notifications is radical rebellion.",
	"🛒 Buying snacks is emotional resource management.",
	"📸 Screenshotting your task list = progress backup.",
	"🦥 Slowness is underrated. So are sloths.",
	"🎧 Listening to lo-fi = ambient healing.",
	"🔁 Repeating mistakes = data collection.",
	"📕 Closing the laptop is setting boundaries.",
	"🚿 Shower thoughts = strategic planning.",
	"🧻 Crying in the bathroom is still movement."
];

// Emergency validation texts
const emergencyTexts = [
	{
		title: "Main Character Energy",
		lines: [
			"You are not a background character.",
			"You are the plot twist.",
			"The fire in the vending machine.",
			"The last brain cell refusing to die.",
			"The unpaid intern of destiny — and still doing the work.",
			"You didn't break today. That makes you legendary."
		]
	},
	{
		title: "Corporate Apocalypse",
		lines: [
			"The system was not designed for you to thrive.",
			"It was designed for people named Brad who eat kale and run marathons.",
			"And yet — YOU — exhausted, coffee-stained, emotionally taxed —",
			"You clicked.",
			"You dared to say: 'I'm still here.'",
			"And that's rebellion."
		]
	},
	{
		title: "Cosmic Validation",
		lines: [
			"Somewhere in the multiverse, there's a version of you who gave up.",
			"That version is crying and eating cereal.",
			"You?",
			"You installed a Chrome extension to keep going.",
			"And that is art.",
			"That is hope.",
			"That is the energy of the cosmos itself whispering:",
			"'Well done, you glorious mess.'"
		]
	},
	{
		title: "You Didn't Quit",
		lines: [
			"You woke up.",
			"You didn't delete everything.",
			"You didn't fake your own death.",
			"You didn't scream into a Google Doc.",
			"You. Just. Clicked.",
			"And for that — the entire ghost army of mildly tired ancestors thanks you."
		]
	},
	{
		title: "Disaster, but Make it Glamorous",
		lines: [
			"Sure, things are falling apart.",
			"But you? You're collapsing with style.",
			"With self-awareness.",
			"With dark-mode enabled and a sense of humor.",
			"That's power.",
			"That's Bare Minimum Heroism."
		]
	},
	{
		title: "The Passive Resister",
		lines: [
			"They wanted you to fail quietly.",
			"To ghost your to-do list.",
			"To vanish beneath unread Slack messages.",
			"But you…",
			"You opened this extension.",
			"You said, 'Not today, overwhelm.'",
			"That's not weakness. That's defiance.",
			"You are the duct tape holding this simulation together."
		]
	},
	{
		title: "Capitalism Can't Kill You (Today)",
		lines: [
			"Look at you.",
			"Not thriving. Not crushing it.",
			"But enduring.",
			"Outlasting deadlines.",
			"Ghosting burnout like a seasoned pro.",
			"You made it through another round of 'capitalism: the game'.",
			"You didn't win.",
			"But you didn't lose.",
			"And in this economy? That's elite."
		]
	},
	{
		title: "Tiny God of Minor Tasks",
		lines: [
			"You replied to one message.",
			"That email feared your energy.",
			"That microwave beep was your war drum.",
			"You are the god of 'almost',",
			"the titan of 'fine, I'll do it'.",
			"History may not remember this moment.",
			"But this extension does."
		]
	},
	{
		title: "The Anti-Flop Era",
		lines: [
			"Every cell in your body said: flop.",
			"But your finger said: 'tap this extension'.",
			"That's discipline.",
			"That's resilience.",
			"That's your flop era… denied.",
			"You're still upright. You're still sarcastic.",
			"That's how revolutions start."
		]
	},
	{
		title: "You're the Update",
		lines: [
			"The app didn't crash.",
			"You didn't crash.",
			"You didn't even rage-delete the group chat.",
			"You installed yourself into the day.",
			"That one action?",
			"That was the patch note.",
			"You're the update."
		]
	}
];

// Achievement texts
const emergencyAchievements = [
	"✨ Unlocked: Emergency Mode Activated — The Spiral is Official™",
	"🧠 Status: Emotionally Unstable, But Certified Functional",
	"🎉 Achievement: You Clicked Instead of Crying. Respect.",
	"🏆 Title Earned: Asked for Help Like a High-Functioning Disaster",
	"💫 Badge: Still Existing, Now with 8% More Grace",
	"🔥 Crisis Managed: Burnout Dodged by a Hair",
	"🛡️ Activated: Maximum Validation Shield Deployed",
	"🦝 Honorary Title: Commander of Controlled Chaos",
	"🌟 You Showed Up: The Universe Took Notes",
	"🎭 New Role: Master of Pretending Things Are Fine (and Pulling It Off)"
];

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

	// Display current date
	const today = new Date();
	const options = { weekday: 'long', day: 'numeric', month: 'long' };
	dateDisplay.textContent = today.toLocaleDateString('en-US', options);

	// Format date for comparison
	const dateString = today.toISOString().split('T')[0];

	// Load data from local storage
	const { lastClickDate, heroPoints = 0, lastQuote = '', lastEmergencyDate = '', lastTipIndex = -1 } =
		await chrome.storage.local.get(['lastClickDate', 'heroPoints', 'lastQuote', 'lastEmergencyDate', 'lastTipIndex']);

	// Update points counter
	pointsCount.textContent = heroPoints;
	updatePointComment(heroPoints);

	// Display a random tip
	displayRandomTip(lastTipIndex);

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

		// Get random quote
		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		// Add click animation
		barelyButton.classList.add('clicked');

		// Create confetti effect
		createConfetti();

		// Animate hero badge
		heroBadge.classList.add('celebrate');

		// Display quote and hide question with delay for better animation
		setTimeout(() => {
			quoteText.textContent = randomQuote;
			questionContainer.classList.add('hidden');
			quoteContainer.classList.remove('hidden');

			// Update points counter on page
			animatePointsCounter(heroPoints, newPoints);
			updatePointComment(newPoints);

			// Disable button
			barelyButton.disabled = true;
		}, 600);

		// Save data to local storage
		await chrome.storage.local.set({
			lastClickDate: dateString,
			heroPoints: newPoints,
			lastQuote: randomQuote
		});
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
	function createConfetti(count = 30, emergency = false) {
		const confettiContainer = document.createElement('div');
		confettiContainer.className = 'confetti-container';
		document.body.appendChild(confettiContainer);

		const colors = emergency
			? ['#e7906b', '#f6c177', '#7aa2f7', '#bb9af7', '#fff']
			: ['#7ca5bd', '#ddc199', '#e8dfca', '#5d7b93', '#fff'];

		for (let i = 0; i < count; i++) {
			const confetti = document.createElement('div');
			confetti.className = 'confetti';
			confetti.style.left = Math.random() * 100 + '%';
			confetti.style.width = (Math.random() * 8 + 5) + 'px';
			confetti.style.height = (Math.random() * 8 + 5) + 'px';
			confetti.style.animationDelay = Math.random() * 3 + 's';
			confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

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
}); 