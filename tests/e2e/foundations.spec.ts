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

// Ce test ne prouve PAS que le sélecteur de langue conserve la page
// courante : il ne visite que la racine « /fr », et « / » se traduit par
// « / » dans les deux langues — « conserver le chemin » et « toujours
// rentrer à l'accueil » y sont donc indiscernables. Il prouve seulement
// que le sélecteur mène bien vers la version anglaise, ce qui reste utile
// (un lien cassé ou pointant ailleurs serait détecté), mais c'est plus
// modeste que ce qu'annonçait l'ancien nom du test.
//
// Le renforcer réellement demande une page dont le slug diverge entre les
// langues (ex. /fr/parcours ↔ /en/about). Aucune n'existe encore — ces
// pages arrivent dans un plan ultérieur — et en attendant, un 404 ne rend
// pas l'en-tête ni le sélecteur de langue, donc il n'y a rien à cliquer.
// Quand une telle page existera, remplacer ce test par : visiter la page
// en français, cliquer le sélecteur, vérifier que l'URL anglaise obtenue
// est bien la page équivalente (pas la racine) — ce qui distinguera enfin
// « conserve la page » de « repart à l'accueil ».
test('le sélecteur de langue mène à la version anglaise', async ({page}) => {
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
    ['/blog/mon-article', '/fr/ecrits/mon-article'],
    ['/resume', '/fr/parcours'],
    ['/contact', '/fr/contact'],
  ] as const) {
    const res = await request.get(from, {maxRedirects: 0});
    expect(res.status(), `${from} doit être une redirection permanente`).toBe(308);
    expect(res.headers()['location']).toBe(to);
  }
});

test('/admin renvoie 410 Gone pour toutes les méthodes', async ({request}) => {
  for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const) {
    const res = await request.fetch('/admin', {method, maxRedirects: 0});
    expect(res.status(), `${method} /admin doit renvoyer 410`).toBe(410);
  }
});

test('une URL inconnue sous une locale valide affiche le 404 stylé du site', async ({page}) => {
  const response = await page.goto('/fr/page-inexistante');
  expect(response?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', {name: 'Page introuvable'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Accueil'})).toBeVisible();
});

test('une URL totalement inconnue, sans préfixe de langue, affiche aussi le 404 stylé', async ({
  page,
}) => {
  const response = await page.goto('/chemin-au-hasard');
  expect(response?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', {name: 'Page introuvable'})).toBeVisible();
});
