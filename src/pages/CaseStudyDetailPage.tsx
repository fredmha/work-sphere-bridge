import { useParams } from 'react-router-dom';

import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { primaryCta, type CaseStudyItem } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

export default function CaseStudyDetailPage({ items }: { items: readonly CaseStudyItem[] }) {
  const { slug } = useParams();
  const item = items.find((entry) => entry.slug === slug);

  usePageMeta(item ? `${item.title} | Born` : 'Case study detail | Born', item?.summary ?? 'Explore Born case studies.');

  if (!item) return <NotFound />;

  return (
    <>
      <PageHero
        eyebrow={item.clientType}
        title={item.title}
        description={item.summary}
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Back to Case Studies', to: '/case-studies' }}
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <article className="surface-panel p-7">
            <p className="meta-kicker">The problem</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.problem}</p>

            <p className="mt-8 meta-kicker">Outcome</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.outcome}</p>

            <p className="mt-8 meta-kicker">Takeaway</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.takeaway}</p>
          </article>

          <article className="outline-panel p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">What Born built</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.build.map((entry) => (
                <li key={entry} className="rounded-[1.5rem] border border-border/80 bg-white/90 px-4 py-4">
                  {entry}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-[1.5rem] border border-primary/10 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Workflow delivered</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.workflow}</p>
            </div>
          </article>
        </div>
      </section>

      <CtaBand
        title="Need a similar build in your own recruiter pipeline?"
        description="The details change by desk, but the principle is consistent: Born designs the workflow so better opportunities get found, worked, and followed up properly."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />
    </>
  );
}
