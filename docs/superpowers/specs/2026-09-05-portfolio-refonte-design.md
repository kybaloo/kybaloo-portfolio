# Refonte du portfolio — Spécification de conception

**Date :** 2026-09-05
**Branche de travail :** `dev` → vérification sur l'aperçu Vercel → fusion vers `main`
**Auteur :** TCHANGAI Florentin Kybaloo

---

## 1. Objectif

Reconstruire le portfolio pour qu'il porte un positionnement de **Technology Architect / Technology Consultant** — quelqu'un qui conçoit et construit des systèmes numériques — et non celui d'un développeur généraliste proposant des prestations.

Le site actuel échoue sur quatre plans : il ressemble à un template généré, son architecture est incohérente, son contenu est incomplet, et il expose une faille de sécurité.

### Publics visés

Quatre, par ordre d'exigence décroissante :

1. **Clients freelance** — cherchent une preuve de livraison et un moyen de contact.
2. **Recruteurs techniques (CDI, remote)** — scannent la profondeur technique en quelques secondes.
3. **Institutions et clients locaux (Togo)** — cherchent de la crédibilité et des références nommées.
4. **Lecteurs techniques** — via l'écrit, à moyen terme.

Ces quatre publics veulent la même chose : **des preuves de travail lisibles**. Seule la hiérarchie de la page d'accueil les départage.

### Critères de réussite

- Un visiteur comprend le positionnement d'architecte en moins de 10 secondes.
- Chaque projet possède une URL indexable et propre, partageable telle quelle.
- Le site est lisible et indexé en français **et** en anglais.
- Aucune section vide n'est visible.
- Le contenu est modifiable sans toucher au code ni redéployer à la main.
- Aucune route en écriture n'est exposée sans authentification.

---

## 2. Diagnostic de l'existant

### 2.1 Sécurité — critique

