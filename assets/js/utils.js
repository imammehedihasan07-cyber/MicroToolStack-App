// Utility Functions for Homepage Grid Rendering

document.addEventListener('DOMContentLoaded', () => {
    loadHomepageContent();
});

async function loadHomepageContent() {
    const popularGrid = document.getElementById('popular-tools-grid');
    const categoriesGrid = document.getElementById('categories-grid');
    const faqsList = document.getElementById('faqs-list');

    try {
        const response = await fetch('/data/tools.json');
        if (!response.ok) throw new Error('Failed to load tools.json');
        const toolsData = await response.json();

        // Load Popular Tools Grid
        if (popularGrid) {
            // First 12 items as popular tools
            const popularTools = toolsData.slice(0, 12);
            popularGrid.innerHTML = popularTools.map(tool => `
                <a href="${tool.url}" class="tool-card">
                    <div class="tool-card-icon">${tool.icon || '🛠️'}</div>
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </a>
            `).join('');
        }

        // Load Original 6 Categories Grid
        if (categoriesGrid) {
            const categories = [
                { name: 'Text Tools', icon: '📝', desc: 'Essential utilities for content writers, editors, and students.', linkText: 'View 7 Tools →', url: '/#text-tools' },
                { name: 'SEO Tools', icon: '🚀', desc: 'Optimize metadata, schemas, and structure for search engines.', linkText: 'View 6 Tools →', url: '/#seo-tools' },
                { name: 'Developer Tools', icon: '💻', desc: 'Handy tools for format conversion, encoding, and data generation.', linkText: 'View 6 Tools →', url: '/#dev-tools' },
                { name: 'Calculators', icon: '🧮', desc: 'Fast financial, health, and everyday unit/math calculators.', linkText: 'View 5 Tools →', url: '/#calculators' },
                { name: 'Media Tools', icon: '🖼️', desc: 'Client-side image conversion, compression, and media editing.', linkText: 'View 1 Tools →', url: '/#media-tools' },
                { name: 'AI Tools', icon: '🤖', desc: 'Smart AI-powered generators to boost social media and content workflows.', linkText: 'View 5 Tools →', url: '/#ai-tools' }
            ];

            categoriesGrid.innerHTML = categories.map(cat => `
                <a href="${cat.url}" class="tool-card">
                    <div class="tool-card-icon">${cat.icon}</div>
                    <h3>${cat.name}</h3>
                    <p style="margin-bottom: 0.75rem;">${cat.desc}</p>
                    <span style="font-size: 0.85rem; color: var(--accent-primary, #3b82f6); font-weight: 600;">${cat.linkText}</span>
                </a>
            `).join('');
        }

        // Load FAQs
        if (faqsList) {
            const faqs = [
                { q: "Are all tools on MicroToolStack free to use?", a: "Yes, 100% free! Every tool on MicroToolStack is accessible without registration, subscriptions, or hidden charges." },
                { q: "Is my data stored or tracked on your servers?", a: "No. Most of our text, SEO, and developer utilities run client-side directly in your browser. Your text stays entirely private." }
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
