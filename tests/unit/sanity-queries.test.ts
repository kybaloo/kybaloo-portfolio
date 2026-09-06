import {describe, expect, it} from 'vitest';
import * as queries from '@/sanity/queries';

const ALL = Object.entries(queries).filter(([name]) => name.endsWith('_QUERY'));

describe('requêtes GROQ', () => {
  it('exporte les dix requêtes attendues', () => {
    expect(ALL.map(([name]) => name).sort()).toEqual(
      [
        'EXPERIENCES_QUERY',
        'FEATURED_PROJECTS_QUERY',
        'POSTS_QUERY',
        'POST_BY_SLUG_QUERY',
        'PROFILE_QUERY',
        'PROJECTS_QUERY',
        'PROJECT_BY_SLUG_QUERY',
        'SERVICES_QUERY',
        'SETTINGS_QUERY',
        'SKILLS_QUERY',
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

describe('tri des requêtes de liste — un ordre stable d’une requête à l’autre', () => {
  /**
   * `orderings` dans les schémas est une métadonnée du **Studio** : elle ne
   * s'applique jamais aux requêtes du site. Le test correspondant de
   * `sanity-schemas.test.ts` vérifie donc une déclaration qui ne protège que
   * les listes du Studio ; celui-ci porte sur les requêtes que le site
   * exécute réellement.
   *
   * Sans dernier critère de départage, deux documents dont tous les critères
   * de tri sont égaux (ou également absents) peuvent permuter d'une requête
   * à l'autre : la liste change d'ordre sans qu'aucun contenu n'ait bougé.
   */
  /**
   * Un simple `/order\(([^)]*)\)/` s'arrêterait à la première parenthèse
   * fermante et couperait `order(defined(startDate) desc, ...)` en plein
   * milieu : le test passerait alors à côté du vrai dernier critère. On
   * compte donc la profondeur des parenthèses, et on ne découpe les
   * critères que sur les virgules de premier niveau.
   */
  const orderClauses = (query: string): string[] => {
    const clauses: string[] = [];
    const opening = /\|\s*order\(/g;
    let match: RegExpExecArray | null;
    while ((match = opening.exec(query))) {
      let depth = 1;
      let index = match.index + match[0].length;
      const start = index;
      while (index < query.length && depth > 0) {
        if (query[index] === '(') depth++;
        else if (query[index] === ')') depth--;
        index++;
      }
      clauses.push(query.slice(start, index - 1));
    }
    return clauses;
  };

  const criteriaOf = (clause: string): string[] => {
    const criteria: string[] = [];
    let depth = 0;
    let current = '';
    for (const character of clause) {
      if (character === '(') depth++;
      if (character === ')') depth--;
      if (character === ',' && depth === 0) {
        criteria.push(current.trim());
        current = '';
        continue;
      }
      current += character;
    }
    criteria.push(current.trim());
    return criteria;
  };

  it('repère la clause de tri d’une requête, parenthèses imbriquées comprises', () => {
    expect(orderClauses('*[_type == "x"] | order(a asc, _id asc) { _id }')).toEqual([
      'a asc, _id asc',
    ]);
    expect(
      orderClauses('*[_type == "x"] | order(defined(d) desc, d desc, _id asc) { _id }'),
    ).toEqual(['defined(d) desc, d desc, _id asc']);
    expect(orderClauses('*[_type == "x"] { _id }')).toEqual([]);
  });

  it('découpe les critères sur les virgules de premier niveau seulement', () => {
    expect(criteriaOf('coalesce(a, b) desc, _id asc')).toEqual(['coalesce(a, b) desc', '_id asc']);
  });

  it('termine chaque tri par `_id asc`', () => {
    const sorted = ALL.filter(([, query]) => orderClauses(String(query)).length > 0);
    // Garde-fou : si plus aucune requête ne triait, la boucle ci-dessous
    // passerait à vide et ce test cesserait de prouver quoi que ce soit.
    expect(sorted.length).toBeGreaterThan(0);

    for (const [name, query] of sorted) {
      for (const clause of orderClauses(String(query))) {
        expect(criteriaOf(clause).at(-1), `${name} trie sans critère de départage stable`).toBe(
          '_id asc',
        );
      }
    }
  });
});

describe('traductions croisées des articles', () => {
  /**
   * `@sanity/document-internationalization` relie les versions FR et EN par
   * un document `translation.metadata` distinct : la version anglaise d'un
   * article n'est atteignable depuis la version française que par ce
   * document. Sans lui, `/fr/ecrits/[slug]` ne peut pas émettre son
   * `hreflang` vers son homologue anglais (critère d'acceptation 4).
   */
  it('expose l’homologue d’un article dans l’autre langue', () => {
    expect(String(queries.POST_BY_SLUG_QUERY)).toMatch(/translation\.metadata/);
    expect(String(queries.POST_BY_SLUG_QUERY)).toMatch(/translations\[/);
  });
});

describe('compétences — la preuve plutôt que la déclaration', () => {
  /**
   * `skill.projects[]` est un tableau de références. Sans déréférencement,
   * une requête ne renvoie que des `_ref` opaques : la page ne pourrait ni
   * nommer ni relier les projets qui prouvent la compétence.
   */
  it('dépointe les projets référencés', () => {
    expect(String(queries.SKILLS_QUERY)).toMatch(/projects\[\]->/);
  });
});
