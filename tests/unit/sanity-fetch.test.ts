import {beforeEach, describe, expect, it, vi} from 'vitest';
import {schemaTypes} from '@/sanity/schemas';
import {PLUGIN_MANAGED_TYPES} from '@/sanity/structure';

/**
 * Ce fichier éprouve `fetchContent`, l'enrobage maison de `sanityFetch`,
 * pas Sanity : les deux seules dépendances remplacées ici sont la fonction
 * de récupération sous-jacente (dont on inspecte les arguments reçus) et
 * `draftMode()`. Tout ce qui est vérifié ensuite est du comportement de
 * notre code — le nom d'étiquette enregistré et la dérivation de la
 * perspective — jamais une réponse fabriquée du Content Lake.
 */

// Voir tests/unit/sanity-env.test.ts pour le raisonnement : `server-only`
// lève inconditionnellement hors de la condition de résolution
// `react-server`, que Vitest ne pose jamais.
vi.mock('server-only', () => ({}));

const mocks = vi.hoisted(() => ({
  liveFetch: vi.fn(),
  draftModeEnabled: false,
}));

// `src/sanity/lib/live.ts` appelle `defineLive` au chargement du module, ce
// qui exige un vrai token et une vraie configuration de projet : on le
// remplace par la fonction espionne dont on veut lire les arguments.
vi.mock('@/sanity/lib/live', () => ({
  sanityFetch: mocks.liveFetch,
  SanityLive: () => null,
}));

vi.mock('next/headers', () => ({
  draftMode: async () => ({isEnabled: mocks.draftModeEnabled}),
}));

const {DOCUMENT_TYPES, fetchContent} = await import('@/sanity/lib/fetch');

/** Les options réellement transmises à la couche `next-sanity`. */
const optionsPassedToLiveFetch = () => mocks.liveFetch.mock.calls.at(-1)?.[0];

const QUERY = '*[_type == "project"]';

beforeEach(() => {
  mocks.liveFetch.mockReset();
  mocks.liveFetch.mockResolvedValue({data: null, sourceMap: null, tags: []});
  mocks.draftModeEnabled = false;
});

describe('fetchContent — étiquette de revalidation', () => {
  /**
   * `sanityFetch` n'enregistre par lui-même que les `syncTags` du Content
   * Lake (des jetons opaques, jamais le `_type`). Sans l'étiquette explicite
   * posée ici, le `revalidateTag(body._type)` du webhook ne mordrait sur
   * rien et une publication dans le Studio ne rejoindrait jamais un
   * visiteur anonyme — les pages étant mises en cache avec
   * `revalidate: false`.
   */
  it('enregistre le type interrogé comme étiquette de cache', async () => {
    await fetchContent({query: QUERY, types: ['project']});

    expect(optionsPassedToLiveFetch()?.tags).toEqual(['project']);
  });

  it('enregistre chaque type quand une requête en lit plusieurs', async () => {
    await fetchContent({query: QUERY, types: ['post', 'translation.metadata']});

    expect(optionsPassedToLiveFetch()?.tags).toEqual(['post', 'translation.metadata']);
  });

  /**
   * L'étiquette doit être le `_type` brut, tel que Sanity l'envoie dans le
   * corps du webhook : toute transformation (préfixe, casse) obligerait à
   * maintenir la même transformation dans `src/app/api/revalidate/route.ts`,
   * et une divergence entre les deux ne se verrait qu'en production, sous
   * la forme d'un contenu qui ne se met plus à jour.
   */
  it('n’altère pas le nom du type — c’est celui que le webhook purge', async () => {
    await fetchContent({query: QUERY, types: ['settings']});

    expect(optionsPassedToLiveFetch()?.tags).toEqual(['settings']);
  });

  it('couvre exactement les types document du schéma et ceux gérés par un plugin', () => {
    const declared = schemaTypes
      .filter((type) => type.type === 'document')
      .map((type) => type.name);

    expect([...DOCUMENT_TYPES].sort()).toEqual([...declared, ...PLUGIN_MANAGED_TYPES].sort());
  });
});

describe('fetchContent — la perspective se dérive de draftMode(), jamais de l’appelant', () => {
  it('sert le contenu publié à un visiteur anonyme', async () => {
    await fetchContent({query: QUERY, types: ['project']});

    expect(optionsPassedToLiveFetch()).toMatchObject({perspective: 'published', stega: false});
  });

  /**
   * Le cœur du garde-fou : un point d'appel ne doit pas pouvoir demander la
   * perspective brouillon. Le type de `fetchContent` ne l'expose pas, mais
   * un `as` — ou du JavaScript non typé — contournerait le compilateur. La
   * garantie doit donc tenir à l'exécution : les options de l'appelant ne
   * sont jamais étalées vers `sanityFetch`, seules `query`, `params` et
   * `types` en sont extraites.
   */
  it('ignore une perspective brouillon réclamée par l’appelant', async () => {
    await fetchContent({
      query: QUERY,
      types: ['project'],
      perspective: 'drafts',
      stega: true,
    } as unknown as Parameters<typeof fetchContent>[0]);

    expect(optionsPassedToLiveFetch()).toMatchObject({perspective: 'published', stega: false});
  });

  it('sert les brouillons — et seulement alors — quand le mode brouillon est actif', async () => {
    mocks.draftModeEnabled = true;

    await fetchContent({query: QUERY, types: ['project']});

    expect(optionsPassedToLiveFetch()).toMatchObject({perspective: 'drafts', stega: true});
  });

  it('relit draftMode() à chaque appel plutôt qu’une fois au chargement du module', async () => {
    await fetchContent({query: QUERY, types: ['project']});
    expect(optionsPassedToLiveFetch()?.perspective).toBe('published');

    mocks.draftModeEnabled = true;
    await fetchContent({query: QUERY, types: ['project']});
    expect(optionsPassedToLiveFetch()?.perspective).toBe('drafts');
  });
});

describe('fetchContent — transmission de la requête', () => {
  it('transmet la requête et ses paramètres sans les retoucher', async () => {
    await fetchContent({query: QUERY, params: {language: 'fr'}, types: ['project']});

    expect(optionsPassedToLiveFetch()).toMatchObject({
      query: QUERY,
      params: {language: 'fr'},
    });
  });

  it('renvoie tel quel le résultat de la couche next-sanity', async () => {
    mocks.liveFetch.mockResolvedValue({data: [{_id: 'a'}], sourceMap: null, tags: ['project']});

    const result = await fetchContent({query: QUERY, types: ['project']});

    expect(result.data).toEqual([{_id: 'a'}]);
  });
});
