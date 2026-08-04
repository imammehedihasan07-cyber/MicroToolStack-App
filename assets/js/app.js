/**
 * Application Entry Point & Dynamic Layout Component Loader
 */

// Helper to inject HTML components dynamically
async function loadComponent(elementId, filepath) {
  const target = document.getElementById(elementId);
  if (!target) return;

  try {
    const res = await fetch(filepath);
    if (res.ok) {
      target.innerHTML = await res.text();
    }
  } catch (err) {
    console.error(`Failed to load component: ${filepath}`, err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Load Layout Components
  await loadComponent('header-container', '/components/header.html');
  await loadComponent('navbar-container', '/components/navbar.html');
  await loadComponent('footer-container', '/components/footer.html');

  // Re-sync Theme Manager Buttons after Header Injection
  if (window.ThemeManager) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    window.ThemeManager.updateToggleButtons(currentTheme);
  }

  // Mobile Menu Toggle Event Listener
  document.addEventListener('click', (e) => {
    const menuBtn = e.target.closest('#mobile-menu-btn');
    if (menuBtn) {
      const navMenu = document.getElementById('nav-menu');
      if (navMenu) {
        navMenu.classList.toggle('active');
      }
    }
  });

  // Global Event Listener for Copy Buttons
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-copy-target]');
    if (target) {
      const targetId = target.getAttribute('data-copy-target');
      const element = document.getElementById(targetId);
      if (element) {
        const text = element.value || element.textContent;
        copyToClipboard(text);
      }
    }
  });
});
// Append Buy Me a Coffee Button to Tool Pages Dynamically
document.addEventListener("DOMContentLoaded", function() {
    // Check if we are on a tool page (inside /tools/ or has a tool container)
    const isToolPage = window.location.pathname.includes('/tools/') || document.querySelector('.tool-container') || document.querySelector('form');
    
    if (isToolPage) {
        const coffeeBox = document.createElement('div');
        coffeeBox.style.cssText = "text-align: center; margin: 30px auto; padding: 15px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px dashed var(--border-color, #333); max-width: 500px;";
        
        coffeeBox.innerHTML = `
            <p style="font-size: 13px; color: #a1a1aa; margin-bottom: 8px; font-family: sans-serif;">
                Did this tool save your time? Support MicroToolStack ☕
            </p>
            <a href="https://www.buymeacoffee.com/microtoolstack" target="_blank" rel="noopener noreferrer" style="display: inline-block;">
                <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 38px !important; width: 140px !important;">
            </a>
        `;

        // Append after the main content/tool area
        const targetContainer = document.querySelector('main') || document.body;
        targetContainer.appendChild(coffeeBox);
    }
});
