import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {fontVariables} from '@/lib/fonts';
import '@/styles/globals.css';

// Racine dédiée (convention `global-not-found`, activée par
// `experimental.globalNotFound` dans next.config.ts) pour les 404 qui
// échappent complètement au groupe (site) — c'est-à-dire tout ce qui
// n'atteint jamais (site)/[locale]/layout.tsx, donc n'a pas de <html lang>
// ni de style sans ce fichier. La locale n'est pas connue à cet endroit : on
// retombe sur la langue par défaut du site plutôt que de laisser `lang`
// absent (échec WCAG 3.1.1).
//
// Pour les 404 *à l'intérieur* d'une locale valide (ex. /fr/page-inexistante),
// voir plutôt (site)/[locale]/[...rest]/page.tsx et .../not-found.tsx, qui
// rendent la version localisée et stylée normalement.
export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale} className={fontVariables}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">404</p>
        <h1 className="font-serif text-3xl">Page introuvable</h1>
        <Link
          href="/"
          locale={routing.defaultLocale}
          className="mt-3 inline-block text-accent underline underline-offset-4"
        >
          Accueil
        </Link>
      </body>
    </html>
  );
}
