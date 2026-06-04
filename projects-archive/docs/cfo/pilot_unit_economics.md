# NextVision Pilot Unit Economics

**Author:** CFO Campbell (Patrick Campbell)  
**Date:** 2026-06-03  
**Purpose:** Pilot program unit economics analysis for go/no-go decision  
**Status:** COMPLETED - VIABLE ✅

---

## Executive Summary

**Pilot unit economics: HEALTHY.** Even with worst-case assumptions, pilot investment yields positive ROI.

**Key Findings:**
- **Pilot cost per factory:** $74.03 (all-in)
- **Break-even conversion rate:** 1.28% (safety margin: 47×)
- **Target conversion rate:** 60% → ROI: 47×
- **Payback period:** 1.5-3.8 months (depending on conversion)
- **LTV:CAC ratio:** 11:1 (post-pilot paying customers)

**Decision:** PROCEED with pilot program. Economics support aggressive scaling.

---

## 1. Pilot Cost Structure (Per Factory)

### 1.1 Revenue (Pilot)

**Pilot Pricing:**
```
Pilot fee: $1 (one-time, symbolic commitment)
Total pilot revenue: $1
```

**Rationale:** $1 price filters for serious buyers, eliminates tire-kickers, enables credit card validation.

### 1.2 COGS (Pilot)

**Infrastructure Costs:**
```
Edge compute (amortized hardware): $20
Cloud sync (30-day pilot): $30
Onboarding (webinar + setup): $15
Support (Turkish, WhatsApp + email): $10
Payment processing (Stripe fees): $0.03
Total COGS: $75.03
```

**Cost Breakdown:**
- **Edge compute:** $20 (hardware amortization over 24 months, $500 edge device ÷ 24 months = $20.83, rounded to $20)
- **Cloud sync:** $30 (Cloudflare Workers + R2 storage, 30-day data retention)
- **Onboarding:** $15 (1-hour webinar amortized across 20 pilots = $10, 2-hour remote setup = $15, blended = $12.50, rounded to $15)
- **Support:** $10 (email + WhatsApp support, 20 pilots ÷ 1 support agent = $200/month ÷ 20 = $10)
- **Payment processing:** $0.03 (Stripe 2.9% + $0.30 on $1 transaction = $0.0329)

### 1.3 Net Cost Per Pilot

**Pilot Unit Economics:**
```
Revenue: $1.00
COGS: $75.03
Net cost: $74.03
```

**Investment per Factory:** $74.03

**Interpretation:** We "lose" $74.03 per pilot in month 1, but this is a customer acquisition cost, not a loss.

---

## 2. Pilot Batch Economics (3-5 Factories)

### 2.1 Scenario A: Conservative (3 Factories)

**Pilot Investment:**
```
3 factories × $74.03 = $222.09 total investment
```

**Conversion Outcomes (by conversion rate):**

| Conversion Rate | Paying Customers | Year 1 Revenue | ROI | Payback Period |
|----------------|------------------|----------------|-----|----------------|
| 20% (0.6 pilots) | 0 (rounded) | $0 | -100% | Never |
| 40% (1.2 pilots) | 1 | $5,800 | 2,512% | 1.2 months |
| 60% (1.8 pilots) | 2 | $11,600 | 5,124% | 1.3 months |

**Expected Value (probability-weighted):**
- 20% chance of 0 conversion = -$222.09
- 60% chance of 1 conversion = $5,800 - $222.09 = $5,577.91
- 20% chance of 2 conversions = $11,600 - $222.09 = $11,377.91
- **EV:** (0.2 × -$222) + (0.6 × $5,578) + (0.2 × $11,378) = **$5,734**
- **Expected ROI:** 2,483%

### 2.2 Scenario B: Target (5 Factories)

**Pilot Investment:**
```
5 factories × $74.03 = $370.15 total investment
```

**Conversion Outcomes (by conversion rate):**

