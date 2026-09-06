import {documentInternationalization} from '@sanity/document-internationalization';
import {visionTool} from '@sanity/vision';
import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {internationalizedArray} from 'sanity-plugin-internationalized-array';
import {apiVersion, dataset, projectId} from './src/sanity/env';
import {schemaTypes} from './src/sanity/schemas';
import {
  DOCUMENT_INTERNATIONALIZED_TYPES,
  singletonActions,
  singletonNewDocumentOptions,
  structure,
} from './src/sanity/structure';

export default defineConfig({
  name: 'default',
  title: 'Portfolio — Florentin Tchangai',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {types: schemaTypes},
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    internationalizedArray({
      languages: [
        {id: 'fr', title: 'Français'},
        {id: 'en', title: 'English'},
      ],
      defaultLanguages: ['fr'],
      fieldTypes: ['string', 'text'],
    }),
    // Seul `post` est internationalisé au niveau document — voir
    // `DOCUMENT_INTERNATIONALIZED_TYPES` dans `src/sanity/structure.ts`.
    // Tous les autres types passent par `internationalizedArray` ci-dessus.
    documentInternationalization({
      supportedLanguages: [
        {id: 'fr', title: 'Français'},
        {id: 'en', title: 'English'},
      ],
      schemaTypes: DOCUMENT_INTERNATIONALIZED_TYPES,
    }),
  ],
  document: {
    actions: singletonActions,
    newDocumentOptions: singletonNewDocumentOptions,
  },
});
