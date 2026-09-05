# SDD ledger — plan: docs/superpowers/plans/2026-09-05-fondations.md

Spec: docs/superpowers/specs/2026-09-05-portfolio-refonte-design.md
Branche: dev (dépôt principal, pas de worktree)
BASE de branche (merge-base main): bdb4948
HEAD au démarrage: 9fbcb28

Ruling: exécution directement sur `dev` dans le dépôt principal, sans worktree isolé — `dev`
n'est pas `main`, le partenaire humain l'a explicitement désignée comme branche de travail, et
sa vérification passe par l'aperçu Vercel construit depuis `dev`. Coût si erroné : le répertoire
de travail principal est modifié pendant l'exécution ; annulable par `git checkout`.

## Scan pré-vol

### Paires de tâches partageant un fichier ou une interface

| Paires        | Partagé                                                        | Produit → consommé                                                                          | Résultat                                                         |
| ------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| T1 → T2       | `docs/content-archive/*`                                       | T1 produit l'archive ; T2 §1 exige qu'elle soit commitée avant suppression                  | OK                                                               |
| T2 → T3       | `package.json`                                                 | T2 déclare vitest, eslint, prettier, husky, lint-staged, playwright ; T3 les configure tous | OK — chaque outil configuré est déclaré                          |
| T2 → T4       | `src/styles/globals.css`                                       | T2 pose un fichier provisoire, T4 le réécrit                                                | OK                                                               |
| T2 → T6       | `(site)/[locale]/layout.tsx`, `page.tsx`                       | T2 provisoires, T6 définitifs                                                               | OK                                                               |
| T2 → T8       | `src/app/`                                                     | T2 supprime tout `src/app`, T8 crée `src/app/admin/route.ts`                                | OK (ordre correct)                                               |
| T2 → T8       | `src/app/favicon.ico`                                          | T2 le supprime, personne ne le recrée                                                       | **F2**                                                           |
| T3 → T4,T5,T7 | alias `@` de Vitest                                            | T3 le configure, les tests suivants l'utilisent                                             | OK                                                               |
| T3 → T4       | `postcss.config.mjs`                                           | T3 déclare `@tailwindcss/postcss`, T4 en dépend au build                                    | OK                                                               |
| T4 → T6       | `fontVariables`                                                | exporté par `@/lib/fonts`, importé par le layout                                            | OK — noms identiques                                             |
| T4 → T6       | `bg-paper` `text-ink` `text-muted` `border-line` `text-accent` | déclarés en `@theme`, utilisés au layout                                                    | OK — les 5 existent                                              |
| T5 → T6       | `Link`, `usePathname`, `routing`                               | exportés par `@/i18n/navigation`                                                            | OK                                                               |
| T5 → T6       | clés de messages                                               | T6 utilise `nav.*`, `theme.*`, `language.label`, `footer.*`, `a11y.skipToContent`           | **F5** — `a11y.openMenu`/`closeMenu` déclarées, jamais utilisées |
| T5 → T7       | `getPathname`                                                  | signature `{href, locale}` utilisée par le sitemap                                          | OK                                                               |
| T5 → T8       | matcher de `src/proxy.ts`                                      | T8 attend un 410 sur `/admin`                                                               | **F3** — le matcher n'exclut pas `/admin`                        |
| T6 → T8       | `#main`, libellés FR exacts                                    | T8 sélectionne par ces chaînes                                                              | OK — identiques à `fr.json`                                      |
| T7 → T8       | `LEGACY_REDIRECTS`                                             | T8 vérifie 308 + destination                                                                | OK                                                               |
| T1,T8 → T9    | scripts npm `validate:archive`, `test:e2e`                     | déclarés en T2                                                                              | OK                                                               |

### Cohérence interne de chaque tâche

| Tâche | Le texte s'accorde-t-il avec lui-même ?                                                           |
| ----- | ------------------------------------------------------------------------------------------------- |
| T1    | **F1** — le script exige 2 expériences ; `Experience.tsx` en contient **3**                       |
| T2    | OK sauf F2                                                                                        |
| T3    | OK — les assertions du test correspondent au `tsconfig.json` écrit à l'étape 4                    |
| T4    | **F6** — le sélecteur `.dark html` ne peut jamais correspondre ; regex du test OK par ailleurs    |
| T5    | **F4** — le test suppose `localePrefix` sous forme de chaîne ; next-intl peut normaliser en objet |
| T6    | OK sauf F5                                                                                        |
| T7    | OK — `LEGACY_REDIRECTS` isolé du plugin de build, testable                                        |
| T8    | OK sauf F3                                                                                        |
| T9    | OK — n'appelle que des scripts déclarés en T2                                                     |

### Rulings

Ruling: **F1** — le script de validation de T1 doit exiger **3** expériences (`ecobank`,
`freelance`, `internship`), pas 2. Vérifié dans `src/components/Experience.tsx:19,36,52`. La spec
disait « 2 expériences » ; elle se trompait, le code fait foi. Coût si erroné : la validation
échoue bruyamment à T1 étape 5, auto-corrigeant.

Ruling: **F2** — préserver `src/app/favicon.ico` en le déplaçant hors de `src/app/` avant la
suppression de T2, puis en le replaçant en `src/app/favicon.ico`. Supprimer le favicon ferait
régresser le site sans que rien ne le rattrape. Coût si erroné : onglet sans icône, cosmétique,
détecté en revue.

