import {defineField, defineType} from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Projet',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identifiant d’URL',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Résumé',
      type: 'internationalizedArrayText',
      description: 'Deux lignes maximum. Apparaît dans la liste des travaux.',
    }),
    defineField({name: 'year', title: 'Année', type: 'number'}),
    defineField({name: 'client', title: 'Client ou contexte', type: 'string'}),
    defineField({name: 'role', title: 'Rôle tenu', type: 'internationalizedArrayString'}),
    defineField({
      name: 'featured',
      title: 'Mis en avant sur l’accueil',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      description: 'Plus petit en premier.',
    }),
    defineField({
      name: 'stack',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'images',
      title: 'Captures',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texte alternatif',
              type: 'internationalizedArrayString',
            }),
          ],
        },
      ],
    }),
    defineField({name: 'links', title: 'Liens', type: 'array', of: [{type: 'link'}]}),

    // ---- Champs d'architecture ----
    // Sans eux, une fiche prouve qu'on sait développer, pas qu'on sait
    // concevoir. Ils sont optionnels : une fiche incomplète affiche moins.
    defineField({
      name: 'context',
      title: 'Contexte',
      type: 'internationalizedArrayText',
      description: 'Deux lignes : à quel besoin ce projet répondait-il ?',
      group: 'architecture',
    }),
    defineField({
      name: 'constraint',
      title: 'Contrainte principale',
      type: 'internationalizedArrayString',
      description: 'Une ligne. Ex. : « 40 % des sites sans réseau stable ».',
      group: 'architecture',
    }),
    defineField({
      name: 'decisions',
      title: 'Décisions d’architecture',
      type: 'array',
      // `bullet` et non `internationalizedArrayString` : Sanity refuse un
      // tableau contenant directement un autre tableau.
      of: [{type: 'bullet'}],
      description: 'Trois à cinq puces courtes. Ce que vous avez arbitré, et contre quoi.',
      group: 'architecture',
    }),
    defineField({
      name: 'outcomes',
      title: 'Résultats mesurables',
      type: 'array',
      of: [{type: 'outcome'}],
      group: 'architecture',
    }),
  ],
  groups: [{name: 'architecture', title: 'Architecture'}],
  orderings: [
    {
      title: 'Ordre d’affichage',
      name: 'displayOrder',
      // `order` est optionnel et peut rester vide longtemps (Step 3 du
      // brief) : sans départage, deux projets à `order` égal ou absent
      // n'ont pas de position relative définie, et peuvent changer de
      // place d'une requête à l'autre. `_id` est stable et toujours présent.
      by: [
        {field: 'order', direction: 'asc'},
        {field: '_id', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'title', year: 'year', media: 'images.0'},
    prepare: ({title, year, media}) => ({title, subtitle: year ? String(year) : undefined, media}),
  },
});
