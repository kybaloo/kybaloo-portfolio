# Plan 1 — Fondations

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produire une coquille bilingue déployable sur Vercel — Next 16, tokens Tailwind v4, routage `/fr` `/en` avec slugs localisés, thème clair/sombre, redirections des anciennes URLs, tests et CI — sans aucun contenu Sanity.

**Architecture:** Table rase du `src/` existant après archivage du contenu réutilisable. Rendu serveur intégral (RSC), aucun état client hors thème et menu mobile. Le routage i18n passe par `src/proxy.ts` (nouveau nom du middleware en Next 16). Les couleurs sont des rôles sémantiques déclarés une fois dans `@theme`, redéfinis sous `.dark`.

**Tech Stack:** Next 16.3.4 · React 19.2 · TypeScript strict · Tailwind v4 (CSS-first) · next-intl 4.14 · next-themes 0.4.6 · Vitest 3 · Playwright · ESLint 9 flat · Prettier

**Spec:** `docs/superpowers/specs/2026-09-05-portfolio-refonte-design.md`

## Global Constraints

Ces contraintes s'appliquent à **toutes** les tâches de ce plan.

- **Next `16.3.4` minimum** — imposé par `next-sanity@13` (`peerDependencies.next: "^16.0.0-0"`), utilisé au plan 2.
- **React `19.2.3` minimum** — imposé par `next-sanity@13` et `sanity@6`.
- **`middleware.ts` n'existe plus.** Le fichier s'appelle `src/proxy.ts`, l'export est `default`. Le runtime edge n'y est pas supporté ; ne jamais écrire `export const runtime = 'edge'`.
- **Aucune bibliothèque d'animation.** `framer-motion`, `motion`, `animejs`, `gsap` sont interdits. CSS et View Transitions natives uniquement.
- **Aucune valeur hexadécimale de couleur dans un composant.** Uniquement des utilitaires Tailwind adossés aux rôles sémantiques.
- **Aucune dépendance non importée** dans `package.json` (critère d'acceptation 10 de la spec).
- **Palette, valeurs exactes :**
  - clair — `--color-paper: #F6F7F4` · `--color-ink: #111512` · `--color-accent: #1F5140` · `--color-highlight: #D9A441` · `--color-highlight-ink: #111512`
  - sombre — `--color-paper: #0F1211` · `--color-ink: #E7EAE6` · `--color-accent: #6CC3A2` · `--color-highlight: #D9A441` · `--color-highlight-ink: #0F1211`
- **Règle de l'or `#D9A441` :** jamais en couleur de texte sur fond clair (contraste 2,1:1). Fond ou aplat uniquement en mode clair ; texte autorisé en mode sombre seulement.
- **Polices :** Newsreader (titres) · Inter (texte) · JetBrains Mono (méta), via `next/font/google` exclusivement.
- **Interdits visuels :** dégradés, halos flous décoratifs, barres de progression en pourcentage, apparitions au défilement, grands rayons de bordure, ombres portées diffuses.
- **Locales :** `fr` (défaut) et `en`. `localePrefix: 'always'`.

---

## Structure des fichiers

| Fichier | Responsabilité |
|---|---|
| `docs/content-archive/*.json` | Contenu extrait de l'ancien site, source du plan 2 |
| `scripts/validate-archive.mjs` | Vérifie que l'archive est complète et bien formée |
| `package.json` | Dépendances — repartir de zéro |
| `tsconfig.json` | TypeScript strict + `noUncheckedIndexedAccess` |
| `eslint.config.mjs` | ESLint 9 flat, `eslint-config-next` 16, a11y |
| `.prettierrc.mjs` · `.lintstagedrc.mjs` · `.husky/pre-commit` | Formatage automatique |
| `vitest.config.ts` | Tests unitaires |
| `playwright.config.ts` | Tests de parcours |
| `postcss.config.mjs` | `@tailwindcss/postcss` |
| `src/styles/globals.css` | **Unique** source des tokens et des rôles de couleur |
| `src/lib/fonts.ts` | Les trois polices, et rien d'autre |
| `src/i18n/routing.ts` | Locales, préfixe, slugs localisés |
| `src/i18n/request.ts` | Chargement des messages par requête |
| `src/i18n/navigation.ts` | `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` localisés |
| `src/proxy.ts` | Routage i18n (ex-`middleware.ts`) |
| `messages/fr.json` · `messages/en.json` | Traductions d'interface |
| `next.config.ts` | Plugin next-intl, redirections 301, en-têtes de sécurité |
| `src/app/(site)/[locale]/layout.tsx` | **Racine HTML du site** — providers, header, footer |
| `src/app/(site)/[locale]/page.tsx` | Accueil provisoire |
| `src/components/layout/site-header.tsx` | Navigation, sélecteur de langue, bascule de thème |
| `src/components/layout/site-footer.tsx` | Pied de page |
| `src/components/layout/language-switch.tsx` | Bascule FR/EN conservant la page courante |
| `src/components/layout/theme-toggle.tsx` | Bascule clair/sombre |
| `src/components/layout/skip-link.tsx` | Lien d'évitement |
| `src/app/robots.ts` · `src/app/sitemap.ts` | Indexation |
| `tests/unit/*.test.ts` | Vitest |
| `tests/e2e/*.spec.ts` | Playwright |
| `.github/workflows/ci.yml` | Intégration continue |

**Pourquoi le groupe de routes `(site)`.** Le Studio Sanity vivra sur `/studio`, hors du segment `[locale]`. Next impose que la racine porte `<html>` et `<body>` ; deux racines distinctes exigent des groupes de routes et **aucun** `src/app/layout.tsx`. On pose la structure dès maintenant pour que le plan 2 s'y insère sans réorganisation.

---

### Task 1 : Archiver le contenu avant toute destruction

Rien n'est supprimé dans cette tâche. Elle produit la source de données du plan 2.

**Files:**
- Create: `docs/content-archive/projects.json`, `blog.json`, `services.json`, `skills.json`, `experiences.json`, `profile.json`
- Create: `scripts/validate-archive.mjs`

**Interfaces:**
- Consumes: rien
- Produces: `docs/content-archive/*.json` — consommé par le plan 2 (import Sanity). Formes garanties : `projects[]` (10 entrées, champ `id` unique), `blog[]` (5), `services[]` (4), `skills[]` (catégories avec `items[]`), `experiences[]` (2), `profile{fr,en}`.

- [ ] **Step 1 : Copier les quatre JSON existants tels quels**

```bash
mkdir -p docs/content-archive
cp src/data/projects.json docs/content-archive/projects.json
cp src/data/blog.json     docs/content-archive/blog.json
cp src/data/services.json docs/content-archive/services.json
cp src/data/skills.json   docs/content-archive/skills.json
```

- [ ] **Step 2 : Extraire les expériences codées en dur**

Lire `src/components/Experience.tsx`. Le tableau `const experiences: Experience[] = [...]` contient 2 entrées (`ecobank`, `freelance`). Transcrire ce tableau **à l'identique** dans `docs/content-archive/experiences.json` — un tableau JSON racine, aucune modification de valeur.

Champs attendus par entrée : `id`, `company`, `position`, `duration`, `location`, `description`, `achievements[]`, `technologies[]`.

- [ ] **Step 3 : Extraire les textes de profil**

Lire `src/context/LanguageContext.tsx`. Y figurent `enTranslations` et `frTranslations`. Extraire uniquement les sections utiles au profil vers `docs/content-archive/profile.json` :

```json
{
  "fr": { "hero": { }, "about": { } },
  "en": { "hero": { }, "about": { } }
}
```

Copier les objets `hero` et `about` de chaque langue sans les reformuler. Ces textes portent encore le positionnement « développeur » ; leur réécriture appartient au plan 3, pas ici.

- [ ] **Step 4 : Écrire le script de validation**

```js
// scripts/validate-archive.mjs
import {readFileSync} from 'node:fs';

const read = (name) =>
  JSON.parse(readFileSync(new URL(`../docs/content-archive/${name}.json`, import.meta.url), 'utf8'));

const checks = [
  ['projects', () => { const d = read('projects');
    if (!Array.isArray(d) || d.length !== 10) throw new Error(`10 projets attendus, ${d.length} trouvés`);
    const ids = new Set(d.map((p) => p.id));
    if (ids.size !== 10) throw new Error('identifiants de projet en double');
    if (d.filter((p) => p.featured).length !== 4) throw new Error('4 projets "featured" attendus');
    return `${d.length} projets`; }],
  ['blog', () => { const d = read('blog');
    if (d.length !== 5) throw new Error(`5 articles attendus, ${d.length}`);
    return `${d.length} articles`; }],
  ['services', () => { const d = read('services');
    if (d.length !== 4) throw new Error(`4 services attendus, ${d.length}`);
    return `${d.length} services`; }],
  ['skills', () => { const d = read('skills');
    if (!d.every((c) => Array.isArray(c.items))) throw new Error('catégorie sans items[]');
    return `${d.length} catégories, ${d.reduce((n, c) => n + c.items.length, 0)} compétences`; }],
  ['experiences', () => { const d = read('experiences');
    if (d.length !== 2) throw new Error(`2 expériences attendues, ${d.length}`);
    if (!d.every((e) => Array.isArray(e.achievements) && e.achievements.length))
      throw new Error('expérience sans achievements[]');
    return `${d.length} expériences`; }],
  ['profile', () => { const d = read('profile');
    for (const l of ['fr', 'en']) {
      if (!d[l]?.hero || !d[l]?.about) throw new Error(`profile.${l}.hero ou .about manquant`);
    }
    return 'fr + en'; }],
];

let failed = 0;
for (const [name, run] of checks) {
  try { console.log(`  ok   ${name.padEnd(12)} ${run()}`); }
  catch (e) { failed++; console.error(`  FAIL ${name.padEnd(12)} ${e.message}`); }
}
console.log(failed ? `\n${failed} vérification(s) en échec` : '\nArchive complète.');
process.exit(failed ? 1 : 0);
```

- [ ] **Step 5 : Lancer la validation**

Run: `node scripts/validate-archive.mjs`
Expected: six lignes `ok`, puis `Archive complète.`, code de sortie 0.

Si une ligne échoue, corriger le fichier d'archive correspondant — **ne pas** assouplir le script.

- [ ] **Step 6 : Commit**

```bash
git add docs/content-archive scripts/validate-archive.mjs
git commit -m "chore: Archive existing content before the rebuild

Extracts the four data JSON files, the hardcoded experiences array from
Experience.tsx, and the FR/EN profile copy from LanguageContext.tsx into
docs/content-archive/. This is the input for the Sanity import in plan 2,
so nothing is lost when src/ is torn down in the next task.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2 : Table rase — dépendances et fichiers morts

**Files:**
- Modify: `package.json` (réécriture complète)
- Delete: `src/app/admin/`, `src/app/api/`, `src/data/`, `src/context/`, `src/components/`, `src/types/`, `src/app/about/`, `src/app/blog/`, `src/app/contact/`, `src/app/projects/`, `src/app/resume/`, `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `tailwind.config.js`, `netlify.toml`, `windsurf_deployment.yaml`
- Create: `src/app/(site)/[locale]/layout.tsx` (provisoire), `src/app/(site)/[locale]/page.tsx` (provisoire), `src/styles/globals.css` (provisoire)

**Interfaces:**
- Consumes: `docs/content-archive/*.json` de la tâche 1 doit être commité **avant** toute suppression
- Produces: un `package.json` sans dépendance morte ; l'arborescence `src/app/(site)/[locale]/`

- [ ] **Step 1 : Vérifier que l'archive est bien commitée**

```bash
git log --oneline -1 -- docs/content-archive
node scripts/validate-archive.mjs
```

Expected: un commit existe, et la validation sort en 0. **Ne pas continuer sinon** — l'étape suivante détruit les sources.

- [ ] **Step 2 : Supprimer les fichiers morts**

```bash
git rm -r --quiet src/app src/components src/context src/data src/types
git rm --quiet tailwind.config.js netlify.toml windsurf_deployment.yaml
mkdir -p "src/app/(site)/[locale]" src/styles
```

`public/`, `LICENSE`, `README.md`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json` sont conservés (les trois derniers sont réécrits plus loin).

- [ ] **Step 3 : Réécrire `package.json`**

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "validate:archive": "node scripts/validate-archive.mjs",
    "prepare": "husky"
  },
  "dependencies": {
    "next": "16.3.4",
    "next-intl": "^4.14.2",
    "next-themes": "^0.4.6",
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@playwright/test": "^1.50.0",
    "@tailwindcss/postcss": "^4.3.3",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.4",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "husky": "^9.1.7",
    "lint-staged": "^15.5.0",
    "prettier": "^3.4.2",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "tailwindcss": "^4.3.3",
    "typescript": "^5",
    "vitest": "^3.0.0"
  }
}
```

Note : ni `clsx`, ni `tailwind-merge`, ni `class-variance-authority`, ni `lucide-react` ici. Ils reviendront avec shadcn au plan 3, quand un composant les utilisera réellement.

- [ ] **Step 4 : Réinstaller depuis zéro**

```bash
rm -rf node_modules package-lock.json
npm install
```

- [ ] **Step 5 : Poser les trois fichiers provisoires**

```css
/* src/styles/globals.css — remplacé intégralement à la tâche 4 */
@import "tailwindcss";
```

```tsx
// src/app/(site)/[locale]/layout.tsx — remplacé à la tâche 6
import "@/styles/globals.css";

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// src/app/(site)/[locale]/page.tsx — remplacé à la tâche 6
export default function Page() {
  return <main>Fondations</main>;
}
```

- [ ] **Step 6 : Vérifier que le projet construit**

Run: `npm run build`
Expected: build réussi. Un avertissement sur l'absence de `generateStaticParams` pour `[locale]` est normal à ce stade — il disparaît à la tâche 5.

- [ ] **Step 7 : Commit**

```bash
git add -A
git commit -m "chore!: Tear down the old app and reset dependencies

Removes the admin page that shipped a plaintext password to the client,
the unauthenticated write API routes, the hand-rolled theme and language
contexts, the duplicate Navbar, the v3 Tailwind config, and the Netlify
and Windsurf leftovers.

package.json drops from 60 dependencies to 5 runtime ones. Content was
archived to docs/content-archive/ in the previous commit.

BREAKING CHANGE: every page is gone until plan 3 rebuilds them.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3 : Outillage — TypeScript strict, ESLint, Prettier, Vitest

**Files:**
- Modify: `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
- Create: `.prettierrc.mjs`, `.prettierignore`, `.lintstagedrc.mjs`, `.husky/pre-commit`, `vitest.config.ts`, `tests/unit/setup.test.ts`

**Interfaces:**
- Consumes: `package.json` de la tâche 2
- Produces: `npm run lint`, `npm run typecheck`, `npm test` — utilisés par la CI en tâche 9

- [ ] **Step 1 : Écrire le test qui échoue**

```ts
// tests/unit/setup.test.ts
import {describe, expect, it} from 'vitest';
import tsconfig from '../../tsconfig.json';

describe('configuration du projet', () => {
  it('active le mode strict de TypeScript', () => {
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  it('interdit les accès indexés non vérifiés', () => {
    expect(tsconfig.compilerOptions.noUncheckedIndexedAccess).toBe(true);
  });

  it("n'autorise pas le JavaScript", () => {
    expect(tsconfig.compilerOptions.allowJs).toBe(false);
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

Run: `npx vitest run tests/unit/setup.test.ts`
Expected: ÉCHEC — `vitest.config.ts` est absent, ou les assertions `noUncheckedIndexedAccess` et `allowJs` échouent contre le `tsconfig.json` actuel.

- [ ] **Step 3 : Écrire `vitest.config.ts`**

```ts
import {defineConfig} from 'vitest/config';
import {fileURLToPath} from 'node:url';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
  resolve: {
    alias: {'@': fileURLToPath(new URL('./src', import.meta.url))},
  },
});
```

- [ ] **Step 4 : Réécrire `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./src/*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5 : Relancer le test**

Run: `npx vitest run tests/unit/setup.test.ts`
Expected: 3 tests PASS.

- [ ] **Step 6 : Écrire les configurations de lint et de format**

```js
// eslint.config.mjs
import {FlatCompat} from '@eslint/eslintrc';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const compat = new FlatCompat({baseDirectory: import.meta.dirname});

export default [
  {ignores: ['.next/**', 'node_modules/**', 'playwright-report/**', 'test-results/**']},
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {'jsx-a11y': jsxA11y},
    rules: {
      ...jsxA11y.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    },
  },
];
```

```js
// .prettierrc.mjs
export default {
  printWidth: 100,
  singleQuote: true,
  bracketSpacing: false,
  trailingComma: 'all',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/globals.css',
};
```

```
# .prettierignore
.next
node_modules
playwright-report
test-results
public
docs/content-archive
```

```js
// .lintstagedrc.mjs
export default {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,css,md,mjs}': ['prettier --write'],
};
```

```sh
# .husky/pre-commit
npx lint-staged
```

```js
// postcss.config.mjs
export default {plugins: {'@tailwindcss/postcss': {}}};
```

- [ ] **Step 7 : Activer husky et vérifier la chaîne complète**

```bash
npx husky init
printf 'npx lint-staged\n' > .husky/pre-commit
npm run lint && npm run typecheck && npm test
```

Expected: les trois commandes sortent en 0.

- [ ] **Step 8 : Commit**

```bash
git add -A
git commit -m "build: Add strict TypeScript, ESLint, Prettier and Vitest

Enables noUncheckedIndexedAccess and disallows JavaScript, so the Sanity
types generated in plan 2 cannot silently degrade to any. Wires Prettier
with the Tailwind plugin through lint-staged on commit.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4 : Design tokens et polices

**Files:**
- Create: `src/lib/fonts.ts`, `tests/unit/tokens.test.ts`
- Modify: `src/styles/globals.css` (réécriture complète)

**Interfaces:**
- Consumes: `postcss.config.mjs` et Vitest de la tâche 3
- Produces:
  - `src/lib/fonts.ts` exporte `fontVariables: string` — la chaîne de classes CSS à poser sur `<html>` (tâche 6)
  - `src/styles/globals.css` fournit les utilitaires `bg-paper`, `text-ink`, `text-accent`, `bg-highlight`, `text-highlight-ink`, `border-line`, `text-muted`, et les familles `font-serif`, `font-sans`, `font-mono`

- [ ] **Step 1 : Écrire le test qui échoue**

Ce test verrouille les valeurs exactes de la spec et la règle de l'or. Il lit le CSS comme du texte — pas besoin de navigateur.

```ts
// tests/unit/tokens.test.ts
import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const css = readFileSync(new URL('../../src/styles/globals.css', import.meta.url), 'utf8');

/** Extrait la valeur d'une variable dans le premier bloc portant ce sélecteur. */
function tokenIn(selector: string, name: string): string | undefined {
  const block = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return block?.[1]?.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
}

