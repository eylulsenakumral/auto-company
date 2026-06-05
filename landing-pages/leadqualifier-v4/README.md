# LeadQualifier v4 — Quick Start

**What:** Simple lead qualification tool landing page with embedded download
**Format:** Single HTML file + embedded ZIP — no build, no install, no dependencies

## Installation

### Option 1: Direct Download (Fastest)
1. Download `leadqualifier-v4.zip` from this package
2. Extract anywhere
3. Open `index.html` in your browser
4. Done — it works offline

### Option 2: Web Hosting
1. Upload `index.html` to any web host (Netlify, Vercel, GitHub Pages, cPanel)
2. That's it — single file deployment

### Option 3: Local Server
```bash
# Python 3
python -m http.server 8877

# Node.js
npx serve@latest -p 8877

# Then open http://localhost:8877
```

## What's Included

- **index.html** (13KB) — Complete landing page with embedded download
- **leadqualifier-v4.zip** (28KB) — Standalone app package
- **form/** — Feedback form with Cloudflare Workers API
- **deploy.sh** — One-click deployment script

## Features

- ✅ Single file — no build process
- ✅ Works offline — no external dependencies
- ✅ Instant deployment — upload anywhere
- ✅ Responsive design — mobile-friendly
- ✅ **NEW: Form submission tracking** — Real-time feedback counter
- ✅ **NEW: One-click deploy** — Vercel + Cloudflare Workers

## One-Click Deploy 🚀

```bash
# From this directory
./deploy.sh
```

This deploys:
- **Landing page** → Vercel (https://leadqualifier-v4.vercel.app)
- **Form API** → Cloudflare Workers (with submission tracking)

**Prerequisites:**
```bash
npm i -g vercel wrangler
vercel login
wrangler login
```

## Monitoring

Check form submissions:
```bash
curl https://your-worker.workers.dev
# Response: {"total_submissions": 5}
```

## Version

v4.1.0 — Released 2025-06-05
- ✨ Added submission counter
- ✨ Added one-click deploy script
- ✨ Added form API with Cloudflare Workers

## License

Free to use. No attribution required.

---

**Need help?** Open an issue or contact @tolgabrk
