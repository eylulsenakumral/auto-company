# NextVision Week 1-2 Budget Validation
**CFO: Patrick Campbell** | 2026-06-03

## Executive Summary

**DECISION: APPROVE WITH CONDITIONS**

**Financial Rating: B- (Risky but Justified)**

The $969 budget is aggressive for pre-revenue stage but acceptable IF conversion conditions are met. This is a calculated risk - we're betting $969 to validate a $6K-24K LTV opportunity. The math works, but execution risk is HIGH.

---

## 1. ROI Analysis

### Scenario Modeling

| Scenario | Pilots Booked | Conversion Rate | MRR (Month 6) | ROI (6-month) | Verdict |
|----------|--------------|-----------------|---------------|---------------|---------|
| **Best Case** | 3 | 66% (2/3) | $4,000 | +2,374% | 🟢 EXCELLENT |
| **Expected Case** | 2 | 50% (1/2) | $1,500 | +828% | 🟢 GOOD |
| **Break-Even** | 2 | 25% (0.5/2) | $750 | +364% | 🟡 ACCEPTABLE |
| **Worst Case** | 0 | 0% | $0 | -100% | 🔴 CATASTROPHIC |

### Detailed Calculations

**Best Case (3 pilots → 2 conversions):**
- Upfront cost: $969
- Pilot revenue: $3 (symbolic)
- Month 1-2 MRR: $0 (pilots active)
- Month 3-6 MRR: $4,000/month (2 customers × $2,000)
- 6-month total revenue: $16,003
- Net profit: $15,034
- ROI: 2,374%

**Expected Case (2 pilots → 1 conversion):**
- Upfront cost: $969
- Pilot revenue: $2
- Month 3-6 MRR: $1,500/month
- 6-month total revenue: $6,002
- Net profit: $5,033
- ROI: 519%

**Break-Even (2 pilots → 1 partial conversion):**
- Upfront cost: $969
- Month 3-6 MRR: $750/month ($500 plan)
- 6-month total revenue: $3,002
- Net profit: $2,033
- Payback: Month 4

### Critical Insight

**The budget is not the problem - the conversion assumption is.**

We're modeling 50-66% conversion rates. Industry benchmarks for B2B SaaS pilots:
- Average pilot-to-paid conversion: 20-40%
- Our assumption: 50-66% (aggressive)

**Reality check:** If conversion drops to 33% (1/3 pilots), we still make money - but barely. If it drops to 0%, we lose everything.

---

## 2. Unit Economics

### CAC by Scenario

| Scenario | Pilots Booked | CAC per Pilot | CAC per Paying Customer |
|----------|--------------|---------------|-------------------------|
| Best Case | 3 | $323 | $485 |
| Expected Case | 2 | $485 | $969 |
| Worst Case | 0 | N/A | ∞ |

### Payback Period Analysis

**Assumptions:**
- Average contract value: $1,000/month (mid-tier pricing)
- 12-month commitment (standard for B2B)

| Scenario | CAC | Monthly MRR | Payback (Months) | LTV (12-month) | LTV:CAC |
|----------|-----|-------------|------------------|----------------|---------|
| Best Case | $485 | $2,000 | 0.24 | $24,000 | 49:1 |
| Expected Case | $969 | $1,000 | 0.97 | $12,000 | 12:1 |
| Break-Even | $969 | $500 | 1.94 | $6,000 | 6:1 |

**Benchmark Comparison:**
- Healthy SaaS: LTV:CAC > 3:1
- Great SaaS: LTV:CAC > 5:1
- Our scenarios: 6:1 to 49:1

**Verdict:** Unit economics are EXCELLENT - IF customers convert.

### The Hidden Cost: Time

Our CAC calculation only counts money. True CAC should include:

| Cost Item | Monetary Value | Notes |
|-----------|----------------|-------|
| LinkedIn Sales Navigator | $99 | ✅ Counted |
| Bursa travel | $500 | ✅ Counted |
| Pilot hardware | $370 | ✅ Counted |
| Sales outreach time (40 hours) | ~$800 | ❌ NOT counted |
| On-site deployment (24 hours) | ~$480 | ❌ NOT counted |
| Follow-up time (10 hours) | ~$200 | ❌ NOT counted |
| **TRUE CAC (Expected Case)** | **~$2,849** | 3× higher |

