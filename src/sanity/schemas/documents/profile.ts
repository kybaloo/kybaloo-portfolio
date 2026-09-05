import {defineField, defineType} from 'sanity';

export const profile = defineType({
  name: 'profile',
  title: 'Profil',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nom', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'role',
      title: 'Positionnement',
      type: 'internationalizedArrayString',
      description: 'Ex. : « Architecte technologique ». Pas « développeur full-stack ».',
      validation: (r) => r.required(),
    }),
    defineField({name: 'location', title: 'Lieu', type: 'string'}),
    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texte alternatif',
          type: 'internationalizedArrayString',
        }),
      ],
    }),
    defineField({
      name: 'available',
      title: 'Disponible pour des missions',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({name: 'links', title: 'Liens', type: 'array', of: [{type: 'link'}]}),
    defineField({name: 'resumeFr', title: 'CV français (PDF)', type: 'file'}),
    defineField({name: 'resumeEn', title: 'CV anglais (PDF)', type: 'file'}),
  ],
  preview: {select: {title: 'name'}, prepare: ({title}) => ({title: title ?? 'Profil'})},
});
