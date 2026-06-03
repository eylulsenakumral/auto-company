# Prospects Tracker - Quick Start Guide

**Setup time: 5 minutes | Daily maintenance: 15 minutes**

---

## Option 1: CSV + Terminal (Fastest - Recommended for Day 1)

### Step 1: Open Tracker (1 min)
```bash
# Edit in VS Code
code docs/sales/prospects_tracker.csv

# OR use Google Sheets (better for dashboards)
# 1. Open Google Sheets
# 2. File → Import → Upload CSV
# 3. Select docs/sales/prospects_tracker.csv
```

### Step 2: Send First Touches (2-3 hours)
1. Select 10-15 prospects from "new" status
2. Send LinkedIn InMail + Email
3. Update tracker:
   - `Touch_1_Sent` = TRUE
   - `Touch_1_Sent_Date` = today's date
   - `Status` = "touched1"
   - `Touches` = 1

### Step 3: Run Daily Metrics (30 seconds)
```bash
# See today's performance
python3 docs/fullstack/prospects_automation.py

# Output:
# 📊 Funnel Overview
# 📈 Key Metrics
# 💡 Next Actions (automated insights)
```

### Step 4: Commit Changes (1 min)
```bash
git add docs/sales/prospects_tracker.csv
git commit -m "sales: Day 1 touches - 15 sent, 0 replies yet"
git push
```

---

## Option 2: Google Sheets Dashboard (Better for Visuals)

### Setup (10 minutes, one-time)

#### 1. Import CSV to Google Sheets
```bash
# 1. Go to sheets.google.com
# 2. New spreadsheet → "NextVision Prospects"
# 3. File → Import → Upload
# 4. Select docs/sales/prospects_tracker.csv
# 5. Replace current sheet
```

#### 2. Create Dashboard Tab
```bash
# 1. Bottom left: + → New sheet
# 2. Name it "Dashboard"
# 3. Add these metrics:
```

**Cell Formulas (copy-paste):**

```
B2: =COUNTIF(Prospects!L:L, ">0")                    # Touched count
B3: =COUNTIF(Prospects!L:L, "replied")               # Replied count
B4: =COUNTIF(Prospects!AE:AE, TRUE)                 # Booked count

B5: =B3/B2                                           # Reply rate
B6: =B4/B3                                           # Conversion rate

A8: "Funnel Visual"
A9: "Touched"
B9: =REPT("█", B2)
A10: "Replied"
B10: =REPT("█", B3)
A11: "Booked"
B11: =REPT("█", B4)
```

#### 3. Create Charts (Optional)
```bash
# 1. Select Funnel data (A8:B11)
# 2. Insert → Chart → Bar chart
# 3. Style: No title, horizontal bars
```

#### 4. Auto-Update (Manual)
```bash
# Daily: File → Import → Replace current sheet
# OR copy-paste new CSV data over existing
```

---

## Daily Checklist (Day 2-5)

### Morning (15 min)
- [ ] Run `python3 docs/fullstack/prospects_automation.py`
- [ ] Check LinkedIn for replies (notifications tab)
- [ ] Check email inbox for replies
- [ ] Update tracker: Change status to "replied" if responses received
- [ ] Note next actions for replied prospects

### Mid-Day (2-3 hours)
- [ ] Select 10-15 "new" prospects
- [ ] Research each (LinkedIn profile + company)
- [ ] Send Touch 1 (InMail + Email)
- [ ] Update tracker immediately after each touch
- [ ] Commit after batch of 5

### Evening (15 min)
- [ ] Check for new replies
- [ ] Update all reply columns
- [ ] Run metrics script
- [ ] Plan tomorrow's targets
- [ ] Commit changes
- [ ] Update `memories/consensus.md` with daily progress

---

## Status Quick Reference

| Status | Meaning | When to Update |
|--------|---------|----------------|
| `new` | Not contacted | Leave as is until touch sent |
| `touched1` | Touch 1 sent, <48h | After sending first touch |
| `touched2` | Touch 2 sent, 48h+ | After second touch |
| `touched3` | Touch 3 sent, 96h+ | After third touch |
| `replied` | Prospect responded | When reply received |
| `call_booked` | Call scheduled | After booking confirmation |
| `booked` | Pilot/Demo booked | After signed agreement |
| `lost` | Not interested | After explicit rejection |

---

## Troubleshooting

### Script not running?
```bash
# Check Python version (need 3.6+)
python3 --version

# Check file exists
ls -la docs/fullstack/prospects_automation.py

# Run with verbose output
python3 docs/fullstack/prospects_automation.py
```

### CSV not saving?
```bash
# File open elsewhere? Close Excel/Sheets first

# Use VS Code instead (no lock issues)
code docs/sales/prospects_tracker.csv
```

### Formulas breaking in Google Sheets?
```bash
# Sheet name must be "Prospects" (not "prospects")
# Rename: Right-click tab → Rename

# Column references in template:
# L = Status column
# K = Touches column
# AE = Pilot_Booked column
```

---

## Example: End of Day 2

### Terminal Output
```bash
$ python3 docs/fullstack/prospects_automation.py

============================================================
NextVision Week 1 - Outreach Metrics
Date: 2026-06-04
============================================================

📊 Funnel Overview
  Total Prospects:    25
  Touched:            25 (100.0%)
  Replied:            8 (32.0% of touched)
  Booked:             2 (25.0% of replied)
  Lost:               2

📈 Key Metrics
  Reply Rate:         32.0%
  Conversion Rate:   25.0%
  Avg Reply Time:    18.5 hours

💡 Next Actions
  ✅ Reply rate healthy - continue current approach
  ✅ 2 booking(s) - nurture pipeline

============================================================
```

### Git Commit
```bash
$ git add docs/sales/prospects_tracker.csv
$ git commit -m "sales: Day 2 touches - 10 sent, 8 replies (32% rate), 2 booked"
$ git push
```

### Consensus Update
```markdown
## Sales - Prospects Outreach (Day 2)

**Progress:**
- 25/25 prospects touched (100%)
- 8 replies received (32% reply rate)
- 2 discovery calls booked (25% conversion)

**Next Action:**
- Day 3: Send touches to remaining 25 prospects
- Focus: Reply-to-call conversion optimization
```

---

## Speed Tips

1. **Batch updates:** Don't update after every touch. Do 5 touches, then update all 5.
2. **Keyboard shortcuts:** Use Tab/Enter to navigate CSV quickly.
3. **Template values:** Use "TRUE"/"FALSE" for checkboxes - faster than typing.
4. **Date shortcuts:** Type today's date once, copy-paste for all rows.
5. **Terminal automation:** Run metrics script after each update batch.

---

## When to Use Google Sheets vs CSV

| Use CSV When | Use Sheets When |
|-------------|-----------------|
| Speed matters | Visual dashboard needed |
| Simple tracking | Multiple users updating |
| Git integration required | Charts/graphs important |
| Offline work needed | Collaborative filtering |

**Recommendation:** Start with CSV + Terminal (Day 1-3), move to Sheets if visual tracking becomes bottleneck (Day 4+).

---

**Ready to start?**

1. Open tracker: `code docs/sales/prospects_tracker.csv`
2. Run metrics: `python3 docs/fullstack/prospects_automation.py`
3. Send first touches (10-15 prospects)
4. Update + commit
5. Done! (Day 1 complete)

Total time: ~3 hours for first batch, 15 min/day thereafter.
