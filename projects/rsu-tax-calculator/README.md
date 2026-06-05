# RSU Tax Calculator

**Free, open-source tax calculator for Restricted Stock Units (RSUs) and Incentive Stock Options (ISOs).**

> ⚠️ **DISCLAIMER: This calculator is for educational purposes only and does not constitute tax, legal, or financial advice. Consult a qualified tax professional for your specific situation.**

## Features

- ✅ **Sell Now vs. Sell Later** - Compare scenarios to optimize your tax outcome
- ✅ **Tax Bracket Visualization** - See exactly how your income is taxed
- ✅ **Capital Gains Analysis** - Short-term vs. long-term holding periods
- ✅ **AMT Exposure for ISOs** - Alternative Minimum Tax calculations
- ✅ **Print/PDF Export** - Save your calculations for your records

## Tech Stack

- **Framework:** Next.js 16.2.7 (App Router, React Server Components)
- **Runtime:** React 19
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Tax Engine:** Custom TypeScript (pure functions, 100% testable)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Vercel Deployment

This project is configured for one-click deployment on Vercel:

1. Push to GitHub
2. Import to Vercel
3. Deploy (no environment variables required for MVP)

## Tax Year: 2025

This calculator uses the latest 2025 IRS tax brackets:

| Rate | Single (min-max) | MFJ (min-max) |
|------|------------------|---------------|
| 10%  | $0 - $11,600     | $0 - $23,200  |
| 12%  | $11,600 - $47,150 | $23,200 - $94,300 |
| 22%  | $47,150 - $100,525 | $94,300 - $201,050 |
| 24%  | $100,525 - $191,950 | $201,050 - $383,900 |
| 32%  | $191,950 - $243,725 | $383,900 - $487,450 |
| 35%  | $243,725 - $609,350 | $487,450 - $731,200 |
| 37%  | $609,350+        | $731,200+     |

**Standard Deductions:**
- Single: $14,600
- MFJ: $29,200
- HOH: $21,800

## API

### POST /api/calculate

Calculate tax for a single scenario:

```json
{
  "shares": 100,
  "vestPrice": 50,
  "sellPrice": 60,
  "otherIncome": 100000,
  "filingStatus": "SINGLE",
  "compare": false
}
```

Response:
```json
{
  "proceeds": 6000,
  "ordinaryTax": 0,
  "capitalGainsTax": 225,
  "totalTax": 225,
  "netProceeds": 5775,
  "effectiveRate": 0.0375,
  "year": 2025,
  "holdingPeriod": "SHORT"
}
```

Compare scenarios (set `"compare": true`):

```json
{
  "shares": 100,
  "vestPrice": 50,
  "sellPrice": 60,
  "otherIncome": 100000,
  "filingStatus": "SINGLE",
  "compare": true
}
```

## Open Source

This project is open source. View the code on GitHub:

[https://github.com/eylulsenakumral/rsu-tax-calculator](https://github.com/eylulsenakumral/rsu-tax-calculator)

## License

MIT License - Free for personal and commercial use.

## Updates

Tax brackets and standard deductions are updated annually for the new tax year. Star the repo to get notified of updates.

---

**Built with 2025 IRS data. Last updated: June 2025**
