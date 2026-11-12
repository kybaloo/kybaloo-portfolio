import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {LanguageSwitch} from './language-switch';
import {ThemeToggle} from './theme-toggle';

const LINKS = [
  {href: '/expertise', key: 'expertise'},
  {href: '/work', key: 'work'},
  {href: '/about', key: 'about'},
  {href: '/writing', key: 'writing'},
  {href: '/contact', key: 'contact'},
] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3.5">
        {/* Monogram Brand Mark */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-sm tracking-tight text-ink transition-opacity hover:opacity-85"
        >
          <span className="flex h-6 items-center justify-center rounded-sm border border-line bg-paper px-1.5 text-[11px] font-bold tracking-wider text-accent shadow-2xs transition-colors group-hover:border-accent">
            FT
          </span>
          <span className="font-sans text-sm font-semibold tracking-tight text-ink">
            Florentin<span className="font-normal text-muted">.TCHANGAI</span>
          </span>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          <nav
            aria-label={t('primaryLabel')}
            className="hidden items-center gap-4 md:flex lg:gap-5"
          >
            {LINKS.map(({href, key}) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-xs tracking-wider text-muted uppercase transition-colors hover:text-ink"
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Book a Call Pill CTA */}
          <Link
            href="/contact"
            className="hidden items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 font-sans text-xs font-medium text-paper shadow-2xs transition-all hover:bg-ink/85 active:scale-95 sm:inline-flex"
          >
            <span>{t('bookCall')}</span>
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="flex items-center gap-2 border-l border-line pl-3">
            <LanguageSwitch current={locale} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="flex overflow-x-auto border-t border-line/40 px-6 py-2 md:hidden">
        <nav aria-label={t('primaryLabel')} className="flex items-center gap-4 whitespace-nowrap">
          {LINKS.map(({href, key}) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-[11px] tracking-wider text-muted uppercase transition-colors hover:text-ink"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
