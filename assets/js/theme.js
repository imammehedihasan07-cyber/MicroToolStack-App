// Theme Toggle & Dynamic Navbar Renderer
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    initThemeToggle();
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

    // Re-bind click event to the newly rendered toggle button
    initThemeToggle();
}

function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply saved theme to HTML tag
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (toggleBtn) {
        toggleBtn.innerText = currentTheme === 'light' ? '☀️' : '🌙';

        toggleBtn.onclick = () => {
            let activeTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = activeTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.innerText = newTheme === 'light' ? '☀️' : '🌙';
        };
    }
}
