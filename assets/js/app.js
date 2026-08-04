// App Logic (Share, Coffee Widget, Favorites & Service Worker)
document.addEventListener("DOMContentLoaded", function() {
    loadToolWidgets();
    initFavoriteButton();
    renderFavoriteToolsOnHome();

    // Safe Service Worker Register
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
});

// Load Buy Me A Coffee & Share Button
function loadToolWidgets() {
    const isToolPage = window.location.pathname.includes('/tools/') || 
                       document.querySelector('.calculator-card') || 
                       document.querySelector('.card');

    if (isToolPage && !document.querySelector('#dynamic-widget-box')) {
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'dynamic-widget-box';
        widgetContainer.style.cssText = "text-align: center; margin: 30px auto; padding: 20px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px dashed var(--border-color, #333); max-width: 550px;";

        widgetContainer.innerHTML = `
            <div style="margin-bottom: 15px;">
                <p style="font-size: 13px; color: var(--text-muted, #a1a1aa); margin-bottom: 8px; font-family: sans-serif;">
                    Did this tool save your time? Support MicroToolStack ☕
                </p>
                <a href="https://www.buymeacoffee.com/microtoolstack" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 38px !important; width: 140px !important;">
                </a>
            </div>

            <div style="border-top: 1px solid var(--border-color, #333); margin-top: 15px; padding-top: 15px;">
                <button id="shareToolBtn" onclick="shareCurrentTool()" style="background: #3b82f6; color: #ffffff; border: none; padding: 9px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 6px;">
                    🔗 Share This Tool
                </button>
            </div>
        `;

        const targetContainer = document.querySelector('main') || 
                                document.querySelector('.calculator-card')?.parentElement || 
                                document.querySelector('.card')?.parentElement || 
                                document.body;

        targetContainer.appendChild(widgetContainer);
    }
}

// Share Tool Function
function shareCurrentTool() {
    const title = document.title || "Check out this useful tool!";
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(() => {});
    } else {
        navigator.clipboard.writeText(url).then(() => {
            alert("Tool link copied to clipboard! 📋");
        }).catch(() => {
            alert("Tool link copied to clipboard! 📋");
        });
    }
}

// Favorite Tools Logic
function initFavoriteButton() {
    const isToolPage = window.location.pathname.includes('/tools/');
    if (!isToolPage) return;

    const titleElement = document.querySelector('h1');
    if (!titleElement || document.querySelector('#favBtn')) return;

    const currentUrl = window.location.pathname;
    let favorites = JSON.parse(localStorage.getItem('fav_tools') || '[]');
    const isFav = favorites.includes(currentUrl);

    const favBtn = document.createElement('button');
    favBtn.id = 'favBtn';
    favBtn.style.cssText = "margin-left: 12px; font-size: 14px; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border-color, #444); background: rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s; vertical-align: middle; color: var(--text-color, #fff);";
    favBtn.innerHTML = isFav ? "❤️ Saved" : "🤍 Favorite";

    if (isFav) favBtn.style.borderColor = "#ef4444";

    favBtn.onclick = function() {
        let favs = JSON.parse(localStorage.getItem('fav_tools') || '[]');
        if (favs.includes(currentUrl)) {
            favs = favs.filter(url => url !== currentUrl);
            favBtn.innerHTML = "🤍 Favorite";
            favBtn.style.borderColor = "var(--border-color, #444)";
        } else {
            favs.push(currentUrl);
            favBtn.innerHTML = "❤️ Saved";
            favBtn.style.borderColor = "#ef4444";
        }
        localStorage.setItem('fav_tools', JSON.stringify(favs));
    };

    titleElement.appendChild(favBtn);
}

// Display Favorite Tools Section on Homepage
function renderFavoriteToolsOnHome() {
    const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    if (!isHomepage) return;

    const favorites = JSON.parse(localStorage.getItem('fav_tools') || '[]');
    if (favorites.length === 0) return;

    fetch('/data/tools.json')
        .then(res => res.json())
        .then(tools => {
            const favTools = tools.filter(tool => favorites.includes(tool.url));
            if (favTools.length === 0) return;

            let favSection = document.querySelector('#favorite-tools-section');
            if (!favSection) {
                favSection = document.createElement('section');
                favSection.id = 'favorite-tools-section';
                favSection.style.cssText = "margin: 2rem 0; padding: 1.5rem; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px;";

                const container = document.querySelector('.container') || document.body;
                container.insertBefore(favSection, container.firstChild);
            }

            let cardsHTML = favTools.map(tool => `
                <div class="tool-card" style="padding: 12px; background: var(--bg-card, #1e1e2e); border-radius: 8px; border: 1px solid var(--border-color, #333);">
                    <a href="${tool.url}" style="text-decoration: none; color: inherit;">
                        <h4 style="margin: 0 0 6px 0;">${tool.icon || '🛠️'} ${tool.name}</h4>
                        <p style="font-size: 12px; color: var(--text-muted, #a1a1aa); margin: 0;">${tool.description}</p>
                    </a>
                </div>
            `).join('');

            favSection.innerHTML = `
                <h3 style="margin-top:0; color: #ef4444;">❤️ Your Favorite Tools</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; margin-top: 12px;">
                    ${cardsHTML}
                </div>
            `;
        }).catch(() => {});
}
