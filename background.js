// Устанавливаем будильник при первом запуске
chrome.runtime.onInstalled.addListener(() => {
	// Устанавливаем ежедневное напоминание в 19:00
	chrome.alarms.create('dailyReminder', {
		periodInMinutes: 24 * 60, // Каждые 24 часа
		when: getNextReminderTime()
	});
});

// Обработчик будильника
chrome.alarms.onAlarm.addListener(async (alarm) => {
	if (alarm.name === 'dailyReminder') {
		// Проверяем, нажал ли пользователь кнопку сегодня
		const today = new Date().toISOString().split('T')[0];
		const { lastClickDate } = await chrome.storage.local.get('lastClickDate');

		// Если пользователь еще не нажимал кнопку сегодня, показываем уведомление
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

// Получаем время для следующего напоминания (19:00)
function getNextReminderTime() {
	const now = new Date();
	const reminderTime = new Date(now);

	reminderTime.setHours(19, 0, 0, 0);

	// Если сейчас уже позже 19:00, переносим на завтра
	if (now > reminderTime) {
		reminderTime.setDate(reminderTime.getDate() + 1);
	}

	return reminderTime.getTime();
} 