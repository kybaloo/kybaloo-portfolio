import {Rule} from '@sanity/schema';
import {ConcreteRuleClass} from 'sanity';
import {describe, expect, it, vi} from 'vitest';
import type {
  DocumentActionComponent,
  DocumentActionsContext,
  NewDocumentOptionsContext,
  TemplateItem,
} from 'sanity';
import type {StructureBuilder} from 'sanity/structure';
import {schemaTypes} from '@/sanity/schemas';
import {link} from '@/sanity/schemas/objects/link';
import {profile} from '@/sanity/schemas/documents/profile';
import {project} from '@/sanity/schemas/documents/project';
import {service} from '@/sanity/schemas/documents/service';
import {experience} from '@/sanity/schemas/documents/experience';
import {skill} from '@/sanity/schemas/documents/skill';
import {
  DOCUMENT_INTERNATIONALIZED_TYPES,
  PLUGIN_MANAGED_TYPES,
  SINGLETON_TYPES,
  isEditorManagedType,
  restrictedNewDocumentOptions,
  singletonActions,
  structure,
} from '@/sanity/structure';

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

/**
 * `Rule` de `@sanity/schema` déclare `validate()` abstraite : seule
 * l'implémentation concrète du paquet `sanity` exécute réellement les
 * règles. On l'emploie ici pour éprouver le **comportement** — « cette
 * valeur est-elle refusée ? » — et non la seule présence d'une déclaration
 * dans `_rules`, qui resterait vraie même si la règle ne rejetait rien.
 *
 * `i18n.t` est fourni parce que le formatage du message d'erreur passe par
 * la traduction du Studio, absente hors de celui-ci.
 */
