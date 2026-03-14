import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { caseStudies, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function CaseStudiesPage() {
  usePageMeta({
    title: 'Case Studies | Born',
    description:
      'Read Born case studies showing how bespoke recruiter systems improved workflow clarity, follow-up reliability, and pipeline control.',
    path: '/case-studies',
    type: 'article',
  });

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Proof built around workflow change, not vanity metrics."
        description="Each case study answers four questions: what was broken, what got built, what changed operationally, and why the desk became easier to run."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Read Insights', to: '/insights' }}
      />

      <section className="site-section">
        <div className="feature-grid">
          {caseStudies.map((study) => (
            <article key={study.slug} className="surface-panel p-7">
              <p className="meta-kicker">{study.clientType}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{study.title}</h2>
              <div className="mt-5 grid gap-4">
                <div className="info-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Operational problem</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{study.problem}</p>
                </div>
                <div className="info-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">System built</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{study.systemBuild}</p>
                </div>
                <div className="accent-panel">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Business effect</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{study.businessEffect}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {study.whatChanged.map((item) => (
                  <span key={item} className="proof-chip">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <LinkArrow to={`/case-studies/${study.slug}`}>Open case study</LinkArrow>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Want to see what Born would actually build for your desk?"
        description="The case studies show the pattern: practical recruiter infrastructure, clearer ownership, better follow-up, and a more reliable daily process."
        primaryAction={primaryCta}
      />
    </>
  );
}
