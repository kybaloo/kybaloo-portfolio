import {defineQuery} from 'next-sanity';

export const SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(number asc) {
    _id,
    number,
    stage,
    title,
    "description": description[language == $language][0].value,
    keywords
  }
`);
