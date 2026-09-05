import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import {LEGACY_REDIRECTS} from './src/lib/redirects';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Le paquet `sanity` (et `@sanity/vision`) est un monolithe pensé pour un
  // bundle client unique : son export racine tire des hooks React (via
  // `swr`) même dans les chemins jamais exécutés côté serveur. Importé
  // depuis sanity.config.ts par un Server Component (studio/page.tsx),
  // Turbopack résout sinon ce paquet sous la condition `react-server`, où
  // `swr` n'expose plus l'export par défaut attendu — le build échoue avant
  // même d'atteindre le rendu. Le marquer externe fait résoudre ces paquets
  // en Node classique (condition `require`/`import`), qu'ils gèrent bien.
  serverExternalPackages: ['sanity', '@sanity/vision'],

  experimental: {
    // Sans src/app/layout.tsx (le groupe (site) sert de racine pour porter
    // <html lang> par locale), Next.js n'a pas de racine HTML à utiliser
    // pour les chemins qui échappent complètement au routage (notFound()
    // profond, ou aucune route ne correspond du tout) : il retombe sur une
    // coquille interne générique, sans lang ni style. Ce flag active
    // app/global-not-found.tsx comme racine dédiée à ce cas précis, sans
    // toucher au routage i18n ni au rendu statique de /fr et /en.
    globalNotFound: true,
  },

  async redirects() {
    return [...LEGACY_REDIRECTS];
  },

  async headers() {
    return [{source: '/:path*', headers: securityHeaders}];
  },
};

export default withNextIntl(nextConfig);
