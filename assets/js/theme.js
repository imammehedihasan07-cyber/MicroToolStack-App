// Dynamic Navbar & Theme Toggle Logic

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
});

function renderNavbar() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
        <header class="navbar">
            <div class="nav-container">
                <a href="/" class="logo">
                    <span class="logo-icon">⚡</span>
                    <span class="logo-text">MicroToolStack</span>
                </a>
                <nav class="nav-links">
                    <a href="/#categories">Categories</a>
                    <a href="/about.html">About</a>
                    <a href="/contact.html">Contact</a>
                </nav>
                <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme">🌙</button>
            </div>
        </header>
    `;

    // Initialize Theme Switcher after Header DOM is inserted
    initThemeToggle();
}

function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.setAttribute('data-theme', currentTheme);

    if (toggleBtn) {
        toggleBtn.innerText = currentTheme === 'light' ? '☀️' : '🌙';
        
        toggleBtn.onclick = () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.innerText = newTheme === 'light' ? '☀️' : '🌙';
        };
    }
}
