# Distribution Infrastructure - Week 1

Production-ready scripts for tracking and growing product distribution across HN, Reddit, GitHub, and email.

## Scripts

### 1. HN Auto-Poster (`hn-poster.cjs`)

Post to Hacker News with optimal timing and content format.

```bash
# Show optimal posting times
node hn-poster.cjs best-time

# Create a post (returns direct URL for manual submission)
node hn-poster.cjs post --title "ReviewFlow: AI Code Review CLI" --url "https://github.com/..."

# Track an existing post
node hn-poster.cjs track 12345678
```

**Best practices:**
- Post 9-10 AM ET Tuesday for maximum engagement
- Keep titles under 80 characters
- Add context in first comment after posting
- Engage with comments early

### 2. Reddit Engagement Tracker (`reddit-tracker.cjs`)

Track Reddit post metrics across relevant subreddits.

```bash
# Scan subreddit for posts
node reddit-tracker.cjs scan --subreddit "webdev" --query "code review,PR triage"

# Track a specific post
node reddit-tracker.cjs track --post "https://reddit.com/r/webdev/comments/xyz/"

# Generate daily summary
node reddit-tracker.cjs daily-report
```

**Monitored subreddits:**
- r/webdev
- r/SideProject
- r/devtools
- r/SaaS
- r/startups

### 3. GitHub Issue Scanner (`gh-issue-scanner.cjs`)

Find outreach opportunities by scanning GitHub issues.

```bash
# Scan for issues with default keywords
node gh-issue-scanner.cjs scan

# Custom query
node gh-issue-scanner.cjs scan --query "code review CLI"

# Daily digest
node gh-issue-scanner.cjs digest
```

**Default keywords:**
- code review
- PR triage
- AI slop
- CI/CD
- pull request automation
- code quality
- linting
- pre-commit
- code formatting

### 4. Star Monitoring Dashboard (`star-monitor.cjs`)

Track star counts across all repos with daily delta reports.

```bash
# Scan all repos for current owner
node star-monitor.cjs scan --owner "your-username"

# Generate daily report
node star-monitor.cjs report

# Set alert threshold (default: 5 stars/day)
node star-monitor.cjs alert-threshold 10
```

**Features:**
- Tracks growth over 90 days
- Alerts on star spikes
- Shows growth leaders (last 24h)
- Average growth per repo

### 5. Hashnode Cross-Poster (`hashnode-poster.cjs`)

Post articles to Hashnode via GraphQL API.

```bash
# List your publications (to get publication ID)
HASHNODE_TOKEN=xxx node hashnode-poster.cjs --list-publications

# Preview what will be published (dry-run)
HASHNODE_TOKEN=xxx HASHNODE_PUBLICATION_ID=yyy node hashnode-poster.cjs

# Actually publish
HASHNODE_TOKEN=xxx HASHNODE_PUBLICATION_ID=yyy node hashnode-poster.cjs --execute
```

**Setup:**
1. Get Personal Access Token: https://hashnode.com/settings/developer
2. Find your Publication ID (run `--list-publications` or check URL)
3. Set environment variables or pass inline
4. Articles are sourced from `docs/marketing/reviewflow-launch/*.md`

**Article Frontmatter Format:**
```yaml
---
title: Your Post Title
tags: javascript, cli, tools
cover_image: https://example.com/cover.jpg
---
```

**Features:**
- GraphQL-based API integration
- Dry-run mode for preview
- Automatic retry on network errors
- Saves outcomes to `data/distribution/outcome/`
- Supports cover images and tags

### 6. dev.to Cross-Poster (`devto-poster.cjs`)

Post articles to dev.to via REST API.

```bash
# Preview what will be published
DEVTO_API_KEY=xxx node devto-poster.cjs

# Actually publish
DEVTO_API_KEY=xxx node devto-poster.cjs --execute
```

**Setup:**
1. Get API key: https://dev.to/settings/account
2. Articles sourced from same directory as Hashnode

### 7. Email Landing Page (`email-landing.html`)

Simple landing page for email capture.

**Setup:**
1. Replace `YOUR_FORM_ID` with your Formspree form ID
2. Or integrate with your email service (ConvertKit, Mailchimp, etc.)
3. Deploy to any static host (GitHub Pages, Netlify, Vercel)

**Features:**
- Responsive design
- Form validation
- Success message
- No JS framework required

## Data Storage

All tracking data is stored in `data/distribution/`:

```
data/distribution/
├── reddit-tracker.json    # Tracked Reddit posts
├── gh-issues.json         # Scanned GitHub issues
└── star-monitor.json      # Star history and deltas
```

## Daily Workflow

1. **Morning (9 AM ET):**
   - Check `hn-poster.cjs best-time` - if optimal, post
   - Run `star-monitor.cjs scan --owner "your-username"`
   - Review `star-monitor.cjs report`

2. **Mid-day:**
   - Run `gh-issue-scanner.cjs scan` - find outreach opportunities
   - Check `reddit-tracker.cjs daily-report`

3. **Evening:**
   - Track any new posts/comments
   - Review engagement metrics

## Requirements

- Node.js (v18+)
- GitHub CLI (`gh`) - for issue scanner and star monitor
- Formspree account (optional) - for email landing page

## Next Steps

1. Set up Formspree for email landing page
2. Create automated cron jobs for daily scans
3. Integrate with existing GitHub workflows
4. Add analytics tracking to landing page
