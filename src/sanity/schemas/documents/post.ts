import {defineArrayMember, defineField, defineType} from 'sanity';

/**
 * `post` est le SEUL document internationalisé au niveau document (voir
 * `@sanity/document-internationalization` dans `sanity.config.ts`) : un
 * article peut n'exister qu'en une langue et son texte diverge réellement
 * d'une langue à l'autre, dupliquer le document est ici l'objectif. Tous
 * les autres documents restent internationalisés au niveau champ, via
 * `internationalizedArrayString`/`internationalizedArrayText` — ils
 * partagent leurs images, leur stack et leurs dates, que dupliquer
 * obligerait l'éditeur à re-téléverser et à maintenir en double.
 *
 * Les champs de texte ci-dessous sont donc des types simples (`string`,
 * `text`, `array` de blocs Portable Text) et non des types
 * `internationalizedArray*` : ces deux modèles d'internationalisation ne
 * se mélangent pas au sein d'un même document.
 */
export const post = defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  fields: [
    // Rempli par @sanity/document-internationalization ; masqué à l'édition.
    defineField({name: 'language', type: 'string', readOnly: true, hidden: true}),
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (r) => r.required()}),
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
      type: 'text',
      rows: 3,
      description: 'Apparaît dans la liste et dans les aperçus de partage.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Image de couverture',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Texte alternatif', type: 'string'})],
    }),
    defineField({
      name: 'tags',
      title: 'Étiquettes',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'pinned',
      title: 'Épinglé',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Corps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Titre 2', value: 'h2'},
            {title: 'Titre 3', value: 'h3'},
            {title: 'Citation', value: 'blockquote'},
          ],
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lien',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    validation: (r) => r.uri({scheme: ['http', 'https', 'mailto']}),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: 'Texte alternatif', type: 'string'})],
        }),
        defineArrayMember({
          type: 'object',
          name: 'codeBlock',
          title: 'Bloc de code',
          fields: [
            defineField({name: 'language', title: 'Langage', type: 'string'}),
            defineField({name: 'code', title: 'Code', type: 'text', rows: 12}),
          ],
          preview: {
            select: {language: 'language', code: 'code'},
            prepare: ({language, code}) => ({
              title: language ?? 'code',
              subtitle: (code ?? '').split('\n')[0],
            }),
          },
        }),
      ],
    }),
  ],
  orderings: [
    {title: 'Plus récent d’abord', name: 'recent', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', language: 'language', media: 'cover'},
    prepare: ({title, language, media}) => ({title, subtitle: language, media}),
  },
});
