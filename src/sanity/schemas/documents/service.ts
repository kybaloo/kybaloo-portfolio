import {defineField, defineType} from 'sanity';

/**
 * Les cinq services sont les étapes d'une même expertise, dans l'ordre de
 * l'arc Understand → Architect → Build → Measure → Improve. La numérotation
 * suit cet ordre : un « 01 » en face de la deuxième étape casserait la
 * lecture linéaire que la section doit produire.
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
      validation: (r) => r.required().min(1).max(5),
    }),
    defineField({
      name: 'stage',
      title: 'Étape de l’arc',
      type: 'string',
      options: {
        list: [
          {title: 'Understand', value: 'understand'},
          {title: 'Architect', value: 'architect'},
          {title: 'Build', value: 'build'},
          {title: 'Measure', value: 'measure'},
          {title: 'Improve', value: 'improve'},
        ],
      },
      validation: (r) => r.required(),
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
