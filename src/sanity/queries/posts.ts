import {defineQuery} from 'next-sanity';

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && language == $language && defined(publishedAt)]
    | order(pinned desc, publishedAt desc) {
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
    body
  }
`);
