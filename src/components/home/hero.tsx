'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Image from 'next/image';

export function Hero() {
  const t = useTranslations('home');
  const [copied, setCopied] = useState(false);

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText('npx issuesync');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className="relative border-b border-line pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Status Bar / Workspace Badge */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 font-mono text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-muted">{t('status')}</span>
          </div>

          <span className="hidden font-mono text-xs text-muted/60 sm:inline">•</span>

          <div className="hidden items-center gap-1.5 font-mono text-xs text-muted sm:inline-flex">
            <svg
              className="h-3.5 w-3.5 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{t('location')}</span>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-4xl leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {t('titlePrefix')}{' '}
              <span className="text-accent italic underline decoration-accent/30 decoration-2 underline-offset-4">
                {t('titleAccent')}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-muted sm:text-xl">
              {t('subtitle')}
            </p>

            {/* CTAs & Terminal Badge */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-sm bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition-all hover:scale-[1.02] hover:bg-ink/80 active:scale-[0.98]"
              >
                {t('ctaContact')}
                <svg
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center justify-center rounded-sm border border-line bg-transparent px-5 py-2.5 font-sans text-sm font-medium text-ink transition-all hover:border-accent hover:bg-accent/5"
              >
                {t('ctaWork')}
              </Link>

              {/* Interactive CLI badge (Workspace touch) */}
              <button
                type="button"
                onClick={copyCommand}
                title="Copier la commande CLI"
                className="inline-flex items-center gap-2 rounded-sm border border-line bg-paper/60 px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-ink/40"
              >
                <span className="text-accent select-none">$</span>
                <span className="text-ink">npx issuesync</span>
                <span className="text-xs text-muted/60">
                  {copied ? `[${t('viewProject') ? 'Copié !' : 'Copied!'}]` : '[Copier]'}
                </span>
              </button>
            </div>
          </div>

          {/* Profile Card / Photo */}
          <div className="flex lg:col-span-4 lg:justify-end">
            <div className="group relative">
              <div className="relative h-44 w-44 overflow-hidden rounded-sm border border-line bg-muted/10 shadow-sm transition-transform duration-300 group-hover:scale-[1.02] sm:h-52 sm:w-52">
                <Image
                  src="/about-me-one.png"
                  alt="Florentin Tchangai Kybaloo"
                  fill
                  className="object-cover contrast-[1.05] grayscale transition-all duration-500 group-hover:grayscale-0"
                  sizes="(max-width: 768px) 176px, 208px"
                  priority
                />
              </div>
              <div className="mt-2 text-right">
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                  Florentin Tchangai • Architecte
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