Ruling: **F3** — le matcher de `src/proxy.ts` doit exclure `admin` :
`'/((?!api|studio|admin|_next|_vercel|.*\\..*).*)'`. Sans cela, next-intl réécrit `/admin` en
`/fr/admin` et le gestionnaire 410 de T8 n'est jamais atteint : le test échoue et, pire, l'URL
supprimée redevient une page. C'est le défaut le plus grave du scan. Coût si erroné : aucun —
`/admin` ne doit jamais être localisée.

Ruling: **F4** — le test de T5 accepte `localePrefix` sous forme de chaîne `'always'` **ou**
d'objet `{mode: 'always'}`. `node_modules` n'est pas installé, la forme réelle n'est pas
vérifiable maintenant ; l'assertion tolérante teste l'intention sans dépendre d'un détail
interne. Coût si erroné : négligeable, l'intention reste vérifiée.

Ruling: **F5** — retirer `a11y.openMenu` et `a11y.closeMenu` des deux fichiers de messages
(YAGNI, aucun menu mobile en plan 1) **et** rendre la navigation visible sur mobile
(`flex flex-wrap` au lieu de `hidden md:flex`). Un en-tête sans aucune navigation sous 768 px
n'est pas acceptable, même provisoirement. Le vrai menu mobile arrive au plan 3. Coût si
erroné : en-tête un peu dense sur petit écran dans l'intervalle, cosmétique.

Ruling: **F6** — supprimer le sélecteur `.dark html` de `globals.css` ; ne garder que
`html.dark`. next-themes pose la classe sur `<html>`, donc `.dark html` ne correspond à rien.
Coût si erroné : aucun, le sélecteur était mort.

---

## Progression

Task 1: implémentée par sonnet (agent a54f2038c32c3e427), commit 46b6862, validation 6/6 ok.

Ruling: **F7 (découvert en T1)** — `dev` avait **13 commits de retard sur `main`** : 4 projets et
4 images de projets manquants (`codearena-hero`, `expense`, `issue-sync`, `va-hire-hero`).
L'implémenteur avait contourné en copiant `projects.json` depuis `main`, ce qui traitait le
symptôme sans rapatrier les images. J'ai fusionné `origin/main` dans `dev` (commit 6903d19) pour
corriger la cause. Vérifié après fusion : `projects.json` de l'archive identique au source,
validation 6/6, et toutes les images locales référencées existent.
Vérifié aussi que `Experience.tsx` et `LanguageContext.tsx` étaient identiques entre les deux
branches — les expériences et le profil archivés n'étaient donc pas affectés.
Coût si erroné : la fusion ajoute un commit de merge sur `dev` ; annulable par `git reset`.

Note (plan 3) : les projets `syt-sas-api` et `chatbot-ai` n'ont aucune image dans l'archive.

Task 1: revue (sonnet, agent ab1e28f94c0e241ea) — spec ✅ ; qualité NON approuvée.
Fidélité du contenu : vérifiée clé par clé contre les sources, aucune perte, accents et
apostrophes typographiques préservés. Ce n'est pas le contenu qui est en cause.
Critique : contrôle `skills` vacuously vrai — `skills.json` = [] passe avec code 0 (démontré).
Important : contrôle `profile` ne teste que la présence des clés, pas leur contenu (démontré).
Mineur : `blog`/`services` ne vérifient que .length — 5 objets vides passent (démontré).
Mineur : `experiences` ne vérifie pas `technologies[]`.

Ruling: **F8** — le constat vise du code que mon propre plan prescrivait littéralement (T1
étape 4) ; le relecteur a raison contre le plan. La spec §8 pose l'archive comme source unique
de l'import Sanity, et un validateur qui accepte une archive vide ne remplit pas ce rôle — or il
s'exécute juste avant que T2 détruise `src/`, donc c'est la dernière barrière. Je durcis le
script. J'inclus les deux mineurs dans la même passe : ils relèvent du même défaut et de la même
fonction, les traiter séparément ferait éditer deux fois le même fichier. Coût si erroné : un
validateur plus strict pourrait refuser une archive légitimement partielle — improbable, et
l'échec serait bruyant et immédiat.
Task 1: fix round 1/5 (4 traités, 0 ouvert — skills vacuité, profile clés vides, blog/services
objets vides, experiences technologies ; commits 46b6862..e202e6f)
Re-revue (haiku, agent a2765a4685023ed8a) : les 4 TRAITÉS, reproduits indépendamment sur
copies hors dépôt, `git status` propre, archive réelle toujours 6/6 ok, aucune régression.
Task 1: complete (commits 9fbcb28..e202e6f, review clean)

Task 2: implémentée par sonnet (agent a3f7f1407447d1035), commit dc01173.
Vérifié indépendamment : npm audit 0 vulnérabilité (contre 23), 5 deps runtime
(next 16.3.4, react ^19.2.3, next-intl, next-themes, react-dom), favicon suivi par git,
archive toujours 6/6, arbre propre, src/ réduit à 4 fichiers.
Revue (sonnet, agent a5771d409191cb313) : spec ✅, qualité approuvée.
Task 2: minor (deferred): le message de commit dc01173 annonce « 60 dependencies » ; le compte
réel de l'ancien package.json était 73 deps runtime (27 paquets radix, pas 26). Erreur
provenant de mon plan, reprise verbatim. Immuable sans réécrire l'historique, aucun effet
fonctionnel — non corrigée délibérément.
Task 2: minor (deferred): tsconfig.json auto-modifié par next build (jsx react-jsx,
.next/dev/types) puis commité. Sans conséquence : T3 le réécrit intégralement.
Task 2: complete (commits e202e6f..dc01173, review clean)