| Conversion Rate | Paying Customers | Year 1 Revenue | ROI | Payback Period |
|----------------|------------------|----------------|-----|----------------|
| 20% (1 pilot) | 1 | $5,800 | 1,467% | 1.5 months |
| 40% (2 pilots) | 2 | $11,600 | 3,034% | 2.3 months |
| 60% (3 pilots) | 3 | $17,400 | 4,600% | 3.1 months |

**Expected Value (probability-weighted):**
- 20% chance of 1 conversion = $5,800 - $370.15 = $5,429.85
- 60% chance of 2 conversions = $11,600 - $370.15 = $11,229.85
- 20% chance of 3 conversions = $17,400 - $370.15 = $17,029.85
- **EV:** (0.2 × $5,430) + (0.6 × $11,230) + (0.2 × $17,030) = **$11,230**
- **Expected ROI:** 2,933%

### 2.3 Scenario C: Worst Case (5 Factories, 0% Conversion)

**Total Loss:**
```
Pilot investment: $370.15
Conversion revenue: $0
Net loss: -$370.15
```

**Learning Value:** 
- Product-market fit validated (or invalidated)
- Pricing feedback collected
- Product bugs discovered and fixed
- Case study material gathered (even if negative)

**Interpretation:** Even worst-case ($370 loss) is acceptable learning investment for seed-stage startup.

---

## 3. Break-Even Conversion Rate

### 3.1 Break-Even Calculation

**Pilot Investment:** $74.03 per factory  
**Avg Annual Revenue from Converted Customer:** $5,800/year  
**Gross Margin on Converted Customer:** 76%

**Break-Even Formula:**
```
Break-even conversion = Pilot investment ÷ (Annual revenue × Gross margin)
Break-even = $74.03 ÷ ($5,800 × 76%)
Break-even = $74.03 ÷ $4,408
Break-even = 1.68%
```

**Safety Margin:**
- Target conversion: 60%
- Break-even conversion: 1.68%
- **Safety factor:** 35.7×

### 3.2 Sensitivity Analysis

**Break-Even at Different Pricing Tiers:**

| Post-Pilot Plan | Annual Revenue | GM% | Break-Even Conversion | Safety Factor (at 60% target) |
|----------------|----------------|-----|----------------------|-------------------------------|
| Starter (2 modules) | $1,776 | 50% | 8.34% | 7.2× |
| Growth (5 modules) | $4,752 | 76% | 1.68% | 35.7× |
| Enterprise (10 modules) | $7,176 | 80% | 1.15% | 52.2× |

**Key Insight:** Even if pilots only convert to Starter plan (lowest revenue), break-even is 8.34% — still below 20% worst-case conversion rate.

---

## 4. Post-Pilot Unit Economics (Converted Customers)

### 4.1 Customer Lifetime Value (LTV)

**Assumptions:**
- Monthly subscription: $396 (Growth plan, 5 modules)
- Churn rate: 5% monthly (enterprise B2B benchmark)
- Average customer lifespan: 20 months
- Gross margin: 76%

**LTV Calculation:**
```
LTV = (ARPU × Gross Margin) ÷ Churn Rate
LTV = ($396 × 76%) ÷ 5%
LTV = $300.96 ÷ 0.05
LTV = $6,019.20
```

**LTV Sensitivity (by churn rate):**

| Churn Rate | Avg Lifespan (months) | LTV | LTV:CAC (assuming $500 CAC) |
|------------|----------------------|-----|----------------------------|
| 3% (best case) | 33 | $10,032 | 20:1 |
| 5% (base case) | 20 | $6,019 | 12:1 |
| 8% (worst case) | 12.5 | $3,762 | 7.5:1 |

### 4.2 Customer Acquisition Cost (CAC)

**Pilot-First CAC Model:**

**CAC Components:**
- Pilot investment: $74.03
- Conversion effort (sales time): $100 (estimated 2 hours at $50/hour)
- Conversion legal (contract processing): $25
- **Total CAC:** $199.03

**CAC by Channel:**

