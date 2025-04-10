// Set up an alarm when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
	// Set up a daily reminder at 7:00 PM
	chrome.alarms.create('dailyReminder', {
		periodInMinutes: 24 * 60, // Every 24 hours
		when: getNextReminderTime()
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
	}
});

// Get the time for the next reminder (7:00 PM)
function getNextReminderTime() {
	const now = new Date();
	const reminderTime = new Date(now);

	reminderTime.setHours(19, 0, 0, 0);

	// If it's already past 7:00 PM, schedule for tomorrow
	if (now > reminderTime) {
		reminderTime.setDate(reminderTime.getDate() + 1);
	}

	return reminderTime.getTime();
} 