import { FormEvent, useEffect, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { builders, categories, recentLaunches, startups } from '@/pages/directoryContent';

type SearchState = {
  query: string;
};

type SubmissionState = {
  startupName: string;
  website: string;
  founderEmail: string;
  category: string;
};

const navigationLinks = [
  { href: '#featured-startups', label: 'Featured Startups' },
  { href: '#browse-categories', label: 'Browse Categories' },
  { href: '#featured-builders', label: 'Featured Builders' },
  { href: '#recently-added', label: 'Recently Added' },
  { href: '#submit-startup', label: 'Submit Your Startup' },
] as const;

const initialSearchState: SearchState = {
  query: '',
};

const initialSubmissionState: SubmissionState = {
  startupName: '',
  website: '',
  founderEmail: '',
  category: '',
};

function isValidWebsite(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export default function Index() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchForm, setSearchForm] = useState(initialSearchState);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState<string | null>(null);
  const [submitForm, setSubmitForm] = useState(initialSubmissionState);
  const [submitErrors, setSubmitErrors] = useState<Partial<Record<keyof SubmissionState, string>>>({});
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    document.title = 'Born.directory | Discover startups, builders, and new products';
  }, []);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (searchForm.query.trim().length < 2) {
      setSearchError('Enter at least 2 characters so we can take you to a relevant results page.');
      setSearchSuccess(null);
      return;
    }

    setSearchError(null);
    setSearchSuccess(`Showing directory results for "${searchForm.query.trim()}".`);
    navigate(`/startups?query=${encodeURIComponent(searchForm.query.trim())}`);
  }

  function validateSubmission() {
    const nextErrors: Partial<Record<keyof SubmissionState, string>> = {};

    if (!submitForm.startupName.trim()) nextErrors.startupName = 'Enter the startup name.';
    if (!submitForm.website.trim()) {
      nextErrors.website = 'Enter the startup website URL.';
    } else if (!isValidWebsite(submitForm.website.trim())) {
      nextErrors.website = 'Use a full URL such as https://example.com.';
    }
    if (!submitForm.founderEmail.trim()) {
      nextErrors.founderEmail = 'Enter a founder or operator email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitForm.founderEmail.trim())) {
      nextErrors.founderEmail = 'Use a valid email address.';
    }
    if (!submitForm.category.trim()) nextErrors.category = 'Choose the best fit category.';

    return nextErrors;
  }

  function handleSubmitStartup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSubmission();
    setSubmitErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitStatus('Fix the highlighted fields before submitting your startup.');
      return;
    }

    setSubmitStatus('Submission received. Review guidelines are available on the submit page.');
    navigate('/submit');
  }

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-stone-50/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Primary">
          <Link to="/" className="flex items-center gap-3 text-slate-950" aria-label="Born.directory home">
            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-50">
              Born
            </span>
            <span className="text-sm font-medium text-slate-600">directory</span>
          </Link>

          <ul className="hidden items-center gap-6 md:flex">
            <li>
              <Link to="/startups" className="text-sm font-medium text-slate-700 hover:text-slate-950">
                Browse startups
              </Link>
            </li>
            <li>
              <Link to="/categories" className="text-sm font-medium text-slate-700 hover:text-slate-950">
                Explore categories
              </Link>
            </li>
            <li>
              <Link to="/builders" className="text-sm font-medium text-slate-700 hover:text-slate-950">
                Meet builders
              </Link>
            </li>
            <li>
              <Link to="/recent" className="text-sm font-medium text-slate-700 hover:text-slate-950">
                View recent launches
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <Link to="/submit" className="btn-primary hidden md:inline-flex">
              Submit a startup
            </Link>
            <button
              type="button"
              className="inline-flex rounded-full border border-slate-300 p-2 text-slate-700 hover:border-slate-400 hover:bg-white md:hidden"
              aria-controls="mobile-nav"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div id="mobile-nav" className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <ul className="space-y-3" aria-label="Mobile navigation">
              <li>
                <Link to="/startups" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-stone-100" onClick={() => setMobileOpen(false)}>
                  Browse startups
                </Link>
              </li>
              <li>
                <Link to="/categories" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-stone-100" onClick={() => setMobileOpen(false)}>
                  Explore categories
                </Link>
              </li>
              <li>
                <Link to="/builders" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-stone-100" onClick={() => setMobileOpen(false)}>
                  Meet builders
                </Link>
              </li>
              <li>
                <Link to="/recent" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-stone-100" onClick={() => setMobileOpen(false)}>
                  View recent launches
                </Link>
              </li>
              <li>
                <Link to="/submit" className="btn-primary flex justify-center" onClick={() => setMobileOpen(false)}>
                  Submit a startup
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.10),_transparent_28%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <p className="inline-flex rounded-full border border-teal-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800">
                Curated startup discovery
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Born.directory helps people discover startups, builders, and newly launched products worth paying attention to.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Explore featured startups, browse categories, meet the people building them, and submit your own company for review.
                The homepage is structured for fast scanning and for search engines that need clear, crawlable content.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/startups" className="btn-primary">
                  Browse featured startups
                </Link>
                <Link to="/submit" className="btn-secondary">
                  Submit your startup for review
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1">Human-reviewed listings</span>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1">Clear category pages</span>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1">Builder-first profiles</span>
              </div>
            </div>

            <aside className="card-surface p-7" aria-label="Directory search">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Search the directory</h2>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Find a startup by name, category, or problem space. Search is visible in rendered HTML so users and audit tools can detect a real interaction path.
              </p>

              <form className="mt-6 space-y-4" noValidate onSubmit={handleSearchSubmit}>
                <div>
                  <label htmlFor="directory-search" className="mb-2 block text-sm font-medium text-slate-900">
                    Search startups or categories
                  </label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="directory-search"
                      name="directory-search"
                      type="search"
                      value={searchForm.query}
                      onChange={(event) => setSearchForm({ query: event.target.value })}
                      placeholder="Search AI productivity, fintech, or a startup name"
                      className="input-base pl-11"
                      aria-describedby={searchError ? 'directory-search-error' : 'directory-search-help'}
                      aria-invalid={Boolean(searchError)}
                    />
                  </div>
                  <p id="directory-search-help" className="mt-2 text-xs text-slate-600">
                    Example searches: "developer tools", "fintech", or "Signal Garden".
                  </p>
                  {searchError && (
                    <p id="directory-search-error" className="mt-2 text-sm text-rose-700" role="alert">
                      {searchError}
                    </p>
                  )}
                  {searchSuccess && !searchError && (
                    <p className="mt-2 text-sm text-teal-800" role="status">
                      {searchSuccess}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  Search the directory
                </button>
              </form>
            </aside>
          </div>
        </section>

        <section aria-label="Homepage quick links" className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-6 py-5 lg:px-8">
            {navigationLinks.map((link) => (
              <a key={link.href} href={link.href} className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-950">
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section id="featured-startups" className="section-shell">
          <div className="section-heading">
            <h2>Featured Startups</h2>
            <p>
              Each listing below links to a dedicated startups page, giving users and crawlers a strong internal path beyond the homepage.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {startups.map((startup) => (
              <article key={startup.name} className="card-surface p-6">
                <p className="text-sm font-medium text-teal-700">{startup.category}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{startup.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{startup.blurb}</p>
                <Link to={startup.href} className="mt-5 inline-flex text-sm font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900">
                  Read the {startup.name} listing
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="browse-categories" className="section-shell border-t border-slate-200 bg-white">
          <div className="section-heading">
            <h2>Browse Categories</h2>
            <p>
              Category links help first-time visitors orient themselves quickly and create crawlable topical clusters for SEO.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <article key={category.id} className="card-surface p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{category.count}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{category.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{category.description}</p>
                <Link to={category.href} className="mt-4 inline-flex text-sm font-semibold text-teal-800 hover:text-teal-900">
                  Explore {category.name}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="featured-builders" className="section-shell">
          <div className="section-heading">
            <h2>Featured Builders</h2>
            <p>
              Founder context builds trust. These profiles make the directory feel curated instead of anonymous or placeholder-driven.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {builders.map((builder) => (
              <article key={builder.name} className="card-surface p-6">
                <h3 className="text-xl font-semibold text-slate-950">{builder.name}</h3>
                <p className="mt-1 text-sm font-medium text-teal-700">{builder.role}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{builder.summary}</p>
                <Link to={builder.href} className="mt-4 inline-flex text-sm font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900">
                  View {builder.name}&apos;s builder profile
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="recently-added" className="section-shell border-t border-slate-200 bg-white">
          <div className="section-heading">
            <h2>Recently Added</h2>
            <p>
              Fresh additions give repeat visitors something new to explore and signal that the directory is actively maintained.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recentLaunches.map((launch) => (
              <article key={launch.name} className="card-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{launch.date}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{launch.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{launch.detail}</p>
                <Link to={launch.href} className="mt-4 inline-flex text-sm font-semibold text-teal-800 hover:text-teal-900">
                  See why {launch.name} was recently added
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="submit-startup" className="section-shell">
          <div className="section-heading">
            <h2>Submit Your Startup</h2>
            <p>
              A visible submission path fixes the previous dead-end experience and gives founders a clear next step with validation before submission.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="card-surface p-6">
              <h3 className="text-xl font-semibold text-slate-950">What we look for</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li>Clear product positioning in plain English</li>
                <li>A working public website with a real product or launch page</li>
                <li>A category that matches the existing taxonomy</li>
                <li>A founder or operator contact who can verify the listing</li>
              </ul>
              <Link to="/submit" className="mt-6 inline-flex text-sm font-semibold text-teal-800 hover:text-teal-900">
                Read the submission guidelines
              </Link>
            </div>

            <form className="card-surface p-6" noValidate onSubmit={handleSubmitStartup}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="startup-name" className="mb-2 block text-sm font-medium text-slate-900">
                    Startup name
                  </label>
                  <input
                    id="startup-name"
                    name="startup-name"
                    type="text"
                    value={submitForm.startupName}
                    onChange={(event) => setSubmitForm((prev) => ({ ...prev, startupName: event.target.value }))}
                    className="input-base"
                    placeholder="Example: Northstar QA"
                    aria-invalid={Boolean(submitErrors.startupName)}
                    aria-describedby={submitErrors.startupName ? 'startup-name-error' : undefined}
                  />
                  {submitErrors.startupName && (
                    <p id="startup-name-error" className="mt-2 text-sm text-rose-700">
                      {submitErrors.startupName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="startup-category" className="mb-2 block text-sm font-medium text-slate-900">
                    Category
                  </label>
                  <select
                    id="startup-category"
                    name="startup-category"
                    value={submitForm.category}
                    onChange={(event) => setSubmitForm((prev) => ({ ...prev, category: event.target.value }))}
                    className="input-base"
                    aria-invalid={Boolean(submitErrors.category)}
                    aria-describedby={submitErrors.category ? 'startup-category-error' : undefined}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {submitErrors.category && (
                    <p id="startup-category-error" className="mt-2 text-sm text-rose-700">
                      {submitErrors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="startup-website" className="mb-2 block text-sm font-medium text-slate-900">
                    Website URL
                  </label>
                  <input
                    id="startup-website"
                    name="startup-website"
                    type="url"
                    value={submitForm.website}
                    onChange={(event) => setSubmitForm((prev) => ({ ...prev, website: event.target.value }))}
                    className="input-base"
                    placeholder="https://yourstartup.com"
                    aria-invalid={Boolean(submitErrors.website)}
                    aria-describedby={submitErrors.website ? 'startup-website-error' : undefined}
                  />
                  {submitErrors.website && (
                    <p id="startup-website-error" className="mt-2 text-sm text-rose-700">
                      {submitErrors.website}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="founder-email" className="mb-2 block text-sm font-medium text-slate-900">
                    Founder or operator email
                  </label>
                  <input
                    id="founder-email"
                    name="founder-email"
                    type="email"
                    value={submitForm.founderEmail}
                    onChange={(event) => setSubmitForm((prev) => ({ ...prev, founderEmail: event.target.value }))}
                    className="input-base"
                    placeholder="founder@startup.com"
                    aria-invalid={Boolean(submitErrors.founderEmail)}
                    aria-describedby={submitErrors.founderEmail ? 'founder-email-error' : undefined}
                  />
                  {submitErrors.founderEmail && (
                    <p id="founder-email-error" className="mt-2 text-sm text-rose-700">
                      {submitErrors.founderEmail}
                    </p>
                  )}
                </div>
              </div>

              {submitStatus && (
                <p className="mt-4 rounded-2xl border border-slate-200 bg-stone-100 px-4 py-3 text-sm text-slate-700" role="status">
                  {submitStatus}
                </p>
              )}

              <button type="submit" className="btn-primary mt-6">
                Submit startup for review
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 py-14 text-stone-200">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <p className="text-lg font-semibold text-white">Born.directory</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              A curated startup directory with clear category pages, founder context, and real internal navigation that works for people and crawlers.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/startups" className="text-slate-300 hover:text-white">
                  Browse featured startups
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-slate-300 hover:text-white">
                  Browse startup categories
                </Link>
              </li>
              <li>
                <Link to="/builders" className="text-slate-300 hover:text-white">
                  Explore builder profiles
                </Link>
              </li>
              <li>
                <Link to="/recent" className="text-slate-300 hover:text-white">
                  View recently added startups
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Support</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-slate-300 hover:text-white">
                  Help and FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@born.example" className="text-slate-300 hover:text-white">
                  Contact support
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-white">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-300 hover:text-white">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
