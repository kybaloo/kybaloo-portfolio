import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('nav');
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="font-mono text-xs tracking-widest text-muted uppercase">404</p>
      <h1 className="mt-3 font-serif text-3xl">Page introuvable</h1>
      <Link href="/" className="mt-6 inline-block text-accent underline underline-offset-4">
        {t('home')}
      </Link>
    </div>
  );
}
