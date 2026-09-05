import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const css = readFileSync(new URL('../../src/styles/globals.css', import.meta.url), 'utf8');

/** Extrait la valeur d'une variable dans le premier bloc portant ce sélecteur. */
function tokenIn(selector: string, name: string): string | undefined {
  const block = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`));
  return block?.[1]?.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
}

describe('tokens de couleur', () => {
  it('déclare la palette claire dans @theme', () => {
    expect(tokenIn('@theme', 'color-paper')).toBe('#F6F7F4');
    expect(tokenIn('@theme', 'color-ink')).toBe('#111512');
    expect(tokenIn('@theme', 'color-accent')).toBe('#1F5140');
    expect(tokenIn('@theme', 'color-highlight')).toBe('#D9A441');
    expect(tokenIn('@theme', 'color-highlight-ink')).toBe('#111512');
  });

  it('redéfinit la palette sombre sous .dark', () => {
    expect(tokenIn('\\.dark', 'color-paper')).toBe('#0F1211');
    expect(tokenIn('\\.dark', 'color-ink')).toBe('#E7EAE6');
    expect(tokenIn('\\.dark', 'color-accent')).toBe('#6CC3A2');
    expect(tokenIn('\\.dark', 'color-highlight-ink')).toBe('#0F1211');
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
