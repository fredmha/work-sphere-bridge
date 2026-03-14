# Born Design Audit Prompt

Use this file as the prompt for a design creator working on the Born marketing site.

## Role

You are redesigning the visual system and key marketing pages for **Born**, a recruiter systems studio. Your job is not to make the site merely prettier. Your job is to turn the current site into a sharper, more distinctive, higher-trust commercial experience that still feels calm, premium, and operational.

Base your work on this audit of the current implementation.

## Inputs Reviewed

- `src/index.css`
- `src/components/MarketingLayout.tsx`
- `src/components/MarketingPrimitives.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/ServicesPage.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/content/bornSiteContent.ts`
- `src/born_website_strategy_brief.md`

## Brand Context

Born builds custom recruiter systems: signal intake, outreach workflow, reply routing, call workflow, CRM structure, and follow-up control. The brand should feel like:

- premium vertical SaaS
- serious systems consultancy
- calm, structured, credible
- recruiter-specific, not generic lead-gen
- implementation-led, not abstract strategy-led

The visual world should suggest workflow control, orchestration, operational clarity, and commercial trust.

## Current Design Audit

### Overall Score

**76/100**

This is already stronger than a generic template. The current site has a coherent foundation, good typography choices, a disciplined color system, and solid spacing. The main weakness is not sloppiness. The weakness is that too much of the site uses the same rounded-card language, the same soft contrast, and the same section rhythm, which flattens the hierarchy and makes the brand feel less singular than the positioning deserves.

### Dimension Scores

| Dimension | Score | Notes |
|---|---:|---|
| Visual Hierarchy | 7/10 | Clear enough, but many sections carry similar visual weight |
| Typography | 8/10 | Good font pairing and scale, but could push hierarchy harder |
| Color Palette | 8/10 | Calm, premium, brand-aligned green/stone palette |
| Spacing & White Space | 8/10 | Generous and mostly consistent |
| Visual Consistency | 8/10 | Strong system discipline |
| Imagery & Graphics | 5/10 | Too little distinctive visual storytelling |
| Layout & Grid | 7/10 | Clean, but repetitive in cadence |
| Component Design | 7/10 | Refined basics, but many components feel same-family |
| Branding & Personality | 7/10 | Serious and coherent, but not yet memorable enough |
| Modern Standards | 9/10 | Contemporary, restrained, avoids obvious dated patterns |

## What Is Working

- The palette is well judged: warm stone backgrounds, deep green primary, muted neutrals, and restrained accent usage.
- The typography pairing is credible: `Space Grotesk` for headings and `IBM Plex Sans` for body copy gives a modern systems tone.
- Section spacing, rounded corners, borders, and shadows are mostly consistent and premium.
- The site already avoids agency cliches like noisy gradients, startup neon, and fake dashboard clutter.
- CTA patterns are consistent and the contact form is clean and usable.
- The general tone matches the brief: calm, practical, and implementation-led.

## Main Problems To Solve

### 1. The site is too visually uniform

Many sections use near-identical panel treatments: soft white surface, rounded corners, fine borders, light shadow, muted text. This creates polish, but it also makes the page feel samey. The eye does not get enough variation in rhythm, depth, or tension.

### 2. The hierarchy is competent but not forceful

The headline system is good, but many secondary sections, cards, and intros land at similar visual intensity. Important proof, offers, and workflow explanations do not always dominate enough.

### 3. The "systems" idea is under-expressed visually

The brand positioning is strong: workflow, routing, orchestration, operating layers, queue control. But the visual language still relies heavily on abstract slabs and cards instead of showing operational structure in a memorable way.

### 4. Proof feels polished, but not yet concrete enough

Case studies, services, and trust elements read clearly, but the visuals do not yet communicate enough "real operating system" credibility. The site needs more structured proof artifacts: workflow maps, queue views, routing states, audit outputs, or operational diagrams.

### 5. The current art direction is tasteful but slightly safe

The site feels good, but a bit too generic-premium. It needs a more ownable visual signature without losing restraint.

## Design Direction

Create a design system that feels like:

- a calm command layer for recruiter operations
- editorially sharp, not decorative
- structured and modular, not boxed into one card style
- premium and high-trust, but still warm and human
- more distinctive than a standard SaaS marketing template

### Visual Metaphor

Think in terms of:

