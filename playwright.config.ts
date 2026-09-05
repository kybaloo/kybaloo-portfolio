import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    // Chrome headless n'a pas d'environnement de bureau dont déduire une
    // locale : sans ce réglage, il envoie systématiquement
    // "Accept-Language: en-US" (sur cette machine comme dans une CI Linux
    // sans locale configurée), ce qui fait échouer la négociation de
    // langue attendue par le premier test (racine -> /fr) indépendamment
    // de la plateforme. Fixer la locale du navigateur à fr-FR rend ce test
    // déterministe sans toucher au routage i18n lui-même.
    locale: 'fr-FR',
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  // Pas de serveur à démarrer si l'on teste une URL d'aperçu Vercel.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
