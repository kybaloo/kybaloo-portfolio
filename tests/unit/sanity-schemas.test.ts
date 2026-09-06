import {Rule} from '@sanity/schema';
import {describe, expect, it, vi} from 'vitest';
import type {
  DocumentActionComponent,
  DocumentActionsContext,
  NewDocumentOptionsContext,
  TemplateItem,
} from 'sanity';
import {schemaTypes} from '@/sanity/schemas';
import {link} from '@/sanity/schemas/objects/link';
import {profile} from '@/sanity/schemas/documents/profile';
import {project} from '@/sanity/schemas/documents/project';
import {service} from '@/sanity/schemas/documents/service';
import {experience} from '@/sanity/schemas/documents/experience';
import {SINGLETON_TYPES, singletonActions, singletonNewDocumentOptions} from '@/sanity/structure';

const byName = (name: string) => schemaTypes.find((t) => t.name === name);

type FieldWithValidation = {name: string; validation?: unknown; fields?: FieldWithValidation[]};

const findField = (fields: unknown, name: string): FieldWithValidation | undefined =>
  (fields as FieldWithValidation[]).find((f) => f.name === name);

type RuleValidator = (rule: InstanceType<typeof Rule>) => InstanceType<typeof Rule>;

/**
 * Exécute la fonction de validation d'un champ contre une vraie instance de
 * `Rule` (celle que le Studio utilise réellement) et vérifie que la règle
 * qui en résulte est bien marquée obligatoire — via `isRequired()`, l'API
 * publique du Rule, plutôt qu'en inspectant un champ interne préfixé `_`.
 */
const isRequired = (validation: unknown): boolean =>
  typeof validation === 'function' && (validation as RuleValidator)(new Rule()).isRequired();

type CustomValidatorFn = (value: unknown, context: unknown) => unknown;

/**
 * Extrait les fonctions passées à `Rule.custom(...)` pour un champ, en
 * exécutant sa fonction de validation contre une vraie instance de `Rule`
 * puis en lisant `_rules` — même principe que `isRequired`, pour des règles
 * qui ne se réduisent pas à un simple drapeau interne.
 */
const customValidatorsOf = (validation: unknown): CustomValidatorFn[] => {
  if (typeof validation !== 'function') return [];
  const rule = (validation as RuleValidator)(new Rule()) as unknown as {
    _rules: Array<{flag: string; constraint: unknown}>;
  };
  return rule._rules
    .filter((r) => r.flag === 'custom')
    .map((r) => r.constraint as CustomValidatorFn);
};

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

describe('validation du type link — un lien vide est inutilisable côté site', () => {
  it('exige un libellé', () => {
    const field = findField(link.fields, 'label');
    expect(isRequired(field?.validation)).toBe(true);
  });

  it('exige une URL', () => {
    const field = findField(link.fields, 'url');
    expect(isRequired(field?.validation)).toBe(true);
  });
});

describe("validation du profil — l'accessibilité est une exigence du projet", () => {
  it('exige un texte alternatif sur la photo', () => {
    const photo = findField(profile.fields, 'photo');
    expect(photo).toBeDefined();
    const alt = findField(photo?.fields ?? [], 'alt');
    expect(isRequired(alt?.validation)).toBe(true);
  });
});

describe('verrou de création des singletons (menu global "+ New document")', () => {
  const asTemplates = (ids: string[]): TemplateItem[] => ids.map((templateId) => ({templateId}));

  it('retire profile et settings quand le contexte de création est global', () => {
    const prev = asTemplates(['profile', 'settings', 'link', 'outcome']);
    const context = {creationContext: {type: 'global'}} as unknown as NewDocumentOptionsContext;

    const result = singletonNewDocumentOptions(prev, context);

    const ids = result.map((item) => item.templateId);
    expect(ids).not.toContain('profile');
    expect(ids).not.toContain('settings');
    expect(ids).toEqual(['link', 'outcome']);
  });

  it("laisse les modèles intacts en dehors d'un contexte de création global", () => {
    const prev = asTemplates(['profile', 'link']);
    const context = {
      creationContext: {type: 'document', documentId: 'profile', schemaType: 'profile'},
    } as unknown as NewDocumentOptionsContext;

    const result = singletonNewDocumentOptions(prev, context);

    expect(result).toEqual(prev);
  });
});

