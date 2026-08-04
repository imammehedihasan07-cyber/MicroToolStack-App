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
