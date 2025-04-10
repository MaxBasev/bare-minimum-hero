// Set up an alarm when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
	// Set up a daily reminder at 7:00 PM
	chrome.alarms.create('dailyReminder', {
		periodInMinutes: 24 * 60, // Every 24 hours
		when: getNextReminderTime()
	});

	// Also set up a daily streak check
	chrome.alarms.create('streakCheck', {
		periodInMinutes: 24 * 60, // Every 24 hours
		when: getStreakCheckTime()
	});
});

// Alarm handler
chrome.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name === 'dailyReminder') {
		// Check if the user has clicked the button today
		const today = new Date().toISOString().split('T')[0];
		const { lastClickDate } = await chrome.storage.local.get('lastClickDate');

		// If the user hasn't clicked the button today, show a notification
		if (lastClickDate !== today) {
			chrome.notifications.create({
				type: 'basic',
				iconUrl: 'images/icon128.png',
				title: 'Bare Minimum Hero',
				message: 'Reminder: If you even kind of tried today, log it. You earned it.',
				priority: 2
			});
		}
	} else if (alarm.name === 'streakCheck') {
		// Check if streak needs to be marked as broken
		await checkStreakStatus();
	}
});

// Function to get next reminder time (7:00 PM)
function getNextReminderTime() {
	const now = new Date();
	const reminderTime = new Date(now);

	reminderTime.setHours(19, 0, 0, 0); // 7:00 PM

	// If it's already past 7:00 PM, set the reminder for tomorrow
	if (now > reminderTime) {
		reminderTime.setDate(reminderTime.getDate() + 1);
	}

	return reminderTime.getTime();
}

// Function to get streak check time (midnight)
function getStreakCheckTime() {
	const now = new Date();
	const checkTime = new Date(now);

	// Set to midnight (start of next day)
	checkTime.setHours(0, 5, 0, 0); // 00:05 AM
	checkTime.setDate(checkTime.getDate() + 1);

	return checkTime.getTime();
}

// Function to check if streak is broken
async function checkStreakStatus() {
	// Get current data
	const { lastClickDate, currentStreak, streakBroken } =
		await chrome.storage.local.get(['lastClickDate', 'currentStreak', 'streakBroken']);

	// If streak is already marked as broken or no streak exists, no need to check
	if (streakBroken || currentStreak <= 0 || !lastClickDate) return;

	// Get today's date
	const today = new Date();
	const dateString = today.toISOString().split('T')[0];

	// Get yesterday's date
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayString = yesterday.toISOString().split('T')[0];

	// If last click wasn't today or yesterday, mark streak as broken
	if (lastClickDate !== dateString && lastClickDate !== yesterdayString) {
		await chrome.storage.local.set({ streakBroken: true });

		// Notify user that streak is broken
		chrome.notifications.create({
			type: 'basic',
			iconUrl: 'images/icon128.png',
			title: 'Streak Update',
			message: 'Your streak has been paused. Come back to reset it with dignity.',
			priority: 2
		});
	}
} 