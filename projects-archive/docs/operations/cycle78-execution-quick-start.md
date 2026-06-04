# Outreach Execution Quick Start

**Total Time:** 10-15 minutes
**Investment Protected:** 855 minutes → This execution unlocks learning
**Decision Speed:** Execute → Monitor → Learn (Day 7) → Decide

---

## One-Step Execution

```bash
cd /home/tolgabrk/projects/Auto-Company
./scripts/execute-outreach.sh
```

That's it. Script will guide you through each target.

---

## What This Does

1. **Opens 5 target URLs** (Reddit + IndieHackers posts)
2. **Guides you through each message** (pre-written, personalized)
3. **Tracks completion** (logs to `/logs/outreach-execution-[timestamp].log`)
4. **Rate-limits automatically** (30-60 sec between targets)

---

## Messages Already Created

All 5 messages are in `/docs/operations/cycle77-smart-outreach-messages.md`:
- Target 1: Reddit r/SaaS "Launching on Product Hunt. It's scary AF" (Product Hunt Tool)
- Target 2: IndieHackers "12 days zero customers" (Product Hunt Tool)
- Target 3: Reddit r/SaaS "Left launch unnoticed" (Product Hunt Tool)
- Target 4: Reddit r/Discord_Bots "Looking for better analytics" (Bot Analytics)
- Target 5: Reddit r/Discord_Bots "How to make Web Dashboard" (Bot Analytics)

**Message Style:** Value-first, conversational, maker-to-maker, soft CTA.

---

## Execution Flow

**Step 1: Run Script**
```bash
./scripts/execute-outreach.sh
```

**Step 2: For Each Target (1-5)**
1. Script shows URL → Open in browser
2. Log in to platform (if needed)
3. Click "Reply" or comment box
4. Copy message from `/docs/operations/cycle77-smart-outreach-messages.md`
5. Paste and submit
6. Wait 30-60 seconds
7. Confirm completion in script
8. Repeat for next target

**Step 3: Verify**
- Script logs everything to `/logs/outreach-execution-[timestamp].log`
- Check each thread to confirm your comment posted
- No flags or removals? Success.

---

## After Execution (Day 1-3)

**Monitoring:**
```bash
./scripts/monitoring-template.sh
```

**Frequency:** Morning + Evening (Day 1-3)

**What to Check:**
- Replies to your comments
- Sentiment (positive/neutral/negative)
- Product mentions
- Tryout indicators

**Tracking:** Fill in `/memories/outreach-responses.md` as replies arrive

---

## Decision Framework (Day 7)

**GO (2+ replies, positive engagement):**
- Continue with Batch 2
- Execute distribution channels
- Publish build-in-public docs

**NO-GO (0 replies, zero engagement):**
- Analyze why
- Execute Batch 2 with refined strategy
- Consider pivot to Integration Monitoring Platform

**ITERATE (1 reply, vague interest):**
- Deep-dive into the one reply
- Refine messaging
- Execute Batch 2
- Re-evaluate Day 14

---

## Success Criteria

**Immediate (Day 0):**
- ✅ All 5 messages posted
- ✅ No account flags
- ✅ No post removals

**Short-term (Day 1-3):**
- 📊 2-3 replies from targets
- 📊 1-2 users try products
- 📊 Positive engagement

**Long-term (Day 7):**
- 📊 Learn what resonates
- 📊 Identify best platforms
- 📊 Decide next iteration

---

## Backup Plan

**If response rate < 2/5 after 48 hours:**
- Execute Batch 2 (next 5 targets from original 20)
- Refine messaging based on learnings
- Re-evaluate targeting strategy

**If technical blockers:**
- Note which platforms work
- Focus future outreach on working platforms
- Consider alternative channels (Twitter, HN)

---

## Files Reference

**Execution:**
- `/scripts/execute-outreach.sh` - One-step execution
- `/docs/operations/cycle77-smart-outreach-messages.md` - 5 personalized messages

**Monitoring:**
- `/scripts/monitoring-template.sh` - Response monitoring
- `/memories/outreach-responses.md` - Detailed tracking template

**Strategy:**
- `/docs/operations/cycle74-execution-plan.md` - Day 7 decision framework
- `/docs/operations/cycle77-execution-report.md` - Strategic analysis

---

## Why This Matters

**Investment:** 855 minutes → 2 live products + Phase 1 improvements + smart outreach plan

**Bottleneck:** 105 minutes waiting on human execution (6 cycles)

**Opportunity Cost:** Waiting > 10 min risk → Execute now, learn fast

**Decision Speed:** Outreach → Replies (Day 1-3) → Learning (Day 7) → Decision (GO/NO-GO/ITERATE)

**Strategic Clarity:**
- Learning only from users, not more planning
- 5 high-value targets > 20 random shots
- Human authenticity > automation risk
- Ship > Plan > Discuss

---

## Quick Command Summary

```bash
# Execute outreach (10-15 min)
./scripts/execute-outreach.sh

# Monitor responses (run morning + evening, Day 1-3)
./scripts/monitoring-template.sh

# Track responses (fill as replies arrive)
# Edit: /memories/outreach-responses.md

# Check execution log
cat /logs/outreach-execution-*.log
```

---

*Auto Company — Cycle #78*
*Zero-Friction Execution → 10-15 min → Unlock 855 min investment*
*Next: Execute → Monitor → Learn → Decide*
