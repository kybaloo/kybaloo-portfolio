import {Rule} from '@sanity/schema';
import {describe, expect, it} from 'vitest';
import type {
  DocumentActionComponent,
  DocumentActionsContext,
  NewDocumentOptionsContext,
  TemplateItem,
} from 'sanity';
import {schemaTypes} from '@/sanity/schemas';
import {link} from '@/sanity/schemas/objects/link';
import {profile} from '@/sanity/schemas/documents/profile';
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
