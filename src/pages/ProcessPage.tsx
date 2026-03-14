import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { primaryCta, processStages } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function ProcessPage() {
  usePageMeta({
    title: 'Process | Born',
    description: 'See how Born pulls prospects, builds the system, launches the queue, and keeps improving it with real conversation data.',
    path: '/process',
  });

  return (
    <>
      <PageHero
        eyebrow="Process"
        title="A simple process that gets you from manual BD to a live queue."
        description="We start by understanding how you win work, then we build the prospecting, outreach, call queue, and follow-up around that."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
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
              You can see what will happen before the work starts, which makes the engagement easier to trust.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">A live system</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The process ends with a working prospecting, outreach, call, and follow-up system your team can run.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Weekly refinement</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Live desk activity shapes what gets adjusted next, so the system improves against real conversations.
            </p>
          </article>
        </div>
      </section>

      <CtaBand
        title="Want to see how this would work in your market?"
        description="We will pull 5 researched prospects before the first call and show you what the system would look like for your firm."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See What You Get', to: '/services' }}
      />
    </>
  );
}
