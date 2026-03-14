export interface BlogSection {
  heading: string;
  body: string;
}

export interface BlogPostItem {
  slug: string;
  title: string;
  summary: string;
  seoDescription: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  sections: readonly BlogSection[];
}

export const blogPosts = [
  {
    slug: 'how-5-researched-prospects-turn-into-booked-recruiter-calls',
    title: 'How 5 researched prospects turn into booked recruiter BD calls',
    summary:
      'A demo blog post showing how the lead magnet should work: real prospects first, real context attached, then a booked call if the quality is there.',
    seoDescription:
      'See how Born uses 5 researched prospects as a recruiter lead magnet, why the pack matters, and how it turns into a booked business-development call.',
    category: 'Lead Magnet',
    publishedAt: '2026-03-14',
    updatedAt: '2026-03-14',
    readTime: '5 min read',
    sections: [
      {
        heading: 'The offer should feel concrete immediately',
        body:
          'Most recruiter offers are too abstract. Better outreach starts with something the buyer can judge quickly. That is why the 5 researched prospects matter. They are not a vague promise about targeting. They are actual prospect companies in the recruiter’s niche, with enough context to prove whether the sourcing quality is real.',
      },
      {
        heading: 'The prospect pack needs to shorten the distance to a call',
        body:
          'Each prospect should include the decision-maker, the hiring or growth signal, high-level company context, and a clear reason to reach out now. That turns the lead magnet into more than a list. It becomes a reason to book the call, because the recruiter can already see how the broader outbound build would improve their commercial workflow.',
      },
      {
        heading: 'The handoff should be immediate',
        body:
          'Once somebody submits the form, the path should stay simple. No dead-end thank-you page. No vague message about hearing back later. Send them straight to booking while intent is high. That keeps the lead magnet tied to the next commercial step instead of letting interest cool off in the gap between submission and response.',
      },
      {
        heading: 'The wider offer sits behind the lead magnet',
        body:
          'The 5 researched prospects are the proof point, not the whole service. If the quality is there, the next conversation expands into sourcing logic, warm outreach, call workflow, pipeline structure, and follow-up control. That sequence matters because it lowers friction at the front while still selling the full outbound build behind it.',
      },
    ],
  },
] as const satisfies readonly BlogPostItem[];
