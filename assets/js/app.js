// Dynamic Buy Me a Coffee & Share Button Script
document.addEventListener("DOMContentLoaded", function() {
    // Determine if the current page is a tool page
    const isToolPage = window.location.pathname.includes('/tools/') || 
                       document.querySelector('.card') || 
                       document.querySelector('.calculator-card') || 
                       document.querySelector('form');
    
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
});

// Share Functionality (Works on Mobile Native Share & Desktop Clipboard)
function shareCurrentTool() {
    const title = document.title || "Check out this useful tool!";
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(function(err) {
            // User cancelled share or encountered error
        });
    } else {
        navigator.clipboard.writeText(url).then(function() {
            alert("Tool link copied to clipboard! 📋");
        }).catch(function() {
            // Fallback for older browsers
            const dummyInput = document.createElement('input');
            document.body.appendChild(dummyInput);
            dummyInput.value = url;
            dummyInput.select();
            document.execCommand('copy');
            document.body.removeChild(dummyInput);
            alert("Tool link copied to clipboard! 📋");
        });
    }
// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

