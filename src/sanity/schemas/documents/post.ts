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

/**
 * Langages proposés pour la coloration syntaxique d'un `codeBlock`. Noms
 * complets en minuscules plutôt qu'abréviations (`typescript`, pas `ts`) :
 * ce sont les identifiants canoniques des colorateurs syntaxiques usuels
 * (Shiki, highlight.js), et ils lèvent l'ambiguïté entre `ts`, `TypeScript`
 * et `typescript` que ce champ posait sous forme de texte libre. Limité au
 * jeu de langages que ce site utilise réellement (Next.js/TypeScript/
 * Tailwind/Sanity, scripts npm, configuration) plutôt qu'à un catalogue
 * exhaustif de langages de programmation.
 */
const CODE_LANGUAGES = [
  {title: 'TypeScript', value: 'typescript'},
  {title: 'TSX', value: 'tsx'},
  {title: 'JavaScript', value: 'javascript'},
  {title: 'JSON', value: 'json'},
  {title: 'Bash', value: 'bash'},
  {title: 'CSS', value: 'css'},
  {title: 'HTML', value: 'html'},
  {title: 'YAML', value: 'yaml'},
  {title: 'Markdown', value: 'markdown'},
  {title: 'Texte brut', value: 'text'},
] as const;

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
      description: 'Fait apparaître l’article en tête de liste, avant les articles plus récents.',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Corps',
      type: 'array',
      description: 'Texte enrichi : titres, listes, citation, liens, images et blocs de code.',
      of: [
        defineArrayMember({
          type: 'block',
          // Pas de « Titre 1 » : le titre de l'article (`title`) tient déjà
          // ce rôle dans la page rendue. En proposer un second dans le
          // corps produirait deux titres de niveau 1 sur la même page.
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Titre 2', value: 'h2'},
            {title: 'Titre 3', value: 'h3'},
            {title: 'Citation', value: 'blockquote'},
          ],
          // Sans cette liste, Sanity retombe sur ses deux types de liste
          // par défaut (identiques à ceux-ci) : la déclarer explicitement
          // documente l'intention plutôt que de dépendre d'un défaut
          // implicite — un article technique énumère régulièrement des
          // étapes (numérotée) ou des options (à puces).
          lists: [
            {title: 'Liste à puces', value: 'bullet'},
            {title: 'Liste numérotée', value: 'number'},
          ],
          marks: {
            // Idem pour les décorateurs : `strong`/`em`/`code` sont ceux
            // qu'un article technique utilise réellement (mise en valeur,
            // emphase, référence à du code en ligne). `underline` et
            // `strike-through` (proposés par défaut par Sanity) sont
            // délibérément omis : le premier se confond visuellement avec
            // un lien sur le web, le second n'a pas d'usage dans ce
            // format éditorial.
            decorators: [
              {title: 'Gras', value: 'strong'},
              {title: 'Italique', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
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
            defineField({
              name: 'language',
              title: 'Langage',
              type: 'string',
              description: 'Détermine la coloration syntaxique.',
              // Une liste de valeurs proposées plutôt qu'un champ texte
              // libre : sans elle, un article écrirait « ts », le suivant
              // « TypeScript », un troisième « typescript », et la
              // coloration syntaxique n'aurait alors aucune valeur fiable
              // à interpréter. Le champ reste un `string` simple — pas de
              // `validation: (r) => r.valid(...)` — cette liste ne fait
              // que proposer des valeurs cohérentes, elle ne verrouille
              // pas le champ : un langage manquant s'ajoute en complétant
              // `CODE_LANGUAGES` ci-dessus, sans migration de données ni
              // rupture des articles déjà publiés.
              options: {list: [...CODE_LANGUAGES]},
            }),
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
