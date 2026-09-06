import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {beforeAll, describe, expect, it} from 'vitest';

/**
 * `scripts/import-archive.mjs` écrit dans un vrai projet Sanity via
 * `createOrReplace`, qui remplace des documents entiers : le lancer pour le
 * tester détruirait le contenu réel, y compris les saisies faites à la main
 * dans le Studio. Le script expose donc `--dry-run`, qui construit tous les
 * documents et les imprime sans ouvrir la moindre connexion — c'est ce mode
 * que ces tests exercent, sur la vraie archive de `docs/content-archive/`.
 *
 * Ils portent sur la transformation (quels documents, quels champs, quelles
 * langues), pas sur l'écriture, qui n'est pas du code à nous.
 */

const SCRIPT = fileURLToPath(new URL('../../scripts/import-archive.mjs', import.meta.url));

type SanityDocument = {
  _id: string;
  _type: string;
  [field: string]: unknown;
};

type I18nEntry = {_key: string; _type: string; language: string; value: string};

let stdout = '';
let documents: SanityDocument[] = [];

const documentById = (id: string): SanityDocument => {
  const found = documents.find((doc) => doc._id === id);
  if (!found) throw new Error(`document absent de l’import : ${id}`);
  return found;
};

const i18nValue = (field: unknown, language: string): string | undefined =>
  (field as I18nEntry[] | undefined)?.find((entry) => entry.language === language)?.value;

beforeAll(() => {
  // Aucune variable d'environnement fournie, délibérément : une exécution à
  // blanc qui exigerait un jeton d'écriture serait une exécution à blanc en
  // trompe-l'œil.
  stdout = execFileSync(process.execPath, [SCRIPT, '--dry-run'], {
    encoding: 'utf8',
    // `NODE_ENV` n'est là que parce que Next.js le déclare obligatoire sur
    // `ProcessEnv` ; le script ne le lit pas.
    env: {PATH: process.env.PATH, NODE_ENV: 'test'},
  });

  const start = stdout.indexOf('--- documents (début) ---');
  const end = stdout.indexOf('--- documents (fin) ---');
  expect(start, 'le mode à blanc n’imprime pas les documents').toBeGreaterThan(-1);
  documents = JSON.parse(stdout.slice(start + '--- documents (début) ---'.length, end));
});

describe('import de l’archive — exécution à blanc', () => {
  it('annonce clairement qu’il n’écrit rien', () => {
    expect(stdout).toMatch(/aucune écriture/i);
  });

  it('avertit que `createOrReplace` remplace les documents entiers', () => {
    expect(stdout).toMatch(/createOrReplace/);
    expect(stdout).toMatch(/remplace/i);
  });
});

