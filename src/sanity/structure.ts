import type {DocumentActionsResolver, NewDocumentOptionsResolver} from 'sanity';
import type {StructureResolver} from 'sanity/structure';

/**
 * Les singletons (`profile`, `settings`) n'existent qu'en un exemplaire :
 * on les expose comme documents uniques plutôt que comme listes, sinon un
 * éditeur peut en créer un second et le site ne saura pas lequel servir.
 */
export const SINGLETON_TYPES = new Set(['profile', 'settings']);

/**
 * Retire dupliquer, dépublier et supprimer sur un document singleton déjà
 * ouvert. Ne couvre qu'un chemin parmi deux : un document ouvert par la
 * structure personnalisée. Le bouton global « + New document » de la barre
 * de navigation ne passe pas par ici — voir `singletonNewDocumentOptions`.
 */
export const singletonActions: DocumentActionsResolver = (input, context) =>
  SINGLETON_TYPES.has(context.schemaType)
    ? input.filter(
        ({action}) => action !== 'unpublish' && action !== 'duplicate' && action !== 'delete',
      )
    : input;

/**
 * Retire les singletons du menu de création globale (« + New document »).
 *
 * Sans ce filtre, le bouton global résout via `resolveNewDocumentOptions`,
 * qui retombe sur `defaultTemplatesForSchema` quand `newDocumentOptions`
 * n'est pas configuré : un modèle par type document, sans discrimination —
 * `profile` et `settings` compris. Ce chemin ne passe jamais par
 * `document.actions` ni par la structure personnalisée : sans ce second
 * verrou, un éditeur pouvait créer un second `profile` par ce bouton, et le
 * site n'aurait alors aucun moyen de savoir lequel servir.
 *
 * Les modèles par défaut portent un `templateId` égal au nom du type
 * document (`defaultTemplateForType`, dans le paquet `sanity`) : filtrer
 * sur `templateId` revient donc à filtrer par type pour ce cas par défaut.
 */
export const singletonNewDocumentOptions: NewDocumentOptionsResolver = (prev, {creationContext}) =>
  creationContext.type === 'global'
    ? prev.filter((templateItem) => !SINGLETON_TYPES.has(templateItem.templateId))
    : prev;

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
