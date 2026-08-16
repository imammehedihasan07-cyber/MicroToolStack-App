/**
 * MicroToolStack Application Entry Point
 *
 * Handles:
 * - Global Header
 * - Global Footer
 * - Dynamic Categories
 * - Mobile Navigation
 * - Copy to Clipboard
 *
 * IMPORTANT:
 * Theme logic is handled ONLY by theme.js.
 */


/* =========================================================
   1. GLOBAL HEADER & FOOTER
   ========================================================= */

function injectGlobalLayout() {

    /* -----------------------------------------------------
       HEADER
       ----------------------------------------------------- */

    const headerContainer =
        document.getElementById('header-container');

    if (
        headerContainer &&
        headerContainer.children.length === 0
    ) {

        // Read already initialized theme
        const currentTheme =
            document.documentElement.getAttribute('data-theme') ||
            'dark';

        const logo =
            currentTheme === 'light'
                ? '/assets/images/logo-black.png'
                : '/assets/images/logo-white.png';

        const themeIcon =
            currentTheme === 'dark'
                ? '☀️'
                : '🌙';

        headerContainer.innerHTML = `
            <header class="custom-header">

                <a href="/" class="custom-logo">
                    <img
                        id="app-logo"
                        src="${logo}"
                        alt="MicroToolStack Logo"
                        width="160"
                        height="38"
                        style="
                            height: 38px;
                            width: auto;
                            display: block;
                        "
                        onerror="
                            this.onerror=null;
                            this.src='/assets/images/logo-white.png';
                        "
                    >
                </a>

                <nav
                    class="custom-nav"
                    id="nav-menu"
                >
                    <a href="/#categories">
                        Categories
                    </a>

                    <a href="/blog/">
                        Blog
                    </a>

                    <a href="/about.html">
                        About
                    </a>

                    <a href="/contact.html">
                        Contact
                    </a>

                    <button
                        id="theme-toggle"
                        class="custom-theme-btn"
                        type="button"
                        aria-label="${
                            currentTheme === 'dark'
                                ? 'Switch to light theme'
                                : 'Switch to dark theme'
                        }"
                        aria-pressed="${
                            currentTheme === 'dark'
                                ? 'true'
                                : 'false'
                        }"
                    >
                        ${themeIcon}
                    </button>

                </nav>

            </header>
        `;
    }


    /* -----------------------------------------------------
       FOOTER
       ----------------------------------------------------- */

    const footerContainer =
        document.getElementById('footer-container');

    if (
        footerContainer &&
        footerContainer.children.length === 0
    ) {

        footerContainer.innerHTML = `
            <footer
                class="custom-footer"
                style="
                    margin-top: 4rem;
                    border-top:
                        1px solid
                        var(--border-color, #333);
                    padding: 2.5rem 1rem;
                    text-align: center;
                    color:
                        var(--text-secondary, #888);
                "
            >

                <div
                    style="
                        max-width: 1000px;
                        margin: 0 auto;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        align-items: center;
                        gap: 1rem;
                    "
                >

                    <div style="text-align: left;">

                        <strong
                            style="
                                color:
                                    var(--text-primary, #fff);
                                font-size: 1.1rem;
                            "
                        >
                            MicroToolStack
                        </strong>

                        <p
                            style="
                                font-size: 0.85rem;
                                margin-top: 0.25rem;
                            "
                        >
                            Free, privacy-first web
                            utilities & guides for creators.
                        </p>

                    </div>


                    <div
                        style="
                            display: flex;
                            gap: 1.25rem;
                            font-size: 0.9rem;
                            flex-wrap: wrap;
                        "
                    >

                        <a
                            href="/blog/"
                            style="
                                color: inherit;
                                text-decoration: none;
                            "
                        >
                            Blog
                        </a>

                        <a
                            href="/about.html"
                            style="
                                color: inherit;
                                text-decoration: none;
                            "
                        >
                            About
                        </a>

                        <a
                            href="/contact.html"
                            style="
                                color: inherit;
                                text-decoration: none;
                            "
                        >
                            Contact
                        </a>

                        <a
                            href="/privacy-policy.html"
                            style="
                                color: inherit;
                                text-decoration: none;
                            "
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="/terms.html"
                            style="
                                color: inherit;
                                text-decoration: none;
                            "
                        >
                            Terms
                      </a>
                     <a
                         href="/disclaimer.html"
                         style="
                             color: inherit;
                             text-decoration: none;
                         "
                        >
                           Disclaimer
                        </a>

                    </div>

                </div>


                <p
                    style="
                        font-size: 0.8rem;
                        margin-top: 2rem;
                    "
                >
                    © ${new Date().getFullYear()}
                    MicroToolStack.
                    All rights reserved.
                </p>

            </footer>
        `;
    }
}


