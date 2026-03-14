# born.directory — Website Audit & Revamp Brief
**Auditor:** Claude (cross-referenced against Notion business context)
**Date:** 14 March 2026
**Site:** https://born.directory

---

## TL;DR

The copy and structure are largely fixed from the previous version — the messaging is now recruiter-specific, the CTAs are concrete, and the page flows logically. The problem you're feeling is **visual and spatial, not conceptual.** The site looks like a Webflow template that hasn't been fully art-directed. It's legible but it doesn't *feel* like a founder-led, premium agency. It feels like a $97 Framer template someone put good words into.

The SEO layer is almost entirely absent. There is no content engine, no internal linking strategy, no structured data, no keyword-anchored pages beyond the homepage. That's fixable but it requires a deliberate content plan alongside the redesign.

---

## Section 1: What's Actually Working (Keep It)

Before tearing it down, here's what's genuinely good and should survive the revamp:

- **The headline** — "Your next 5 clients are already hiring. We'll find them." is sharp, specific, and creates immediate visual tension. Keep it.
- **The CTA** — "Get 5 Researched Prospects Today" is the best CTA a B2B agency site can have. It promises a tangible deliverable, not a "discovery call."
- **The trust bar** — "Built exclusively for recruiters · Founder-led, 3 clients per quarter · We build around your existing tools · 200% ROI guarantee" — all four are strong. Scarcity, social proof, low-friction entry, risk removal.
- **The self-qualification copy** — "You're a fit if / You're not a fit if" is the best section on the page. Recruiters read this and self-select. Rare to see this done this cleanly.
- **The form** — Name, work email, company, "What type of recruiting do you do?" is exactly right. Short enough to fill out, specific enough to pre-qualify.
- **The 3-step How It Works** — Plain, clear, accurate. No jargon.

---

## Section 2: The Look & Feel Problem (Core Diagnosis)

You said the look and feel feels "totally off" — here's the specific breakdown of why.

### 2.1 The Hero Has Two Competing Visual Anchors

The hero splits the viewport 50/50:
- **Left:** "Your next 5 clients are already hiring. We'll find them." — the primary headline, dark text on a sage/grey-green background.
- **Right:** A dark forest-green card with its OWN headline — "Every morning starts with researched prospects, not list building." — plus a full UI mockup inside it.

**The problem:** A visitor's eye doesn't know where to land. There are two headlines competing in the first viewport. The left headline is the hook; the right headline is explanatory. But because the right card is visually dominant (dark green, high contrast, full of elements), the eye goes there first — away from the actual message.

**The fix:** The right card should be a *visual*, not a second piece of copy. Remove the headline from the card. Let the mockup (the queue preview + system flow) speak for itself. The left headline drives the narrative. The right card provides proof-of-concept. Right now they're both trying to be the headline.

### 2.2 The Background Color is Generic and Conflicted

The sage/muted grey-green background on the left side of the hero (and the overall page background) is the most visually "off" element on the site. It's the default "neutral" choice that every Framer/Webflow template uses in 2024–25. It signals nothing about the brand.

More problematically, it creates a **colour conflict** between the light sage hero background and the dark forest green used in the hero card, the CTAs, and the footer. These two greens aren't harmonious — one is warm and muted, the other is deep and cold. The page looks like it was built by two people who agreed on "green" but picked different greens.

**The fix:** Either go full dark (dark forest green/near-black throughout, with the current card treatment extended to the whole hero) or go full light (clean white/off-white body with the dark green strictly for CTAs, cards, and the footer). Right now it's trying to be both.

### 2.3 Excessive White Space Between Sections

Every section has enormous padding above and below it. The gap between the "How It Works" steps and the "Who It's For" section is almost a full screen height on a standard monitor. The "Ongoing Optimisation" card floats in the middle of a largely empty section.

This isn't premium whitespace — it's unfinished whitespace. Premium whitespace is intentional and proportional. This looks like the default section padding was never adjusted.

**The fix:** Tighten section spacing by 30–40%. Sections should feel connected and rhythmic, not like they're floating in isolation.

### 2.4 The Logo and Brand Identity Has No Personality

The logo is a small green rocket icon + "Born" in a sans-serif + "RECRUITMENT OUTBOUND" in spaced caps. This combination is:
- Generic (rocket icon = every SaaS/startup ever)
- Redundant ("RECRUITMENT OUTBOUND" appears under the logo AND in a badge in the hero AND in the nav sub-label)
- Not distinctive (no wordmark, no visual identity that carries through)

For a founder-led agency that charges $2k–$5k setup + $800–$1,500/month, the brand needs to feel crafted and intentional — not like a Notion icon set.

**The fix:** Ditch the rocket. Build a simple wordmark — "Born" in a distinctive but clean typeface. If you want an icon, make it abstract and related to the concept (a queue, a signal, a flow). Something that works at 16px as a favicon and at 200px as a hero element.

### 2.5 The Hero Card Is Doing Too Much

The right-side hero card contains:
1. A "DAILY QUEUE" label
2. A headline
3. A sub-description
4. A "QUEUE PREVIEW" column with 3 sample entries, each with status labels
5. A "SYSTEM FLOW" column with 5 steps
6. A "WHAT CHANGES" panel below

