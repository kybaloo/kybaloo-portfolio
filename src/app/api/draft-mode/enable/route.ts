import {draftMode} from 'next/headers';
import {redirect} from 'next/navigation';
import {NextRequest} from 'next/server';

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

  // Ne rediriger que vers un chemin interne : une URL absolue permettrait
  // une redirection ouverte.
  if (!slug.startsWith('/')) {
    return new Response('Chemin invalide', {status: 400});
  }

  (await draftMode()).enable();
  redirect(slug);
}
