# NextVision Pilot Program - Final Pricing Strategy

**Author:** CFO Campbell (Patrick Campbell)  
**Date:** 2026-06-03  
**Status:** FINAL - Ready for CEO Approval  
**Program:** NextVision Occupational Safety Pilot

---

## Executive Summary

**Pilot Pricing Strategy:** Validation-first pricing with low-friction entry, designed to prove value before commitment.

**Core Pilot Terms:**
- **Price:** $1 for 30 days (symbolic commitment, not freemium)
- **Includes:** All 10 modules + cloud sync + onboarding
- **Target:** 3-5 factories for initial pilot batch
- **Conversion Goal:** 60% pilot-to-paid conversion
- **ROI Target:** 6.1× return on pilot investment

**Strategic Rationale:** $1 pricing filters for serious buyers while minimizing acquisition friction. Credit card required eliminates tire-kickers. Full access to all modules enables multi-module discovery and upsell path.

---

## 1. Pilot Program Design

### 1.1 Pricing Structure

**Pilot Package ($1 for 30 days):**
- All 10 NextVision modules (occupational_safety, machine_safety, fire, industrial, quality, vehicle, retail, security, productivity, textile)
- Cloud sync enabled (multi-site visibility, centralized dashboard)
- Mobile app access
- Onboarding webinar (1 hour, recorded for replay)
- Email + WhatsApp support (Turkish language)
- Custom setup assistance (2 hours remote configuration)

**Total Value:** $879 (modules) + $99 (cloud) = $978/month  
**Pilot Price:** $1/month  
**Effective Discount:** 99.9%

**Post-Pilot Conversion Pricing:**

| Conversion Path | Price | Discount | Target GM |
|----------------|-------|----------|-----------|
| Starter (2 modules) | $148/month | 85% off regular | 50-60% |
| Growth (5 modules) | $396/month | 20% off regular | 65-75% |
| Enterprise (all 10 + cloud) | $598/month | Regular price | 75-85% |

### 1.2 Pilot Duration & Timing

**Duration:** 30 calendar days from signup  
**Start Date:** Flexible (factory chooses activation date)  
**Auto-Conversion:** Day 31 → auto-converts to Growth plan (5 modules @ $396/month) unless cancelled  
**Cancellation Notice:** 3 days before day 30 required

**Timing Strategy:**
- Allow factories to align pilot with production schedules
- Avoid shift change periods, maintenance windows, holidays
- Recommend 2-week minimum "clean data" period for meaningful metrics

---

## 2. Pilot Unit Economics

### 2.1 Per-Pilot Customer Economics

**Revenue:**
```
Pilot fee: $1 (nominal, symbolic)
Total pilot revenue: $1
```

**COGS:**
```
Infrastructure (edge compute amortized): $20
Cloud sync (30-day pilot): $30
Onboarding (webinar + setup): $15
Support (Turkish, WhatsApp + email): $10
Payment processing: $0.03
Total COGS: $75.03
```

**Net Cost Per Pilot:**
```
Revenue - COGS = $1 - $75.03 = -$74.03
```

**Pilot Investment per Factory:** $74.03

### 2.2 Pilot Batch Economics (3-5 Factories)

**Scenario A: 3 Factories (Conservative)**
```
Total investment: 3 × $74.03 = $222.09
Conversion (60%): 1.8 paying customers ≈ 2 customers
Revenue from conversions (Year 1): 2 × $5,800 = $11,600
ROI on pilot investment: 52.2×
Payback period: 1.2 months
```

**Scenario B: 5 Factories (Target)**
```
Total investment: 5 × $74.03 = $370.15
Conversion (60%): 3 paying customers
Revenue from conversions (Year 1): 3 × $5,800 = $17,400
ROI on pilot investment: 47×
Payback period: 1.5 months
```

### 2.3 Break-Even Conversion Rate

**Pilot Investment:** $74.03 per factory  
**Avg Annual Revenue from Converted Customer:** $5,800/year  
**Gross Margin on Converted Customer:** 76%

**Break-Even Calculation:**
```
Need $74.03 return per $5,800 revenue
Break-even conversion rate: ($74.03 ÷ $5,800) = 1.28%
```

**Safety Margin:**
- Target conversion: 60%
- Break-even conversion: 1.28%
- **Safety factor:** 47×

**Even at 10% conversion (terrible pilot execution):** ROI = 7.8×

---

## 3. Pilot Deal Terms & Contract Structure

### 3.1 Contract Terms

**Pilot Agreement Terms:**

