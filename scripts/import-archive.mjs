// scripts/import-archive.mjs
/**
 * Import unique du contenu de l'ancien site vers Sanity.
 *
 * Ce que ce script fait NE PAS migrer, délibérément :
 *   - les 5 articles de blog : génériques, illustrés d'images de banque et
 *     d'une image tierce servie depuis un domaine externe ; la spec §8 les
 *     écarte explicitement ;
 *   - les 4 services de l'ancien site : remplacés par les 5 du
 *     positionnement d'architecte ;
 *   - les niveaux de compétence en pourcentage : remplacés par une
 *     fréquence d'usage ;
 *   - les descriptions longues et listes de fonctionnalités des projets :
 *     remplacées par les champs d'architecture (contexte, contrainte,
 *     décisions, résultats), à écrire à la main — voir le récapitulatif
 *     imprimé en fin de script pour le détail et l'emplacement de chaque
 *     omission.
 *
 * Le script est idempotent : il utilise `createOrReplace` avec des
 * identifiants dérivés des données, donc le relancer ne duplique rien.
 * Chaque document est écrit indépendamment : un échec isolé (réseau,
 * validation) n'interrompt pas le reste de l'import, et le récapitulatif
 * final indique précisément ce qui a réussi et ce qui a échoué.
 */
import {readFileSync} from 'node:fs';
import {createClient} from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    'Variables manquantes. Requis : NEXT_PUBLIC_SANITY_PROJECT_ID, ' +
      'NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.',
  );
  process.exit(1);
}

const client = createClient({projectId, dataset, token, apiVersion: '2026-09-01', useCdn: false});

const read = (name) =>
  JSON.parse(
    readFileSync(new URL(`../docs/content-archive/${name}.json`, import.meta.url), 'utf8'),
  );

/**
 * Un champ internationalisé du plugin : un tableau d'entrées par langue.
 *
 * `sanity-plugin-internationalized-array` lit et filtre sur un champ
 * `language` dédié (`LANGUAGE_FIELD_NAME` dans sa source), distinct de
 * `_key` — voir « Shape of stored data » dans son README. Omettre
 * `language` laisse l'écriture réussir (l'API n'y valide rien) mais rend la
 * valeur invisible aux requêtes GROQ existantes (`summary[language == ...]`)
 * et au Studio, qui la traite comme nécessitant une migration.
 */
const i18n = (fr, en) =>
  [
    fr ? {_key: 'fr', _type: 'internationalizedArrayStringValue', language: 'fr', value: fr} : null,
    en ? {_key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: en} : null,
  ].filter(Boolean);

const i18nText = (fr, en) =>
  [
    fr ? {_key: 'fr', _type: 'internationalizedArrayTextValue', language: 'fr', value: fr} : null,
    en ? {_key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: en} : null,
  ].filter(Boolean);

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Écrit une liste de documents un par un, sans laisser un échec isolé
 * interrompre les suivants. `createOrReplace` rend chaque écriture
 * idempotente : relancer le script après un échec réécrit à l'identique ce
 * qui a déjà réussi et ne retente que ce qui manque.
 */
async function writeAll(docs, label) {
  let succeeded = 0;
  const failed = [];
  for (const doc of docs) {
    try {
      await client.createOrReplace(doc);
      succeeded++;
    } catch (err) {
      failed.push({id: doc._id, message: err instanceof Error ? err.message : String(err)});
    }
  }
  return {label, total: docs.length, succeeded, failed};
}

async function importProjects() {
  const projects = read('projects');
  const docs = projects.map((p, index) => ({
    _id: `project-${p.id}`,
    _type: 'project',
    title: p.title,
    slug: {_type: 'slug', current: slugify(p.id)},
    // Les descriptions de l'archive sont en français ; l'anglais reste à écrire.
    // La description longue (`p.description`) et `p.features` ne sont reprises
    // nulle part : voir le récapitulatif final pour leur remplacement prévu.
    summary: i18nText(p.miniDescription || p.description, null),
    year: Number(String(p.duration ?? '').match(/\d{4}/)?.[0]) || undefined,
    client: p.company ?? p.event ?? undefined,
    featured: Boolean(p.featured),
    order: index,
    stack: p.techStack ?? p.tags ?? [],
    links: [
      p.liveUrl && p.liveUrl !== '#'
        ? {_key: 'live', _type: 'link', label: 'Site', url: p.liveUrl}
        : null,
      p.githubUrl && p.githubUrl !== '#'
        ? {_key: 'code', _type: 'link', label: 'Code', url: p.githubUrl}
        : null,
    ].filter(Boolean),
  }));

  return writeAll(docs, 'projects');
}

const MONTHS = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
};

/** « September 2022 » -> « 2022-09 ». `null` si le format n'est pas reconnu. */
function parseMonthYear(raw) {
  const m = /^([A-Za-z]+)\s+(\d{4})$/.exec(raw.trim());
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  return month ? `${m[2]}-${month}` : null;
}

/**
 * `duration` dans `experiences.json` : « Mois Année - Mois Année » ou
 * « Mois Année - Present » — format constaté sur les 3 entrées réelles de
 * l'archive (lues avant d'écrire cette fonction), pas supposé à l'avance.
 * Le schéma `experience` stocke `startDate`/`endDate` en « YYYY-MM » (voir
 * `dateFormat: 'YYYY-MM'` dans `experience.ts` et le tri `nulls: 'last'`
 * qui suppose ce format).
 *
 * Une entrée en cours (« Present ») donne une `endDate` absente — le schéma
 * la prévoit explicitement. Une chaîne qui ne correspond pas à ce format ne
 * doit jamais faire deviner une date : le champ concerné reste vide et
 * l'appelant est averti, plutôt que d'écrire une date inventée.
 */
