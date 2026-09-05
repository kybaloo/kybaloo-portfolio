// scripts/validate-archive.mjs
import {readFileSync} from 'node:fs';

const read = (name) =>
  JSON.parse(
    readFileSync(new URL(`../docs/content-archive/${name}.json`, import.meta.url), 'utf8'),
  );

const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;
const hasFields = (obj, fields) => fields.every((f) => nonEmpty(obj?.[f]));
const countNonEmpty = (obj) => Object.values(obj ?? {}).filter((v) => nonEmpty(v)).length;

// Planchers fixés d'après le contenu réel de l'archive au moment du durcissement
// (voir docs/content-archive/*.json) — pas de chiffres inventés.
const MIN_SKILL_CATEGORIES = 6; // catégories réellement présentes
const MIN_SKILLS = 34; // compétences réellement présentes (somme des items[])
const MIN_HERO_FIELDS = 8; // champs non vides réellement présents dans hero (fr et en)
const MIN_ABOUT_FIELDS = 33; // champs non vides réellement présents dans about (fr et en)

const checks = [
  [
    'projects',
    () => {
      const d = read('projects');
      if (!Array.isArray(d) || d.length !== 10)
        throw new Error(`10 projets attendus, ${d?.length}`);
      const ids = new Set(d.map((p) => p.id));
      if (ids.size !== 10) throw new Error('identifiants de projet en double');
      if (d.filter((p) => p.featured).length !== 4)
        throw new Error('4 projets "featured" attendus');
      d.forEach((p, i) => {
        if (!hasFields(p, ['id', 'title']))
          throw new Error(`projet #${i} : id ou title manquant/vide`);
      });
      return `${d.length} projets`;
    },
  ],
  [
    'blog',
    () => {
      const d = read('blog');
      if (!Array.isArray(d) || d.length !== 5) throw new Error(`5 articles attendus, ${d?.length}`);
      d.forEach((b, i) => {
        if (!hasFields(b, ['title', 'slug', 'content']))
          throw new Error(`article #${i} : title, slug ou content manquant/vide`);
      });
      return `${d.length} articles`;
    },
  ],
  [
    'services',
    () => {
      const d = read('services');
      if (!Array.isArray(d) || d.length !== 4) throw new Error(`4 services attendus, ${d?.length}`);
      d.forEach((s, i) => {
        if (!hasFields(s, ['title', 'description']))
          throw new Error(`service #${i} : title ou description manquant/vide`);
      });
      return `${d.length} services`;
    },
  ],
  [
    'skills',
    () => {
      const d = read('skills');
      if (!Array.isArray(d) || d.length < MIN_SKILL_CATEGORIES)
        throw new Error(
          `au moins ${MIN_SKILL_CATEGORIES} catégories attendues, ${d?.length ?? 0} trouvées`,
        );
      d.forEach((c, i) => {
        if (!Array.isArray(c.items) || c.items.length === 0)
          throw new Error(`catégorie #${i} (${c.category ?? '?'}) sans items[] non vide`);
      });
      const total = d.reduce((n, c) => n + c.items.length, 0);
      if (total < MIN_SKILLS)
        throw new Error(`au moins ${MIN_SKILLS} compétences attendues, ${total} trouvées`);
      return `${d.length} catégories, ${total} compétences`;
    },
  ],
  [
    'experiences',
    () => {
      const d = read('experiences');
      if (!Array.isArray(d) || d.length !== 3)
        throw new Error(`3 expériences attendues, ${d?.length}`);
      d.forEach((e, i) => {
        if (!Array.isArray(e.achievements) || e.achievements.length === 0)
          throw new Error(`expérience #${i} (${e.id ?? '?'}) sans achievements[] non vide`);
        if (!Array.isArray(e.technologies) || e.technologies.length === 0)
          throw new Error(`expérience #${i} (${e.id ?? '?'}) sans technologies[] non vide`);
      });
      return `${d.length} expériences`;
    },
  ],
  [
    'profile',
    () => {
      const d = read('profile');
      for (const l of ['fr', 'en']) {
        const hero = d?.[l]?.hero;
        const about = d?.[l]?.about;
        if (!hero || !about) throw new Error(`profile.${l}.hero ou .about manquant`);
        const heroCount = countNonEmpty(hero);
        if (heroCount < MIN_HERO_FIELDS)
          throw new Error(
            `profile.${l}.hero : au moins ${MIN_HERO_FIELDS} champs non vides attendus, ${heroCount} trouvés`,
          );
        const aboutCount = countNonEmpty(about);
        if (aboutCount < MIN_ABOUT_FIELDS)
          throw new Error(
            `profile.${l}.about : au moins ${MIN_ABOUT_FIELDS} champs non vides attendus, ${aboutCount} trouvés`,
          );
      }
      return 'fr + en';
    },
  ],
];

let failed = 0;
for (const [name, run] of checks) {
  try {
    console.log(`  ok   ${name.padEnd(12)} ${run()}`);
  } catch (e) {
    failed++;
    console.error(`  FAIL ${name.padEnd(12)} ${e.message}`);
  }
}
console.log(failed ? `\n${failed} vérification(s) en échec` : '\nArchive complète.');
process.exit(failed ? 1 : 0);
