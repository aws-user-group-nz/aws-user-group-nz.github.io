// About page sub-router
class AboutRouter {
    constructor() {
        this.routes = {
            '/overview': 'content/about/overview.html',
            '/committee': 'content/about/committee.html',
            '/meetup-leaders': 'content/about/meetup-leaders.html',
            '/history': 'content/about/history.html',
            '/ourconstitution': 'content/about/ourconstitution.html',
            '/ourregulations': 'content/about/ourregulations.html',
            '/codeofconduction': 'content/about/codeofconduction.html'
        };
        this.container = null;
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        
        this.container = document.getElementById('about-content');
        
        if (!this.container) {
            console.error('About content container not found');
            return;
        }
        
        this.initialized = true;
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleNavigation());
        
        // Handle clicks on about nav links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-about-route]')) {
                e.preventDefault();
                const subRoute = e.target.getAttribute('data-about-route');
                window.location.hash = `/about${subRoute}`;
            }
        });
        
        // Load initial sub-page
        this.handleNavigation();
    }
    
    async loadSubPage(subRoute) {
        const contentFile = this.routes[subRoute];
        
        if (!this.container) {
            console.error('Container not initialized');
            return;
        }
        
        if (contentFile) {
            try {
                const response = await fetch(contentFile);
                if (response.ok) {
                    const content = await response.text();
                    this.container.innerHTML = content;
                    this.updateActiveNav(subRoute);
                } else {
                    this.container.innerHTML = '<p>Content not found</p>';
                }
            } catch (error) {
                console.error('Error loading about sub-page:', error);
                this.container.innerHTML = '<p>Error loading content</p>';
            }
        }
    }
    
    updateActiveNav(subRoute) {
        document.querySelectorAll('.about-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-about-route="${subRoute}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    handleNavigation() {
        const hash = window.location.hash;
        
        // Check if we're on an about sub-page
        if (hash.startsWith('#/about/')) {
            const subRoute = hash.replace('#/about', '');
            this.loadSubPage(subRoute);
        } else if (hash === '#/about') {
            // Default to overview
            this.loadSubPage('/overview');
        }
    }
    
    reset() {
        this.initialized = false;
        this.container = null;
    }
}

// Create global instance
window.aboutRouter = new AboutRouter();
