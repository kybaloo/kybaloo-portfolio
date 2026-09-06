import 'server-only';
import type {QueryParams} from 'next-sanity';
import {draftMode} from 'next/headers';
import {sanityFetch} from './live';

/**
 * Point d'entrée unique des pages vers le contenu Sanity. Il existe pour
 * deux raisons, l'une et l'autre invisibles au point d'appel :
 *
 * 1. **L'étiquette de revalidation.** `sanityFetch` issu de `defineLive`
 *    n'enregistre que les étiquettes fournies par l'appelant, plus les
 *    `syncTags` renvoyés par le Content Lake — des jetons opaques, jamais
 *    le `_type` du document (voir `cacheTags` dans
 *    `node_modules/next-sanity/dist/live/conditions/react-server/index.js`).
 *    Or le webhook de publication appelle `revalidateTag(body._type)` : sans
 *    l'étiquette posée ici, il purgerait un nom que rien n'enregistre, et
 *    les pages — mises en cache avec `revalidate: false` — ne rejoindraient
 *    jamais un visiteur anonyme après une publication. L'appelant déclare
 *    donc le ou les types que sa requête lit ; le nom transmis est le `_type`
 *    brut, exactement celui que Sanity envoie dans le corps du webhook, pour
 *    qu'aucune transformation ne soit à maintenir des deux côtés.
 *
 * 2. **La garantie sur la perspective.** `defineLive` est configuré en
 *    `strict: true` (voir `live.ts`), ce qui rend `perspective` et `stega`
 *    obligatoires à chaque appel et supprime toute résolution automatique
 *    par cookie. Les répéter dans chaque page reviendrait à confier à chaque
 *    point d'appel la question « ce visiteur a-t-il le droit de voir les
 *    brouillons ? » — une seule omission suffirait à publier du contenu non
 *    publié. Ici, la perspective se dérive de `draftMode()` et de rien
 *    d'autre : les options de l'appelant ne sont jamais étalées vers
 *    `sanityFetch`, seules `query`, `params` et `types` en sont extraites,
 *    de sorte qu'un point d'appel ne peut pas réclamer `perspective:
 *    'drafts'`, même en contournant le typage.
 */

/**
 * Les types document que le site peut interroger : nos sept schémas, plus
 * `translation.metadata`, écrit par `@sanity/document-internationalization`
 * et lu pour les liens `hreflang` entre articles. Une union fermée plutôt
 * qu'un `string[]` : une étiquette mal orthographiée s'enregistrerait sans
 * bruit et ne serait jamais purgée par le webhook.
 */
export const DOCUMENT_TYPES = [
  'project',
  'post',
  'service',
  'experience',
  'skill',
  'profile',
  'settings',
  'translation.metadata',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export interface FetchContentOptions<QueryString extends string> {
  query: QueryString;
  params?: QueryParams;
  /** Types lus par la requête, pour l'étiquette que le webhook purge. */
  types: readonly DocumentType[];
}

export async function fetchContent<const QueryString extends string>({
  query,
  params,
  types,
}: FetchContentOptions<QueryString>) {
  const {isEnabled: isDraftMode} = await draftMode();

  return sanityFetch({
    query,
    params,
    perspective: isDraftMode ? 'drafts' : 'published',
    // L'encodage stega n'a de sens qu'en prévisualisation, où l'édition
    // visuelle s'en sert pour relier un texte rendu à son champ dans le
    // Studio. Hors de ce cas, il polluerait le contenu servi au public.
    stega: isDraftMode,
    tags: [...types],
  });
}