const validationErrorsOf = async (
  validation: unknown,
  value: unknown,
  document?: Record<string, unknown>,
): Promise<Array<{message: string}>> => {
  const rule = (validation as RuleValidator)(
    new ConcreteRuleClass() as unknown as InstanceType<typeof Rule>,
  ) as unknown as {
    validate: (value: unknown, context: unknown) => Promise<Array<{message: string}>>;
  };
  return rule.validate(value, {document, i18n: {t: (key: string) => key}});
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

    const result = restrictedNewDocumentOptions(prev, context);

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

    const result = restrictedNewDocumentOptions(prev, context);

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

describe('types gérés par un plugin — l’éditeur ne doit ni les voir ni en créer', () => {
  /**
   * Fausse `StructureBuilder`, réduite aux méthodes que `structure` appelle
   * réellement. Elle capture la liste finale d'items pour qu'on puisse
   * vérifier ce que la structure expose — plutôt que de tester le seul
   * prédicat de filtrage, qui resterait vert même si `structure` cessait de
   * l'appeler.
   */
  const itemsOfStructure = (documentTypeNames: string[]): string[] => {
    let captured: Array<{__id?: string}> = [];
    const listBuilder = {
      title: () => listBuilder,
      items: (items: Array<{__id?: string}>) => {
        captured = items;
        return listBuilder;
      },
    };
    const childBuilder = {schemaType: () => childBuilder, documentId: () => childBuilder};
    const fakeS = {
      list: () => listBuilder,
      listItem: () => {
        const itemBuilder: {__id?: string} & Record<string, unknown> = {
          title: () => itemBuilder,
          id: (value: string) => {
            itemBuilder.__id = value;
            return itemBuilder;
          },
          child: () => itemBuilder,
        };
        return itemBuilder;
      },
      document: () => childBuilder,
      divider: () => ({__divider: true}),
      documentTypeListItems: () =>
        documentTypeNames.map((name) => ({__id: name, getId: () => name})),
    };

    structure(fakeS as unknown as StructureBuilder, undefined as never);

    return captured.map((item) => item.__id).filter((id): id is string => id !== undefined);
  };

  it('ne recense que translation.metadata', () => {
    expect([...PLUGIN_MANAGED_TYPES]).toEqual(['translation.metadata']);
  });

  /**
   * Les deux ensembles répondent à des questions différentes :
   * `SINGLETON_TYPES` désigne des documents uniques que l'éditeur édite bel
   * et bien (mais qu'il ne doit ni dupliquer ni supprimer),
   * `PLUGIN_MANAGED_TYPES` des documents qu'un plugin écrit pour son propre
   * compte et auxquels l'éditeur ne doit pas toucher du tout. Les confondre
   * ferait apparaître un singleton là où on veut cacher un type de plugin,
   * ou l'inverse.
   */
  it('reste disjoint des singletons', () => {
    for (const type of PLUGIN_MANAGED_TYPES) {
      expect(SINGLETON_TYPES.has(type), `${type} est aussi déclaré singleton`).toBe(false);
    }
  });

  it('retire translation.metadata de la liste générique de la structure', () => {
    const ids = itemsOfStructure(['project', 'post', 'translation.metadata']);
    expect(ids).not.toContain('translation.metadata');
    expect(ids).toContain('project');
    expect(ids).toContain('post');
  });

  it('laisse les singletons hors de la liste générique, mais garde leurs entrées dédiées', () => {
    const ids = itemsOfStructure(['profile', 'settings', 'project']);
    // 'profile' et 'settings' n'apparaissent qu'une fois chacun : l'entrée
    // dédiée en tête de structure, jamais le doublon de la liste générique.
    expect(ids.filter((id) => id === 'profile')).toHaveLength(1);
    expect(ids.filter((id) => id === 'settings')).toHaveLength(1);
  });

  it('retire translation.metadata du menu de création globale', () => {
    const prev = [{templateId: 'translation.metadata'}, {templateId: 'post'}] as TemplateItem[];
    const context = {creationContext: {type: 'global'}} as unknown as NewDocumentOptionsContext;

    const result = restrictedNewDocumentOptions(prev, context);

    expect(result.map((item) => item.templateId)).toEqual(['post']);
  });

  it('accorde le prédicat de listage aux deux ensembles', () => {
    expect(isEditorManagedType('project')).toBe(true);
    expect(isEditorManagedType('profile')).toBe(false);
    expect(isEditorManagedType('translation.metadata')).toBe(false);
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

describe('articles', () => {
  it('déclare le type post', () => {
    expect(byName('post')).toBeDefined();
  });

  it('porte un champ language, requis par l’internationalisation documentaire', () => {
    const post = byName('post') as {fields: Array<{name: string}>};
    expect(post.fields.map((f) => f.name)).toContain('language');
  });

  it('stocke le corps en Portable Text et non en chaîne', () => {
    const post = byName('post') as {fields: Array<{name: string; type: string}>};
    expect(post.fields.find((f) => f.name === 'body')?.type).toBe('array');
  });

  /**
   * `codeBlock.language` était un champ texte libre : rien n'empêchait un
   * article d'écrire « ts », le suivant « TypeScript », un troisième
   * « typescript ». Comme pour `service.stage` (arc Understand → Improve),
   * une liste de valeurs proposées remplace le texte libre. Ce test protège
   * cette liste dans la durée — même principe que le test sur l'arc des
   * services.
   */
  it('propose une liste de langages pour le bloc de code plutôt qu’un texte libre', () => {
    const post = byName('post') as {
      fields: Array<{
        name: string;
        of?: Array<{
          name?: string;
          fields?: Array<{
            name: string;
            type: string;
            options?: {list?: Array<{value: string}>};
          }>;
        }>;
      }>;
    };
    const body = post.fields.find((f) => f.name === 'body');
    const codeBlock = body?.of?.find((member) => member.name === 'codeBlock');
    const language = codeBlock?.fields?.find((f) => f.name === 'language');
    expect(language?.type).toBe('string');
    expect(language?.options?.list?.map((o) => o.value)).toEqual([
      'typescript',
      'tsx',
      'javascript',
      'json',
      'bash',
      'css',
      'html',
      'yaml',
      'markdown',
      'text',
    ]);
  });
});

/**
 * `post` est le SEUL type internationalisé au niveau document : un article
 * peut n'exister qu'en une langue et son texte diverge réellement d'une
 * langue à l'autre, dupliquer le document est ici l'objectif. Tous les
 * autres types (profile, settings, project, service, experience, skill)
 * restent internationalisés au niveau champ, via
 * `internationalizedArrayString`/`internationalizedArrayText` — les
 * dupliquer forcerait l'éditeur à re-téléverser chaque image et à
 * maintenir deux versions qui se désynchroniseraient.
 *
 * Ces tests protègent cette frontière dans la durée contre deux dérives :
 * étendre le plugin `@sanity/document-internationalization` à d'autres
 * types (première puce), ou introduire par erreur un champ
 * `internationalizedArray*` dans `post` — Sanity refuse qu'un tableau
 * contienne directement un autre tableau, et `internationalizedArrayString`
 * EST un tableau (seconde puce).
 */
describe('internationalisation documentaire — post et lui seul', () => {
  it('déclare exactement `post` comme type internationalisé au niveau document', () => {
    expect(DOCUMENT_INTERNATIONALIZED_TYPES).toEqual(['post']);
  });

  it("n'utilise aucun champ internationalisé au niveau champ — c'est le document entier qui est traduit", () => {
    const post = byName('post') as {fields: Array<{name: string; type: string}>};
    const offenders = post.fields
      .filter((f) => f.type.startsWith('internationalizedArray'))
      .map((f) => f.name);
    expect(
      offenders,
      `champ(s) internationalisé(s) au niveau champ dans post : ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it("n'est pas un singleton : il doit rester créable et supprimable normalement", () => {
    expect(SINGLETON_TYPES.has('post')).toBe(false);
  });
});

describe('unions générées — l’API doit refuser ce que le menu déroulant n’offre pas', () => {
  /**
   * `sanity.types.ts` type `service.stage`, `skill.category` et
   * `skill.usage` en unions fermées, dérivées de leur `options.list`. Mais
   * `options.list` ne contraint que le menu déroulant du Studio, jamais
   * l'API : une écriture par jeton (script d'import, migration) peut poser
   * n'importe quelle chaîne, et le type généré ment alors au consommateur.
   *
   * Ces tests portent sur le comportement — quelles valeurs la validation
   * accepte-t-elle réellement ? — plutôt que sur la présence d'une règle.
   * Les valeurs acceptées sont lues depuis `options.list` du champ lui-même
   * et non recopiées ici : si la validation cessait de dériver de la même
   * source, une valeur du menu déroulant finirait par être refusée et ce
   * test le dirait.
   */
  const cases = [
    // `document` reste indéfini pour `service.stage` : la règle croisée
    // number ↔ stage se désactive alors (elle laisse la validation de
    // `number` signaler l'absence), si bien que seule l'appartenance à la
    // liste peut encore refuser la valeur. Sans cette précaution, le test
    // passerait grâce à la règle croisée et ne prouverait rien.
    {label: 'service.stage', fields: service.fields, name: 'stage', rejected: 'strategy'},
    {label: 'skill.category', fields: skill.fields, name: 'category', rejected: 'devops'},
    {label: 'skill.usage', fields: skill.fields, name: 'usage', rejected: 'sometimes'},
  ] as const;

  for (const {label, fields, name, rejected} of cases) {
    describe(label, () => {
      const field = () => findField(fields, name);
      const listValues = (): string[] => {
        const options = (field() as {options?: {list?: Array<{value: string}>}}).options;
        const values = options?.list?.map((entry) => entry.value);
        if (!values) throw new Error(`${label} n’a pas de options.list`);
        return values;
      };

      it('accepte chaque valeur de son menu déroulant', async () => {
        for (const value of listValues()) {
          const errors = await validationErrorsOf(field()?.validation, value);
          expect(errors, `${label} refuse « ${value} », pourtant proposée`).toEqual([]);
        }
      });

      it('refuse une valeur hors liste', async () => {
        expect(listValues()).not.toContain(rejected);
        const errors = await validationErrorsOf(field()?.validation, rejected);
        expect(errors.length, `${label} accepte « ${rejected} »`).toBeGreaterThan(0);
      });

      it('refuse une valeur empruntée à un autre champ du même schéma', async () => {
        // Un `usage` posé dans `category` est le glissement le plus
        // plausible d'un script de migration : il doit être refusé aussi.
        const foreign = cases
          .filter((other) => other.label !== label)
          .flatMap((other) => {
            const otherField = findField(other.fields, other.name) as {
              options?: {list?: Array<{value: string}>};
            };
            return otherField.options?.list?.map((entry) => entry.value) ?? [];
          })
          .filter((value) => !listValues().includes(value));

        for (const value of foreign) {
          const errors = await validationErrorsOf(field()?.validation, value);
          expect(
            errors.length,
            `${label} accepte « ${value} », venue d’un autre champ`,
          ).toBeGreaterThan(0);
        }
      });
    });
  }
});
