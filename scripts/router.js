// Simple SPA Router with Hash-based routing (works with file:// protocol)
class Router {
    constructor() {
        this.routes = {};
        this.contentContainer = null;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.contentContainer = document.getElementById('page-content');
        
        if (!this.contentContainer) {
            console.error('Content container #page-content not found');
            return;
        }
        
        // Handle hash changes
        window.addEventListener('hashchange', () => this.loadRoute());
        
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigate(route);
            }
        });
        
        // Load initial route
        this.loadRoute();
    }
    
    register(path, contentFile) {
        this.routes[path] = contentFile;
    }
    
    navigate(path) {
        window.location.hash = path;
    }
    
    async loadRoute() {
        // Get route from hash, default to /home
        let route = window.location.hash.slice(1) || '/home';
        
        const contentFile = this.routes[route];
        
        if (contentFile) {
            try {
                const response = await fetch(contentFile);
                if (response.ok) {
                    const content = await response.text();
                    this.contentContainer.innerHTML = content;
                    this.updateActiveNav(route);
                    
                    // Re-initialize scripts that depend on the loaded content
                    this.initializeContentScripts();
                } else {
                    this.contentContainer.innerHTML = '<center><h1>Page Not Found</h1></center>';
                }
            } catch (error) {
                console.error('Error loading content:', error);
                this.contentContainer.innerHTML = '<center><h1>Error Loading Page</h1></center>';
            }
        } else {
            // Default to home content
            const homeContent = this.routes['/home'];
            if (homeContent) {
                try {
                    const response = await fetch(homeContent);
                    const content = await response.text();
                    this.contentContainer.innerHTML = content;
                    this.updateActiveNav('/home');
                    this.initializeContentScripts();
                } catch (error) {
                    console.error('Error loading home:', error);
                }
            }
        }
    }
    
    updateActiveNav(route) {
        // Remove active class from all nav links
        document.querySelectorAll('.title-bar-menu nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current route
        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    initializeContentScripts() {
        // Re-initialize accordion if it exists in the loaded content
        const accordionHeader = document.querySelector('.accordion-header');
        if (accordionHeader && !accordionHeader.hasAttribute('data-initialized')) {
            accordionHeader.setAttribute('data-initialized', 'true');
            accordionHeader.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('.accordion-icon');
                
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                    icon.textContent = '+';
                } else {
                    content.style.display = 'block';
                    icon.textContent = '-';
                }
            });
        }
        
        // Re-initialize calendar if it exists in the loaded content
        const calendarGrid = document.querySelector('.calendar-grid');
        if (calendarGrid && !window.calendar) {
            // Check if Calendar class is available
            if (typeof Calendar !== 'undefined') {
                window.calendar = new Calendar();
            } else {
                console.error('Calendar class not loaded yet');
            }
        }
    }
}

// Initialize router when DOM is ready
const router = new Router();

// Register routes
router.register('/home', 'content/home.html');
router.register('/about', 'content/about.html');
router.register('/meetups', 'content/meetups.html');
router.register('/resources', 'content/resources.html');
router.register('/community', 'content/community.html');
router.register('/sponsors', 'content/sponsors.html');

