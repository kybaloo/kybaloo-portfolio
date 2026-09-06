import {defineQuery} from 'next-sanity';

/**
 * Les articles sont internationalisés au niveau **document** : la version
 * française et la version anglaise sont deux documents distincts, reliés
 * par un troisième que `@sanity/document-internationalization` écrit pour
 * son compte (`translation.metadata`, dont le champ `translations` est un
 * tableau internationalisé de références — voir le type généré
 * `InternationalizedArrayReferenceValue`). L'homologue d'un article dans
 * l'autre langue n'est donc atteignable par aucun champ de l'article
 * lui-même : il faut remonter par ce document de liaison, sans quoi
 * `/fr/ecrits/[slug]` ne peut pas émettre son `hreflang`.
 *
 * `references(^._id)` plutôt qu'une comparaison sur `translations[].value._ref` :
 * c'est la forme que le plugin emploie lui-même pour retrouver les documents
 * de liaison d'un article, et elle survit à un changement de forme interne
 * du tableau.
 */
const TRANSLATIONS_PROJECTION = `
  "translations": *[_type == "translation.metadata" && references(^._id)][0]
    .translations[defined(value)]{
      language,
      "slug": value->slug.current
    }
`;

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && language == $language && defined(publishedAt)]
    | order(pinned desc, publishedAt desc, _id asc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedAt,
    tags,
    pinned,
    cover
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && language == $language && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedAt,
    tags,
    cover,
    body,
    ${TRANSLATIONS_PROJECTION}
  }
`);
