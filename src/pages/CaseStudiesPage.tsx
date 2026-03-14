import { CtaBand, LinkArrow, PageHero } from '@/components/MarketingPrimitives';
import { caseStudies, primaryCta } from '@/content/bornSiteContent';
import usePageMeta from '@/hooks/usePageMeta';

export default function CaseStudiesPage() {
  usePageMeta(
    'Case Studies | Born',
    'Read Born case studies showing how bespoke recruiter systems improved workflow clarity, follow-up reliability, and pipeline control.',
  );

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Proof built around recruiter workflow change."
        description="Born does not need fake vanity metrics. The proof comes from what got built, how the workflow changed, and what became more controlled after implementation."
        primaryAction={primaryCta}
        secondaryAction={{ label: 'Read Insights', to: '/insights' }}
      />

      <section className="site-section">
        <div className="grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article key={study.slug} className="surface-panel p-7">
              <p className="meta-kicker">{study.clientType}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{study.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-700">{study.problem}</p>
              <div className="mt-6 rounded-[1.5rem] border border-primary/10 bg-primary/5 p-4 text-sm leading-7 text-slate-700">
                <strong className="font-semibold text-slate-950">Workflow delivered:</strong> {study.workflow}
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
        description="The case studies show the pattern: practical recruiter infrastructure, clearer ownership, better follow-up, and a more reliable pipeline process."
        primaryAction={primaryCta}
      />
    </>
  );
}
