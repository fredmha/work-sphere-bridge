import { useEffect } from 'react';

import usePageMeta from '@/hooks/usePageMeta';

export default function BlogCommandPage() {
  usePageMeta({
    title: 'Blog Command | Born',
    description: 'Decap CMS entry point for blog publishing.',
    path: '/blogcommand',
    noIndex: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const nextUrl = `/blogcommand/index.html${window.location.search}${window.location.hash}`;
    window.location.replace(nextUrl);
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f4ec_0%,#f4f7f3_100%)] text-slate-950">
      <div className="container-shell flex min-h-screen items-center justify-center py-16">
        <div className="surface-panel max-w-xl p-8 text-center">
          <p className="eyebrow">Blog Command</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Opening Decap CMS</h1>
          <p className="mt-4 text-base leading-8 text-slate-700">
            If the redirect does not happen automatically, open
            {' '}
            <a href="/blogcommand/index.html" className="font-semibold text-primary underline underline-offset-4">
              /blogcommand/index.html
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
