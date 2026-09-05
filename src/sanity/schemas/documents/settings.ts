import {defineField, defineType} from 'sanity';

export const settings = defineType({
  name: 'settings',
  title: 'Réglages du site',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre par défaut',
      type: 'internationalizedArrayString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description par défaut',
      type: 'internationalizedArrayText',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ogImage',
      title: 'Image de partage par défaut',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {prepare: () => ({title: 'Réglages du site'})},
});
