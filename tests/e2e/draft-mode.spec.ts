import {expect, test} from '@playwright/test';

// `.env.local` n'est jamais commité (voir .gitignore) : il n'existe qu'en
// développement local. Les tests ci-dessous qui ont besoin du vrai secret
// pour dépasser le contrôle d'authentification sont sautés quand il est
// absent (typiquement en CI, où `SANITY_PREVIEW_SECRET` n'est pas
// encore provisionné) plutôt que d'échouer sur une variable manquante.
try {
  process.loadEnvFile('.env.local');
} catch {
  // Pas de .env.local : rien à charger.
}

const secret = process.env.SANITY_PREVIEW_SECRET;

// Cas d'attaque partagés entre `enable` et `disable` : les deux routes
// valident `slug` avec la même `resolveInternalRedirectPath`, donc la même
// liste de tentatives de redirection ouverte s'applique aux deux.
const OPEN_REDIRECT_ATTACKS = [
  {name: 'URL protocole-relative (//evil.com)', slug: '//evil.com'},
  {name: 'triple barre oblique (///evil.com)', slug: '///evil.com'},
  {
    name: 'barre oblique inverse (/\\evil.com), normalisée en // par le navigateur',
    slug: '/\\evil.com',
  },
  {name: 'URL absolue (https://evil.com)', slug: 'https://evil.com'},
  {name: 'schéma exotique (javascript:alert(1))', slug: 'javascript:alert(1)'},
  {
    name: 'segment point avant // (/.//evil.com)',
    slug: '/.//evil.com',
  },
  {
    name: 'segment point-point avant // (/..//evil.com)',
    slug: '/..//evil.com',
  },
  {
    name: 'segment point-point imbriqué avant // (/a/..//evil.com)',
    slug: '/a/..//evil.com',
  },
] as const;

// Représente ce qu'un attaquant enverrait tel quel sur le fil, sans passer
// par `URLSearchParams` (qui encoderait un niveau de plus) : un seul
// décodage côté serveur donne `//evil.com`.
const PERCENT_ENCODED_ATTACK_QUERY = 'slug=%2F%2Fevil.com';

test('la prévisualisation refuse une requête sans secret', async ({request}) => {
  const response = await request.get('/api/draft-mode/enable', {maxRedirects: 0});
  expect(response.status()).toBe(401);
});

test('la prévisualisation refuse un secret erroné', async ({request}) => {
  const response = await request.get('/api/draft-mode/enable?secret=faux&slug=/fr', {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(401);
});

test('le webhook de revalidation refuse une signature absente', async ({request}) => {
  const response = await request.post('/api/revalidate', {
    data: {_type: 'project'},
  });
  expect(response.status()).toBe(401);
});

test('un visiteur anonyme ne déclenche aucune requête vers l’API Sanity', async ({page}) => {
  // Preuve directe que `SanityLive` n'est plus monté hors mode brouillon :
  // s'il l'était, `client.live.events(...)` ouvrirait une connexion vers
  // l'API Sanity dès le montage, quel que soit `includeDrafts` (voir
  // node_modules/next-sanity/dist/SanityLive.js). Une page fraîchement
  // chargée, sans cookie de brouillon, ne doit donc jamais y toucher.
  const sanityRequests: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes('api.sanity.io')) {
      sanityRequests.push(req.url());
    }
  });

  await page.goto('/fr', {waitUntil: 'load'});
  // Si une connexion live s'établissait, elle le ferait dans la seconde qui
  // suit l'hydratation ; on laisse une marge avant de conclure à son absence.
  await page.waitForTimeout(1500);

  expect(sanityRequests).toEqual([]);
});

