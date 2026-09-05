import type {SchemaTypeDefinition} from 'sanity';
import {bullet} from './objects/bullet';
import {link} from './objects/link';
import {outcome} from './objects/outcome';
import {profile} from './documents/profile';
import {settings} from './documents/settings';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objets réutilisables
  bullet,
  link,
  outcome,
  // Singletons
  profile,
  settings,
];