This is a lot of UI for a single card. At desktop it's fine — dense but readable. On mobile it will collapse into chaos. More importantly, it tries to show *everything* in one element — the queue, the flow, and the outcome — when showing *one* thing clearly would be more powerful.

**The fix:** Simplify the card to one panel — either the Queue Preview OR the System Flow, not both. Show the queue: three prospect entries, each with hiring signal and status. That's the "aha" moment for a recruiter. The system flow can live in the "How It Works" section.

### 2.6 The "How It Works" Header Is Self-Referential

The section header reads: **"One clear walkthrough, once."**

This is commenting on the *design choice* to explain things once, not describing what the section *is*. A prospect doesn't care that you decided to explain things clearly. They care about what they're about to read.

**The fix:** Change to something direct. "How Born works." or "Three steps, then you're live." or just "How it works." The meta-commentary approach sounds like a designer wrote it, not a salesperson.

### 2.7 No Founder Section Anywhere on the Homepage

For a three-clients-per-quarter, founder-led agency, Fred *is* the product. Prospects are signing up to work with a specific person. There is no photo, no human face, no "About Fred" anywhere on the homepage.

**The fix:** Add a founder section between the "Who It's For" and the FAQ. Short: photo, 2–3 sentences, direct. Something like: "I'm Fred. I built this while studying CS/Finance at UNSW and spending 3 hours a day on cold calls. If you want a system built by someone who's still in the trenches, not a consultant who last made a BD call five years ago — that's what Born is."

That paragraph does more trust-building work than any bullet point on the page.

---

## Section 3: SEO — The Current State and What's Missing

### 3.1 Current SEO Baseline

| Element | Status | Notes |
|---|---|---|
| Title tag | Okay | "Born \| Bespoke outbound systems for recruitment firms" — descriptive but not keyword-optimised |
| Meta description | Unknown | Not visible from page scan |
| H1 | One | "Your next 5 clients are already hiring. We'll find them." — not keyword-rich |
| Internal links | Minimal | Nav links only, no contextual internal linking |
| Blog / content | None | No content engine at all |
| Schema markup | None | No LocalBusiness, Service, or FAQ schema |
| Backlinks | Unknown | |
| Page speed | Unknown | |
| Core Web Vitals | Unknown | |

### 3.2 The Fundamental SEO Problem

The site is a single-page homepage with a nav that links to different sections. There is no blog, no service pages, no location pages, no case study pages, no keyword-targeted landing pages. For SEO to "pump," you need more than one page that Google can index with depth.

A recruiter searching for "outbound system for recruitment agency" or "cold calling system for recruiters" or "GoHighLevel for recruitment" will not find this site. It ranks for the brand name only.

### 3.3 The SEO Revamp Strategy

**Phase 1 — Fix the homepage (technical SEO basics)**

- Set the title tag to: `Born | Outbound Systems for Recruitment Agencies | Sydney`
- Write a meta description that uses the primary keyword: "Born builds bespoke outbound systems for recruitment firms — prospecting, outreach, call queue, and follow-up automation. Built for 1–20 person agencies. Founder-led. Sydney."
- Add FAQ schema markup to the Common Questions section — this gives Google the structured data to pull FAQ results directly into search snippets
- Add LocalBusiness schema (Sydney, AU, recruitment services)
- Ensure H1, H2, H3 hierarchy is correct across the page
- Add alt text to all images with keyword-rich descriptions

**Phase 2 — Build the content engine (this is where SEO pumps)**

Create a `/blog` or `/resources` section with content targeting the search queries your ICP is actually using. Each article is a long-form, specific answer to a question a recruiter is Googling right now.

**Immediate target articles:**

1. **"How to build a cold outbound system for your recruitment firm"** — targets "outbound system recruitment", "cold calling recruitment agency", "recruitment BD system"
2. **"Why BD drops off when delivery gets heavy (and what to do about it)"** — targets "recruitment business development tips", "how to keep BD consistent recruitment"
3. **"GoHighLevel for recruitment agencies: what works and what doesn't"** — targets "GoHighLevel recruitment", "CRM for recruitment agencies"
4. **"How to build a daily call queue using job posting signals"** — targets "hiring signal prospecting", "how to find recruitment clients"
5. **"The 5 research signals that make a recruiter's cold call land"** — targets "cold calling tips for recruiters", "how to research prospects for recruitment BD"

Each article should:
- Be 1,200–2,000 words
- Answer the question directly in the first paragraph
- Include a mid-article CTA: "Want us to build this for you? Get 5 researched prospects today."
- Include a bottom CTA linking to the homepage form
- Link to each other internally where relevant

**Phase 3 — Service and location pages**

Once you have 5+ articles, build out:
- `/outbound-system-for-recruiters` — a dedicated service page with full detail
- `/recruitment-bd-automation` — targeting the automation angle
- `/sydney-recruitment-agency-systems` — local SEO for Sydney (your physical location)

**Phase 4 — Backlink strategy**

