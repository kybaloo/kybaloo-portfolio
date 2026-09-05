export type Redirect = {source: string; destination: string; permanent: boolean};

/**
 * Anciennes URLs du site pré-refonte (§4.4 de la spec). Elles sont déjà
 * indexées : les supprimer sans redirection ferait perdre le référencement
 * acquis. `permanent: true` fait émettre un 308 par Next, équivalent au 301
 * pour les moteurs de recherche.
 *
 * `/admin` est absent volontairement — la ressource est supprimée, pas
 * déplacée : elle répond 410 (tâche 8).
 */
export const LEGACY_REDIRECTS: readonly Redirect[] = [
  {source: '/about', destination: '/fr/parcours', permanent: true},
  {source: '/projects', destination: '/fr/travaux', permanent: true},
  {source: '/blog', destination: '/fr/ecrits', permanent: true},
  {source: '/blog/:slug', destination: '/fr/ecrits/:slug', permanent: true},
  {source: '/resume', destination: '/fr/parcours', permanent: true},
  {source: '/contact', destination: '/fr/contact', permanent: true},
] as const;
