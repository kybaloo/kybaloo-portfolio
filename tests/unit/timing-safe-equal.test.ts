import {describe, expect, it} from 'vitest';
import {timingSafeEqualStrings} from '@/app/api/draft-mode/_lib/timing-safe-equal';

/**
 * `crypto.timingSafeEqual` lève quand les deux tampons diffèrent en taille :
 * la comparaison de longueur préalable n'est pas un raccourci de
 * performance mais la condition d'emploi de la primitive. Ces tests
 * couvrent donc surtout ce que l'API sous-jacente refuse de faire seule.
 */
describe('comparaison à temps constant de deux secrets', () => {
  it('reconnaît deux chaînes identiques', () => {
    expect(timingSafeEqualStrings('s3cr3t', 's3cr3t')).toBe(true);
  });

  it('rejette deux chaînes de même longueur mais de contenu différent', () => {
    expect(timingSafeEqualStrings('s3cr3t', 's3cr3u')).toBe(false);
  });

  it('rejette des longueurs différentes sans lever', () => {
    expect(() => timingSafeEqualStrings('court', 'beaucoup plus long')).not.toThrow();
    expect(timingSafeEqualStrings('court', 'beaucoup plus long')).toBe(false);
  });

  it('rejette une chaîne vide face à un secret', () => {
    expect(timingSafeEqualStrings('', 's3cr3t')).toBe(false);
  });

  /**
   * La longueur qui compte est celle des octets UTF-8, pas celle des
   * caractères : « é » occupe deux octets. Comparer `String.length` puis
   * passer les tampons à `timingSafeEqual` ferait lever la primitive sur
   * des chaînes de même longueur en caractères mais pas en octets.
   */
  it('compare des octets, pas des caractères', () => {
    expect(() => timingSafeEqualStrings('é', 'ab')).not.toThrow();
    expect(timingSafeEqualStrings('é', 'ab')).toBe(false);
    expect(timingSafeEqualStrings('éé', 'éé')).toBe(true);
  });
});
