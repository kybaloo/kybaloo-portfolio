'use client';

import {useTranslations} from 'next-intl';
import {useParams} from 'next/navigation';
import {Link, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

export function LanguageSwitch({current}: {current: string}) {
  const t = useTranslations('language');
  // Chemin interne, sans préfixe de langue : réutilisable pour l'autre locale.
  const pathname = usePathname();
  // Requis dès qu'une route dynamique (ex. /work/[slug]) figure dans
  // `routing.pathnames` : Link exige alors {pathname, params}, pas une
  // simple chaîne. Voir la doc next-intl sur la navigation typée.
  const params = useParams();

  return (
    <nav aria-label={t('label')} className="flex items-center gap-1">
      {routing.locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && (
            <span aria-hidden className="text-muted">
              /
            </span>
          )}
          <Link
            // @ts-expect-error -- TypeScript vérifie que seuls des `params`
            // connus sont utilisés avec un `pathname` donné. Les deux
            // correspondent toujours pour la route courante, la
            // vérification est donc sans risque ici.
            href={{pathname, params}}
            locale={locale}
            hrefLang={locale}
            aria-current={locale === current ? 'true' : undefined}
            className={
              locale === current
                ? 'font-mono text-xs tracking-widest text-accent uppercase'
                : 'font-mono text-xs tracking-widest text-muted uppercase hover:text-ink'
            }
          >
            {locale}
          </Link>
        </span>
      ))}
    </nav>
  );
}
