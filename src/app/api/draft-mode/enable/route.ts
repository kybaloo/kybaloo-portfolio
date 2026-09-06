import {draftMode} from 'next/headers';
import {redirect} from 'next/navigation';
import {NextRequest} from 'next/server';
import {resolveInternalRedirectPath} from '../_lib/resolve-internal-path';
import {timingSafeEqualStrings} from '../_lib/timing-safe-equal';

/**
 * Active le mode brouillon de Next pour prévisualiser du contenu non publié.
 * Protégée par un secret : sans lui, n'importe qui pourrait lire les
 * brouillons du Studio.
 *
 * Ce secret est `SANITY_PREVIEW_SECRET`, distinct de
 * `SANITY_REVALIDATE_SECRET` employé par le webhook. Les deux répondent à
 * des frontières de confiance différentes : celui-ci voyage **dans l'URL**
 * — donc dans l'historique du navigateur, les en-têtes `Referer`, les
 * aperçus de liens et les journaux de proxy —, tandis que celui du webhook
 * est une clé HMAC qui ne quitte jamais le serveur. Les confondre ferait
 * qu'une fuite de lien de prévisualisation permettrait aussi de forger des
 * webhooks signés.
 */
export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') ?? '/';

  const expectedSecret = process.env.SANITY_PREVIEW_SECRET;
  if (!expectedSecret) {
    return new Response('Prévisualisation non configurée', {status: 500});
  }

  if (secret === null || !timingSafeEqualStrings(secret, expectedSecret)) {
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
