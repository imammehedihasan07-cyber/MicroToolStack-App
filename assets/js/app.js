/**
 * Application Entry Point & Dynamic Layout Component Loader
 */

// Global Theme Manager Engine (Ensures Light & Dark Mode works everywhere)
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.applyTheme(savedTheme);
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateToggleButtons(theme);
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  },

  updateToggleButtons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn, .custom-theme-btn, #theme-toggle');
    toggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '🌙' : '☀️';
    });
  }
};

// Immediately initialize theme on page load to prevent flicker
ThemeManager.init();
window.ThemeManager = ThemeManager;

// Helper to inject HTML components dynamically
async function loadComponent(elementId, filepath) {
  const target = document.getElementById(elementId);
  if (!target) return;

  try {
    const res = await fetch(filepath);
    if (res.ok) {
      target.innerHTML = await res.text();
      // Re-sync theme after injection
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      ThemeManager.updateToggleButtons(currentTheme);
    }
  } catch (err) {
    console.error(`Failed to load component: ${filepath}`, err);
  }
}

/**
 * Clean & Fully Generic Category Counter
 */
function normalizeCategoryString(str) {
  if (!str) return '';
  return str.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function renderCategoriesWithDynamicCount() {
  const categoryGrid = document.getElementById('category-grid');
  if (!categoryGrid) return;

  try {
    const [catRes, toolRes] = await Promise.all([
      fetch('/data/categories.json'),
      fetch('/data/tools.json')
    ]);

    if (!catRes.ok || !toolRes.ok) return;

    const categories = await catRes.json();
    const tools = await toolRes.json();

    categoryGrid.innerHTML = categories.map(cat => {
      const cleanCatId = normalizeCategoryString(cat.id);

      const dynamicCount = tools.filter(tool => {
        const cleanToolCat = normalizeCategoryString(tool.category);
        return cleanToolCat === cleanCatId;
      }).length;

      const categoryUrl = cat.url || `/categories/${cat.id}.html`;

      return `
        <div class="category-card">
          <div class="category-icon">${cat.icon || '📁'}</div>
          <h3>${cat.name}</h3>
          <p>${cat.description}</p>
          <a href="${categoryUrl}" class="category-link">View ${dynamicCount} →</a>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to render dynamic categories:', err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {

  // Load Footer Component if present
  await loadComponent('footer-container', '/components/footer.html');

  // Dynamically calculate and render categories count on Home Page
  await renderCategoriesWithDynamicCount();

  // Re-sync Theme Manager
  ThemeManager.init();

  // Global Event Listener for Theme Toggle Buttons
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('.theme-toggle-btn, .custom-theme-btn, #theme-toggle');
    if (themeBtn) {
      ThemeManager.toggleTheme();
    }
  });

  // Mobile Menu Toggle Event Listener
  document.addEventListener('click', (e) => {
    const menuBtn = e.target.closest('#mobile-menu-btn, .mobile-menu-btn');
    if (menuBtn) {
      const navMenu = document.getElementById('nav-menu') || document.querySelector('.custom-nav');
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
        if (typeof copyToClipboard === 'function') {
          copyToClipboard(text);
        } else {
          navigator.clipboard.writeText(text);
        }
      }
    }
  });

});
