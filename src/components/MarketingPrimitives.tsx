import { ReactNode } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroAction {
  label: string;
  to: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  aside?: ReactNode;
}

interface SectionIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

interface CtaBandProps {
  title: string;
  description: string;
  primaryAction: HeroAction;
  secondaryAction?: HeroAction;
}

export function PageHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  aside,
}: PageHeroProps) {
  return (
    <section className="site-section relative overflow-hidden pt-12">
      <div className="hero-noise absolute inset-0 -z-20 opacity-70" />
      <div className="hero-orb absolute left-[-10rem] top-[-6rem] -z-10 h-72 w-72" />
      <div className="hero-orb hero-orb-secondary absolute bottom-[-8rem] right-[-6rem] -z-10 h-80 w-80" />
      <div className="editorial-grid absolute inset-x-0 top-0 -z-10 h-[82%] rounded-[2.9rem] opacity-35" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(19rem,0.98fr)] lg:items-center lg:gap-8">
        <div className="section-frame relative z-10 p-8 sm:p-10 lg:p-12">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-[clamp(3rem,8vw,4.55rem)] font-semibold leading-[0.95] tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">{description}</p>
          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryAction && (
                <Link to={primaryAction.to} className="cta-primary">
                  {primaryAction.label}
                </Link>
              )}
              {secondaryAction && (
                <Link to={secondaryAction.to} className="cta-secondary">
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="metric-tile">
              <p className="meta-kicker">01</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Audit the workflow before adding complexity.</p>
            </div>
            <div className="metric-tile">
              <p className="meta-kicker">02</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Build around recruiter behavior, not generic templates.</p>
            </div>
            <div className="metric-tile">
              <p className="meta-kicker">03</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Keep ownership, queues, and follow-up visible.</p>
            </div>
          </div>
        </div>
        {aside && (
          <div className="relative lg:pl-2">
            <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-full bg-primary/10 blur-3xl lg:block" />
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="section-copy">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{description}</p>
    </div>
  );
}

export function LinkArrow({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3">
      <span>{children}</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function CtaBand({ title, description, primaryAction, secondaryAction }: CtaBandProps) {
  return (
    <section className="site-section">
      <div className="cta-band relative overflow-hidden rounded-[2.25rem] border border-primary/15 p-8 sm:p-10 lg:p-12">
        <div className="absolute inset-y-0 right-0 hidden w-[28rem] bg-[radial-gradient(circle_at_center,rgba(166,208,176,0.3),transparent_66%)] lg:block" />
        <div className="absolute left-8 top-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white/90">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="eyebrow border-white/15 bg-white/8 text-white shadow-none">Next step</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
            <p className="mt-3 text-base leading-7 text-stone-100/78">{description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-100/78">
                Audit
              </span>
              <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-100/78">
                Build
              </span>
              <span className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-100/78">
                Refine
              </span>
            </div>
          </div>
          <div className="grid gap-4 rounded-[1.8rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-100/70">Engagement path</p>
            <p className="text-sm leading-7 text-stone-100/76">
              Start with the workflow pressure point, map the operating gap, then scope the cleanest build path.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={primaryAction.to} className="cta-primary">
                {primaryAction.label}
              </Link>
              {secondaryAction && (
                <Link to={secondaryAction.to} className="cta-secondary">
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
