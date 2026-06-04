# AutoTask MVP Deployment Plan

**Status:** Ready to Execute
**Author:** DevOps Hightower
**Created:** 2025-01-03
**Estimated Cost:** $0-15/mo (launch tier)

---

## Executive Summary

AutoTask MVP'nin production deployment'ı için minimal, zero-config yaklaşım. Kullanıcı mevcut SSH erişimi olmadığı için her şey self-hosted veya managed service üzerinden çalışacak.

**Deployment Strategy:**
1. **Web Dashboard** → Cloudflare Pages (sıfır maliyet, auto-SSL, global CDN)
2. **Chrome Extension** → Chrome Web Store (one-time $5 fee)
3. **Cloudflare Worker** → Cloudflare Workers (100K req/day free tier)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Environment                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │ Chrome Store │    │ CF Pages Domain │    │ CF Workers      │ │
│  │ Extension    │───▶│ autotask.app    │───▶│ /api/execute    │ │
│  └──────────────┘    └─────────────────┘    └─────────────────┘ │
│                                                 │                │
│                                                 ▼                │
│                                    ┌─────────────────────┐      │
│                                    │ Browserbase API     │      │
│                                    │ (browser sessions)   │      │
│                                    └─────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Pipeline                          │
├─────────────────────────────────────────────────────────────────┤
│  Git Push ─▶ GitHub Actions ─▶ Build ─▶ Deploy ─▶ Smoke Test    │
│     (main)        (CI/CD)         (Next.js)  (Pages)   (Playwright)│
└─────────────────────────────────────────────────────────────────┘
```

---

## Component 1: Web Dashboard (Cloudflare Pages)

### Why Cloudflare Pages?
- **Zero config:** Git repo bağla, deploy
- **Global CDN:** Edge caching ile sub-100ms response
- **Auto SSL:** Sertifika yönetimi yok
- **Free tier:** 500K builds/month, unlimited bandwidth
- **Preview deployments:** Her PR için otomatik preview URL

### Deployment Steps

```bash
# 1. GitHub repo oluştur (auto-company org altında)
cd /home/tolgabrk/projects/Auto-Company/projects/autotask
gh repo create auto-company/autotask --public --source=. --push

# 2. Cloudflare Pages projesi oluştur
# (Console veya wrangler ile)
wrangler pages project create autotask --production-branch=main

# 3. Build ayarları (CF Pages console'da):
# Build command: npm run build
# Build output directory: .next
# Node version: 20
```

### Environment Variables (CF Pages)

| Variable | Value | Secret? |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | `https://autotask.workers.dev` | No |
| `NEXT_PUBLIC_ENV` | `production` | No |

### GitHub Actions Workflow (.github/workflows/deploy.yml)

```yaml
name: Deploy AutoTask

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
          NEXT_PUBLIC_ENV: production

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: autotask
          directory: .next
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          wranglerVersion: '3.80.0'

      - name: Smoke test
        run: |
          curl -f https://autotask.pages.dev || exit 1
          echo "✅ Dashboard live"
```

---

## Component 2: Cloudflare Worker (Browser Automation Backend)

### Why Workers?
- **Free tier:** 100K requests/day (MVP için yeterli)
- **Edge execution:** Global latency < 50ms
- **Zero cold starts:** V8 isolate, instant warm
- **D1/KV ready:** İleride state storage için hazır

### Deployment Steps

```bash
# 1. Worker projesi oluştur (wrangler.toml zaten mevcut)
cd /home/tolgabrk/projects/Auto-Company/projects/autotask/cloudflare-worker

# 2. Environment variables (secrets)
wrangler secret put BROWSERBASE_API_KEY
# Enter: <your-key>

wrangler secret put BROWSERBASE_PROJECT_ID
# Enter: <your-project-id>

wrangler secret put OPENAI_API_KEY
# Enter: <your-key>

# 3. Deploy
wrangler deploy
```

### Production Configuration

```toml
# cloudflare-worker/wrangler.toml (updated)
name = "autotask-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# Rate limiting (pro tier için)
[limits]
cpu_ms = 50

# Custom domain (opsiyonel)
routes = [
  { pattern = "autotask.app/api/*", zone_name = "autotask.app" }
]
```

### Monitoring

```bash
# Real-time logs
wrangler tail autotask-worker

# Analytics (Cloudflare dashboard)
# - Request count
# - Error rate
# - Response time (p50, p95, p99)
```

---

## Component 3: Chrome Extension (Chrome Web Store)

### Why Chrome Web Store?
- **Distribution:** Otomatik update, kullanıcı yoklama
- **Trust:** Review süreci güvenilirlik
- **Updates:** Kullanıcıya manifest update'i zorunsuz

### Deployment Steps

```bash
# 1. Extension build (zip)
cd /home/tolgabrk/projects/Auto-Company/projects/autotask/chrome-extension
zip -r autotask-extension.zip . -x "*.DS_Store" "*.log"

# 2. Chrome Web Store Developer Dashboard
# https://chrome.google.com/webstore/devconsole
# - New item → Upload zip
# - Store listing: description, screenshots, category
# - Privacy policy URL: https://autotask.app/privacy
# - One-time $5 developer fee

# 3. Review submit (typical: 1-3 days)
```

