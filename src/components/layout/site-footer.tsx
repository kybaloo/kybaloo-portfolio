import {useTranslations} from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-2 px-6 py-8 font-mono text-xs text-muted">
        <span>
          © {year} Florentin Tchangai. {t('rights')}
        </span>
        <span>{t('builtWith')}</span>
      </div>
    </footer>
  );
}
