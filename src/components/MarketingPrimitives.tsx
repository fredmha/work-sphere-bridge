import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
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
    <section className="site-section relative overflow-hidden pt-10">
      <div className="editorial-grid absolute inset-x-0 top-0 -z-10 h-[72%] rounded-[2.5rem] opacity-40" />
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="surface-panel p-8 sm:p-10">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-[4rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">{description}</p>
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
        </div>
        {aside && <div className="lg:pl-4">{aside}</div>}
      </div>
    </section>
  );
}

export function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="section-copy">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{description}</p>
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
      <div className="rounded-[2rem] border border-primary/10 bg-[linear-gradient(135deg,rgba(248,245,238,0.98),rgba(228,236,231,0.94))] p-8 shadow-[0_24px_60px_rgba(33,67,53,0.08)] sm:p-10">
        <p className="eyebrow">Next step</p>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{description}</p>
          </div>
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
    </section>
  );
}
