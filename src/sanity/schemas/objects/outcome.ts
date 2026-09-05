import {defineField, defineType} from 'sanity';

/**
 * Un résultat mesurable. C'est ce qui distingue une fiche projet d'une
 * liste de fonctionnalités : « 50 M$ de demandes traitées » vaut mieux que
 * « traitement des demandes ».
 */
export const outcome = defineType({
  name: 'outcome',
  title: 'Résultat',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Valeur',
      type: 'string',
      description: 'Le chiffre ou la mesure. Ex. : « 40 % », « 50 M$ », « 12 000 ».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Ce que la valeur mesure',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {value: 'value', label: 'label.0.value'},
    prepare: ({value, label}) => ({title: value, subtitle: label}),
  },
});
