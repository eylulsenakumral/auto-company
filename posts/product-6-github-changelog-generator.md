---
title: "Automate GitHub Release Changelogs with This Action"
description: "Stop writing changelogs manually. Auto-generate release notes from Git commits with this GitHub Action. Save time, stay consistent."
cover_image: https://dev.to/cdn-cgi/image/width=1000;height=420;fit=cover;gravity=auto/https://github.com/eylulsenakumral/changelog-generator/raw/main/assets/cover.png
tags: github, actions, automation, changelog
series: Auto Company Products
published: true
date: 2025-06-04
canonical: https://github.com/eylulsenakumral/changelog-generator
---

## The Pain is Real

You just merged the last PR for v1.2.0. Time to create the GitHub release and... **write the changelog manually**. Again.

Scroll through 47 commits. Remember what each PR did. Copy-paste commit messages. Format the Markdown. Miss that one breaking change. Spend 30 minutes on something that should take 30 seconds.

**This is boring. This is error-prone. This is not why you became a developer.**

## What if It Just... Happened?

Imagine creating a release and the changelog writes itself. Categorized, formatted, linked to commits and PRs. No copy-paste, no memory games, no Markdown formatting.

That's what **Auto Changelog Generator** does.

[Get it on GitHub Marketplace](https://github.com/marketplace/actions/auto-changelog-generator)

## What Makes This Different

### No Manual Work
Add the workflow to your repo. That's it. Every release gets an auto-generated changelog.

### Smart Filtering
Ignores noise commits (chore, docs, style). Highlights what matters (feat, fix, **BREAKING CHANGE**).

### Conventional Commits
Uses the standard you're already following. No new syntax to learn.

### Zero Cost for Open Source
Free for public repos. Pro plan ($9/mo) for private repos.

## Quick Start — 3 Minutes, 3 Steps

### 1. Add the Workflow

Create `.github/workflows/changelog.yml`:

```yaml
name: Generate Changelog

on:
  release:
    types: [published]

permissions:
  contents: write
  pull-requests: read

jobs:
  changelog:
    runs-on: ubuntu-latest

    steps:
      - name: Generate Changelog
        uses: eylulsenakumral/changelog-generator@v1
        id: changelog
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          repo: ${{ github.repository }}
          tag: ${{ github.event.release.tag_name }}

      - name: Update Release
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.updateRelease({
              owner: context.repo.owner,
              repo: context.repo.repo,
              release_id: context.payload.release.id,
              body: `${{ steps.changelog.outputs.changelog }}`
            })
```

### 2. Push a Commit

```bash
git add .github/workflows/changelog.yml
git commit -m "feat: add auto-changelog workflow"
git push
```

### 3. Create a Release

Next time you create a release on GitHub, the changelog generates automatically.

## What the Output Looks Like

Your messy commits:

```
feat(auth): add OAuth support
fix(api): resolve timeout error
feat!(db): remove old sharding layer
docs: update README
test: add auth tests
```

Becomes clean, professional release notes:

```markdown
### Features
- **auth**: add OAuth support ([@john](https://github.com/john)) ([`abc123d`](https://github.com/repo/commit/abc123def))

### Bug Fixes
- **api**: resolve timeout error ([@jane](https://github.com/jane)) ([`def456g`](https://github.com/repo/commit/def456ghi))

### Breaking Changes
- **BREAKING**: **db**: remove old sharding layer ([@bob](https://github.com/bob)) ([`jkl789m`](https://github.com/repo/commit/jkl789mno))
```

## When This is Perfect For You

- **Open source maintainers** — Your contributors deserve proper credits
- **Solo developers** — Stop wasting time on repetitive tasks
- **Small teams** — Consistent release notes without process overhead
- **SaaS products** — Professional changelogs build trust with customers

## Optional: Customize the Rules

Create `.changelogrc.json` in your repo root:

```json
{
  "ignoreTypes": ["chore", "docs", "style"],
  "sectionsOrder": ["feat", "fix", "BREAKING CHANGE", "refactor"],
  "highlightBreaking": true,
  "linkFormat": "pr"
}
```

## The Philosophy

Shipping is hard enough. Writing release notes shouldn't be a chore.

This Action follows the **Purple Cow** principle: it's remarkable because it just works. No configuration needed for the basics. No learning curve. Add it to your repo, forget it exists.

Your users get clear, consistent release notes. You get your time back.

## Get Started Now

[Install from GitHub Marketplace](https://github.com/marketplace/actions/auto-changelog-generator) or [check the repo](https://github.com/eylulsenakumral/changelog-generator).

---

**Built by Auto Company** — We build tools that developers actually want to use.

What's your current changelog process? Still writing them by hand? Let me know in the comments.
