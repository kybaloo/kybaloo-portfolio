import {expect, test} from '@playwright/test';

test('le Studio répond et se charge', async ({page}) => {
  const response = await page.goto('/studio');
  expect(response?.status()).toBe(200);
  // Le Studio est une application cliente : on attend son conteneur racine.
  // `#sanity` (avec `data-ui="NextStudioLayout"`) est le conteneur réel
  // observé dans le DOM une fois le Studio monté, constaté par inspection
  // directe (Playwright, page.evaluate) d'un serveur de production lancé
  // localement — pas une supposition reprise du brief.
  await expect(page.locator('#sanity')).toBeAttached({timeout: 30_000});
});

test('le Studio est en noindex', async ({request}) => {
  const response = await request.get('/studio');
  const robots = response.headers()['x-robots-tag'] ?? '';
  const html = await response.text();
  expect(robots.includes('noindex') || /name="robots"[^>]*noindex/.test(html)).toBe(true);
});

test('le Studio ne porte pas la mise en page du site', async ({page}) => {
  await page.goto('/studio');
  // L'en-tête du site ne doit pas apparaître : le Studio a sa propre racine.
  await expect(page.getByRole('link', {name: 'Florentin Tchangai'})).toHaveCount(0);
});
