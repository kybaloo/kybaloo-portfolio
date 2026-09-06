import {defineQuery} from 'next-sanity';

/**
 * Le singleton des réglages porte le SEO par défaut du site (spec §9) :
 * titre, description et image de partage servis par toute page qui n'a pas
 * les siens. Ses champs sont `required()` dans le schéma, mais aucune
 * requête ne les lisait — le contenu était donc saisissable et inatteignable.
 */
export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings"][0] {
    "title": title[language == $language][0].value,
    "description": description[language == $language][0].value,
    ogImage
  }
`);
