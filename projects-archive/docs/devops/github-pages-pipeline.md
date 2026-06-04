# GitHub Pages Deployment Pipeline

## Status

- **Workflow:** `.github/workflows/deploy-gh-pages.yml` created
- **Source:** `public/` directory (Notion Template Pack landing page)
- **Target:** `https://tolgabrk.github.io/Auto-Company/`
- **Current Blocker:** SSH key not added to GitHub

## Authentication Fix

### Option 1: Add SSH Key to GitHub (Recommended)

1. Copy public key:
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Go to https://github.com/settings/keys
3. Click "New SSH Key"
4. Paste the key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO1s94NJc+giRoY2mhGuFcf9wKfn1l0Gzf6l/LWq0XdW`
5. Save

6. Test connection:
```bash
ssh -T git@github.com
```

7. Push commits:
```bash
git remote set-url origin git@github.com:tolgabrk/Auto-Company.git
git push -u origin main
```

### Option 2: Personal Access Token

1. https://github.com/settings/tokens → Generate new token
2. Scopes: `repo`, `workflow`
3. Use token for HTTPS push:
```bash
git push https://<TOKEN>@github.com/tolgabrk/Auto-Company.git main
```

## Enable GitHub Pages (One-time)

After SSH key is fixed and code is pushed:

1. Go to https://github.com/tolgabrk/Auto-Company/settings/pages
2. Source: **GitHub Actions** (not "Deploy from a branch")
3. Save

## Workflow Behavior

- **Trigger:** Push to `main` branch
- **Manual:** Actions tab → "Deploy to GitHub Pages" → "Run workflow"
- **Build:** No build step (static HTML already in `public/`)
- **Deploy:** Actions uploads `public/` as Pages artifact

## Verification

After successful workflow run:
```bash
curl -I https://tolgabrk.github.io/Auto-Company/
```

Should return `200 OK`.

## Files

- Workflow: `.github/workflows/deploy-gh-pages.yml`
- Landing page: `public/index.html`, `public/download.html`
- Templates: `public/templates/`
- Download asset: `public/notion-template-pack.zip`

## Troubleshooting

### "Permission denied (publickey)"
→ SSH key not added to GitHub. See Option 1 above.

### "Authentication failed" (HTTPS)
→ Token expired or invalid. Generate new PAT (Option 2).

### Workflow fails with "artifact not found"
→ `public/` directory missing or empty. Check:
```bash
ls -la public/
```

### Pages shows 404
- Settings → Pages → Source is "GitHub Actions" (not "Deploy from branch")
- Workflow completed successfully (green checkmark)
- Wait 1-2 minutes for DNS propagation

## Quick Deploy Command (After SSH Fix)

```bash
cd /home/tolgabrk/projects/Auto-Company
git add -A
git commit -m "chore: update landing page"
git push origin main
```

Workflow auto-triggers on push. No manual steps needed.
