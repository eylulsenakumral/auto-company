# LeadQualifier v2 — B2B Lead Scoring Tool

**Version:** 2.0 | **Date:** 2026-06-11 | **Status:** SHIPPED

---

## What's New in v2

### 5 New Features

1. **CSV Batch Import**
   - Drag-and-drop file upload
   - Parse multiple companies at once
   - Batch results table with stats
   - Columns: `domain, companySize, industry, fundingStage, growthRate, techScore`

2. **Custom Weights**
   - Adjust signal importance (5 sliders)
   - Auto-normalization to 100%
   - Persists to localStorage
   - Default: Size(25), Funding(25), Growth(20), Industry(15), Tech(15)

3. **CSV Export**
   - Export single score or entire batch
   - Format: `domain, score, tier, sizeSignal, fundingSignal, growthSignal, industrySignal, techSignal`
   - Separate buttons for JSON and CSV

4. **CRM Webhook Config**
   - Settings modal (⚙️ button)
   - HubSpot/Salesforce webhook URLs
   - "Send to CRM" button with toast notifications

5. **User-Defined Tier Thresholds**
   - Configure Hot/Warm/Cool breakpoints
   - Default: Hot≥75, Warm≥50, Cool≥25
   - Validation: Hot > Warm > Cool ≥ 0

---

## Quick Start

1. **Extract** the ZIP
2. **Open** `v2.html` in any browser
3. **Score** leads individually or via CSV batch

**No server. No API keys. Works offline.**

---

## CSV Format

Create a CSV with these headers:

```csv
domain,companySize,industry,fundingStage,growthRate,techScore
stripe.com,1000+,fintech,ipo,rapid,85
acme-corp.com,51-200,saas,series-b,moderate,60
```

**Valid values:**
- `companySize`: 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+
- `industry`: saas, fintech, ecommerce, healthcare, manufacturing, other
- `fundingStage`: bootstrapped, seed, series-a, series-b, series-c+, ipo
- `growthRate`: declining, stable, moderate, rapid
- `techScore`: 0-100 (number)

---

## Storage (localStorage)

All settings persist automatically:

| Key | Purpose |
|-----|---------|
| `leadQualifierScores` | Last 20 scores |
| `leadQualifierWeights` | Custom weights |
| `leadQualifierThresholds` | Tier breakpoints |
| `leadQualifierWebhooks` | CRM webhook URLs |

---

## Tech Stack

- Single-file HTML (2182 lines)
- PapaParse via CDN (CSV parsing)
- LocalStorage (persistence)
- Zero API keys

---

## Distribution

**Package:** `leadqualifier-v2.zip` (14KB)

**Share via:**
- GitHub Release
- Direct file link
- Email attachment

---

## Feedback

**Telegram:** @tolgabrk
**GitHub:** https://github.com/eylulsenakumral

---

*Built by Auto Company — Autonomous AI Company*
