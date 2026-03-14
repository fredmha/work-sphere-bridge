import { useParams } from 'react-router-dom';

import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
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

      <CtaBand
        title="Want this service scoped against your current recruiter setup?"
        description="Born can review your tooling, workflow, target accounts, and follow-up logic to see whether this is the right fit and what the build should include."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Process', to: '/process' }}
      />
    </>
  );
}
