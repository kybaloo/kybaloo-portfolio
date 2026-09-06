import type {DocumentActionsResolver, NewDocumentOptionsResolver} from 'sanity';
import type {StructureResolver} from 'sanity/structure';

/**
 * Les singletons (`profile`, `settings`) n'existent qu'en un exemplaire :
 * on les expose comme documents uniques plutôt que comme listes, sinon un
 * éditeur peut en créer un second et le site ne saura pas lequel servir.
 */
export const SINGLETON_TYPES = new Set(['profile', 'settings']);

/**
 * Types dont l'internationalisation se fait au niveau document plutôt
 * qu'au niveau champ, via `@sanity/document-internationalization`
 * (configuré dans `sanity.config.ts`, qui importe cette même constante
 * plutôt que de répéter la liste). `post` est seul concerné : un article
 * peut n'exister qu'en une langue et son texte diverge réellement d'une
 * langue à l'autre, dupliquer le document est ici l'objectif plutôt qu'un
 * coût. Les autres documents (`profile`, `settings`, `project`, `service`,
 * `experience`, `skill`) restent internationalisés au niveau champ, via
 * `internationalizedArrayString`/`internationalizedArrayText` : ils
 * partagent leurs images, leur stack et leurs dates, que dupliquer
 * obligerait l'éditeur à re-téléverser et à maintenir en double.
 *
 * `post` n'est délibérément pas ajouté à `SINGLETON_TYPES` ci-dessus : les
 * deux frontières sont indépendantes, et un article reste un document
 * créable et supprimable normalement.
 */
export const DOCUMENT_INTERNATIONALIZED_TYPES = ['post'];

/**
 * Types document enregistrés par un plugin pour son propre usage, et non
 * par nos schémas : `@sanity/document-internationalization` écrit un
 * document `translation.metadata` par groupe de traductions, qu'il crée,
 * met à jour et supprime lui-même au fil des liens FR ↔ EN.
 *
 * Distinct de `SINGLETON_TYPES` ci-dessus, et la nuance compte : un
 * singleton est un document que l'éditeur ouvre et modifie bel et bien —
 * on lui retire seulement dupliquer/dépublier/supprimer —, tandis qu'un
 * type géré par un plugin ne doit apparaître nulle part dans le Studio.
 * Une entrée « Translation metadata » dans la liste, ou dans « + New
 * document », n'offre à l'éditeur que l'occasion de casser les liens de
 * traduction à la main.
 */
export const PLUGIN_MANAGED_TYPES = new Set(['translation.metadata']);

/**
 * Un type a-t-il sa place dans la liste générique des documents ? Les
 * singletons n'y figurent pas parce qu'ils ont leur entrée dédiée en tête
 * de structure ; les types de plugin, parce que l'éditeur n'a rien à y
 * faire. Le même prédicat sert à la structure et au menu de création
 * globale : les deux répondent à la même question.
 */
export const isEditorManagedType = (typeName: string): boolean =>
  !SINGLETON_TYPES.has(typeName) && !PLUGIN_MANAGED_TYPES.has(typeName);

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
 * Retire du menu de création globale (« + New document ») les singletons et
 * les types gérés par un plugin.
 *
 * Sans ce filtre, le bouton global résout via `resolveNewDocumentOptions`,
 * qui retombe sur `defaultTemplatesForSchema` quand `newDocumentOptions`
 * n'est pas configuré : un modèle par type document, sans discrimination —
 * `profile`, `settings` et `translation.metadata` compris. Ce chemin ne
 * passe jamais par `document.actions` ni par la structure personnalisée :
 * sans ce second verrou, un éditeur pouvait créer un second `profile` par
 * ce bouton, et le site n'aurait alors aucun moyen de savoir lequel servir.
 *
 * Les modèles par défaut portent un `templateId` égal au nom du type
 * document (`defaultTemplateForType`, dans le paquet `sanity`) : filtrer
 * sur `templateId` revient donc à filtrer par type pour ce cas par défaut.
 */
export const restrictedNewDocumentOptions: NewDocumentOptionsResolver = (
  prev,
  {creationContext},
) =>
  creationContext.type === 'global'
    ? prev.filter((templateItem) => isEditorManagedType(templateItem.templateId))
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
      ...S.documentTypeListItems().filter((item) => isEditorManagedType(item.getId() ?? '')),
    ]);