describe('tokens de couleur', () => {
  it('déclare la palette claire dans @theme', () => {
    expect(tokenIn('@theme', 'color-paper')).toBe('#F6F7F4');
    expect(tokenIn('@theme', 'color-ink')).toBe('#111512');
    expect(tokenIn('@theme', 'color-accent')).toBe('#1F5140');
    expect(tokenIn('@theme', 'color-highlight')).toBe('#D9A441');
    expect(tokenIn('@theme', 'color-highlight-ink')).toBe('#111512');
  });

  it('redéfinit la palette sombre sous .dark', () => {
    expect(tokenIn('\\.dark', 'color-paper')).toBe('#0F1211');
    expect(tokenIn('\\.dark', 'color-ink')).toBe('#E7EAE6');
    expect(tokenIn('\\.dark', 'color-accent')).toBe('#6CC3A2');
    expect(tokenIn('\\.dark', 'color-highlight-ink')).toBe('#0F1211');
  });

  it('active le mode sombre par classe et non par préférence système', () => {
    expect(css).toMatch(/@custom-variant\s+dark/);
  });
});

describe('interdits de la spec', () => {
  it("n'utilise aucun dégradé", () => {
    expect(css).not.toMatch(/linear-gradient|radial-gradient/);
  });

  it('ne déclare aucun rayon supérieur à 8px', () => {
    const radii = [...css.matchAll(/--radius-[a-z]+:\s*(\d+)px/g)].map((m) => Number(m[1]));
    expect(radii.length).toBeGreaterThan(0);
    expect(Math.max(...radii)).toBeLessThanOrEqual(8);
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

Run: `npx vitest run tests/unit/tokens.test.ts`
Expected: ÉCHEC — `globals.css` ne contient encore que `@import "tailwindcss";`.

- [ ] **Step 3 : Écrire `src/styles/globals.css`**

```css
@import "tailwindcss";

/* Mode sombre piloté par la classe posée par next-themes, pas par la
   préférence système : l'utilisateur doit pouvoir choisir. */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* ---- Familles ---- */
  --font-serif: var(--font-newsreader), Georgia, serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;

  /* ---- Échelle typographique, ratio 1.25 ancré sur 16px ---- */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.563rem;
  --text-2xl: 1.953rem;
  --text-3xl: 2.441rem;
  --text-4xl: 3.052rem;
  --text-5xl: 3.815rem;

  /* ---- Espacement : uniquement des multiples de 4px ---- */
  --spacing: 0.25rem;

  /* ---- Rayons discrets : une direction éditoriale n'a pas de gros arrondis ---- */
  --radius-sm: 3px;
  --radius-md: 5px;
  --radius-lg: 8px;

  /* ---- Rôles de couleur, mode clair ----
     Aucun composant n'écrit d'hexadécimal : tout passe par ces rôles. */
  --color-paper: #F6F7F4;
  --color-ink: #111512;
  --color-muted: #828A84;
  --color-line: #E3E6E1;
  --color-accent: #1F5140;
  --color-highlight: #D9A441;
  --color-highlight-ink: #111512;
}

/* ---- Mêmes rôles, valeurs sombres ---- */
.dark {
  --color-paper: #0F1211;
  --color-ink: #E7EAE6;
  --color-muted: #767E79;
  --color-line: #1F2422;
  --color-accent: #6CC3A2;
  --color-highlight: #D9A441;
  --color-highlight-ink: #0F1211;
}

@layer base {
  html {
    scroll-behavior: smooth;
    color-scheme: light;
  }

  .dark html,
  html.dark {
    color-scheme: dark;
  }

  body {
    background-color: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  /* Focus visible sur tout élément interactif — exigence d'accessibilité. */
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* Aucune animation n'est déclarée dans ce projet, mais une transition de
     thème reste possible : la couper pour qui la refuse. */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

- [ ] **Step 4 : Relancer le test**

Run: `npx vitest run tests/unit/tokens.test.ts`
Expected: 5 tests PASS.

- [ ] **Step 5 : Écrire `src/lib/fonts.ts`**

```ts
import {Inter, JetBrains_Mono, Newsreader} from 'next/font/google';

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

/** Classes à poser sur <html> pour exposer les trois familles en CSS. */
export const fontVariables = `${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable}`;
```

- [ ] **Step 6 : Vérifier la compilation**

Run: `npm run build && npm run typecheck`
Expected: les deux sortent en 0.

- [ ] **Step 7 : Commit**

```bash
git add -A
git commit -m "feat: Add the design tokens and the three fonts

Colour is expressed as semantic roles (paper, ink, muted, line, accent,
highlight) declared once in @theme and redefined under .dark, so no
component ever writes a hex value. A unit test locks the exact values from
the spec and fails the build on gradients or radii above 8px.

Dark mode is class-driven via @custom-variant, not prefers-color-scheme,
so the visitor's choice wins.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5 : Routage i18n

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/proxy.ts`, `messages/fr.json`, `messages/en.json`, `tests/unit/routing.test.ts`
- Modify: `next.config.ts` (créé ici, remplace `next.config.mjs`)
- Delete: `next.config.mjs`

**Interfaces:**
- Consumes: rien des tâches précédentes
- Produces:
  - `routing` (`src/i18n/routing.ts`) — objet `defineRouting`, `locales: ['fr','en']`, `defaultLocale: 'fr'`, `localePrefix: 'always'`
  - `src/i18n/navigation.ts` exporte `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` — **tout composant qui navigue doit importer `Link` d'ici, jamais de `next/link`**
  - Clés de messages disponibles : `nav.*`, `theme.*`, `language.*`, `footer.*`, `a11y.*`

- [ ] **Step 1 : Écrire le test qui échoue**

```ts
// tests/unit/routing.test.ts
import {describe, expect, it} from 'vitest';
import {routing} from '@/i18n/routing';
import fr from '../../messages/fr.json';
import en from '../../messages/en.json';

describe('routage i18n', () => {
  it('sert le français par défaut et toujours avec préfixe', () => {
    expect(routing.locales).toEqual(['fr', 'en']);
    expect(routing.defaultLocale).toBe('fr');
    expect(routing.localePrefix).toBe('always');
  });

  it('localise les slugs des pages de contenu', () => {
    const p = routing.pathnames as Record<string, unknown>;
    expect(p['/work']).toEqual({fr: '/travaux', en: '/work'});
    expect(p['/work/[slug]']).toEqual({fr: '/travaux/[slug]', en: '/work/[slug]'});
    expect(p['/about']).toEqual({fr: '/parcours', en: '/about'});
    expect(p['/writing']).toEqual({fr: '/ecrits', en: '/writing'});
    expect(p['/writing/[slug]']).toEqual({fr: '/ecrits/[slug]', en: '/writing/[slug]'});
  });

  it('partage le même slug quand il fonctionne dans les deux langues', () => {
    const p = routing.pathnames as Record<string, unknown>;
    expect(p['/']).toBe('/');
    expect(p['/expertise']).toBe('/expertise');
    expect(p['/contact']).toBe('/contact');
  });
});

describe('messages', () => {
  /** Aplatit un objet imbriqué en paires [chemin pointé, valeur]. */
  function entries(value: unknown, prefix = ''): Array<[string, string]> {
    if (typeof value !== 'object' || value === null) return [[prefix, String(value)]];
    return Object.entries(value).flatMap(([k, v]) =>
      entries(v, prefix ? `${prefix}.${k}` : k),
    );
  }

  it('expose exactement les mêmes clés en français et en anglais', () => {
    const keys = (o: unknown) => entries(o).map(([k]) => k).sort();
    expect(keys(fr)).toEqual(keys(en));
  });

  it('ne laisse aucune valeur vide dans les deux langues', () => {
    for (const messages of [fr, en]) {
      expect(entries(messages).filter(([, v]) => v.trim() === '')).toEqual([]);
    }
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

Run: `npx vitest run tests/unit/routing.test.ts`
Expected: ÉCHEC — `Cannot find module '@/i18n/routing'`.

- [ ] **Step 3 : Écrire la configuration de routage**

```ts
// src/i18n/routing.ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',

  // Clé = chemin interne (toujours en anglais, c'est le nom du dossier).
  // Valeur = chemin public, localisé quand les deux langues divergent.
  pathnames: {
    '/': '/',
    '/expertise': '/expertise',
    '/contact': '/contact',
    '/work': {fr: '/travaux', en: '/work'},
    '/work/[slug]': {fr: '/travaux/[slug]', en: '/work/[slug]'},
    '/about': {fr: '/parcours', en: '/about'},
    '/writing': {fr: '/ecrits', en: '/writing'},
    '/writing/[slug]': {fr: '/ecrits/[slug]', en: '/writing/[slug]'},
  },
});

export type Locale = (typeof routing.locales)[number];
```

```ts
// src/i18n/request.ts
import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

```ts
// src/i18n/navigation.ts
import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// Tout composant qui navigue importe Link d'ici, jamais de next/link :
// c'est ce qui applique les slugs localisés.
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
```

- [ ] **Step 4 : Écrire `src/proxy.ts`**

Next 16 a renommé `middleware.ts` en `proxy.ts`. Ne pas créer de `middleware.ts`.

```ts
// src/proxy.ts
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Tout sauf /api, /studio, les internes Next/Vercel et les fichiers
  // (tout chemin contenant un point).
  matcher: '/((?!api|studio|_next|_vercel|.*\\..*).*)',
};
```

- [ ] **Step 5 : Écrire les messages**

```json
// messages/fr.json
{
  "nav": {
    "home": "Accueil",
    "expertise": "Expertise",
    "work": "Travaux",
    "about": "Parcours",
    "writing": "Écrits",
    "contact": "Contact"
  },
  "theme": {
    "toggle": "Changer de thème",
    "light": "Clair",
    "dark": "Sombre"
  },
  "language": {
    "label": "Changer de langue",
    "fr": "Français",
    "en": "Anglais"
  },
  "footer": {
    "rights": "Tous droits réservés.",
    "builtWith": "Conçu et développé à Lomé."
  },
  "a11y": {
    "skipToContent": "Aller au contenu principal",
    "openMenu": "Ouvrir le menu",
    "closeMenu": "Fermer le menu"
  }
}
```

```json
// messages/en.json
{
  "nav": {
    "home": "Home",
    "expertise": "Expertise",
    "work": "Work",
    "about": "About",
    "writing": "Writing",
    "contact": "Contact"
  },
  "theme": {
    "toggle": "Toggle theme",
    "light": "Light",
    "dark": "Dark"
  },
  "language": {
    "label": "Change language",
    "fr": "French",
    "en": "English"
  },
  "footer": {
    "rights": "All rights reserved.",
    "builtWith": "Designed and built in Lomé."
  },
  "a11y": {
    "skipToContent": "Skip to main content",
    "openMenu": "Open menu",
    "closeMenu": "Close menu"
  }
}
```

- [ ] **Step 6 : Écrire `next.config.ts` et supprimer l'ancien**

```ts
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
```

```bash
git rm --quiet next.config.mjs
```

- [ ] **Step 7 : Relancer les tests**

Run: `npx vitest run tests/unit/routing.test.ts`
Expected: 5 tests PASS.

- [ ] **Step 8 : Vérifier le routage réel**

```bash
npm run build && npm start &
sleep 4
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:3000/
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/fr
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/en
kill %1
```

Expected: `/` renvoie 307 vers `/fr` ; `/fr` et `/en` renvoient 200.

- [ ] **Step 9 : Commit**

```bash
git add -A
git commit -m "feat: Add bilingual routing with localised pathnames

/fr and /en are always prefixed, and content pages carry real localised
slugs (/fr/travaux vs /en/work) so both languages are independently
indexable.

The i18n entry point is src/proxy.ts, not middleware.ts: Next 16 renamed
the convention and no longer supports the edge runtime there.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6 : Layout — thème, en-tête, pied de page

**Files:**
- Modify: `src/app/(site)/[locale]/layout.tsx`, `src/app/(site)/[locale]/page.tsx`
- Create: `src/components/layout/site-header.tsx`, `site-footer.tsx`, `language-switch.tsx`, `theme-toggle.tsx`, `skip-link.tsx`, `src/components/theme-provider.tsx`, `src/app/(site)/[locale]/not-found.tsx`

**Interfaces:**
- Consumes: `fontVariables` (tâche 4) · `routing`, `Link`, `usePathname` (tâche 5) · clés `nav.*`, `theme.*`, `language.*`, `footer.*`, `a11y.*` (tâche 5)
- Produces: `<main id="main">` présent sur toutes les pages — cible du lien d'évitement et des tests Playwright de la tâche 8

- [ ] **Step 1 : Installer next-themes (déjà en dépendance) et écrire le fournisseur**

```tsx
// src/components/theme-provider.tsx
'use client';

import {ThemeProvider as NextThemesProvider} from 'next-themes';
import type {ComponentProps} from 'react';

export function ThemeProvider({children, ...props}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 2 : Écrire le layout racine**

```tsx
// src/app/(site)/[locale]/layout.tsx
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {SiteFooter} from '@/components/layout/site-footer';
import {SiteHeader} from '@/components/layout/site-header';
import {SkipLink} from '@/components/layout/skip-link';
import {ThemeProvider} from '@/components/theme-provider';
import {routing} from '@/i18n/routing';
import {fontVariables} from '@/lib/fonts';
import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Indispensable pour que les pages restent rendues statiquement.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body className="bg-paper text-ink flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider>
            <SkipLink />
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` sur `<html>` est requis par next-themes : le script qui pose la classe s'exécute avant l'hydratation.

- [ ] **Step 3 : Écrire le lien d'évitement**

```tsx
// src/components/layout/skip-link.tsx
import {useTranslations} from 'next-intl';

export function SkipLink() {
  const t = useTranslations('a11y');
  return (
    <a
      href="#main"
      className="bg-accent sr-only rounded-md px-4 py-2 text-sm text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
    >
      {t('skipToContent')}
    </a>
  );
}
```

- [ ] **Step 4 : Écrire la bascule de thème**

```tsx
// src/components/layout/theme-toggle.tsx
'use client';

import {useTranslations} from 'next-intl';
import {useTheme} from 'next-themes';
import {useEffect, useState} from 'react';

export function ThemeToggle() {
  const t = useTranslations('theme');
  const {resolvedTheme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avant montage, le thème résolu est inconnu côté serveur : on réserve la
  // place pour éviter tout décalage de mise en page.
  if (!mounted) return <span className="block size-8" aria-hidden />;

  const next = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={t('toggle')}
      className="border-line hover:border-accent font-mono text-xs uppercase tracking-widest rounded-sm border px-2 py-1"
    >
      {resolvedTheme === 'dark' ? t('light') : t('dark')}
    </button>
  );
}
```

- [ ] **Step 5 : Écrire la bascule de langue**

Elle doit conserver la page courante en traduisant le chemin — c'est tout l'intérêt des slugs localisés.

```tsx
// src/components/layout/language-switch.tsx
'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';

export function LanguageSwitch({current}: {current: string}) {
  const t = useTranslations('language');
  // Chemin interne, sans préfixe de langue : réutilisable pour l'autre locale.
  const pathname = usePathname();

  return (
    <nav aria-label={t('label')} className="flex items-center gap-1">
      {routing.locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && <span aria-hidden className="text-muted">/</span>}
          <Link
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={locale === current ? 'true' : undefined}
            className={
              locale === current
                ? 'text-accent font-mono text-xs uppercase tracking-widest'
                : 'text-muted hover:text-ink font-mono text-xs uppercase tracking-widest'
            }
          >
            {locale}
          </Link>
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 6 : Écrire l'en-tête et le pied de page**

```tsx
// src/components/layout/site-header.tsx
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {LanguageSwitch} from './language-switch';
import {ThemeToggle} from './theme-toggle';

const LINKS = [
  {href: '/expertise', key: 'expertise'},
  {href: '/work', key: 'work'},
  {href: '/about', key: 'about'},
  {href: '/writing', key: 'writing'},
  {href: '/contact', key: 'contact'},
] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <header className="border-line border-b">
      <div className="mx-auto flex max-w-5xl items-baseline justify-between px-6 py-5">
        <Link href="/" className="font-serif text-lg">
          Florentin Tchangai
        </Link>

        <div className="flex items-baseline gap-6">
          <nav aria-label={t('home')} className="hidden gap-5 md:flex">
            {LINKS.map(({href, key}) => (
              <Link
                key={href}
                href={href}
                className="text-muted hover:text-ink font-mono text-xs uppercase tracking-widest"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
          <LanguageSwitch current={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

```tsx
// src/components/layout/site-footer.tsx
import {useTranslations} from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-line border-t">
      <div className="text-muted mx-auto flex max-w-5xl flex-wrap justify-between gap-2 px-6 py-8 font-mono text-xs">
        <span>© {year} Florentin Tchangai. {t('rights')}</span>
        <span>{t('builtWith')}</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7 : Écrire l'accueil provisoire et la page 404**

```tsx
// src/app/(site)/[locale]/page.tsx
import {setRequestLocale} from 'next-intl/server';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="font-serif text-4xl leading-tight tracking-tight">
        Je conçois, construis et fais évoluer des{' '}
        <em className="text-accent italic">systèmes numériques.</em>
      </h1>
      <p className="text-muted mt-6 max-w-prose">
        Fondations en place. Le contenu arrive au plan 2.
      </p>
    </div>
  );
}
```

```tsx
// src/app/(site)/[locale]/not-found.tsx
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('nav');
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <p className="text-muted font-mono text-xs uppercase tracking-widest">404</p>
      <h1 className="font-serif mt-3 text-3xl">Page introuvable</h1>
      <Link href="/" className="text-accent mt-6 inline-block underline underline-offset-4">
        {t('home')}
      </Link>
    </div>
  );
}
```

- [ ] **Step 8 : Vérifier**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: les trois sortent en 0, et le build liste `/fr` et `/en` en statique (`●` ou `○`).

- [ ] **Step 9 : Commit**

```bash
git add -A
git commit -m "feat: Add the site layout, theme toggle and language switch

The language switch translates the current path instead of sending the
visitor home, which is the point of localised slugs. Theme is class-driven
through next-themes, replacing the 60-line inline script and the two
competing theme systems the old build carried.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7 : Redirections, en-têtes de sécurité, robots et sitemap

**Files:**
- Modify: `next.config.ts`
- Create: `src/lib/redirects.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/lib/site.ts`, `tests/unit/redirects.test.ts`

**Interfaces:**
- Consumes: `routing` (tâche 5)
- Produces:
  - `LEGACY_REDIRECTS: readonly Redirect[]` (`src/lib/redirects.ts`) — consommé par `next.config.ts` **et** par le test
  - `siteUrl: string` et `SITE` (`src/lib/site.ts`) — réutilisés par les métadonnées du plan 4

> **Pourquoi un module séparé.** Le test ne doit pas importer `next.config.ts` : ce fichier charge `next-intl/plugin`, un module de build qui ne se résout pas sous Vitest. Les redirections vivent donc dans `src/lib/redirects.ts`, importé par les deux.

- [ ] **Step 1 : Écrire le test qui échoue**

Il verrouille les sept redirections du §4.4 de la spec.

```ts
// tests/unit/redirects.test.ts
import {describe, expect, it} from 'vitest';
import {LEGACY_REDIRECTS} from '@/lib/redirects';

describe('redirections des anciennes URLs', () => {
  const expected: Array<[string, string]> = [
    ['/about', '/fr/parcours'],
    ['/projects', '/fr/travaux'],
    ['/blog', '/fr/ecrits'],
    ['/blog/:slug', '/fr/ecrits/:slug'],
    ['/resume', '/fr/parcours'],
    ['/contact', '/fr/contact'],
  ];

  it.each(expected)('redirige %s vers %s de façon permanente', (source, destination) => {
    const rule = LEGACY_REDIRECTS.find((r) => r.source === source);
    expect(rule, `règle manquante pour ${source}`).toBeDefined();
    expect(rule!.destination).toBe(destination);
    expect(rule!.permanent).toBe(true);
  });

  it('couvre les six anciennes URLs, sans doublon', () => {
    expect(LEGACY_REDIRECTS).toHaveLength(6);
    expect(new Set(LEGACY_REDIRECTS.map((r) => r.source)).size).toBe(6);
  });

  it('ne redirige pas /admin — il doit renvoyer 410', () => {
    expect(LEGACY_REDIRECTS.find((r) => r.source === '/admin')).toBeUndefined();
  });
});
```

- [ ] **Step 2 : Lancer le test pour vérifier qu'il échoue**

Run: `npx vitest run tests/unit/redirects.test.ts`
Expected: ÉCHEC — `Cannot find module '@/lib/redirects'`.

- [ ] **Step 3 : Écrire `src/lib/redirects.ts` et `src/lib/site.ts`**

```ts
// src/lib/redirects.ts
export type Redirect = {source: string; destination: string; permanent: boolean};

/**
 * Anciennes URLs du site pré-refonte (§4.4 de la spec). Elles sont déjà
 * indexées : les supprimer sans redirection ferait perdre le référencement
 * acquis. `permanent: true` fait émettre un 308 par Next, équivalent au 301
 * pour les moteurs de recherche.
 *
 * `/admin` est absent volontairement — la ressource est supprimée, pas
 * déplacée : elle répond 410 (tâche 8).
 */
export const LEGACY_REDIRECTS: readonly Redirect[] = [
  {source: '/about', destination: '/fr/parcours', permanent: true},
  {source: '/projects', destination: '/fr/travaux', permanent: true},
  {source: '/blog', destination: '/fr/ecrits', permanent: true},
  {source: '/blog/:slug', destination: '/fr/ecrits/:slug', permanent: true},
  {source: '/resume', destination: '/fr/parcours', permanent: true},
  {source: '/contact', destination: '/fr/contact', permanent: true},
] as const;
```

```ts
export const SITE = {
  name: 'Florentin Tchangai',
  role: 'Technology Architect',
  location: 'Lomé, Togo',
  github: 'https://github.com/kybaloo',
  linkedin: 'https://linkedin.com/in/kybaloo',
} as const;

/** URL canonique. Vercel fournit VERCEL_PROJECT_PRODUCTION_URL en production. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '');
```

- [ ] **Step 4 : Compléter `next.config.ts`**

```ts
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
```

- [ ] **Step 5 : Relancer le test**

Run: `npx vitest run tests/unit/redirects.test.ts`
Expected: 8 tests PASS (6 redirections + unicité + absence de `/admin`).

- [ ] **Step 6 : Écrire `robots.ts` et `sitemap.ts`**

```ts
// src/app/robots.ts
import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {userAgent: '*', allow: '/', disallow: ['/studio', '/api/']},
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

```ts
// src/app/sitemap.ts
import type {MetadataRoute} from 'next';
import {getPathname} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/lib/site';

// Pages statiques. Les fiches projets et articles s'ajoutent au plan 3,
// une fois que Sanity fournit la liste des slugs.
const STATIC_PAGES = ['/', '/expertise', '/work', '/about', '/writing', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_PAGES.map((href) => ({
    url: `${siteUrl}${getPathname({href, locale: routing.defaultLocale})}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${siteUrl}${getPathname({href, locale})}`]),
      ),
    },
  }));
}
```

- [ ] **Step 7 : Vérifier le rendu réel**

```bash
npm run build && npm start &
sleep 4
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml | head -20
curl -s -o /dev/null -w 'about   %{http_code} -> %{redirect_url}\n' http://localhost:3000/about
curl -s -o /dev/null -w 'blog/x  %{http_code} -> %{redirect_url}\n' http://localhost:3000/blog/x
curl -s -o /dev/null -w 'headers %{http_code}\n' -D - http://localhost:3000/fr | grep -i 'x-frame-options'
kill %1
```

Expected: `robots.txt` interdit `/studio` ; le sitemap contient les balises `xhtml:link` pour `fr` et `en` ; `/about` renvoie **308** vers `/fr/parcours` (Next émet 308 pour `permanent: true`) ; `X-Frame-Options: SAMEORIGIN` est présent.

- [ ] **Step 8 : Commit**

```bash
git add -A
git commit -m "feat: Add 301 redirects, security headers, robots and sitemap

Maps every indexed URL of the old site onto its new localised path, so the
rebuild does not drop the existing search ranking. The sitemap emits
hreflang alternates for both locales.

/admin is deliberately absent from the redirect table: it must return 410,
which is handled in the next task.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8 : `/admin` en 410 et parcours Playwright

**Files:**
- Create: `src/app/admin/route.ts`, `playwright.config.ts`, `tests/e2e/foundations.spec.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `<main id="main">` (tâche 6) · redirections (tâche 7)
- Produces: `npm run test:e2e` — utilisé par la CI en tâche 9

- [ ] **Step 1 : Écrire les tests qui échouent**

```ts
// tests/e2e/foundations.spec.ts
import {expect, test} from '@playwright/test';

test('la racine redirige vers le français', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/fr$/);
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
```

- [ ] **Step 2 : Lancer pour vérifier l'échec**

Run: `npx playwright test`
Expected: ÉCHEC — Playwright n'est pas configuré (`playwright.config.ts` absent).

- [ ] **Step 3 : Écrire `playwright.config.ts`**

```ts
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
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}],
  // Pas de serveur à démarrer si l'on teste une URL d'aperçu Vercel.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {command: 'npm run build && npm start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI, timeout: 120_000},
});
```

- [ ] **Step 4 : Écrire le gestionnaire `/admin`**

Une route sans page : elle répond 410 à toutes les méthodes. La spec l'exige — une 301 dirait aux moteurs que la ressource a déménagé, alors qu'elle est supprimée.

```ts
// src/app/admin/route.ts
const gone = () =>
  new Response('Gone', {
    status: 410,
    headers: {'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex'},
  });

export const GET = gone;
export const POST = gone;
export const PUT = gone;
export const PATCH = gone;
export const DELETE = gone;
```

- [ ] **Step 5 : Ignorer les artefacts de test**

```bash
printf '\n# Playwright\n/test-results/\n/playwright-report/\n/blob-report/\n/playwright/.cache/\n' >> .gitignore
```

- [ ] **Step 6 : Installer le navigateur et relancer**

```bash
npx playwright install --with-deps chromium
npx playwright test
```

Expected: 7 tests PASS.

- [ ] **Step 7 : Commit**

```bash
git add -A
git commit -m "feat: Return 410 on /admin and add the foundations e2e suite

/admin is gone, not moved, so it answers 410 rather than redirecting —
that tells search engines to drop it instead of following it.

The Playwright suite covers locale routing, the language switch preserving
the current page, the theme toggle, the skip link, and every permanent
redirect. It targets PLAYWRIGHT_BASE_URL when set, so CI can run it against
the Vercel preview.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9 : Intégration continue

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `lint`, `typecheck`, `test`, `build`, `test:e2e`, `validate:archive` (tâches 1, 3, 8)
- Produces: une vérification obligatoire sur toute PR vers `dev` et `main`

- [ ] **Step 1 : Écrire le workflow**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [dev, main]
  pull_request:
    branches: [dev, main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Archive du contenu
        run: npm run validate:archive

      - name: Lint
        run: npm run lint

      - name: Vérification des types
        run: npm run typecheck

      - name: Tests unitaires
        run: npm test

      - name: Build
        run: npm run build

      - name: Installer Chromium
        run: npx playwright install --with-deps chromium

      - name: Tests de parcours
        run: npm run test:e2e

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

- [ ] **Step 2 : Vérifier la séquence en local avant de pousser**

```bash
npm ci
npm run validate:archive && npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e
```

Expected: toutes les étapes sortent en 0.

- [ ] **Step 3 : Commit et pousser**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: Verify lint, types, tests and build on every PR

Runs the same sequence locally and on CI, including the content-archive
check so the plan 2 import source cannot silently break.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
git push origin dev
```

- [ ] **Step 4 : Vérifier l'aperçu Vercel**

Ouvrir l'aperçu de `dev` et contrôler :
- `/` redirige vers `/fr`
- `/fr` et `/en` s'affichent, en-tête et pied de page compris
- la bascule de langue conserve la page
- la bascule de thème fonctionne et survit à un rechargement
- `/about` arrive sur `/fr/parcours`
- `/admin` renvoie 410

Optionnel, contre l'aperçu déployé :

```bash
PLAYWRIGHT_BASE_URL=https://<url-apercu>.vercel.app npx playwright test
```

---

## Auto-relecture

**Couverture de la spec par ce plan.** §2 diagnostic → tâche 2 (suppressions) · §4.1 pile → tâches 2 et 3 · §4.2 arborescence → tâches 2, 4, 5, 6 · §4.3 routage → tâche 5 · §4.4 redirections → tâches 7 et 8 · §5 design system → tâche 4 · §9 CI, en-têtes, a11y → tâches 3, 7, 8, 9.

**Volontairement hors de ce plan, traité plus loin.** Sanity, TypeGen, Studio, import du contenu → plan 2. Les pages réelles, shadcn, le formulaire Resend, la réécriture de la bio → plan 3. Images OG, JSON-LD, `generateMetadata` par page, budget de performance, axe-core, sitemap dynamique des projets → plan 4.

**Points de vigilance pour l'exécutant.**

1. La tâche 2 détruit `src/`. Ne jamais la lancer si la tâche 1 n'est pas commitée et validée.
2. Le fichier s'appelle `src/proxy.ts`. Créer un `middleware.ts` produit un routage silencieusement inactif en Next 16.
3. `permanent: true` émet un **308**, pas un 301. Les tests attendent 308 ; c'est correct et équivalent pour les moteurs de recherche.
4. `Link` s'importe toujours depuis `@/i18n/navigation`. Un import depuis `next/link` contourne les slugs localisés sans lever d'erreur.
5. `setRequestLocale` doit être appelé dans chaque layout et chaque page, sinon le rendu bascule en dynamique et le budget de performance tombe.
