window.ThemeManager = window.ThemeManager || {};

// Universal Auto Injector
document.addEventListener('DOMContentLoaded', () => {
    // Inject Header if container exists, or create one at the top of body
    let headerContainer = document.getElementById('header-container');
    if (!headerContainer) {
        headerContainer = document.createElement('div');
        headerContainer.id = 'header-container';
        document.body.insertBefore(headerContainer, document.body.firstChild);
    }

    const currentTheme = localStorage.getItem('theme') || 'light';
    const initialLogo = currentTheme === 'light' ? '/assets/images/logo-black.png' : '/assets/images/logo-white.png';

    headerContainer.innerHTML = `
        <header class="custom-header">
            <a href="/" class="custom-logo">
                <img id="app-logo" src="${initialLogo}" alt="MicroToolStack Logo" style="height: 38px; width: auto; display: block;" onerror="this.onerror=null; this.src='/assets/images/logo-white.png';">
            </a>
            <nav class="custom-nav">
                <a href="/#categories">Categories</a>
                <a href="/about.html">About</a>
                <a href="/contact.html">Contact</a>
                <button id="theme-toggle" class="custom-theme-btn" aria-label="Toggle Theme">${currentTheme === 'light' ? '☀️' : '🌙'}</button>
            </nav>
        </header>
    `;

    applyTheme(currentTheme);
});

// Live Theme Switcher
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.innerText = theme === 'light' ? '☀️' : '🌙';
    }

    const logoImg = document.getElementById('app-logo');
    if (logoImg) {
        logoImg.src = theme === 'light' ? '/assets/images/logo-black.png' : '/assets/images/logo-white.png';
    }
}

// Global Click Event for Instant Theme Change
document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('#theme-toggle, .custom-theme-btn');
    if (toggleBtn) {
        const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = activeTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }
});

// Load theme state immediately before DOM finishes
const initialSavedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', initialSavedTheme);
