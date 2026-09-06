import {defineField, defineType} from 'sanity';

/**
 * Pas de niveau en pourcentage : « JavaScript 95 % » n'est mesuré par rien
 * et signale un portfolio junior au public technique visé. Le niveau réel
 * est prouvé par les projets référencés.
 */
export const skill = defineType({
  name: 'skill',
  title: 'Compétence',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nom', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'category',
      title: 'Domaine',
      type: 'string',
      options: {
        list: [
          {title: 'Frontend', value: 'frontend'},
          {title: 'Backend', value: 'backend'},
          {title: 'Données & BI', value: 'data'},
          {title: 'Cloud & DevOps', value: 'cloud'},
          {title: 'Outils', value: 'tools'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'usage',
      title: 'Fréquence d’usage',
      type: 'string',
      options: {
        list: [
          {title: 'Au quotidien', value: 'daily'},
          {title: 'Régulièrement', value: 'regular'},
          {title: 'Notions', value: 'familiar'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'projects',
      title: 'Projets qui la prouvent',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      description: 'La preuve plutôt que la déclaration.',
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'usage'}},
});
