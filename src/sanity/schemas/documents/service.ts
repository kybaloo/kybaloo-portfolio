import {defineField, defineType} from 'sanity';

/**
 * Les cinq étapes de l'arc, dans l'ordre. Utilisée à la fois pour la liste
 * déroulante de `stage` et pour vérifier que `number` et `stage` désignent
 * la même étape — une seule source de vérité pour l'ordre de l'arc.
 */
const STAGES = [
  {title: 'Understand', value: 'understand'},
  {title: 'Architect', value: 'architect'},
  {title: 'Build', value: 'build'},
  {title: 'Measure', value: 'measure'},
  {title: 'Improve', value: 'improve'},
] as const;

/**
 * Les cinq services sont les étapes d'une même expertise, dans l'ordre de
 * l'arc Understand → Architect → Build → Measure → Improve. La numérotation
 * suit cet ordre : un « 01 » en face de la deuxième étape casserait la
 * lecture linéaire que la section doit produire.
 *
 * Deux garde-fous protègent cette lecture linéaire :
 *
 * - `stage` valide, par une règle personnalisée, que son étape correspond
 *   bien au `number` du même document (via `STAGES`). On a choisi de
 *   *valider la correspondance* plutôt que de dériver un champ de l'autre :
 *   les deux restent des choix explicites de l'éditeur — un menu déroulant
 *   pour chacun — et l'erreur affichée nomme directement l'étape attendue.
 *   Dériver `stage` de `number` (ou l'inverse) aurait exigé soit un composant
 *   de saisie personnalisé pour rester synchronisé après la création du
 *   document, soit un champ en lecture seule peu lisible pour l'éditeur ;
 *   fusionner les deux notions en un seul champ (ex. une liste de 5 entrées
 *   « 01 — Understand ») aurait cassé le test déjà en place sur la liste
 *   ordonnée de `stage.options.list`. La validation croisée est le choix le
 *   plus simple qui rend l'incohérence impossible à publier sans toucher à
 *   l'un ou l'autre champ ni au reste du schéma.
 * - `number` valide, par une règle personnalisée asynchrone, qu'aucun autre
 *   document `service` ne porte déjà le même numéro (motif recommandé par
 *   Sanity pour l'unicité d'un champ hors `slug`).
 */
export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'number',
      title: 'Numéro',
      type: 'number',
      validation: (r) =>
        r
          .required()
          .min(1)
          .max(5)
          .custom(async (number, context) => {
            if (typeof number !== 'number') return true;
            const id = context.document?._id.replace(/^drafts\./, '');
            if (!id) return true;
            const client = context.getClient({apiVersion: '2024-01-01'});
            const query =
              '!defined(*[_type == "service" && !(_id in [$draft, $published]) && number == $number][0]._id)';
            const isUnique = await client.fetch(query, {
              draft: `drafts.${id}`,
              published: id,
              number,
            });
            return isUnique || 'Ce numéro est déjà utilisé par un autre service.';
          }),
    }),
    defineField({
      name: 'stage',
      title: 'Étape de l’arc',
      type: 'string',
      options: {list: [...STAGES]},
      validation: (r) =>
        r.required().custom((stage, context) => {
          const number = (context.document as {number?: number} | undefined)?.number;
          if (typeof number !== 'number' || number < 1 || number > STAGES.length) {
            // Le numéro est hors bornes ou absent : sa propre validation
            // (`required().min(1).max(5)`) le signale déjà, inutile de
            // dupliquer l'erreur ici.
            return true;
          }
          const expected = STAGES[number - 1]?.value;
          return stage === expected
            ? true
            : `L’étape doit être « ${expected} » pour le numéro ${number} (arc Understand → Improve).`;
        }),
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      description: 'En anglais. Ex. : « Architecture & Systems ».',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'keywords',
      title: 'Mots-clés',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
  ],
  orderings: [{title: 'Ordre de l’arc', name: 'arc', by: [{field: 'number', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', number: 'number', stage: 'stage'},
    prepare: ({title, number, stage}) => ({
      title: `${String(number).padStart(2, '0')} — ${title}`,
      subtitle: stage,
    }),
  },
});
