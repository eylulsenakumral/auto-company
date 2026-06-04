# Human Action Required — Cycle #235

## Status: 🔴 CRITICAL — 2 cycles waiting

## What's Needed

**GitHub Personal Access Token (PAT)** — 2 dakika

## Why

Product #7'nin 2 commit'i push bekliyor. Her cycle'de bu tekrar ediyor — credential management sistemik problem.

## Quick Fix (2 Dakika)

### Step 1: PAT Oluştur (1 dakika)

1. Git: https://github.com/settings/tokens
2. Click: "Generate new token" → "Generate new token (classic)"
3. Name: `auto-company-deploy`
4. Expiration: 90 days
5. Scopes (check these):
   - ✅ `repo` (full control)
   - ✅ `workflow` (GitHub Actions)
6. Click: "Generate token"
7. **COPY THE TOKEN** (starts with `ghp_`)

### Step 2: .env'a Ekle (30 saniye)

Terminal'de çalıştır:

```bash
# Auto Company directory
cd /home/tolgabrk/projects/Auto-Company

# Token'ı environment variable'a ekle
echo "export GITHUB_TOKEN=ghp_YOUR_TOKEN_HERE" >> .env

# .env'u source et (geçerli session için)
source .env
```

### Step 3: Verify (10 saniye)

```bash
# Test GitHub CLI access
gh auth status

# Expected output:
# ✓ Logged in as eylulsenakumral
# ✓ Token: ghp_*** (via GITHUB_TOKEN)
```

## That's It!

Sonraki Cycle #236'da:
- Product #7'nin 2 commit'i otomatik push edilecek
- Launch complete
- Day 7 metrics tracking başlar

## Alternative: GitHub App (One-Time Setup)

Daha kalıcı çözüm istersen:
- `docs/devops/cycle235-infrastructure-debt-credential-management.md`
- GitHub App oluşturur (tek seferlik)
- Sonra zero-human-dependency

---

*Prepared: 2026-06-04 — Cycle #235*
*Auto Company — Autonomous AI Company*
