window.ThemeManager = window.ThemeManager || {};

// Set initial theme state instantly to prevent white/dark flashing
(function() {
    var savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    initFavorites();
    initThemeToggle();
});

// Render Header Navbar with Exact Dimensions (Fixes CLS Issue)
function renderNavbar() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    const initialLogo = currentTheme === 'light' ? '/assets/images/logo-black.png' : '/assets/images/logo-white.png';

    headerContainer.innerHTML = `
        <header class="custom-header">
            <a href="/" class="custom-logo">
                <img id="app-logo" src="${initialLogo}" alt="MicroToolStack Logo" width="160" height="38" style="height: 38px; width: auto; display: block;" onerror="this.onerror=null; this.src='/assets/images/logo-white.png';">
            </a>
            <nav class="custom-nav">
                <a href="/#categories">Categories</a>
                <a href="/about.html">About</a>
                <a href="/contact.html">Contact</a>
                <button id="theme-toggle" class="custom-theme-btn" aria-label="Toggle Theme">${currentTheme === 'dark' ? '☀️' : '🌙'}</button>
            </nav>
        </header>
    `;
}

// Render Footer
function renderFooter() {
    const footerContainer = document.getElementById('footer-container');
    
    const footerHTML = `
        <footer class="custom-footer">
            <div class="footer-actions">
                <a href="https://www.buymeacoffee.com/microtoolstack" target="_blank" rel="noopener noreferrer" class="coffee-btn">
                    <span>☕</span> Buy me a coffee
                </a>

                <button onclick="shareCurrentPage()" class="share-btn">
                    <span>🔗</span> Share
                </button>
            </div>

            <p class="footer-copy">© ${new Date().getFullYear()} MicroToolStack. All rights reserved.</p>
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
    favBtn.className = 'btn btn-secondary';
    favBtn.style.cssText = 'font-size: 0.85rem; padding: 0.3rem 0.75rem; margin-left: 10px; border-radius: 20px; cursor: pointer;';
    
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
    btn.style.borderColor = isFav ? '#ef4444' : 'var(--border-color)';
    btn.style.color = isFav ? '#ef4444' : 'var(--text-primary)';
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

// Theme Toggle Event Delegation
function initThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#theme-toggle, .custom-theme-btn');
        if (toggleBtn) {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        }
    });
}

// Global Apply Theme Function (Handling Image Switch & Exact Dimension Preservation)
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const logoImg = document.getElementById('app-logo') || document.querySelector('.custom-logo img');
    const toggleBtn = document.getElementById('theme-toggle');

    if (toggleBtn) {
        toggleBtn.innerText = theme === 'dark' ? '☀️' : '🌙';
    }

    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        if (logoImg) logoImg.src = '/assets/images/logo-white.png';
    } else {
        document.documentElement.classList.remove('dark');
        if (logoImg) logoImg.src = '/assets/images/logo-black.png';
    }
}
