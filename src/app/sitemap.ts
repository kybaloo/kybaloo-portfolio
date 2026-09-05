import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/lib/site';

// Pages statiques. Les fiches projets et articles s'ajoutent au plan 3,
// une fois que Sanity fournit la liste des slugs.
const STATIC_PAGES = ['/', '/expertise', '/work', '/about', '/writing', '/contact'] as const;

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