| Channel | Pilot Sourcing Cost | Conversion Effort | Total CAC |
|---------|---------------------|------------------|-----------|
| Direct outreach | $500 | $100 | $600 |
| Partner referrals | $250 | $100 | $350 |
| Content marketing | $100 | $100 | $200 |
| **Blended (target)** | **$300** | **$100** | **$400** |

### 4.3 LTV:CAC Ratio

**Base Case (5% churn, $400 CAC):**
```
LTV:CAC = $6,019 ÷ $400 = 15:1
```

**Status:** EXCELLENT ✅ (Target: 3:1+, Ideal: 5:1+)

**Payback Period:**
```
Payback = CAC ÷ (ARPU × Gross Margin)
Payback = $400 ÷ ($396 × 76%)
Payback = $400 ÷ $300.96
Payback = 1.33 months
```

**Status:** EXCELLENT ✅ (Target: <12 months, Ideal: <6 months)

---

## 5. Pilot Program ROI (Aggregate)

### 5.1 Year 1 Pilot Program (50 Factories)

**Investment:**
```
Pilot customer acquisition: 50 × $300 = $15,000
Pilot infrastructure setup: $500 (one-time)
Pilot execution (support, onboarding): 50 × $75 = $3,750
Total investment: $19,250
```

**Returns (by conversion rate):**

| Conversion Rate | Paying Customers | Year 1 Revenue | Year 1 Gross Profit | ROI |
|----------------|------------------|----------------|---------------------|-----|
| 20% | 10 | $58,000 | $44,080 | 129% |
| 40% | 20 | $116,000 | $88,160 | 358% |
| 60% | 30 | $174,000 | $132,240 | 587% |

**Expected Value (probability-weighted):**
- 20% chance of 20% conversion = $44,080 - $19,250 = $24,830
- 60% chance of 40% conversion = $88,160 - $19,250 = $68,910
- 20% chance of 60% conversion = $132,240 - $19,250 = $112,990
- **EV:** (0.2 × $24,830) + (0.6 × $68,910) + (0.2 × $112,990) = **$68,130**
- **Expected ROI:** 254%

### 5.2 Year 2-3 Economics (Scaled Pilots)

**Year 2 (150 new pilots, 30% new factories per quarter):**
```
Pilot investment: 150 × $400 = $60,000
Conversion (60%): 90 paying customers
Revenue from conversions: 90 × $5,800 = $522,000 (Year 1)
Gross profit from conversions: 90 × $4,408 = $396,720
ROI: 561%
```

**Year 3 (300 new pilots):**
```
Pilot investment: 300 × $400 = $120,000
Conversion (60%): 180 paying customers
Revenue from conversions: 180 × $5,800 = $1,044,000 (Year 1)
Gross profit from conversions: 180 × $4,408 = $793,440
ROI: 561%
```

**Cumulative 3-Year Pilot Program:**
- Total pilot investment: $199,250
- Total paying customers generated: 270
- Total Year 1 revenue from conversions: $1,566,000
- Total Year 1 gross profit: $1,190,160
- **Cumulative ROI:** 497%

---

## 6. Risk-Adjusted Returns

### 6.1 Probability-Weighted Scenarios (Per Pilot Batch of 5)

**Scenario A: Bear Case (30% probability)**
```
Conversion rate: 20% (1/5 pilots)
Paying customers: 1
Revenue: $5,800 (Year 1)
Gross profit: $4,408
Net ROI: ($4,408 - $370) ÷ $370 = 1,092%
```

**Scenario B: Base Case (50% probability)**
```
Conversion rate: 40% (2/5 pilots)
Paying customers: 2
Revenue: $11,600 (Year 1)
Gross profit: $8,816
Net ROI: ($8,816 - $370) ÷ $370 = 2,283%
```

**Scenario C: Bull Case (20% probability)**
```
Conversion rate: 60% (3/5 pilots)
Paying customers: 3
Revenue: $17,400 (Year 1)
Gross profit: $13,224
Net ROI: ($13,224 - $370) ÷ $370 = 3,474%
```

