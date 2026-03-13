export const categories = [
  {
    href: '/categories#ai-productivity',
    id: 'ai-productivity',
    name: 'AI Productivity',
    description: 'Tools that automate planning, writing, research, and team workflows.',
    count: '42 startups',
  },
  {
    href: '/categories#developer-tools',
    id: 'developer-tools',
    name: 'Developer Tools',
    description: 'Infrastructure, observability, deployment, and API platforms for builders.',
    count: '31 startups',
  },
  {
    href: '/categories#fintech',
    id: 'fintech',
    name: 'Fintech',
    description: 'Payments, accounting, treasury, and financial operations software.',
    count: '18 startups',
  },
  {
    href: '/categories#climate',
    id: 'climate',
    name: 'Climate',
    description: 'Carbon accounting, energy management, and climate reporting products.',
    count: '12 startups',
  },
] as const;

export const startups = [
  {
    name: 'LedgerLoop',
    category: 'Fintech',
    blurb: 'Cash flow forecasting for founder-led teams that need finance clarity without a full CFO stack.',
    href: '/startups#ledgerloop',
  },
  {
    name: 'Northstar QA',
    category: 'Developer Tools',
    blurb: 'Regression testing and release verification for high-velocity product teams.',
    href: '/startups#northstar-qa',
  },
  {
    name: 'Signal Garden',
    category: 'AI Productivity',
    blurb: 'A shared research workspace that turns scattered market notes into usable strategy briefs.',
    href: '/startups#signal-garden',
  },
  {
    name: 'GridMint',
    category: 'Climate',
    blurb: 'Energy usage tracking and emissions reporting built for multi-site businesses.',
    href: '/startups#gridmint',
  },
] as const;

export const builders = [
  {
    name: 'Maya Chen',
    role: 'Founder, Signal Garden',
    summary: 'Former growth lead building AI workflows for lean product teams.',
    href: '/builders#maya-chen',
  },
  {
    name: 'Owen Clarke',
    role: 'Founder, Northstar QA',
    summary: 'Ex-platform engineer focused on making software delivery less brittle.',
    href: '/builders#owen-clarke',
  },
  {
    name: 'Priya Raman',
    role: 'Founder, LedgerLoop',
    summary: 'Finance operator turning treasury planning into a simple weekly habit.',
    href: '/builders#priya-raman',
  },
] as const;

export const recentLaunches = [
  {
    date: 'March 2026',
    name: 'Cinder Docs',
    detail: 'Documentation QA for API teams shipping weekly.',
    href: '/recent#cinder-docs',
  },
  {
    date: 'March 2026',
    name: 'Patch Atlas',
    detail: 'Incident review and remediation tracking for engineering leaders.',
    href: '/recent#patch-atlas',
  },
  {
    date: 'February 2026',
    name: 'Quota Bloom',
    detail: 'RevOps analytics for founder-led sales teams.',
    href: '/recent#quota-bloom',
  },
] as const;
