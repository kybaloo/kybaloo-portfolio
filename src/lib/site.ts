export const SITE = {
  name: 'Florentin Tchangai',
  role: 'Technology Architect',
  location: 'Lomé, Togo',
  github: 'https://github.com/kybaloo',
  linkedin: 'https://linkedin.com/in/kybaloo',
  twitter: 'https://x.com/kybaloo',
  email: 'tchangaiflorentin6@gmail.com',
} as const;

/** URL canonique. Vercel fournit VERCEL_PROJECT_PRODUCTION_URL en production. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '');
