import {describe, expect, it} from 'vitest';
import tsconfig from '../../tsconfig.json';

describe('configuration du projet', () => {
  it('active le mode strict de TypeScript', () => {
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  it('interdit les accès indexés non vérifiés', () => {
    expect(tsconfig.compilerOptions.noUncheckedIndexedAccess).toBe(true);
  });

  it("n'autorise pas le JavaScript", () => {
    expect(tsconfig.compilerOptions.allowJs).toBe(false);
  });
});
