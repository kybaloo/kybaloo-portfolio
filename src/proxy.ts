import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Le proxy s'applique à tout, sauf :
  //   - /api, /studio, /admin, /_next, /_vercel — uniquement quand le nom
  //     forme un segment de chemin entier (suivi de "/" ou fin de
  //     chaîne), pas un simple préfixe littéral. Sans cette ancre,
  //     "/administrator" ou "/apikey" seraient exclus au même titre que
  //     "/admin" ou "/api", alors qu'ils devraient être localisés.
  //   - tout chemin contenant un point (fichiers statiques, ex.
  //     favicon.ico).
  // /admin est exclu ici parce qu'une tâche ultérieure y répond 410 Gone
  // (ancienne page d'administration supprimée) : si next-intl réécrivait
  // /admin en /fr/admin avant que ce gestionnaire ne soit atteint, l'URL
  // supprimée redeviendrait accessible.
  matcher: '/((?!(?:api|studio|admin|_next|_vercel)(?:/|$)|.*\\..*).*)',
};
