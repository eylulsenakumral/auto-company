# LeadQualifier v4 — Manual Test Checklist

**Purpose:** Exploratory testing guide for v4 analytics + v3 regression
**Time Required:** ~2 hours for full pass
**Browser:** Test in Chrome, Firefox, Safari, Edge (document which)

**Instructions:**
- Check box when test passes
- Note failures with repro steps
- Use heuristic "What would a user actually do?" to find gaps

---

## Setup

- [ ] Open `v4.html` (or v4 deployment URL)
- [ ] Open DevTools Console (check for errors)
- [ ] Open Application → Local Storage (inspect data)
- [ ] Note browser and version: _____________________

---

## Part 1: Migration & First Impressions

### v3 → v4 Migration

**Context:** Existing user upgrades from v3 to v4

- [ ] **Pre-test:** Set up v3 data
  - [ ] Open `v3.html` in same browser
  - [ ] Score 3 leads manually
  - [ ] Save custom weights in settings
  - [ ] Configure a webhook (any URL)
  - [ ] Verify in localStorage: `leadQualifierHistory` has data

- [ ] **Migration Test:**
  - [ ] Close v3.html, open v4.html
  - [ ] Migration toast appears: "Data migrated from v3"
  - [ ] Check localStorage:
    - [ ] `leads` collection has 3 items
    - [ ] `settings.models.default` has custom weights
    - [ ] `settings.webhooks` has configured webhook
  - [ ] All 3 leads appear in History section
  - [ ] Analytics tab shows data (not empty)

- [ ] **Rollback Test:**
  - [ ] Close v4.html, open v3.html
  - [ ] v3 still works with all data
  - [ ] Scores, settings, webhooks intact

---

## Part 2: Analytics Dashboard

### Tab 1: Overview

- [ ] **Load Test:**
  - [ ] Click Analytics tab
  - [ ] Overview tab loads without error
  - [ ] Total leads count visible
  - [ ] Average score visible
  - [ ] Trend chart renders (canvas)

- [ ] **Interactions:**
  - [ ] Time range selector changes data
  - [ ] "Last 7 days", "Last 30 days", "All time" work
  - [ ] Hovering chart shows tooltips
  - [ ] Export button downloads CSV

### Tab 2: Sources

- [ ] **Load Test:**
  - [ ] Click Sources tab
  - [ ] Source breakdown table visible
  - [ ] Counts per source displayed
  - [ ] Attribution accurate (matches actual leads)

- [ ] **Interactions:**
  - [ ] Sorting by count works
  - [ ] Filter by source updates table
  - [ ] Source attribution pie chart renders

### Tab 3: Models

- [ ] **Load Test:**
  - [ ] Click Models tab
  - [ ] Default model shown as active
  - [ ] Model comparison table visible
  - [ ] Score differences highlighted

- [ ] **Model Switching:**
  - [ ] Create a new model (click "Save Current as Model")
  - [ ] Name it "Test Model"
  - [ ] Switch active model to "Test Model"
  - [ ] Overview tab shows updated scores
  - [ ] Switch back to default
  - [ ] Scores return to baseline

### Tab 4: Experiments (A/B Testing)

- [ ] **Load Test:**
  - [ ] Click Experiments tab
  - [ ] Empty state shown (no experiments yet)
  - [ ] "Create Experiment" button visible

- [ ] **A/B Test Flow:**
  - [ ] Click "Create Experiment"
  - [ ] Enter experiment name: "Email vs Direct"
  - [ ] Create with 2 variants: A (control), B (test)
  - [ ] Score 5 leads with Model A
  - [ ] Score same 5 leads with Model B
  - [ ] View comparison table
  - [ ] Statistical significance shown (p-value)
  - [ ] Declare winner (A or B)
  - [ ] Experiment archived, winner noted

---

## Part 3: v3 Feature Regression

### Industry Templates (v3)

