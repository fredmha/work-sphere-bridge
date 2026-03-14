import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { industries, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function IndustriesPage() {
  usePageMeta({
    title: 'Who It’s For | Recruitment Outbound Systems | Born',
    description:
      'See which recruitment firms Born is built for: contingent desks, retained search teams, executive search firms, and growth-stage agencies.',
    path: '/industries',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Born Use Cases',
      itemListElement: industries.map((industry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: industry.title,
        url: `https://born.directory/industries/${industry.slug}`,
      })),
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Who It&apos;s For"
        title="Built for recruiter teams that already know the right companies are out there."
        description="The workflow changes by niche, team shape, and which kinds of hiring companies your recruiters need to win. Born builds around that instead of forcing every team into the same setup."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
        highlights={['Contingent to retained', 'Built around your niche', 'No generic setup']}
        aside={
          <div className="dark-panel p-7">
            <div className="relative z-10">
              <p className="eyebrow border-white/10 bg-white/8 text-white shadow-none">Best fit signals</p>
              <div className="mt-6 grid gap-3">
                {[
                  'You can sell once you reach the right hiring team.',
                  'BD drops when delivery gets busy.',
                  'The team needs a steadier system, not more tools.',
                ].map((item) => (
                  <div key={item} className="rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-4 text-sm leading-6 text-stone-100/76">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-2">
          {industries.map((industry) => (
            <article key={industry.slug} className="surface-panel p-7">
              <p className="meta-kicker">Use case</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{industry.title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-700">{industry.summary}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Pain points</p>
                  <ul className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
                    {industry.painPoints.slice(0, 2).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Build focus</p>
                  <ul className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
                    {industry.buildFocus.slice(0, 2).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <LinkArrow to={`/industries/${industry.slug}`}>Open use case</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="If your team has its own workflow constraints, Born designs around them."
        description="That matters because generic outbound setups usually break at the targeting, handoff, or follow-up layers."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'View Process', to: '/process' }}
      />
    </>
  );
}