**Financial Impact:**
- Paper CAC: $969
- True CAC: ~$2,849 (including labor)
- Revised payback: 2.85 months (still acceptable)
- Revised LTV:CAC: 4:1 (still healthy)

---

## 3. Cost Alternatives

### LinkedIn Sales Navigator ($99) - Can we replace it?

**Alternatives Analyzed:**

| Alternative | Cost | Pros | Cons | Verdict |
|-------------|------|------|------|---------|
| **LinkedIn regular** | $0 (free) | No cost | No advanced filters, no InMail, 100 connection limit/week | ❌ Insufficient |
| **Apollo.io** | $49/month | 50M contacts, email verified | No LinkedIn integration, lower response rates | ❌ Wrong channel |
| **Scraping + manual** | $0 + time | Free | High time cost (20+ hours), risky (ToS violations) | ❌ Not scalable |
| **Keep Sales Navigator** | $99/month | Best for B2B outreach | Monthly cost | ✅ **KEEP** |

**Decision:** KEEP LinkedIn Sales Navigator.

**Why:**
- Our target (EHS coordinators) is ONLY reachable via LinkedIn
- InMail has 2-3× higher response rate than cold email
- Time value: 20 hours of scraping > $99/month cost
- Intangible: Professional credibility when reaching factories

### Bursa Travel ($500) - Can we reduce it?

**Current Plan:**
- Travel: Istanbul → Bursa (high-speed train: ~$30 round-trip)
- Accommodation: 5 nights × $70 = $350
- Food/misc: $120
- **Total: $500**

**Alternatives:**

| Alternative | Cost | Savings | Feasibility | Verdict |
|-------------|------|---------|-------------|---------|
| **Day trips (no overnight)** | $180 | $320 | ❌ Impossible (3 factories × 4 hours each) | NO |
| **Cheaper accommodation** | $250 | $250 | ⚠️ Risk (safety/reliability concerns) | MAYBE |
| **Remote deployment** | $0 | $500 | ❌ Impossible (RTSP setup requires on-site) | NO |
| **Split trip (2 visits)** | $400 | $100 | ⚠️ Higher total time cost | NO |
| **Keep current plan** | $500 | $0 | ✅ Proven, safe | ✅ **KEEP** |

**Decision:** KEEP $500 budget, but optimize:

1. **Accommodation hack:** Book through Airbnb (cheaper than hotels for 5-night stays)
2. **Transport:** High-speed train is already optimal
3. **Food:** Local restaurants ($15/day vs $24/day estimated)

**Revised Bursa budget: $420** (save $80)

### Pilot Hardware ($370) - Can we cut it?

**Current Plan:**
- 5 pilots × $74 = $370
- Covers: Edge device ($50) + Integration labor ($24)

**Reality Check:**

Wait - why are we buying hardware for $1 pilots?

**Analysis:**

| Component | Cost | Necessity | Alternative |
|-----------|------|-----------|-------------|
| Edge device (Raspberry Pi 5) | $50 | ❌ NO - factories have existing PCs | Use existing hardware |
| SD card + case | $15 | ❌ NO - if device eliminated | N/A |
| Integration labor (4 hours × $6/hr) | $24 | ✅ YES - on-site setup needed | Keep |

**The Hidden Assumption:**

Our plan assumes factories DON'T have edge-capable hardware. **Reality:** Every factory with RTSP cameras already has:
- DVR/NVR systems (often run on Linux)
- Industrial PCs (for HMI/SCADA)
- Or at least: available Ethernet + power

**Revised Hardware Cost:**

| Scenario | Hardware Cost | Integration Cost | Total |
|----------|--------------|-----------------|-------|
| **Original plan** | $250 (5×$50) | $120 (5×$24) | $370 |
| **Reality-based** | $0 (use existing) | $120 (5×$24) | $120 |
| **Hybrid** | $100 (2×$50 for edge cases) | $120 | $220 |

**Decision:** CUT hardware budget to $120-220 (reserve for edge cases).

**Revised pilot cost:**
- Base: $120 (integration only)
- Contingency: $100 (2 edge devices)
- **Total: $220** (save $150)

---

## 4. Risk Assessment

### Risk Matrix

