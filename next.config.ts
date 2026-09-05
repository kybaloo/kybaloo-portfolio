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

  async redirects() {
    return [...LEGACY_REDIRECTS];
  },

  async headers() {
    return [{source: '/:path*', headers: securityHeaders}];
  },
};

export default withNextIntl(nextConfig);
