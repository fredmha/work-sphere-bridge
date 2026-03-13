import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type DirectoryFrameProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function DirectoryFrame({ title, description, children }: DirectoryFrameProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-slate-900">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-50">
              Born
            </span>
            <span className="text-sm font-medium text-slate-600">Directory</span>
          </Link>
          <nav aria-label="Secondary" className="flex items-center gap-4 text-sm">
            <Link to="/startups" className="text-slate-700 hover:text-slate-900">
              Startups
            </Link>
            <Link to="/categories" className="text-slate-700 hover:text-slate-900">
              Categories
            </Link>
            <Link to="/builders" className="text-slate-700 hover:text-slate-900">
              Builders
            </Link>
            <Link to="/submit" className="rounded-full bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800">
              Submit
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
          <ol className="flex items-center gap-2">
            <li>
              <Link to="/" className="hover:text-slate-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-slate-900">
              {title}
            </li>
          </ol>
        </nav>

        <section className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">{description}</p>
        </section>

        {children}
      </main>
    </div>
  );
}
