/**
 * Application Entry Point & Dynamic Layout Component Loader
 */

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

  await loadComponent('footer-container', '/components/footer.html');

  await renderCategoriesWithDynamicCount();

  // Re-sync Theme Toggle Button Icon after dynamic load
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.innerText = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  // Mobile Menu Toggle Event
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
        if (typeof copyToClipboard === 'function') {
          copyToClipboard(text);
        } else {
          navigator.clipboard.writeText(text);
        }
      }
    }
  });

});