/* =========================================================
   2. CATEGORY STRING NORMALIZER
   ========================================================= */

function normalizeCategoryString(str) {

    if (!str) {
        return '';
    }

    return str
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}


/* =========================================================
   3. DYNAMIC CATEGORY COUNT
   ========================================================= */

async function renderCategoriesWithDynamicCount() {

    const categoryGrid =
        document.getElementById('category-grid');

    if (!categoryGrid) {
        return;
    }

    try {

        const [categoryResponse, toolResponse] =
            await Promise.all([
                fetch('/data/categories.json'),
                fetch('/data/tools.json')
            ]);

        if (
            !categoryResponse.ok ||
            !toolResponse.ok
        ) {
            return;
        }

        const categories =
            await categoryResponse.json();

        const tools =
            await toolResponse.json();

        const fragment =
            document.createDocumentFragment();


        categories.forEach((category) => {

            const cleanCategoryId =
                normalizeCategoryString(category.id);

            const dynamicCount =
                tools.filter((tool) => {

                    return (
                        normalizeCategoryString(
                            tool.category
                        ) === cleanCategoryId
                    );

                }).length;


            const categoryUrl =
                category.url ||
                `/categories/${category.id}.html`;


            const card =
                document.createElement('div');

            card.className =
                'category-card';


            card.innerHTML = `
                <div class="category-icon">
                    ${category.icon || '📁'}
                </div>

                <h3>
                    ${category.name}
                </h3>

                <p>
                    ${category.description}
                </p>

                <a
                    href="${categoryUrl}"
                    class="category-link"
                >
                    View ${dynamicCount} →
                </a>
            `;


            fragment.appendChild(card);

        });


        categoryGrid.innerHTML = '';

        categoryGrid.appendChild(fragment);

    } catch (error) {

        console.error(
            'Failed to render dynamic categories:',
            error
        );

    }
}


/* =========================================================
   4. MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {

    document.addEventListener(
        'click',
        function (event) {

            const menuButton =
                event.target.closest(
                    '#mobile-menu-btn'
                );

            if (!menuButton) {
                return;
            }

            const navMenu =
                document.getElementById(
                    'nav-menu'
                );

            if (!navMenu) {
                return;
            }

            navMenu.classList.toggle('active');

            const isOpen =
                navMenu.classList.contains('active');

            menuButton.setAttribute(
                'aria-expanded',
                isOpen ? 'true' : 'false'
            );
        }
    );
}


/* =========================================================
   5. COPY TO CLIPBOARD
   ========================================================= */

function initCopyToClipboard() {

    document.addEventListener(
        'click',
        async function (event) {

            const copyTarget =
                event.target.closest(
                    '[data-copy-target]'
                );

            if (!copyTarget) {
                return;
            }

            const targetId =
                copyTarget.getAttribute(
                    'data-copy-target'
                );

            if (!targetId) {
                return;
            }

            const targetElement =
                document.getElementById(targetId);

            if (!targetElement) {
                return;
            }

            const text =
                targetElement.value ||
                targetElement.textContent ||
                '';


            try {

                await navigator.clipboard.writeText(
                    text
                );

                if (
                    typeof showToast === 'function'
                ) {
                    showToast(
                        'Copied to clipboard!'
                    );
                }

            } catch (error) {

                console.error(
                    'Copy failed:',
                    error
                );

            }
        }
    );
}


/* =========================================================
   6. APPLICATION INITIALIZATION
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        /*
         * Header + Footer
         */
        injectGlobalLayout();


        /*
         * Dynamic categories
         */
        renderCategoriesWithDynamicCount();


        /*
         * Mobile navigation
         */
        initMobileNavigation();


        /*
         * Copy helper
         */
        initCopyToClipboard();

    }
);
