/**
 * Navigation Menu Handler
 * Handles dynamic menu collapsing and burger menu toggle
 */

class NavigationHandler {
    constructor() {
        this.burgerButton = document.querySelector('.nav-burger');
        this.mobileOverlay = document.querySelector('.nav-mobile-overlay');
        this.navMenu = document.querySelector('.nav-menu');
        this.navMenuItems = document.querySelectorAll('.nav-menu a');
        this.titleBar = document.querySelector('.title-bar');
        this.titleBarLogo = document.querySelector('.title-bar-logo');
        this.footer = document.querySelector('.site-footer');
        this.isMobile = window.innerWidth < 768;
        this.mobileMenuOpen = false;
        
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

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });

        // Initial setup
        this.handleResize();

        // Re-measure after fonts/images have loaded (they affect header height)
        window.addEventListener('load', () => this.updateBodyPadding());
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

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;
        
        // If switching between mobile and desktop, close mobile menu
        if (wasMobile !== this.isMobile && this.mobileMenuOpen) {
            this.closeMobileMenu();
        }

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

