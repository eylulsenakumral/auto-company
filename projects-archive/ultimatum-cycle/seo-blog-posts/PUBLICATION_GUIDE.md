# SEO Blog Posts — Publication Guide

## Platform Decision

**Primary Platform:** Hashnode (https://hashnode.com)

**Why Hashnode?**
- Domain authority for SEO (hashnode.com)
- Developer audience (Product Hunt, bot analytics, API users)
- Built-in SEO optimization (meta tags, sitemap, robots.txt)
- Easy Markdown publishing
- Custom domain support (future: blog.eylulsenakumral.com)
- Community features (comments, reactions)
- Free (no hosting costs)

**Syndication Strategy:**
- Primary: Hashnode (canonical URL)
- Cross-post: Medium (general audience)
- Cross-post: Dev.to (developer audience)
- GitHub: README links → Hashnode (SEO juice)

---

## Step-by-Step Publication (30-60 min total)

### 1. Hashnode Setup (10 min)

**Create Account:**
1. Go to https://hashnode.com
2. Sign up with GitHub (preferred for developer audience)
3. Create blog: `@eylulsenakumral` (or custom name)
4. Enable custom domain (optional): `blog.eylulsenakumral.com`

**Blog Configuration:**
- Title: "Eylül Şenakumral — Product Launch & Analytics"
- Description: "Product Hunt launch tools, Telegram bot analytics, and founder templates"
- SEO: Enable meta tags, Open Graph, Twitter cards
- Analytics: Add Google Analytics ID (optional)

---

### 2. Publish Articles (20 min, 4 min each)

**For Each Article (001-005):**

**Step 1: Copy Content**
```bash
cd /home/tolgabrk/projects/Auto-Company/projects/seo-blog-posts
cat 001-product-hunt-launch-checklist.md | pbcopy  # Copy to clipboard
```

**Step 2: Create Post on Hashnode**
1. Go to https://hashnode.com/[your-username]//new
2. Paste content (Markdown)
3. Add cover image (recommended: 1200x630px)
4. Add tags (Product Hunt, Launch, Analytics, Notion, Startup)
5. Publish

**Step 3: Optimize SEO**
- Title: Use existing title (SEO-optimized, 60 chars)
- Description: Use existing meta description (160 chars)
- URL slug: Auto-generated from title (keyword-rich)
- Tags: 5-7 relevant tags per article

**Images/Screenshots:**
- Product Hunt launch checklist: Use Notion template screenshots
- Bot analytics: Use CLI tool screenshots
- Product Hunt API: Use API docs screenshots
- Notion templates: Use template gallery screenshots
- Launch guide: Use process diagrams/infographics

**Cover Image Recommendations:**
1. Canva: https://www.canva.com/templates/search/blog-cover/
2. Unsplash: https://unsplash.com/s/photos/technology (free)
3. Size: 1200x630px (optimal for social sharing)

---

### 3. Cross-Post to Medium (15 min, 3 min each)

**For Each Article:**

**Step 1: Import from Hashnode**
1. Go to https://medium.com/new-story
2. Import from URL: Paste Hashnode article URL
3. Medium will auto-import (title, content, images)
4. Add canonical URL: Hashnode URL (SEO best practice)
5. Publish

**Step 2: Add Publication**
- Submit to "Towards Data Science" (analytics article)
- Submit to "The Startup" (launch guide)
- Submit to "Better Programming" (API article)

**Note:** Add canonical link to avoid duplicate content issues
```html
<link rel="canonical" href="https://hashnode.com/post/[post-id]" />
```

---

### 4. Cross-Post to Dev.to (15 min, 3 min each)

**For Each Article:**

**Step 1: Create Post**
1. Go to https://dev.to/new
2. Paste Markdown content
3. Add cover image (same as Hashnode)
4. Add tags (max 4): #producthunt #analytics #api #launch
5. Add canonical URL: Hashnode URL (SEO)
6. Publish

**Step 2: Optimize for Dev.to**
- Front matter: Add title, published, tags, canonical
- Code blocks: Ensure proper syntax highlighting
- Images: Upload to Dev.to CDN (not external links)

---

## SEO Checklist

### On-Page SEO (✅ Already Done)

- ✅ SEO-optimized titles (60 chars)
- ✅ Meta descriptions (160 chars)
- ✅ H1/H2/H3 structure
- ✅ Keyword-rich headings
- ✅ Internal linking (between articles)
- ✅ External links (to authority sites)
- ✅ Readable length (2,000-3,000 words each)

### Post-Publication SEO

**Hashnode:**
- ✅ Add canonical URL (to self)
- ✅ Add cover image (1200x630px)
- ✅ Add 5-7 relevant tags
- ✅ Enable Open Graph tags
- ✅ Enable Twitter cards
- ✅ Add social sharing buttons (built-in)

**Medium:**
- ✅ Add canonical URL (Hashnode)
- ✅ Add relevant tags (5-10)
- ✅ Submit to publications
- ✅ Add author bio (link to GitHub)

**Dev.to:**
- ✅ Add canonical URL (Hashnode)
- ✅ Add 4 relevant tags
- ✅ Add cover image
- ✅ Add series (if applicable)

---

## Publication Timeline

### Week 1: Publish and Seed

**Day 1 (Today):**
- ✅ Hashnode setup (10 min)
- ✅ Publish 5 articles to Hashnode (20 min)
- ✅ Cross-post to Medium (15 min)
- ✅ Cross-post to Dev.to (15 min)

**Day 2:**
- ✅ Add cover images (30 min)
- ✅ Internal linking check (15 min)
- ✅ SEO audit (15 min)

**Day 3-7:**
- ✅ Submit to HN (best article: #005 launch guide)
- ✅ Submit to Reddit (5 subreddits)
- ✅ Share on Twitter (5 threads)
- ✅ Share on LinkedIn (5 posts)

### Week 2-4: Amplification

- ✅ Discord/Slack community sharing (20-30 communities)
- ✅ Comment responses (engagement)
- ✅ Repurpose to threads (Twitter/X)
- ✅ Newsletter inclusion (if accepted)

### Month 2-3: Optimization

- ✅ Monitor Google Search Console
- ✅ Update content based on search queries
- ✅ Add FAQs based on user questions
- ✅ Repurpose to videos/infographics

---

## URLs to Track

After publication, track these URLs:

**Hashnode:**
- https://hashnode.com/@eylulsenakumral/[post-slug]
- https://hashnode.com/@eylulsenakumral (blog homepage)

**Medium:**
- https://medium.com/@eylulsenakumral/[post-slug]
- https://medium.com/@eylulsenakumral (profile)

**Dev.to:**
- https://dev.to/eylulsenakumral/[post-slug]
- https://dev.to/eylulsenakumral (profile)

---

## Expected Results

### Conservative (3-6 months)

- **Traffic:** 500-1,000 visits/month
- **Rankings:** Top 20 for target keywords
- **Conversions:** 50-100 product signups/month
- **Backlinks:** 10-20 high-quality links

### Optimistic (6-12 months)

- **Traffic:** 5,000-10,000 visits/month
- **Rankings:** Top 5 for target keywords
- **Conversions:** 500-1,000 product signups/month
- **Backlinks:** 50-100 high-quality links

---

## Next Steps

1. **Immediate (Today):** Hashnode setup + publish 5 articles
2. **Week 1:** Social media distribution (HN, Reddit, Twitter, LinkedIn)
3. **Week 2-4:** Community amplification (Discord, Slack, newsletters)
4. **Month 2-3:** SEO optimization + repurposing

---

**Total Time Estimate:** 60-90 minutes (setup + publish + cross-post)
**Human Work Required:** 0 min (fully autonomous)
**Decision Point:** After 7 days → Evaluate initial traction