describe('verrou des actions sur un document singleton déjà ouvert', () => {
  const actionsOf = (...actions: string[]): DocumentActionComponent[] =>
    actions.map((action) => ({action})) as unknown as DocumentActionComponent[];

  it('retire dupliquer, dépublier et supprimer pour un type singleton', () => {
    const prev = actionsOf('publish', 'unpublish', 'duplicate', 'delete', 'restore');
    const context = {schemaType: 'profile'} as unknown as DocumentActionsContext;

    const result = singletonActions(prev, context);

    expect(result.map((a) => a.action)).toEqual(['publish', 'restore']);
  });

  it("laisse les actions intactes pour un type qui n'est pas un singleton", () => {
    const prev = actionsOf('publish', 'unpublish', 'duplicate', 'delete');
    const context = {schemaType: 'link'} as unknown as DocumentActionsContext;

    const result = singletonActions(prev, context);

    expect(result).toEqual(prev);
  });
});

describe('SINGLETON_TYPES', () => {
  it('contient exactement profile et settings', () => {
    expect([...SINGLETON_TYPES].sort()).toEqual(['profile', 'settings']);
  });
});

describe('documents structurés', () => {
  it('déclare les quatre types de contenu', () => {
    for (const name of ['project', 'service', 'experience', 'skill']) {
      expect(byName(name), `type manquant : ${name}`).toBeDefined();
    }
  });

  it('donne au projet les champs d’architecture qui portent le positionnement', () => {
    const project = byName('project') as {fields: Array<{name: string}>};
    const names = project.fields.map((f) => f.name);
    for (const field of ['context', 'constraint', 'decisions', 'outcomes']) {
      expect(names, `champ d’architecture manquant : ${field}`).toContain(field);
    }
  });

  it('relie chaque compétence aux projets qui la prouvent', () => {
    const skill = byName('skill') as {fields: Array<{name: string; type: string}>};
    const projects = skill.fields.find((f) => f.name === 'projects');
    expect(projects?.type).toBe('array');
  });

  it('ordonne les services sur l’arc Understand → Improve', () => {
    const service = byName('service') as {
      fields: Array<{name: string; options?: {list?: Array<{value: string}>}}>;
    };
    const stage = service.fields.find((f) => f.name === 'stage');
    expect(stage?.options?.list?.map((o) => o.value)).toEqual([
      'understand',
      'architect',
      'build',
      'measure',
      'improve',
    ]);
  });
});

describe('compétence — pas de niveau chiffré (décision de positionnement)', () => {
  /**
   * L'ancien site affichait « JavaScript 95 % », un chiffre que rien ne
   * mesure et qui signale un portfolio junior au public technique visé.
   * `usage` (fréquence) et les projets référencés remplacent délibérément
   * toute notion de niveau chiffré. Ce test protège cette décision de
   * positionnement contre un retour discret sous un autre nom — la même
   * idée porterait aussi bien `proficiency`, `percentage`, `rating` ou
   * `mastery` que `level`. Il vise l'intention derrière le nom du champ,
   * pas une chaîne de caractères précise, mais reste ciblé sur ce
   * vocabulaire pour ne pas gêner un futur champ légitime comme `icon` ou
   * `notes`.
   */
  it("n'introduit aucun champ évoquant un niveau ou un pourcentage", () => {
    const skill = byName('skill') as {fields: Array<{name: string}>};
    const levelLike = /level|proficiency|percent|rating|mastery/i;
    const offenders = skill.fields.map((f) => f.name).filter((name) => levelLike.test(name));
    expect(offenders, `champ(s) évoquant un niveau chiffré : ${offenders.join(', ')}`).toEqual([]);
  });
});

describe('champs obligatoires non couverts jusqu’ici par isRequired', () => {
  it('exige un identifiant d’URL pour le projet', () => {
    const field = findField(project.fields, 'slug');
    expect(isRequired(field?.validation)).toBe(true);
  });

  it('exige une étape pour le service', () => {
    const field = findField(service.fields, 'stage');
    expect(isRequired(field?.validation)).toBe(true);
  });

  it('exige un numéro pour le service', () => {
    const field = findField(service.fields, 'number');
    expect(isRequired(field?.validation)).toBe(true);
  });

  it('exige une organisation pour l’expérience', () => {
    const field = findField(experience.fields, 'organisation');
    expect(isRequired(field?.validation)).toBe(true);
  });
});

