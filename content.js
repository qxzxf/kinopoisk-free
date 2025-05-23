function createWatchButton() {
    const button = document.createElement('button');
    button.className = 'kinopoisk-vip-button';
    button.textContent = 'Смотреть на vip';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    
    button.addEventListener('click', () => {
        const currentUrl = window.location.href;
        const vipUrl = currentUrl.replace('.ru', '.vip');
        window.location.href = vipUrl;
    });

    document.body.appendChild(button);
}

// Запускаем функцию после полной загрузки страницы
window.addEventListener('load', createWatchButton); 