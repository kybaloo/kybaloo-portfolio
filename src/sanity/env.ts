/**
 * Variables d'environnement Sanity, validées au chargement du module.
 *
 * Une variable manquante doit faire échouer le démarrage avec un message
 * lisible, pas produire un `undefined` qui se propage jusqu'à une requête
 * silencieusement vide.
 *
 * Ce module ne contient que des valeurs publiques (préfixées
 * `NEXT_PUBLIC_`, ou dérivées) : il reste volontairement importable depuis
 * un composant client, notamment `sanity.config.ts` (consommé par le
 * Studio). Le token de lecture, lui, vit dans `env.server.ts`, gardé par
 * `server-only` — voir ce fichier pour le raisonnement.
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
