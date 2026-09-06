import {defineField, defineType} from 'sanity';

export const experience = defineType({
  name: 'experience',
  title: 'Expérience',
  type: 'document',
  fields: [
    defineField({
      name: 'position',
      title: 'Poste',
      type: 'internationalizedArrayString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'organisation',
      title: 'Organisation',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'location', title: 'Lieu', type: 'string'}),
    defineField({
      name: 'startDate',
      title: 'Début',
      type: 'date',
      options: {dateFormat: 'YYYY-MM'},
    }),
    defineField({
      name: 'endDate',
      title: 'Fin',
      type: 'date',
      options: {dateFormat: 'YYYY-MM'},
      description: 'Laisser vide si le poste est en cours.',
    }),
    defineField({name: 'description', title: 'Description', type: 'internationalizedArrayText'}),
    defineField({
      name: 'achievements',
      title: 'Réalisations',
      type: 'array',
      of: [{type: 'bullet'}],
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
  ],
  orderings: [
    {
      title: 'Plus récent d’abord',
      name: 'recent',
      by: [
        // `startDate` est optionnel (Step 3 du brief) : sans `nulls: 'last'`,
        // Sanity place les valeurs manquantes en tête en ordre décroissant —
        // l'inverse de « une fiche incomplète affiche moins ». `_id` départage
        // les dates identiques ou également manquantes, pour un ordre stable
        // d'une requête à l'autre.
        {field: 'startDate', direction: 'desc', nulls: 'last'},
        {field: '_id', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'position.0.value', subtitle: 'organisation'},
  },
});
