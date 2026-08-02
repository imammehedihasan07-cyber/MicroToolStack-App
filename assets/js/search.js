/**
 * Instant Search System for MicroToolStack
 * Handles real-time client-side search filtering across tools.
 */
const SearchSystem = {
  toolsData: [],
  dropdownEl: null,
  inputEl: null,

  async init(inputId, dropdownId) {
    this.inputEl = document.getElementById(inputId);
    this.dropdownEl = document.getElementById(dropdownId);

    if (!this.inputEl || !this.dropdownEl) return;

    // Load tools dataset
    try {
      const res = await fetch('/data/tools.json');
      if (res.ok) {
        this.toolsData = await res.json();
      }
    } catch (err) {
      console.error('Failed to load search index:', err);
      return;
    }

    // Attach debounced event listener
    this.inputEl.addEventListener('input', debounce((e) => {
      this.handleSearch(e.target.value.trim());
    }, 200));

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!this.inputEl.contains(e.target) && !this.dropdownEl.contains(e.target)) {
        this.hideDropdown();
      }
    });

    // Handle keydown for accessibility (Esc key to close)
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideDropdown();
      }
    });
  },

  handleSearch(query) {
    if (!query || query.length < 2) {
      this.hideDropdown();
      return;
    }

    const cleanQuery = query.toLowerCase();
    const matches = this.toolsData.filter(tool => {
      return (
        tool.name.toLowerCase().includes(cleanQuery) ||
        tool.description.toLowerCase().includes(cleanQuery) ||
        tool.category.toLowerCase().includes(cleanQuery)
      );
    }).slice(0, 6); // Limit to top 6 results

    this.renderDropdown(matches, query);
  },

  renderDropdown(results, query) {
    if (results.length === 0) {
      this.dropdownEl.innerHTML = `
        <div class="search-no-results">
          No tools found matching "<strong>${this.escapeHTML(query)}</strong>"
        </div>
      `;
    } else {
      this.dropdownEl.innerHTML = results.map(tool => `
        <a href="${tool.url}" class="search-result-item">
          <span class="search-item-icon">${tool.icon}</span>
          <div class="search-item-details">
            <div class="search-item-title">${this.escapeHTML(tool.name)}</div>
            <div class="search-item-desc">${this.escapeHTML(tool.description)}</div>
          </div>
        </a>
      `).join('');
    }

    this.dropdownEl.classList.add('active');
  },

  hideDropdown() {
    if (this.dropdownEl) {
      this.dropdownEl.classList.remove('active');
    }
  },

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
};

// Auto-initialize search if home search input exists
document.addEventListener('DOMContentLoaded', () => {
  SearchSystem.init('home-search', 'search-results-dropdown');
});