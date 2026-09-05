import {createClient} from 'next-sanity';
import {apiVersion, dataset, projectId, studioUrl} from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Le CDN sert le contenu publié : plus rapide, suffisant pour le site.
  useCdn: true,
  perspective: 'published',
  stega: {studioUrl},
});
