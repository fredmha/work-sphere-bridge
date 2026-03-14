import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { primaryCta, processStages } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function ProcessPage() {
  usePageMeta({
    title: 'How It Works | Recruitment Outbound Systems | Born',
    description:
      'See how Born goes from 5 researched firms to a live outbound system for recruitment agencies: sourcing, outreach, call workflow, and follow-up.',
    path: '/process',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'How Born Works',
      url: 'https://born.directory/process',
      description:
        'How Born takes recruitment agencies from 5 researched firms to a live outbound system built around sourcing, outreach, calls, and follow-up.',
      about: 'Recruitment outbound systems',
    },
  });

  return (
    <>
      <PageHero
        eyebrow="Process"
        title="From 5 researched firms to a live outbound system."
        description="First we prove the targeting. Then we build the sourcing, outreach, call workflow, and follow-up system around how your team sells into firms."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
        highlights={['5-firm proof first', 'Built around calls', 'Follow-up stays visible']}
        aside={
          <div className="dark-panel p-7">
            <div className="relative z-10">
              <p className="eyebrow border-white/10 bg-white/8 text-white shadow-none">What the rollout proves</p>
              <div className="mt-6 grid gap-3">
                {[
                  ['1', 'Proof', 'You see the kind of firms Born would target before anything else gets sold.'],
                  ['2', 'Build', 'Once the fit is clear, the wider outbound system gets scoped around your workflow.'],
                  ['3', 'Launch', 'The end state is a live queue and a cleaner follow-up process your team can actually run.'],
                ].map(([step, title, body]) => (
                  <div key={title} className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                        {step}
                      </span>
                      <p className="text-sm font-semibold text-white">{title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-stone-100/74">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />

      <section className="site-section">
        <div className="page-stack">
          {processStages.map((stage, index) => (
            <article key={stage.name} className="surface-panel grid gap-5 p-7 lg:p-8 xl:grid-cols-[auto_minmax(0,1fr)_minmax(18rem,0.72fr)] xl:items-start">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white shadow-[0_14px_28px_rgba(16,50,34,0.15)]">
                {index + 1}
              </div>
              <div>
                <p className="meta-kicker">Stage</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{stage.name}</h2>
                <p className="mt-4 text-base leading-7 text-slate-700">{stage.summary}</p>
              </div>
              <div className="accent-panel">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">What comes out of this stage</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">{stage.output}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <div className="grid gap-6 lg:grid-cols-3">
          <article className="outline-panel p-7">
            <p className="meta-kicker">Clear next steps</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              You can see what happens before the build starts, which makes the engagement easier to trust.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">A live system</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The process ends with a working sourcing, outreach, call queue, and follow-up system your team can run.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Weekly refinement</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Live usage shapes what gets adjusted next, so the system improves against real conversations.
            </p>
          </article>
        </div>
      </section>

      <CtaBand
        title="Want to see how this would work in your market?"
        description="We pull 5 researched firms before the first call and use that to show you what the wider system would look like for your team."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See What You Get', to: '/services' }}
      />
    </>
  );
}
