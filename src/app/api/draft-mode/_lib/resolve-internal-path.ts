// Préfixé `_` : dossier privé au sens du routeur Next (jamais résolu comme
// route), partagé entre `enable/route.ts` et `disable/route.ts` pour ne pas
// dupliquer la validation de chemin — les deux exposent la même surface
// d'attaque (un `slug` fourni par l'appelant, transmis à `redirect()`).

// Origine factice utilisée uniquement pour résoudre `slug` sans jamais
// l'envoyer sur le réseau. Voir `resolveInternalRedirectPath` ci-dessous.
const INTERNAL_ORIGIN = 'http://internal.invalid';

/**
 * Vérifie que `slug` désigne un chemin interne sûr et renvoie sa forme
 * normalisée (chemin + recherche + fragment), ou `null` s'il ne l'est pas.
 *
 * `slug.startsWith('/')` seul ne suffit pas : `//evil.com` commence aussi
 * par `/` et un navigateur le traite comme une URL protocole-relative (même
 * schéma, autre hôte). Les variantes à barre oblique inverse (`/\evil.com`,
 * `\\evil.com`) atteignent le même résultat, car le standard WHATWG URL
 * normalise `\` en `/` pour les schémas "spéciaux" (http, https, ...) —
 * exactement ce que fait un navigateur en lisant l'en-tête `Location`. Le
 * décodage pourcentage n'ouvre pas de voie supplémentaire ici : Next a déjà
 * décodé `slug` en le lisant depuis `searchParams`, donc `%2F%2Fevil.com`
 * arrive déjà sous la forme `//evil.com` et suit le même chemin de rejet.
 *
 * Plutôt que d'énumérer ces cas un par un, on délègue la décision à
 * l'analyseur d'URL standard (le même algorithme qu'utilise un navigateur) :
 * on résout `slug` par rapport à une origine interne fixe et on vérifie que
 * l'origine résultante n'a pas bougé. Toute tentative d'évasion — `//`,
 * `\`, une URL absolue (`https://evil.com`) ou un schéma exotique
 * (`javascript:`, `file:`) — change l'origine résolue et échoue donc à ce
 * contrôle, sans liste de cas particuliers à maintenir.
 */
export function resolveInternalRedirectPath(slug: string): string | null {
  if (!slug.startsWith('/')) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(slug, INTERNAL_ORIGIN);
  } catch {
    return null;
  }

  if (url.origin !== INTERNAL_ORIGIN) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}
