import DirectoryFrame from '@/pages/DirectoryFrame';

export default function Submit() {
  return (
    <DirectoryFrame
      title="Submit your startup"
      description="Use this page to understand listing criteria, turnaround times, and the information Born needs before a startup is added to the directory."
    >
      <section className="grid gap-4 md:grid-cols-2">
        <article className="card-surface p-6">
          <h2 className="text-xl font-semibold text-slate-950">Submission checklist</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li>Live product website</li>
            <li>Clear value proposition in one sentence</li>
            <li>Named founder or builder profile</li>
            <li>Category that fits the directory taxonomy</li>
          </ul>
        </article>
        <article className="card-surface p-6">
          <h2 className="text-xl font-semibold text-slate-950">Review timeline</h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Most submissions are reviewed within five business days. If approved, the listing is added to the directory and included in the recently added section.
          </p>
        </article>
      </section>
    </DirectoryFrame>
  );
}