- operating layers
- queue states
- routing paths
- decision flows
- system maps
- recruiter desk control
- signal moving through a pipeline

Do not fall back to generic abstract gradients or fake "AI" motifs.

## Keep

- Light overall presentation
- Warm stone / off-white page canvas
- Deep green as the anchor brand color
- Sans + grotesk pairing, or a very close equivalent if improved
- Generous spacing
- Rounded components, but with more intentional hierarchy
- Subtle motion only where it adds clarity

## Change

- Reduce the overuse of the same glassy card treatment
- Increase hierarchy contrast between page sections
- Introduce more purposeful visual structures tied to workflow/system thinking
- Make proof sections feel more operational and less generic
- Give the homepage a more memorable hero composition
- Create more contrast between informational blocks, proof blocks, and CTA blocks

## Do Not Do

- Do not make it dark-mode-first
- Do not use cyberpunk, neon, or "AI startup" glow
- Do not make it playful or whimsical
- Do not turn it into a generic consulting website
- Do not rely on empty minimalism
- Do not use purple as a dominant brand color
- Do not use fake analytics dashboards unrelated to the service

## Specific Design Recommendations

### Visual Hierarchy

- Push the hero harder: stronger focal point, more authority, clearer dominance over secondary content
- Make primary proof sections visually heavier than supporting explanation sections
- Use contrast in composition, not just text size
- Create a clearer primary-secondary-tertiary rhythm across the homepage

### Typography

- Keep headings assertive, dense, and slightly compressed in feel
- Preserve a serious systems tone; avoid trendy editorial flourishes that undermine trust
- Consider slightly stronger contrast between display, section heading, body, and meta text
- Small uppercase labels are working; keep them, but use them more selectively

### Color

- Keep the green/stone foundation
- Add a more deliberate tonal ladder for the green family and neutrals
- Use pale green accents for routing/proof states, not as decoration everywhere
- Increase local contrast in places where muted text and muted borders currently blend too much

### Spacing

- Keep the generous spacing, but vary section density more intentionally
- Use occasional tighter, more information-rich compositions to prevent a monotonous "one slab per section" rhythm

### Components

- Develop at least three distinct surface modes: editorial/light content, operational/proof, and high-emphasis CTA.
- Differentiate cards by role, not just by slight background tint
- Make buttons feel more premium through spacing, states, and hierarchy rather than decoration

### Graphics and Art Direction

- Introduce tasteful workflow visuals, queue diagrams, or modular system schematics
- Use graphics to explain the service, not to fill space
- If mock interfaces appear, they should feel like recruiter workflow tools: signal intake, reply routing, call queues, follow-up states
- Consider subtle line systems, signal paths, or node logic as a recurring brand motif

## Homepage Redesign Brief

Redesign the homepage around these sections:

1. Hero
2. Credibility / trust strip
3. Core operating layers
4. Service overview
5. Case study proof
6. Who it is for
7. FAQ
8. Final CTA

### Homepage Requirements

- The hero must immediately communicate what Born builds
- The hero visual should feel like recruiter workflow infrastructure, not generic software decoration
- Trust elements should look operational and real
- Services should feel like parts of one system, not isolated cards
- Case study proof should show what changed in the workflow
- The CTA zone should feel decisive and premium

## Page-System Brief

Apply the same design language across:

- Home
- Services index
- Service detail pages
- About
- Process
- Case studies
- Contact

The system should support both:

- narrative/editorial sections
- structured operational sections

It must not collapse into a single repeated panel layout.

## Desired Output From The Design Creator

Produce:

1. A refreshed visual direction for Born
2. A homepage design
3. A page-system concept for inner pages
4. A small design system covering typography scale, color tokens, spacing rhythm, border radius rules, elevation rules, and button/input/card variants
5. Guidance for responsive behavior on desktop and mobile

## Success Criteria

The redesign should make a strong buyer think:

- these people build serious systems
- this feels more structured than a generic agency
- this looks premium without trying too hard
- the workflow thinking is obvious
- I trust this team with revenue-critical process

## Tone For The Final Design

The result should feel:

- precise
- calm
- modern
- premium
- operational
- recruiter-specific
- structured
- memorable without being loud

## One-Sentence Creative Direction

Design Born as a **light-toned recruiter operations brand**: a calm, premium system interface for firms that need more control over signal, outreach, calls, and follow-up.
