/**
 * MicroToolStack Theme Manager
 * Handles:
 * - Instant theme initialization
 * - Dark / Light mode
 * - localStorage persistence
 * - Theme toggle button
 * - Logo switching
 */

window.ThemeManager = window.ThemeManager || {};

/* =========================================================
   1. GET SAVED THEME
   ========================================================= */

function getSavedTheme() {
    try {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }
    } catch (error) {
        console.warn('Unable to read saved theme:', error);
    }

    // MicroToolStack default theme
    return 'dark';
}


/* =========================================================
   2. SAVE THEME
   ========================================================= */

function saveTheme(theme) {
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.warn('Unable to save theme:', error);
    }
}


/* =========================================================
   3. APPLY THEME
   ========================================================= */

function applyTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
        theme = 'dark';
    }

    const root = document.documentElement;

    // Set main theme attribute
    root.setAttribute('data-theme', theme);

    // Keep dark class synchronized
    root.classList.toggle('dark', theme === 'dark');

    // Update theme toggle buttons
    const toggleButtons = document.querySelectorAll(
        '#theme-toggle, .custom-theme-btn'
    );

    toggleButtons.forEach((button) => {
        button.textContent = theme === 'dark' ? '☀️' : '🌙';

        button.setAttribute(
            'aria-label',
            theme === 'dark'
                ? 'Switch to light theme'
                : 'Switch to dark theme'
        );

        button.setAttribute(
            'aria-pressed',
            theme === 'dark' ? 'true' : 'false'
        );
    });

    // Update MicroToolStack logo
    const logos = document.querySelectorAll(
        '#app-logo, .custom-logo img'
    );

    const logoPath =
        theme === 'dark'
            ? '/assets/images/logo-white.png'
            : '/assets/images/logo-black.png';

    logos.forEach((logo) => {
        if (logo.src !== window.location.origin + logoPath) {
            logo.src = logoPath;
        }
    });

    return theme;
}


/* =========================================================
   4. INSTANT INITIAL THEME
   IMPORTANT:
   This runs immediately before page rendering
   to reduce light/dark flash.
   ========================================================= */

(function initializeThemeImmediately() {
    const initialTheme = getSavedTheme();

    const root = document.documentElement;

    root.setAttribute('data-theme', initialTheme);
    root.classList.toggle('dark', initialTheme === 'dark');
})();


/* =========================================================
   5. THEME TOGGLE
   ========================================================= */

function toggleTheme() {
    const currentTheme =
        document.documentElement.getAttribute('data-theme') || 'dark';

    const newTheme =
        currentTheme === 'dark'
            ? 'light'
            : 'dark';

    saveTheme(newTheme);
    applyTheme(newTheme);

    // Optional custom event for other scripts
    window.dispatchEvent(
        new CustomEvent('microtoolstack:themechange', {
            detail: {
                theme: newTheme
            }
        })
    );
}


/* =========================================================
   6. INITIALIZE THEME SYSTEM
   ========================================================= */

function initThemeToggle() {
    /*
     * IMPORTANT:
     * Only theme.js handles #theme-toggle.
     *
     * app.js must NOT add another theme click listener.
     */

    if (window.ThemeManager._themeListenerInitialized) {
        return;
    }

    document.addEventListener('click', function (event) {
        const toggleButton = event.target.closest(
            '#theme-toggle, .custom-theme-btn'
        );

        if (!toggleButton) {
            return;
        }

        event.preventDefault();

        toggleTheme();
    });

    window.ThemeManager._themeListenerInitialized = true;
}


/* =========================================================
   7. INITIAL DOM SYNC
   ========================================================= */

function syncThemeAfterDOMReady() {
    const currentTheme = getSavedTheme();

    applyTheme(currentTheme);
}


/* =========================================================
   8. FAVORITES SYSTEM
   ========================================================= */

function initFavorites() {
    const toolHeader =
        document.querySelector('.hero h1') ||
        document.querySelector('h1');

    if (!toolHeader) {
        return;
    }

    // Don't add favorite button to homepage
    if (
        window.location.pathname === '/' ||
        window.location.pathname === '/index.html'
    ) {
        return;
    }

    const currentPath = window.location.pathname;

    let favorites = [];

    try {
        favorites = JSON.parse(
            localStorage.getItem('favorite_tools') || '[]'
        );
    } catch (error) {
        favorites = [];
    }

    let isFavorite = favorites.includes(currentPath);

    // Avoid duplicate button
    if (document.getElementById('fav-btn')) {
        return;
    }

    const favoriteButton = document.createElement('button');

    favoriteButton.id = 'fav-btn';
    favoriteButton.className = 'btn btn-secondary';

    favoriteButton.style.cssText = `
        font-size: 0.85rem;
        padding: 0.3rem 0.75rem;
        margin-left: 10px;
        border-radius: 20px;
        cursor: pointer;
        vertical-align: middle;
    `;

    updateFavoriteButton(
        favoriteButton,
        isFavorite
    );

    favoriteButton.addEventListener('click', function () {
        try {
            favorites = JSON.parse(
                localStorage.getItem('favorite_tools') || '[]'
            );
        } catch (error) {
            favorites = [];
        }

        if (favorites.includes(currentPath)) {
            favorites = favorites.filter(
                (path) => path !== currentPath
            );

            isFavorite = false;
        } else {
            favorites.push(currentPath);

            isFavorite = true;
        }

        try {
            localStorage.setItem(
                'favorite_tools',
                JSON.stringify(favorites)
            );
        } catch (error) {
            console.warn(
                'Unable to save favorite:',
                error
            );
        }

        updateFavoriteButton(
            favoriteButton,
            isFavorite
        );
    });

    toolHeader.appendChild(favoriteButton);
}


/* =========================================================
   9. UPDATE FAVORITE BUTTON
   ========================================================= */

function updateFavoriteButton(button, isFavorite) {
    button.innerHTML = isFavorite
        ? '❤️ Favorited'
        : '🤍 Add Favorite';

    button.style.borderColor = isFavorite
        ? '#ef4444'
        : 'var(--border-color)';

    button.style.color = isFavorite
        ? '#ef4444'
        : 'var(--text-primary)';
}


/* =========================================================
   10. GLOBAL SHARE
   ========================================================= */

window.shareCurrentPage = function () {
    const pageUrl = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: pageUrl
        }).catch(() => {});
    } else if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {
        navigator.clipboard
            .writeText(pageUrl)
            .then(() => {
                alert('Page link copied to clipboard!');
            })
            .catch(() => {
                alert('Unable to copy page link.');
            });
    } else {
        alert('Sharing is not supported in this browser.');
    }
};


/* =========================================================
   11. DOM READY
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    // Initialize ONE theme listener
    initThemeToggle();

    /*
     * app.js injects the header.
     * Therefore we apply the theme after DOM elements exist.
     */
    syncThemeAfterDOMReady();

    // Favorites
    initFavorites();
});


/* =========================================================
   12. PUBLIC THEME MANAGER API
   ========================================================= */

window.ThemeManager.getTheme = function () {
    return (
        document.documentElement.getAttribute('data-theme') ||
        getSavedTheme()
    );
};

window.ThemeManager.setTheme = function (theme) {
    if (theme !== 'light' && theme !== 'dark') {
        return;
    }

    saveTheme(theme);
    applyTheme(theme);
};

window.ThemeManager.toggle = function () {
    toggleTheme();
};

window.ThemeManager.apply = function (theme) {
    applyTheme(theme);
};
