import DirectoryFrame from '@/pages/DirectoryFrame';
import { recentLaunches } from '@/pages/directoryContent';

export default function Recent() {
  return (
    <DirectoryFrame
      title="Recently added"
      description="Recent additions give repeat visitors a fast way to discover new listings and help search engines understand that the directory is actively maintained."
    >
      <section className="space-y-4">
        {recentLaunches.map((launch) => (
          <article key={launch.name} id={launch.name.toLowerCase().replace(/\s+/g, '-')} className="card-surface p-6">
            <p className="text-sm font-medium text-teal-700">{launch.date}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">{launch.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">{launch.detail}</p>
          </article>
        ))}
      </section>
    </DirectoryFrame>
  );
}
