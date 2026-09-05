# Florentin Tchangai — Portfolio

Bilingual (French/English) portfolio for Florentin Tchangai, positioned as a
**Technology Architect / Technology Consultant** — someone who designs,
builds, and evolves digital systems, based in Lomé, Togo.

## Status

This branch delivers the foundations: a bilingual shell with routing,
design tokens, theming, redirects from the old site's URLs, and a CI
pipeline — no content management system yet, and only the home page is
built. The content pages (`/expertise`, `/work` (`/travaux`), `/about`
(`/parcours`), `/writing` (`/ecrits`), `/contact`) are defined in the
routing configuration but intentionally not implemented; they ship in a
later phase, backed by a headless CMS.

## Tech stack

- **Next.js 16** (App Router, Turbopack, React Server Components)
- **React 19**
- **TypeScript**, strict mode
- **Tailwind CSS v4**, CSS-first design tokens (semantic color roles only —
  no raw hex values or absolute colors in components)
- **next-intl** — localized routing (`/fr`, `/en`, with per-language slugs)
- **next-themes** — light/dark mode, toggled by class, not by system
  preference
- **Vitest** — unit tests
- **Playwright** — end-to-end tests
- **ESLint 9** (flat config) and **Prettier**
- Deployed on **Vercel**

## Local setup

Requires Node.js 24 (pinned in `.nvmrc`) and npm — this project does not use
pnpm or yarn.

```bash
git clone https://github.com/kybaloo/kybaloo-portfolio.git
cd kybaloo-portfolio
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — it redirects to `/fr`
or `/en` depending on the browser's language.

## Environment variables

See `.env.example`. The only variable in use is `NEXT_PUBLIC_SITE_URL`, the
canonical site URL used to build absolute URLs (metadata, sitemap,
`robots.txt`). It is optional: in its absence the app falls back to
Vercel's `VERCEL_PROJECT_PRODUCTION_URL` in production, then to
`http://localhost:3000`.

## Scripts

| Command                    | Purpose                                               |
| -------------------------- | ----------------------------------------------------- |
| `npm run dev`              | Start the dev server                                  |
| `npm run build`            | Production build                                      |
| `npm start`                | Serve the production build                            |
| `npm run lint`             | ESLint                                                |
| `npm run typecheck`        | `tsc --noEmit`                                        |
| `npm run format`           | Format the codebase with Prettier                     |
| `npm run format:check`     | Check formatting without writing (used in CI)         |
| `npm test`                 | Unit tests (Vitest)                                   |
| `npm run test:watch`       | Unit tests, watch mode                                |
| `npm run test:e2e`         | End-to-end tests (Playwright)                         |
| `npm run validate:archive` | Verify the archived content in `docs/content-archive` |

## Project layout

```
src/
  app/
    (site)/[locale]/   Routes for the bilingual site (layout, home, 404)
    admin/              Legacy admin path — returns 410 Gone
    robots.ts           robots.txt
    sitemap.ts          sitemap.xml
  components/
    layout/              Header, footer, skip link, theme toggle, language switch
  i18n/                  next-intl routing, navigation, request config
  lib/                   Site metadata, legacy redirects
  styles/globals.css     Tailwind v4 tokens (light/dark color roles)
messages/
  fr.json, en.json        Translated strings — kept in sync, same keys in both files
docs/
  content-archive/         Content extracted from the pre-refonte site; source
                            data for the upcoming content phase
  superpowers/              Planning specs and implementation plans for this rebuild
tests/
  unit/                    Vitest
  e2e/                     Playwright
```

## License

Apache License 2.0 — see `LICENSE`.
