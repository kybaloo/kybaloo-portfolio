import {describe, expect, it} from 'vitest';
import {schemaTypes} from '@/sanity/schemas';

const byName = (name: string) => schemaTypes.find((t) => t.name === name);

describe('schémas Sanity', () => {
  it('déclare les singletons profile et settings', () => {
    expect(byName('profile')).toBeDefined();
    expect(byName('settings')).toBeDefined();
  });

  it('déclare les objets réutilisables', () => {
    expect(byName('bullet')).toBeDefined();
    expect(byName('link')).toBeDefined();
    expect(byName('outcome')).toBeDefined();
  });

  it("n'a aucun nom de type en double", () => {
    const names = schemaTypes.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('donne un titre à chaque type — le Studio est inutilisable sans', () => {
    for (const type of schemaTypes) {
      expect(type.title, `type sans titre : ${type.name}`).toBeTruthy();
    }
  });
});
