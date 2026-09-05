import {defineField, defineType} from 'sanity';

export const link = defineType({
  name: 'link',
  title: 'Lien',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Libellé', type: 'string'}),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto']}),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'url'}},
});
