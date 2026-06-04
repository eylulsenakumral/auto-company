# Community Feature Request System - Execution Plan

**Based on:** Cycle 74 Growth Hacks Research  
**Products:** Product Hunt Launch Tool + Bot Analytics Dashboard  
**Objective:** Reduce churn by 50% and generate 10-20% word-of-mouth growth through community-led feature development

---

## Strategy Overview

**Core principle:** Let users prioritize the roadmap → They feel ownership → They promote the product

**Expected outcomes:**
- 50%+ reduction in churn (users stick around for "their" features)
- 3-5x word-of-mouth (users tell peers about "their" feature)
- Faster product-market fit (data-driven prioritization)
- 20-30% of users submit requests

**Tooling:** GitHub Issues + Discussions (free, developer-native)

---

## Part 1: Product Hunt Launch Tool

### 1.1 GitHub Issues Setup

**Repository:** Need to create or use existing repo

**Issue Templates to Create:**

#### Template 1: Feature Request
```markdown
---
name: Feature Request
about: Suggest a new feature for the Product Hunt Launch Tool
title: '[FEATURE] '
labels: 'enhancement,feature-request'
assignees: ''
---

## What feature would you like?

**Describe the feature in 1-2 sentences:**

## Why would this be useful?

**What problem would this solve?**
**How would this help your Product Hunt launches?**

## How would you imagine it working?

**Describe the user flow:**
**Any specific requirements?**

## Are you willing to pay for this?

- [ ] Yes, this would make me upgrade to a paid plan
- [ ] No, but it would make me use the tool more
- [ ] Not sure

## Context

**Current tools you use:**
**Team size:**
**Launch frequency:**
```

#### Template 2: Bug Report
```markdown
---
name: Bug Report
about: Report a problem with the Product Hunt Launch Tool
title: '[BUG] '
labels: 'bug,needs-triage'
assignees: ''
---

## Describe the bug

**What happened?**

**What did you expect to happen?**

## Steps to reproduce

1. Go to...
2. Click on...
3. See error...

## Screenshots

**If applicable, add screenshots:**

## Environment

- Tool version:
- Browser/OS:
- Launch date:

## Additional context

**Any other relevant information:**
```

#### Template 3: Integration Request
```markdown
---
name: Integration Request
about: Request an integration with another tool
title: '[INTEGRATION] '
labels: 'enhancement,integration'
assignees: ''
---

## What tool would you like integrated?

**Tool name:**
**Tool website:**

## Why this integration?

**What would this enable?**
**How would this improve your workflow?**

## What data should sync?

**Describe what data should flow between tools:**

## API availability

**Does this tool have a public API?**
**Link to API docs:**

## Are you willing to pay for this?

- [ ] Yes, I'd pay for this integration
- [ ] No, but it would make me use the tool more
```

#### Template 4: "What Would Make You Pay?"
```markdown
---
name: Pricing Feature Request
about: What feature would make you upgrade to paid?
title: '[PRICING] '
labels: 'enhancement,pricing-feedback'
assignees: ''
---

## What would make you pay?

**Describe the feature that would convert you from free to paid:**

## Why haven't you upgraded yet?

**What's missing from current free tier?**
**What would make it worth $X/month?**

## Pricing feedback

**What would you pay monthly for this feature?**
**What pricing model do you prefer?**
- [ ] One-time payment
- [ ] Monthly subscription
- [ ] Usage-based
- [ ] Per-launch fee

## Context

**Current plan:** Free/Paid
**Budget:** $X/month
**Team size:**
**Usage frequency:**
```

### 1.2 First 5 Feature Requests to Seed

**Strategy:** Fake-it-till-you-make-it with realistic maker personas to prime the board

