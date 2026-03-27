/**
 * Navigation Menu Handler
 * Handles dynamic menu collapsing and burger menu toggle
 */

class NavigationHandler {
    constructor() {
        this.burgerButton = document.querySelector('.nav-burger');
        this.mobileOverlay = document.querySelector('.nav-mobile-overlay');
        this.navMenu = document.querySelector('.nav-menu');
        this.navMenuItems = [];
        this.navMenuWrapper = document.querySelector('.nav-menu-wrapper');
        this.navMore = document.querySelector('.nav-more');
        this.navMoreToggle = document.querySelector('.nav-more-toggle');
        this.navMoreMenu = document.querySelector('.nav-more-menu');
        this.titleBar = document.querySelector('.title-bar');
        this.titleBarLogo = document.querySelector('.title-bar-logo');
        this.footer = document.querySelector('.site-footer');
        this.isMobile = window.innerWidth < 768;
        this.mobileMenuOpen = false;
        this.desktopBreakpoint = 768;
        this.moreOpen = false;
        
        this.init();
    }

    init() {
        // Setup burger menu toggle
        if (this.burgerButton) {
            this.burgerButton.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking overlay
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', (e) => {
                if (e.target === this.mobileOverlay) {
                    this.closeMobileMenu();
                }
            });
        }

        // Close mobile menu when clicking a link
        const mobileLinks = document.querySelectorAll('.nav-mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Setup desktop "More" overflow interactions
        this.setupMoreMenuInteractions();

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });

        // Initial setup
        this.captureInitialDesktopLinks();
        this.handleResize();

        // Re-measure after fonts/images have loaded (they affect header height)
        window.addEventListener('load', () => {
            this.handleResize();
            this.updateBodyPadding();
        });
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        if (this.burgerButton) {
            this.burgerButton.classList.toggle('active', this.mobileMenuOpen);
            this.burgerButton.setAttribute('aria-expanded', this.mobileMenuOpen);
        }
        
        if (this.mobileOverlay) {
            this.mobileOverlay.classList.toggle('active', this.mobileMenuOpen);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        if (this.mobileMenuOpen) {
            this.mobileMenuOpen = false;
            
            if (this.burgerButton) {
                this.burgerButton.classList.remove('active');
                this.burgerButton.setAttribute('aria-expanded', 'false');
            }
            
            if (this.mobileOverlay) {
                this.mobileOverlay.classList.remove('active');
            }
            
            document.body.style.overflow = '';
        }
    }

    updateBodyPadding() {
        if (this.titleBar) {
            const headerHeight = this.titleBar.getBoundingClientRect().height;
            document.body.style.paddingTop = headerHeight + 'px';
        }
        if (this.footer) {
            const footerHeight = this.footer.getBoundingClientRect().height;
            document.body.style.paddingBottom = footerHeight + 'px';
        }
    }

    captureInitialDesktopLinks() {
        if (!this.navMenu) return;
        this.navMenuItems = Array.from(this.navMenu.querySelectorAll(':scope > a'));
    }

    setupMoreMenuInteractions() {
        if (!this.navMore || !this.navMoreToggle || !this.navMoreMenu) return;

        this.navMoreToggle.addEventListener('click', () => {
            if (this.navMore.getAttribute('aria-hidden') === 'true') return;
            this.toggleMoreMenu();
        });

        document.addEventListener('click', (e) => {
            if (!this.moreOpen || !this.navMore) return;
            if (!this.navMore.contains(e.target)) {
                this.closeMoreMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.moreOpen) {
                this.closeMoreMenu();
            }
        });

        this.navMoreMenu.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                this.closeMoreMenu();
            }
        });
    }

    toggleMoreMenu() {
        if (this.moreOpen) {
            this.closeMoreMenu();
            return;
        }
        this.moreOpen = true;
        this.navMore.classList.add('open');
        this.navMoreToggle.setAttribute('aria-expanded', 'true');
    }

    closeMoreMenu() {
        if (!this.moreOpen || !this.navMoreToggle || !this.navMore) return;
        this.moreOpen = false;
        this.navMore.classList.remove('open');
        this.navMoreToggle.setAttribute('aria-expanded', 'false');
    }

    resetDesktopLinks() {
        if (!this.navMenu || !this.navMore || !this.navMoreMenu) return;

        this.navMenuItems.forEach(link => {
            this.navMenu.insertBefore(link, this.navMore);
        });

        this.navMoreMenu.innerHTML = '';
    }

    buildMoreMenu() {
        if (!this.navMoreMenu) return;
        const hiddenLinks = this.navMenuItems.filter(link => link.parentElement === this.navMoreMenu);
        this.navMoreMenu.innerHTML = '';

        hiddenLinks.forEach(link => {
            this.navMoreMenu.appendChild(link);
        });
    }

    distributeOverflowLinks() {
        if (!this.navMenu || !this.navMore || !this.navMoreMenu || !this.navMenuWrapper) return;
        if (window.innerWidth < this.desktopBreakpoint) {
            this.resetDesktopLinks();
            this.navMore.setAttribute('aria-hidden', 'true');
            this.closeMoreMenu();
            return;
        }

        this.resetDesktopLinks();
        this.navMore.setAttribute('aria-hidden', 'true');
        this.closeMoreMenu();

        const horizontalMargins = (el) => {
            const style = window.getComputedStyle(el);
            return (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
        };

        const totalVisibleLinksWidth = () =>
            this.navMenuItems
                .filter(link => link.parentElement === this.navMenu)
                .reduce((sum, link) => sum + link.getBoundingClientRect().width + horizontalMargins(link), 0);

        const availableWidth = () => this.navMenuWrapper.getBoundingClientRect().width;
        const moreButtonWidth = () =>
            this.navMoreToggle.getBoundingClientRect().width + horizontalMargins(this.navMore);

        // Keep a small buffer so links do not touch controls at boundary widths.
        const widthBuffer = 12;
        const hasOverflow = (includeMoreButton = false) => {
            const required = totalVisibleLinksWidth() + (includeMoreButton ? moreButtonWidth() : 0) + widthBuffer;
            return required > availableWidth();
        };

        // If links fit naturally, keep "More" hidden.
        if (!hasOverflow()) {
            return;
        }

        // Show "More" and progressively move rightmost links into dropdown.
        this.navMore.setAttribute('aria-hidden', 'false');

        for (let i = this.navMenuItems.length - 1; i >= 0; i--) {
            const link = this.navMenuItems[i];
            this.navMoreMenu.prepend(link);
            if (!hasOverflow(true)) {
                break;
            }
        }

        this.buildMoreMenu();

        // Safety: if all links moved but still overflowing, hide More to avoid broken state.
        if (this.navMoreMenu.children.length === 0 || hasOverflow(true)) {
            this.navMore.setAttribute('aria-hidden', 'true');
            this.resetDesktopLinks();
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;
        
        // If switching between mobile and desktop, close mobile menu
        if (wasMobile !== this.isMobile && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }

        this.distributeOverflowLinks();

        // Always re-measure header height after resize
        this.updateBodyPadding();
    }
}

// ── Dark / Light Mode Toggle ──────────────────────────────────────────────────

class ThemeHandler {
    constructor() {
        this.html = document.documentElement;
        this.toggleBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');
        this.STORAGE_KEY = 'awsug-theme';
        this.init();
    }

    init() {
        // Determine initial theme: localStorage → system → dark
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            this.applyTheme(saved, false);
        } else {
            // Detect system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme(prefersDark ? 'dark' : 'light', false);
        }

        // Listen for system preference changes (only when no manual override)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                this.applyTheme(e.matches ? 'dark' : 'light', false);
            }
        });

        // Wire up all toggle buttons
        this.toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => this.toggleTheme());
        });
    }

    applyTheme(theme, save = true) {
        this.html.setAttribute('data-theme', theme);
        if (save) {
            localStorage.setItem(this.STORAGE_KEY, theme);
        }
        // Update all toggle button icons
        const isDark = theme === 'dark';
        this.toggleBtns.forEach(btn => {
            btn.innerHTML = isDark
                ? '<span class="icon-sun"><i class="fas fa-sun"></i></span>'
                : '<span class="icon-moon"><i class="fas fa-moon"></i></span>';
            btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            btn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        });
    }

    toggleTheme() {
        const current = this.html.getAttribute('data-theme');
        this.applyTheme(current === 'dark' ? 'light' : 'dark');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NavigationHandler();
        new ThemeHandler();
    });
} else {
    new NavigationHandler();
    new ThemeHandler();
}

