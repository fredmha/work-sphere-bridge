import RoiCalculator from '@/components/roi/RoiCalculator';
import usePageMeta from '@/hooks/usePageMeta';

export default function RoiPage() {
  usePageMeta({
    title: 'ROI Calculator | Born',
    description:
      'Model the potential fee revenue from a more consistent recruiter cold-calling operation with live funnel assumptions.',
    path: '/roi',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Born ROI Calculator',
      url: 'https://born.directory/roi',
      description:
        'A live cold-calling ROI calculator for recruitment teams, showing dials, connects, meetings, placements, and potential fee revenue.',
    },
  });

  return (
    <>
      <section className="site-section pt-8 sm:pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">ROI Calculator</p>
          <h1 className="mt-4 text-[clamp(2.6rem,6vw,4.1rem)] font-semibold leading-[0.94] tracking-tight text-slate-950">
            Keep the commercial case simple.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
            See the potential return from your cold calling investment in AUD.
          </p>
        </div>

        <div className="mt-8 lg:mt-10">
          <RoiCalculator />
        </div>

        <p className="mx-auto mt-5 max-w-4xl text-center text-sm leading-6 text-slate-600">
          This model is directional. It is based on your entered assumptions and is intended to quantify potential
          upside, not guarantee outcomes.
        </p>
      </section>
    </>
  );
}
