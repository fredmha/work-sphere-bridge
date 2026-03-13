import { Link } from 'react-router-dom';

export default function Terms() {
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
              Terms of service
            </li>
          </ol>
        </nav>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Terms of service</h1>
          <p className="mt-3 text-slate-700">
            These terms outline account responsibilities, acceptable use, service availability, and billing expectations.
          </p>
          <div className="mt-8 space-y-5">
            <article>
              <h2 className="text-lg font-semibold text-slate-900">Account responsibilities</h2>
              <p className="mt-1 text-sm text-slate-700">Customers are responsible for user access controls and protecting account credentials.</p>
            </article>
            <article>
              <h2 className="text-lg font-semibold text-slate-900">Acceptable use</h2>
              <p className="mt-1 text-sm text-slate-700">The platform must not be used for unlawful outreach, abuse, or data misuse.</p>
            </article>
            <article>
              <h2 className="text-lg font-semibold text-slate-900">Support and uptime</h2>
              <p className="mt-1 text-sm text-slate-700">Support response targets and maintenance windows are communicated through the help center.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
