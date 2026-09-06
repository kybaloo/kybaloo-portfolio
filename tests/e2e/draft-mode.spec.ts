import {expect, test} from '@playwright/test';

// `.env.local` n'est jamais commité (voir .gitignore) : il n'existe qu'en
// développement local. Les tests ci-dessous qui ont besoin du vrai secret
// pour dépasser le contrôle d'authentification sont sautés quand il est
// absent (typiquement en CI, où `SANITY_REVALIDATE_SECRET` n'est pas
// encore provisionné) plutôt que d'échouer sur une variable manquante.
try {
  process.loadEnvFile('.env.local');
} catch {
  // Pas de .env.local : rien à charger.
}

const secret = process.env.SANITY_REVALIDATE_SECRET;

test('la prévisualisation refuse une requête sans secret', async ({request}) => {
  const response = await request.get('/api/draft-mode/enable', {maxRedirects: 0});
  expect([401, 400]).toContain(response.status());
});

test('la prévisualisation refuse un secret erroné', async ({request}) => {
  const response = await request.get('/api/draft-mode/enable?secret=faux&slug=/fr', {
    maxRedirects: 0,
  });
  expect([401, 400]).toContain(response.status());
});

test('le webhook de revalidation refuse une signature absente', async ({request}) => {
  const response = await request.post('/api/revalidate', {
    data: {_type: 'project'},
  });
  expect(response.status()).toBe(401);
});

test.describe('validation du chemin de redirection (bon secret)', () => {
  test.skip(
    !secret,
    '.env.local absent : SANITY_REVALIDATE_SECRET indisponible pour ces tests (CI)',
  );

  // Chaque cas simule une tentative de redirection ouverte : le secret est
  // correct (l'attaquant a obtenu un lien de prévisualisation légitime),
  // seul `slug` est hostile. Toutes doivent échouer avec 400, jamais avec
  // une redirection (307) vers un autre hôte.
  const attackCases: Array<{name: string; buildUrl: () => string}> = [
    {
      name: 'URL protocole-relative (//evil.com)',
      buildUrl: () => urlWithSlug('//evil.com'),
    },
    {
      name: 'triple barre oblique (///evil.com)',
      buildUrl: () => urlWithSlug('///evil.com'),
    },
    {
      name: 'barre oblique inverse (/\\evil.com), normalisée en // par le navigateur',
      buildUrl: () => urlWithSlug('/\\evil.com'),
    },
    {
      // Représente ce qu'un attaquant enverrait tel quel sur le fil, sans
      // passer par URLSearchParams (qui encoderait un niveau de plus) :
      // un seul décodage côté serveur donne `//evil.com`.
      name: 'séquence encodée en pourcentage (%2F%2Fevil.com)',
      buildUrl: () =>
        `/api/draft-mode/enable?secret=${encodeURIComponent(secret!)}&slug=%2F%2Fevil.com`,
    },
    {
      name: 'URL absolue (https://evil.com)',
      buildUrl: () => urlWithSlug('https://evil.com'),
    },
    {
      name: 'schéma exotique (javascript:alert(1))',
      buildUrl: () => urlWithSlug('javascript:alert(1)'),
    },
  ];

  for (const {name, buildUrl} of attackCases) {
    test(`rejette ${name}`, async ({request}) => {
      const response = await request.get(buildUrl(), {maxRedirects: 0});
      expect(response.status()).toBe(400);
    });
  }

  // Les chemins internes légitimes doivent continuer à fonctionner : une
  // validation trop stricte casserait la prévisualisation elle-même.
  const legitimateCases = [
    {slug: '/fr', expectedLocation: '/fr'},
    {slug: '/en', expectedLocation: '/en'},
    {slug: '/fr/travaux', expectedLocation: '/fr/travaux'},
    {slug: '/fr/travaux?q=test', expectedLocation: '/fr/travaux?q=test'},
  ];

  for (const {slug, expectedLocation} of legitimateCases) {
    test(`redirige vers le chemin interne légitime ${slug}`, async ({request}) => {
      const response = await request.get(urlWithSlug(slug), {maxRedirects: 0});
      expect(response.status()).toBe(307);
      expect(response.headers()['location']).toBe(expectedLocation);
    });
  }

  function urlWithSlug(slug: string): string {
    const params = new URLSearchParams({secret: secret!, slug});
    return `/api/draft-mode/enable?${params.toString()}`;
  }
});
