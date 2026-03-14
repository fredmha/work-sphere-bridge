import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { aboutPrinciples, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta({
    title: 'About | Recruitment Outbound Systems | Born',
    description:
      'See what Born is built to do for recruitment firms and how the outbound system work is approached.',
    path: '/about',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Born',
      url: 'https://born.directory/about',
      description: 'About Born and how it approaches outbound systems for recruitment firms.',
    },
  });

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Why recruiter teams bring Born in."
        description="Most firms do not need more tools. They need targeting, outreach, calls, and follow-up working as one commercial system."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Process', to: '/process' }}
        highlights={['Built for recruiter teams', 'Focused on prospect quality', 'Designed to actually get used']}
        aside={
          <div className="surface-panel p-7">
            <p className="meta-kicker">What Born actually changes</p>
            <div className="mt-5 grid gap-4">
              {[
                'Better companies entering the pipeline.',
                'Cleaner movement from outreach to calls.',
                'Less follow-up leakage after live conversations.',
              ].map((item) => (
                <div key={item} className="info-card text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        }
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
          <article className="surface-panel p-7">
            <p className="meta-kicker">Why Born exists</p>
            <div className="mt-5 grid gap-4 text-base leading-7 text-slate-700">
              <p>
                Targeting is manual, follow-up depends on memory, and good prospect companies go cold because nobody
                chased them. Most firms do not need more tools. They need a system that keeps business development
                moving every day.
              </p>
              <p>
                That is what Born does. The sourcing, outreach, call queue, follow-up, and pipeline get built
                around how your firm actually wins work, then tuned against live usage.
              </p>
              <p>The goal is a team workflow that feels clearer to run, easier to review, and harder to let drift.</p>
            </div>
          </article>

          <article className="outline-panel p-7">
            <p className="meta-kicker">Operating principles</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {aboutPrinciples.map((principle) => (
                <li key={principle} className="accent-card">
                  {principle}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="outline-panel p-7">
            <p className="meta-kicker">Built for recruiters</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The work is scoped around recruitment workflows rather than generic outbound templates.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Built around your market</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The system gets shaped around your niche, your tone, and how your team actually runs BD.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Practical</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The focus is steadier execution, clearer follow-up, and less admin drag for the team.
            </p>
          </article>
        </div>
      </section>

      <CtaBand
        title="If that sounds like the kind of help you want, the next step is simple."
        description="Get the 5 researched prospects, book the call, and work out whether Born is the right fit for the wider outbound build."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Get the 5 prospects', to: '/contact' }}
      />
    </>
  );
}
