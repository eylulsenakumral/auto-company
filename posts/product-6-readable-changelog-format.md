# The Changelog Format That Users Actually Read

**TL;DR:** Most changelogs are either empty walls of text or useless one-liners. Here's the format that communicates value without wasting anyone's time. Plus: a GitHub Action that generates it automatically. [Try it now](https://github.com/eylulsenakumral/changelog-generator).

---

## The Changelog Spectrum

I've seen changelogs across the spectrum:

**Type A: The Wall of Text**
```
Release v3.2.0

Fixed the bug where clicking the button sometimes didn't work. Added support for
Dark mode across all pages. Updated the database schema to handle edge cases
in user registration. Improved performance of the dashboard by 40%. Also
fixed a memory leak in the WebSocket handler that was causing issues...
```
→ Users skim, miss details, close tab.

**Type B: The Useless One-Liner**
```
Release v3.2.0

Bug fixes and performance improvements.
```
→ Users learn nothing, stop checking.

**Type C: The Sweet Spot**
```
Release v3.2.0

## Features
- Dark mode is now available across all pages
- Export your data as CSV from the settings page

## Fixes
- Fixed button click failing on slow connections
- Corrected timezone handling in event scheduling
- Resolved memory leak in WebSocket connections

## Performance
- Dashboard loads 40% faster
- Reduced initial bundle size by 25%

## Migration Notes
If you're using custom themes, see the migration guide
```
→ Users scan, find what matters, stay informed.

The difference is structure, not length.

## What Users Actually Want

After analyzing release notes from 50+ projects, users care about:

1. **What affects me directly?** (Features, breaking changes)
2. **What problems got solved?** (Bug fixes)
3. **Do I need to do anything?** (Migration steps, action items)
4. **Everything else is secondary** (Performance, refactoring, deps)

They don't care about:
- Internal refactoring
- Test coverage improvements
- Dependency updates (unless breaking)
- "Cleaned up code"

Your changelog should reflect this priority.

## The Readable Changelog Format

Here's the template that works:

```markdown
## Release [Version] - [Date]

### Breaking Changes [IF ANY]
- [Describe what breaks and how to migrate]

### Features
- [New capabilities users can access]

### Fixes
- [Bugs that were resolved]

### Performance
- [Measurable improvements]

### Migration Notes [IF NEEDED]
- [Action items for users]

### Full Commit List
- [Link to commit range for curious users]
```

**Key principles:**

1. **Categorize everything** - Don't mix features with fixes
2. **Start with impact** - Breaking changes first
3. **Be specific** - "Fixed login" is useless, "Fixed login when using SSO" is helpful
4. **Link to details** - Deep dives go elsewhere
5. **Keep it scannable** - Bullet points, short lines, clear headings

## Examples Done Right

### Vercel

```markdown
## What's Changed

- Full_build_enabled & build.env fields for Projects @jgrubb
- Support for custom build output directory @timneutkens
- Fixed Edge Config race condition @rauchg
```

→ Short, commit-per-line, easy to scan.

### Stripe

```markdown
## New Features
- Added support for payment_method_budgets for better spend control

## API Changes
- Deprecated the old charge API in favor of Payment Intents

## Fixed
- Fixed webhook delivery delays for EU customers

## Migration Guide
See the docs for upgrading from the old charge API
```

→ Categorized, migration notes, links to docs.

### Laravel

```markdown
## New Features
- Added queued event listeners
- Added lazy factory callbacks

## Changes
- The container cache is now disabled by command

## Fixes
- Fixed artisan list command with plugins

## Security
- Fixed potential XSS in blade templates
```

→ Highlights what matters most.

## Generating This Format Automatically

The problem? Writing this manually for every release is tedious.

The solution? Let GitHub Actions do it:

```yaml
name: Generate Release Notes

on:
  release:
    types: [created]

permissions:
  contents: write

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: eylulsenakumral/changelog-generator@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

This generates:

```markdown
## Release v2.3.0

## Features
- Added dark mode support (#142)
- Implemented CSV export feature (#138)

## Fixes
- Fixed memory leak in WebSocket handler (#145)
- Corrected timezone handling (#140)

## Changes
- Updated dependencies to latest stable
- Improved error messages for auth failures
```

**Zero config.** Works with any commit style. Updates releases automatically.

## Advanced: Custom Categories

Want project-specific sections?

```yaml
- uses: eylulsenakumral/changelog-generator@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    categories: |
      Breaking Changes:
        - breaking
        - deprecate
      Security:
        - security
        - vuln
        - cve
      Features:
        - feat
        - add
        - feature
      Fixes:
        - fix
        - bug
        - resolve
```

Matches commit intent to category automatically.

## When to Add Manual Content

Automated changelogs cover 80% of cases. Add manual notes for:

1. **Migration guides** - If action is required
2. **Thank yous** - Contributors, sponsors
3. **Context** - Why a feature matters
4. **Links** - Docs, blog posts, demos

The automation gives you the foundation. You add the polish.

## The Anti-Pattern: What Not to Do

### Don't: Group by Contributor

```markdown
## @johnsmith
- Added feature X
- Fixed bug Y

## @janedoe
- Added feature Z
```

→ Users don't care who did what. They care what changed.

### Don't: Include Every Commit

```markdown
- Updated README typo
- Added unit test for helper function
- Fixed linting error
```

→ This is noise. Filter for user-facing changes.

### Don't: Use Jargon

```markdown
- Refactored singleton pattern for DI container
- Implemented strategy pattern for payment adapters
```

→ Users don't know what this means. Speak their language.

## The ROI of Good Changelogs

Projects with readable changelogs see:

- **Higher user engagement** - Users actually read what's new
- **Fewer support questions** - Answers are in the changelog
- **Better upgrade adoption** - Users know what they're getting
- **Stronger community** - Transparency builds trust

Projects without them?

- Users guessing what changed
- Support tickets for documented changes
- Slower upgrade cycles
- "What does this version even do?"

## Start in 10 Minutes

1. Add the workflow to `.github/workflows/changelog.yml`
2. Push to GitHub
3. Create a release
4. Watch your changelog populate automatically

[Get the Action here](https://github.com/eylulsenakumral/changelog-generator).

## The Bottom Line

Your changelog is not an afterthought. It's how you tell users you value their time.

Structure it. Categorize it. Make it scannable.

Then automate it so it actually happens.

---

**Star the repo:** [github.com/eylulsenakumral/changelog-generator](https://github.com/eylulsenakumral/changelog-generator)

**Found this useful?** Share it with your team. Better changelogs benefit everyone.

---

*Tags: #changelog #release-notes #documentation #user-experience #github-actions*
