import {expect, test} from '@playwright/test';

test.describe('visiteur avec un navigateur en fr-FR', () => {
  test.use({locale: 'fr-FR'});

  test('la racine redirige vers /fr pour un navigateur francophone', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/fr$/);
  });
});

test.describe('visiteur avec un navigateur en en-US', () => {
  test.use({locale: 'en-US'});

  test('la racine redirige vers /en pour un navigateur anglophone', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en$/);
  });
});

test('les deux langues répondent et déclarent la bonne locale', async ({page}) => {
  await page.goto('/fr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('le changement de langue conserve la page courante', async ({page}) => {
  await page.goto('/fr');
  await page.getByRole('link', {name: 'en', exact: true}).click();
  await expect(page).toHaveURL(/\/en$/);
});

test('la bascule de thème ajoute la classe dark', async ({page}) => {
  await page.goto('/fr');
  await page.getByRole('button', {name: 'Changer de thème'}).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('le lien d’évitement mène au contenu principal', async ({page}) => {
  await page.goto('/fr');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', {name: 'Aller au contenu principal'});
  await expect(skip).toBeFocused();
  await expect(page.locator('#main')).toBeVisible();
});

test('les anciennes URLs redirigent de façon permanente', async ({request}) => {
  for (const [from, to] of [
    ['/about', '/fr/parcours'],
    ['/projects', '/fr/travaux'],
    ['/blog', '/fr/ecrits'],
    ['/resume', '/fr/parcours'],
  ] as const) {
    const res = await request.get(from, {maxRedirects: 0});
    expect(res.status(), `${from} doit être une redirection permanente`).toBe(308);
    expect(res.headers()['location']).toBe(to);
  }
});

test('/admin renvoie 410 Gone', async ({request}) => {
  const res = await request.get('/admin', {maxRedirects: 0});
  expect(res.status()).toBe(410);
});
