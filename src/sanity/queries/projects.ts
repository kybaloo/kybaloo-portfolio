import {defineQuery} from 'next-sanity';

/**
 * `defineQuery` marque la chaîne pour que TypeGen en dérive un type de
 * résultat. Une requête écrite en littéral simple ne serait pas typée.
 */
export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(order asc, year desc) {
    _id,
    title,
    "slug": slug.current,
    "summary": summary[language == $language][0].value,
    year,
    client,
    "role": role[language == $language][0].value,
    featured,
    stack,
    "cover": images[0]{
      ...,
      "alt": alt[language == $language][0].value
    },
    links
  }
`);

export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(order asc, year desc) [0...4] {
    _id,
    title,
    "slug": slug.current,
    "summary": summary[language == $language][0].value,
    year,
    client,
    stack
  }
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    "summary": summary[language == $language][0].value,
    year,
    client,
    "role": role[language == $language][0].value,
    stack,
    images[]{
      ...,
      "alt": alt[language == $language][0].value
    },
    links,
    "context": context[language == $language][0].value,
    "constraint": constraint[language == $language][0].value,
    "decisions": decisions[]{ "text": text[language == $language][0].value },
    outcomes[]{
      value,
      "label": label[language == $language][0].value
    }
  }
`);
