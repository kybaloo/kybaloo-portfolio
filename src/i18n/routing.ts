import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',

  // Clé = chemin interne (toujours en anglais, c'est le nom du dossier).
  // Valeur = chemin public, localisé quand les deux langues divergent.
  pathnames: {
    '/': '/',
    '/expertise': '/expertise',
    '/contact': '/contact',
    '/work': {fr: '/travaux', en: '/work'},
    '/work/[slug]': {fr: '/travaux/[slug]', en: '/work/[slug]'},
    '/about': {fr: '/parcours', en: '/about'},
    '/writing': {fr: '/ecrits', en: '/writing'},
    '/writing/[slug]': {fr: '/ecrits/[slug]', en: '/writing/[slug]'},
  },
});

export type Locale = (typeof routing.locales)[number];
