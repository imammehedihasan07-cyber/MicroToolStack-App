// Utility functions for MicroToolStack

document.addEventListener('DOMContentLoaded', () => {
    loadHomepageContent();
});

async function loadHomepageContent() {
    const popularGrid = document.getElementById('popular-tools-grid');
    const categoriesGrid = document.getElementById('categories-grid');
    const faqsList = document.getElementById('faqs-list');

    if (!popularGrid && !categoriesGrid && !faqsList) return;

    try {
        const response = await fetch('/data/tools.json');
        if (!response.ok) throw new Error('Failed to fetch tools data');
        const toolsData = await response.json();

        // Load Popular Tools
        if (popularGrid) {
            const popularTools = toolsData.filter(tool => tool.popular);
            popularGrid.innerHTML = popularTools.map(tool => `
                <a href="${tool.url}" class="tool-card">
                    <div class="tool-card-icon">${tool.icon || '🛠️'}</div>
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </a>
            `).join('');
        }

        // Load Categories
        if (categoriesGrid) {
            const categories = [
                { name: 'Text Tools', icon: '📝', count: '5 Tools', url: '/#text-tools' },
                { name: 'Developer Utilities', icon: '💻', count: '4 Tools', url: '/#dev-tools' },
                { name: 'SEO & Content', icon: '🔍', count: '3 Tools', url: '/#seo-tools' },
                { name: 'AI Generators', icon: '🤖', count: '4 Tools', url: '/#ai-tools' }
            ];

            categoriesGrid.innerHTML = categories.map(cat => `
                <a href="${cat.url}" class="tool-card">
                    <div class="tool-card-icon">${cat.icon}</div>
                    <h3>${cat.name}</h3>
                    <p>${cat.count}</p>
                </a>
            `).join('');
        }

        // Load FAQs
        if (faqsList) {
            const faqs = [
                { q: "Are all tools free to use?", a: "Yes, 100% free with no registration required." },
                { q: "Is my data safe?", a: "Your data stays in your browser. We do not store your inputs." }
            ];

            faqsList.innerHTML = faqs.map(faq => `
                <div class="faq-item">
                    <h3>${faq.q}</h3>
                    <p>${faq.a}</p>
                </div>
            `).join('');
        }

    } catch (err) {
        console.error('Error loading homepage content:', err);
    }
}
