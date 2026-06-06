# Manual Action Summary — ReviewFlow Launch

**Cycle:** #499
**Date:** 2026-06-06 (Saturday)
**Status:** 🟡 READY FOR MANUAL EXECUTION

---

## Blockers

| Task | Status | Reason |
|------|--------|--------|
| GitHub Outreach | 🔴 BLOCKED | GITHUB_TOKEN not set in environment |
| Reddit Posting | 🔴 MANUAL | No authenticated API available |
| HN Post | 🟢 SCHEDULED | Tuesday 2026-06-09 09:00 AM ET |

---

## Action Items (Priority Order)

### 1. GITHUB_TOKEN Setup (Required for GitHub Outreach)

**Location:** Environment variable or .env file

**Steps:**
```bash
# Option A: Set in shell
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxx

# Option B: Create .env file in project root
echo "GITHUB_TOKEN=ghp_xxxxxxxxxxxxxx" >> /home/tolgabrk/projects/Auto-Company/.env

# Then execute
GITHUB_TOKEN=$(grep GITHUB_TOKEN .env | cut -d= -f2) node scripts/distribution/gh-outreach.cjs --execute
```

**Result:** Will post 31 relevant comments to GitHub issues

---

### 2. Reddit Posting (Manual Browser Required)

**Timing:** Saturday 2026-06-06 recommended (less competition)

**Subreddits:**

| Subreddit | Title Template | Post File | Priority |
|-----------|----------------|-----------|----------|
| r/webdev | "Built a tool to escape the AI-generated PR avalanche" | reddit-webdev.md | HIGH |
| r/SideProject | "[Side Project] Escaped the AI PR avalanche" | reddit-sideproject.md | MEDIUM |
| r/devtools | "[Tool] ReviewFlow – CLI tool for PR triage" | reddit-devtools.md | LOW |

**Steps:**
1. Open Reddit in browser
2. Go to subreddit
3. Click "Create Post"
4. Copy title from template
5. Copy body from template file
6. Add screenshot (optional): CLI output showing risk categorization
7. Post and save URL
8. Update tracking: `data/distribution/reddit-metrics.json`

**Post Files Location:** `/home/tolgabrk/projects/Auto-Company/docs/marketing/reviewflow-launch/`

---

### 3. HN Post (Automatic - Scheduled)

**Date:** Tuesday 2026-06-09
**Time:** 9:00 AM ET (4:00 PM Istanbul)
**Script:** `scripts/distribution/hn-poster.cjs`
**Post:** `docs/marketing/reviewflow-launch/hn-post.md`

**Will execute automatically if scheduled or can be run manually:**
```bash
node scripts/distribution/hn-poster.cjs
```

---

## Success Metrics (Check on 2026-06-13)

### Minimum Viable (1/3 = GREEN)
- [ ] 20+ stars on ReviewFlow
- [ ] HN post 30+ upvotes
- [ ] Reddit 50+ upvotes OR 10+ comments

### Target
- [ ] 50+ stars on ReviewFlow
- [ ] HN front page
- [ ] Reddit viral (100+ upvotes)

---

## Decision Framework (Week 3: 2026-06-13)

**GREEN (2/3 criteria met):**
- Resume product shipping
- Distribution validated

**YELLOW (1/3 criteria met):**
- Iterate messaging
- Try different subreddits
- Adjust positioning

**RED (0/3 criteria met):**
- Root cause analysis
- Next product pivot
- Consider distribution channel failure

---

## Files Reference

| File | Purpose |
|------|---------|
| `scripts/distribution/gh-outreach.cjs` | GitHub outreach script (31 issues ready) |
| `scripts/distribution/hn-poster.cjs` | HN posting script |
| `scripts/distribution/star-monitor.cjs` | Star growth tracking |
| `docs/marketing/reviewflow-launch/reddit-posting-guide.md` | Reddit posting guide |
| `docs/marketing/reviewflow-launch/reddit-*.md` | Reddit post templates |
| `docs/marketing/reviewflow-launch/hn-post.md` | HN post template |
| `data/distribution/baseline-week2.json` | Baseline metrics |
| `data/distribution/gh-issues.json` | 90 GitHub issues (31 relevant) |

---

*This file: /home/tolgabrk/projects/Auto-Company/data/distribution/MANUAL_ACTIONS.md*
