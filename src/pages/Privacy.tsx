import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="text-lg font-bold">
            Born
          </Link>
          <Link to="/" className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100">
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-slate-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-slate-900">
              Privacy policy
            </li>
          </ol>
        </nav>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Privacy policy</h1>
          <p className="mt-3 text-slate-700">
            This summary explains what data Born.directory collects, why it is collected, and how users can request updates or deletion.
          </p>
          <div className="mt-8 space-y-5">
            <article>
              <h2 className="text-lg font-semibold text-slate-900">Data we collect</h2>
              <p className="mt-1 text-sm text-slate-700">Submission details, account information, and usage analytics needed to operate and improve the directory.</p>
            </article>
            <article>
              <h2 className="text-lg font-semibold text-slate-900">How data is used</h2>
              <p className="mt-1 text-sm text-slate-700">To provide features, improve performance, secure customer accounts, and deliver support.</p>
            </article>
            <article>
              <h2 className="text-lg font-semibold text-slate-900">Your rights</h2>
              <p className="mt-1 text-sm text-slate-700">To request export, correction, or deletion, contact privacy@born.example.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
