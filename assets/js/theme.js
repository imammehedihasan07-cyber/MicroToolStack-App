window.ThemeManager = window.ThemeManager || {};

// Dynamic Header, Footer, Favorites & Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    initFavorites();
    initThemeToggle();
});

// Render Header Navbar with Brand Image Logo
function renderNavbar() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
        <header class="custom-header">
            <a href="/" class="custom-logo">
                <img src="/assets/images/logo-white.png" alt="MicroToolStack Logo" style="height: 38px; width: auto; display: block;">
            </a>
            <nav class="custom-nav">
                <a href="/#categories">Categories</a>
                <a href="/about.html">About</a>
                <a href="/contact.html">Contact</a>
                <button id="theme-toggle" class="custom-theme-btn" aria-label="Toggle Theme">🌙</button>
            </nav>
        </header>
    `;
}

// Render Footer with Buy Me a Coffee & Share
function renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    
    const footerHTML = `
        <footer style="margin-top: 3rem; padding: 2rem 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; background-color: rgba(0, 0, 0, 0.2);">
            <div style="display: flex; gap: 1rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-bottom: 1.5rem;">
                <a href="https://www.buymeacoffee.com/microtoolstack" target="_blank" rel="noopener noreferrer" style="background-color: #FFDD00; color: #000; font-weight: 600; font-size: 0.9rem; padding: 0.65rem 1.25rem; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
                    <span>☕</span> Buy me a coffee
                </a>

                <button onclick="shareCurrentPage()" style="background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); font-weight: 500; font-size: 0.9rem; padding: 0.65rem 1.25rem; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem;">
                    <span>🔗</span> Share
                </button>
            </div>

            <p style="color: #a1a1aa; font-size: 0.875rem; margin: 0;">© ${new Date().getFullYear()} MicroToolStack. All rights reserved.</p>
        </footer>
    `;

    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    } else {
        const main = document.querySelector('main') || document.body;
        const footerDiv = document.createElement('div');
        footerDiv.innerHTML = footerHTML;
        main.appendChild(footerDiv);
    }
}

// Favorite System Logic
function initFavorites() {
    const toolHeader = document.querySelector('.hero h1') || document.querySelector('h1');
    if (!toolHeader || window.location.pathname === '/' || window.location.pathname === '/index.html') return;

    const currentPath = window.location.pathname;
    let favorites = JSON.parse(localStorage.getItem('favorite_tools') || '[]');
    let isFav = favorites.includes(currentPath);

    const favBtn = document.createElement('button');
    favBtn.id = 'fav-btn';
    favBtn.style.cssText = 'background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; font-size: 0.9rem; padding: 0.4rem 0.8rem; border-radius: 20px; cursor: pointer; margin-left: 10px; vertical-align: middle; display: inline-flex; align-items: center; gap: 5px;';
    
    updateFavBtn(favBtn, isFav);

    favBtn.onclick = () => {
        favorites = JSON.parse(localStorage.getItem('favorite_tools') || '[]');
        if (favorites.includes(currentPath)) {
            favorites = favorites.filter(path => path !== currentPath);
            isFav = false;
        } else {
            favorites.push(currentPath);
            isFav = true;
        }
        localStorage.setItem('favorite_tools', JSON.stringify(favorites));
        updateFavBtn(favBtn, isFav);
    };

    toolHeader.appendChild(favBtn);
}

function updateFavBtn(btn, isFav) {
    btn.innerHTML = isFav ? '❤️ Favorited' : '🤍 Add Favorite';
    btn.style.borderColor = isFav ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
    btn.style.color = isFav ? '#ef4444' : '#ffffff';
}

// Global Share Logic
window.shareCurrentPage = function() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Page link copied to clipboard!');
    }
};

// Theme Toggle Logic
function initThemeToggle() {
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
