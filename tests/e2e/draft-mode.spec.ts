import {expect, test} from '@playwright/test';

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
