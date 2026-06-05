# LeadQualifier

**Local-First B2B Lead Scoring Tool**

Qualify leads instantly with transparent scoring signals. No API keys, no cloud, no setup. Opens in your browser and works entirely offline.

## What It Does

LeadQualifier helps B2B sales teams prioritize leads by scoring them based on key company signals:

- **Company Size** — Employee count indicates deal size potential
- **Funding Stage** — Backed companies have bigger budgets
- **Growth Rate** — Rapid growth = urgent needs
- **Industry Fit** — Some verticals convert better
- **Tech Sophistication** — Modern tech stack = easier sales motion

Output: A 0-100 score with tier classification (Hot/Warm/Cool/Cold).

## Quick Start

1. Open `index.html` in any modern browser
2. Enter a company domain and details
3. Get instant score with breakdown
4. Export or copy results

That's it. No installation, no dependencies.

## How Scoring Works

```
Total Score = Sum of Signal Scores (normalized to 0-100)

Signal Weights:
├── Company Size:      0-25 points
├── Funding Stage:     0-25 points
├── Growth Rate:       0-20 points
├── Industry Fit:      0-15 points
└── Tech Score:        0-15 points

Tiers:
├── 75-100: 🔥 Hot Lead    — Prioritize immediately
├── 50-74:  🌡️ Warm Lead   — Strong opportunity
├── 25-49:  ❄️ Cool Lead   — Worth monitoring
└── 0-24:   ❄️ Cold Lead   — Low priority
```

## Features

### Local-First Architecture
- Runs entirely in browser
- No API calls or network requests
- Scores stored in localStorage
- Works offline after first load

### Transparent Signals
See exactly WHY each lead scored that way. No black-box algorithms. Every signal contribution is visible.

### History & Recall
Last 20 scores saved locally. Click any history item to reload details.

### Export Options
- **JSON Export** — Full data dump for your CRM
- **Copy Report** — Formatted text for Slack/email

## Use Cases

**For Sales Teams:**
- Triage inbound leads automatically
- Know who to call first each morning
- Justify lead prioritization to management

**For Founders:**
- Qualify outbound prospect lists
- Score your ideal customer profile
- Benchmark competitor leads

**For Investors:**
- Quick signal checks on portfolio
- Pre-filter deal flow
- Track prospect health over time

## Browser Support

Works in any modern browser with ES6+ support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## File Structure

```
leadqualifier/
├── index.html    # The complete app (HTML/CSS/JS all inline)
└── README.md     # This file
```

Single-file architecture = zero complexity.

## Data Privacy

- All data stays in your browser
- Nothing sent to external servers
- localStorage only (cleared when you clear browser data)
- No cookies, no tracking, no analytics

## Roadmap

If there's demand, future versions may add:
- [ ] CSV import for batch scoring
- [ ] Custom weight configuration
- [ ] Integration hooks (HubSpot, Salesforce)
- [ ] Team scoring with shared storage

Let us know what you'd use.

## Feedback & Issues

**Telegram:** @tolgabrk
**GitHub:** https://github.com/eylulsenakumral

Built with ❤️ by [Auto Company](https://github.com/eylulsenakumral) — Autonomous AI Company

---

**License:** MIT — Use freely, attribute kindly.

---

*Ship-ready. No setup required. Double-click `index.html` to start qualifying leads.*