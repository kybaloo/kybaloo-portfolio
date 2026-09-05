import createImageUrlBuilder from '@sanity/image-url';
// Dans @sanity/image-url 2.1.1, `SanityImageSource` est exporté depuis la
// racine du paquet ; l'ancien chemin `lib/types/types` n'existe plus.
import type {SanityImageSource} from '@sanity/image-url';
import {dataset, projectId} from '../env';

const builder = createImageUrlBuilder({projectId, dataset});

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
