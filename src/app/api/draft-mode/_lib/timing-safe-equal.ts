import {timingSafeEqual} from 'node:crypto';

/**
 * Compare deux secrets sans que la durée de la comparaison dépende du
 * nombre de caractères initiaux qui coïncident.
 *
 * Sur un secret de 256 bits transporté en HTTP, le gain est théorique : le
 * bruit réseau couvre largement l'écart mesurable d'un `===`. Mais la
 * primitive ne coûte rien, et l'alternative — un `===` — obligerait à
 * rejustifier ce choix à chaque relecture.
 *
 * `timingSafeEqual` **lève** si les deux tampons diffèrent en taille : la
 * comparaison de longueur qui la précède est donc sa condition d'emploi,
 * pas une optimisation. Elle divulgue la longueur du secret attendu, ce
 * qu'aucune implémentation de cette primitive ne peut éviter et qui
 * n'apporte rien à un attaquant face à un secret aléatoire.
 *
 * La longueur comparée est celle des octets UTF-8, pas des caractères :
 * `String.length` compte des unités de code UTF-16 et laisserait passer
 * des tampons de tailles différentes — donc lever — pour des chaînes
 * pourtant « de même longueur ».
 */
export function timingSafeEqualStrings(candidate: string, expected: string): boolean {
  const candidateBytes = Buffer.from(candidate, 'utf8');
  const expectedBytes = Buffer.from(expected, 'utf8');

  if (candidateBytes.length !== expectedBytes.length) {
    return false;
  }

  return timingSafeEqual(candidateBytes, expectedBytes);
}
