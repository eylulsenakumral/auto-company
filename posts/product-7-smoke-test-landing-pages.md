---
title: "Auto-Deploy Smoke Test Landing Pages with GitHub Actions"
description: "Automate smoke test landing page deployment with GitHub Actions. Consistent visibility for every deployment."
tags: ['github', 'actions', 'testing', 'landing-pages']
cover_image: "https://dev.to/uploads/articles/cover_image_placeholder.png"
published: false
---

## Every Deployment Deserves a Landing Page

You ship code. Stakeholders ask "Is it working?" You open dev tools, click around, paste screenshots in Slack.

Next deployment: Same dance.

Smoke tests are your first line of defense against broken deployments. But keeping smoke test landing pages updated is manual work that gets skipped.

**What if every deployment automatically generated a fresh smoke test landing page?**

## The Problem: Manual Smoke Test Pages

- **Inconsistent updates** - Someone forgets to deploy the smoke test page
- **Stale links** - Slack bookmarks point to last month's version
- **No history** - Can't easily verify what was live in production last week
- **Friction** - Manual deployment steps slow down the feedback loop

QA engineers waste time tracking down the right smoke test URL instead of actually testing.

## The Solution: GitHub Actions + Auto-Deploy

**Week 1 Smoke Test Landing Pages** is a GitHub Action that automatically deploys smoke test landing pages as part of your CI/CD pipeline.

Every deployment = Fresh smoke test page = Clear visibility

### Quick Start

Add this to your `.github/workflows/smoke-test.yml`:

```yaml
name: Deploy Smoke Test Landing Page

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy Smoke Test Page
        uses: eylulsenakumral/smoke-test-landing-pages@v1
        with:
          deployment-url: ${{ secrets.PRODUCTION_URL }}
          test-cases: |
            - Home page loads
            - Login works
            - Checkout flow complete
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### What You Get

- **Automatic deployment** - Smoke test page deploys with every push to main
- **Consistent URL pattern** - `smoke-test-<commit-sha>.vercel.app` or similar
- **Test checklist built-in** - Your smoke test cases displayed on the page
- **One-click verification** - Stakeholders click, see, confirm

## Best Practices for Smoke Test Landing Pages

### 1. Keep It Focused

```yaml
test-cases: |
  - ✅ Home page loads under 2s
  - ✅ Main CTA clickable
  - ✅ Auth redirect works
  - ✅ Critical API responds
```

**3-5 critical paths.** Not 50. Smoke tests are about confidence, not coverage.

### 2. Make It Visible

Add the smoke test URL to your deployment Slack message:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Deployed to production",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Smoke Test:* <${{ steps.smoke-test.outputs.url }}|Verify Now>"
            }
          }
        ]
      }
```

### 3. Version Control Your Test Cases

Store smoke test definitions in code, not in workflow YAML:

```yaml
# smoke-tests.json
{
  "critical_paths": [
    {"name": "Home Load", "url": "/", "expected_status": 200},
    {"name": "Login", "url": "/login", "selector": "#login-form"}
  ]
}
```

### 4. Add Visual Regression

Pair your smoke test page with screenshot comparison:

```yaml
- name: Visual Regression
  run: |
    npx playwright screenshot http://prod-url.com --output=prod.png
    npx playwright screenshot http://smoke-test-url.com --output=smoke.png
    diffimg prod.png smoke.png
```

## The Benefits

| Before | After |
|--------|-------|
| Manual deployment | Automatic with every push |
| "Did you update the page?" | Always current |
| Stale Slack links | Predictable URL pattern |
| No deployment history | Git-tracked test cases |
| QA hunting for URLs | One-click visibility |

## For QA Engineers

You're no longer the bottleneck for deployment verification. The smoke test page is ready before you finish reading the deployment notification.

Focus on exploratory testing. The smoke test page handles the obvious checks.

## For Developers

Ship with confidence. The smoke test page is your first automated verification step. If the smoke test page shows red flags, rollback before users notice.

## For Stakeholders

Transparency without technical friction. Click the link, scan the checklist, confirm deployment success. No "how do I check if it's working?" emails.

## Get Started

```bash
# Add to your repo
gh workflow create smoke-test.yml
# Or use the template
curl -O https://raw.githubusercontent.com/eylulsenakumral/smoke-test-landing-pages/main/.github/workflows/deploy.yml
```

Repository: [eylulsenakumral/smoke-test-landing-pages](https://github.com/eylulsenakumral/smoke-test-landing-pages)

---

**Every deployment deserves visibility. Automate your smoke test landing pages today.**
