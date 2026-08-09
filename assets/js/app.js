/**
 * Application Entry Point & Optimized Layout Loader
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
  // Parallel loading for layout components
  loadComponent('footer-container', '/components/footer.html');
  renderCategoriesWithDynamicCount();

  // Re-sync Theme Icon fast
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.innerText = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  // Event Delegation for Performance
  document.addEventListener('click', (e) => {
    const menuBtn = e.target.closest('#mobile-menu-btn');
    if (menuBtn) {
      const navMenu = document.getElementById('nav-menu');
      if (navMenu) navMenu.classList.toggle('active');
    }

    const copyTarget = e.target.closest('[data-copy-target]');
    if (copyTarget) {
      const targetId = copyTarget.getAttribute('data-copy-target');
      const element = document.getElementById(targetId);
      if (element) {
        const text = element.value || element.textContent;
        navigator.clipboard.writeText(text);
      }
    }
  });
});
