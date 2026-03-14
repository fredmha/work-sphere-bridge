import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { industries, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function IndustriesPage() {
  usePageMeta(
    'Recruiter Use Cases | Born',
    'See how Born tailors bespoke recruiter systems for contingent desks, retained search firms, BD teams, and specialist recruiters.',
  );

  return (
    <>
      <PageHero
        eyebrow="Recruiter use cases"
        title="Different recruiter desks need different workflow detail."
        description="Born stays inside one market, but the workflow still changes by recruiter motion. The point is not cosmetic personalisation. The point is practical relevance in sourcing, context, calls, and follow-up."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
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
        title="If your desk has its own workflow constraints, Born designs around them."
        description="Use-case relevance matters because generic recruiter systems usually break at the context, handoff, or follow-up layers."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'View Process', to: '/process' }}
      />
    </>
  );
}
