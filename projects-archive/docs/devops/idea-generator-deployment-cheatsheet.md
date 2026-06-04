# Business Idea Generator - Deployment Cheat Sheet

**Quick Reference for Human Deployment Operator**

---

## Pre-Flight Check (30 seconds)

```bash
cd /home/tolgabrk/projects/Auto-Company/projects/business-idea-generator

# Verify build works
npm run build

# Check git status
git status
```

**Expected:** Build completes in <2 min, git status clean

---

## One-Line Deployment (after OAuth)

```bash
cd /home/tolgabrk/projects/Auto-Company/projects/business-idea-generator && vercel deploy --prod
```

**Expected output:**
```
✓ Linked to username/business-idea-generator
✓ Detected Next.js
✓ Build completed
🌍 Production: https://business-idea-generator-xxx.vercel.app
```

---

## Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | `npm run build` locally first |
| 404 errors | Check `app/` directory structure |
| Can't deploy | Verify Vercel OAuth with GitHub |
| Rollback needed | `vercel rollback` |

---

## Verification (1 minute)

```bash
# Get deployment URL
vercel ls

# Test with curl
curl -I https://your-deployment-url.vercel.app

# Check logs
vercel logs
```

---

## Emergency Rollback

```bash
# Rollback to previous deployment
vercel rollback
```

---

**Total time from OAuth to live: 5 minutes**