test.describe('validation du chemin de redirection — activation (bon secret)', () => {
  test.skip(!secret, '.env.local absent : SANITY_PREVIEW_SECRET indisponible pour ces tests (CI)');

  // Chaque cas simule une tentative de redirection ouverte : le secret est
  // correct (l'attaquant a obtenu un lien de prévisualisation légitime),
  // seul `slug` est hostile. Toutes doivent échouer avec 400, jamais avec
  // une redirection (307) vers un autre hôte.
  for (const {name, slug} of OPEN_REDIRECT_ATTACKS) {
    test(`rejette ${name}`, async ({request}) => {
      const response = await request.get(urlWithSlug(slug), {maxRedirects: 0});
      expect(response.status()).toBe(400);
    });
  }

  test('rejette séquence encodée en pourcentage (%2F%2Fevil.com)', async ({request}) => {
    const response = await request.get(
      `/api/draft-mode/enable?secret=${encodeURIComponent(secret!)}&${PERCENT_ENCODED_ATTACK_QUERY}`,
      {maxRedirects: 0},
    );
    expect(response.status()).toBe(400);
  });

  // Les chemins internes légitimes doivent continuer à fonctionner : une
  // validation trop stricte casserait la prévisualisation elle-même.
  const legitimateCases = [
    {slug: '/fr', expectedLocation: '/fr'},
    {slug: '/en', expectedLocation: '/en'},
    {slug: '/fr/travaux', expectedLocation: '/fr/travaux'},
    {slug: '/fr/travaux?q=test', expectedLocation: '/fr/travaux?q=test'},
  ];

  for (const {slug, expectedLocation} of legitimateCases) {
    test(`redirige vers le chemin interne légitime ${slug}`, async ({request, baseURL}) => {
      const response = await request.get(urlWithSlug(slug), {maxRedirects: 0});
      expect(response.status()).toBe(307);
      const location = response.headers()['location'];
      expect(location).toBe(expectedLocation);
      // La propriété qui compte n'est pas le texte de l'en-tête mais
      // l'origine vers laquelle un navigateur le résoudrait : c'est ce
      // contrôle qui aurait détecté une redirection ouverte même si le
      // texte brut ressemblait à un chemin interne.
      expect(new URL(location!, baseURL).origin).toBe(new URL(baseURL!).origin);
    });
  }

  function urlWithSlug(slug: string): string {
    const params = new URLSearchParams({secret: secret!, slug});
    return `/api/draft-mode/enable?${params.toString()}`;
  }
});

test.describe('validation du chemin de redirection — désactivation', () => {
  // `disable` n'exige pas de secret (voir le commentaire de la route) : ces
  // tests tournent donc sans condition, y compris en CI sans .env.local.
  for (const {name, slug} of OPEN_REDIRECT_ATTACKS) {
    test(`rejette ${name}`, async ({request}) => {
      const response = await request.get(
        `/api/draft-mode/disable?${new URLSearchParams({slug}).toString()}`,
        {maxRedirects: 0},
      );
      expect(response.status()).toBe(400);
    });
  }

  test('rejette séquence encodée en pourcentage (%2F%2Fevil.com)', async ({request}) => {
    const response = await request.get(`/api/draft-mode/disable?${PERCENT_ENCODED_ATTACK_QUERY}`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(400);
  });

  test('redirige vers le chemin interne légitime après désactivation', async ({
    request,
    baseURL,
  }) => {
    const response = await request.get('/api/draft-mode/disable?slug=/fr/travaux', {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(307);
    const location = response.headers()['location'];
    expect(location).toBe('/fr/travaux');
    expect(new URL(location!, baseURL).origin).toBe(new URL(baseURL!).origin);
  });
});

test.describe('cycle complet activation / désactivation (bon secret)', () => {
  test.skip(!secret, '.env.local absent : SANITY_PREVIEW_SECRET indisponible pour ces tests (CI)');

  test('active la connexion live puis la coupe à la désactivation, et retire le cookie', async ({
    page,
    context,
  }) => {
    const sanityRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('api.sanity.io')) {
        sanityRequests.push(req.url());
      }
    });

    // 1. Activer avec le bon secret : pose le cookie de brouillon dans le
    // contexte du navigateur (context.request partage son cookie jar avec
    // `page`, exactement comme un vrai clic sur le lien de prévisualisation).
    const enableParams = new URLSearchParams({secret: secret!, slug: '/fr'});
    const enableResponse = await context.request.get(
      `/api/draft-mode/enable?${enableParams.toString()}`,
      {maxRedirects: 0},
    );
    expect(enableResponse.status()).toBe(307);

    const cookiesAfterEnable = await context.cookies();
    const draftCookieAfterEnable = cookiesAfterEnable.find((c) => c.name === '__prerender_bypass');
    expect(draftCookieAfterEnable?.value).toBeTruthy();

    // 2. Visiter /fr avec ce cookie : la connexion live doit s'établir.
    await page.goto('/fr', {waitUntil: 'load'});
    await page.waitForTimeout(2000);
    expect(sanityRequests.length).toBeGreaterThan(0);

    // 3. Désactiver — sans secret, volontairement (voir la route).
    sanityRequests.length = 0;
    const disableResponse = await context.request.get('/api/draft-mode/disable?slug=/fr', {
      maxRedirects: 0,
    });
    expect(disableResponse.status()).toBe(307);

    const cookiesAfterDisable = await context.cookies();
    const draftCookieAfterDisable = cookiesAfterDisable.find(
      (c) => c.name === '__prerender_bypass',
    );
    expect(draftCookieAfterDisable).toBeUndefined();

    // 4. Revisiter /fr : plus de cookie, plus de connexion live — le
    // contenu redevient celui d'un visiteur anonyme (publié uniquement).
    await page.goto('/fr', {waitUntil: 'load'});
    await page.waitForTimeout(2000);
    expect(sanityRequests).toEqual([]);
  });
});
