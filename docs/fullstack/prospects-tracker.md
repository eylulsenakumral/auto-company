# Prospects Tracking System - NextVision Week 1

**Purpose:** Simple, effective CSV-based tracking for 50 prospects in Week 1  
**Philosophy:** Manual updates OK, speed over automation, CSV over CRM

---

## Quick Start (5 Minutes)

1. **Open the Tracker**
   ```bash
   # Local work
   code docs/sales/prospects_tracker.csv
   
   # OR import to Google Sheets for dashboard
   ```

2. **Daily Workflow (Day 2-5)**
   - Morning: Check yesterday's responses
   - Mid-day: Send new touches (10-15/day)
   - Evening: Update status columns
   - End of day: Commit changes

3. **Weekly Review (Friday)**
   - Calculate metrics (formulas below)
   - Pivot decision: Continue or change approach?

---

## Tracker Structure

### Template: `prospects_tracker_template.csv`

**Core Fields:**
- `ID, Company, EHS_Manager, Title, LinkedIn, Email, Phone` → Prospect info
- `Size, Cameras, Source` → Qualification data
- `Status` → **new / touched1 / touched2 / touched3 / replied / booked / lost**

**Touch Tracking:**
- `Touches` → Total count (0-3)
- `Touch_1_Sent, Touch_2_Sent, Touch_3_Sent` → TRUE/FALSE
- `InMail_Sent, InMail_Opened, InMail_Replied` → LinkedIn engagement
- `Email_Sent, Email_Opened, Email_Replied` → Email engagement
- `Call_1_Date, Call_1_Outcome, Call_2_Date, Call_2_Outcome` → Call results

**Funnel Tracking:**
- `Discovery_Booked_Date` → First milestone
- `Pilot_Booked, Pilot_Scheduled, Deposit_Paid` → Conversion stages

**Metrics:**
- `Reply_Rate, Conversion_Rate, Time_To_Reply_Hours` → Auto-calculated
- `Last_Contact_Date, Next_Action, Notes` → Next steps

---

## Daily Workflow

### Day 1 (Setup) ✅
- [x] Create template with sample data
- [x] Import real prospects from Bursa list
- [ ] Create Google Sheets dashboard (optional)
- [ ] Set up formulas

### Day 2-5 (Execution)

**Morning (15 min):**
```csv
1. Filter: Status = "touched1" AND Touch_1_Sent = TRUE
2. Check: InMail_Opened, Email_Opened, LinkedIn notifications
3. Update: 
   - Reply received → Status = "replied"
   - No reply → Keep "touched1" (wait 48h)
   - Bounced → Update Email field, mark in Notes
```

**Mid-day (2-3 hours):**
```csv
1. Select 10-15 "new" prospects
2. Send Touch 1 (LinkedIn InMail + Email)
3. Update tracker:
   - Touch_1_Sent = TRUE
   - Touch_1_Sent_Date = TODAY()
   - Status = "touched1"
   - Touches = 1
4. Commit: git add/commit/push
```

**Evening (15 min):**
```csv
1. Review all "touched1" + "touched2" prospects
2. Check LinkedIn/Email for replies
3. Update reply columns
4. Plan tomorrow's targets
5. Commit changes
```

---

## Metrics & Formulas

### Reply Rate Calculation
```excel
=COUNTIF(Status, "replied") / COUNTIF(Status, "touched*")
```

### Conversion Rate Calculation
```excel
=COUNTIF(Pilot_Booked, TRUE) / COUNTIF(Status, "replied")
```

### Funnel Analysis
```excel
Touched:  =COUNTIF(Touches, ">0")
Replied:   =COUNTIF(Status, "replied")
Booked:    =COUNTIF(Pilot_Booked, TRUE)
Lost:      =COUNTIF(Status, "lost")
```

### Time Metrics
```excel
Avg Reply Time:  =AVERAGE(Time_To_Reply_Hours)
Days in Funnel:  =TODAY() - Touch_1_Sent_Date
```

---

## Google Sheets Dashboard (Optional)

### Setup (10 minutes)

1. **Import CSV**
   - New Google Sheet
   - File → Import → Upload CSV
   - Use `prospects_tracker_template.csv`

2. **Create Dashboard Tab**
   - New tab named "Dashboard"
   - Link to main sheet data

3. **Add Charts**
   - **Funnel Chart:** Touched → Replied → Booked
   - **Reply Rate Trend:** Daily line chart
   - **Source Performance:** LinkedIn vs Referral vs Directory
   - **Touch Effectiveness:** Touch 1 vs Touch 2 vs Touch 3 reply rates

4. **Auto-Update**
   - Data → Refresh data source (manual)
   - OR use Google Apps Script (optional bonus)