Task 3: BLOQUÉ par l'implémenteur (sonnet, agent a3be0f780102c8b8b) — `FlatCompat.extends('next/…')`
lève `TypeError: Converting circular structure to JSON` dans @eslint/eslintrc@3.3.7.
typecheck OK, test 3/3 OK, lint exit 2, hook pre-commit bloqué. Rien commité, arbre propre.

Ruling: **F9** — c'est un défaut de mon plan, pas de l'outillage. Vérifié moi-même :

1. `eslint-config-next@16.3.4` livre une **config flat native** — `dist/core-web-vitals.js`
   exporte un tableau de 4 entrées, `dist/typescript.js` un tableau de 5. L'import ESM par
   défaut rend le tableau directement (vérifié : `Array.isArray(import) === true`).
   `FlatCompat` est le motif ESLint 8 ; il n'a plus lieu d'être et c'est lui qui crée la
   structure circulaire.
2. `next/core-web-vitals` **enregistre déjà** les plugins react, react-hooks, import,
   jsx-a11y, @next/next, @typescript-eslint, et 6 règles `jsx-a11y/`. Réenregistrer
   `jsx-a11y` dans une entrée séparée risque « Cannot redefine plugin » en flat config.
   Correction retenue : supprimer `FlatCompat`, spread des tableaux flat natifs, et injection
   des règles jsx-a11y **sans** réenregistrer le plugin. `@eslint/eslintrc` devient inutilisé →
   à retirer de devDependencies (contrainte « aucune dépendance non importée »).
   Coût si erroné : lint toujours cassé, constaté immédiatement — l'implémenteur doit prouver
   un exit 0.
   Task 3: implémentée par sonnet (agent a3be0f780102c8b8b), commit 54c4368 après application du
   ruling F9. Vérifié : lint exit 0 (0 erreur, 5 warnings), typecheck 0, test 3/3,
   @eslint/eslintrc retiré, tsconfig porte strict + noUncheckedIndexedAccess + allowJs false.
   Revue (sonnet, agent aa9b319e8e815f059) : spec ✅, qualité approuvée. A reproduit
   indépendamment l'injection de violation (no-unused-vars + jsx-a11y/alt-text → exit 1) ET
   testé le hook pre-commit sur un vrai commit (bloqué, code 1). Dépôt propre après.
   Task 3: À REPORTER SUR T4 — `tailwindStylesheet` de Prettier ne valide pas son chemin : avec
   `./src/styles/does-not-exist.css` le plugin ne lève rien et retombe sur son tri par défaut.
   Invisible tant que globals.css est provisoire. T4 doit prouver explicitement que le chemin
   résout, une fois le vrai @theme écrit.
   Task 3: minor (deferred): `.remember/tmp/last-ndc.ts` remonte un warning au lint. Fichier d'un
   outil tiers local, non suivi par git, absent en CI. Bruit local uniquement — `ignores` n'a pas
   été élargi car il correspond au brief au caractère près.
   Task 3: complete (commits dc01173..54c4368, review clean)

Task 4: premier dispatch interrompu par l'utilisateur APRÈS son commit (993f734) mais avant son
rapport — il laissait dev avec 2 tests rouges sur 8. Le second implémenteur (sonnet, agent
a35dc7700eafa64d1) l'a détecté en rejouant le TDD au lieu de faire confiance à l'état trouvé,
et a corrigé par 3e70273. Leçon de process : un dispatch interrompu peut laisser un commit
sans rapport ; toujours rejouer la vérification plutôt que présumer.

Ruling: **F10** — je refuse la correction retenue par l'implémenteur (exclure
`src/styles/globals.css` de Prettier via `.prettierignore`) et j'impose l'inverse : rendre
l'assertion du test insensible à la casse, et retirer la dérogation.
Motif : en CSS, `#F6F7F4` et `#f6f7f4` désignent la même couleur — la casse ne porte aucune
sémantique. Le contrat de la spec est la couleur, pas la casse. Or la dérogation prive de
formatage automatique le fichier le plus structurant du projet, celui qui va le plus grossir
au plan 3 (indentation, espacement, ordre) — c'est un coût permanent payé pour un gain nul.
Coût si erroné : les hexadécimaux s'affichent en minuscules et diffèrent visuellement du
tableau de la spec ; purement cosmétique, et le test continue de vérifier les couleurs exactes.
Task 4: fix round 1/5 (1 traité — ruling F10 appliqué ; commits 3e70273..3e90aba)
Revue complète (sonnet, agent ab93d416297447bbe) : spec ✅, qualité approuvée. A buildé
réellement et inspecté le CSS compilé (tokens non inertes), prouvé `@custom-variant dark` en
injectant des classes `dark:` dans un fichier temporaire, vérifié la correspondance exacte des
noms de variables entre fonts.ts et globals.css. Dépôt propre après.
Task 4: minor (deferred): le commentaire « ratio 1.25 » de l'échelle typo n'est exact que vers le
haut ; xs/sm reprennent les valeurs conventionnelles Tailwind. Défaut de mon brief, copié
verbatim, sans conséquence fonctionnelle.
Task 4: minor (deferred): tsconfig.json de nouveau auto-réécrit par next build et emporté dans le
commit ; aurait mérité un commit séparé pour la traçabilité. Bénin et idempotent.
Task 4: complete (commits 54c4368..3e90aba, review clean)

