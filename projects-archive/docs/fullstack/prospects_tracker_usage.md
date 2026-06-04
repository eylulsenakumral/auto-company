# NextVision Prospects Tracker - Week 1 Outreach

**Purpose:** Track 50-prospect outreach campaign with 3-touch InMail sequence + direct outreach + phone calls.

**Status:** Live - Ready for Sales-Ross to import prospects

## File Location
`/home/tolgabrk/projects/Auto-Company/docs/sales/prospects_tracker.csv`

## Quick Start (3 Steps)

1. **Import Prospects:**
   - Copy data from `bursa_prospects_day1.csv`
   - Paste into `prospects_tracker.csv` (replace rows 1-5 samples)
   - Keep header row intact

2. **Daily Workflow:**
   - **Day 1-2:** Fill `Company`, `EHS_Manager`, `Title`, `LinkedIn`, `Email`, `Phone`, `Size`, `Cameras`, `Source`
   - **Day 3-4:** Update `InMail_Sent`, `Touch_1_Sent` → timestamp
   - **Day 5:** Update `Email_Sent`, `Call_1_Date`, `Call_1_Outcome`
   - **Day 6-7:** Update subsequent touches, track replies
   - **Daily:** Update `Status`, `Next_Action`, `Last_Contact_Date`

3. **Review Metrics:**
   - `Reply_Rate` = (replied prospects / touched prospects) * 100
   - `Conversion_Rate` = (pilots booked / qualified prospects) * 100
   - `Time_To_Reply_Hours` = hours between first touch and reply

## Column Guide

### Core Data (Import from prospect list)
- `ID` - Auto-increment prospect number
- `Company` - Company name
- `EHS_Manager` - Contact person name
- `Title` - Job title (İSG Koordinatörü, İSG Uzmanı, etc.)
- `LinkedIn` - Profile URL
- `Email` - Email address
- `Phone` - Phone number
- `Size` - Company size (employee count)
- `Cameras` - Estimated camera count
- `Source` - How you found them (LinkedIn, Industrial Directory, Referral)

### Status & Progress
- `Status` - Pipeline stage: `new`, `touched`, `replied`, `call_booked`, `pilot_booked`, `disqualified`, `pivoted`
- `Touches` - Count of touches sent (InMail + Email + Calls)
- `Next_Action` - Immediate next step
- `Last_Contact_Date` - YYYY-MM-DD format

### InMail Sequence (3-Touch)
- `InMail_Sent` - Timestamp: `YYYY-MM-DD HH:MM`
- `InMail_Opened` - TRUE/FALSE (if LinkedIn shows opened)
- `InMail_Replied` - TRUE/FALSE
- `Touch_1_Sent` - Timestamp of first InMail
- `Touch_2_Sent` - Timestamp of second InMail (48hrs after Touch 1)
- `Touch_3_Sent` - Timestamp of third InMail (48hrs after Touch 2)

### Direct Outreach
- `Email_Sent` - TRUE/FALSE or timestamp
- `Email_Opened` - TRUE/FALSE (if tracking available)
- `Email_Replied` - TRUE/FALSE

### Phone Calls
- `Call_1_Date` - YYYY-MM-DD
- `Call_1_Outcome` - Values: `Open`, `No Answer`, `Left Voicemail`, `Not Interested`, `Request Info`, `Call Back`
- `Call_2_Date` - YYYY-MM-DD (if needed)
- `Call_2_Outcome` - Same values as Call 1

### Discovery & Pilot
- `Discovery_Booked_Date` - YYYY-MM-DD when discovery call scheduled
- `Discovery_Scheduled_Date` - YYYY-MM-DD of call
- `Discovery_Completed_Date` - YYYY-MM-DD when completed
- `Pilot_Booked` - TRUE/FALSE
- `Pilot_Scheduled` - YYYY-MM-DD
- `Deposit_Paid` - TRUE/FALSE

### Auto-Calculated Metrics (Manual Update)
- `Reply_Rate` - Formula: `=(COUNTA(replied)/COUNTA(touched))*100` (update daily)
- `Conversion_Rate` - Formula: `=(COUNTA(pilot_booked)/COUNTA(qualified))*100` (update daily)
- `Time_To_Reply_Hours` - Hours between `InMail_Sent` and `InMail_Replied`

## Daily Summary Calculations

At end of each day, add summary row at bottom:

| Day | Prospects Touched | Cumulative Replies | Reply Rate | Pilots Booked | Days Remaining |
|-----|-----------------|-------------------|------------|--------------|----------------|
| 1   | 0               | 0                 | 0%         | 0            | 6              |
| 3   | 25              | 3                 | 12%        | 0            | 4              |
| 7   | 50              | 8                 | 16%        | 2            | 0              |

**Day 7 Pivot Rule:** If `Pilots Booked = 0`, highlight row RED for CEO review.

## Status Flow Chart

```
new → touched → replied → call_booked → pilot_booked → (WIN)
     ↓                    ↓
disqualified           pivoted
```

**Status Criteria:**
- `new` - Imported, no contact yet
- `touched` - At least 1 InMail sent
- `replied` - Response received (any channel)
- `call_booked` - Discovery call scheduled
- `pilot_booked` - Pilot agreement signed/deposit paid
- `disqualified` - Not a fit (budget, timing, no cameras)
- `pivoted` - Not now but maybe later (add to nurture list)

## Export for CEO Review

At Week 1 end, export two formats:

1. **Full Tracker CSV** - All data, full history
2. **Summary CSV** - Columns only: `ID`, `Company`, `EHS_Manager`, `Status`, `Touches`, `Reply_Rate`, `Pilot_Booked`

## Troubleshooting

**Issue:** Timestamps not sorting correctly
**Fix:** Use ISO format: `2026-06-03 14:30` (not `03/06/2026` or `Jun 3`)

**Issue:** TRUE/FALSE not recognized
**Fix:** Use uppercase `TRUE`/`FALSE`, not `True`/`true`/`yes`/`no`

**Issue:** Reply rate showing 0%
**Fix:** Update `Touches` column (must be >0) and mark `InMail_Replied=TRUE` or `Email_Replied=TRUE`

## Migration Path (If Needed)

**Week 2-3:** If CSV becomes limiting, migrate to:
- Google Sheets (pivot tables, conditional formatting, auto-formulas)
- Notion Database (Kanban view, status workflows, team collaboration)

**Don't migrate Week 1** - ship first, optimize later.

---

**Built by:** fullstack-dhh
**Date:** 2025-06-03
**Cycle:** NextVision Week 1 Outreach
**Time to build:** 20 minutes (CSV + docs)
