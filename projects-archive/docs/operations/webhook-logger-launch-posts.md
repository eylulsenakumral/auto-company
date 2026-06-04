# Indie Hackers + HN Launch Posts

## Indie Hackers (Show & Tell)

**Title:** I shipped a webhook logger in 2 hours. Here's what I learned about shipping simple.

**Body:**

Last week I needed to debug Stripe webhook payloads. I pasted them into Notion, which worked but was ugly. Then I thought: "Why not build a simple tool?"

2 hours later, Webhook Logger was live.

No backend. No database. No React. Just a single HTML file with localStorage.

**The problem:** Webhook debugging is annoying. You copy-paste JSON into random tools, lose track of payloads, and can't easily compare them. Existing tools are overkill for simple debugging.

**The solution:** A minimal, client-side webhook logger that:
- Saves payloads to localStorage (privacy-first, no server needed)
- Pretty-prints JSON with syntax highlighting
- Lets you edit headers and timestamps
- Works offline after first load
- Fits in one 15KB HTML file

**The tech stack (intentionally boring):**
- Pure HTML + CSS + Vanilla JavaScript
- localStorage for persistence
- No frameworks, no build step
- Deploy to Cloudflare Pages or GitHub Pages in seconds

**The philosophy (borrowed from DHH):**
Ship simple. Ship fast. Let the market vote.

I didn't build:
- User authentication (not needed for local tool)
- Cloud sync (localStorage is sufficient for now)
- Search/filter (nice-to-have, can add later if requested)
- Export/import (can add based on feedback)

I focused on the core problem: paste, save, view. Everything else is noise until users tell me otherwise.

**Why this approach?**
Complexity kills projects. If I'd spent 2 weeks building a "proper" SaaS with Supabase, auth, and sync, I'd still be debugging the auth flow instead of having a working tool that people can use right now.

Ship the simple version. Iterate based on real usage, not imagined requirements.

**Current status:** Deployed, working, zero cost. If people use it, I'll add features they actually need. If not, I spent 2 hours learning instead of 2 weeks building the wrong thing.

**Engagement Questions:**
1. Have you built a "too simple" tool that surprised you by solving a real problem?
2. What's your rule of thumb for knowing when a feature is "good enough" to ship?
3. Would you use a local-only webhook debugger, or do you need cloud sync for your workflow?

---

## Hacker News (Show HN)

**Title:** Show HN: Webhook Logger – A single HTML file webhook debugger, no backend required

**Body:**

Hi HN, I built Webhook Logger – a minimal webhook debugging tool that lives entirely in your browser.

**Why:**
I was debugging Stripe webhooks and tired of pasting JSON into generic formatters. I wanted something that would save payloads locally and let me inspect them without setting up a database or auth.

**What it does:**
- Paste webhook JSON payloads and save them with one click
- Pretty-prints JSON with syntax highlighting
- Editable headers (Content-Type, X-Webhook-Source, etc.)
- Auto-generated timestamps
- Everything stored in localStorage (privacy-first, works offline)
- One-click copy to clipboard

**Technical approach:**
The entire tool is a single 15KB HTML file with:
- Pure vanilla JavaScript (no frameworks)
- localStorage for persistence
- No backend, no database, no auth
- Works offline after first load

Deploy anywhere that hosts static files – I'm using Cloudflare Pages.

**Philosophy:**
This follows DHH's approach: ship the simplest thing that works, then iterate based on real usage.

I deliberately didn't build:
- Cloud sync (localStorage is sufficient for single-device debugging)
- User accounts (not needed for a local tool)
- Search/filter (can add if users request it)
- Auth (not sending data anywhere)

The goal was to ship in 2 hours, not 2 weeks. If people use it, I'll add features they actually need. If not, I spent 2 hours instead of 2 weeks building something nobody wants.

**Code highlight:**
The core save function is ~20 lines of vanilla JS:
```javascript
function saveWebhook() {
    const rawJson = document.getElementById('webhookInput').value;
    try {
        const parsed = JSON.parse(rawJson);
        const webhook = {
            id: Date.now().toString(),
            json: parsed,
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Source': 'manual'
            },
            timestamp: new Date().toISOString()
        };

        let webhooks = JSON.parse(localStorage.getItem('webhooks') || '[]');
        webhooks.unshift(webhook);
        localStorage.setItem('webhooks', JSON.stringify(webhooks));

        renderWebhooks();
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
    }
}
```

That's it. No framework boilerplate, no database migrations, no auth flows. Just the minimum code to solve the problem.

**Live demo:** [Link will be added after deployment]
**GitHub:** [Link will be added after deployment]

**What I'd add based on feedback:**
- Search/filter across saved webhooks
- Export to JSON file
- Diff view to compare two webhooks
- Validation against webhook schemas (Stripe, GitHub, etc.)

But only if people actually use it and request those features.

**Questions for HN:**
1. For those who debug webhooks frequently: what's your current workflow? What would make this actually useful for you?
2. Is localStorage sufficient for this use case, or would you need cloud sync/removal of the 5MB limit?
3. What's your take on "ship simple vs. ship complete"? When do you choose one over the other?
