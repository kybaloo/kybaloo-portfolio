'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {SITE} from '@/lib/site';

export function ContactCta() {
  const t = useTranslations('home');
  const [copied, setCopied] = useState(false);

  const email = 'tchangaiflorentin6@gmail.com';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <section id="contact-cta" className="py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-paper/80 p-8 shadow-2xs backdrop-blur-xs sm:p-12">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-2 font-mono text-xs font-medium tracking-widest text-accent uppercase">
                {t('contactTag')}
              </div>
              <h2 className="font-sans text-3xl leading-tight font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                {t('contactTitle')}
              </h2>
              <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-muted sm:text-lg">
                {t('contactSubtitle')}
              </p>

              {/* Actions Row */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-sans text-sm font-semibold text-paper shadow-sm transition-all hover:scale-[1.02] hover:bg-ink/85 active:scale-[0.98]"
                >
                  <span>{t('ctaContact')}</span>
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

                {/* Copy email button */}
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-5 py-3 font-mono text-xs text-ink shadow-2xs transition-colors hover:border-ink/40 hover:text-ink active:scale-95"
                >
                  <svg
                    className="h-4 w-4 text-muted"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  <span>{copied ? t('contactEmailCopied') : email}</span>
                  <span className="text-[11px] text-muted">
                    [{copied ? '✓' : t('contactEmailBtn')}]
                  </span>
                </button>
              </div>
            </div>

            {/* Metadata / Workspace Card */}
            <div className="space-y-4 rounded-xl border border-line/80 bg-paper/90 p-5 shadow-2xs lg:col-span-4">
              <div className="border-b border-line/60 pb-2 font-mono text-xs text-muted/80">
                SYSTEM_METADATA
              </div>

              <div>
                <span className="block font-mono text-[11px] text-muted uppercase">
                  Localisation & Fuseau
                </span>
                <span className="mt-0.5 block font-mono text-xs text-ink">
                  {t('location')} (GMT+0)
                </span>
              </div>

              <div>
                <span className="block font-mono text-[11px] text-muted uppercase">
                  Disponibilité
                </span>
                <span className="mt-0.5 block flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Ouvert aux missions d&apos;architecture
                </span>
              </div>

              <div>
                <span className="block font-mono text-[11px] text-muted uppercase">
                  Réseaux & Code
                </span>
                <div className="mt-1 flex items-center gap-3 font-mono text-xs text-ink">
                  <a
                    href={SITE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-line underline-offset-2 hover:text-accent"
                  >
                    GitHub
                  </a>
                  <span className="text-muted/60">•</span>
                  <a
                    href={SITE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-line underline-offset-2 hover:text-accent"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