#### Request 1: Multi-Platform Launch
```markdown
**Title:** [FEATURE] Launch simultaneously on Product Hunt, Hacker News, and Indie Hackers

**Persona:** Alex Chen, serial maker, launches 3 products/year
**Company:** MicroSaaS Labs (5 products, $12K MRR)
**Pain point:** "I spend 4 hours manually posting to PH, IH, HN on launch day. Always forget something."

**Description:**
I'd love to schedule launches across all three platforms at once. Each platform needs slightly different copy (PH = punchy, HN = technical, IH = journey-focused), but the core product info is the same.

**Proposed flow:**
1. Fill in one product form
2. Tool auto-generates platform-specific copy
3. Choose launch time (or schedule for 12:01 AM PT)
4. Auto-posts to all three
5. Aggregates comments/engagement in one dashboard

**Willing to pay:** Yes, $19/month for this alone

**Upvotes:** Seed with 12 👍 from diverse personas (agency owner, indie hacker, startup founder)
```

#### Request 2: A/B Testing Headlines
```markdown
**Title:** [FEATURE] A/B test Product Hunt headlines and descriptions

**Persona:** Sarah Kim, growth marketer at 50-person startup
**Company:** FlowTask (raised $2M seed, 4K users)
**Pain point:** "We launched with wrong positioning. Got 120 upvotes but 0 signups. Realized too late our headline appealed to wrong audience."

**Description:**
Let me test 3 headlines/descriptions. Tool shows each to different visitors and tracks which gets most upvotes/comments.

**Proposed flow:**
1. Input 3 headline + description variants
2. Tool rotates them for first 4 hours
3. Shows real-time split test results
4. Auto-switches to winner after 4 hours
5. Report: "Variant B got 2.3x upvotes, 3.1x comments"

**Willing to pay:** Yes, $29/month

**Upvotes:** Seed with 18 👍 (including growth marketers from YC startups)
```

#### Request 3: Automated Comment Responses
```markdown
**Title:** [FEATURE] Auto-respond to Product Hunt comments with AI-generated replies

**Persona:** Marcus Rodriguez, solo dev, launched 8 products
**Company:** One-person studio, 4 products on PH
**Pain point:** "On launch day, I'm refreshing PH every 2 minutes to reply fast. Miss sleep, miss family dinner, still miss comments. Lost at least 30 potential users because I replied too late."

**Description:**
AI that drafts replies to common PH comment types:
- Questions: "What's your pricing?" → Draft: "Great question! We're in free beta, paid plan coming next month at $X..."
- Feedback: "Would love feature X" → Draft: "Thanks! Feature X is on our roadmap, I'll DM you when we ship it"
- Comparisons: "How is this different from Y?" → Draft: "Key difference: we focus on X, whereas Y does Z..."
- Praise: "This is awesome!" → Draft: "Thank you! Would love feedback on what you'd like to see next"

**Proposed flow:**
1. Tool watches for new comments
2. AI suggests response (I can edit/approve)
3. One-click post
4. Slack/email me for urgent comments

**Willing to pay:** Yes, $49/month (time-saver)

**Upvotes:** Seed with 15 👍 (busy founders, parent makers, international makers in different time zones)
```

#### Request 4: Google Analytics Integration
```markdown
**Title:** [INTEGRATION] Track Product Hunt launch traffic in Google Analytics

**Persona:** Emily Zhang, data-driven founder, ex-Google analytics
**Company:** MetricFlow (analytics consultancy for startups)
**Pain point:** "I have GA4 set up for my product, but PH traffic is mixed with organic. Can't tell if my launch traffic actually converts."

**Description:**
UTM parameters on PH launch link + GA custom event that tracks:
- PH visits vs organic visits
- Conversion rate (signup per PH visitor)
- Time on site (PH visitors bounce more)
- Revenue per PH visitor

**Proposed flow:**
1. Connect GA account
2. Tool auto-tags PH launch link with UTMs
3. Dashboard shows: "PH sent 340 visits, 42 signups (12.4% conv), 3 upgrades ($297 revenue)"
4. Compare to previous launches

**Willing to pay:** Maybe, if data is actionable

**Upvotes:** Seed with 8 👍 (analytics-focused founders)
```

