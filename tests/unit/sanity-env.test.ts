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
 *
 * Les tests ci-dessous portent sur le comportement réel des exports
 * (`projectId`, `dataset`, `readToken`), pas sur `assertValue` appelé de
 * façon isolée avec des valeurs fabriquées : un test qui ne fait que ça
 * reste vert même si le module cesse d'appeler `assertValue` sur ses
 * propres variables, ou si son message d'erreur devient générique. Chaque
 * cas vérifie donc à la fois l'échec/succès ET que le message nomme la
 * variable fautive.
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

describe('chargement du module', () => {
  it('lit projectId, dataset et apiVersion depuis des valeurs factices', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'test-dataset';

    const env = await import('@/sanity/env');

    expect(env.projectId).toBe('test-project-id');
    expect(env.dataset).toBe('test-dataset');
    expect(env.apiVersion).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('lève quand NEXT_PUBLIC_SANITY_PROJECT_ID manque, en nommant la variable', async () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'test-dataset';

    await expect(import('@/sanity/env')).rejects.toThrow(/NEXT_PUBLIC_SANITY_PROJECT_ID/);
  });

  it('lève quand NEXT_PUBLIC_SANITY_PROJECT_ID est une chaîne vide, en nommant la variable', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = '';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'test-dataset';

    await expect(import('@/sanity/env')).rejects.toThrow(/NEXT_PUBLIC_SANITY_PROJECT_ID/);
  });

  it('lève quand NEXT_PUBLIC_SANITY_DATASET manque, en nommant la variable', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id';
    delete process.env.NEXT_PUBLIC_SANITY_DATASET;

    await expect(import('@/sanity/env')).rejects.toThrow(/NEXT_PUBLIC_SANITY_DATASET/);
  });

  it('lève quand NEXT_PUBLIC_SANITY_DATASET est une chaîne vide, en nommant la variable', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id';
    process.env.NEXT_PUBLIC_SANITY_DATASET = '';

    await expect(import('@/sanity/env')).rejects.toThrow(/NEXT_PUBLIC_SANITY_DATASET/);
  });
});

describe('readToken', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'test-dataset';
  });

  it('lève quand SANITY_API_READ_TOKEN manque, en nommant la variable', async () => {
    delete process.env.SANITY_API_READ_TOKEN;

    const {readToken} = await import('@/sanity/env');

    expect(() => readToken()).toThrow(/SANITY_API_READ_TOKEN/);
  });

  it('lève quand SANITY_API_READ_TOKEN est une chaîne vide, en nommant la variable', async () => {
    process.env.SANITY_API_READ_TOKEN = '';

    const {readToken} = await import('@/sanity/env');

    expect(() => readToken()).toThrow(/SANITY_API_READ_TOKEN/);
  });

  it('renvoie la valeur quand SANITY_API_READ_TOKEN est présent', async () => {
    process.env.SANITY_API_READ_TOKEN = 'test-token-value';

    const {readToken} = await import('@/sanity/env');

    expect(readToken()).toBe('test-token-value');
  });
});

describe('assertValue', () => {
  it.each([
    ['absente', undefined],
    ['vide', ''],
  ])('lève avec le message fourni quand la valeur est %s', async (_label, value) => {
    // Valeurs factices minimales pour que le chargement du module réussisse :
    // ce cas éprouve `assertValue` isolément, en complément des tests
    // ci-dessus qui vérifient que le module l'invoque bien sur ses propres
    // variables.
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id';
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'test-dataset';

    const {assertValue} = await import('@/sanity/env');

    expect(() => assertValue(value, 'message factice de test')).toThrow(/message factice de test/);
  });
});

describe('surface publique', () => {
  it("n'expose jamais le token de lecture sous un nom public", () => {
    const source = readFileSync(new URL('../../src/sanity/env.ts', import.meta.url), 'utf8');
    expect(source).not.toMatch(/NEXT_PUBLIC_[A-Z_]*TOKEN/);
  });
});
