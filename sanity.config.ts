import {visionTool} from '@sanity/vision';
import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {internationalizedArray} from 'sanity-plugin-internationalized-array';
import {apiVersion, dataset, projectId} from './src/sanity/env';
import {schemaTypes} from './src/sanity/schemas';
import {singletonActions, singletonNewDocumentOptions, structure} from './src/sanity/structure';

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
  ],
  document: {
    actions: singletonActions,
    newDocumentOptions: singletonNewDocumentOptions,
  },
});