- [ ] **Template Buttons:**
  - [ ] SaaS template applies correct weights
  - [ ] E-commerce template applies correct weights
  - [ ] Agency template applies correct weights
  - [ ] Custom option selected by default after template applies
  - [ ] Toast messages confirm each template

**Validation:** Check `settings.models` in localStorage after each

### Demo Mode (v3)

- [ ] **Demo Button:**
  - [ ] Click "Demo" button
  - [ ] Form populated with random lead
  - [ ] All fields filled (no empties)
  - [ ] Toast: "Demo loaded: {domain}"
  - [ ] Can score the demo lead
  - [ ] Click Demo again → different lead

**Exploratory:** What if demo lead data is invalid? (Edge case)

### Comparison Table (v3)

- [ ] **Comparison:**
  - [ ] Score 2 different leads
  - [ ] Click "Compare" in history
  - [ ] Select both leads
  - [ ] Side-by-side table shows all signals
  - [ ] Score difference highlighted
  - [ ] Tier badges correct

**Exploratory:** What if scores are identical? Any visual feedback?

### CRM Webhooks (v3)

- [ ] **Webhook Configuration:**
  - [ ] Open Settings (⚙️)
  - [ ] Enter HubSpot webhook URL
  - [ ] Enter Salesforce webhook URL
  - [ ] Save settings
  - [ ] URLs persist (check localStorage)

- [ ] **Test Button:**
  - [ ] Click "Test" next to webhook
  - [ ] Toast: "Webhook test successful" or error
  - [ ] Console shows actual HTTP request

- [ ] **Send to CRM:**
  - [ ] Score a lead
  - [ ] Click "Send to CRM"
  - [ ] Payload includes: score, tier, signals, timestamp
  - [ ] Toast confirms send

**Exploratory:** What if webhook URL is invalid? Graceful error?

---

## Part 4: Performance & Scale

### Query Performance

**Setup:** Need 100+ leads for meaningful test. Quick method:
1. Open DevTools Console
2. Run: `for(let i=0; i<100; i++) { /* simulate lead creation */ }`
(Or use CSV import if available)

- [ ] **Dashboard Load:**
  - [ ] With 100 leads, Overview tab loads <1s
  - [ ] With 100 leads, all tabs switch <500ms
  - [ ] No UI freeze or lag

- [ ] **Query Speed (Console timing):**
  - [ ] Run `histogram()` query → <50ms
  - [ ] Run `topN()` query → <40ms
  - [ ] Run `trends()` query → <80ms

**Note actual times:** _____________________

### localStorage Quota

- [ ] **Quota Warning:**
  - [ ] Add leads until near 5MB (monitor Application → Storage)
  - [ ] Warning toast appears at 80% quota
  - [ ] Export button promoted

- [ ] **Quota Exceeded:**
  - [ ] Attempt to add beyond limit
  - [ ] Graceful error (not crash)
  - [ ] User can delete old leads to free space

**Exploratory:** What happens if quota exceeded during migration?

---

## Part 5: Browser Compatibility

**Repeat core tests in each browser:**

| Browser | Version | Migration | Dashboard | v3 Features | Performance | Pass/Fail |
|---------|---------|-----------|------------|-------------|-------------|-----------|
| Chrome | _______ | [ ] | [ ] | [ ] | [ ] | _____ |
| Firefox | _______ | [ ] | [ ] | [ ] | [ ] | _____ |
| Safari | _______ | [ ] | [ ] | [ ] | [ ] | _____ |
| Edge | _______ | [ ] | [ ] | [ ] | [ ] | _____ |

**Critical:** Any console errors? Note here: _____________________

---

## Part 6: Mobile Responsive

**Test on actual device or DevTools mobile emulation:**

- [ ] **Layout:**
  - [ ] Header collapses to hamburger menu
  - [ ] All tabs accessible via menu
  - [ ] Form inputs usable (touch targets ≥44px)
  - [ ] Charts render correctly on small screen

- [ ] **Analytics on Mobile:**
  - [ ] Overview chart readable
  - [ ] Sources table scrolls horizontally
  - [ ] Models comparison stacks vertically
  - [ ] All interactions work

