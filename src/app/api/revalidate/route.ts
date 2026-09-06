import {parseBody} from 'next-sanity/webhook';
import {revalidateTag} from 'next/cache';
import {NextRequest, NextResponse} from 'next/server';

/**
 * Webhook appelé par Sanity à chaque publication. La signature est vérifiée :
 * sans elle, n'importe qui pourrait forcer une régénération du site.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new NextResponse('Webhook non configuré', {status: 500});
  }

  const {isValidSignature, body} = await parseBody<{_type?: string}>(request, secret);

  if (!isValidSignature) {
    return new NextResponse('Signature invalide', {status: 401});
  }

  if (!body?._type) {
    return new NextResponse('Corps sans _type', {status: 400});
  }

  // L'étiquette purgée est le `_type` brut envoyé par Sanity. C'est aussi
  // celle que `fetchContent` enregistre au point d'appel (voir
  // `src/sanity/lib/fetch.ts`) : les deux côtés emploient le même nom sans
  // transformation, précisément pour qu'aucune divergence ne puisse
  // s'installer entre eux — une divergence ne se verrait qu'en production,
  // sous la forme d'un contenu qui cesse de se mettre à jour.
  //
  // Next.js 16 exige un second argument (profil de durée de vie).
  // `{expire: 0}` reproduit le comportement historique à un seul
  // argument : une invalidation immédiate, indispensable pour un webhook
  // déclenché juste après une publication.
  revalidateTag(body._type, {expire: 0});
  return NextResponse.json({revalidated: true, type: body._type});
}
