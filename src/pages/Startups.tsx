import DirectoryFrame from '@/pages/DirectoryFrame';
import { startups } from '@/pages/directoryContent';

export default function Startups() {
  return (
    <DirectoryFrame
      title="Featured startups"
      description="Explore a curated list of early-stage companies worth watching, with concise summaries that make it easy to decide where to click next."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {startups.map((startup) => (
          <article key={startup.name} id={startup.name.toLowerCase().replace(/\s+/g, '-')} className="card-surface p-6">
            <p className="text-sm font-medium text-teal-700">{startup.category}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{startup.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">{startup.blurb}</p>
          </article>
        ))}
      </section>
    </DirectoryFrame>
  );
}