| Term | Value | Notes |
|------|-------|-------|
| Contract duration | 30 days | Auto-converts to annual unless cancelled |
| Payment terms | $1 upfront, recurring auto-charge | Credit card required |
| Cancellation | 3-day notice before day 30 | Email to support@nextvision.ai |
| Module access | All 10 modules | No usage limits |
| Cloud storage | 30-day retention included | Data export available |
| Support scope | Email + WhatsApp (9-6 TR time) | Turkish language only |
| SLA | 99% edge uptime, 95% cloud uptime | Credit applied to future invoices |
| Data ownership | Factory retains all data | Export in CSV/JSON format |
| IP assignment | NextVision IP licensed to factory | Non-exclusive, non-transferable |

### 3.2 Post-Pilot Conversion Terms

**Conversion Options:**

**Option 1: Starter Plan (Post-Pilot Discount)**
- 2 modules (factory's choice from pilot)
- Price: $148/month (20% discount from regular $185)
- Contract: 12 months minimum
- Cloud sync: Optional (+$99/month)
- Support: Email only

**Option 2: Growth Plan (Recommended)**
- 5 modules (factory's choice from pilot)
- Price: $396/month (20% discount from regular $495)
- Contract: 12 months minimum
- Cloud sync: Included
- Support: Email + WhatsApp + quarterly review
- Onboarding: 1 refresher session included

**Option 3: Enterprise Plan (Full-Access)**
- All 10 modules + cloud sync
- Price: $598/month (regular price, no discount)
- Contract: 12 months minimum
- Support: Priority email + WhatsApp + dedicated account manager
- Onboarding: 2 refresher sessions + custom training
- SLA: 99.5% uptime guarantee, $100 credit per 0.1% breach

**Early Conversion Bonus:**
- Convert before day 30 → Additional 10% discount (first 12 months)
- Convert on day 30-45 → Standard 20% discount
- Convert after day 45 → Regular pricing (no discount)

---

## 4. Pilot SLA & Support Package

### 4.1 Service Level Agreement (SLA)

**Uptime Commitments:**

| Service | Target | Measurement | Credit |
|---------|--------|-------------|--------|
| Edge processing | 99% monthly | Downtime minutes | $5 credit per 0.1% breach |
| Cloud sync | 95% monthly | Downtime minutes | $10 credit per 0.1% breach |
| Mobile app | 90% monthly | App crashes | $2 credit per 0.1% breach |
| Alert delivery | 98% monthly | Failed alerts | $20 credit per 0.1% breach |

**Response Time Commitments:**

| Issue Type | Response Time | Resolution Target | Escalation |
|-----------|--------------|-------------------|------------|
| Critical (edge down) | 2 hours | 24 hours | CEO notified |
| High (cloud sync down) | 4 hours | 48 hours | CTO notified |
| Medium (feature bug) | 24 hours | 5 days | Engineering lead |
| Low (UI glitch) | 48 hours | 10 days | Product manager |

**SLA Exclusions:**
- Scheduled maintenance (48-hour notice)
- Customer network issues
- Third-party service outages (OpenAI, Anthropic APIs)
- Force majeure events

### 4.2 Support Package

**Pilot Support Channels:**

| Channel | Availability | Language | Response Time |
|---------|--------------|----------|---------------|
| Email | 24/7 | Turkish, English | 24 hours |
| WhatsApp | 9 AM - 6 PM TR time | Turkish | 2 hours (business hours) |
| Onboarding webinar | Scheduled | Turkish | 1-hour live + recording |
| Documentation | 24/7 | Turkish, English | Self-service |

**Support Scope (Included):**
- Module configuration and setup
- Alert rule customization
- Camera integration troubleshooting
- Dashboard walkthrough
- Data export requests
- Feature questions

**Support Scope (Excluded):**
- Hardware procurement and installation
- Network infrastructure setup
- Custom development work
- On-site visits (available at $500/day)

### 4.3 Onboarding Process

**Week 1: Setup & Activation**
- Day 1: Account creation, payment processing, contract signing
- Day 2-3: Remote setup session (camera integration, edge device config)
- Day 4: Live onboarding webinar (factory EHS team + IT + ops)
- Day 5: First alert rules configured, baseline metrics established

**Week 2-3: Optimization & Adoption**
- Day 7-10: Alert tuning (reduce false positives, adjust sensitivity)
- Day 14: Adoption check-in (training floor workers, supervisors)
- Day 21: Performance review (alerts triggered, incidents detected)

**Week 4: Evaluation & Conversion**
- Day 28: Final review meeting (ROI presentation, pilot metrics)
- Day 30: Conversion decision (or cancellation notice required)

---

## 5. Data Ownership & Privacy Terms

### 5.1 Data Ownership

**Factory Data Rights:**
- Factory retains full ownership of all data generated during pilot
- Data includes: video footage, alert logs, incident reports, metrics
- Export rights: Factory can request full data export in CSV/JSON format at any time
- No data lock-in: Pilot cancellation does not affect data access

**NextVision Data Rights:**
- License to use anonymized data for product improvement (aggregate only)
- License to use case study testimonials (factory name optional)
- No right to sell or share factory data with third parties

### 5.2 Privacy & Security

**Data Storage:**
- Edge processing: Video processed locally, never leaves factory premises (unless cloud sync enabled)
- Cloud storage: Encrypted at rest (AES-256), encrypted in transit (TLS 1.3)
- Data retention: 30 days during pilot, exportable on request
- Data deletion: Factory can request immediate deletion via support ticket

**Compliance:**
- GDPR compliant (EU data residency available)
- KVKK compliant (Turkish data protection law)
- SOC 2 Type II certified cloud infrastructure

**Anonymization:**
- Facial blur enabled by default (identifiable faces not stored)
- Vehicle license plates blurred unless vehicle module active
- Worker identity tracking opt-in (badge integration required for individual tracking)

### 5.3 Data Export & Portability

**Export Formats:**
- CSV: Alert logs, incident reports, metrics
- JSON: Raw data for integrations
- MP4: Video clips (annotated alerts only, not raw footage)

**Export Process:**
- Standard request: 3 business days (email to support)
- Priority request: 24 hours (available to converting customers only)
- Export size limit: 10GB per request (split into multiple requests for larger datasets)

---

## 6. Pilot-to-Conversion Strategy

### 6.1 Conversion Journey

**Day 1-10: Value Discovery Phase**
- Focus: Help factory discover relevant modules (occupational_safety, machine_safety)
- Tactic: Daily alert summary emails, weekly metrics report
- Goal: Identify 3-5 modules that drive value

**Day 11-20: Value Quantification Phase**
- Focus: Measure impact (incidents prevented, compliance improvements)
- Tactic: ROI calculator input (current incidents vs. detected incidents)
- Goal: Quantify economic value ($X saved per month)

**Day 21-30: Value Commitment Phase**
- Focus: Present ROI, recommend conversion path
- Tactic: Final review meeting, conversion proposal with pricing options
- Goal: Secure 12-month commitment

### 6.2 Conversion Pricing Strategy

**Value-Based Pricing Conversation:**

**Example ROI for Medium Factory (200 workers):**
```
Current state:
- 5 minor safety incidents/month = $2,500 cost
- 1 compliance violation/quarter = $5,000 fine
- Manual monitoring = 2 supervisor hours/day = $3,000/month

NextVision pilot results:
- 8 incidents detected (3 would have been missed) = $4,000 saved
- Zero compliance violations (proactive alerts) = $5,000 saved
- Automated monitoring = 1 supervisor hour/day = $1,500 saved

Total monthly value: $10,500
Pilot cost: $1
Post-pilot cost: $396/month (Growth plan)
ROI: 26.5×
```

**Conversion Script:**
> "In 30 days, NextVision helped you avoid $10,500 in incidents and fines. For $396/month—less than 4% of the value delivered—you can continue protecting your workers and bottom line. The pilot investment was $1. The annual cost is $4,752. The annual value delivered is $126,000. That's a 26× return. Ready to convert?"

### 6.3 Conversion Objection Handling

**Objection 1: "We can't afford $396/month"**
**Response:** "You're already paying $10,500/month in incidents and monitoring. NextVision cuts that by 80%. The question is: Can you afford NOT to invest $396 to save $8,400?"

**Objection 2: "We need to budget for next year"**
**Response:** "Convert now and lock in 20% discount ($396 vs. $495). We can also schedule the contract start for next fiscal year—secure the price today, activate later."

**Objection 3: "We're not sure if we need all 5 modules"**
**Response:** "Start with 2 modules at $148/month. You can always upgrade to 5 or 10 modules later. But the 20% pilot discount expires in 15 days."

**Objection 4: "We need more time to evaluate"**
**Response:** "Extend the pilot by 30 days at $99/month (still 80% discount). This gives you more data while we both commit to the partnership."

---

## 7. Pilot Targeting & Qualification

### 7.1 Ideal Pilot Customer Profile

**Target Factory Characteristics:**

| Characteristic | Ideal Profile | Red Flags |
|---------------|--------------|------------|
| Employees | 50-500 workers | <20 (too small), >1000 (enterprise sales) |
| Industry | Manufacturing, automotive, textile | Pure office, retail, services |
| Safety maturity | Manual monitoring, reactive compliance | Fully automated (competition), zero budget |
| Tech readiness | Has IP cameras, basic network | No cameras, no network infrastructure |
| Budget | $5K-20K/year for safety/quality | <$1K (no budget), >$100K (enterprise) |
| Decision maker | Plant manager, EHS manager | No authority to approve $5K spend |
| Pain | Compliance violations, incident costs | No incidents (complacent) |

**Qualification Questions:**
1. How many workers do you have? (Target: 50-500)
2. How many IP cameras are currently installed? (Target: 10+)
3. What's your current safety monitoring process? (Target: Manual, reactive)
4. Have you had any compliance violations in the last 12 months? (Target: Yes, or near-misses)
5. What's your annual budget for safety/quality technology? (Target: $5K-20K)
6. Who would approve a $5,000/year purchase? (Target: Plant manager, EHS manager)
7. Can you start a 30-day pilot this month? (Target: Yes, flexible timing OK)

### 7.2 Disqualification Criteria

**Instant Disqualifiers:**
- No IP cameras installed (hardware requirement)
- Annual safety tech budget < $1K (can't afford post-pilot pricing)
- <20 employees (too small, pricing misaligned)
- Decision maker not available (can't convert without authority)
- "Just curious" explorers (not serious buyers, waste of $74 investment)

**Yellow Flags (Proceed with Caution):**
- Competitor solution already in place (harder to displace)
- "We need board approval" (long sales cycle, low conversion probability)
- "We're benchmarking" (tire-kicker, may not convert)
- Requesting >90-day pilot (unrealistic timeline, low urgency)

### 7.3 Pilot Sourcing Channels

**Channel 1: Direct Outreach (High Intent)**
- Target: Turkish manufacturing associations (İstanbul Sanayi Odası, etc.)
- Method: Email intro + follow-up call
- Cost: $500-1000 per qualified pilot
- Conversion rate: 70%+

**Channel 2: Partner Referrals (Medium Intent)**
- Target: Security integrators, EHS consultants
- Method: Referral fee (10% of first-year revenue)
- Cost: $250-500 per qualified pilot
- Conversion rate: 60%

**Channel 3: Content Marketing (Low Intent)**
- Target: Turkish factory managers searching for safety solutions
- Method: SEO, LinkedIn content, webinars
- Cost: $100-300 per qualified pilot
- Conversion rate: 40%

**Blended CAC Target:** $500 per pilot customer

---

## 8. Pilot Program Timeline

### 8.1 Launch Timeline (Weeks 1-8)

**Weeks 1-2: Pilot Infrastructure Setup**
- Finalize pilot contracts (legal review)
- Set up billing automation ($1 charge, auto-convert logic)
- Build pilot dashboard (metrics, alerts, conversion tracking)
- Train support team on pilot process

**Weeks 3-4: Pilot Sourcing & Qualification**
- Outreach to 50 target factories
- Qualify 10-15 factories
- Secure 3-5 pilot commitments

**Weeks 5-6: Pilot Execution**
- Onboard 3-5 pilot factories
- Weekly check-ins, alert tuning, adoption support
- Collect feedback, iterate product

**Weeks 7-8: Conversion & Evaluation**
- Final review meetings with pilots
- Present ROI, propose conversion paths
- Secure 60% conversion (2-3 paying customers)

### 8.2 Post-Pilot Review (Week 9)

**Metrics to Analyze:**
- Pilot signups → Activations → Conversions
- Most-used modules (conversion recommendations)
- Churn signals (zero alerts, low engagement)
- NPS score (target: 50+)
- CAC by channel
- Conversion rate by channel

**Iterate Based on Data:**
- If conversion <40%: Re-evaluate pricing or target profile
- If NPS <40: Fix product issues before scaling
- If CAC >$500: Pivot to lower-cost channels
- If certain modules show 80%+ adoption: Bundle them in post-pilot pricing

---

## 9. Financial Projections (Pilot Program)

### 9.1 Pilot Program Investment

**Total Pilot Investment (3-5 Factories):**
```
Pilot customer acquisition: 5 × $500 = $2,500
Pilot infrastructure setup: $500 (one-time)
Pilot execution (support, onboarding): 5 × $75 = $375
Total investment: $3,375
```

### 9.2 Pilot Program Returns

**Scenario A: 60% Conversion (3/5 Paying Customers)**
```
First-year revenue from conversions: 3 × $5,800 = $17,400
Gross profit from conversions: 3 × $4,420 = $13,260
Net ROI: ($13,260 - $3,375) ÷ $3,375 = 293%
Payback period: 2.4 months
```

**Scenario B: 40% Conversion (2/5 Paying Customers)**
```
First-year revenue from conversions: 2 × $5,800 = $11,600
Gross profit from conversions: 2 × $4,420 = $8,840
Net ROI: ($8,840 - $3,375) ÷ $3,375 = 162%
Payback period: 3.8 months
```

**Scenario C: 20% Conversion (1/5 Paying Customers)**
```
First-year revenue from conversion: 1 × $5,800 = $5,800
Gross profit from conversion: 1 × $4,420 = $4,420
Net ROI: ($4,420 - $3,375) ÷ $3,375 = 31%
Payback period: 9.2 months
```

**Worst Case: 0% Conversion (0/5 Paying Customers)**
```
First-year revenue: $0
Gross profit: -$3,375 (total loss)
Key learning: Product-market fit issue, pricing too high, or wrong target profile
```

### 9.3 Expected Value (Probability-Weighted)

| Outcome | Probability | ROI | Probability-Weighted ROI |
|---------|-------------|-----|--------------------------|
| 0% conversion | 10% | -100% | -10% |
| 20% conversion | 20% | 31% | 6.2% |
| 40% conversion | 40% | 162% | 64.8% |
| 60% conversion | 30% | 293% | 87.9% |

**Expected ROI:** 149%  
**Expected Payback:** 4.5 months

---

## 10. Recommendations to CEO

### 10.1 Immediate Actions Required

1. **Approve pilot pricing** ($1 for 30 days, auto-convert to Growth plan @ $396/month)
2. **Authorize pilot budget** ($3,375 for 5 factories)
3. **Approve pilot contract terms** (SLA, data ownership, cancellation)
4. **Set pilot KPIs:** 60% conversion, $500 CAC, 50+ NPS

### 10.2 Success Criteria (30-Day Pilot)

**Must-Have (Deal-Breakers if Not Met):**
- At least 1/5 pilots converts (20% conversion)
- NPS >40 (product-market fit validation)
- No critical bugs (99% uptime achieved)
- At least 3 modules actively used per pilot (multi-module discovery)

**Nice-to-Have (Stretch Goals):**
- 60% conversion (3/5 pilots)
- NPS >60 (strong product-market fit)
- Viral referral (1 pilot refers 1 more)
- Case study testimonial secured

### 10.3 Go/No-Go Decision Framework

**GREEN LIGHT (Scale Pilot Program) if:**
- Conversion rate ≥40%
- NPS ≥50
- CAC ≤$500
- Gross margin ≥70% on conversions

**YELLOW LIGHT (Iterate Before Scaling) if:**
- Conversion rate 20-40% (adjust pricing or target profile)
- NPS 40-50 (fix product issues)
- CAC $500-750 (optimize channels)

**RED LIGHT (Kill Program) if:**
- Conversion rate <20% (no product-market fit)
- NPS <40 (fundamental product problem)
- Critical bugs or uptime <95% (not production-ready)
- CAC >$750 (un economics)

---

## Appendix A: Pilot Program Checklist

### Pre-Launch Checklist
- [ ] Pilot contract reviewed by legal
- [ ] Billing automation tested ($1 charge, auto-convert)
- [ ] Support team trained on pilot process
- [ ] Onboarding webinar script finalized
- [ ] ROI calculator built
- [ ] Pilot dashboard (metrics, alerts) live

### Pilot Execution Checklist (Per Factory)
- [ ] Qualification questions answered
- [ ] Contract signed, payment processed ($1)
- [ ] Cameras integrated, edge device configured
- [ ] Onboarding webinar delivered
- [ ] Alert rules tuned (false positives <10%)
- [ ] Weekly check-in calls (Weeks 1-3)
- [ ] Final review meeting scheduled (Day 28)

### Conversion Checklist (Per Factory)
- [ ] ROI calculation presented
- [ ] Conversion proposal delivered (3 pricing options)
- [ ] Objections handled, concerns addressed
- [ ] Contract signed (12-month commitment)
- [ ] Payment method updated (recurring billing)
- [ ] Post-pilot onboarding scheduled (refresher training)

---

**Prepared by:** CFO Campbell  
**Review required:** CEO Bezos (strategic approval), Critic Munger (risk veto), Sales Ross (go-to-market execution)  
**Implementation:** Sales ops (contracts), Devops Hightower (billing automation), Product Norman (onboarding experience)

---

*This pilot pricing strategy prioritizes learning over revenue. The $1 price is not freemium—it's a validation tactic. The real business starts post-pilot at $396-598/month. Convert or cancel—we don't want eternal pilots.*
