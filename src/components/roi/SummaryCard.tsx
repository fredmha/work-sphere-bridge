import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function SummaryCard({ title, children, className = '' }: SummaryCardProps) {
  return (
    <section className={`outline-panel p-5 ${className}`.trim()}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