**Test device/emulation:** _____________________

---

## Part 7: Edge Cases & Error Handling

### Invalid Data

- [ ] **Malformed CSV Import:**
  - [ ] Upload CSV with missing columns
  - [ ] Graceful error message
  - [ ] No data corruption

- [ ] **Invalid Webhook URL:**
  - [ ] Enter "not-a-url" in webhook field
  - [ ] Validation error on save
  - [ ] Can't send to CRM with invalid URL

### Empty States

- [ ] **No Analytics Data:**
  - [ ] Clear all leads (localStorage)
  - [ ] Analytics tabs show empty states
  - [ ] Helpful messages, not blank

- [ ] **No Experiments:**
  - [ ] Experiments tab shows "Create first experiment"
  - [ ] Call-to-action clear

### Network Issues

- [ ] **Offline Mode:**
  - [ ] Disconnect network
  - [ ] App still loads (from cache)
  - [ ] All features work (no API calls)
  - [ ] Data persists in localStorage

---

## Part 8: Usability & UX (Heuristic)

### HICCUPPS Check

**Heuristic: HICCUPPS (History, Image, Comparable, Claims, User, Product, Purpose, Standards)**

- [ ] **History:** Consistent with v3 UI patterns
- [ ] **Image:** Maintains professional aesthetic
- [ ] **Comparable:** Similar to other analytics tools
- [ ] **Claims:** Documentation claims accurate?
- [ ] **User:** Matches user expectations?
- [ ] **Product:** Fits LeadQualifier brand?
- [ ] **Purpose:** Analytics serve business goal?
- [ ] **Standards:** Web standards followed?

### User Journey Walkthrough

**Role:** Sales manager using LeadQualifier for first time

- [ ] **First Impressions:**
  - [ ] Understands what analytics shows
  - [ ] Can navigate tabs intuitively
  - [ ] Knows how to get back to scoring

- [ ] **Common Tasks:**
  - [ ] Check overall lead quality
  - [ ] See which sources bring best leads
  - [ ] Compare scoring models
  - [ ] Run A/B test

**Note any confusion points:** _____________________

---

## Part 9: Security & Privacy

- [ ] **Data Privacy:**
  - [ ] No data sent to external servers (check Network tab)
  - [ ] All data in localStorage only
  - [ ] Export doesn't include credentials

- [ ] **XSS Prevention:**
  - [ ] Enter `<script>alert('xss')</script>` in company name
  - [ ] Script not executed (escaped)
  - [ ] No reflected XSS in any field

**Exploratory:** Try other XSS payloads in different fields

---

## Part 10: Final Checks

### Smoke Test (Critical Path)

- [ ] User can score a lead → see result → view analytics
- [ ] Migration works → no data loss
- [ ] All v3 features still work
- [ ] Performance acceptable
- [ ] No console errors

### Ship Decision

**Ready to ship if:**
- [ ] All smoke tests pass
- [ ] No critical bugs found
- [ ] Performance targets met
- [ ] Migration verified safe
- [ ] At least 3 browsers tested successfully

**Blocker bugs found (list):**
1. _____________________
2. _____________________
3. _____________________

**Recommendation:** [ ] Ship / [ ] Hold / [ ] Ship with warnings

---

## Test Notes

**What I explored (beyond checklist):**
- _________________________________________________
- _________________________________________________
- _________________________________________________

**Risks I see:**
- _________________________________________________
- _________________________________________________
- _________________________________________________

**What I'd test more if I had time:**
- _________________________________________________
- _________________________________________________
- _________________________________________________

---

## Sign-Off

**Tested by:** _____________________
**Date:** _____________________
**Browsers tested:** _____________________
**Hours spent:** _____________________
**Final verdict:** [ ] Pass / [ ] Fail / [ ] Pass with notes

---

*Remember: Testing is questioning. If something seems odd, investigate. The checklist is a guide, not a limit.*