Task 5: implémentée par sonnet (agent a2fcc959e49c03840), commit f23917b. Rulings F3/F4/F5
appliqués et vérifiés : matcher exclut `admin`, `localePrefix` reste la chaîne 'always'
(defineRouting est une fonction identité), clés a11y réduites à `skipToContent`.
Routage réel vérifié : / → 307 → /fr, /fr → 200, /en → 200. 13/13 tests.

Ruling: **F11** — retirer entièrement le bloc `images` que l'implémenteur a repris de l'ancien
`next.config.mjs`. Il autorise 10 hôtes distants (dont justtotaltech.com,
refine-web.imgix.net, upload.wikimedia.org, cdn.worldvectorlogo.com) et active
`dangerouslyAllowSVG`, alors qu'aucun composant du projet n'affiche d'image — `src/` n'en
contient aucune. C'est un proxy d'images ouvert vers des domaines arbitraires, hérité d'un
site supprimé, et la spec §8 écarte explicitement les images de banque des anciens articles.
Le plan 2 rajoutera `cdn.sanity.io` quand Sanity servira réellement des images.
Coût si erroné : si un plan ultérieur avait besoin d'un de ces hôtes, l'erreur serait
explicite au premier rendu (« hostname not configured ») et la ligne se rajoute en 5 secondes.
Task 5: fix round 1/5 (1 traité — ruling F11, bloc images retiré ; commits f23917b..b7c9855)
Revue (sonnet, agent aefbf9dc79656f1db) : spec ✅, qualité NON approuvée.
Important : le matcher de proxy.ts n'est pas ancré aux segments — `/administrator`,
`/apikey`, `/studious`, `/_nextgen`, `/adminx` contournent tous le proxy (prouvé par requêtes
réelles). La regex teste un préfixe littéral sans exiger `/` ou fin de chaîne.
Le relecteur a aussi prouvé que les slugs localisés agissent réellement : /en/travaux → 307
→ /en/work et /fr/work → 307 → /fr/travaux (preuve absente du rapport de l'implémenteur).

Ruling: **F12** — défaut réel, à corriger. Il provient du matcher recommandé par la doc
next-intl que j'avais copié tel quel ; mon ajout de `admin` l'a élargi sans le créer. Impact
aujourd'hui nul (aucune route prévue ne commence par ces préfixes) mais latent : une future
route `/administration` ou `/apidocs` ne serait jamais localisée, silencieusement. Le coût de
la correction est d'une ligne, celui de la découverte tardive se compte en heures.
Coût si erroné : une regex trop stricte exclurait mal `/api` ou `/studio` — détectable
immédiatement par les requêtes de vérification exigées.
Task 5: fix round 2/5 (1 traité — ruling F12, matcher ancré aux segments ; commit 62cd370)
Vérifié : regex finale `/((?!(?:api|studio|admin|_next|_vercel)(?:/|$)|.*\..*).*)`,
commentaire mis à jour. L'implémenteur a prouvé les deux listes de chemins par requêtes
réelles : /admin,/admin/x,/api/x,/studio,/favicon.ico non redirigés ;
/administrator,/apikey,/studious,/adminx,/_nextgen désormais redirigés 307 vers /fr/...

Ruling: **F13** — un sous-agent a lancé `pnpm` pendant la ronde 2, créant `pnpm-lock.yaml`
(5977 lignes) et `pnpm-workspace.yaml` à 13:05. Non suivis mais NON ignorés : un `git add -A`
les aurait emportés, et Vercel choisit son gestionnaire de paquets d'après le fichier de
verrou présent — le build serait passé à pnpm. Supprimés par le contrôleur (débris de
sous-agent, pas un changement de code : pas de revue nécessaire). Volontairement NON ajoutés
au .gitignore, pour qu'une réapparition reste visible.
Coût si erroné : aucun, ces fichiers n'étaient pas voulus.
Re-revue ciblée (haiku, agent aff3a98d87acea258) : TRAITÉ, regex vérifiée sur les 20 chemins
attendus, commentaire conforme au comportement, aucune régression, arbre propre.
Task 5: complete (commits 3e90aba..62cd370, review clean)

Ruling: **F14** — `package-lock.json` est ignoré par git (.gitignore:42, convention
préexistante du dépôt). C'est un blocage dur, pas un détail de style : la CI écrite en T9
lance `npm ci`, qui **échoue sans fichier de verrou**. Et sans verrou commité, Vercel
réinstalle depuis les plages de versions à chaque build — `react: ^19.2.3` ou
`next-intl: ^4.14.2` peuvent dériver, ce qui vide de sa substance tout l'argumentaire de
compatibilité de versions de la spec §3 (next-sanity@13 exige next ^16 et react ^19.2.3).
Décision : retirer l'entrée du .gitignore, régénérer le verrou, le commiter, et prouver que
`npm ci` fonctionne.
Coût si erroné : un fichier de 336 Ko dans l'historique — le coût normal d'une application.

Task 6: implémentée par sonnet (agent aa8b52d0b0740a541), commit c7cb65f. build/lint/typecheck/
test en 0, /fr et /en marquées ● (SSG), en-tête et pied traduits présents dans le HTML servi,
lien d'évitement et #main présents. Vérifié : aucun import de next/link, aucun hex dans les
composants.
Deux écarts au brief imposés par l'outillage, à faire examiner en revue : theme-toggle réécrit
avec useSyncExternalStore (la version du brief violait react-hooks/set-state-in-effect), et
language-switch réécrit avec useParams() + un @ts-expect-error documenté par next-intl (la
version du brief cassait le typecheck à cause des routes dynamiques dans routing.pathnames).

Ruling: **F15** — `text-white` sur `bg-accent` dans skip-link.tsx doit devenir `text-paper`.
Calcul de contraste WCAG fait moi-même : text-white sur l'accent clair #1F5140 = 9,09:1 (OK)
mais sur l'accent sombre #6CC3A2 = **2,11:1 (échec)**. `text-paper` donne 8,46:1 en clair et
8,94:1 en sombre, parce qu'il s'inverse avec le thème — c'est précisément la raison d'être des
rôles sémantiques. La valeur absolue `text-white` venait de mon propre brief. Défaut
d'accessibilité réel, sur l'élément destiné aux utilisateurs de clavier et de lecteur d'écran,
alors que la spec §9 exige l'accessibilité. Seule occurrence dans tout `src/`.
Coût si erroné : aucun, les deux ratios sont vérifiés supérieurs à 8:1.
Task 6: fix round 1/5 (1 traité — ruling F15, text-white → text-paper ; commit 065700f)
Revue (sonnet, agent a66cbac11e81e57b4) : spec ✅, qualité approuvée. A lancé un vrai
navigateur : thème persistant après rechargement, aucun flash, nav visible et sans débordement
à 360px ET 320px. A vérifié les deux écarts au brief : `react-hooks/set-state-in-effect` sort
bien en ERREUR sur le code du brief (reproduit), et le motif useParams()+@ts-expect-error est
celui officiellement documenté par next-intl (vérifié via Context7). Ratios de contraste
recalculés indépendamment, identiques aux miens. Dépôt propre après.
Task 6: minor (deferred): décalage de mise en page réel au montage de theme-toggle — le
placeholder fait 32×32 px, le bouton monté ≈68×26 px. Hérité de mon brief, pas de l'écart
useSyncExternalStore. À traiter au plan 4 : la spec fixe un budget CLS < 0,05.
Task 6: À REPORTER SUR T8 — `[locale]/not-found.tsx` n'est atteignable que par un `notFound()`
explicite (garde hasLocale) ; un chemin arbitraire invalide retombe sur le `/_not-found`
global auto-généré. Confirmé dans la sortie de build.
Task 6: À REPORTER SUR LE PLAN 3 — la conservation de la page courante par language-switch n'est
pas vérifiable de bout en bout aujourd'hui : seule la page d'accueil existe. Le raisonnement
par le code et la doc indique que ce sera correct, mais à revérifier dès qu'une page à slug
existera.
Task 6: complete (commits be3766a..065700f, review clean)

Task 7: implémentée par sonnet (agent aded56ea32ac9ada1), commit b98cc4c. 21/21 tests, six
redirections 308 vérifiées en HTTP réel, /admin en 404 hors table, robots et sitemap générés,
4 en-têtes présents sur /fr.
Revue (sonnet, agent a6021c8af19f247d4) : spec ✅, qualité NON approuvée — 3 constats importants.
A vérifié que les six redirections couvrent exactement les pages indexables de l'ancien site
(comparaison avec git show dc01173^) : aucune URL oubliée. Slugs localisés du sitemap corrects.

Ruling: **F16 (constat 3, sitemap) — À CORRIGER** : le sitemap annonce `/fr/expertise`,
`/fr/travaux`, `/fr/parcours`, `/fr/ecrits`, `/fr/contact` et leurs équivalents `/en`, qui
répondent tous 404 — seule `/` existe dans ce plan. Vérifié en HTTP réel par le relecteur.
Le plan 1 se veut « déployable sur Vercel » : soumettre un sitemap majoritairement en 404 nuit
activement au référencement qu'on cherche à préserver. Défaut de découpage de mon plan (le
sitemap précède les pages). Correction : restreindre STATIC_PAGES aux routes qui existent,
avec un commentaire pointant le plan 3 pour les autres.
Coût si erroné : le sitemap listera temporairement moins d'URLs que le site final n'en aura —
sans conséquence, il est régénéré à chaque build.

