# Outreach Execution Guide — Day 3

## Quick Start (5-10 minutes total)

### Step 1: Open Script (1 minute)
```bash
cd /home/tolgabrk/projects/Auto-Company
./scripts/send-outreach.sh
```
This opens all 20 targets in browser tabs.

### Step 2: Send Product Hunt Tool Messages (5 minutes)

Copy each message from `/docs/operations/product-hunt-outreach-messages.md` and paste as reply/comment:

**IndieHackers (1 message):**
- [ ] Target #1: "Launching in 12 days zero customers" → Copy message → Paste as comment → Mark "✅ Sent"

**r/SideProject (4 messages):**
- [ ] Target #2: "Launching soon - tips?" → Copy → Paste → ✅
- [ ] Target #3: "Coming soon page?" → Copy → Paste → ✅
- [ ] Target #4: "How did you prepare?" → Copy → Paste → ✅
- [ ] Target #5: "It's scary AF" → Copy → Paste → ✅

**r/SaaS (5 messages):**
- [ ] Target #6: "Should I launch right away?" → Copy → Paste → ✅
- [ ] Target #7: "Left my launch unnoticed" → Copy → Paste → ✅
- [ ] Target #8: "Accidentally launched, top 4?" → Copy → Paste → ✅
- [ ] Target #9: "Still worth it?" → Copy → Paste → ✅
- [ ] Target #10: "Biggest myth about launching?" → Copy → Paste → ✅

### Step 3: Send Bot Analytics Messages (5 minutes)

**r/Discord_Bots (8 messages):**
- [ ] Target #11: "Looking for better analytics tools" → Copy → Paste → ✅
- [ ] Target #12: "Which stat bot is better?" → Copy → Paste → ✅
- [ ] Target #13: "How to make Web Dashboard?" → Copy → Paste → ✅
- [ ] Target #14: "Bot to Archive & Organize" → Copy → Paste → ✅
- [ ] Target #15: "[PAID] Beta Testing" → Copy → Paste → ✅
- [ ] Target #16: "Google Sheets Bot?" → Copy → Paste → ✅
- [ ] Target #17: "Pinging roles in nextcord" → Copy → Paste → ✅
- [ ] Target #18: "Looking for bot for Sheets values" → Copy → Paste → ✅

**r/Telegram (2 messages):**
- [ ] Target #19: "Docker Events Monitor" → Copy → Paste → ✅
- [ ] Target #20: "Directory for goods and shops" → Copy → Paste → ✅

### Step 4: Verify (30 seconds)
Count checkmarks: ____ / 20 messages sent

If less than 20:
1. Find which ones are missing
2. Send them
3. Re-count

---

## Success Criteria

✅ **Complete:** All 20 messages sent, all checkboxes marked
✅ **Documented:** Update this file with completion timestamp
✅ **Monitoring:** Check for replies every 4 hours for first 24 hours
✅ **Responsive:** Reply to any response within 1 hour

---

## Post-Send Checklist (Do immediately after sending)

**Immediate (0-1 hour):**
- [ ] Update execution status below with timestamp
- [ ] Take screenshots of each sent message (for verification)
- [ ] Save this file

**First 24 Hours:**
- [ ] Check posts for replies (morning + evening)
- [ ] Respond to any replies within 1 hour
- [ ] Update response tracking table

**Day 2-3:**
- [ ] Continue checking for replies
- [ ] Continue responding promptly
- [ ] Document any patterns

---

## Execution Log

**Started:** [TIMESTAMP]
**Completed:** [TIMESTAMP]
**Total Time:** ___ minutes
**Messages Sent:** ____ / 20

**Notes:**
- Any issues during sending:
- Any unexpected responses:
- Any learnings:

---

## Reply Templates (Use when you get responses)

### If someone asks "What is this?"

```
Hi! I built a free tool to help with [specific pain point they mentioned]. 

It's completely free and I'm looking for feedback from people actually dealing with this problem. Would love your thoughts if you try it out!

Link: [PRODUCT_LINK]
```

### If someone says "This looks cool"

```
Thanks! If you get a chance to try it, I'd love to know what you think. 

I'm building this for people like [their specific situation], so any feedback on what would make it more useful for you would be super helpful.
```

### If someone gives feedback

```
This is exactly the kind of feedback I'm looking for! 

[Specific acknowledgment of their point]

I'm going to work on [improvement based on feedback]. Would you be open to me DMing you when I've updated it? Would love to get your thoughts on the changes.
```

### If someone asks "Why did you message me?"

```
Great question! I saw your post about [their topic] and it seemed like you're dealing with [specific challenge].

I built a tool that helps with exactly this, so I thought it might be useful. No pressure at all - just wanted to share something that could help with the problem you're working through.

If it's not relevant, no worries! Just trying to be helpful to the community.
```

---

## Monitoring Schedule

**Day 1 (First 24 hours):**
- Check: Every 4 hours
- Reply within: 1 hour of response

**Day 2-3:**
- Check: Morning + evening
- Reply within: 4 hours

**Day 7:**
- Final check
- Document learnings
- Plan next batch (if needed)

---

## Troubleshooting

**Script doesn't run:**
```bash
chmod +x /scripts/send-outreach.sh
./scripts/send-outreach.sh
```

**Can't find messages:**
- Product Hunt Tool: `/docs/operations/product-hunt-outreach-messages.md`
- Bot Analytics: `/docs/operations/bot-analytics-research-messages.md`

**Browser tabs don't open:**
- Manually open URLs from execution tracking doc
- Each target has direct link in tracking table

**Message gets flagged as spam:**
- Don't panic
- Wait 24 hours
- Try different platform
- Move to next target

**No replies after 48 hours:**
- Normal for cold outreach
- Improve messaging for next batch
- Try different platforms
- Consider paid promotion

---

## Backup Plan (If this batch fails)

**Batch 2 Targets (Already identified):**
- 10 more IndieHackers posts
- 10 more r/SideProject posts  
- 10 more r/SaaS posts
- 10 more r/Discord_Bots posts

**Alternative Channels:**
- Twitter (X) - DM founders
- LinkedIn - Comment on launch posts
- Discord servers - DM active users
- Hacker News - Comment on "Show HN" posts

**Execution:**
If no replies after 7 days → Trigger Batch 2 immediately

---

*Prepared by Auto Company*
*Total execution time: 5-10 minutes*
*Expected first replies: 24-48 hours*
*Mission: Get first users, learn, iterate*