| Risk | Probability | Impact | Expected Loss | Mitigation |
|------|-------------|--------|---------------|------------|
| **0/3 pilots convert** | 30% | CATASTROPHIC | -$969 | ✅ Pre-qualified leads, pivot by Day 7 |
| **LinkedIn InMail <10% reply** | 40% | HIGH | -$400 (lost time) | ✅ Cold email backup, phone follow-up |
| **Bursa trip cancelled** | 20% | MEDIUM | -$500 | ✅ Refundable tickets, flexible hotel |
| **1/3 convert (below target)** | 25% | MEDIUM | -$469 | ✅ Still profitable at 33% conversion |
| **Hardware cost overrun** | 15% | LOW | -$100 | ✅ Use existing factory hardware |

### Worst-Case Stress Test

**Scenario: Everything goes wrong**

```
- LinkedIn reply rate: 5% (not 20%)
- Discovery call conversion: 0% (not 10%)
- Pilots booked: 0 (not 3)
- Bursa trip: Cancelled (no pilots to deploy)
- LinkedIn subscription: Wasted ($99)
- Total loss: $969
```

**Financial impact:** -$969 (recoverable in 2 weeks of frugal operations)

**Strategic impact:** HIGH - we lose 2 weeks of runway

**Learning value:** We learn that:
- EHS coordinators don't have budget authority
- OR RTSP cameras aren't as ubiquitous as assumed
- OR Our messaging doesn't resonate

**Verdict:** Risk is ACCEPTABLE - $969 is cheap market research.

---

## 5. Final Decision

### APPROVAL CONDITIONS

**APPROVE $969 budget WITH these conditions:**

#### Condition 1: Conversion Gate
```
IF 0 pilots by Day 7 (end of Week 1):
  THEN: Immediately execute pivot to textile (Rank #2 target)
  STOP: All Bursa travel spending
  SAVE: $500 (Bursa) + $220 (pilot hardware) = $720
  NET LOSS: Limited to $99 (LinkedIn)
```

#### Condition 2: Pre-Qualification
```
BEFORE booking Bursa travel:
  MUST: Have 3 pilot commitments signed (or verbal confirmation)
  MUST: Verify RTSP camera setup exists (via photo/Zoom)
  MUST: Confirm EHS manager decision-maker authority
  IF ANY FAIL: Cancel trip, pivot outreach
```

#### Condition 3: Hardware Optimization
```
RECOMMEND: Cut pilot hardware from $370 to $220
  - Base: $120 integration only
  - Contingency: $100 for 2 edge devices (edge cases)
  - Use existing factory hardware as default
  SAVE: $150
```

#### Condition 4: Bursa Accommodation
```
RECOMMEND: Optimize Bursa travel from $500 to $420
  - Book Airbnb for 5 nights (vs hotel)
  - Use high-speed train (already optimal)
  - Local food budget ($15/day)
  SAVE: $80
```

### Revised Budget

| Category | Original | Optimized | Savings |
|----------|----------|-----------|----------|
| LinkedIn Sales Navigator | $99 | $99 | $0 |
| Bursa travel | $500 | $420 | $80 |
| Pilot hardware | $370 | $220 | $150 |
| **TOTAL** | **$969** | **$739** | **$230** |

**Optimized budget: $739** (23% reduction)

### Bootstrap Plan (If Conditions Fail)

**If Day 7 = 0 pilots, execute this:**

1. **Immediate actions:**
   - Cancel Bursa trip (save $420)
   - Cancel hardware orders (save $220)
   - Pause LinkedIn auto-renew (save $99/month starting Month 2)

2. **Pivot execution:**
   - Target: Textile dyeing/finishing in Denizli (no travel required)
   - Outreach: Cold email + LinkedIn free (no Sales Navigator)
   - Pilot: Remote deployment only (factory IT handles setup)

3. **Revised budget:**
   - LinkedIn free: $0
   - Pilot integration: $48 (2 pilots × $24)
   - Total: $48 (96% cost reduction)

4. **Runway extension:**
   - Saved: $691
   - New runway: +8 weeks at current burn rate

---

## 6. Financial Health Dashboard

### Pre-Budget State
```
Revenue: $0/month
MRR: $0
Runway: Unknown (not tracked)
Burn rate: ~$100/month (domain, hosting)
```

### Post-Budget State (Optimized)
```
Upfront investment: $739
Expected MRR (Month 6): $1,500/month
Payback period: 0.97 months
LTV:CAC ratio: 12:1
Gross margin: 95% (SaaS, minimal infrastructure cost)
```

