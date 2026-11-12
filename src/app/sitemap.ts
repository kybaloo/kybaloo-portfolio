import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/lib/site';
import {PROJECTS} from '@/lib/projects-data';

const STATIC_PAGES = ['/', '/expertise', '/work', '/about', '/writing', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // Entrées statiques pour chaque page dans chaque langue
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}${getPathname({href, locale})}`,
      lastModified: new Date(),
      changeFrequency: href === '/' ? 'weekly' : 'monthly',
      priority: href === '/' ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${siteUrl}${getPathname({href, locale: l})}`]),
        ),
      },
    })),
  );

  // Entrées dynamiques pour chaque projet dans chaque langue
  const projectEntries: MetadataRoute.Sitemap = PROJECTS.flatMap((project) =>
    routing.locales.map((locale) => {
      const href = {
        pathname: '/work/[slug]',
        params: {slug: project.slug},
      } as const;

      return {
        url: `${siteUrl}${getPathname({href, locale})}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteUrl}${getPathname({href, locale: l})}`]),
          ),
        },
      };
    }),
  );

  return [...staticEntries, ...projectEntries];
}
