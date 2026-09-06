import {draftMode} from 'next/headers';
import {redirect} from 'next/navigation';
import {NextRequest} from 'next/server';
import {resolveInternalRedirectPath} from '../_lib/resolve-internal-path';

/**
 * Active le mode brouillon de Next pour prévisualiser du contenu non publié.
 * Protégée par un secret : sans lui, n'importe qui pourrait lire les
 * brouillons du Studio.
 */
export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') ?? '/';

  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return new Response('Prévisualisation non configurée', {status: 500});
  }

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return new Response('Secret invalide', {status: 401});
  }

  // Ne rediriger que vers un chemin interne : une URL absolue, une URL
  // protocole-relative ou un schéma exotique permettraient une
  // redirection ouverte. Voir `resolveInternalRedirectPath`.
  const safePath = resolveInternalRedirectPath(slug);
  if (safePath === null) {
    return new Response('Chemin invalide', {status: 400});
  }

  (await draftMode()).enable();
  redirect(safePath);
}