Ruling: **F17 (constat 2, CSP) — REPORTÉ APRÈS T8, PAS ABANDONNÉ** : la spec §9 exige un CSP,
mon brief de T7 lui a substitué `X-Content-Type-Options` sans le justifier. Lacune réelle.
Mais un CSP correct sur Next 16 impose des nonces générés dans `proxy.ts`, or ce fichier porte
le routage i18n et a déjà demandé deux rondes de correction ; et le script inline de
next-themes doit recevoir le nonce sous peine de casser le thème silencieusement.
Décision : implémenter le CSP APRÈS la tâche 8, une fois la suite Playwright en place — elle
fournira précisément le filet qui prouvera que ni le routage ni le thème n'ont cassé. Le faire
maintenant, c'est modifier proxy.ts sans test de bout en bout pour l'attraper.
Coût si erroné : le CSP arrive deux tâches plus tard que prévu ; il ne disparaît pas.

Ruling: **F18 (constat 1, en-têtes sur les redirections) — PARQUÉ** : les six réponses 308 ne
portent pas les en-têtes de sécurité. Vérifié empiriquement : c'est le comportement de Next
(`headers()` ne s'applique pas aux réponses de `redirects()`), pas un motif trop étroit — une
page, un 404, un fichier statique, robots.txt et sitemap.xml les portent tous.
Constat réel mais non porteur : une 308 n'a pas de corps exploitable, ne peut pas être mise en
cadre utilement, et il n'existe pas de moyen propre de forcer ces en-têtes sur la sortie de
`redirects()` sans réimplémenter les redirections dans le proxy — ce qui coûterait bien plus
cher que le risque évité. Le relecteur note lui-même l'impact comme limité.
Coût si erroné : négligeable.
Task 7: fix round 1/5 (1 traité — ruling F16, sitemap restreint ; commit 7b8ae95)
Re-revue ciblée (haiku, agent ad89a77e7ca74aa3b) : TRAITÉ. Sitemap réduit à /fr et /en, les
deux en 200, XML bien formé, alternances réciproques, six redirections toujours 308,
robots.txt intact, aucune régression, dépôt propre.
Task 7: complete (commits 065700f..7b8ae95, 2 parqués : F17 CSP reporté après T8, F18 en-têtes
sur redirections parqué)

Task 8: implémentée par sonnet (agent adc3c086870e0b3a1), commit c20b7e4. 7/7 Playwright,
21/21 unitaires. 5 parcours sur 7 éprouvés par mutation ; les 2 restants (redirection racine,
conservation de page au changement de langue) ont leurs mécanismes dans des fichiers hors
limites — limitation acceptée et explicitement documentée.

Ruling: **F19** — l'implémenteur a ajouté `locale: 'fr-FR'` à la config Playwright parce que
Chromium headless envoie `Accept-Language: en-US`, ce qui redirigeait `/` vers `/en`. Son
diagnostic est juste et la correction nécessaire. Mais elle laisse un angle mort : le test
ainsi forcé passerait aussi si la négociation de langue était cassée et redirigeait
toujours vers `/fr`. Or `/` → langue détectée est une vraie fonctionnalité de la spec §4.3,
et le portfolio vise autant un public francophone local qu'un public anglophone international.
Décision : tester les DEUX sens — un contexte `fr-FR` doit atterrir sur `/fr`, un contexte
`en-US` sur `/en`. C'est la paire qui prouve la négociation ; isolément, chaque moitié ne
prouve rien.
Coût si erroné : un test de plus à maintenir.
Task 8: fix round 1/5 (1 traité — ruling F19, négociation testée dans les deux sens ;
commits c20b7e4..1209283). Preuve par mutation élégante : `localeDetection: false` casse
uniquement le test en-US → /en, fr-FR → /fr passant par coïncidence.
Revue (sonnet, agent a464ae378d264bc27) : spec ✅, qualité NON approuvée — 2 critiques,
1 important, tous reproduits indépendamment par mutation.

Ruling: **F20 (critique 1) — À CORRIGER** : le test du 410 ne couvre que GET. Le relecteur a
cassé le gestionnaire POST en laissant GET intact : la suite reste verte. Le gestionnaire
implémente bien les 5 méthodes, mais rien ne le protège. C'est exactement le risque que la
tâche existe pour couvrir — l'ancienne page d'administration acceptait des écritures non
authentifiées. Coût si erroné : un test un peu plus long.

Ruling: **F21 (critique 2) — RENOMMER MAINTENANT, RENFORCER AU PLAN 3** : le test du changement
de langue ne peut pas échouer sur son mécanisme réel. Prouvé : forcer LanguageSwitch à toujours
lier vers `/` laisse la suite verte, parce que le test ne visite que la racine, où `/` se
traduit par `/` dans les deux langues. Le renforcer exigerait une page à slug divergent
(/fr/parcours ↔ /en/about) — or aucune n'existe, et un 404 ne rend pas l'en-tête. Impossible
aujourd'hui, pas par négligence mais par découpage du plan.
Décision : renommer le test pour qu'il annonce ce qu'il prouve réellement, et documenter en
clair dans le fichier ce qu'il ne prouve pas encore et quand le renforcer. Un test dont le nom
surpromet est plus dangereux qu'un test modeste. Reporté au plan 3.
Coût si erroné : la préservation du chemin reste non couverte jusqu'au plan 3 — déjà le cas.

Ruling: **F22 (important 3) — À CORRIGER** : `/contact` et `/blog/:slug` ne sont jamais exercées
en HTTP réel. Prouvé : casser la destination de `/contact` laisse la suite verte. Le test
unitaire de T7 ne couvre que la donnée statique `LEGACY_REDIRECTS`, pas son câblage réel via
`next.config.ts`. Trou hérité de mon brief, repris verbatim. Ces URLs sont indexées : une
redirection cassée est une perte de référencement silencieuse.
Coût si erroné : deux lignes de test de plus.

Note (info, hors périmètre T8) : `/Admin` en casse différente n'est pas exclu par le matcher
(regex sensible à la casse) — redirigé 307 vers /fr/Admin puis 404. Aucune fuite de contenu,
l'ancienne page est supprimée. Signalé par le relecteur pour information.
Task 8: fix round 2/5 — l'implémenteur d'origine (adc3c086870e0b3a1) s'est bloqué sans rien
produire (watchdog, 600s sans progrès) ; dépôt vérifié intact à 1209283, aucun nettoyage
nécessaire. Relancé avec un implémenteur neuf (aaffbbed0e6ebcdd6), commit 00b24f0.
(3 traités, 0 ouvert — F20 méthodes du 410, F21 renommage honnête, F22 deux redirections)
Re-revue ciblée (haiku, agent a8840f1e6e35ed986) : les 3 TRAITÉS, mutations A et B reproduites
indépendamment et faisant bien échouer les bons tests, 8/8 e2e, 21/21 unitaires, arbre propre.
Task 8: complete (commits 7b8ae95..00b24f0, review clean)

Note (environnement) : deuxième contamination pnpm observée pendant T8 — pnpm-lock.yaml,
pnpm-workspace.yaml et un node_modules/@playwright/test lié vers un store pnpm, cassant
l'installation de Playwright. Nettoyée. Vérifié : ces fichiers n'ont JAMAIS atteint
l'historique git. Risque réel si l'un passait : Vercel bascule le build sur pnpm.

Task 9: implémentée par sonnet (agent ace50cd4f75b34e27), commit 943df15 (non poussé).
Séquence complète verte sur un `npm ci` à froid : validate:archive, lint (0 erreur,
5 warnings préexistants), typecheck, test 21/21, build, test:e2e 8/8. Aucune contamination
pnpm cette fois. L'implémenteur a correctement refusé de trancher seul la divergence Node.

Ruling: **F23** — le workflow fixe Node 22, l'environnement local tourne en Node 24.18.0, et
Vercel construit par défaut sur Node 24 LTS. Une CI qui valide une majeure de Node différente
de celle de production peut passer au vert pendant que le déploiement casse — la CI devient
alors trompeuse plutôt qu'utile, ce qui est pire que pas de CI. Décision : aligner le workflow
sur Node 24, qui correspond à la fois au poste de développement et au runtime de déploiement.
Coût si erroné : si Vercel repassait à une autre majeure, la CI validerait de nouveau autre
chose que la production — détectable au premier échec de déploiement, et corrigeable en une
ligne. Note pour le plan 4 : envisager un `.nvmrc` comme source unique, lue à la fois par la
CI et par Vercel, plutôt qu'un numéro dupliqué.
Task 9: fix round 1/5 (1 traité — ruling F23, Node 24 ; commit 0ecab4e)
Revue (sonnet, agent a278d44d221775ac9) : spec ✅, qualité approuvée avec 1 important.

Ruling: **F24 — À CORRIGER** : l'étape `upload-artifact` du workflow ne peut jamais rien
téléverser. `playwright.config.ts` fixe `reporter: process.env.CI ? 'github' : 'list'` ; or
`github` est un reporter console uniquement, seul le reporter `html` écrit le dossier
`playwright-report/`. GitHub Actions positionne CI=true, donc en CI le dossier n'existe jamais
et `upload-artifact` (défaut `if-no-files-found: warn`) se contente d'un avertissement
silencieux. L'étape tourne, ne casse rien, et ne produit jamais le diagnostic qu'elle promet.
Contradiction entre deux de mes propres tâches (T8 écrit le reporter, T9 l'étape d'upload) que
mon scan pré-vol n'a pas attrapée : j'avais vérifié la paire T8→T9 sur les scripts npm, pas
sur l'interaction reporter/artefact. Angle mort réel.
Correction : reporters combinés en CI (`github` pour l'affichage dans l'interface GitHub,
`html` pour le fichier téléversable). J'y joins la déduplication du build (mineur du même
relecteur, même fichier) : `webServer.command` lance `npm run build && npm start` alors que
l'étape Build vient de tourner — un build complet en double sur chaque PR.
Coût si erroné : diagnostic toujours absent en cas d'échec CI, détectable au premier échec réel.

