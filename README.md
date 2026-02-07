# AWSUG Aotearoa
AWSUG Aotearoa main www site

## Local Development

This site uses a Single Page Application (SPA) architecture that requires a web server to run locally due to browser CORS restrictions.

### Quick Start

**Option 1: Using Python (Recommended)**
```bash
# Double-click start-server.bat (Windows)
# Or run in terminal:
python -m http.server 8000
```

**Option 2: Using Node.js**
```bash
npx http-server -p 8000
```

Then open your browser to: http://localhost:8000

### Testing with Local API

For testing with local event data, edit `scripts/cal_script.js` and change:
```javascript
this.isLocalDev = false;
```
to:
```javascript
this.isLocalDev = true;
```

Then run the local API server:
```bash
python local-api-app.py
```

## Architecture

The site uses a hash-based SPA router:
- **index.html** - Main layout (navbar, modals, structure)
- **content/** - Page content fragments loaded dynamically
- **scripts/router.js** - Client-side routing
- **css/** - Stylesheets
- **assets/** - Logos, icons, images

### Adding New Pages

1. Create content file: `content/newpage.html`
2. Register route in `scripts/router.js`:
   ```javascript
   router.register('/newpage', 'content/newpage.html');
   ```
3. Add navigation link in `index.html`:
   ```html
   <a href="#/newpage" data-route="/newpage">New Page</a>
   ```

## Deployment

Site is deployed via GitHub Pages at: https://awsug.nz

https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
