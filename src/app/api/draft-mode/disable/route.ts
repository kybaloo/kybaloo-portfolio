import {draftMode} from 'next/headers';
import {redirect} from 'next/navigation';
import {NextRequest} from 'next/server';
import {resolveInternalRedirectPath} from '../_lib/resolve-internal-path';

/**
 * Désactive le mode brouillon : retire le cookie posé par
 * `/api/draft-mode/enable` et fait revenir la personne au contenu publié.
 *
 * Volontairement **non protégée par un secret**, contrairement à `enable`.
 * L'asymétrie est délibérée :
 *
 * - `enable` accorde un privilège (lire des brouillons du Studio) : sans
 *   secret, n'importe qui pourrait l'obtenir. C'est une élévation de droits,
 *   elle doit être authentifiée.
 * - `disable` retire ce privilège pour la requête courante uniquement — le
 *   cookie `draftMode` est scopé au navigateur de l'appelant. Un secret ici
 *   ne protégerait rien qui ne le soit déjà : quiconque possède un lien
 *   d'entrée valide connaît forcément le secret (il est dans l'URL), donc
 *   exiger un second secret pour sortir n'ajoute aucune barrière — ça
 *   ajoute seulement de la friction à une action sans risque. Le pire
 *   scénario réaliste sans protection (un lien malveillant qui fait sortir
 *   quelqu'un de sa propre prévisualisation) est un désagrément, pas une
 *   compromission : aucune donnée n'est révélée, aucun accès n'est accordé.
 *
 * La redirection reste soumise à la même validation de chemin que `enable`
 * (voir `resolveInternalRedirectPath`) : retirer le secret ne doit pas
 * rouvrir la redirection ouverte que celui-ci fermait par ailleurs.
 */
export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const slug = searchParams.get('slug') ?? '/';

  const safePath = resolveInternalRedirectPath(slug);
  if (safePath === null) {
    return new Response('Chemin invalide', {status: 400});
  }

  (await draftMode()).disable();
  redirect(safePath);
}