function parseDuration(duration, id, warnings) {
  const parts = String(duration ?? '').split(/\s*-\s*/);
  if (parts.length !== 2) {
    warnings.push(
      `${id} : durée « ${duration} » non reconnue (attendu « Mois Année - Mois Année »), ` +
        'dates laissées vides',
    );
    return {startDate: undefined, endDate: undefined};
  }
  const [startRaw, endRaw] = parts;
  const startDate = parseMonthYear(startRaw) ?? undefined;
  if (!startDate) {
    warnings.push(`${id} : début « ${startRaw} » non reconnu, dates laissées vides`);
    return {startDate: undefined, endDate: undefined};
  }
  if (/^present$/i.test(endRaw.trim())) return {startDate, endDate: undefined};
  const endDate = parseMonthYear(endRaw) ?? undefined;
  if (!endDate) {
    warnings.push(`${id} : fin « ${endRaw} » non reconnue, date de fin laissée vide`);
  }
  return {startDate, endDate};
}

async function importExperiences(warnings) {
  const experiences = read('experiences');
  const docs = experiences.map((e) => {
    const {startDate, endDate} = parseDuration(e.duration, e.id, warnings);
    return {
      _id: `experience-${e.id}`,
      _type: 'experience',
      position: i18n(e.position, e.position),
      organisation: e.company,
      location: e.location,
      startDate,
      endDate,
      description: i18nText(null, e.description),
      // `bullet` enveloppe chaque réalisation : Sanity refuse un tableau
      // contenant directement un autre tableau.
      achievements: (e.achievements ?? []).map((a, i) => ({
        _key: `a${i}`,
        _type: 'bullet',
        text: i18n(null, a),
      })),
      technologies: e.technologies ?? [],
    };
  });

  return writeAll(docs, 'experiences');
}

async function importSkills() {
  const categories = read('skills');
  // Les 6 catégories de l'archive vers les 5 du schéma (`skill.ts`).
  // « Database Management » et « Data Analysis & BI » convergent toutes
  // deux vers « data » (Données & BI).
  const map = {
    'Frontend Development': 'frontend',
    'Backend Development': 'backend',
    'Database Management': 'data',
    'Data Analysis & BI': 'data',
    'Cloud & DevOps': 'cloud',
    'Tools & Software': 'tools',
  };
  const docs = categories.flatMap((category) => {
    const categoryValue = map[category.category] ?? 'tools';
    return category.items.map((item) => ({
      // « Python » apparaît à la fois sous Backend Development et sous
      // Data Analysis & BI : sans la catégorie dans l'identifiant, le
      // second `createOrReplace` écraserait silencieusement le premier
      // et on perdrait une compétence sur les 34 attendues.
      _id: `skill-${categoryValue}-${slugify(item.name)}`,
      _type: 'skill',
      name: item.name,
      category: categoryValue,
      // Les pourcentages de l'archive ne mesurent rien : on les traduit en
      // fréquence d'usage, à réviser à la main dans le Studio.
      usage: item.level >= 90 ? 'daily' : item.level >= 75 ? 'regular' : 'familiar',
    }));
  });

  return writeAll(docs, 'skills');
}

const dateWarnings = [];
const sections = [
  await importProjects(),
  await importExperiences(dateWarnings),
  await importSkills(),
];

console.log('Import terminé :');
for (const s of sections) {
  const status = s.failed.length
    ? `${s.succeeded}/${s.total} (${s.failed.length} échec(s))`
    : `${s.succeeded}`;
  console.log(`  ${s.label.padEnd(12)} ${status}`);
}

if (dateWarnings.length > 0) {
  console.log('\nDates d’expérience non reconnues (laissées vides, pas devinées) :');
  for (const w of dateWarnings) console.log(`  - ${w}`);
}

const hasFailures = sections.some((s) => s.failed.length > 0);
if (hasFailures) {
  console.log('\nDocuments en échec :');
  for (const s of sections) {
    for (const f of s.failed) console.log(`  [${s.label}] ${f.id} : ${f.message}`);
  }
  console.log(
    '\nRelancer `npm run import:archive` est sans danger : chaque document est écrit via ' +
      '`createOrReplace` avec un identifiant dérivé des données, donc les documents déjà ' +
      'réussis seront réécrits à l’identique et seuls ceux en échec seront retentés.',
  );
}

console.log('\nNon importés, délibérément — le contenu reste dans docs/content-archive/*.json :');
console.log('  - les 5 articles de blog (blog.json) : génériques, illustrés de photos de banque');
console.log('    et d’une image tierce sur un domaine externe ; la spec §8 les écarte.');
console.log('  - les 4 services de l’ancien site (services.json) : remplacés par les 5 services');
console.log('    du positionnement d’architecte, à écrire à la main dans le Studio.');
console.log('  - la description longue et la liste de fonctionnalités de chaque projet');
console.log('    (projects.json, champs `description` et `features`) : remplacées par les');
console.log('    champs d’architecture du projet (contexte, contrainte, décisions, résultats),');
console.log('    à écrire à la main dans le Studio — pas de retour aux fonctionnalités.');
console.log('  - les captures d’écran des projets (projects.json, champ `image`) : à téléverser');
console.log('    à la main dans le Studio.');
console.log('\nÀ compléter à la main dans le Studio : traductions anglaises, images, champs');
console.log('d’architecture des projets, et les 5 services du positionnement.');

if (hasFailures) process.exit(1);
