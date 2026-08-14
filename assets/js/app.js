/**
 * Application Entry Point & Optimized Global Layout Loader
 */

// Universal Global Header & Footer Injector
function injectGlobalLayout() {
  const headerContainer = document.getElementById('header-container');
  if (headerContainer && headerContainer.children.length === 0) {
    headerContainer.innerHTML = `
      <header class="custom-header">
        <a href="/" class="custom-logo">
          <img src="/assets/images/logo-white.png" alt="MicroToolStack Logo" style="height: 38px; width: auto;">
        </a>
        <nav class="custom-nav" id="nav-menu">
          <a href="/#categories">Categories</a>
          <a href="/blog/">Blog</a>
          <a href="/about.html">About</a>
          <a href="/contact.html">Contact</a>
          <button id="theme-toggle" class="custom-theme-btn" aria-label="Toggle Theme">🌙</button>
        </nav>
      </header>
    `;
  }

  const footerContainer = document.getElementById('footer-container');
  if (footerContainer && footerContainer.children.length === 0) {
    footerContainer.innerHTML = `
      <footer class="custom-footer" style="margin-top: 4rem; border-top: 1px solid var(--border-color, #333); padding: 2.5rem 1rem; text-align: center; color: var(--text-secondary, #888);">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
          <div style="text-align: left;">
            <strong style="color: var(--text-primary, #fff); font-size: 1.1rem;">MicroToolStack</strong>
            <p style="font-size: 0.85rem; margin-top: 0.25rem;">Free, privacy-first web utilities & guides for creators.</p>
          </div>
          <div style="display: flex; gap: 1.25rem; font-size: 0.9rem;">
            <a href="/blog/" style="color: inherit; text-decoration: none;">Blog</a>
            <a href="/about.html" style="color: inherit; text-decoration: none;">About</a>
            <a href="/contact.html" style="color: inherit; text-decoration: none;">Contact</a>
            <a href="/privacy-policy.html" style="color: inherit; text-decoration: none;">Privacy Policy</a>
            <a href="/terms.html" style="color: inherit; text-decoration: none;">Terms</a>
          </div>
        </div>
        <p style="font-size: 0.8rem; margin-top: 2rem;">© 2026 MicroToolStack. All rights reserved.</p>
      </footer>
    `;
  }
}

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

    const fragment = document.createDocumentFragment();

    categories.forEach(cat => {
      const cleanCatId = normalizeCategoryString(cat.id);
      const dynamicCount = tools.filter(tool => normalizeCategoryString(tool.category) === cleanCatId).length;
      const categoryUrl = cat.url || `/categories/${cat.id}.html`;

      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="category-icon">${cat.icon || '📁'}</div>
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
        <a href="${categoryUrl}" class="category-link">View ${dynamicCount} →</a>
      `;
      fragment.appendChild(card);
    });

    categoryGrid.innerHTML = '';
    categoryGrid.appendChild(fragment);

  } catch (err) {
    console.error('Failed to render dynamic categories:', err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Inject Header & Footer instantly across all pages (Tools, Blog, Home)
  injectGlobalLayout();
  
  // Render Dynamic Category Counts if grid exists
  renderCategoriesWithDynamicCount();

  // Theme Toggle Fast Sync
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.innerText = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  // Global Event Delegation
  document.addEventListener('click', (e) => {
    // Theme toggle button click
    const themeBtn = e.target.closest('#theme-toggle');
    if (themeBtn) {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', activeTheme);
      localStorage.setItem('theme', activeTheme);
      themeBtn.innerText = activeTheme === 'dark' ? '☀️' : '🌙';
    }

    // Mobile navigation toggle
    const menuBtn = e.target.closest('#mobile-menu-btn');
    if (menuBtn) {
      const navMenu = document.getElementById('nav-menu');
      if (navMenu) navMenu.classList.toggle('active');
    }

    // Copy to clipboard helper
    const copyTarget = e.target.closest('[data-copy-target]');
    if (copyTarget) {
      const targetId = copyTarget.getAttribute('data-copy-target');
      const element = document.getElementById(targetId);
      if (element) {
        const text = element.value || element.textContent;
        navigator.clipboard.writeText(text);
        if (typeof showToast === 'function') {
          showToast('Copied to clipboard!');
        }
      }
    }
  });
});
