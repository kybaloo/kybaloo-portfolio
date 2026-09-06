import {defineQuery} from 'next-sanity';

/**
 * `projects` est un tableau de références : sans le `->` de
 * déréférencement, la requête ne renverrait que des `_ref` opaques et la
 * page n'aurait rien à afficher. Ce sont eux qui portent la décision de
 * positionnement du schéma — la preuve par les projets plutôt qu'un niveau
 * en pourcentage —, donc les omettre viderait la compétence de sa substance.
 *
 * Le tri groupe par domaine puis par nom : `category` et `name` sont tous
 * deux obligatoires, aucun ne peut manquer. `_id asc` départage deux
 * compétences homonymes dans un même domaine.
 */
export const SKILLS_QUERY = defineQuery(`
  *[_type == "skill"] | order(category asc, name asc, _id asc) {
    _id,
    name,
    category,
    usage,
    "projects": projects[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
`);
