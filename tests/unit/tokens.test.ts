import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const css = readFileSync(new URL('../../src/styles/globals.css', import.meta.url), 'utf8');

/** Extrait la valeur d'une variable dans le premier bloc portant ce sélecteur. */
function tokenIn(selector: string, name: string): string | undefined {
  const block = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return block?.[1]?.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
}

/**
 * Les hexadécimaux CSS sont insensibles à la casse (#F6F7F4 et #f6f7f4 sont
 * la même couleur), et Prettier normalise systématiquement les couleurs en
 * minuscules dans ce fichier. Comparer en minuscules teste donc la couleur —
 * le seul contrat qui compte — au lieu de tester le formateur.
 */
function expectColor(actual: string | undefined, expected: string) {
  expect(actual?.toLowerCase()).toBe(expected.toLowerCase());
}

describe('tokens de couleur', () => {
  it('déclare la palette claire dans @theme', () => {
    expectColor(tokenIn('@theme', 'color-paper'), '#F6F7F4');
    expectColor(tokenIn('@theme', 'color-ink'), '#111512');
    expectColor(tokenIn('@theme', 'color-accent'), '#1F5140');
    expectColor(tokenIn('@theme', 'color-highlight'), '#D9A441');
    expectColor(tokenIn('@theme', 'color-highlight-ink'), '#111512');
  });

  it('redéfinit la palette sombre sous .dark', () => {
    expectColor(tokenIn('\\.dark', 'color-paper'), '#0F1211');
    expectColor(tokenIn('\\.dark', 'color-ink'), '#E7EAE6');
    expectColor(tokenIn('\\.dark', 'color-accent'), '#6CC3A2');
    expectColor(tokenIn('\\.dark', 'color-highlight-ink'), '#0F1211');
  });

  it('active le mode sombre par classe et non par préférence système', () => {
    expect(css).toMatch(/@custom-variant\s+dark/);
  });
});

describe('interdits de la spec', () => {
  it("n'utilise aucun dégradé", () => {
    expect(css).not.toMatch(/linear-gradient|radial-gradient/);
  });

  it('ne déclare aucun rayon supérieur à 8px', () => {
    const radii = [...css.matchAll(/--radius-[a-z]+:\s*(\d+)px/g)].map((m) => Number(m[1]));
    expect(radii.length).toBeGreaterThan(0);
    expect(Math.max(...radii)).toBeLessThanOrEqual(8);
  });
});