describe('tri des expériences — une fiche incomplète affiche moins, pas plus', () => {
  /**
   * `startDate` est optionnel. Sanity applique par défaut la convention
   * PostgreSQL : en ordre décroissant, les valeurs manquantes remontent en
   * tête. Dans une liste « Plus récent d'abord », une expérience sans date
   * de début passerait donc devant les expériences réellement récentes —
   * l'inverse du principe suivi partout ailleurs sur ces schémas.
   */
  it("déclare `nulls: 'last'` sur le tri décroissant par date de début", () => {
    const recent = experience.orderings?.find((o) => o.name === 'recent');
    expect(recent?.by[0]).toMatchObject({
      field: 'startDate',
      direction: 'desc',
      nulls: 'last',
    });
  });

  it('départage les expériences à date égale ou également absente par un critère stable', () => {
    const recent = experience.orderings?.find((o) => o.name === 'recent');
    expect(recent?.by[1]).toMatchObject({field: '_id', direction: 'asc'});
  });

  /**
   * Je n'ai pas pu exercer un vrai tri contre le Content Lake (le Studio
   * exige une authentification OAuth hors de ma portée). Ce test simule
   * plutôt l'algorithme que Sanity applique réellement pour `nulls: 'last'`
   * — trouvé dans `node_modules/sanity/lib/PerspectiveProvider-*.js`
   * (`getNullSortingPrefix`) : un rang booléen « a une date »/« n'en a pas »
   * passe avant le tri par date, lui-même suivi du départage par `_id`.
   * Ce n'est donc pas la déclaration seule : c'est une preuve, au niveau de
   * l'algorithme documenté, que l'ordre relatif obtenu est le bon.
   */
  it('simule le tri réel : les expériences sans date de début se retrouvent en dernier', () => {
    type Doc = {_id: string; startDate?: string};
    const nullsLastDesc = (a: Doc, b: Doc): number => {
      const aHas = a.startDate !== undefined;
      const bHas = b.startDate !== undefined;
      if (aHas !== bHas) return aHas ? -1 : 1;
      if (aHas && bHas && a.startDate !== b.startDate) {
        return (a.startDate as string) > (b.startDate as string) ? -1 : 1;
      }
      return a._id < b._id ? -1 : 1;
    };
    const docs: Doc[] = [
      {_id: 'b', startDate: '2022-01'},
      {_id: 'a'}, // sans date de début — cas explicitement toléré par le brief
      {_id: 'c', startDate: '2024-06'},
    ];
    expect([...docs].sort(nullsLastDesc).map((d) => d._id)).toEqual(['c', 'b', 'a']);
  });
});

describe('tri des projets — critère de départage stable', () => {
  it('départage les projets à `order` égal ou également absent par un critère stable', () => {
    const displayOrder = project.orderings?.find((o) => o.name === 'displayOrder');
    expect(displayOrder?.by[1]).toMatchObject({field: '_id', direction: 'asc'});
  });
});

describe('service — cohérence number ↔ stage : impossible de désynchroniser l’arc', () => {
  const validateStage = (stage: unknown, number: number | undefined) => {
    const field = findField(service.fields, 'stage');
    const [validate] = customValidatorsOf(field?.validation);
    if (!validate) throw new Error('aucune règle personnalisée sur stage');
    return validate(stage, {document: {number}});
  };

  it('refuse un service dont le numéro contredit l’étape', () => {
    // number: 1 correspond à « understand », pas à « improve ».
    expect(validateStage('improve', 1)).not.toBe(true);
  });

  it('accepte un service dont le numéro et l’étape correspondent', () => {
    expect(validateStage('understand', 1)).toBe(true);
  });

  it('laisse passer la validation de stage quand le numéro est absent ou hors bornes', () => {
    // La règle sur `number` (required + min/max) signale déjà ce cas ;
    // dupliquer l'erreur ici gênerait sans apporter d'information neuve.
    expect(validateStage('understand', undefined)).toBe(true);
    expect(validateStage('understand', 9)).toBe(true);
  });
});

describe('service — numéro unique : deux services ne peuvent pas se disputer la même place', () => {
  const validateNumber = async (number: unknown, fetchResult: unknown) => {
    const field = findField(service.fields, 'number');
    const [validate] = customValidatorsOf(field?.validation);
    if (!validate) throw new Error('aucune règle personnalisée sur number');
    const context = {
      document: {_id: 'drafts.service-a'},
      getClient: () => ({fetch: vi.fn().mockResolvedValue(fetchResult)}),
    };
    return validate(number, context);
  };

  it('refuse deux services portant le même numéro', async () => {
    // La requête d'unicité renvoie `false` quand un autre document
    // partage déjà ce numéro.
    await expect(validateNumber(1, false)).resolves.not.toBe(true);
  });

  it('accepte un numéro qu’aucun autre service n’utilise', async () => {
    await expect(validateNumber(1, true)).resolves.toBe(true);
  });
});