| Emplacement                     | Problème                                                                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/admin/page.tsx:17`     | Mot de passe codé en dur, en clair, dans le bundle **client** — visible de quiconque inspecte le JavaScript livré au navigateur. Authentification par `localStorage`. |
| `src/app/api/projects/route.ts` | `POST` et `DELETE` sans aucune authentification serveur.                                                                                                              |
| `src/app/api/blog/route.ts`     | Idem.                                                                                                                                                                 |

Ces routes écrivent via `fs.writeFileSync`, ce qui échoue de toute façon sur Vercel (système de fichiers en lecture seule) — mais elles restent joignables publiquement.

### 2.2 Dépendances

35 dépendances sur 60 ne sont jamais importées :

- 28 paquets `@radix-ui/*` installés, **aucun** composant `src/components/ui/` — shadcn n'a jamais été initialisé.
- `sanity`, `next-sanity`, `@sanity/vision` installés, aucun schéma ni client — le contenu vit dans `src/data/*.json`.
- `next-intl` installé, non utilisé — un `LanguageContext.tsx` maison de 434 lignes le remplace.
- `next-themes` installé, non utilisé — un script inline de 60 lignes plus un `ThemeContext` maison le remplacent.
- Jamais importés : `next-auth`, `zustand`, `@tanstack/react-query`, `@tanstack/react-table`, `recharts`, `animejs`, `axios`, `react-dropzone`, `@react-google-maps/api`, `react-calendly`, `cmdk`, `input-otp`, `react-resizable-panels`, `embla-carousel-*`, `react-day-picker`.

`styled-components` fait exception : inutilisé aujourd'hui, il redevient un peer requis par Sanity Studio.

### 2.3 Incohérences de configuration

| Paquet               | Déclaré | Réalité                                    |
| -------------------- | ------- | ------------------------------------------ |
| `next`               | 14.2.35 | 16.3.4 disponible                          |
| `react`              | `^18`   | mais `@types/react: ^19`                   |
| `tailwindcss`        | `^4`    | avec un `tailwind.config.js` en syntaxe v3 |
| `eslint-config-next` | 15.3.0  | avec Next 14                               |

`tailwind.config.js` force `important: true`, et `globals.css` compte une quarantaine de `!important` — conséquence directe de trois systèmes de thème concurrents.

### 2.4 Architecture

- `"use client"` sur toutes les pages : aucun composant serveur, tout le contenu transite en JavaScript.
- Doublons : `Navbar.tsx` et `Navigation.tsx`.
- `ThemeDebugger.tsx` présent en production.
- Résidus d'autres plateformes : `netlify.toml`, `windsurf_deployment.yaml`.
- Aucun test, aucune CI, aucun formatage automatique.
- Aucun `sitemap`, `robots`, image OG ni donnée structurée.
- i18n sans routage localisé : les moteurs de recherche ne voient qu'une seule langue.

### 2.5 Contenu

- `skills.json` attribue des niveaux en pourcentage (`"level": 95`) qui ne mesurent rien et signalent un portfolio junior.
- `blog.json` contient cinq articles génériques (« Next.js vs React », « Getting Started with Next.js and Tailwind CSS »…), illustrés par des photos Unsplash et une image tierce servie depuis `refine-web.imgix.net`.
- `services.json` annonce « Applications Mobiles — React Native et Flutter » alors qu'aucun des dix projets n'utilise ces technologies.

### 2.6 Signature visuelle

Le site cumule les marqueurs du template généré : dégradé bleu → violet → vert sur le nom, halos `blur-3xl` en arrière-plan, photo ronde centrée, cartes grises uniformes, barres de progression en pourcentage.

---

## 3. Décisions

| Sujet              | Décision                                                 | Justification                                                                                                                                                        |
| ------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stratégie          | **Reconstruction propre sur `dev`**                      | Une migration incrémentale coûterait plus cher : chaque étape réconcilierait une configuration destinée à disparaître.                                               |
| Contenu            | **Sanity**                                               | Le besoin est éditorial, pas transactionnel. Supabase imposerait de reconstruire un back-office, une gestion i18n et une transformation d'images que Sanity fournit. |
| Framework          | **Next 16.3.4 / React 19.2**                             | Contrainte dure : `next-sanity@13` exige `next: "^16.0.0-0"`.                                                                                                        |
| i18n               | **next-intl 4.14**, routage `/fr` `/en`, slugs localisés | Vraies URLs indexables par langue, `hreflang` croisé.                                                                                                                |
| Positionnement     | **Technology Architect / Consultant**                    | Décision de l'auteur. Conditionne le hero, les services et le modèle de projet.                                                                                      |
| Direction visuelle | **Éditoriale**                                           | Se distingue du template, vieillit bien, sert les quatre publics.                                                                                                    |
| Animation          | **Aucune bibliothèque**                                  | `framer-motion` pèse ~50 kB et les apparitions au défilement sont précisément le tic à supprimer. CSS et View Transitions natives suffisent.                         |
| Formulaire         | **Server Actions + Zod + Resend**                        | Aucune base de données nécessaire pour un formulaire de contact.                                                                                                     |

### Compatibilité vérifiée

```
next-sanity@13.3.4              next ^16.0.0-0 · react ^19.2.3 · sanity ^5 || ^6
sanity@6.12.0                   react ^19.2.2 · styled-components ^6.1.15
next-intl@4.14.2                next ... || ^16.0.0 · react ^19.0.0
@sanity/document-i18n@6.2.35    sanity ^5 || ^6 · sanity-plugin-internationalized-array ^5.2.4
next-themes@0.4.6               react ^19
shadcn@4.21.0
```

---

## 4. Architecture technique

### 4.1 Pile

| Rôle              | Choix                                                             |
| ----------------- | ----------------------------------------------------------------- |
| Framework         | Next 16.3.4 (App Router, RSC par défaut) / React 19.2             |
| Langage           | TypeScript strict, `noUncheckedIndexedAccess` activé              |
| Styles            | Tailwind v4 en CSS-first (`@theme`) — pas de `tailwind.config.js` |
| Primitives UI     | shadcn/ui 4.21 — uniquement les composants réellement employés    |
| Contenu           | Sanity 6.12 + `next-sanity` 13.3, Studio embarqué sur `/studio`   |
| Typage du contenu | Sanity TypeGen — types générés depuis les requêtes GROQ           |
| i18n              | next-intl 4.14                                                    |
| Thème             | next-themes 0.4.6                                                 |
| Formulaires       | Server Actions + Zod                                              |
| Email             | Resend + react-email                                              |
| Animation         | aucune bibliothèque                                               |

### 4.2 Arborescence

```
src/
├─ app/                          routage uniquement, aucune logique métier
│  ├─ [locale]/
│  │  ├─ layout.tsx  page.tsx
│  │  ├─ expertise/            travaux/[slug]/
│  │  ├─ parcours/             ecrits/[slug]/
│  │  └─ contact/
│  ├─ studio/[[...tool]]/page.tsx
│  ├─ api/draft-mode/enable/route.ts
│  ├─ api/revalidate/route.ts             webhook Sanity, signature vérifiée
│  └─ sitemap.ts  robots.ts  manifest.ts  opengraph-image.tsx
├─ modules/                      une fonctionnalité = un dossier autonome
│  ├─ projects/    components/ · queries.ts · types.ts
│  ├─ writing/     profile/     expertise/
│  └─ contact/     contact-form.tsx · actions.ts · schema.ts
├─ components/
│  ├─ ui/                        shadcn — primitives pures
│  └─ layout/                    header · footer · language-switch · theme-toggle · skip-link
├─ sanity/
│  ├─ schemas/     documents/ · objects/ · index.ts
│  ├─ lib/         client.ts · image.ts · live.ts · fetch.ts
│  ├─ queries/     GROQ, source des types générés
│  ├─ structure.ts env.ts
├─ i18n/           routing.ts · request.ts · navigation.ts
├─ messages/       fr.json · en.json
├─ lib/            utils.ts · env.ts · seo.ts · json-ld.ts
└─ styles/         globals.css — les tokens @theme
```

**Règle de dépendance :** un module n'importe que ses propres fichiers, `components/ui` et `lib`. Aucun import croisé entre modules. Un besoin partagé remonte dans `lib/`.

### 4.3 Routage

```
/                          redirection selon Accept-Language

/fr                        /en
/fr/expertise              /en/expertise
/fr/travaux                /en/work
/fr/travaux/[slug]         /en/work/[slug]
/fr/parcours               /en/about
/fr/ecrits                 /en/writing
/fr/ecrits/[slug]          /en/writing/[slug]
/fr/contact                /en/contact

/studio                    hors i18n, noindex
```

Rendu statique, revalidé par webhook Sanity à la publication.

### 4.4 Redirections des anciennes URLs

Permanentes (301), obligatoires — le site est déjà indexé :

| Ancienne       | Nouvelle            |
| -------------- | ------------------- |
| `/about`       | `/fr/parcours`      |
| `/projects`    | `/fr/travaux`       |
| `/blog`        | `/fr/ecrits`        |
| `/blog/[slug]` | `/fr/ecrits/[slug]` |
| `/resume`      | `/fr/parcours`      |
| `/contact`     | `/fr/contact`       |
| `/admin`       | **410 Gone**        |

---

## 5. Design system

### 5.1 Typographie

| Rôle   | Police                                      | Usage                                          |
| ------ | ------------------------------------------- | ---------------------------------------------- |
| Titres | **Newsreader** (variable, tailles optiques) | titres, noms de projets, chiffres mis en avant |
| Texte  | **Inter**                                   | paragraphes, interface                         |
| Méta   | **JetBrains Mono**                          | étiquettes, années, stacks, numéros            |

Chargées par `next/font/google` : auto-hébergées, aucune requête externe, aucun décalage de mise en page.

### 5.2 Couleur

| Rôle                    | Clair     | Sombre    |
| ----------------------- | --------- | --------- |
| `--color-paper`         | `#F6F7F4` | `#0F1211` |
| `--color-ink`           | `#111512` | `#E7EAE6` |
| `--color-accent`        | `#1F5140` | `#6CC3A2` |
| `--color-highlight`     | `#D9A441` | `#D9A441` |
| `--color-highlight-ink` | `#111512` | `#0F1211` |

Contrastes vérifiés :

| Association             | Ratio     | WCAG      |
| ----------------------- | --------- | --------- |
| Vert sur papier         | 8,5:1     | AAA       |
| Encre sur or            | 8,3:1     | AAA       |
| Or sur fond sombre      | 8,5:1     | AAA       |
| **Or sur papier clair** | **2,1:1** | **échec** |

**Règle de l'or.** Autorisé en fond (avec encre par-dessus), en aplat plein (puce, filet, soulignement au survol), et en texte **uniquement en mode sombre**. Interdit en texte sur fond clair, en fond de bouton avec texte clair, en dégradé, et au-delà d'environ 5 % de la surface. C'est un accent d'exception, pas une seconde couleur de marque.

### 5.3 Tokens

Déclarés une seule fois dans `globals.css` via `@theme`. Aucun composant n'écrit de valeur hexadécimale.

```css
@theme {
  /* Échelle typographique — ratio 1.25, ancrée sur 16px */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.563rem;
  --text-2xl: 1.953rem;
  --text-3xl: 2.441rem;
  --text-4xl: 3.052rem;
  --text-5xl: 3.815rem;

  --spacing: 0.25rem; /* uniquement des multiples de 4px */
  --radius-sm: 3px;
  --radius-md: 5px;
  --radius-lg: 8px;

  --font-serif: var(--font-newsreader);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains);
}
```

### 5.4 Interdits explicites

Ces éléments produisaient la signature « template généré » et sont bannis :

- dégradés sur du texte ou en arrière-plan ;
- halos flous (`blur-3xl`) décoratifs ;
- barres de progression en pourcentage pour les compétences ;
- apparitions au défilement (`fade-in-up`) ;
- grands rayons de bordure et ombres portées diffuses ;
- photos d'illustration génériques (banques d'images).

---

## 6. Structure des pages

### Accueil

| #   | Bloc                                                                       | Public servi            |
| --- | -------------------------------------------------------------------------- | ----------------------- |
| 1   | Hero — positionnement architecte, disponibilité, « Me contacter » + « CV » | freelance, CDI          |
| 2   | Expertise condensée — l'arc et les cinq titres, lien vers `/expertise`     | tous                    |
| 3   | Travaux sélectionnés — 3 à 4 projets en liste éditoriale numérotée         | tous                    |
| 4   | Parcours condensé — Ecobank, années, domaines                              | CDI, crédibilité locale |
| 5   | Écrits — 2 derniers articles, **bloc masqué si vide**                      | lecteurs techniques     |
| 6   | Contact — disponibilité et formulaire                                      | freelance               |

Tout bloc sans contenu disparaît entièrement. Une section vide nuit plus qu'une section absente.

### Expertise

Message central : **« Je conçois, construis et fais évoluer des systèmes numériques. »**

Les cinq services sont présentés comme les étapes d'une même expertise, numérotés dans l'ordre de l'arc :

| N°  | Service                | Étape      |
| --- | ---------------------- | ---------- |
| 01  | Technology Strategy    | Understand |
| 02  | Architecture & Systems | Architect  |
| 03  | Digital Products       | Build      |
| 04  | Data & Intelligence    | Measure    |
| 05  | Digital Transformation | Improve    |

Chaque service porte son étape en étiquette et la liste de ses mots-clés.

En bas de page, une ligne `Capabilities` discrète : _Software Engineering · Cloud · DevOps · UX · Mobile · APIs · BI · Data Engineering_. Présente pour les mots-clés et l'indexation, sans concurrencer les cinq services. **UX Design, Mobile et Web Development n'apparaissent jamais comme services principaux.**

### Fiche projet

Structure imposée par le positionnement — une architecture est invisible tant que la décision n'est pas énoncée :

```
Contexte               2 lignes
Contrainte principale  1 ligne
Décisions              3 à 5 puces courtes
Résultats              1 à 2 valeurs chiffrées
Stack · rôle · durée · client · liens · captures
```

Ces champs sont **optionnels dans le schéma** : un projet incomplet affiche simplement moins, sans casser la mise en page.

---

## 7. Modèle de contenu Sanity

### Documents

```
project      titre · slug · résumé · année · client · rôle · featured · ordre
             stack[] · images[] · liens{live, github}
             contexte · contrainte · décisions[] · résultats[{label, valeur}]

