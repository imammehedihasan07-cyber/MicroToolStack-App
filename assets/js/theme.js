// Simple Pure Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

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
