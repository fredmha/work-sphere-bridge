import { useParams } from 'react-router-dom';

import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { primaryCta, services } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const item = services.find((entry) => entry.slug === slug);

  usePageMeta(
    item
      ? {
          title: `${item.title} | Born`,
          description: item.summary,
          path: `/services/${item.slug}`,
        }
      : { title: 'Service detail | Born', description: 'Explore Born services.', path: '/services' },
  );

  if (!item) return <NotFound />;

  return (
    <>
      <PageHero
        eyebrow="Service detail"
        title={item.title}
        description={item.summary}
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Back to Services', to: '/services' }}
        aside={
          <div className="surface-panel p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Best fit</p>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.buyerFit}</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">System build</p>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.systemBuild}</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Business effect</p>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.businessEffect}</p>
          </div>
        }
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="surface-panel p-7">
            <p className="meta-kicker">What gets built</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.includes.map((entry) => (
                <li key={entry} className="list-card">
                  {entry}
                </li>
              ))}
            </ul>
          </article>

          <article className="outline-panel p-7">
            <p className="meta-kicker">What changes after launch</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.businessEffect}</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.outcomes.map((entry) => (
                <li key={entry} className="accent-panel">
                  {entry}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="site-section border-t border-border/80">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              title: 'How the build runs',
              body: 'See how Born moves from the first 5 researched prospects into the full system build.',
              to: '/process',
              label: 'View process',
            },
            {
              title: 'Who this fits',
              body: 'See which recruiter teams and agency models this kind of build works best for.',
              to: '/industries',
              label: 'View use cases',
            },
            {
              title: 'See the thinking',
              body: 'Read the articles behind the workflow design, targeting, and follow-up choices.',
              to: '/insights',
              label: 'Read insights',
            },
          ].map((item) => (
            <article key={item.title} className="outline-panel p-7">
              <p className="meta-kicker">Continue exploring</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{item.body}</p>
              <div className="mt-5">
                <LinkArrow to={item.to}>{item.label}</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Want this scoped against your current outbound setup?"
        description="Born uses the 5 researched prospects as the proof point, then scopes the full build around your targeting, outreach, calls, and follow-up."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Process', to: '/process' }}
      />
    </>
  );
}
