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
    {title: 'Plus récent d’abord', name: 'recent', by: [{field: 'startDate', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'position.0.value', subtitle: 'organisation'},
  },
});
