# SEO Blog Posts — Measurement Framework + Analytics Setup

## Analytics Setup (30-60 min)

### Step 1: Google Analytics (15 min)

**Create Property:**

1. Go to https://analytics.google.com
2. Click "Start measuring" (or "Admin" → "Create Property")
3. Property Name: `Hashnode Blog - [Your Name]`
4. Reporting Time Zone: `(GMT+03:00) Istanbul`
5. Currency: `USD` or `EUR` (depending on pricing)

**Data Stream Setup:**

1. Platform: `Web`
2. Stream URL: `https://hashnode.com/@[your-username]` (or custom domain)
3. Stream Name: `Hashnode Blog`
4. Enhanced Measurement: `Enable` (scrolls, outbound clicks, site search)

**Get Tracking ID:**

1. Copy `Measurement ID` (format: `G-XXXXXXXXXX`)
2. Save to notepad (you'll need this for Hashnode)

---

**Add to Hashnode:**

1. Go to Hashnode Dashboard → Blog Settings
2. Navigate to "Integrations" tab
3. Find "Google Analytics" section
4. Paste Measurement ID: `G-XXXXXXXXXX`
5. Click "Save"

**Verify Installation:**

1. Open your Hashnode blog in incognito window
2. Go to Google Analytics → Realtime report
3. Verify your visit appears (should show 1 active user)

---

**Custom Events Setup (Optional, 10 min):**

**Track Product Signups:**

1. Google Analytics → Admin → Events
2. Create Custom Event:
   - Event Name: `product_signup`
   - Condition: `URL contains /signup` (adjust based on actual signup URL)
3. Create Goal:
   - Goal Type: `Event`
   - Event Category: `product_signup`
   - Goal Value: `1` (count each signup)

**Track Content Engagement:**

1. Google Analytics → Admin → Events
2. Create Custom Event:
   - Event Name: `article_read`
   - Condition: `Scroll depth > 50%` (enhanced measurement)
3. Create Goal:
   - Goal Type: `Event`
   - Event Category: `article_read`
   - Goal Value: `1` (count each read)

---

### Step 2: Google Search Console (10 min)

**Add Property:**

1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Property Type: `URL Prefix`
4. Enter: `https://hashnode.com/@[your-username]` (or custom domain)
5. Click "Continue"

**Verify Ownership:**

**Option 1: HTML Tag (Recommended for Hashnode)**
1. Copy `meta tag` (format: `<meta name="google-site-verification" content="..." />`)
2. Go to Hashnode Dashboard → Blog Settings → Advanced
3. Find "Head Code" section
4. Paste meta tag
5. Click "Save"
6. Go back to Search Console → Click "Verify"

**Option 2: Google Analytics (If already setup)**
1. Choose "Google Analytics" verification method
2. Select your Analytics account
3. Click "Verify"

---

**Submit Sitemap:**

1. Hashnode automatically generates sitemap at: `https://hashnode.com/sitemap.xml`
2. Go to Search Console → Sitemaps
3. Enter: `sitemap.xml`
4. Click "Submit"

**Check Index Coverage:**

1. Go to Search Console → Coverage
2. Wait 24-48 hours for data to appear
3. Check for errors (excluded pages, crawl issues)

---

### Step 3: Hashnode Analytics (Built-in, 5 min)

**Enable Hashnode Stats:**

1. Go to Hashnode Dashboard → Blog Settings
2. Navigate to "Analytics" tab
3. Verify analytics are enabled (default on)
4. Connect Google Analytics (if not done in Step 1)

**Metrics Available:**
- Views per article
- Reads per article (scroll depth)
- Upvotes/Reactions
- Comments
- Shares
- Traffic sources

**Access Reports:**
1. Hashnode Dashboard → Analytics
2. View daily, weekly, monthly reports
3. Export data (CSV) for custom analysis

---

### Step 4: UTM Tracking (10 min, optional)

**Purpose:** Track which channels drive most traffic

**UTM Builder:**
https://ga-dev-tools.web.app/campaign-url-builder/

**URL Template:**
```
https://hashnode.com/@[username]/[article-slug]
  ?utm_source=[source]
  &utm_medium=[medium]
  &utm_campaign=[campaign]
```

**Examples:**

**Twitter Post:**
```
?utm_source=twitter&utm_medium=social&utm_campaign=launch_guide
```

**LinkedIn Post:**
```
?utm_source=linkedin&utm_medium=social&utm_campaign=notion_templates
```

**Reddit Post:**
```
?utm_source=reddit&utm_medium=social&utm_campaign=bot_analytics
```

**HN Post:**
```
?utm_source=hackernews&utm_medium=social&utm_campaign=product_hunt_api
```

**Newsletter Link:**
```
?utm_source=newsletter&utm_medium=email&utm_campaign=indie_hackers
```

**Track in Google Analytics:**
1. Acquisition → Campaigns → `utm_campaign`
2. Acquisition → Source/Medium → `utm_source / utm_medium`
3. Compare performance by channel

---

## Keyword Tracking Setup

### Manual Tracking (Week 1-4, daily)

**Tools:**
- Google Search Console (free)
- Ahrefs Webmaster Tools (free for 1 domain)
- SEMrush (paid, 30-day trial)

**Process:**

**Daily (Week 1):**
1. Open Google Search Console
2. Navigate to "Performance" report
3. Date range: Last 7 days
4. Query: [Your target keyword]
5. Record: Position, Impressions, Clicks, CTR

**Weekly (Week 2-4):**
1. Export Search Console data (CSV)
2. Sort by Impressions (high to low)
3. Identify top 20 keywords
4. Track position changes week-over-week

**Monthly (Month 2-6):**
1. Export Search Console data (CSV)
2. Sort by Position (low to high)
3. Identify keywords in positions #11-20 (opportunity keywords)
4. Update articles to target those keywords

---

**Tracking Spreadsheet Template:**

| Keyword | Position | Impressions | Clicks | CTR | Week Over Week |
|---------|----------|------------|--------|-----|----------------|
| Product Hunt launch checklist | 8 | 500 | 50 | 10% | ↑ 2 positions |
| Telegram bot analytics | 12 | 300 | 15 | 5% | → Same |
| Notion templates for founders | 15 | 200 | 10 | 5% | ↓ 3 positions |

---

### Automated Tracking (Month 2+, optional)

**Tool Options:**

**1. Ahrefs Webmaster Tools (Free)**
- Signup: https://ahrefs.com/webmaster-tools
- Add domain: `hashnode.com` (or custom domain)
- Track: Rankings, backlinks, organic keywords
- Reports: Weekly email updates

**2. SEMrush (Paid, $130/month)**
- Signup: https://semrush.com
- Project: Add domain
- Track: Position tracking, keyword rankings
- Reports: Daily/weekly email updates

**3. SerpAPI (Free tier available)**
- Signup: https://serpapi.com
- API: Google Search Results API
- Automation: Script to track positions daily
- Cost: 100 searches free (then $50/month)

**Recommendation:** Start with Google Search Console (free), upgrade to Ahrefs Webmaster Tools if scaling.

---

## Conversion Tracking

### Product Signup Tracking (Google Analytics)

**Setup:**

**Option 1: Direct Link Tracking (Simple)**
1. Add UTM parameters to all product links in articles
2. Example: `https://github.com/eylulsenakumral/bot-analytics-cli?utm_source=blog&utm_medium=content&utm_campaign=bot_analytics_article`
3. Track in GA: Acquisition → Campaigns

**Option 2: Event Tracking (Advanced)**
1. Add Google Analytics event to product links:
```html
<a href="https://github.com/..." onclick="gtag('event', 'product_click', {'event_category': 'outbound_link', 'event_label': 'bot_analytics_cli'});">Bot Analytics CLI</a>
```
2. Track in GA: Events → Event Category → `outbound_link`

**Option 3: Goal Tracking (Recommended)**
1. GA Admin → Goals → New Goal
2. Goal Setup: Custom
3. Goal Description: Product Signup
4. Goal Details:
   - Type: Event
   - Category: `product_signup`
   - Action: `click`
   - Label: `[product_name]`
   - Value: `1`
   - Funnel: Optional (track steps before signup)

---

**Track Conversions per Article:**

1. GA → Behavior → Site Content → All Pages
2. Filter by `/@[username]/[article-slug]`
3. Secondary Dimension: Event Goal Completions
4. View: Which article drives most signups

**Report Template:**

| Article | Sessions | Signups | Conversion Rate | Revenue |
|---------|----------|---------|-----------------|---------|
| Product Hunt Launch Guide | 500 | 50 | 10% | $200 (4 × $50) |
| Telegram Bot Analytics | 300 | 30 | 10% | $150 (3 × $50) |
| Notion Templates | 200 | 10 | 5% | $50 (1 × $50) |

---

## Weekly Reporting (15 min)

### Report Template (Copy-Paste)

```
Weekly SEO Report — Week [X]

📊 Traffic Overview:
- Total Sessions: [X] ([+/- X%] vs last week)
- Unique Users: [X] ([+/- X%] vs last week)
- Pageviews: [X] ([+/- X%] vs last week)
- Avg. Session Duration: [X] minutes ([+/- X%] vs last week)
- Bounce Rate: [X]% ([+/- X%] vs last week)

📈 Top Content (by Sessions):
1. [Article Name]: [X] sessions ([+/- X%] vs last week)
2. [Article Name]: [X] sessions ([+/- X%] vs last week)
3. [Article Name]: [X] sessions ([+/- X%] vs last week)

🔍 Keyword Rankings (Top 10):
1. [Keyword]: Position #[X] ([+/- X] vs last week) - [X] impressions
2. [Keyword]: Position #[X] ([+/- X] vs last week) - [X] impressions
3. [Keyword]: Position #[X] ([+/- X] vs last week) - [X] impressions

💬 Engagement:
- Total Comments: [X] ([+/- X] vs last week)
- Total Shares: [X] ([+/- X]] vs last week)
- Avg. Time on Page: [X] minutes ([+/- X%] vs last week)

🎯 Conversions:
- Product Signups: [X] ([+/- X] vs last week)
- Conversion Rate: [X]% ([+/- X%] vs last week)
- Estimated Revenue: $[X] ([+/- X%] vs last week)

📊 Traffic Sources:
1. [Source]: [X]% of traffic ([X] sessions)
2. [Source]: [X]% of traffic ([X] sessions)
3. [Source]: [X]% of traffic ([X] sessions)

💡 Key Insights:
1. [Insight 1]
2. [Insight 2]
3. [Insight 3]

⏭️ Next Week Actions:
1. [Action 1]
2. [Action 2]
3. [Action 3]
```

---

**How to Pull Data (Google Analytics):**

**Sessions, Users, Pageviews:**
1. GA → Reports → Audience → Overview
2. Date range: Last 7 days
3. Compare to: Previous 7 days
4. Record metrics

**Top Content:**
1. GA → Reports → Behavior → Site Content → All Pages
2. Filter: `/@[username]/` (your blog posts)
3. Sort by: Unique Pageviews
4. Record top 3

**Keyword Rankings:**
1. GSC → Performance report
2. Date range: Last 7 days
3. Sort by: Impressions
4. Filter: Position ≤ 10
5. Record top 3

**Traffic Sources:**
1. GA → Reports → Acquisition → All Traffic → Source/Medium
2. Date range: Last 7 days
3. Sort by: Sessions
4. Record top 3

**Conversions:**
1. GA → Reports → Conversions → Goals → Overview
2. Date range: Last 7 days
3. Record: Goal Completions, Conversion Rate

---

## Monthly Reporting (30 min)

### Report Template (Copy-Paste)

```
Monthly SEO Report — Month [X]

📊 Traffic Growth:
- Organic Sessions: [X] ([+/- X%] vs last month)
- Direct Sessions: [X] ([+/- X%] vs last month)
- Social Sessions: [X] ([+/- X%] vs last month)
- Referral Sessions: [X] ([+/- X%] vs last month)
- Total Sessions: [X] ([+/- X%] vs last month)

📈 Keyword Rankings (Progress):
- Keywords in Top 10: [X] ([+/- X] vs last month)
- Keywords in Top 20: [X] ([+/- X] vs last month)
- Keywords in Top 50: [X] ([+/- X] vs last month)
- Total Keywords Ranking: [X] ([+/- X] vs last month)

🏆 Best Performing Keywords:
1. [Keyword]: Position #[X], [X] impressions, [X] clicks, [X]% CTR
2. [Keyword]: Position #[X], [X] impressions, [X] clicks, [X]% CTR
3. [Keyword]: Position #[X], [X] impressions, [X] clicks, [X]% CTR

📄 Content Performance:
- Best Article: [Name] ([X] views, [X] conversions, [X]% conversion rate)
- Worst Article: [Name] ([X] views, [X] conversions, [X]% conversion rate)
- Most Improved: [Name] ([+/- X]% increase in views)
- Avg. Views per Article: [X]

💬 Engagement Metrics:
- Total Comments: [X] ([+/- X] vs last month)
- Total Shares: [X] ([+/- X] vs last month)
- Avg. Time on Page: [X] minutes ([+/- X%] vs last month)
- Avg. Scroll Depth: [X]% ([+/- X%] vs last month)

🔗 Backlink Profile:
- Total Backlinks: [X] ([+/- X] vs last month)
- Referring Domains: [X] ([+/- X] vs last month)
- Top Referrer: [Domain] ([X] links)
- Best Backlink: [Domain] (DA: [X], traffic: [X]/month)

🎯 Conversions:
- Product Signups: [X] ([+/- X] vs last month)
- Trial Users: [X] ([+/- X] vs last month)
- Paying Customers: [X] ([+/- X] vs last month)
- MRR: $[X] ([+/- X%] vs last month)

💰 ROI Analysis:
- Time Invested: [X] hours
- Revenue Generated: $[X]/month
- ROI per Hour: $[X]/hour
- Payback Period: [X] months

📊 Channel Breakdown:
- Organic Search: [X]% of traffic, [X]% of conversions
- Social Media: [X]% of traffic, [X]% of conversions
- Direct: [X]% of traffic, [X]% of conversions
- Referral: [X]% of traffic, [X]% of conversions

💡 Key Learnings:
1. [Learning 1]
2. [Learning 2]
3. [Learning 3]

🔄 Content Updates Made:
1. [Update 1]
2. [Update 2]
3. [Update 3]

⏭️ Next Month Plan:
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

📈 Growth Targets (Next Month):
- Sessions: [X] ([+/- X%] target)
- Keywords in Top 10: [X] ([+/- X] target)
- Conversions: [X] ([+/- X%] target)
- MRR: $[X] ([+/- X%] target)
```

---

**How to Pull Data (Google Search Console):**

**Keyword Rankings:**
1. GSC → Performance report
2. Date range: Last 30 days
3. Compare to: Previous 30 days
4. Filter: Position ≤ 50
5. Export: CSV

**Backlinks:**
1. GSC → Links → External links
2. Top linking sites: [X] domains
3. Top linked pages: [X] pages
4. Export: CSV

---

**How to Pull Data (Ahrefs / SEMrush - Optional):**

**Backlink Profile:**
1. Ahrefs → Site Explorer → Enter domain
2. Backlinks report: Total backlinks, referring domains
3. Best backlinks: Filter by DR (Domain Rating) ≥ 50
4. Export: CSV

**Keyword Positions:**
1. Ahrefs → Site Explorer → Organic keywords
2. Filter: Position ≤ 20
3. Export: CSV (track positions over time)

---

## Success Metrics Dashboard

### Weekly Dashboard (Simple)

**Key Metrics (Track in Google Sheets):**

| Metric | Week 1 | Week 2 | Week 3 | Week 4 | Goal |
|--------|--------|--------|--------|--------|------|
| Sessions | 100 | 150 | 200 | 250 | 500 |
| Users | 80 | 120 | 160 | 200 | 400 |
| Top 10 Keywords | 0 | 1 | 2 | 3 | 5 |
| Signups | 5 | 8 | 12 | 15 | 50 |
| MRR | $0 | $50 | $100 | $150 | $500 |

---

### Monthly Dashboard (Comprehensive)

**Key Metrics (Track in Google Data Studio - Optional):**

**Traffic:**
- Organic Sessions: [X] (green if ↑ 10%+ MoM, red if ↓)
- Social Sessions: [X] (green if ↑ 10%+ MoM, red if ↓)
- Total Sessions: [X] (green if ↑ 10%+ MoM, red if ↓)

**SEO:**
- Keywords in Top 10: [X] (green if ↑ 2+ MoM)
- Keywords in Top 20: [X] (green if ↑ 5+ MoM)
- Total Keywords: [X] (green if ↑ 10+ MoM)

**Engagement:**
- Avg. Time on Page: [X] min (green if ↑ 10%+ MoM)
- Comments per Article: [X] (green if ↑ 5+ MoM)
- Shares per Article: [X] (green if ↑ 5+ MoM)

**Conversions:**
- Signups: [X] (green if ↑ 20%+ MoM)
- Conversion Rate: [X]% (green if ≥ 10%)
- MRR: $[X] (green if ↑ 20%+ MoM)

---

**Google Data Studio Setup (Optional, 1 hour):**

1. Go to https://datastudio.google.com
2. Create → Blank Report
3. Add Data Sources:
   - Google Analytics (Hashnode blog)
   - Google Search Console (Hashnode domain)
4. Create Widgets:
   - Scorecard (Sessions, Users, Keywords, Signups)
   - Time Series (Sessions over time)
   - Bar Chart (Top articles by sessions)
   - Table (Keyword rankings)
5. Share: Publish report → Share link

---

## Decision Framework

### Week 4 Review: Pivot or Double Down?

**Continue SEO Strategy If:**
- ✅ 500+ sessions by Week 4
- ✅ 2+ keywords in Top 20
- ✅ 10+ conversions by Week 4
- ✅ Positive feedback (comments, shares)

**Pivot to Paid Ads If:**
- ❌ < 200 sessions by Week 4
- ❌ 0 keywords in Top 50
- ❌ < 5 conversions by Week 4
- ❌ Zero engagement (no comments, no shares)

**Hybrid Strategy (SEO + Paid) If:**
- 🟡 200-500 sessions by Week 4
- 🟡 1-2 keywords in Top 30
- 🟡 5-10 conversions by Week 4
- 🟡 Moderate engagement (some comments, some shares)

---

### Month 6 Review: Scale or Optimize?

**Scale Content Production If:**
- ✅ 5,000+ sessions/month
- ✅ 5+ keywords in Top 10
- ✅ 100+ conversions/month
- ✅ $1,000+ MRR

**Optimize Existing Content If:**
- 🟡 1,000-5,000 sessions/month
- 🟡 2-5 keywords in Top 20
- 🟡 20-100 conversions/month
- 🟡 $100-1,000 MRR

**Pivot Strategy If:**
- ❌ < 1,000 sessions/month
- ❌ 0-1 keywords in Top 50
- ❌ < 20 conversions/month
- ❌ <$100 MRR

---

## Summary

**Analytics Setup Time:** 30-60 minutes
- Google Analytics: 15 min
- Google Search Console: 10 min
- Hashnode Analytics: 5 min
- UTM Tracking: 10 min (optional)

**Weekly Reporting Time:** 15 minutes/week
- Pull data from GA + GSC: 10 min
- Update report template: 5 min

**Monthly Reporting Time:** 30 minutes/month
- Pull data from GA + GSC: 15 min
- Update report template: 10 min
- Decision analysis: 5 min

**Total Time Over 6 Months:** 4-5 hours (setup + 24 weekly reports + 6 monthly reports)

**Key Metrics to Track:**
- Traffic growth (sessions, users)
- SEO progress (keyword rankings)
- Engagement (comments, shares, time on page)
- Conversions (signups, MRR)
- ROI (revenue per hour invested)

**Decision Points:**
- Week 4: Continue SEO / Pivot to Paid / Hybrid
- Month 6: Scale / Optimize / Pivot

---

**File Size:** ~3,000 words of measurement framework
**Time Estimate:** 30-60 min setup + 15 min/week + 30 min/month
**Human Work Required:** 0 min (fully autonomous setup guide + templates)
