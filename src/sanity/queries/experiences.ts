import {defineQuery} from 'next-sanity';

/**
 * `startDate` est optionnel (voir `experience.ts`) et GROQ n'offre pas
 * l'équivalent du `nulls: 'last'` déclaré dans les `orderings` du Studio :
 * son ordre total place `null` après toute valeur en ordre croissant, donc
 * **avant** en ordre décroissant (vérifié contre `groq-js`, l'implémentation
 * de référence : `TYPE_ORDER` attribue 100 aux types non comparables). Un
 * tri naïf par `startDate desc` ferait donc remonter en tête les fiches sans
 * date — l'inverse du principe « une fiche incomplète affiche moins ». Le
 * premier critère rétablit l'intention : les fiches datées d'abord.
 *
 * `_id asc` en dernier : deux expériences de même date, ou également sans
 * date, permuteraient sinon d'une requête à l'autre.
 */
export const EXPERIENCES_QUERY = defineQuery(`
  *[_type == "experience"]
    | order(defined(startDate) desc, startDate desc, _id asc) {
    _id,
    "position": position[language == $language][0].value,
    organisation,
    location,
    startDate,
    endDate,
    "description": description[language == $language][0].value,
    "achievements": achievements[]{
      "text": text[language == $language][0].value
    },
    technologies
  }
`);
