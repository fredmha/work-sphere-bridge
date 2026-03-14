import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
  highlights?: readonly string[];
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
  highlights,
  aside,
}: PageHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const reveal = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
        delayChildren: prefersReducedMotion ? 0 : 0.03,
      },
    },
  };

  return (
    <section className="site-section relative overflow-hidden pt-12">
      <div className="hero-noise absolute inset-0 -z-20 opacity-70" />
      <div className="hero-orb absolute left-[-10rem] top-[-6rem] -z-10 h-72 w-72" />
      <div className="hero-orb hero-orb-secondary absolute bottom-[-8rem] right-[-6rem] -z-10 h-80 w-80" />
      <div className="editorial-grid absolute inset-x-0 top-0 -z-10 h-[82%] rounded-[2.9rem] opacity-35" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(19rem,0.98fr)] lg:items-center lg:gap-8">
        <motion.div
          className="section-frame relative z-10 p-8 sm:p-10 lg:p-12"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={reveal} className="eyebrow">
            {eyebrow}
          </motion.p>
          <motion.h1
            variants={reveal}
            className="mt-6 max-w-4xl text-[clamp(3rem,8vw,4.55rem)] font-semibold leading-[0.95] tracking-tight text-slate-950"
          >
            {title}
          </motion.h1>
          <motion.p variants={reveal} className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
            {description}
          </motion.p>
          {(primaryAction || secondaryAction) && (
            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
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
            </motion.div>
          )}
          {highlights && highlights.length > 0 && (
            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span key={item} className="proof-chip">
                  {item}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
        {aside && (
          <motion.div
            className="relative lg:pl-2"
            variants={reveal}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-full bg-primary/10 blur-3xl lg:block" />
            {aside}
          </motion.div>
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
      <div className="cta-band relative overflow-hidden rounded-[2.25rem] border border-[rgba(24,55,41,0.1)] p-8 sm:p-10 lg:p-12">
        <div className="absolute inset-y-0 right-0 hidden w-[28rem] bg-[radial-gradient(circle_at_center,rgba(164,197,172,0.42),transparent_66%)] lg:block" />
        <div className="absolute left-8 top-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(24,55,41,0.12)] bg-white/68 text-primary shadow-[0_18px_38px_rgba(18,35,27,0.08)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-700">{description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-[rgba(24,55,41,0.1)] bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                5 researched prospects
              </span>
              <span className="rounded-full border border-[rgba(24,55,41,0.1)] bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Book the call after you review them
              </span>
              <span className="rounded-full border border-[rgba(24,55,41,0.1)] bg-white/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                200% ROI guarantee
              </span>
            </div>
          </div>
          <div className="grid gap-4 rounded-[1.8rem] border border-[rgba(24,55,41,0.08)] bg-[rgba(255,255,255,0.74)] p-5 shadow-[0_18px_36px_rgba(18,35,27,0.06)] backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Try it first</p>
            <p className="text-sm leading-7 text-slate-700">
              Get the 5 researched prospects, review the quality, then book the call if you want the wider outbound build mapped out.
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