Task 9: minor (deferred): `@types/node: ^22` dans package.json alors que le workflow déclare
Node 24. Antérieur à T9, sans impact fonctionnel connu. À aligner au plan 4, avec le .nvmrc.
Task 9: minor (deferred): le document de plan affiche encore `node-version: 22` — instantané
figé, sans effet d'exécution.
Task 9: fix round 2/5 (1 traité — ruling F24 ; commit 44e7db2)
Re-revue ciblée (haiku, agent a42f4c029a5d4ad70) : TRAITÉ. Local sans CI → 8/8, aucun
playwright-report/. Avec CI → 8/8 et playwright-report/index.html de 523 411 octets écrit.
BUILD_ID identique avant/après : pas de reconstruction. Aucune régression, arbre propre.
Task 9: complete (commits 00b24f0..44e7db2, review clean)

=== TOUTES LES TÂCHES TERMINÉES — revue finale de branche ===

=== REVUE FINALE DE BRANCHE (opus, agent afe90943bff9caef3) ===
Verdict : fusionnable SOUS CONDITIONS. 3 critiques, 7 importants, 8 mineurs.
Aucun des constats déjà connus ne bloque (CSP, en-têtes sur 308, test de langue, CLS, types
Node, images d'archive, warnings de lint — tous arbitrés « peut attendre » avec motifs).
Ce qui bloque naît uniquement de la COMPOSITION, invisible à toute revue par tâche.

Ruling: **F25 — NE PAS FUSIONNER VERS MAIN** (C1+C2). Les 5 liens de l'en-tête (T6) pointent
vers des routes déclarées par T5 que personne ne crée avant le plan 3, et les 6 redirections
de T7 visent ces mêmes routes. Or sur `main` aujourd'hui /about, /projects, /blog, /contact,
/resume répondent 200 (vérifié : git ls-tree origin/main). Fusionner remplacerait 5 pages
vivantes et indexées par 5 pages 404 — exactement la perte de référencement que §4.4 existe
pour empêcher. Le plan 1 est une fondation, pas un remplacement de production.
Décision : `dev` reste sur l'aperçu Vercel jusqu'à ce que le plan 3 livre les pages. Décision
du partenaire humain in fine, mais je recommande fermement l'attente.
Coût si erroné : aucun — attendre ne coûte rien, fusionner casse un site en production.

Ruling: **F26 — CORRIGER MAINTENANT (I1, sécurité)** : j'ai écrit le mot de passe
d'administration en clair dans docs/.../spec.md:43, dans un dépôt public. Il n'était
jusque-là que dans l'historique ; le commiter l'a rendu greppable dans le HEAD. L'objet
premier de cette refonte était de supprimer cette faille : en republier la trace la plus
lisible dans le document qui la dénonce est indéfendable. Ma faute.
Coût si erroné : aucun.

Ruling: **F27 — CORRIGER MAINTENANT (C3, métadonnées)** : aucun `metadata` ni
`generateMetadata` dans tout src/. C'est une RÉGRESSION : a9a2e47:src/app/layout.tsx
déclarait title, description, keywords, authors. Critère §11.4 (hreflang croisé) non tenu.
Cheap à corriger, et laisser le site sans <title> serait pire que l'ancien.

Ruling: **F28 — CORRIGER MAINTENANT (C1 partiel, 404 nu)** : le 404 global n'a ni attribut
`lang` (échec WCAG 3.1.1), ni style, ni en-tête. Conséquence du choix de groupe `(site)` sans
`src/app/layout.tsx` — mon plan. Les pages manquantes relèvent du plan 3, mais la DÉGRADATION
du 404 est structurelle et corrigeable maintenant.

Ruling: **F29 — CORRIGER MAINTENANT (lot d'hygiène)** : I2 prettier non vérifié en CI et 6
fichiers non formatés (+ package-lock.json absent de .prettierignore, `npm run format`
réécrirait 346 Ko) · I3 README décrivant Next 14, Framer Motion et l'ancien positionnement ·
I4 sitemap sans <loc> propre pour /en · I5 aucun pin Node dans le dépôt · I7 aria-label
« Accueil » sur la navigation principale · M8 NEXT_PUBLIC_SITE_URL non documenté · M5 SVG
résiduels de create-next-app. Tous cheap, tous réels, une seule passe.

Passe de correction finale (sonnet, agent a26b5062a32e3ab9e) : 6 commits 33c8acd..fd4395d.
Re-revue (sonnet, agent a52a816627424afa1) : les 8 constats TRAITÉS, vérifiés par requêtes
réelles. Séquence complète verte : format:check, validate:archive, lint (0 erreur), typecheck,
test 21/21, build (/fr et /en toujours ●), test:e2e 10/10. Six redirections et /admin 410
inchangés. Aucune régression.

Ruling: **F30 — PARQUÉ** : sur le chemin `notFound()` déclenché depuis une route dynamique,
Next 16.3.4 sert d'abord une coquille `<html id="__next_error__">` sans attribut `lang` et,
sans JavaScript, au corps vide — le texte « Page introuvable » n'existe que dans le payload JS.
Reproduit indépendamment par le relecteur, y compris sur un chemin échappant au proxy i18n :
c'est bien un comportement du moteur de rendu, absent des pages normales (`/fr` porte
`lang="fr"` dès le premier octet). L'implémenteur a essayé racine de layout,
force-static/force-dynamic et global-not-found.tsx sans pouvoir le changer.
Parqué : la page réellement vue par un utilisateur ou un lecteur d'écran est correcte
(prouvée par 10/10 tests Playwright en navigateur réel), et il s'agit d'une page d'erreur non
indexée. Le relecteur a ajouté une précision que le rapport minimisait : sans JS le corps est
vide, pas seulement le `lang` absent.
Coût si erroné : un visiteur sans JavaScript voit une page blanche sur une URL inexistante.

Ruling: **F31 — CSP FINALEMENT REPORTÉ AU PLAN 2, PAS FAIT APRÈS T8** : j'avais annoncé le
livrer après la tâche 8. La revue finale, qui disposait de l'état complet, a arbitré
« peut attendre, borné au plan 2 » : surface d'attaque actuelle nulle (aucune entrée
utilisateur, aucun script tiers, aucun contenu externe rendu), et il doit impérativement
atterrir AVANT que Sanity et le formulaire de contact n'introduisent des entrées. Je me range
à cet arbitrage : le livrer maintenant, sur une branche qui ne sera pas fusionnée, ajouterait
du risque sur proxy.ts sans bénéfice. Je change donc d'avis par rapport à ce que j'ai annoncé.
Coût si erroné : le site reste sans CSP pendant la durée du plan 2 — sans entrée utilisateur.
