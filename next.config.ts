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
