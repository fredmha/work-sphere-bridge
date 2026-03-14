import { useParams } from 'react-router-dom';

import { CtaBand, PageHero } from '@/components/MarketingPrimitives';
import { caseStudies, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';
import NotFound from '@/pages/NotFound';

export default function CaseStudyDetailPage() {
  const { slug } = useParams();
  const item = caseStudies.find((entry) => entry.slug === slug);

  usePageMeta(
    item
      ? {
          title: `${item.title} | Born`,
          description: item.summary,
          path: `/case-studies/${item.slug}`,
          type: 'article',
        }
      : { title: 'Case study detail | Born', description: 'Explore Born case studies.', path: '/case-studies' },
  );

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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
          <article className="surface-panel p-7">
            <p className="meta-kicker">The problem</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.problem}</p>

            <p className="mt-8 meta-kicker">System built</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.systemBuild}</p>

            <p className="mt-8 meta-kicker">Business effect</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.businessEffect}</p>

            <p className="mt-8 meta-kicker">Outcome</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.outcome}</p>

            <p className="mt-8 meta-kicker">Takeaway</p>
            <p className="mt-4 text-base leading-7 text-slate-700">{item.takeaway}</p>
          </article>

          <article className="outline-panel p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">What Born built</p>
            <ul className="mt-5 grid gap-4 text-sm leading-7 text-slate-700">
              {item.build.map((entry) => (
                <li key={entry} className="list-card">
                  {entry}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">What changed operationally</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {item.whatChanged.map((entry) => (
                  <span key={entry} className="proof-chip">
                    {entry}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 accent-panel">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Workflow delivered</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.workflow}</p>
            </div>
          </article>
        </div>
      </section>

      <CtaBand
        title="Need a similar build in your own recruiter pipeline?"
        description="The details change by desk, but the principle stays the same: Born designs the workflow so better opportunities get found, worked, and followed up properly."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />
    </>
  );
}