### Sample Dashboard Layout
```
+----------------------------+
| Week 1 Metrics (Day 5)     |
+----------------------------+
| Reply Rate: 32%            |
| Booking Rate: 8%           |
| Active Prospects: 43       |
+----------------------------+

| Funnel Visual              |
| Touched: 50 ████████       |
| Replied:  16 ████          |
| Booked:   4 █              |
+----------------------------+

| Daily Performance          |
| Mon: 10 touches, 2 replies |
| Tue: 12 touches, 3 replies |
| Wed: ...                  |
+----------------------------+
```

---

## Status Values Explained

| Status | Meaning | Next Action |
|--------|---------|-------------|
| `new` | Not contacted yet | Research + Send Touch 1 |
| `touched1` | Touch 1 sent, < 48h | Wait for reply, no follow-up yet |
| `touched2` | Touch 2 sent (48h+) | Wait for reply |
| `touched3` | Touch 3 sent (96h+) | Final attempt |
| `replied` | Prospect replied | Schedule Discovery call |
| `call_booked` | Call scheduled | Confirm and prepare agenda |
| `booked` | Pilot/Demo booked | Execute pilot |
| `lost` | Not interested/not fit | Move to nurturing list |

---

## Data Hygiene Rules

### Required Fields (Don't Skip)
- ✅ Company, EHS_Manager, Title
- ✅ LinkedIn OR Email
- ✅ Status (always update)
- ✅ Touch_X_Sent (TRUE/FALSE)

### Optional (Fill When Available)
- Phone (for call follow-up)
- Size, Cameras (qualification context)
- Source (for analysis)

### Data Quality Checks
- [ ] No duplicate LinkedIn URLs
- [ ] Valid email format (check bounces)
- [ ] Phone format: +90 XXX XXX XXXX
- [ ] Date format: YYYY-MM-DD
- [ ] Status values match the list above

---

## Automation Ideas (Bonus - Week 2+)

### Simple Python Script
```python
# docs/fullstack/prospects_automation.py
import pandas as pd
from datetime import date

# Load tracker
df = pd.read_csv('docs/sales/prospects_tracker.csv')

# Calculate metrics
reply_rate = df[df['Status'] == 'replied'].shape[0] / df[df['Touches'] > 0].shape[0]
conversion_rate = df[df['Pilot_Booked'] == True].shape[0] / df[df['Status'] == 'replied'].shape[0]

# Print daily summary
print(f"Day {date.today()}: Reply Rate {reply_rate:.1%}, Conversion {conversion_rate:.1%}")
```

### Google Apps Script (Auto-Refresh)
```javascript
// Auto-refresh data daily at 6 AM
function dailyRefresh() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = sheet.getSheetByName("Prospects");
  var dashboardSheet = sheet.getSheetByName("Dashboard");
  
  // Refresh metrics
  dashboardSheet.getRange("B2").setValue("=COUNTIF(Prospects!L:L, \"replied\")/COUNTIF(Prospects!K:K, \">0\")");
}
```

---

## Pivot Decision (Friday Review)

### Metrics to Watch

**Good Signal (Continue):**
- Reply rate > 25%
- At least 1 booking by Day 5
- Positive feedback in Notes
- InMail delivery rate > 80%

**Bad Signal (Pivot):**
- Reply rate < 15% by Day 5
- Zero bookings by Day 7
- "Not interested" > 50%
- InMail delivery issues

### Pivot Options

1. **Change Message:** A/B test new outreach angle
2. **Change Channel:** Try phone instead of InMail
3. **Change Target:** Different persona (CEO vs EHS Manager)
4. **Change Offer:** Smaller pilot, lower price

---

## File Locations

```
docs/sales/
├── prospects_tracker_template.csv    # Master template
├── prospects_tracker.csv              # Active Week 1 data
├── bursa_prospects_day1.csv          # Raw prospect list
└── prospects_week1_final.csv          # End-of-week snapshot (auto-generated)
```

---

## Git Workflow

```bash
# Daily commit pattern
git add docs/sales/prospects_tracker.csv
git commit -m "sales: Day 2 touches - 15 sent, 3 replies"
git push

# Weekly milestone
git commit -m "sales: Week 1 complete - 50 touched, 12 replied, 4 booked"
```

---

## Troubleshooting

### Issue: CSV Not Saving
- **Check:** File open in another program? Close Excel/Sheets first
- **Fix:** Edit in VS Code or text editor

### Issue: Formulas Breaking
- **Check:** CSV doesn't support formulas
- **Fix:** Use Google Sheets or Excel (.xlsx) for formulas, export to CSV for git

### Issue: Duplicate Entries
- **Check:** ID column uniqueness
- **Fix:** Remove duplicates, re-index ID column

---

## Next Steps (Day 2)

1. ✅ Documentation complete
2. ⏳ Import Bursa prospects to active tracker
3. ⏳ Set up Google Sheets dashboard (optional)
4. ⏳ Send first 15 touches
5. ⏳ Update tracker end of day

---

**Remember:** The tracker is a tool, not the goal. The goal is conversations that lead to pilots. Keep updates quick (< 15 min/day) and focus on quality touches.
