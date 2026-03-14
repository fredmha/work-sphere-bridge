import { useParams } from 'react-router-dom';

import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import type { ServiceItem } from '@/content/bornSiteContent';
import { primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

export default function ServiceDetailPage({ items }: { items: readonly ServiceItem[] }) {
  const { slug } = useParams();
  const item = items.find((entry) => entry.slug === slug);

  if (!item) return <NotFound />;

  usePageMeta(`${item.title} | Born`, item.summary);

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
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Who it is for</p>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.audience}</p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Problem it solves</p>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.problem}</p>
          </div>
        }
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="surface-panel p-7">
            <p className="meta-kicker">Included in the work</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.includes.map((entry) => (
                <li key={entry} className="rounded-[1.5rem] border border-border/80 bg-white/80 px-4 py-4">
                  {entry}
                </li>
              ))}
            </ul>
          </article>

          <article className="outline-panel p-7">
            <p className="meta-kicker">What it drives</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.outcomes.map((entry) => (
                <li key={entry} className="rounded-[1.5rem] bg-secondary/75 px-4 py-4">
                  {entry}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <CtaBand
        title="Want this service scoped against your current recruiter setup?"
        description="Born can review your tooling, workflow, target accounts, and follow-up logic to work out whether this is the right fit and what the build should include."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Process', to: '/process' }}
      />
    </>
  );
}
