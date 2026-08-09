window.ThemeManager = window.ThemeManager || {};

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    initFavorites();
    initThemeToggle();
});

// Render Header Navbar
function renderNavbar() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) return;

    headerContainer.innerHTML = `
        <header class="custom-header">
            <a href="/" class="custom-logo">
                <img src="/assets/images/logo-white.png" alt="MicroToolStack Logo">
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
    favBtn.style.cssText = 'font-size: 0.85rem; padding: 0.3rem 0.75rem; margin-left: 10px; border-radius: 20px;';
    
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

// Theme Toggle Logic
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    applyTheme(savedTheme);

    if (toggleBtn) {
        toggleBtn.innerText = savedTheme === 'dark' ? '☀️' : '🌙';

        toggleBtn.onclick = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.innerText = newTheme === 'dark' ? '☀️' : '🌙';
        };
    }
}

// Global Apply Theme Function (Handling Image Switch)
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const logoImg = document.querySelector('.custom-logo img');

    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        if (logoImg) logoImg.src = '/assets/images/logo-white.png';
    } else {
        document.documentElement.classList.remove('dark');
        if (logoImg) logoImg.src = '/assets/images/logo-black.png';
    }
}
