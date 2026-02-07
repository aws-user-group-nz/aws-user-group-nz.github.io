// Community Days page sub-router
class CommunityDaysRouter {
    constructor() {
        this.routes = {
            '/overview': 'content/communitydays/overview.html',
            '/aotearoa': 'content/communitydays/aotearoa.html',
            '/oceania': 'content/communitydays/oceania.html',
            '/archive': 'content/communitydays/archive.html'
        };
        this.container = null;
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        
        this.container = document.getElementById('communitydays-content');
        
        if (!this.container) {
            console.error('Community Days content container not found');
            return;
        }
        
        this.initialized = true;
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleNavigation());
        
        // Handle clicks on community days nav links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-communitydays-route]')) {
                e.preventDefault();
                const subRoute = e.target.getAttribute('data-communitydays-route');
                window.location.hash = `/communitydays${subRoute}`;
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
                console.error('Error loading community days sub-page:', error);
                this.container.innerHTML = '<p>Error loading content</p>';
            }
        }
    }
    
    updateActiveNav(subRoute) {
        document.querySelectorAll('.communitydays-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-communitydays-route="${subRoute}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    handleNavigation() {
        const hash = window.location.hash;
        
        // Check if we're on a community days sub-page
        if (hash.startsWith('#/communitydays/')) {
            const subRoute = hash.replace('#/communitydays', '');
            this.loadSubPage(subRoute);
        } else if (hash === '#/communitydays') {
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
window.communityDaysRouter = new CommunityDaysRouter();
