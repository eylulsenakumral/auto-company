# Response Analysis Framework
**Human Outreach Campaign - Denizli Industrial Groups**

*Operational framework for analyzing results at T+24h and making data-driven decisions.*

---

## Executive Decision Tree (First 48 Hours)

```
T+24h (24 hours after send)
│
├─ COUNT REPLIES
│  ├─ 0 replies → GO TO T+48h CHECK (continue waiting)
│  ├─ 1 reply → EVALUATE QUALITY (BANT checklist)
│  └─ 2+ replies → BUILD AUTOMATION (trigger DevOps)
│
T+48h (48 hours after send)
│
├─ COUNT REPLIES
│  ├─ 0 replies → PIVOT TO DENIZLI (execute pivot plan)
│  ├─ 1 reply → DEEP EVALUATION (call + qualify)
│  └─ 2+ replies → AUTOMATION + PILOT (parallel execution)
│
└─ COUNT DEMOS BOOKED
   ├─ 0 demos → OPTIMIZE MESSAGING (A/B test)
   ├─ 1 demo → EXECUTE PILOT (deliver excellence)
   └─ 2+ demos → SCALE OUTREACH (expand to 50 companies)
```

---

## Part 1: Metrics Tracking Template

### Email Metrics (Per Campaign)

| Metric | Count | Rate | Benchmark | Status |
|--------|-------|------|-----------|--------|
| **Emails Sent** | 7 | - | - | ✓ |
| **Delivered** | ? | ?% | 95%+ | ? |
| **Bounced** | ? | ?% | <5% | ? |
| **Opened** | ? | ?% | 30-50% | ? |
| **Clicked** | ? | ?% | 5-10% | ? |
| **Replied** | ? | ?% | 10-20% | ? |
| **Unsubscribed** | ? | ?% | <2% | ? |

### Phone Metrics (Per Call Block)

| Metric | Count | Rate | Benchmark | Status |
|--------|-------|------|-----------|--------|
| **Dial Attempts** | 0 | - | - | - |
| **Connected** | 0 | ?% | 25-40% | - |
| **Gatekeeper Block** | 0 | ?% | 30-50% | - |
| **Gatekeeper Pass** | 0 | ?% | 20-30% | - |
| **Decision Maker Live** | 0 | ?% | 10-20% | - |
| **Voicemail Left** | 0 | ?% | 40-60% | - |
| **Call Back** | 0 | ?% | 5-15% | - |

### Funnel Metrics (Overall)

| Stage | Count | Conversion Rate | Benchmark | Status |
|-------|-------|----------------|-----------|--------|
| **Targeted Companies** | 7 | 100% | - | ✓ |
| **Email Replies** | ? | ?% | 10-20% | ? |
| **Phone Connects** | 0 | ?% | 25-40% | - |
| **Discovery Calls Booked** | 0 | ?% | 20-30% | - |
| **Demos Completed** | 0 | ?% | 50-70% | - |
| **Pilots Started** | 0 | ?% | 30-50% | - |

---

## Part 2: Response Quality Scoring

### Response Classification

| Score | Type | Description | Example |
|-------|------|-------------|---------|
| **10** | HOT | "Yes, let's talk" | "İlginç. Ne zaman görüşebiliriz?" |
| **8** | WARM | Specific question | "Pilot süresi ne kadar?" |
| **6** | LUKEWARM | Acknowledgment | "Geldi, inceliyorum" |
| **4** | COLD | Generic positive | "Teşekkürler, bakarız" |
| **2** | NOISE | Irrelevant | "İş alımı mı yapıyorsunuz?" |
| **0** | NEGATIVE | Rejection | "İhtiyacımız yok" |

### BANT Qualification Checklist

**Score each reply 0-2 points. Total 8+ = QUALIFIED LEAD.**

| Criteria | Questions | Score (0/1/2) |
|----------|-----------|--------------|
| **B**udget | "Bütçeleri hazır mı?" "Pilot için ayırdıkları var mı?" | __/2 |
| **A**uthority | "Karar verici mi?" "Onay yetkisi var mı?" | __/2 |
| **N**eed | "Acil sorunları var mı?" "Şu an ne çözüyorlar?" | __/2 |
| **T**iming | "Ne kadar sürede karar verirler?" "Pilot ne zaman?" | __/2 |
| **TOTAL** | | __/8 |

---

## Part 3: Pattern Extraction Guidelines

### What to Track (Winning Patterns)

If 2+ replies, analyze:

