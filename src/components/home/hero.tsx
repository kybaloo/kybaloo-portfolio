'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Image from 'next/image';
import {SITE} from '@/lib/site';

export function Hero() {
  const t = useTranslations('home');
  const locale = useLocale();
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
    <section className="relative border-b border-line pt-12 pb-14 md:pt-20 md:pb-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Status Bar / Workspace Availability Badge */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/90 px-3.5 py-1.5 font-mono text-xs shadow-2xs backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-medium text-ink">{t('status')}</span>
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
            <span>
              {t('location')} <span className="text-muted/60">(GMT+0)</span>
            </span>
          </div>
        </div>

        {/* Main Content Grid: Title & CTAs on Left, Circular Avatar on Right */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h1 className="font-sans text-4xl leading-[1.12] font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {t('titlePrefix')}{' '}
              <span className="text-accent underline decoration-accent/30 decoration-2 underline-offset-8">
                {t('titleAccent')}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted sm:text-lg">
              {t('subtitle')}
            </p>

            {/* Tactile Pill Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-sans text-sm font-semibold text-paper shadow-sm transition-all hover:scale-[1.02] hover:bg-ink/90 active:scale-[0.98]"
              >
                <span>{t('ctaWork')}</span>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-paper/80 px-6 py-3 font-sans text-sm font-medium text-ink shadow-2xs transition-all hover:scale-[1.02] hover:border-ink/40 hover:bg-paper active:scale-[0.98]"
              >
                <span>{t('ctaContact')}</span>
                <svg
                  className="h-3.5 w-3.5 opacity-70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </Link>

              {/* Interactive CLI Badge (Pill Shape) */}
              <button
                type="button"
                onClick={copyCommand}
                title="Copier la commande npx issuesync"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-4 py-2.5 font-mono text-xs text-muted shadow-2xs transition-colors hover:border-ink/40 hover:text-ink active:scale-95"
              >
                <span className="font-semibold text-accent select-none">$</span>
                <span className="text-ink">npx issuesync</span>
                <span className="text-[11px] text-muted/70">
                  {copied
                    ? locale === 'fr'
                      ? '✓ Copié !'
                      : '✓ Copied!'
                    : locale === 'fr'
                      ? 'Copier'
                      : 'Copy'}
                </span>
              </button>
            </div>
          </div>

          {/* Prominent Circular Avatar with Graphic Backdrop */}
          <div className="flex flex-col items-center lg:col-span-5 lg:items-end">
            <div className="group relative">
              {/* Outer Circular Frame */}
              <div className="relative h-56 w-56 rounded-full border-2 border-line/80 bg-paper/90 p-2 shadow-xl backdrop-blur-xs transition-transform duration-300 group-hover:scale-[1.02] sm:h-64 sm:w-64">
                <div className="relative h-full w-full overflow-hidden rounded-full border border-line/60 bg-muted/10">
                  <Image
                    src="/about-me-one.png"
                    alt="Florentin Tchangai"
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 224px, 256px"
                    priority
                  />
                </div>
              </div>

              {/* Pinned Bottom Status Tag */}
              <div className="absolute -bottom-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-paper/95 px-3 py-1 font-mono text-[11px] whitespace-nowrap text-muted shadow-md backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="font-medium text-ink">{t('location')}</span>
                <span className="text-muted/60">(GMT+0)</span>
              </div>
            </div>

            <div className="mt-6 text-center lg:text-right">
              <p className="font-mono text-xs tracking-wider text-muted uppercase">
                Florentin Tchangai · Architecte
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Social Anchor Strip */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-6 font-mono text-xs text-muted">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-[11px] tracking-wider text-muted/60 uppercase">Réseaux :</span>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
            >
              LinkedIn <span className="text-[10px] text-muted/60">↗</span>
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
            >
              GitHub <span className="text-[10px] text-muted/60">↗</span>
            </a>
            <a
              href={SITE.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
            >
              X / Twitter <span className="text-[10px] text-muted/60">↗</span>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
            >
              Email <span className="text-[10px] text-muted/60">↗</span>
            </a>
          </div>

          <div className="flex items-center gap-2 text-muted/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>Lomé, Togo · GMT+0</span>
          </div>
        </div>
      </div>
    </section>
  );
}