describe('singletons profile et settings', () => {
  /**
   * Les deux singletons portent des identifiants fixes, imposés par
   * `src/sanity/structure.ts`, qui ouvre `S.document().documentId('profile')`
   * et `documentId('settings')`. Un autre identifiant produirait un document
   * que le Studio n'ouvrirait jamais.
   */
  it('écrit le profil et les réglages sous les identifiants attendus', () => {
    expect(documentById('profile')._type).toBe('profile');
    expect(documentById('settings')._type).toBe('settings');
  });

  it('les nomme dans le récapitulatif des documents écrits', () => {
    expect(stdout).toMatch(/profil/i);
    expect(stdout).toMatch(/réglages/i);
  });

  /**
   * Le piège de ce constat : la bio archivée porte l'ancien positionnement
   * (« Développeur Full Stack », « Développeur Web & SQL chez Ecobank »),
   * que l'auteur a explicitement rejeté. L'importer telle quelle rétablirait
   * dans Sanity ce que toute la refonte cherche à quitter.
   */
  it('n’importe jamais l’ancien positionnement de développeur généraliste', () => {
    const serialized = JSON.stringify([documentById('profile'), documentById('settings')]);
    for (const rejected of [
      'Développeur Full Stack',
      'Full Stack Developer',
      'Analyste de Données',
      'Data Analyst',
      'Développeur Web & SQL',
      'Web & SQL Developer',
    ]) {
      expect(serialized, `l’ancien positionnement revient : ${rejected}`).not.toContain(rejected);
    }
  });

  it('porte le message central de la spec dans les deux langues', () => {
    const profile = documentById('profile');
    expect(i18nValue(profile.bio, 'fr')).toContain(
      'Je conçois, construis et fais évoluer des systèmes numériques.',
    );
    expect(i18nValue(profile.bio, 'en')).toContain('I design, build and improve digital systems.');
  });

  it('porte le titre d’architecte', () => {
    const profile = documentById('profile');
    for (const language of ['fr', 'en']) {
      expect(i18nValue(profile.role, language)).toMatch(/Technology Architect/);
      expect(i18nValue(profile.role, language)).toMatch(/Technology Consultant/);
    }
  });

  it('laisse l’amorce manifestement provisoire', () => {
    const profile = documentById('profile');
    for (const language of ['fr', 'en']) {
      expect(i18nValue(profile.bio, language)).toMatch(/studio/i);
    }
    expect(stdout).toMatch(/à réécrire par l’auteur dans le Studio/i);
  });

  it('donne aux réglages un titre et une description qui portent le positionnement', () => {
    const settings = documentById('settings');
    expect(i18nValue(settings.title, 'fr')).toMatch(/Architecte technologique/);
    expect(i18nValue(settings.title, 'en')).toMatch(/Technology Architect/);
    expect(i18nValue(settings.description, 'fr')).toBeTruthy();
    expect(i18nValue(settings.description, 'en')).toBeTruthy();
  });
});

describe('champs internationalisés — sans `language`, le texte est invisible', () => {
  /**
   * `sanity-plugin-internationalized-array` filtre sur un champ `language`
   * dédié, distinct de `_key`. L'omettre laisse l'écriture réussir : l'API
   * n'y valide rien. Le texte reste alors introuvable pour les requêtes
   * GROQ (`bio[language == $language]`) comme pour le Studio — une panne
   * silencieuse, que seul ce contrôle rend visible.
   */
  it('pose un `language` sur chaque entrée internationalisée de chaque document', () => {
    const offenders: string[] = [];

    const walk = (value: unknown, path: string): void => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => walk(item, `${path}[${index}]`));
        return;
      }
      if (value === null || typeof value !== 'object') return;

      const entry = value as {_type?: string; language?: unknown};
      if (typeof entry._type === 'string' && entry._type.startsWith('internationalizedArray')) {
        if (typeof entry.language !== 'string' || entry.language.length === 0) {
          offenders.push(path);
        }
      }
      for (const [key, child] of Object.entries(value)) walk(child, `${path}.${key}`);
    };

    for (const doc of documents) walk(doc, doc._id);

    expect(offenders).toEqual([]);
  });
});

describe('récapitulatif — il doit dire quelle langue manque, par type de document', () => {
  /**
   * L'ancien message annonçait « traductions anglaises » pour tout l'import.
   * C'est vrai des projets, dont le résumé archivé est en français ; c'est
   * l'inverse pour les expériences, dont la description et les réalisations
   * ne sont peuplées qu'en anglais — or `/fr/parcours` est servi dans la
   * langue par défaut du site.
   */
  it('signale l’anglais manquant pour les projets', () => {
    expect(stdout).toMatch(/projets[\s\S]{0,200}anglais/i);
  });

  it('signale le français manquant pour les expériences', () => {
    expect(stdout).toMatch(/expériences[\s\S]{0,200}français/i);
  });

  it('signale le libellé de poste écrit à l’identique dans les deux langues', () => {
    expect(stdout).toMatch(/poste/i);
    expect(stdout).toMatch(/relire/i);
  });
});