post         titre · slug · résumé · date · body (Portable Text) · tags[] · couverture · épinglé
service      numéro · titre · étape · description · motsClés[]
experience   poste · organisation · période · description · technos[]
skill        nom · catégorie · usage (quotidien|régulier|notions) · projets[] → référence project
profile      ⬦ singleton — nom · titre · bio · photo · disponibilité · liens · CV fr/en
settings     ⬦ singleton — SEO par défaut · image OG
```

`skill.projets[]` référence des documents `project` : chaque technologie affiche les projets qui la prouvent. Le lien est bidirectionnel dans le Studio.

### Internationalisation du contenu — modèle hybride

| Type                                                   | Stratégie                                                     | Raison                                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `post`                                                 | **niveau document** (`@sanity/document-internationalization`) | un article peut n'exister qu'en une langue ; les textes divergent réellement                       |
| `project`, `service`, `experience`, `skill`, `profile` | **niveau champ** (`sanity-plugin-internationalized-array`)    | images, stack, liens et dates sont communs — les dupliquer créerait deux versions à désynchroniser |

Tout au niveau document imposerait de ré-téléverser chaque capture en double. Tout au niveau champ rendrait la rédaction d'articles pénible.

### Typage

Les requêtes GROQ vivent dans `sanity/queries/`. `sanity typegen generate` produit `sanity.types.ts` **à partir de ces requêtes**. Un champ renommé dans le Studio casse le build plutôt que de produire `undefined` en production. La CI vérifie que les types générés sont à jour.

---

## 8. Migration du contenu

### Conservé

- L'historique git et le dépôt.
- `public/` — captures de projets, CV (`cv.pdf`, `resume.pdf`, `cv-francais.txt`, `cv-english.txt`), favicon.
- `LICENSE`.
- Les **10 projets** de `projects.json`, importés dans Sanity, dont 4 en avant.
- Les **2 expériences** codées en dur dans `src/components/Experience.tsx` (Ecobank depuis septembre 2022, freelance 2021-2022) — extraites vers des documents `experience`.
- Les **textes de bio** (français et anglais) de `src/context/LanguageContext.tsx` — extraits vers le singleton `profile`, puis réécrits pour porter le positionnement d'architecte.
- Les **compétences**, retravaillées (voir ci-dessous).

**Note utile :** `Experience.tsx` contient déjà des résultats chiffrés exploitables — « plus de 50 M$ de demandes de prêt traitées », « 40 % d'amélioration des performances applicatives ». C'est exactement la matière attendue par les champs `résultats[]` des fiches projets ; il n'y a pas tout à écrire de zéro.

### Transformé

| Source                          | Devient                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| `skills.json` — `"level": 95`   | niveau d'usage : `quotidien` / `régulier` / `notions`, plus les projets qui le prouvent |
| `services.json` — 4 prestations | les 5 services du positionnement architecte                                             |
| `projects.json`                 | documents `project` enrichis des champs d'architecture (à compléter par l'auteur)       |

Les pourcentages disparaissent : ils ne mesurent rien et signalent un portfolio junior auprès du public technique visé.

### Non migré

- Les **5 articles de `blog.json`** — génériques, illustrés d'images de banque et d'une image tierce servie depuis un domaine externe. Le blog démarre vide et reste masqué jusqu'à publication. Les anciennes URLs reçoivent une 301 vers `/fr/ecrits`.
- Les 4 entrées de `services.json`.

### Supprimé du dépôt

`src/app/admin/` · `src/app/api/projects/` · `src/app/api/blog/` · `src/data/*.json` · `netlify.toml` · `windsurf_deployment.yaml` · `src/components/ThemeDebugger.tsx` · `src/components/Navbar.tsx` (doublon) · `src/context/` · `tailwind.config.js` · 35 dépendances inutilisées.

Les contenus utiles de `Experience.tsx` et `LanguageContext.tsx` sont extraits vers Sanity **avant** la suppression de ces fichiers.

---

## 9. Qualité, SEO, sécurité

### Tests

- **Vitest** — validation d'environnement, mapping des requêtes, helpers de date et d'i18n, règles d'affichage conditionnel (masquage des sections vides).
- **Playwright** — trois parcours : navigation FR ↔ EN avec vérification des balises `hreflang`, ouverture d'une fiche projet depuis l'accueil, soumission du formulaire de contact (Resend simulé).
- **axe-core** sur les cinq pages principales.

### Intégration continue

GitHub Actions sur chaque PR vers `dev` et `main` :

```
lint → typecheck → sanity typegen (vérification) → build → vitest → playwright
```

Prettier avec `prettier-plugin-tailwindcss`, déclenché par husky et lint-staged au commit.

### SEO

`generateMetadata` par page · `hreflang` croisé via next-intl · `sitemap.ts` multilingue · `robots.ts` · données structurées JSON-LD (`Person`, `BreadcrumbList`, `Article`) · images OG générées à la volée avec `next/og`, reprenant la typographie du site.

### Sécurité

- Variables d'environnement validées par Zod au démarrage.
- Token Sanity strictement serveur, jamais exposé au client.
- Route `draft-mode` protégée par secret ; webhook de revalidation à signature vérifiée.
- `/studio` en `noindex`.
- En-têtes : CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Aucune route en écriture non authentifiée** — le point de départ de cette refonte.

### Performance

Budget : **LCP < 2 s · CLS < 0,05 · JS initial < 100 kB**. Tenable grâce au rendu serveur intégral et à l'absence de bibliothèque d'animation. Mesuré par Vercel Speed Insights.

### Accessibilité

Lien d'évitement · focus visible sur tous les éléments interactifs · respect de `prefers-reduced-motion` · contrastes validés AAA (section 5.2) · navigation au clavier sur le sélecteur de langue et le menu mobile.

---

## 10. Hors périmètre

- Toute fonctionnalité nécessitant une base de données (compteur de vues, livre d'or, authentification de visiteurs).
- Applications mobiles ou tout service non prouvé par un projet existant.
- Migration ou réécriture des cinq articles de blog existants.
- Refonte du CV PDF lui-même (les fichiers sont conservés tels quels).
- Achat ou changement de nom de domaine.

---

## 11. Critères d'acceptation

1. `npm run build` réussit sans avertissement TypeScript ni ESLint.
2. `/admin` renvoie 410 ; aucune route API n'accepte d'écriture non authentifiée.
3. Les sept redirections de la section 4.4 renvoient bien 301 vers la bonne cible.
4. `/fr` et `/en` servent chacune un contenu complet, avec `hreflang` croisé correct.
5. Le sitemap liste les deux langues et toutes les fiches projets.
6. Aucune section vide n'apparaît sur l'accueil lorsque Sanity ne renvoie rien.
7. Modifier un projet dans le Studio met le site à jour sans intervention manuelle.
8. Lighthouse ≥ 95 sur les quatre catégories, sur l'accueil et sur une fiche projet.
9. axe-core ne remonte aucune violation sérieuse ou critique.
10. `package.json` ne contient aucune dépendance non importée.
11. Aucune valeur hexadécimale de couleur n'est écrite dans un composant.
12. La suite Playwright passe sur l'aperçu Vercel de `dev` avant la fusion vers `main`.
