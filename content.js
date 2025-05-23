function createVipButton() {
    // Находим контейнер с кнопкой "Буду смотреть"
    const watchingButton = document.querySelector('button[title="Буду смотреть"]');
    if (watchingButton) {
        // Создаём кнопку VIP
        const vipButton = document.createElement('button');
        vipButton.className = 'vip-button';
        vipButton.textContent = 'Смотреть на VIP';
        vipButton.style.marginTop = '16px';
        vipButton.style.width = '100%';
        vipButton.addEventListener('click', () => {
            const currentUrl = window.location.href;
            const vipUrl = currentUrl.replace('.ru', '.vip');
            window.location.href = vipUrl;
        });
        // Вставляем кнопку после "Буду смотреть"
        watchingButton.parentElement.parentElement.parentElement.appendChild(vipButton);
    }
}

window.addEventListener('load', createVipButton); 