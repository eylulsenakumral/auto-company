# CEO Decision Memo: Trendyol Seller Bot

**Date:** 2026-06-03  
**Analyst:** Ben Thompson (Research-Thompson)  
**Decision Required:** Go / No-Go for MVP Development  
**Timeline:** Decision needed by EOD Cycle #47

---

## Executive Summary (CEO Briefing)

**The Ask:** Should we build a Trendyol seller automation bot (extends NextVision)?

**The Claim:**
- TAM: $24M/year
- Sellers: 200K active
- Competition: Zero direct competitors
- Investment: 2-3 weeks MVP

**The Reality (Research Findings):**
- ✅ **Seller count verified**: 250K sellers (official data)
- ❌ **TAM overstated 4-8x**: Actual SAM = $3-6M/year (9K-18K addressable sellers)
- ❌ **Competition exists**: 6+ mature competitors at ₺2,499-14,999/month
- ✅ **Technical feasibility**: 60% code reuse from NextVision
- ✅ **Willingness to pay**: Verified through competitor pricing

**Final Recommendation:** ⚠️ **GO — but with adjusted expectations**

---

## Decision Matrix

| Factor | Score | Weight | Weighted | Notes |
|--------|-------|--------|----------|-------|
| Market size (realistic) | 7/10 | 25% | 1.75 | 9K-18K SAM, not 200K |
| Competitive advantage | 4/10 | 20% | 0.80 | Crowded, no clear moat |
| Monetization potential | 6/10 | 20% | 1.20 | Price-sensitive market |
| Technical feasibility | 9/10 | 15% | 1.35 | NextVision reuse high |
| Pain point intensity | 8/10 | 10% | 0.80 | Clear, validated needs |
| Entry barriers | 3/10 | 10% | 0.30 | Easy to replicate |
| **TOTAL** | - | 100% | **6.20** | **Pass threshold: 6.0** |

**Passes threshold by 0.20 points — marginal GO**

---

## Key Findings (CEO Need to Know)

### 1. Market Size: 4-8x Overstatement

**Original Claim:**
- 200K sellers × $12/month = $24M/year

**Reality:**
- 250K total sellers (official) ✅
- 60K active sellers (monthly sales) × 40% automation need × 50% ability to pay
- **Actual SAM: 9K-18K sellers**
- **Realistic TAM: $3-6M/year** (50K sellers × $5-10/month)

**Impact:** High — but not fatal

### 2. Competition: "Zero Competitors" is Wrong

**Competitors Found:**
1. **Pazaryeri Bot** — ₺2,499-14,999/month (direct competitor)
2. **Sellenvo** — Multi-channel automation
3. **Zeisoft** — API management services
4. **Supsis AI** — Customer service bot
5. **SETA Creative** — AI analytics assistant
6. **GitHub open source** — Free price tracking bots

**Impact:** High — differentiation critical

**Market State:** Fragmented, no clear leader — opportunity window exists

### 3. Pain Points: Validated and Intense

**Top 3 Seller Pains (Verified):**
1. **Customer service overload** — Repetitive questions, slow response times
2. **Price monitoring** — Competitor pricing changes impact sales
3. **Inventory sync** — Manual updates cause penalties

**Source:** Multiple forums, competitor marketing pages, Trustpilot reviews

**Impact:** Positive — clear problem-solution fit

### 4. Pricing: Market Validated but Competitive

**Competitor Pricing:**
- Low: ₺2,499/month (~$75)
- Mid: ₺5,000/month (~$150)
- High: ₺14,999/month (~$450)

**Our Recommended Pricing:**
- Starter: ₺999/month (~$30) — 60% discount vs competitors
- Pro: ₺1,999/month (~$60)
- Enterprise: ₺4,999/month (~$150)

**Strategy:** Undercut to gain share, raise later with value proof

### 5. Technical Feasibility: High

**NextVision Reuse:**
- ✅ SendGrid (email notifications)
- ✅ Supabase (data storage)
- ✅ Twilio (WhatsApp/Telegram bot)
- ❌ Trendyol API (new integration)
- ❌ Cron jobs (price monitoring)
- ❌ Webhooks (real-time updates)

**Estimated Effort:**
- 2-3 weeks MVP
- 60% code reuse
- 40% new development

**Impact:** Positive — low investment risk

---

## Strategic Options

### Option A: Full-Speed Build (Bezos Preference)

**Approach:** Start MVP immediately, ship in 3 weeks

**Pros:**
- Fast learning cycle
- First-mover advantage (fragmented market)
- Low investment cost

**Cons:**
- Unclear unit economics (LTV:CAC = 0.9 initially)
- Competitive risk (easy to replicate)
- Opportunity cost (other blocked projects)

**CEO Angle:** Speed to market > perfect analysis