The content you create will naturally attract some links. To accelerate:
- Submit guest posts to recruitment industry publications (Shortlist, RCSA, SmartRecruiters blog)
- Get listed in "tools for recruiters" roundups
- Partner with a GoHighLevel-adjacent community for co-promotion

---

## Section 4: The Visual Revamp Brief

This is the brief for whoever rebuilds the site (or for you if you're doing it yourself).

### Colour system

Replace the current two-green conflict with a clean, decisive palette:

**Option A — Dark-first (premium, consultancy feel):**
- Background: `#0f1f17` (deep forest green, near-black)
- Surface cards: `#1a3028`
- Accent: `#4ade80` or `#86efac` (bright lime green, used sparingly for CTAs and highlights)
- Text primary: `#f5f0e8` (warm off-white)
- Text secondary: `#8fad9a` (muted sage)

This makes it feel like a serious operator's tool, not a marketing page.

**Option B — Clean-light (modern agency feel):**
- Background: `#ffffff` or `#fafaf8`
- Surface cards: `#f0f0ec`
- Accent/CTA: `#1a3028` (the current dark green, used correctly)
- Text primary: `#111111`
- Text secondary: `#666666`

This is cleaner and safer for readability. Easier to execute well.

**Do not use Option C (what you have now):** a muted sage-green background with dark green cards. The two greens fight each other.

### Typography

The current typeface is readable but generic. For a revamp:
- **Display / headlines:** Something with personality — Inter Display (free), Syne (free), or if budget allows, Neue Haas Grotesk. Avoid anything that looks like a "startup" font (Circular, Manrope, etc.).
- **Body:** Inter or DM Sans — clean, extremely readable at small sizes.
- **Monospace accents:** Consider using a monospace font for labels like "STEP 1", "QUEUE PREVIEW", "SYSTEM FLOW" — it emphasises the technical/operational nature of the product.

### Layout principles

- **Hero:** Full-width with a single visual anchor. The mockup moves to the right but with a cleaner, simplified card — just the queue, no competing headline.
- **Sections:** Reduce vertical padding from whatever it is now to something tighter. Each section should lead naturally into the next.
- **Cards:** The step cards in "How It Works" are currently equal width but STEP 3 is alone on the left with nothing beside it. Either add a fourth element or restructure to a vertical timeline.
- **Mobile:** The current layout likely collapses badly on mobile — the hero card and the left copy will stack and the card will dominate. Test and fix this as a priority.

### What to add

1. **Founder photo** — Professional, not corporate. Casual is fine. Somewhere between LinkedIn headshot and "screenshot from a Loom."
2. **System diagram** — A simple flow diagram showing: Hiring signal → Research → Outreach → Call queue → Disposition → Follow-up. This can replace or complement the current hero card.
3. **One real outcome statement** — Not a case study. One sentence: "The average Born client makes their first placement from a Born-sourced prospect within 6 weeks." If that's true, lead with it. If you have a different data point, use that.
4. **Social proof signal** — Even one line: "Working with recruitment firms in Sydney, Melbourne, and Brisbane." Signals you're real and active.

---

## Section 5: Priority Action List

### 🔴 P0 — Do This Week (Highest Impact)

- [ ] Fix the hero card: remove the "Every morning starts with researched prospects" headline from the right card. The card should be a visual, not a second headline.
- [ ] Choose a colour direction (dark-first or clean-light) and commit. Remove the muted sage background.
- [ ] Tighten section spacing — reduce padding between sections by at least 30%.
- [ ] Add founder section — photo, 2–3 sentences, honest and direct.
- [ ] Fix the "One clear walkthrough, once." header — replace with something direct.

### 🟡 P1 — This Month (SEO Foundation)

- [ ] Update title tag with primary keyword.
- [ ] Write and add meta description.
- [ ] Add FAQ schema markup to the Common Questions section.
- [ ] Add LocalBusiness schema.
- [ ] Fix heading hierarchy (H1 → H2 → H3) across the page.
- [ ] Write first 2 blog articles (target: "outbound system for recruitment agency" and "GoHighLevel for recruitment agencies").
- [ ] Set up Google Search Console and verify the site.
- [ ] Set up Google Analytics 4 with conversion tracking on the form submission.

### 🟢 P2 — Next 60 Days (Content Engine)

- [ ] Write 3 more blog articles.
- [ ] Build `/outbound-system-for-recruiters` service page.
- [ ] Set up a simple backlink outreach to 3–5 recruitment industry publications.
- [ ] Review Core Web Vitals and fix any speed issues.
- [ ] Submit sitemap to Google Search Console.

---

## Section 6: One-Sentence Summary of the Problem

> The site says the right things in the right order, but it looks like a developer's first pass at design — technically correct, visually uncommitted, and with no SEO infrastructure behind it.

Fix the colour conflict, tighten the spacing, add your face, simplify the hero card, and start publishing content. In 60–90 days the SEO will start to compound.

---

*Cross-referenced against: Business Foundation & Overview (Notion), Full Website Copy & UI Rebrand Audit (Notion), Website + SEO Blitz time block (Notion)*