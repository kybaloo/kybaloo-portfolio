import {describe, expect, it} from 'vitest';
import * as queries from '@/sanity/queries';

const ALL = Object.entries(queries).filter(([name]) => name.endsWith('_QUERY'));

describe('requêtes GROQ', () => {
  it('exporte les sept requêtes attendues', () => {
    expect(ALL.map(([name]) => name).sort()).toEqual(
      [
        'FEATURED_PROJECTS_QUERY',
        'POSTS_QUERY',
        'POST_BY_SLUG_QUERY',
        'PROFILE_QUERY',
        'PROJECTS_QUERY',
        'PROJECT_BY_SLUG_QUERY',
        'SERVICES_QUERY',
      ].sort(),
    );
  });

  it('filtre les champs internationalisés sur `language`, pas sur `_key`', () => {
    // `_key ==` appartient à la v4 du plugin et renvoie undefined en v5.
    for (const [name, query] of ALL) {
      expect(String(query), `${name} utilise la syntaxe obsolète`).not.toMatch(/\[_key\s*==/);
    }
  });

  it('paramètre la langue au lieu de la coder en dur', () => {
    for (const [name, query] of ALL) {
      const text = String(query);
      if (text.includes('[language ==')) {
        expect(text, `${name} code la langue en dur`).toMatch(/\[language == \$language\]/);
      }
    }
  });

  it('ne renvoie jamais de brouillon dans les requêtes publiques', () => {
    for (const [name, query] of ALL) {
      expect(String(query), `${name} peut renvoyer des brouillons`).not.toMatch(/drafts\./);
    }
  });
});
