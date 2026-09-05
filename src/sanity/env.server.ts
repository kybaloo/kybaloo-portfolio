import 'server-only';
import {assertValue} from './env';

/**
 * Token de lecture, isolé de `env.ts` pour que le garde-fou `server-only`
 * ci-dessus ne s'applique qu'ici. `server-only` empoisonne tout le module
 * qui le porte : si on le posait directement dans `env.ts`, plus aucun
 * composant client ne pourrait importer les identifiants publics qui y
 * vivent aussi (`projectId`, `dataset`, `apiVersion`, `studioUrl`) —
 * or `sanity.config.ts` en a besoin, et il est importé par
 * `StudioClient.tsx`, un Composant Client. Séparer le token dans son
 * propre fichier laisse `env.ts` importable partout tout en rendant le
 * token, lui, strictement inatteignable depuis un bundle navigateur.
 *
 * Ne jamais l'importer depuis un composant client : le préfixe
 * `NEXT_PUBLIC_` est délibérément absent de la variable lue ici.
 */
export function readToken(): string {
  return assertValue(
    process.env.SANITY_API_READ_TOKEN,
    'Variable manquante : SANITY_API_READ_TOKEN',
  );
}
