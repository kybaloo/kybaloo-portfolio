import {defineQuery} from 'next-sanity';

export const PROFILE_QUERY = defineQuery(`
  *[_type == "profile"][0] {
    name,
    "role": role[language == $language][0].value,
    location,
    "bio": bio[language == $language][0].value,
    photo,
    available,
    links,
    resumeFr,
    resumeEn
  }
`);
