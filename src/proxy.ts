import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Tout sauf /api, /studio, /admin, les internes Next/Vercel et les
  // fichiers (tout chemin contenant un point).
  // /admin est exclu ici parce qu'une tâche ultérieure y répond 410 Gone
  // (ancienne page d'administration supprimée) : si next-intl réécrivait
  // /admin en /fr/admin avant que ce gestionnaire ne soit atteint, l'URL
  // supprimée redeviendrait accessible.
  matcher: '/((?!api|studio|admin|_next|_vercel|.*\\..*).*)',
};