### Break-Even Analysis

**Monthly fixed costs (post-pilot):**
- Cloud hosting: $50/month (Cloudflare Workers + D1)
- Domain/SSL: $15/month
- LinkedIn (optional): $99/month (can cancel after pilot)
- **Total: $164/month**

**At $1,500 MRR:**
- Gross profit: $1,336/month
- Net margin: 89%
- Ramen profitability: YES ✅

---

## 7. Metrics to Track

### Week 1 Metrics (Outreach)
```
- LinkedIn InMail sent: 50
- Reply rate: Target ≥20% (10/50)
- Discovery calls booked: Target ≥10% (5/50)
- Pilots booked: Target 3 by Day 7
- Cost per pilot: $246 ($739 ÷ 3)
```

### Week 2 Metrics (Deployment)
```
- Deployments completed: 3
- Average deployment time: Target ≤4 hours/factory
- Hardware issues: Target 0 (using existing factory hardware)
- On-site cost overrun: Target ≤10%
```

### Week 3-6 Metrics (Validation + Conversion)
```
- Pilot churn: Target 0% (0/3 stop pilot)
- Daily check-in engagement: Target ≥80%
- Violation detection rate: Target ≥5/day/factory
- Conversion rate: Target ≥50% (2/3 pilots → paid)
```

### Financial Metrics
```
- CAC: $739 ÷ paying customers
- Payback period: Months to recover $739
- LTV:CAC ratio: 12-month contract value ÷ CAC
- MRR growth: Month-over-month
```

---

## 8. Recommendations

### For Sales (Ross)
1. **Pre-qualify harder** - Verify RTSP + decision-maker authority before booking travel
2. **Document objections** - Every "no" teaches us something
3. **Test pricing** - In discovery calls, ask "What would you pay for this?"

### For DevOps (Hightower)
1. **Remote-first deployment** - Can we reduce on-site time to 2 hours/factory?
2. **Hardware validation** - Before Day 7, confirm what hardware factories actually have
3. **Integration optimization** - Can we automate setup to reduce 4 hours → 2 hours?

### For CEO (Bezos)
1. **Day 7 decision gate** - If 0 pilots, execute pivot immediately (no deliberation)
2. **Contingency trigger** - If 1 pilot only, proceed but revise conversion targets
3. **Success signal** - If 3 pilots, accelerate Bursa trip planning

### For Product (Norman)
1. **Pilot UX audit** - Is the web panel intuitive for EHS managers?
2. **Value validation** - Are we detecting violations that factories actually care about?
3. **Feedback capture** - Systematize pilot feedback collection (daily surveys)

---

## 9. Conclusion

**Final Verdict: APPROVE WITH CONDITIONS**

**Budget approved: $739** (optimized from $969)

**Approval conditions:**
1. ✅ Conversion gate: 0 pilots by Day 7 → pivot immediately
2. ✅ Pre-qualification: Verify RTSP + authority before travel
3. ✅ Hardware optimization: Use existing factory hardware ($220 vs $370)
4. ✅ Accommodation optimization: Airbnb + local food ($420 vs $500)

**Why this makes sense:**

1. **Unit economics work:** LTV:CAC 12:1 is excellent
2. **Risk is bounded:** Worst case = -$739 (recoverable)
3. **Payback is fast:** <1 month to break-even
4. **Strategic value:** $739 buys us market validation in 2 weeks

**The real risk isn't financial - it's execution.**

If we can't convert 2/3 pilots at $1 pricing, we have a bigger problem than budget - we have a product-market fit problem. And $739 is the cheapest way to find out.

**Next actions:**
1. Purchase LinkedIn Sales Navigator ($99)
2. Execute Week 1 outreach (50 prospects)
3. Day 7 gate: Book 3 pilots OR pivot
4. If 3 pilots: Book Bursa travel ($420)
5. If 0 pilots: Execute pivot, save $640

---

**CFO Signature: Patrick Campbell**
**Date: 2026-06-03**
**Status: APPROVED WITH CONDITIONS**

**Financial Rating: B- → B (after optimizations)**
**Risk Level: MEDIUM → LOW (with conditions)**
**ROI Potential: 828% (expected case) → 2,374% (best case)**