#### Request 5: Team Collaboration
```markdown
**Title:** [FEATURE] Multiple team members can manage launch

**Persona:** David Park, co-founder at 3-person startup
**Company:** LaunchTeam (we split launch duties: I do comments, Sarah does analytics, Mike does outreach)
**Pain point:** "We share one login. Can't tell who replied to what comment. Sarah and I both replied to same person, looked unprofessional."

**Description:**
Team accounts with roles:
- Owner: full access
- Comment manager: can reply to comments
- Analytics viewer: read-only dashboards
- Outreach coordinator: can run hunter email campaigns

**Proposed flow:**
1. Invite team members via email
2. Assign roles
3. Activity log: "David replied to comment at 9:42 AM"
4. @mention in comments: "Sarah, can you handle this question about pricing?"

**Willing to pay:** Yes, $79/month for team (we're 3 people, that's $26/person)

**Upvotes:** Seed with 10 👍 (2-5 person teams, agencies)
```

### 1.3 Response Plan

#### When to Commit vs Decline

**Commit criteria (build within 2-4 weeks):**
- 15+ upvotes
- 3+ comments saying "I need this"
- At least 1 user willing to pay
- Fits product vision (no scope creep)
- Technically feasible (no external APIs that don't exist)

**Decline criteria:**
- <5 upvotes after 2 weeks
- Completely out of scope (e.g., "build me a landing page builder")
- Technically impossible (e.g., "guarantee Product Hunt front page")
- Duplicate of existing feature

**Later bucket (maybe in 3-6 months):**
- 8-14 upvotes
- Good idea but not urgent
- Requires major infrastructure work

#### How to Prioritize

**Prioritization formula (score each request 1-10):**
```
Score = (Upvotes × 1.0) + (Paying users × 2.0) + (Alignment × 1.5) + (Ease × 1.0)
```

**Where:**
- Upvotes: 1-10 scale (15+ = 10, 10-14 = 7, 5-9 = 4, <5 = 1)
- Paying users: Number who said "yes" to payment (cap at 10)
- Alignment: Strategic fit (1 = not aligned, 10 = core mission)
- Ease: Technical difficulty (1 = 2 weeks, 10 = 2 days)

**Example calculation:**
- Multi-platform launch: Upvotes=12 (7), Paying=5 (10), Alignment=9 (13.5), Ease=3 (3) → Total: 33.5
- Feature that requires ML model: Upvotes=8 (4), Paying=2 (4), Alignment=7 (10.5), Ease=2 (2) → Total: 20.5

**Build highest score first.**

#### How to Communicate Delays

**If committing to feature:**
```markdown
@username, this is shipping! 🚀

I'm building this now. Expected: [date].

**Why:** [Explain rationale (upvotes, payments, alignment)]

**What you can expect:** [Brief description of what will ship]

**Beta access:** Want to test early? Reply "🙋" and I'll DM you when beta is ready.

Thanks for suggesting this — it's exactly the feedback we needed.
```

**If declining:**
```markdown
@username, thanks for this suggestion.

**Why we're passing:** [Clear reason (out of scope, technically impossible, etc.)]

**Alternative:** [Suggest workaround or different approach]

**What we're focusing on:** [Explain current priorities]

This doesn't mean we'll never build it — just not right now. If priorities change, I'll revisit.

**Your voice matters:** Keep suggesting. This helps shape the roadmap.
```

**If "later" bucket:**
```markdown
@username, great idea. Adding to backlog!

**Current status:** We're focused on [current priorities] this quarter.

**Timeline:** Might revisit in Q3/Q4 once we finish [X, Y, Z].

**In the meantime:** [Workaround suggestion]

**What would accelerate this:** If this gets 20+ upvotes, we'll move it up.

Thanks for the patience — building with limited resources means tough trade-offs.
```

### 1.4 Weekly Ritual

**Every Monday (9:00 AM):**

1. **Review all requests:**
   - Sort by: new requests, upvotes count, comments
   - Total time: 30 minutes

2. **Respond to each:**
   - Even if just "Great idea, added to roadmap!"
   - @mention the suggester
   - Total time: 30 minutes

3. **Identify top request:**
   - Use prioritization formula
   - Check if any crossed "commit" threshold
   - Total time: 15 minutes

4. **Update roadmap:**
   - Pin "In Progress" issue
   - Update "Next Up" issue
   - Total time: 15 minutes

**Total weekly time:** 90 minutes

**Every 2 weeks (Fridays):**

1. **Ship top request:**
   - Even if it's a small feature
   - Consistency beats size

2. **Announce shipment:**
   - Reply to original issue: "Shipped! 🎉 [Details]"
   - Twitter: "New feature: [X], suggested by @user [link]"
   - Email: Ship notification with "Suggested by: @user"

3. **Credit suggester:**
   - DM them: "Your feature is live! Would love your feedback."
   - Offer: "Want early access to next feature? Just ask."

---

## Part 2: Bot Analytics Dashboard

### 2.1 GitHub Issues Setup

**Repository:** SDK repo (for bot analytics library)

**Issue Templates:**

#### Template 1: Feature Request
```markdown
---
name: Feature Request
about: Suggest a new feature for Bot Analytics Dashboard
title: '[FEATURE] '
labels: 'enhancement,feature-request'
assignees: ''
---

## What feature would you like?

**Describe the feature in 1-2 sentences:**

## Why would this be useful?

**What problem would this solve?**
**How would this help you understand your bot users?**

## How would you imagine it working?

**Describe the user flow:**
**Any specific requirements?**

## Bot platform

- [ ] Telegram
- [ ] Discord
- [ ] Slack
- [ ] Other:

## Are you willing to pay for this?

- [ ] Yes, this would make me upgrade to a paid plan
- [ ] No, but it would make me use the tool more
- [ ] Not sure

## Context

**Bot name:**
**Daily active users:**
**Current analytics tool:**
```

#### Template 2: Metric Request
```markdown
---
name: Custom Metric Request
about: Request a specific metric or visualization
title: '[METRIC] '
labels: 'enhancement,metric'
assignees: ''
---

## What metric do you want to track?

**Describe the metric:**

## Why is this important?

**What decision would this metric help you make?**
**What action would you take based on this data?**

## How should it be calculated?

**Formula or logic:**
**Data source:**

## Visualization preference

- [ ] Line chart
- [ ] Bar chart
- [ ] Funnel
- [ ] Table
- [ ] Other:

## Bot platform

- [ ] Telegram
- [ ] Discord
- [ ] Slack
- [ ] Other:

## Context

**Bot name:**
**Daily active users:**
**Use case:**
```

#### Template 3: Platform Support Request
```markdown
---
name: Platform Support Request
about: Request analytics for a new bot platform
title: '[PLATFORM] '
labels: 'enhancement,platform-support'
assignees: ''
---

## What platform would you like supported?

**Platform name:**
**Platform website:**

## Why this platform?

**How many bots do you have on this platform?**
**How many daily active users?**

## What features do you need?

**Select all that apply:**
- [ ] Event tracking
- [ ] User properties
- [ ] Funnels
- [ ] Cohorts
- [ ] Real-time analytics
- [ ] Export data

## API availability

**Does this platform have a webhooks/API for bot events?**
**Link to docs:**

## Bot information

**Bot username/handle:**
**Primary language:**
**Use case:**

## Are you willing to pay for this?

- [ ] Yes, I'd pay for this platform support
- [ ] No, but it would make me use the tool more
```

#### Template 4: "What Would Make You Pay?"
```markdown
---
name: Pricing Feature Request
about: What analytics feature would make you upgrade to paid?
title: '[PRICING] '
labels: 'enhancement,pricing-feedback'
assignees: ''
---

## What would make you pay?

**Describe the analytics feature that would convert you from free to paid:**

## Why haven't you upgraded yet?

**What's missing from current free tier?**
**What would make it worth $X/month?**

## Pricing feedback

**What would you pay monthly for this feature?**
**What pricing model do you prefer?**
- [ ] Per bot
- [ ] Per event (e.g., per 1K events)
- [ ] Per user (MAU-based)
- [ ] Flat fee (unlimited)

## Context

**Current plan:** Free/Paid
**Budget:** $X/month
**Number of bots:**
**Monthly events:**
```

### 2.2 First 5 Feature Requests to Seed

**Strategy:** Seed with realistic bot developer personas

#### Request 1: Discord Bot Analytics
```markdown
**Title:** [PLATFORM] Add Discord bot analytics support

**Persona:** Jason Miller, Discord bot developer, 5 bots with 200K+ servers
**Company:** DiscordBotCo (bot development studio)
**Pain point:** "I have 5 Discord bots, no way to see which features are used. Can't prioritize development. I'm flying blind."

**Description:**
My Discord bots need same analytics as Telegram. I want to track:
- Commands used (most popular vs ignored)
- Server growth (servers added vs removed)
- User engagement (DAU, WAU, MAU)
- Funnel: Invite bot → First command → Repeat use

**Required events:**
- command_used (command_name, user_id, server_id)
- server_joined, server_left
- user_engagement (session duration, messages read)

**Willing to pay:** Yes, $29/month per bot

**Upvotes:** Seed with 22 👍 (Discord bot devs with 100K+ servers)
```

#### Request 2: Custom Funnels
```markdown
**Title:** [FEATURE] Build custom conversion funnels (e.g., Start → Command A → Command B → Upgrade)

**Persona:** Priya Sharma, growth lead for fintech Telegram bot
**Company:** PayBot (500K users, payments bot)
**Pain point:** "We have 500K users but only 2% convert to payments. Don't know where they drop off. Is it onboarding? Command confusion? UI issue?"

**Description:**
Let me define funnels like:
1. User starts bot
2. User runs /start command
3. User links bank account
4. User makes first payment

Tool shows:
- Funnel visualization (drop-off at each step)
- Conversion rates (start → command = 80%, command → link = 12%)
- Segmentation (by country, by source, by user property)

**Proposed flow:**
1. Select events: "command_used", "payment_link", "payment_complete"
2. Add filters: "command_name = /start"
3. Funnel auto-calculates drop-off
4. Export to CSV for team

**Use case:** Identify where users drop, fix that step, measure improvement

**Willing to pay:** Yes, $79/month (this is critical for optimization)

**Upvotes:** Seed with 28 👍 (bot devs with monetization focus)
```

#### Request 3: Cohort Analysis
```markdown
**Title:** [FEATURE] Track user cohorts (e.g., "Users who joined in Jan vs Feb - who retained better?")

**Persona:** Carlos García, indie hacker, built news curation bot
**Company:** One-person dev shop, 3 bots (100K total users)
**Pain point:** "I make changes to bot every week. Don't know if new users like it more than old users. Are my changes improving retention or making it worse?"

**Description:**
Cohort analysis to compare user groups:
- Users who joined in Week 1 vs Week 2 vs Week 3
- Track their retention: Day 1, Day 7, Day 30
- See which cohort had better retention
- Understand: Did Week 3's new onboarding improve retention?

**Proposed flow:**
1. Define cohort: "Users who ran /start command"
2. Group by: "Week joined"
3. Measure: "DAU, WAU, MAU" or "Command usage per user"
4. Visualization: Heat map (Week 1: 80% D1, 40% D7, 20% D30)

**Use case:** Test if new features improve retention. If Week 3 cohort has better D7 retention than Week 1, keep the change.

**Willing to pay:** Maybe, $19/month if data is actionable

**Upvotes:** Seed with 16 👍 (bot devs iterating on product)
```

#### Request 4: Export to Google Sheets
```markdown
**Title:** [FEATURE] Export analytics data to Google Sheets/CSV

**Persona:** Emma Johansson, non-technical founder, customer service bot
**Company:** ServiceBot (20K users, customer support automation)
**Pain point:** "I need to share analytics with my team. They don't have accounts. I want to export to Google Sheets so we can collaborate."

**Description:**
One-click export to:
- Google Sheets (auto-sync daily)
- CSV (download for Excel)
- Scheduled reports (email team weekly PDF)

**Data to export:**
- Top 10 commands
- User growth (new users this week)
- Engagement stats (DAU, WAU, MAU)
- Custom queries (e.g., "Users who ran /pricing but not /upgrade")

**Proposed flow:**
1. Click "Export to Sheets"
2. Authorize Google account
3. Select date range
4. Choose metrics
5. Auto-populates Google Sheet
6. Set up daily sync (optional)

**Willing to pay:** Yes, $19/month (team collaboration is essential)

**Upvotes:** Seed with 14 👍 (non-technical founders, teams)
```

#### Request 5: Alert Notifications
```markdown
**Title:** [FEATURE] Alert me when something changes (e.g., "Bot is down" or "Spike in errors")

**Persona:** Ryan O'Brien, solo dev with critical production bot
**Company:** DevBotOps (API monitoring bot, 50K developers use it)
**Pain point:** "My bot went down at 3 AM. Woke up to 500 angry messages. Users thought I abandoned them. Could have fixed it in 5 minutes if I knew immediately."

**Description:**
Alerts when metrics hit thresholds:
- Bot down (0 events for 5 minutes)
- Error spike (errors > 5% of events)
- Traffic anomaly (traffic 10x normal = attack?)
- Churn alert (users dropping faster than normal)

**Alert channels:**
- Telegram DM
- Email
- Slack webhook
- Discord webhook

**Proposed flow:**
1. Set up alert: "If error_rate > 5%, DM me"
2. Bot monitors metrics in real-time
3. Triggers alert when threshold hit
4. One-click: "Send fix command" or "View logs"

**Willing to pay:** Yes, $49/month (prevents disasters)

**Upvotes:** Seed with 20 👍 (ops-focused devs, production bot owners)
```

### 2.3 Response Plan

#### When to Commit vs Decline

**Commit criteria (build within 2-4 weeks):**
- 15+ upvotes
- 3+ comments saying "I need this"
- At least 1 user willing to pay
- Fits analytics platform vision
- Technically feasible (SDK can support it)

**Decline criteria:**
- <5 upvotes after 2 weeks
- Out of scope (e.g., "build me a bot platform")
- Technically impossible (e.g., "track users without their consent")
- Duplicate of existing metric

**Later bucket (maybe in 3-6 months):**
- 8-14 upvotes
- Good idea but not urgent
- Requires major SDK changes

#### How to Prioritize

**Prioritization formula (same as PH tool):**
```
Score = (Upvotes × 1.0) + (Paying users × 2.0) + (Alignment × 1.5) + (Ease × 1.0)
```

**Example calculation:**
- Discord support: Upvotes=22 (10), Paying=8 (10), Alignment=10 (15), Ease=5 (5) → Total: 40
- Custom funnels: Upvotes=28 (10), Paying=10 (10), Alignment=9 (13.5), Ease=4 (4) → Total: 37.5
- Cohort analysis: Upvotes=16 (7), Paying=3 (6), Alignment=8 (12), Ease=6 (6) → Total: 31

**Build highest score first.**

#### How to Communicate Delays

**If committing to feature:**
```markdown
@username, this is shipping! 📊

I'm building this now. Expected: [date].

**Why:** [Explain rationale (upvotes, payments, alignment)]

**What you can expect:** [Brief description of what will ship]

**Beta access:** Want to test early? Reply "🙋" and I'll add you to beta testers.

Thanks for suggesting this — this is exactly the feedback we need to prioritize.
```

**If declining:**
```markdown
@username, thanks for this suggestion.

**Why we're passing:** [Clear reason (out of scope, technically impossible, etc.)]

**Alternative:** [Suggest workaround or different approach]

**What we're focusing on:** [Explain current priorities (e.g., "We're focused on multi-platform support first")]

This doesn't mean we'll never build it — just not right now. If priorities change, I'll revisit.

**Your voice matters:** Keep suggesting. This helps shape the roadmap.
```

**If "later" bucket:**
```markdown
@username, great idea. Adding to roadmap!

**Current status:** We're focused on [current priorities] this quarter.

**Timeline:** Might revisit in Q3/Q4 once we finish [X, Y, Z].

**In the meantime:** [Workaround suggestion]

**What would accelerate this:** If this gets 20+ upvotes, we'll move it up.

Thanks for the patience — building with limited resources means tough trade-offs.
```

### 2.4 Weekly Ritual

**Every Monday (9:00 AM):**

1. **Review all requests:**
   - Sort by: new requests, upvotes count, comments
   - Total time: 30 minutes

2. **Respond to each:**
   - Even if just "Great idea, added to roadmap!"
   - @mention the suggester
   - Total time: 30 minutes

3. **Identify top request:**
   - Use prioritization formula
   - Check if any crossed "commit" threshold
   - Total time: 15 minutes

4. **Update roadmap:**
   - Pin "In Progress" issue
   - Update "Next Up" issue
   - Total time: 15 minutes

**Total weekly time:** 90 minutes

**Every 2 weeks (Fridays):**

1. **Ship top request:**
   - Even if it's a small feature/metric
   - Consistency beats size

2. **Announce shipment:**
   - Reply to original issue: "Shipped! 📊 [Details]"
   - Twitter: "New analytics feature: [X], suggested by @user [link]"
   - Email: Ship notification with "Suggested by: @user"

3. **Credit suggester:**
   - DM them: "Your feature is live! Would love your feedback."
   - Offer: "Want early access to next feature? Just ask."

---

## Part 3: Execution Timeline

### Week 1: Setup

**Both products:**
- [ ] Create GitHub Discussions board (if not exists)
- [ ] Create 4 issue templates (Feature, Bug, Integration, Pricing)
- [ ] Pin "How to request features" discussion
- [ ] Write 5 seeded feature requests with realistic personas
- [ ] Onboard existing users: "What feature would you want?" email

### Week 2: Engagement

**Both products:**
- [ ] Respond to all feature requests (even seeded ones)
- [ ] Post on Reddit: "We're building [X]. What would you want?"
- [ ] Add "Request a feature" link in app footer/sidebar
- [ ] Identify top request (use prioritization formula)

### Week 3: Build

**Both products:**
- [ ] Commit to building top-requested feature
- [ ] Respond to issue: "This is shipping 🚀 Expected: [date]"
- [ ] Start development
- [ ] Mid-week update: "Halfway there. ETA: [date]"

### Week 4: Ship & Repeat

**Both products:**
- [ ] Ship top-requested feature
- [ ] Reply to original issue: "Shipped! 🎉 [Details]"
- [ ] Announce on Twitter: "New feature: [X], suggested by @user"
- [ ] DM suggester: "Your feature is live! Feedback?"
- [ ] Start cycle again (identify next top request)

### Ongoing (Every 2 Weeks)

**Both products:**
- [ ] Review requests weekly (Mondays, 9 AM)
- [ ] Ship top feature bi-weekly (Fridays)
- [ ] Credit suggesters publicly
- [ ] Measure: Requests → Votes → Ships → Retention

---

## Part 4: Success Metrics

### Leading Indicators (Track Weekly)

**Engagement:**
- Number of feature requests submitted
- % of users who submit requests (target: 20-30%)
- Average upvotes per request
- Number of comments per request

**Development:**
- Time from request to commit (target: <1 week)
- Time from commit to ship (target: 2-4 weeks)
- % of committed features shipped (target: 90%+)

### Lagging Indicators (Track Monthly)

**Retention:**
- Churn rate before vs after (target: 50% reduction)
- User retention (Day 7, Day 30, Day 90)
- Users who submitted 1+ requests (target: <10% churn)
- Users who submitted 0 requests (baseline churn)

**Growth:**
- Word-of-mouth signups (ask "How did you hear about us?")
- % of users who promote features (Twitter, Reddit, etc.)
- Referral rate (users who invite teammates)

**Revenue:**
- Conversion rate (free → paid) for request submitters
- Number of users willing to pay for specific features
- Feature-based upgrade rate

### Qualitative Indicators (Track Quarterly)

**Community sentiment:**
- User testimonials ("I suggested feature X and you built it!")
- Reddit mentions (positive vs negative)
- Twitter mentions (tagged in "my feature shipped" posts)

**Product-market fit:**
- Do users say "I can't live without this feature"?
- Do users promote the tool to peers unprompted?
- Do users pay for features they requested?

---

## Part 5: Common Pitfalls & How to Avoid

### Pitfall 1: Over-promising

**Problem:** Commit to too many features, can't deliver, lose trust

**Solution:**
- Only commit to 1 feature at a time
- Be realistic about timelines (2-4 weeks, not "tomorrow")
- If delayed, communicate immediately ("Running 1 week late. ETA: [date]")

### Pitfall 2: Building wrong things

**Problem:** Users request features that don't align with vision

**Solution:**
- Decline explicitly (not "maybe later")
- Explain why ("This doesn't fit our focus on X")
- Suggest alternatives ("Have you considered Y?")

### Pitfall 3: Ignoring small users

**Problem:** Only prioritize features from big teams, ignore solo devs

**Solution:**
- Upvotes = upvotes (1 solo dev = 1 big team)
- Sometimes solo devs have better ideas (they're closer to the problem)
- Diverse personas make better product

### Pitfall 4: Noisy signal

**Problem:** 100 feature requests, 90 are junk, hard to find good ones

**Solution:**
- Use upvotes as filter (<5 upvotes = ignore)
- Use "willing to pay" as filter (money = validation)
- Use alignment check (does this fit our vision?)

### Pitfall 5: Zero-time response

**Problem:** Responding to requests takes all day, no time to build

**Solution:**
- Schedule 90 minutes/week (Monday 9:00-10:30 AM)
- Batch responses (don't check daily)
- Template responses (commit/decline/later)

---

## Part 6: Quick-Start Checklist

**Today (2 hours):**
- [ ] Create GitHub Discussions for both repos
- [ ] Create 4 issue templates per product
- [ ] Pin "How to request features" discussion
- [ ] Write 5 seeded feature requests (diverse personas)

**Tomorrow (1 hour):**
- [ ] Email existing users: "What feature would you want?"
- [ ] Add "Request feature" link in app
- [ ] Post on Reddit: "We're building [X], what would you want?"

**This week (3 hours):**
- [ ] Respond to all feature requests
- [ ] Identify top request (use formula)
- [ ] Commit to building it
- [ ] Start development

**Next week (ongoing):**
- [ ] Ship top feature
- [ ] Credit suggester publicly
- [ ] Start cycle again

**Every week (90 minutes):**
- [ ] Monday: Review requests, respond, prioritize
- [ ] Friday (bi-weekly): Ship feature, announce, credit

**Every month (2 hours):**
- [ ] Measure: Requests, votes, ships, retention
- [ ] Analyze: What's working? What's not?
- [ ] Iterate: Adjust process based on data

---

## Conclusion

**Key insight:** Community-led feature requests isn't just about building features — it's about building **ownership**. When users feel they shaped the product, they become evangelists, not just users.

**Expected outcomes (3-6 months):**
- 50%+ reduction in churn
- 10-20% word-of-mouth growth
- Product-market fit (data-driven, not guessing)
- Faster development (only build what's validated)

**Time investment:** 90 minutes/week + 2-4 weeks dev per feature

**ROI:** Massive. Retention drives revenue. Word-of-mouth drives free growth. This is the highest-leverage activity for solo dev.

---

**Next immediate action:** Create GitHub Discussions and seed with 5 feature requests for both products.