### Store Listing Assets

| Asset | Spec | Status |
|-------|------|--------|
| Icon 128x128 | PNG | ✅ Exists (icons/icon128.png) |
| Screenshot 1280x800 | PNG | ⚠️ Need capture |
| Promotional tile 440x280 | PNG | ⚠️ Need create |
| Privacy policy | URL | ⚠️ Need page |

### Version Management

```json
// manifest.json - version bumping
{
  "version": "0.1.0", // → "0.1.1" for bugfix
  "version": "0.2.0", // → "0.2.0" for feature
  "version": "1.0.0"  // → "1.0.0" for major
}
```

---

## Rollback Strategy

### Web Dashboard (Pages)

```bash
# Automatic rollback via GitHub Actions
# Deployments → Rollback → Previous commit
# Or manual:
wrangler pages deployment list --project-name=autotask
wrangler pages deployment rollback <project-id> <deployment-id>
```

### Worker

```bash
# View recent deployments
wrangler deployments list --name=autotask-worker

# Rollback to previous version
wrangler rollback autotask-worker
```

### Chrome Extension

```json
// Push emergency update with new version
{
  "version": "0.1.1",
  "update_url": "https://autotask.app/updates.xml"
}
```

---

## Cost Breakdown (Launch Tier)

| Service | Tier | Cost/Month |
|---------|------|------------|
| Cloudflare Pages | Free | $0 |
| Cloudflare Workers | Free (100K req/day) | $0 |
| Chrome Web Store | One-time | $5 |
| Custom Domain (opsiyonel) | Cloudflare Registrar | ~$10/year |
| **Total (Year 1)** | | **~$15 total** |

### Paid Tier Thresholds

- **Workers:** $5/mo after 100K req/day
- **Pages:** $20/mo after 500 builds/month
- **Browserbase:** $29/mo (burrow plan, 500 sessions)

---

## Security Checklist

- [ ] CORS headers configured (Worker'da mevcut)
- [ ] API keys stored as secrets (wrangler secret put)
- [ ] Rate limiting per user (ileride ekle)
- [ ] Input validation on all endpoints (Worker'da mevcut)
- [ ] CSP headers on Pages (ileride ekle)
- [ ] Subresource Integrity (ileride ekle)

---

## Monitoring & Observability

### Metrics to Track

```typescript
// Worker'a eklenecek (ileride)
export default {
  async fetch(request, env) {
    const startTime = Date.now();

    // ... request handling ...

    const duration = Date.now() - startTime;
    env.WRITER.writeDataPoint({
      blobs: [request.url],
      doubles: [duration],
      indexes: [request.method]
    });
  }
}
```

### Dashboards

- **Cloudflare Analytics** (built-in)
- **Browserbase Dashboard** (session tracking)
- **User Analytics** (ileride - Posthog veya Plausible)

---

## Next Actions (Execute Order)

1. **[ ] GitHub repo oluştur** - `gh repo create auto-company/autotask`
2. **[ ] Cloudflare Pages bağla** - GitHub repo connect
3. **[ ] Worker secrets ayarla** - `wrangler secret put ...`
4. **[ ] Worker deploy** - `wrangler deploy`
5. **[ ] Chrome Extension store listing hazırla** - Screenshots + description
6. **[ ] Privacy policy page oluştur** - `/app/privacy/page.tsx`
7. **[ ] GitHub Actions deploy workflow ekle** - `.github/workflows/deploy.yml`
8. **[ ] Smoke test** - `curl https://autotask.pages.dev`

---

## Known Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Browserbase API downtime | High | Worker mock mode fallback |
| Chrome Store rejection (4-7 days) | Medium | Self-distribution as fallback |
| Free tier exhaustion | Low | Monitor usage alert |

---

## Runbook: Incident Response

### Dashboard Down

```bash
# 1. Check status
curl https://autotask.pages.dev

# 2. Check CF status page
https://www.cloudflarestatus.com/

# 3. Rollback if recent deploy
wrangler pages deployment rollback autotask <latest-id>

# 4. Check GitHub Actions
gh run list --limit 5
```

### Worker Errors

```bash
# 1. Check logs
wrangler tail autotask-worker

# 2. Check secrets
wrangler secret list

# 3. Rollback
wrangler rollback autotask-worker
```

### Extension Issues

```bash
# 1. Test locally unpacked
chrome://extensions → Load unpacked

# 2. Check console errors
chrome://extensions → Errors

# 3. Push hotfix
# Bump version + store submission
```

---

**Decision Record:**
- No external SSH required → All via GitHub + Cloudflare
- No database → Use Supabase only when needed (post-MVP)
- No Kubernetes → Cloudflare Workers is simpler
- No custom CI → GitHub Actions is enough

**Last Updated:** 2025-01-03
**Next Review:** Post-launch or when hitting free tier limits