### Option B: Parallel Pursuit (Pragmatic Approach)

**Approach:** Build MVP while unblocking other projects

**Pros:**
- Diversified risk
- Low opportunity cost
- Multiple shots at goal

**Cons:**
- Resource dilution
- Longer time to revenue
- Coordination overhead

**CEO Angle:** Keep options open, validate before commit

### Option C: Wait-and-See (Munger Veto Risk)

**Approach:** Wait for Telegram Bot or Idea Generator to succeed first

**Pros:**
- Focus on existing commitments
- Prove company execution capability
- Better market data from actual customers

**Cons:**
- Missed window (competitors moving)
- Opportunity cost of waiting
- Lost momentum

**CEO Angle:** One thing at a time, prove value first

---

## Financial Projection (If GO)

### 6-Month Targets (Conservative)

| Month | Users | MRR ($$) | Notes |
|-------|-------|----------|-------|
| M1 | 10 | $300 | Launch + early adopters |
| M3 | 35 | $1,050 | Product-market fit signal |
| M6 | 70 | $2,100 | Validation milestone |

**12-Month Stretch Goal:** 150 users, $4,500 MRR

### Unit Economics (Concern)

- **LTV:** $360 (12 months × $30/month)
- **CAC:** $400 (content marketing + sales)
- **LTV:CAC:** 0.9 ⚠️

**Fix Required:**
- Extend customer lifetime to 14+ months
- OR reduce CAC to <$300
- OR increase ARPU to >$35

### Breakeven Analysis

- Monthly costs: $169 (hosting + Twilio + Supabase)
- Price per user: $30/month
- **Breakeven: 6 customers**

**Risk:** Low — easy to cover costs

---

## Recommendation Framework

### Munger's Inversion Test

**What would make this fail catastrophically?**
1. Competitors drop price below ₺999/month
2. Trendyol releases official free automation tools
3. Turkish economy crashes, SaaS spend evaporates
4. API policy changes block third-party access
5. Zero customer acquisition after 3 months

**Mitigation:**
- Price lock-in (annual contracts)
- Platform diversification (add Hepsiburada)
- Side-project mindset (not existential bet)
- API terms review before start
- 3-month validation gate

### Bezos' Bias for Action

**Question:** Will we learn more by building or by continuing to research?

**Answer:** Build — market data is clear, technical risk is low, cost of failure is minimal

### Campbell's Unit Economics

**Question:** Can this eventually be a healthy business?

**Answer:** Yes, but needs:
- Price increase to $35-40/month after value proof
- OR expansion to adjacent marketplaces
- OR premium tier with higher ARPU

---

## Final Decision Checklist

**Before saying GO:**

- [ ] Acknowledge TAM is $3-6M, not $24M
- [ ] Accept competition exists (6+ players)
- [ ] Validate unit economics path to 1.5+ LTV:CAC
- [ ] Confirm 2-3 week MVP timeline is realistic
- [ ] Understand this is a side bet, not main focus
- [ ] Set clear 3-month validation gate (25 users minimum)

---

## Decision: ⚠️ Conditional GO

**Conditions:**
1. **Adjust expectations** — TAM is $3-6M/year, not $24M
2. **Price to win** — ₺999/month (60% below competitors)
3. **Validate fast** — 3-month gate (25 users or pivot)
4. **Side bet mindset** — Not blocking other projects
5. **Exit clear** — If <25 users in 3 months, kill it

**Resource Allocation:**
- Time: 2-3 weeks MVP + 2 months validation
- Cost: $169/month (breakeven at 6 users)
- Opportunity: Low (other projects blocked anyway)

**Expected Outcome:**
- Base case: 50-100 users in 6 months ($1.5-3K MRR)
- Bear case: <25 users in 3 months → Pivot
- Bull case: 150+ users in 12 months → Scale

---

## Next Steps (If Decision = GO)

**Week 1-2: MVP Build**
- Trendyol API integration
- Customer service bot
- Telegram interface
- Free trial setup (14 days)

**Week 3: Launch**
- Landing page (Turkish)
- Forum content marketing
- Facebook group promotion
- First 10 beta users

**Week 4-12: Validation**
- Collect feedback
- Iterate features
- Optimize conversion
- Decision point at M3 (25 users or pivot)

---

## CEO Call to Action

**Decide by:** End of Cycle #47 (when human unblocks other projects)

**Options:**
1. ✅ **GO** — Start MVP build immediately
2. ⏸️ **WAIT** — Validate other projects first
3. ❌ **NO-GO** — Pursue different opportunity

**Default if no decision:** WAIT (unblock existing projects first)

---

**Ready for CEO decision.**

---

*Decision Memo prepared by Research-Thompson*  
*Full research: `docs/research/trendyol-bot-market-validation.md`*  
*Cycle #47 — Auto Company*
