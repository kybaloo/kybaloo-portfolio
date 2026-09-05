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
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-x-6 gap-y-3 px-6 py-5">
        <Link href="/" className="font-serif text-lg">
          Florentin Tchangai
        </Link>

        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <nav aria-label={t('primaryLabel')} className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map(({href, key}) => (
              <Link
                key={href}
                href={href}
                className="font-mono text-xs tracking-widest text-muted uppercase hover:text-ink"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
          <LanguageSwitch current={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
