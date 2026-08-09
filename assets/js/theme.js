window.ThemeManager = window.ThemeManager || {};

// Dynamic Theme & Logo Manager
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update Theme Toggle Buttons
    const toggleBtns = document.querySelectorAll('#theme-toggle, .custom-theme-btn');
    toggleBtns.forEach(btn => {
        btn.innerText = theme === 'light' ? '☀️' : '🌙';
    });

    // Fix Logo Image Path explicitly for sub-folder tools
    const logoImg = document.getElementById('app-logo') || document.querySelector('.custom-logo img');
    if (logoImg) {
        const rootPath = window.location.origin;
        logoImg.src = theme === 'light' 
            ? `${rootPath}/assets/images/logo-black.png` 
            : `${rootPath}/assets/images/logo-white.png`;
    }
}

// Global Instant Click Handler
document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('#theme-toggle, .custom-theme-btn');
    if (toggleBtn) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }
});

// Run Immediately to prevent light/dark glitch
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Re-apply Theme after DOM & Navbar completes loading
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
});
