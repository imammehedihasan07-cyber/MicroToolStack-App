window.ThemeManager = window.ThemeManager || {};

// Function to apply theme & change logo/button icons
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update toggle buttons
    const toggleBtns = document.querySelectorAll('#theme-toggle, .custom-theme-btn');
    toggleBtns.forEach(btn => {
        btn.innerText = theme === 'light' ? '☀️' : '🌙';
    });

    // Update logo according to exact file name in your repo
    const logoImg = document.getElementById('app-logo') || document.querySelector('.custom-logo img');
    if (logoImg) {
        logoImg.src = theme === 'light' ? '/assets/images/logo-black.png' : '/assets/images/logo-white.png';
    }
}

// Global click event for instant theme switching without page refresh
document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('#theme-toggle, .custom-theme-btn');
    if (toggleBtn) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }
});

// Set theme immediately on load
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});
