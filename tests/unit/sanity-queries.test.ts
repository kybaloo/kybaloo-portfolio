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
    // Intention : aucune requête ne doit comparer un champ `language` à un
    // littéral — ni le filtre de champ internationalisé
    // (`role[language == $language]`), ni le filtre document des articles
    // (`_type == "post" && language == $language`). Un motif syntaxique
    // unique (`[language ==`) manquerait cette seconde forme ; on cherche
    // donc directement toute comparaison de `language` qui ne cible pas
    // `$language`, quelle que soit sa position dans la requête.
    //
    // Attention : une vérification négative placée après un quantificateur
    // variable (`\s*(?!\$language\b)`) se fait piéger par le retour en
    // arrière du moteur de regex. Sur `language == $language`, le moteur
    // peut faire reculer le `\s*` d'un cran pour retenter la vérification à
    // une position où le texte ne commence plus par `$language` — la
    // vérification négative réussit alors à tort et le motif « matche »
    // une requête pourtant correcte. On capture donc explicitement la
    // cible de la comparaison et on la compare à `$language`, plutôt que de
    // s'appuyer sur une assertion négative après un `\s*`.
    const languageComparison = /\blanguage\s*==\s*([^\s\]);,&|]+)/g;

    const findHardcodedLanguage = (text: string): string[] => {
      const hits: string[] = [];
      languageComparison.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = languageComparison.exec(text))) {
        if (match[1] !== '$language') hits.push(match[0]);
      }
      return hits;
    };

    // Forme "filtre de champ internationalisé" codée en dur : attrapée.
    expect(findHardcodedLanguage('role[language == "fr"]')).toEqual(['language == "fr"']);
    // Forme "filtre document" codée en dur : attrapée.
    expect(
      findHardcodedLanguage('*[_type == "post" && language == "fr" && defined(publishedAt)]'),
    ).toEqual(['language == "fr"']);
    // Comparaison légitime et sans rapport : jamais signalée.
    expect(findHardcodedLanguage('*[_type == "project" && featured == true]')).toEqual([]);

    for (const [name, query] of ALL) {
      const hits = findHardcodedLanguage(String(query));
      expect(hits, `${name} code la langue en dur : ${hits.join(', ')}`).toEqual([]);
    }
  });

  it('ne renvoie jamais de brouillon dans les requêtes publiques', () => {
    for (const [name, query] of ALL) {
      expect(String(query), `${name} peut renvoyer des brouillons`).not.toMatch(/drafts\./);
    }
  });
});
