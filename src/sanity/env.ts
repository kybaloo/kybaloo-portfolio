/**
 * Variables d'environnement Sanity, validées au chargement du module.
 *
 * Une variable manquante doit faire échouer le démarrage avec un message
 * lisible, pas produire un `undefined` qui se propage jusqu'à une requête
 * silencieusement vide.
 */

export function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (value === undefined || value === '') {
    throw new Error(errorMessage);
  }
  return value;
}

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Variable manquante : NEXT_PUBLIC_SANITY_PROJECT_ID',
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Variable manquante : NEXT_PUBLIC_SANITY_DATASET',
);

/** Date figée : la faire évoluer est un choix délibéré, jamais un effet de bord. */
export const apiVersion = '2026-09-01';

export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? '/studio';

/**
 * Token de lecture, strictement serveur. Ne jamais l'importer depuis un
 * composant client : le préfixe `NEXT_PUBLIC_` est délibérément absent.
 */
export function readToken(): string {
  return assertValue(
    process.env.SANITY_API_READ_TOKEN,
    'Variable manquante : SANITY_API_READ_TOKEN',
  );
}
