import {notFound} from 'next/navigation';

// Sans cette route, une URL inconnue sous /fr ou /en (ex. /fr/page-inexistante)
// ne correspond à aucun segment défini : Next.js sert alors son 404 global
// (`app/_not-found` / `global-not-found.tsx`, voir src/app/global-not-found.tsx),
// qui ne connaît pas la locale visitée. Ce catch-all intercepte tout ce qui
// n'a pas de page dédiée *à l'intérieur* du segment `[locale]` déjà résolu,
// ce qui fait passer la requête par `layout.tsx` (donc <html lang>, polices,
// couleurs) puis par `not-found.tsx` du même dossier — vérifié par requête
// réelle dans un navigateur (tests/e2e/foundations.spec.ts) : `lang`, le
// titre et le lien d'accueil sont bien présents une fois la page hydratée.
// Note : sur la toute première réponse HTTP brute (curl, sans JS), Next.js
// 16.3 sert un instant une coquille interne générique pour les 404
// déclenchés depuis une route dynamique (`notFound()` ici) avant que le
// contenu localisé ne s'hydrate — comportement du moteur de rendu en
// streaming, pas de ce fichier ni de not-found.tsx.
export default function CatchAll(): never {
  notFound();
}
