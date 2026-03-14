import { useParams } from 'react-router-dom';

import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
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

      <section className="site-section border-t border-border/80">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              title: 'See the service layer',
              body: 'The case study shows the outcome. The service pages show which parts of the system get built.',
              to: '/services',
              label: 'See services',
            },
            {
              title: 'See the rollout',
              body: 'If you want the step-by-step path from the first call to launch, the process page covers it.',
              to: '/process',
              label: 'See process',
            },
            {
              title: 'See similar use cases',
              body: 'Compare how the workflow changes across different recruiter teams and agency models.',
              to: '/industries',
              label: 'See who it fits',
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
        title="Need a similar build in your own outbound workflow?"
        description="The details change by team, but the principle stays the same: 5 researched prospects to prove the direction, then the wider system build around it."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'See Services', to: '/services' }}
      />
    </>
  );
}
