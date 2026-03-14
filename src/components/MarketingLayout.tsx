import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import { primaryCta, siteNav } from '@/content/bornSiteContent';

function navLinkClass(isActive: boolean) {
  return isActive ? 'nav-link nav-link-active' : 'nav-link';
}

export default function MarketingLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const footerHighlights = [
    'Prospecting engine',
    'Daily call queue',
    'Follow-up handled',
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-[rgba(24,55,41,0.08)] bg-[rgba(248,244,236,0.84)] backdrop-blur-xl">
        <div className="container-shell hidden py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 lg:block">
          Built for recruiters. Founder-led. 3 clients per quarter.
        </div>
        <nav className="container-shell flex items-center justify-between gap-4 py-4 sm:py-5" aria-label="Primary">
          <Link to="/" className="flex items-center gap-3 text-slate-950" aria-label="Born home">
            <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-[radial-gradient(circle_at_30%_30%,#b4d5bb,#487a61_68%,#183126)] shadow-[0_18px_34px_rgba(20,40,32,0.18)]">
              <img src="/favicon-Photoroom.png" alt="" className="h-9 w-9 object-contain" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">Born</span>
              <span className="block text-xs uppercase tracking-[0.24em] text-slate-500">Recruitment Outbound</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-[rgba(24,55,41,0.1)] bg-white/72 px-2 py-2 shadow-[0_18px_34px_rgba(18,35,27,0.08)] lg:flex">
            {siteNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) => navLinkClass(isActive)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link to={primaryCta.to} className="cta-primary hidden sm:inline-flex">
              {primaryCta.label}
            </Link>
            <button
              type="button"
              className="inline-flex rounded-2xl border border-[rgba(24,55,41,0.12)] bg-white/92 p-3 text-slate-700 shadow-sm lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div id="mobile-navigation" className="border-t border-[rgba(24,55,41,0.08)] bg-white/96 shadow-[0_20px_40px_rgba(18,35,27,0.08)] lg:hidden">
            <div className="container-shell grid gap-2 py-4">
              {siteNav.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `${navLinkClass(isActive)} w-full justify-between rounded-2xl px-4 py-3`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to={primaryCta.to} className="cta-primary mt-2 justify-center">
                {primaryCta.label}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="border-t border-[rgba(24,55,41,0.08)] bg-[#0f2119] py-16 text-stone-100">
        <div className="container-shell grid gap-8 lg:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_0.68fr_0.68fr_0.82fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100/66">Born</p>
            <p className="mt-4 max-w-md text-2xl font-semibold tracking-tight text-white">
              Born - bespoke outbound systems for recruitment firms. Sydney, Australia.
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-stone-100/76">
              Prospecting, outreach, call workflow, and follow-up in one system built around how recruiters actually win work.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {footerHighlights.map((item) => (
                <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-stone-100/82 backdrop-blur-sm">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={primaryCta.to} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary">
                {primaryCta.label}
              </Link>
              <Link to="/process" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5">
                See How It Works
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">What to expect</p>
            <div className="mt-5 grid gap-4 text-sm text-stone-100/76">
              <p>We pull 5 researched prospects before the first call so you can see the system in your market.</p>
              <p>You work directly with Fred on every engagement. No junior handoff.</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">Explore</p>
            <ul className="mt-4 space-y-3 text-sm text-stone-100/76">
              {siteNav.slice(0, 3).map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">More</p>
            <ul className="mt-4 space-y-3 text-sm text-stone-100/76">
              {siteNav.slice(3).map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/insights" className="transition hover:text-white">
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-stone-100/76">
              <li>Founder-led outbound systems for recruitment firms</li>
              <li>
                <a href="mailto:fred@born.directory" className="transition hover:text-white">
                  fred@born.directory
                </a>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-white">
                  {primaryCta.label}
                </Link>
              </li>
              <li className="pt-3 text-xs uppercase tracking-[0.16em] text-white/45">200% ROI by month 3 or we keep working for free.</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
