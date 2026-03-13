import DirectoryFrame from '@/pages/DirectoryFrame';
import { categories } from '@/pages/directoryContent';

export default function Categories() {
  return (
    <DirectoryFrame
      title="Browse categories"
      description="Scan the directory by market so users and crawlers can quickly understand the main topic clusters inside Born."
    >
      <section className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <article key={category.id} id={category.id} className="card-surface p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950">{category.name}</h2>
              <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
                {category.count}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">{category.description}</p>
          </article>
        ))}
      </section>
    </DirectoryFrame>
  );
}
