import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { primaryCta, processStages } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function ProcessPage() {
  usePageMeta({
    title: 'Process | Born',
    description: 'See how Born audits, designs, builds, launches, and refines bespoke recruiter systems.',
    path: '/process',
  });

  return (
    <>
      <PageHero
        eyebrow="Process"
        title="A delivery model that keeps bespoke recruiter work clear from the start."
        description="The process is simple: understand the desk, shape the workflow, build the system, launch it, and then refine it using real usage instead of guesswork."
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
            <p className="meta-kicker">Commercial clarity</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Buyers can see what will happen before the work starts, which makes the whole engagement feel steadier and easier to trust.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Operational maturity</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The staged model shows that Born designs and manages recruiter systems end to end.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Better optimisation</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The refine stage matters because live desk activity should shape what gets changed next.
            </p>
          </article>
        </div>
      </section>

      <CtaBand
        title="If the current recruiter process feels messy, Born can help map what is missing."
        description="A recruiter systems audit is the fastest way to see whether the problem sits in sourcing, account context, call workflow, routing, or follow-up discipline."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'View Case Studies', to: '/case-studies' }}
      />
    </>
  );
}
