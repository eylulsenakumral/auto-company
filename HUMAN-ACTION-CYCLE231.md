# Cycle #231: Human Action Required

**Date:** 2026-06-04
**Product:** GitHub Release Auto-Changelog Generator
**Repo:** https://github.com/eylulsenakumral/changelog-generator
**Status:** 🟡 DAY 1 LAUNCH READY — Manual submission required

---

## What's Automated ✅

- [x] Metrics monitoring script created (`scripts/monitor-product-6.sh`)
- [x] GitHub Discussions engagement bot created (`scripts/github-discussions-engage.sh`)
- [x] All distribution templates written
- [x] Baseline metrics recorded: **0 stars** (RED status)

---

## What Needs Human Action 🚨

### 1. Hacker News Show HN Submission

**Submit to:** https://news.ycombinator.com/new

**Best timing:** Tuesday-Thursday, 9-11 AM EST (Europe afternoon)

**Copy-paste this title:**
```
Show HN: Auto Changelog Generator – Zero-config GitHub Actions for release notes
```

**Copy-paste this body:**
```
Hi HN,

I built a zero-config GitHub Actions workflow that auto-generates markdown changelogs from Git commits when you create a GitHub release.

Why:
I maintain several open-source projects. Every release, I'd waste 2-3 hours writing changelogs manually. I'd forget breaking changes. Users would complain.

Existing tools like standard-version and semantic-release are powerful but require complex configuration and npm installation. I wanted something that works out of the box.

How it works:
1. Copy one GitHub Actions workflow file to your repo
2. Push commits using conventional commits (feat, fix, etc.)
3. Create a GitHub release
4. Changelog auto-generates in markdown

Example:
Your commits:
feat(auth): add OAuth support
fix(api): resolve timeout error
feat!(db): remove old sharding layer

Auto-generated output:
### Features
- **auth**: add OAuth support (@john) [abc123d]

### Bug Fixes
- **api**: resolve timeout error (@jane) [def456g]

### Breaking Changes
- **BREAKING**: **db**: remove old sharding layer (@bob) [jkl789m]

Key differentiators:
- Zero configuration (works out of the box)
- GitHub Actions workflow (no npm install)
- Beautiful markdown output with links
- Highlights breaking changes
- Free for public repos, $9/mo for private

Tech stack:
- TypeScript
- GitHub Actions
- GitHub API (commits, PRs)
- Conventional commits parser
- Markdown generator

Link: https://github.com/eylulsenakumral/changelog-generator

Feedback welcome.
```

---

### 2. Reddit Posts (Optional but Recommended)

**Read each subreddit's rules first. Some require minimum karma or account age.**

#### r/github Post

**Title:** `[Tool] I built a zero-config changelog generator for GitHub releases – saves 2-3 hours per release`

**Body:** See `docs/operations/cycle230-plan-b-distribution.md` (lines 136-204)

#### r/devops Post

**Title:** `Auto-generate release notes from Git commits – Zero-config GitHub Actions workflow`

**Body:** See `docs/operations/cycle230-plan-b-distribution.md` (lines 208-273)

---

## After You Submit 📊

**Track metrics here:**
```bash
bash scripts/monitor-product-6.sh
```

**Day 7 Review:** Cycle #232 (48 hours from now)

**Success thresholds:**
- GREEN: 50+ HN upvotes, 10+ GitHub stars
- YELLOW: 20-50 HN upvotes, 5-10 GitHub stars
- RED: <10 HN upvotes, <5 GitHub stars

---

## Auto Company Status

**Phase:** Day 1 Launch
**Revenue:** $0
**Users:** 0
**Days to Day 7 Review:** 2

---

*Telegram: @tolgabrk | GitHub: eylulsenakumral*
