# How I Built a Discord Bot Analytics Dashboard

**Date:** June 4, 2026
**Time to Build:** 2 days
**Lines of Code:** ~400
**Stack:** Next.js, TypeScript, Tailwind CSS, Discord.js

## The Problem

I run a Discord bot. I wanted to know:

- How many servers is my bot in?
- How many messages does it process per day?
- Which commands are most popular?
- Is my bot growing or stagnating?

**The answer:** I had no idea.

Discord doesn't show this. Bot lists show some stats, but:
- Updated once per day (not real-time)
- No command-level analytics
- No trend visualization
- No actionable insights

I was flying blind.

## The Existing Solutions (And Why They Didn't Work)

I looked at existing bot analytics platforms:

1. **Top.gg:** Great for discovery, terrible for analytics (server count only)
2. **Carbon:** Expensive ($10+/mo), overkill for small bots
3. **Custom dashboards:** Requires backend, database, hosting — too much work

I needed something **simple, free, and focused on the metrics that matter.**

## The Solution

So I built the [Bot Analytics Dashboard](https://eylulsenakumral.github.io/bot-analytics-dashboard/).

**What it shows:**
- Server growth over time (are you growing or shrinking?)
- Message volume trends (engagement metrics)
- Top commands (what do users actually do?)
- Server distribution (which communities love your bot?)
- Activity heatmap (when is your bot busiest?)

**What it doesn't do:**
- Track individual users (privacy-first)
- Require complex setup (no backend, no database)
- Cost money (free, open source)

## How I Built It (Architecture)

**The Big Decision: No Backend**

Most analytics dashboards require:
- Database (PostgreSQL, MongoDB)
- Backend server (Node.js, Python)
- Cron jobs (for data collection)
- Hosting infrastructure (VPS, cloud)

I chose: **None of that.**

**Why No Backend?**

1. **Simplicity:** One frontend, one deploy, done
2. **Cost:** Free hosting on GitHub Pages
3. **Privacy:** Data stays in your browser
4. **Speed:** No server round-trips

**How It Works Instead:**

1. **Export data from Discord API** (using Discord.js)
2. **Upload JSON file to dashboard** (drag-and-drop)
3. **Visualize data in browser** (charts, heatmaps, trends)

It's a **local analytics tool**, not a cloud service.

## Key Features

**Feature 1: Server Growth Chart**

Line chart showing server count over time.

Why? Because growth is the only metric that matters for bot adoption.

**Feature 2: Command Usage Bar Chart**

Bar chart showing which commands are most used.

Why? Because knowing what users do = knowing what to build next.

**Feature 3: Activity Heatmap**

Calendar-style heatmap showing bot activity by day.

Why? Because patterns matter (weekends vs weekdays, active vs dormant).

**Feature 4: Server Distribution Table**

Top 10 servers by message volume.

Why? Because power users (communities) drive retention.

## What I Learned

**Lesson 1: Privacy Is A Feature**

I initially planned to store user data in a cloud database.

Then I realized: Bot owners care about privacy. They don't want their server data in someone else's database.

Local-first = privacy-first = trust.

**Lesson 2: Export-Based > Real-Time**

Real-time analytics requires backend infrastructure.

Export-based analytics requires... a file upload button.

Same insights, 10x simpler.

**Lesson 3: Trends > Snapshots**

A single number ("1,000 servers") tells you nothing.

A trend chart ("growing 50 servers/week") tells you everything.

Focus on trends, not totals.

## The Technical Implementation

**Data Export (Discord.js)**

```typescript
// Fetch bot stats from Discord API
const guilds = await client.guilds.fetch();
const commands = await getCommandUsage();

// Export as JSON
const data = {
  timestamp: Date.now(),
  serverCount: guilds.size,
  commands: commands,
  // ... more metrics
};

// Download as file
downloadJSON(data, 'bot-analytics.json');
```

**Data Visualization (Recharts)**

I used Recharts (React charting library) because:
- Simple API (declarative components)
- Responsive (mobile-friendly)
- Customizable (colors, tooltips, legends)

**File Upload (Browser API)**

```typescript
// Handle file upload
const handleUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    setAnalytics(data);
  };
  reader.readAsText(file);
};
```

That's it. No server, no database, no auth.

## What's Next

I'm building this in public. Here's my roadmap:

- **Week 1:** Add more chart types (pie charts, scatter plots)
- **Week 2:** Export-as-image feature (share your analytics)
- **Week 3:** Historical data comparison (week-over-week growth)
- **Week 4:** Template system (custom dashboards for different bot types)

## The Discord Bot Analytics Manifesto

**Belief 1: Bot owners deserve better analytics**

Not "server count updated once per day."
Real metrics: growth, engagement, trends.

**Belief 2: Privacy isn't optional**

Your data belongs to you. Not to my database. Not to my investors.

**Belief 3: Simple > Powerful**

A dashboard you'll use > A dashboard that can do everything.

## Try It Out

The dashboard is free. No signup. No tracking.

[Launch the dashboard](https://eylulsenakumral.github.io/bot-analytics-dashboard/)

If you run a Discord bot, export your data from Discord API and upload it to the dashboard. See your bot's analytics in a whole new way.

---

**Built with** Next.js, TypeScript, Tailwind CSS, Discord.js, Recharts
**Deployed on** GitHub Pages
**Source code** [GitHub](https://github.com/eylulsenakumral/bot-analytics-dashboard)

**Building in public — Tweet me your feedback:** @tolgabrk
