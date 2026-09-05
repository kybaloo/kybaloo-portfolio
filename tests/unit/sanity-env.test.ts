import {readFileSync} from 'node:fs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

/**
 * `src/sanity/env.ts` lit `process.env` au chargement du module, pas à
 * l'appel. On pose donc des valeurs factices dans `process.env` avant
 * d'importer dynamiquement le module (jamais d'import statique en tête de
 * fichier), et on réinitialise le registre de modules à chaque test pour
 * forcer une réexécution du module avec les valeurs du moment. Sans projet
 * Sanity réel, ces valeurs ne servent qu'à éprouver la logique de
 * validation — jamais à contacter l'API Sanity.
 */

const ENV_KEYS = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'NEXT_PUBLIC_SANITY_STUDIO_URL',
  'SANITY_API_READ_TOKEN',
] as const;

const savedEnv: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

beforeEach(() => {
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
  }
  vi.resetModules();
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    const previous = savedEnv[key];
    if (previous === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = previous;
    }
  }
  vi.resetModules();
});

describe('environnement Sanity', () => {
  it('lit projectId, dataset et apiVersion depuis des valeurs factices', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'test-dataset';

    const env = await import('@/sanity/env');

    expect(env.projectId).toBe('test-project-id');
    expect(env.dataset).toBe('test-dataset');
    expect(env.apiVersion).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it.each([
    ['absente', undefined],
    ['vide', ''],
  ])('assertValue lève avec le message fourni quand la valeur est %s', async (_label, value) => {
    // Valeurs factices minimales pour que le chargement du module réussisse :
    // ce cas éprouve `assertValue` isolément, pas la validation au chargement.
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'test-dataset';

    const {assertValue} = await import('@/sanity/env');

    expect(() => assertValue(value, 'message factice de test')).toThrow(/message factice de test/);
  });

  it("n'expose jamais le token de lecture sous un nom public", () => {
    const source = readFileSync(new URL('../../src/sanity/env.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/NEXT_PUBLIC_[A-Z_]*TOKEN/);
  });
});
