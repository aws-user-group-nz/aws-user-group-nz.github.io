// Meetups page sub-router
class MeetupsRouter {
    constructor() {
        this.routes = {
            '/overview': 'content/meetups/overview.html',
            '/auckland': 'content/meetups/auckland.html',
            '/wellington': 'content/meetups/wellington.html',
            '/christchurch': 'content/meetups/christchurch.html',
            '/other': 'content/meetups/other.html'
        };
        this.container = null;
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        
        this.container = document.getElementById('meetups-content');
        
        if (!this.container) {
            console.error('Meetups content container not found');
            return;
        }
        
        this.initialized = true;
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleNavigation());
        
        // Handle clicks on meetups nav links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-meetups-route]')) {
                e.preventDefault();
                const subRoute = e.target.getAttribute('data-meetups-route');
                window.location.hash = `/meetups${subRoute}`;
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
                console.error('Error loading meetups sub-page:', error);
                this.container.innerHTML = '<p>Error loading content</p>';
            }
        }
    }
    
    updateActiveNav(subRoute) {
        document.querySelectorAll('.meetups-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-meetups-route="${subRoute}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    handleNavigation() {
        const hash = window.location.hash;
        
        // Check if we're on a meetups sub-page
        if (hash.startsWith('#/meetups/')) {
            const subRoute = hash.replace('#/meetups', '');
            this.loadSubPage(subRoute);
        } else if (hash === '#/meetups') {
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
window.meetupsRouter = new MeetupsRouter();
