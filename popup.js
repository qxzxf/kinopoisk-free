document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchKinopoiskBtn = document.getElementById('searchKinopoisk');
    const searchVIPBtn = document.getElementById('searchVIP');
    const searchResults = document.getElementById('searchResults');

    // Функция для проверки, является ли строка числом (ID фильма)
    function isFilmId(str) {
        return /^\d+$/.test(str.trim());
    }

    // Функция для показа уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Функция для отображения результатов поиска
    function displaySearchResults(films) {
        searchResults.innerHTML = '';
        searchResults.classList.add('active');

        if (films.length === 0) {
            searchResults.innerHTML = '<div class="loading">Фильмы не найдены</div>';
            return;
        }

        films.forEach(film => {
            const filmElement = document.createElement('div');
            filmElement.className = 'film-item';
            filmElement.innerHTML = `
                <img class="film-poster" src="${film.posterUrl || 'https://via.placeholder.com/50x75'}" alt="${film.name}">
                <div class="film-info">
                    <div class="film-title">${film.name}</div>
                    <div class="film-year">${film.year}</div>
                </div>
            `;

            filmElement.addEventListener('click', () => {
                const vipUrl = `https://www.kinopoisk.vip/film/${film.id}`;
                chrome.tabs.create({ url: vipUrl });
            });

            searchResults.appendChild(filmElement);
        });
    }

    // Функция для поиска фильмов
    async function searchFilms(query) {
        searchResults.innerHTML = '<div class="loading">Поиск фильмов...</div>';
        searchResults.classList.add('active');

        try {
            const apiUrl = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(query)}`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-API-KEY': 'YOUR_API_KEY',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при получении данных');
            }

            const data = await response.json();
            
            // Преобразуем данные в нужный формат
            const films = data.films.map(film => ({
                id: film.filmId,
                name: film.nameRu || film.nameEn,
                year: film.year,
                posterUrl: film.posterUrlPreview
            }));

            displaySearchResults(films);
        } catch (error) {
            console.error('Ошибка поиска:', error);
            showNotification('Ошибка при поиске фильмов');
            searchResults.innerHTML = '';
        }
    }

    // Функция для поиска на Кинопоиске
    searchKinopoiskBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            searchFilms(query);
        }
    });

    // Функция для поиска на VIP
    searchVIPBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            if (isFilmId(query)) {
                const searchUrl = `https://www.kinopoisk.vip/film/${query}`;
                chrome.tabs.create({ url: searchUrl });
            } else {
                showNotification('Для поиска на VIP введите ID фильма (только цифры)');
            }
        }
    });

    // Обработка Enter в поле ввода
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchFilms(query);
            }
        }
    });

    // Очистка результатов при фокусе на поле ввода
    searchInput.addEventListener('focus', function() {
        searchResults.classList.remove('active');
    });
}); 