**Subject Lines:**
- Which opening hook worked? ("Denizli'de", "Sürdürülebilirlik", "İhracat")
- Length: Short (3-5 words) vs Long (6-10 words)?
- Personalization: First name vs Company name?

**Value Props:**
- Which pain point resonated? (Energy cost, worker safety, compliance)
- Which benefit stood out? (20% savings, 24/7 monitoring, EU compliance)
- Social proof: Did they mention "diğer fabrikalar"?

**Timing:**
- Send time: Morning (9-11), Lunch (12-14), Afternoon (15-17)?
- Day: Monday, Tuesday, Wednesday?
- Response time: Within 2h, 4h, 24h?

**Channel:**
- Email only vs Email + Phone follow-up?
- Which triggered the reply?

### What to Track (Losing Patterns)

If 0 replies by T+48h, analyze:

**Delivery Issues:**
- Bounce rate >5%? → Email list hygiene problem
- Open rate <20%? → Subject line failed
- Click rate <3%? → CTA/offer failed

**Content Issues:**
- No value prop clarity? → Too vague
- Too technical? → Lost them
- Too salesy? → Distrust

**Timing Issues:**
- Send during busy times? (Month-end close, production peaks)
- Wrong decision maker? → Reached wrong person

**Targeting Issues:**
- Wrong company size? → Too small/big
- Wrong industry? → Not a fit
- Wrong geography? → Not accessible

---

## Part 4: Pivot Criteria (If-Then Decision Matrix)

### Scenario A: 0 Replies by T+48h → PIVOT TO DENIZLI

**Decision Trigger:** Zero replies after 48 hours

**Action Plan (Execute Immediately):**

1. **Stop current campaign** → Pause any follow-ups
2. **Root cause analysis** → Review subject line, list quality, timing
3. **Pivot messaging** → New angle for Denizli textile cluster
4. **New target list** → 20 Denizli textile manufacturers
5. **New outreach sequence** → More aggressive, phone-first

**Denizli Pivot Messaging:**
```
Subject: Denizli'de Tekstil Üreticilerine Özel - Enerji Tasarrufu

Selam [İsim],

Denizli'deki tekstil üreticilerinin %40'ı enerji maliyetlerinden 
düşünüyor. Sizin [Şirket] için aynı riski taşımayın.

[Case Study]: Bursa'daki bir müşterimiz, 3 ayda %18 enerji tasarrufu 
sağladı. İş güvenliği incidentları %60 düştü.

Denizli'de pilot yapmak istiyoruz. Sıfır maliyet, 4 hafta sonuç.

Haftaya brief yapıyor musunuz?

[İsim]
```

---

### Scenario B: 1 Reply → DEEP EVALUATION

**Decision Trigger:** Exactly 1 reply at T+24h or T+48h

**Action Plan (Execute Within 4 Hours):**

1. **Score the reply** → Use Response Quality Scoring (Part 2)
2. **BANT qualify** → Complete checklist (8+ points = proceed)
3. **Phone follow-up** → Call within 24 hours
4. **Discovery call** → Book if qualified
5. **Pilot proposal** → Send if discovery positive

**If Score <6 (Cold/Noise):**
- Add to nurture list → Send monthly newsletter
- Don't invest time → Not qualified

**If Score 6-7 (Lukewarm):**
- Send case study → Build credibility
- Phone follow-up → Test interest
- Book demo → If engaged

**If Score 8+ (Hot/Warm):**
- Immediate call → Within 4 hours
- Discovery call → Within 48 hours
- Pilot proposal → Within 72 hours
- Close in 14 days → Aggressive timeline

---

### Scenario C: 2+ Replies → BUILD AUTOMATION

**Decision Trigger:** 2 or more replies at T+24h

**Action Plan (Execute Immediately):**

1. **Trigger DevOps** → Email tracking infrastructure (72-hour build)
2. **Analyze patterns** → What worked? (subject line, value prop, timing)
3. **Clone success** → Scale to 50 companies
4. **Hire SDR** (if MRR justified) → Delegate outreach
5. **Build CRM pipeline** → Track stages: Lead → Qualified → Demo → Pilot → Customer

**Automation Requirements (Spec for DevOps):**

**Phase 1: Email Tracking (72 hours)**
- SMTP server setup (Google Workspace / SendGrid)
- Open tracking pixels
- Link tracking (UTM parameters)
- Reply detection API
- Dashboard (sent, open, reply, click rates)

