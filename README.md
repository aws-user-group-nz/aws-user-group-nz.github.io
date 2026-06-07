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

### Testing the events calendar

The calendar supports three modes via `localDevMode` in `scripts/cal_script.js`:

| Mode | Setting | Use case |
|------|---------|----------|
| Production | `false` (default) | Live Discord, Twitch, and YouTube Lambdas |
| Mock | `'mock'` | UI testing with fake data — no API keys |
| Live YouTube local | `'live'` | Prod Discord/Twitch + local YouTube API on port 8083 |

**Mock mode** — edit `scripts/cal_script.js`:

```javascript
this.localDevMode = 'mock';
```

Then run (first time: create venv and install deps):

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/python local-api-app.py
```

Open http://localhost:6969#/events — serves the site and mock `/api/events` (includes `youtubeEvents`).

**Live YouTube local** — run the YouTube API from `aws-user-group-nz.github.io-aws`:

```bash
cd ../aws-user-group-nz.github.io-aws/youtube-api
cp .env.example .env.local   # add YOUTUBE_API_KEY
./local-server.sh              # http://localhost:8083
```

Set in `scripts/cal_script.js`:

```javascript
this.localDevMode = 'live';
```

Serve the site separately:

```bash
python -m http.server 8000
```

Open http://localhost:8000#/events

**Production YouTube** — after deploying `youtube-api`, set `EVENT_API.prod.youtube` in `cal_script.js` to the API Gateway URL (see `youtube-api/DEPLOY.md` in the APIs repo).


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
