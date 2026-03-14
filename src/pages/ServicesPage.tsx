import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { primaryCta, services } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function ServicesPage() {
  usePageMeta({
    title: 'Services | Born',
    description:
      'See what Born builds for recruitment firms: prospecting, outreach, daily call queues, follow-up automations, and ongoing optimisation.',
    path: '/services',
  });

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Services shaped around the recruiter workflow that needs the most attention."
        description="Each service is built to steady one part of the desk. Start with the workflow that feels the most manual, scattered, or hard to trust."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Use Cases', to: '/industries' }}
      />

      <section className="site-section">
        <div className="page-stack">
          {services.map((service) => (
            <article key={service.slug} className="surface-panel grid gap-6 p-7 lg:p-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)] xl:items-start">
              <div>
                <p className="meta-kicker">Service line</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{service.title}</h2>
                <p className="mt-4 text-base leading-7 text-slate-700">{service.buyerFit}</p>
                <div className="mt-5">
                  <LinkArrow to={`/services/${service.slug}`}>{service.ctaLabel ?? 'Open service page'}</LinkArrow>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <div className="info-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">System build</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{service.systemBuild}</p>
                </div>

                <div className="accent-panel">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Business effect</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{service.businessEffect}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="outline-panel p-7">
            <p className="meta-kicker">How to read the offer</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Start with the workflow improvement you need now, not more complexity than the desk can absorb.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Some firms need the full operating model. Others just need one stressed part of the desk cleaned up first.
              The service pages are there to make that choice easier.
            </p>
          </div>
          <div className="surface-panel p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">What stays consistent</p>
            <ul className="mt-4 grid gap-4 text-sm leading-7 text-slate-700">
              <li>Born scopes around real recruiter workflow, not generic outbound templates.</li>
              <li>Each service is designed to work with your current stack where it makes sense.</li>
              <li>The goal is steadier execution, clearer follow-up, and less admin drag.</li>
            </ul>
          </div>
        </div>
      </section>

      <CtaBand
        title="Need help working out which service fits your desk?"
        description="We will pull 5 researched prospects before the first call and show you whether you need the full system or one focused upgrade."
        primaryAction={primaryCta}
      />
    </>
  );
}
