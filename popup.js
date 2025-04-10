import quotes from './quotes.js';

document.addEventListener('DOMContentLoaded', async () => {
	// Получаем элементы DOM
	const dateDisplay = document.getElementById('date-display');
	const barelyButton = document.getElementById('barely-button');
	const questionContainer = document.getElementById('question-container');
	const quoteContainer = document.getElementById('quote-container');
	const quoteText = document.getElementById('quote-text');
	const pointsCount = document.getElementById('points-count');
	const pointComment = document.getElementById('point-comment');

	// Отображаем текущую дату
	const today = new Date();
	const options = { weekday: 'long', day: 'numeric', month: 'long' };
	dateDisplay.textContent = today.toLocaleDateString('ru-RU', options);

	// Форматируем дату для сравнения
	const dateString = today.toISOString().split('T')[0];

	// Загружаем данные из локального хранилища
	const { lastClickDate, heroPoints = 0, lastQuote = '' } = await chrome.storage.local.get(['lastClickDate', 'heroPoints', 'lastQuote']);

	// Обновляем счетчик очков
	pointsCount.textContent = heroPoints;
	updatePointComment(heroPoints);

	// Проверяем, нажимал ли пользователь кнопку сегодня
	if (lastClickDate === dateString) {
		// Пользователь уже нажимал кнопку сегодня
		barelyButton.disabled = true;
		quoteText.textContent = lastQuote;
		questionContainer.classList.add('hidden');
		quoteContainer.classList.remove('hidden');
	}

	// Обработчик клика по кнопке
	barelyButton.addEventListener('click', async () => {
		// Увеличиваем счетчик очков
		const newPoints = heroPoints + 1;

		// Получаем случайную фразу
		const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

		// Отображаем цитату и скрываем вопрос
		quoteText.textContent = randomQuote;
		questionContainer.classList.add('hidden');
		quoteContainer.classList.remove('hidden');

		// Обновляем счетчик очков на странице
		pointsCount.textContent = newPoints;
		updatePointComment(newPoints);

		// Блокируем кнопку
		barelyButton.disabled = true;

		// Сохраняем данные в локальное хранилище
		await chrome.storage.local.set({
			lastClickDate: dateString,
			heroPoints: newPoints,
			lastQuote: randomQuote
		});
	});

	// Функция для обновления комментария к очкам
	function updatePointComment(points) {
		if (points === 0) {
			pointComment.textContent = '(starting from zero)';
		} else if (points < 5) {
			pointComment.textContent = '(it\'s a start)';
		} else if (points < 10) {
			pointComment.textContent = '(not bad)';
		} else if (points < 20) {
			pointComment.textContent = '(impressive consistency)';
		} else if (points < 50) {
			pointComment.textContent = '(dedication to mediocrity)';
		} else {
			pointComment.textContent = '(not bad tbh)';
		}
	}
}); 