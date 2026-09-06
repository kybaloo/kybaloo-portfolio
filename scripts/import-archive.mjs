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
 *     fréquence d'usage.
 *
 * Le script est idempotent : il utilise `createOrReplace` avec des
 * identifiants dérivés des données, donc le relancer ne duplique rien.
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

async function importProjects() {
  const projects = read('projects');
  const docs = projects.map((p, index) => ({
    _id: `project-${p.id}`,
    _type: 'project',
    title: p.title,
    slug: {_type: 'slug', current: slugify(p.id)},
    // Les descriptions de l'archive sont en français ; l'anglais reste à écrire.
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

  for (const doc of docs) await client.createOrReplace(doc);
  return docs.length;
}

async function importExperiences() {
  const experiences = read('experiences');
  const docs = experiences.map((e) => ({
    _id: `experience-${e.id}`,
    _type: 'experience',
    position: i18n(e.position, e.position),
    organisation: e.company,
    location: e.location,
    description: i18nText(null, e.description),
    // `bullet` enveloppe chaque réalisation : Sanity refuse un tableau
    // contenant directement un autre tableau.
    achievements: (e.achievements ?? []).map((a, i) => ({
      _key: `a${i}`,
      _type: 'bullet',
      text: i18n(null, a),
    })),
    technologies: e.technologies ?? [],
  }));

  for (const doc of docs) await client.createOrReplace(doc);
  return docs.length;
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
  let count = 0;
  for (const category of categories) {
    const categoryValue = map[category.category] ?? 'tools';
    for (const item of category.items) {
      await client.createOrReplace({
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
      });
      count++;
    }
  }
  return count;
}

const results = {
  projects: await importProjects(),
  experiences: await importExperiences(),
  skills: await importSkills(),
};

console.log('Import terminé :');
for (const [name, n] of Object.entries(results)) console.log(`  ${name.padEnd(12)} ${n}`);
console.log('\nNon importés, délibérément : les 5 articles et les 4 services de l’ancien site.');
console.log('À compléter à la main dans le Studio : traductions anglaises, images, champs');
console.log('d’architecture des projets, et les 5 services du positionnement.');
