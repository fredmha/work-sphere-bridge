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
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-border/70 bg-[rgba(247,243,234,0.88)] backdrop-blur-xl">
        <nav className="container-shell flex items-center justify-between py-5" aria-label="Primary">
          <Link to="/" className="flex items-center gap-3 text-slate-950" aria-label="Born home">
            <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-[radial-gradient(circle_at_30%_30%,#b4d5bb,#487a61_68%,#183126)] shadow-[0_16px_30px_rgba(20,40,32,0.18)]">
              <img src="/favicon-Photoroom.png" alt="" className="h-9 w-9 object-contain" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-tight">Born</span>
              <span className="block text-xs uppercase tracking-[0.24em] text-slate-500">Recruiter Systems</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
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

          <div className="flex items-center gap-3">
            <Link to={primaryCta.to} className="cta-primary hidden sm:inline-flex">
              {primaryCta.label}
            </Link>
            <button
              type="button"
              className="inline-flex rounded-2xl border border-border bg-white/90 p-3 text-slate-700 shadow-sm lg:hidden"
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
          <div id="mobile-navigation" className="border-t border-border bg-white/95 lg:hidden">
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

      <footer className="border-t border-border bg-[#14261f] py-16 text-stone-100">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <p className="text-lg font-semibold text-white">Born</p>
            <p className="mt-4 max-w-md text-sm leading-6 text-stone-100/76">
              Born designs bespoke recruiter software, outbound workflows, and follow-up systems for recruitment agencies that want more control over pipeline creation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={primaryCta.to} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary">
                {primaryCta.label}
              </Link>
              <Link to="/case-studies" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5">
                View Case Studies
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">Explore</p>
            <ul className="mt-4 space-y-3 text-sm text-stone-100/76">
              {siteNav.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">Resources</p>
            <ul className="mt-4 space-y-3 text-sm text-stone-100/76">
              {siteNav.slice(4).map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-stone-100/76">
              <li>Sydney-based custom recruiter systems studio</li>
              <li>
                <a href="mailto:hello@born.systems" className="transition hover:text-white">
                  hello@born.systems
                </a>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-white">
                  Systems audit enquiries
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
