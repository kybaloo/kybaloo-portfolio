import type {StructureResolver} from 'sanity/structure';

/**
 * Les singletons (`profile`, `settings`) n'existent qu'en un exemplaire :
 * on les expose comme documents uniques plutôt que comme listes, sinon un
 * éditeur peut en créer un second et le site ne saura pas lequel servir.
 */
export const SINGLETON_TYPES = new Set(['profile', 'settings']);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Profil')
        .id('profile')
        .child(S.document().schemaType('profile').documentId('profile')),
      S.listItem()
        .title('Réglages du site')
        .id('settings')
        .child(S.document().schemaType('settings').documentId('settings')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETON_TYPES.has(item.getId() ?? '')),
    ]);
