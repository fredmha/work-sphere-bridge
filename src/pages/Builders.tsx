import DirectoryFrame from '@/pages/DirectoryFrame';
import { builders } from '@/pages/directoryContent';

export default function Builders() {
  return (
    <DirectoryFrame
      title="Featured builders"
      description="Profiles of founders and operators behind the products listed on Born, written for quick scanning and strong internal linking."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {builders.map((builder) => (
          <article key={builder.name} id={builder.name.toLowerCase().replace(/\s+/g, '-')} className="card-surface p-6">
            <h2 className="text-xl font-semibold text-slate-950">{builder.name}</h2>
            <p className="mt-1 text-sm font-medium text-teal-700">{builder.role}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{builder.summary}</p>
          </article>
        ))}
      </section>
    </DirectoryFrame>
  );
}
