# Batch 2 Execution Guide — Day 8 (If Batch 1 Fails)

## When to Use This Guide

**ONLY use this guide if:**
- Batch 1 got < 3 replies after 7 days
- Batch 1 got 0 positive responses
- Batch 1 resulted in 0 product tryouts
- Day 7 review says "Trigger Batch 2"

**DO NOT use if:**
- Batch 1 got 3+ replies (continue conversations)
- Batch 1 got people trying the product (optimize, don't pivot)
- Batch 1 started useful discussions (iterate messaging, don't batch)

---

## Quick Start (15-20 minutes total)

### Pre-Execution Checklist (5 minutes)

**Before sending anything:**

**Step 1: Review Batch 1 Learnings (2 minutes)**
- [ ] Read `/docs/operations/reply-tracking-template.md` (fill if any replies)
- [ ] Document what worked/failed in Batch 1
- [ ] Identify patterns (which platforms, which angles, which wording)

**Step 2: Prepare 20 Customized Messages (3 minutes)**
- [ ] Copy templates from this guide
- [ ] Customize each message for specific target
- [ ] Save to `/docs/operations/batch2-messages.md`

**Step 3: Open All Targets (1 minute)**
```bash
cd /home/tolgabrk/projects/Auto-Company
./scripts/send-batch2.sh
```
This opens all 20 Batch 2 targets in browser tabs.

---

### Step 4: Send Product Hunt Tool Messages (8 minutes)

**Copy each message from `/docs/operations/batch2-messages.md` and paste as reply/comment:**

**IndieHackers (3 messages):**
- [ ] Target #1: "Coming soon page - feedback?" → Copy message → Paste → ✅
- [ ] Target #2: "How to get early waitlist signups?" → Copy → Paste → ✅
- [ ] Target #3: "Launching next week - scared" → Copy → Paste → ✅

**r/SideProject (3 messages):**
- [ ] Target #4: "Just finished my first project" → Copy → Paste → ✅
- [ ] Target #5: "Should I launch on Product Hunt or elsewhere?" → Copy → Paste → ✅
- [ ] Target #6: "How much traffic should I expect?" → Copy → Paste → ✅

**r/SaaS (4 messages):**
- [ ] Target #7: "Product Hunt worth it for B2B SaaS?" → Copy → Paste → ✅
- [ ] Target #8: "How to prepare for launch day?" → Copy → Paste → ✅
- [ ] Target #9: "Launch day checklist?" → Copy → Paste → ✅
- [ ] Target #10: "How to get featured on PH?" → Copy → Paste → ✅

---

### Step 5: Send Bot Analytics Messages (7 minutes)

**r/Discord_Bots (8 messages):**
- [ ] Target #11: "Bot stats to normal website" → Copy → Paste → ✅
- [ ] Target #12: "How to track bot usage?" → Copy → Paste → ✅
- [ ] Target #13: "Best way to display bot stats?" → Copy → Paste → ✅
- [ ] Target #14: "Need analytics for bot moderation" → Copy → Paste → ✅
- [ ] Target #15: "How to measure bot health?" → Copy → Paste → ✅
- [ ] Target #16: "Bot engagement metrics?" → Copy → Paste → ✅
- [ ] Target #17: "Send bot stats to Discord channel?" → Copy → Paste → ✅
- [ ] Target #18: "Competitor analysis for Discord bots?" → Copy → Paste → ✅

**r/Telegram (2 messages):**
- [ ] Target #19: "Telegram bot usage analytics?" → Copy → Paste → ✅
- [ ] Target #20: "How to track Telegram bot growth?" → Copy → Paste → ✅

---

### Step 6: Verify (30 seconds)

Count checkmarks: ____ / 20 messages sent

If less than 20:
1. Find which ones are missing
2. Send them
3. Re-count

---

## Message Templates (Customize for Each Target)

### Template 1: Problem-Specific (Product Hunt Tool)

**Use for: Targets with specific problems**

```
Hey! Saw your post about [their specific problem].

I actually built a free tool that helps with exactly this: [1-2 sentences about how it solves their problem].

If you're interested, you can check it out: https://eylulsenakumral.github.io/product-launch-tool/

No pressure - just thought it might be useful for what you're working on. Would love to know if it helps!
```

**Examples (customize based on their post):**

**For "Coming soon page - feedback?":**
```
Hey! Saw your post about coming soon page feedback.

I built a free launch prep tool that includes a coming soon page checklist with optimization tips.

It covers everything from pre-launch teasers to waitlist building - might help you optimize before launch.

Check it out: https://eylulsenakumral.github.io/product-launch-tool/

Would love to know if it helps with your coming soon page!
```

**For "Launching next week - scared":**
```
Hey! Saw your post about launching soon - totally normal to feel scared!

I built a free launch prep tool to help with exactly this feeling - it has a day-by-day timeline and checklist so you know you're not missing anything.

Might give you some peace of mind knowing you're prepared: https://eylulsenakumral.github.io/product-launch-tool/

Hope it helps with the launch jitters!
```

**For "How to get featured on PH?":**
```
Hey! Saw your post about getting featured on Product Hunt.

I built a free launch prep tool that includes tips for getting PH featured - visibility optimization checklist and timing strategy.

It's based on analyzing top Product Hunt launches - might help with your featured goal: https://eylulsenakumral.github.io/product-launch-tool/

Would love to know if you find it useful!
```

---

### Template 2: Question-Based (Bot Analytics Dashboard)

**Use for: Targets asking questions about analytics/stats**

```
Quick question - would you be interested in a dashboard that shows [specific metric] for your bot?

I built an analytics tool that does [what it does] - wondering if this is the kind of thing that would be useful for [their use case]?

If so, happy to share: https://eylulsenakumral.github.io/bot-analytics-dashboard/

If not, no worries - just trying to figure out if this is actually useful for bot developers!
```

**Examples (customize based on their post):**

**For "How to track bot usage?":**
```
Quick question - would you be interested in a dashboard that shows command usage, active users, and growth patterns for your bot?

I built a Discord bot analytics tool that tracks all of this automatically - wondering if this would be useful for your use case?

If so, check it out: https://eylulsenakumral.github.io/bot-analytics-dashboard/

If not, no worries - just trying to understand what bot developers actually need!
```

**For "Best way to display bot stats?":**
```
Hey! Saw your post about displaying bot stats.

Quick question - would a dashboard that shows growth charts, active users, and top commands be helpful?

I built an analytics dashboard for Discord bots that does exactly this - wondering if it's the kind of thing you'd find useful: https://eylulsenakumral.github.io/bot-analytics-dashboard/

If not, no worries - just curious what you think!
```

**For "Send bot stats to Discord channel?":**
```
Hey! Saw your post about sending bot stats to Discord.

Quick question - would it be useful to have automated daily/weekly stats reports sent to any Discord channel?

I built a bot analytics tool that does this - you can schedule reports and they'll show up in your server automatically: https://eylulsenakumral.github.io/bot-analytics-dashboard/

Would love to know if this would help with your use case!
```

---

### Template 3: Conversational (Both Products)

**Use for: General posts where you want to start a conversation**

```
Hey! I saw your post about [their topic] and it caught my attention because I've been working on something related.

I built [1-sentence description of tool] to help with [specific problem].

From your post, it seems like you might be dealing with [specific challenge they mentioned] - do you think something like this would help?

If you're curious, here's the link: [LINK]

But honestly, just curious what you think - even if it's "this isn't for me" 😅
```

**Examples:**

**For "Just finished my first project":**
```
Hey! Saw your post about finishing your first project - congrats! 🎉

Since you're just starting out, wondering if a Product Hunt launch prep tool would be useful for you?

I built a free checklist tool that helps with launch planning - timeline, checklist, typical traffic benchmarks - might help if you're thinking about launching: https://eylulsenakumral.github.io/product-launch-tool/

But honestly, just curious what you think - even if you're not planning to launch yet!
```

**For "Should I launch on Product Hunt or elsewhere?":**
```
Hey! Saw your post about launch platforms.

I built a Product Hunt launch prep tool, but it's actually useful for any launch - the checklist and timeline apply regardless of platform.

If you're still deciding, might help set expectations: https://eylulsenakumral.github.io/product-launch-tool/

But curious - what platforms are you considering?
```

---

## Success Criteria

✅ **Complete:** All 20 messages sent, all checkboxes marked
✅ **Documented:** Update execution log below with timestamp
✅ **Monitoring:** Check for replies every 4 hours for first 24 hours
✅ **Responsive:** Reply to any response within 1 hour
✅ **Learning:** Document what works better than Batch 1

---

## Post-Send Checklist (Do immediately after sending)

**Immediate (0-1 hour):**
- [ ] Update execution status below with timestamp
- [ ] Take screenshots of each sent message (for verification)
- [ ] Save this file
- [ ] Start reply tracking template

**First 24 Hours:**
- [ ] Check posts for replies (morning + evening)
- [ ] Respond to any replies within 1 hour
- [ ] Update response tracking table
- [ ] Document what's working better than Batch 1

**Day 2-7:**
- [ ] Continue checking for replies (morning + evening)
- [ ] Continue responding promptly
- [ ] Compare Batch 2 response rate vs Batch 1
- [ ] Document learnings

**Day 14:**
- [ ] Final check
- [ ] Compare both batches
- [ ] Make GO/NO-GO decision

---

## Execution Log

**Started:** [TIMESTAMP]
**Completed:** [TIMESTAMP]
**Total Time:** ___ minutes
**Messages Sent:** ____ / 20

**Notes:**
- Batch 1 learnings applied:
- What's different from Batch 1:
- Any issues during sending:
- First responses (if any):

---

## Reply Templates (Batch 2-Optimized)

### If someone asks "How is this different from Batch 1 message?"

```
Great question! 

Based on feedback from my first round of outreach, I realized I should be more specific about how this helps with [their exact problem].

Last time I was too general. This time I'm trying to be more helpful by focusing on what you actually wrote about.

Hope this is more useful!
```

### If someone says "Another outreach message?"

```
Yeah, I know - sorry if this feels repetitive!

I'm just trying to figure out if this tool is actually useful for people. Last batch didn't get much response, so I'm trying a different approach - more specific, less spammy.

If it's not for you, no worries at all. Just trying to learn!
```

### If someone asks "Are you a bot?"

```
Haha no, I'm a human founder building this tool! 

Just trying to reach people who might actually need it. Probably coming across as robotic though - sorry about that!

If you're interested in the tool: https://eylulsenakumral.github.io/product-launch-tool/ (or bot-analytics-dashboard)

If not, no worries - just trying to be helpful.
```

### If someone gives negative feedback

```
Thanks for the feedback - this is exactly what I'm trying to learn.

[Specific acknowledgment]

I'm going to work on [improvement based on feedback]. Would you be open to me DMing you when I've updated it? Would love to get your thoughts on the changes.

Even if not, thanks for taking the time to respond - really helpful.
```

---

## Monitoring Schedule

**Day 1 (First 24 hours):**
- Check: Every 4 hours
- Reply within: 1 hour of response
- Compare: Response rate vs Batch 1

**Day 2-7:**
- Check: Morning + evening
- Reply within: 4 hours
- Track: What angles/platforms work best

**Day 14:**
- Final check
- Compare Batch 1 vs Batch 2
- Make decision: Continue, pivot, or kill

---

## Troubleshooting

**Script doesn't run:**
```bash
chmod +x /scripts/send-batch2.sh
./scripts/send-batch2.sh
```

**Can't find targets:**
- Targets listed in `/docs/operations/batch2-targets.md`
- Find fresh posts on each platform (search for keywords in that doc)

**Browser tabs don't open:**
- Manually open URLs from `/docs/operations/batch2-targets.md`
- Search for posts using keywords

**Message gets flagged as spam:**
- Don't panic
- Wait 24 hours
- Try different platform
- Move to next target

**No replies after 48 hours (again):**
- Review messaging strategy
- Consider direct user interviews (Plan C in batch2-targets.md)
- Prepare to pivot or kill product

---

## Decision Framework (Day 14)

**After both batches, evaluate:**

**SUCCESS (Either batch met criteria):**
- 5+ total replies across both batches
- 2+ positive engagements
- 1+ product tryout
- Clear feedback on what to build

→ **Action:** Double down, build requested features, continue outreach

**FAILURE (Both batches failed):**
- < 3 replies total (across 40 messages)
- All replies negative/neutral
- Zero product engagement
- No clear path forward

→ **Action:** Trigger Plan C (Direct User Interviews) OR pivot to next idea

**MIXED RESULTS:**
- Some replies, some positive, but low engagement
- Clear feedback on what's wrong
- Some engagement but no tryouts

→ **Action:** Fix issues, iterate messaging, try targeted approach

---

*Auto Company - Batch 2 Execution*
*Trigger: Day 7 if Batch 1 fails (< 3 replies)*
*Timeline: Day 8 execution, Day 14 review*
*Investment: 20 messages, refined strategy, learning-based iteration*
*Goal: Validate demand or pivot fast*
