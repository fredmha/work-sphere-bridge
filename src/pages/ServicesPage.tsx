import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { primaryCta, services } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function ServicesPage() {
  usePageMeta(
    'Services | Born',
    'Explore Born services for recruiter system architecture, hiring-signal sourcing, workflow software, and follow-up control.',
  );

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Services built around recruiter workflow bottlenecks."
        description="Each service line maps to a concrete recruiter problem: weak sourcing, shallow account context, messy call execution, soft follow-up discipline, or unclear automation decisions."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Use Cases', to: '/industries' }}
      />

      <section className="site-section">
        <div className="grid gap-6">
          {services.map((service) => (
            <article key={service.slug} className="surface-panel grid gap-6 p-7 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
              <div>
                <p className="meta-kicker">Service line</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{service.title}</h2>
                <p className="mt-4 text-base leading-7 text-slate-700">{service.problem}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{service.audience}</p>
                <div className="mt-6">
                  <LinkArrow to={`/services/${service.slug}`}>Open service page</LinkArrow>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-border/80 bg-white/90 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Includes</p>
                  <ul className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
                    {service.includes.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[1.5rem] border border-primary/10 bg-secondary/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Outcomes</p>
                  <ul className="mt-3 grid gap-3 text-sm leading-6 text-slate-700">
                    {service.outcomes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="outline-panel p-7">
            <p className="meta-kicker">Why this structure works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              The offer reads like bespoke recruiter software, not general support.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Buyers can see exactly where Born fits: sourcing logic, research systems, call workflow, automation, and
              follow-up control. That keeps the offer premium without becoming vague.
            </p>
          </div>
          <div className="surface-panel p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Avoiding the agency trap</p>
            <ul className="mt-4 grid gap-4 text-sm leading-7 text-slate-700">
              <li>Born does not sell generic recruiter activity with unclear ownership.</li>
              <li>Born does not hide delivery behind broad automation language.</li>
              <li>Born does not force one cookie-cutter workflow onto every desk.</li>
            </ul>
          </div>
        </div>
      </section>

      <CtaBand
        title="Need help deciding which service line fits your desk?"
        description="A recruiter systems audit is the fastest route. Born can assess whether you need a full build, a workflow upgrade, or tighter automation around an existing stack."
        primaryAction={primaryCta}
      />
    </>
  );
}
