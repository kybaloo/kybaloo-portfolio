import {defineField, defineType} from 'sanity';

/**
 * Une puce de texte internationalisée.
 *
 * Sanity n'autorise pas un tableau à contenir directement un autre tableau,
 * or `internationalizedArrayString` EST un tableau. Toute liste de textes
 * traduits doit donc passer par un objet enveloppe comme celui-ci.
 */
export const bullet = defineType({
  name: 'bullet',
  title: 'Puce',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Texte',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {text: 'text.0.value'},
    prepare: ({text}) => ({title: text ?? '(vide)'}),
  },
});
