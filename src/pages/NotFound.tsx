import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-slate-900">
      <main className="w-full max-w-xl rounded-[2rem] border border-border bg-white/90 p-8 text-center shadow-sm">
        <nav aria-label="Breadcrumb" className="mb-6 text-left text-sm text-slate-600">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-slate-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-slate-900">
              Page not found
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-slate-700">
          The page you requested does not exist or may have moved. Use the actions below to continue.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17392d]">
            Go to homepage
          </Link>
          <a
            href="mailto:hello@born.systems"
            className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-secondary"
          >
            Contact Born
          </a>
        </div>
      </main>
    </div>
  );
}
