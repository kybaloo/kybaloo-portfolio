import {defineQuery} from 'next-sanity';

/**
 * `number` est unique par validation, donc `_id asc` ne devrait jamais
 * départager quoi que ce soit ici. Il y figure quand même : l'unicité est
 * vérifiée à la publication dans le Studio, pas garantie par le Content
 * Lake — une écriture par jeton peut poser deux fois le même numéro.
 */
export const SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(number asc, _id asc) {
    _id,
    number,
    stage,
    title,
    "description": description[language == $language][0].value,
    keywords
  }
`);
