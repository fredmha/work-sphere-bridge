import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="site-section flex min-h-[70vh] items-center justify-center text-slate-900">
      <main className="surface-panel w-full max-w-2xl p-8 text-center sm:p-10">
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
        <p className="eyebrow">Not found</p>
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-700">
          The page you requested does not exist or may have moved. Use the actions below to get back to the main site.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="cta-primary">
            Go to homepage
          </Link>
          <a href="mailto:hello@born.systems" className="cta-secondary">
            Contact Born
          </a>
        </div>
      </main>
    </div>
  );
}