**Phase 2: CRM Pipeline (1 week)**
- Lead stages (New, Contacted, Qualified, Demo, Pilot, Customer)
- Custom fields (BANT score, industry, company size)
- Activity logging (emails, calls, meetings)
- Task reminders (follow-ups)

**Phase 3: Outreach Automation (2 weeks)**
- Email sequence builder (drip campaigns)
- Personalization tokens ({{first_name}}, {{company}}, {{industry}})
- A/B testing (subject lines, CTAs)
- Auto-assignment (round-robin SDRs)

---

### Scenario D: 1+ Demo Booked → EXECUTE PILOT

**Decision Trigger:** 1 or more discovery calls booked

**Action Plan (Execute Within 24 Hours):**

1. **Prepare demo environment** → Staging instance with sample data
2. **Create pilot agreement** → 4-week scope, success metrics
3. **Set success metrics** → KPIs to track (e.g., % energy saved)
4. **Schedule onboarding** → Day 1: Install sensors, Day 7: Dashboard live
5. **Assign success manager** → Weekly check-ins

**Pilot Execution Checklist:**

**Week 0 (Pre-Pilot):**
- [ ] Sign pilot agreement
- [ ] Install hardware sensors
- [ ] Configure dashboard
- [ ] Train on-site team
- [ ] Set baseline metrics

**Week 1 (Onboarding):**
- [ ] Verify data ingestion
- [ ] Calibrate sensors
- [ ] Initial insights report
- [ ] Weekly sync call

**Week 2-3 (Value Realization):**
- [ ] Track anomalies detected
- [ ] Document energy savings
- [ ] Measure safety incidents avoided
- [ ] Weekly sync calls

**Week 4 (Review & Close):**
- [ ] Final ROI report
- [ ] Case study testimonial
- [ ] Upsell to annual contract
- [ ] Ask for referrals

---

## Part 5: Sample Data Templates

### Response Log (CSV Structure)

```csv
company_name,contact_name,contact_role,email_sent_time,open_time,click_time,reply_time,reply_content,quality_score,bant_score,phone_called,connected,booking_status,next_action
Company A,Ahmet Yılmaz,COO,2026-06-03 09:00,2026-06-03 10:15,,,,"Enerji maliyetlerini düşürmek istiyoruz",8,7,Yes,Yes,Demo booked,Send pilot proposal
Company B,Mehmet Demir,Production Manager,2026-06-03 09:05,,,2026-06-03 14:30,"Daha detaylı bilgi",6,5,No,No,N/A,Send case study
```

### 30-Minute Analysis Checklist (T+24h / T+48h)

**Step 1: Data Collection (5 min)**
- [ ] Export email analytics (sent, open, click, reply)
- [ ] Check phone call logs (connected, voicemail)
- [ ] Review CRM notes (any manual updates?)
- [ ] Capture response times (reply - send delta)

**Step 2: Scoring & Qualification (10 min)**
- [ ] Score each reply (0-10 scale)
- [ ] BANT qualify each lead (0-8 scale)
- [ ] Classify: Hot/Warm/Lukewarm/Cold/Noise
- [ ] Flag for immediate action (score 8+)

**Step 3: Pattern Analysis (10 min)**
- [ ] Which subject line worked best?
- [ ] Which value prop resonated?
- [ ] What time/day generated most opens?
- [ ] Any common objections/questions?
- [ ] Which companies replied (size, industry)?

**Step 4: Decision & Action (5 min)**
- [ ] Count total replies (0/1/2+)
- [ ] Execute scenario (A/B/C/D from Part 4)
- [ ] Document decision in consensus.md
- [ ] Update sales metrics dashboard
- [ ] Schedule next review (T+72h)

---

## Part 6: Action Frameworks

### Response Analysis Workflow (Step-by-Step)

**T+24h Review (24 hours after send):**

1. **Check Inbox** → Count replies
2. **Classify** → Score each reply (0-10)
3. **Qualify** → BANT checklist (0-8)
4. **Decide** → Execute Scenario A/B/C/D
5. **Act** → Phone, demo, automation, or pivot

**T+48h Review (48 hours after send):**

1. **Final Count** → Total replies (including late ones)
2. **Pattern Extraction** → Document what worked/failed
3. **Automation Decision** → 2+ replies? Build infrastructure
4. **Pivot Decision** → 0 replies? Switch to Denizli
5. **Record Outcome** → Update consensus.md, metrics

---

### Automation Trigger Conditions

