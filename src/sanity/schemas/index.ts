import type {SchemaTypeDefinition} from 'sanity';
import {bullet} from './objects/bullet';
import {link} from './objects/link';
import {outcome} from './objects/outcome';
import {profile} from './documents/profile';
import {settings} from './documents/settings';
import {project} from './documents/project';
import {service} from './documents/service';
import {experience} from './documents/experience';
import {skill} from './documents/skill';
import {post} from './documents/post';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objets réutilisables
  bullet,
  link,
  outcome,
  // Singletons
  profile,
  settings,
  // Documents structurés
  project,
  service,
  experience,
  skill,
  // Internationalisé au niveau document (voir DOCUMENT_INTERNATIONALIZED_TYPES)
  post,
];
