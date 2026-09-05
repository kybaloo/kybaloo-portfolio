import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/lib/site';

// Seules les routes qui existent réellement doivent figurer ici : un
// sitemap qui annonce des 404 nuit au référencement qu'il est censé
// protéger. `/expertise`, `/work`, `/about`, `/writing` et `/contact` sont
// déjà déclarées dans `routing.pathnames` (tâche 5) mais n'ont pas encore de
// page — quiconque crée l'une de ces pages doit l'ajouter ici. Les fiches de
// projets et d'articles s'ajoutent au plan 3, une fois que le CMS fournit la
// liste des slugs.
const STATIC_PAGES = ['/'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_PAGES.map((href) => ({
    url: `${siteUrl}${getPathname({href, locale: routing.defaultLocale})}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${siteUrl}${getPathname({href, locale})}`]),
      ),
    },
  }));
}
