import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { primaryCta, processStages } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function ProcessPage() {
  usePageMeta(
    'Process | Born',
    'See how Born audits, designs, builds, launches, and refines bespoke recruiter systems.',
  );

  return (
    <>
      <PageHero
        eyebrow="Process"
        title="A delivery model that keeps bespoke recruiter work commercially clear."
        description="The process is intentionally straightforward: audit the current recruiter setup, design the workflow, build the system, launch it, then refine it using real desk activity and conversion signals."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />

      <section className="site-section">
        <div className="grid gap-6">
          {processStages.map((stage, index) => (
            <article key={stage.name} className="surface-panel grid gap-5 p-7 lg:grid-cols-[0.18fr_0.42fr_0.4fr] lg:items-start">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white shadow-[0_16px_30px_rgba(16,50,34,0.18)]">
                {index + 1}
              </div>
              <div>
                <p className="meta-kicker">Stage</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{stage.name}</h2>
                <p className="mt-4 text-base leading-7 text-slate-700">{stage.summary}</p>
              </div>
              <div className="rounded-[1.5rem] border border-primary/10 bg-secondary/70 p-5">
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
              Buyers can see what will happen before the work starts, which makes the offer feel more credible and less risky.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Operational maturity</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The staged model shows that Born does not just launch outreach. It designs and manages recruiter systems end to end.
            </p>
          </article>
          <article className="outline-panel p-7">
            <p className="meta-kicker">Better optimisation</p>
            <p className="mt-4 text-base leading-7 text-slate-700">
              The review stage matters because reply quality, desk activity, and conversion signals should shape what gets changed next.
            </p>
          </article>
        </div>
      </section>

      <CtaBand
        title="If the current recruiter process feels messy, Born can map what is missing."
        description="A recruiter systems audit is the fastest way to diagnose whether the breakdown sits in sourcing, account context, call workflow, routing, or follow-up discipline."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'View Case Studies', to: '/case-studies' }}
      />
    </>
  );
}
