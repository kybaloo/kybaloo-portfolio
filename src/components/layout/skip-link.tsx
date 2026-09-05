import {useTranslations} from 'next-intl';

export function SkipLink() {
  const t = useTranslations('a11y');
  return (
    <a
      href="#main"
      className="sr-only rounded-md bg-accent px-4 py-2 text-sm text-paper focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
    >
      {t('skipToContent')}
    </a>
  );
}