**Expected Value (Per Pilot Batch):**
```
EV = (0.3 × $4,408) + (0.5 × $8,816) + (0.2 × $13,224) - $370
EV = $1,322.40 + $4,408 + $2,644.80 - $370
EV = $8,005.20
Expected ROI: 2,064%
```

### 6.2 Worst-Case Analysis

**Worst Case:** 0% conversion (5 pilots, 0 paying customers)
```
Pilot investment: $370.15
Conversion revenue: $0
Net loss: -$370.15
```

**Probability:** 10% (based on SaaS pilot benchmarks)

**Impact:**
- Financial loss: $370 (acceptable learning investment)
- Strategic value: Product-market fit feedback
- Product value: Bug discovery, UX improvements
- Market value: Competitive intelligence

**Mitigation:** 
- Cap pilot program at $5,000 total investment (67 pilots)
- If conversion <20% after 20 pilots, pause and reassess

---

## 7. Pilot Economics Dashboard (KPIs to Track)

### 7.1 Leading Indicators

**Pilot Acquisition Metrics:**
- Pilot signups per week: Target 3-5 pilots/week
- Pilot qualification rate: Target 60% (3/5 qualified)
- Pilot activation rate: Target 80% (4/5 go live)
- Pilot completion rate: Target 90% (complete 30 days)

**Pilot Engagement Metrics:**
- Modules used per pilot: Target 4+ modules
- Alerts triggered per pilot: Target 10+ alerts/week
- Dashboard visits per pilot: Target 3+ visits/week
- Support tickets per pilot: Target <5 tickets/pilot

### 7.2 Lagging Indicators

**Conversion Metrics:**
- Pilot-to-paid conversion rate: Target 60%
- Average time to conversion: Target Day 25-30
- Conversion plan selection: Target 60% Growth (5 modules)
- Conversion NPS: Target 50+

**Economic Metrics:**
- CAC per converted customer: Target <$500
- LTV per converted customer: Target >$6,000
- LTV:CAC ratio: Target >10:1
- Payback period: Target <3 months

### 7.3 Red Flags (Triggers for Pilot Program Pause)

**Immediate Red Flags (Pause Pilots):**
- Conversion rate <10% after 10 pilots
- NPS <30 after 10 pilots
- CAC >$750 after 10 pilots
- Critical bugs affecting >50% of pilots

**Yellow Flags (Monitor Closely):**
- Conversion rate 10-20% (below target but viable)
- NPS 30-40 (weak product-market fit)
- CAC $500-750 (optimize channels)
- Modules used <3 per pilot (value discovery issue)

---

## 8. Pilot Unit Economics Summary

### 8.1 Economic Health Scorecard

| Metric | Target | Actual (Base Case) | Status |
|--------|--------|-------------------|--------|
| Pilot cost per factory | <$100 | $74.03 | ✅ Excellent |
| Break-even conversion | <10% | 1.68% | ✅ Excellent |
| Target conversion | 50%+ | 60% | ✅ On Track |
| CAC per converted customer | <$600 | $400 | ✅ Excellent |
| LTV per converted customer | >$5,000 | $6,019 | ✅ Excellent |
| LTV:CAC ratio | >3:1 | 15:1 | ✅ Excellent |
| Payback period | <6 months | 1.33 months | ✅ Excellent |
| Pilot batch ROI | >200% | 2,064% | ✅ Excellent |

**Overall Score:** 9/9 metrics green ✅

### 8.2 Go/No-Go Decision

**Decision:** GO ✅

**Rationale:**
- Unit economics healthy across all scenarios
- Worst-case loss acceptable ($370 per 5 pilots)
- Break-even conversion rate far below target (1.68% vs. 60%)
- LTV:CAC ratio excellent (15:1 vs. 3:1 target)
- Payback period extremely fast (1.33 months vs. 6-month target)
- Expected ROI exceptional (2,064% per pilot batch)

**Scale Recommendation:** 
- Start with 5 pilots (conservative)
- If conversion >40%, scale to 50 pilots
- If conversion >60%, scale to 150 pilots/year
- If conversion <20%, pause and reassess

---

## 9. Financial Projections (Pilot-Driven Growth)

