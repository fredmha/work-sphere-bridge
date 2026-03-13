import { Link } from 'react-router-dom';

export default function Help() {
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
              Help center
            </li>
          </ol>
        </nav>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Help center</h1>
          <p className="mt-3 text-slate-700">
            Find answers, request onboarding support, or contact our team if you need urgent assistance.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Support channels</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Email: support@born.example</li>
                <li>Business hours: Mon-Fri, 9am to 6pm AEST</li>
                <li>Typical first response: under 24 business hours</li>
              </ul>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Common requests</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Connect ATS/CRM integrations</li>
                <li>Update user roles and permissions</li>
                <li>Export weekly performance reports</li>
              </ul>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