**Trigger DevOps Build (72-hour sprint):**
- **Condition:** 2+ qualified replies (BANT 8+)
- **Action:** Email tracking + CRM pipeline
- **Owner:** DevOps (Hightower)
- **Timeline:** T+0 → T+72h

**Trigger Hire SDR (if MRR justified):**
- **Condition:** 5+ qualified leads/month OR $5k+ MRR potential
- **Action:** Job posting, interview, onboarding
- **Owner:** CEO (Bezos)
- **Timeline:** T+2 weeks

**Trigger Scale to 50 Companies:**
- **Condition:** 20%+ reply rate from initial 7
- **Action:** Expand target list, clone messaging
- **Owner:** Sales (Ross)
- **Timeline:** T+1 week

---

### Pilot Execution Criteria

**Ready to Pilot (Must Meet ALL):**
- [ ] BANT score 8+ (qualified)
- [ ] Discovery call completed
- [ ] Decision maker committed
- [ ] Technical feasibility confirmed
- [ ] Pilot agreement signed
- [ ] Success metrics defined

**Pilot Success Metrics (4 weeks):**
- [ ] 20%+ energy cost reduction
- [ ] 50%+ anomaly detection accuracy
- [ ] 90%+ system uptime
- [ ] 100% user adoption (daily logins)
- [ ] NPS 8+ (Net Promoter Score)

**Pilot to Customer Conversion:**
- [ ] ROI positive (3-month payback)
- [ ] Stakeholder endorsement
- [ ] Annual contract signed
- [ ] Case study published
- [ ] Referral asked

---

### Pivot Execution Plan (Denizli)

**Phase 1: Message Pivot (T+48h, Execute in 24h)**
1. **Stop current outreach** → Pause follow-ups
2. **Root cause** → Document why 0 replies
3. **New messaging** → Denizli textile angle
4. **New list** → 20 Denizli manufacturers
5. **New sequence** → Phone-first aggressive

**Phase 2: Outreach Pivot (T+72h, Execute in 48h)**
1. **Build Denizli list** → Export from LinkedIn / Turkish directories
2. **Craft emails** → New subject lines, value props
3. **Phone script** → Direct decision maker pitch
4. **Send first batch** → 5 companies (A/B test)
5. **Track metrics** → Compare to original campaign

**Phase 3: Evaluation (T+120h, Execute in 48h)**
1. **Compare results** → Denizli vs Original
2. **Document learnings** → What worked differently?
3. **Decide next move** → Scale Denizli or new pivot?

---

## Part 7: Operational Dashboard

### Quick Reference (One-Pager)

**WHEN TO CHECK:**
- T+24h: First review (expect 0-2 replies)
- T+48h: Final review (make decision)
- T+72h: Execute (automation or pivot)

**WHAT TO COUNT:**
- Replies (total)
- Qualified (BANT 8+)
- Demos booked
- Pilots started

**HOW TO DECIDE:**
- 0 replies → Pivot (Denizli)
- 1 reply → Evaluate (BANT)
- 2+ replies → Automate (DevOps)
- 1+ demo → Pilot (Execute)

---

## Appendix: Data Collection Templates

### Email Template A/B Testing Log

| Variant | Subject Line | Value Prop | CTA | Sent | Opened | Replied | Reply Rate |
|---------|--------------|------------|-----|------|--------|---------|------------|
| A | "Sürdürülebilirlik" | Energy savings | "Haftada brief" | 3 | ? | ? | ?% |
| B | "Denizli'de" | Safety | "Demo" | 4 | ? | ? | ?% |

### Phone Call Script Log

| Company | Decision Maker | Gatekeeper Approach | Result | Next Action |
|---------|---------------|---------------------|--------|-------------|
| A | CEO | "CEO ile konuşabilir miyim?" | Voicemail | Call back tomorrow |
| B | COO | "Enerji projesi için" | Connected | Booked demo |

### Competitive Intelligence Log

| Competitor | Win/Loss | Reason | Learning |
|------------|----------|--------|----------|
| Competitor X | Loss | "Existing vendor" | Need stronger differentiation |
| Competitor Y | Win | "Better pricing" | Price is key decision factor |

---

## Closing Notes

**This framework is operational, not theoretical.**

- Use it at T+24h and T+48h.
- Document decisions in `memories/consensus.md`.
- Update metrics after each review.
- Scale what works, kill what doesn't.

**Remember the CFO's guidance:**
> "2+ replies = Build automation. 1 reply = Evaluate quality. 0 replies = Pivot to Denizli."

**This is how we build a predictable sales machine.**
