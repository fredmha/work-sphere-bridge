import { Home, LifeBuoy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
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
              Dashboard
            </li>
          </ol>
        </nav>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Demo request received</h1>
          <p className="mt-3 text-slate-700">
            Your request is in our queue. A solutions consultant will email you with available time slots and a pre-demo checklist.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">What happens next</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>Scheduling email delivered within one business day</li>
                <li>Shared agenda focused on your market and team goals</li>
                <li>Live walkthrough with Q&A and rollout plan</li>
              </ul>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Need help now?</h2>
              <p className="mt-3 text-sm text-slate-700">
                Contact support if you need to update your request details or change your preferred timeline.
              </p>
              <a href="mailto:support@born.example" className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                support@born.example
              </a>
              <Link to="/help" className="mt-2 block text-sm font-semibold text-slate-800 hover:text-slate-900">
                Open help center
              </Link>
            </article>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              <Home className="h-4 w-4" />
              Return to homepage
            </Link>
            <a
              href="mailto:support@born.example"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              <LifeBuoy className="h-4 w-4" />
              Contact support
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