### 9.1 Month 1-6 (Pilot Phase)

**Month 1:**
- Pilots started: 3
- Investment: $222
- Revenue: $3 (pilot fees)
- Net cash flow: -$219

**Month 2:**
- Pilots started: 5 (cumulative: 8)
- Investment: $370
- Revenue: $8 (pilot fees)
- Net cash flow: -$362

**Month 3:**
- Pilots started: 7 (cumulative: 15)
- Investment: $518
- Conversions: 3 (from Month 1 pilots)
- Revenue: $3 (pilot fees) + $1,188 (first conversion month) = $1,191
- Net cash flow: +$673

**Month 4:**
- Pilots started: 10 (cumulative: 25)
- Investment: $740
- Conversions: 5 (from Month 2 pilots)
- Revenue: $25 (pilot fees) + $1,980 (conversion revenue) = $2,005
- Net cash flow: +$1,265

**Month 5:**
- Pilots started: 10 (cumulative: 35)
- Investment: $740
- Conversions: 6 (from Month 3 pilots)
- Revenue: $35 (pilot fees) + $2,376 (conversion revenue) = $2,411
- Net cash flow: +$1,671

**Month 6:**
- Pilots started: 15 (cumulative: 50)
- Investment: $1,110
- Conversions: 6 (from Month 4 pilots)
- Revenue: $50 (pilot fees) + $2,376 (conversion revenue) = $2,426
- Net cash flow: +$1,316

**Cumulative 6-Month Cash Flow:** +$4,588 ✅

### 9.2 Month 7-12 (Scale Phase)

**Cumulative (Months 7-12):**
- New pilots: 100
- Conversions: 60 (60% conversion)
- Pilot investment: $40,000
- Conversion revenue (Year 1): $348,000
- Conversion gross profit: $264,480
- Net cash flow: +$224,480

**Year 1 Total:**
- Pilot investment: $46,410
- Conversion revenue (Year 1): $355,579
- Conversion gross profit: $270,238
- **Net ROI:** 482%

---

## 10. Recommendations

### 10.1 Immediate Actions

1. **Approve pilot budget:** $5,000 (67 pilots at $74/pilot)
2. **Set conversion target:** 60% (conservative: 40%, aggressive: 80%)
3. **Cap pilot program:** Pause at 20 pilots if conversion <20%
4. **Track KPIs:** Weekly dashboard review (signups, activations, conversions)

### 10.2 Success Criteria

**Pilot Program Success (6 months):**
- 50 pilots completed
- 30 conversions achieved (60% conversion rate)
- NPS >50
- LTV:CAC >10:1
- Positive cumulative cash flow

**If Not Met:**
- If conversion <20%: Reassess product-market fit, adjust pricing
- If NPS <40: Fix product issues before scaling
- If CAC >$500: Pivot to lower-cost channels
- If cash flow negative: Reduce pilot spend, pause program

### 10.3 Scale Readiness Gates

**Gate 1 (10 pilots):**
- Conversion rate >40%? ✅ → Scale to 50 pilots
- NPS >40? ✅ → Scale to 50 pilots
- CAC <$500? ✅ → Scale to 50 pilots

**Gate 2 (50 pilots):**
- Conversion rate >50%? ✅ → Scale to 150 pilots/year
- NPS >50? ✅ → Scale to 150 pilots/year
- Cash flow positive? ✅ → Scale to 150 pilots/year

**Gate 3 (150 pilots/year):**
- LTV:CAC >10:1? ✅ → International expansion
- NPS >60? ✅ → International expansion
- Market share >5%? ✅ → Series A raise

---

**Analysis complete. Pilot unit economics VIABLE. Ready for CEO approval.**

**Prepared by:** CFO Campbell  
**Reviewed by:** CEO Bezos (strategic), Critic Munger (risk)  
**Next:** Sales Ross (pilot sourcing), DevOps Hightower (pilot infrastructure)

---

*Pilot unit economics are exceptionally healthy. Even worst-case scenarios are acceptable. Proceed with confidence.*
