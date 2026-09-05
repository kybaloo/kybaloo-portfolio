import {defineCliConfig} from 'sanity/cli';
import {dataset, projectId} from './src/sanity/env';

export default defineCliConfig({
  api: {projectId, dataset},
  // Les types sont générés depuis les requêtes de src/sanity/queries/.
  autoUpdates: false,
});
