// scripts/validate-archive.mjs
import {readFileSync} from 'node:fs';

const read = (name) =>
  JSON.parse(readFileSync(new URL(`../docs/content-archive/${name}.json`, import.meta.url), 'utf8'));

const checks = [
  ['projects', () => { const d = read('projects');
    if (!Array.isArray(d) || d.length !== 10) throw new Error(`10 projets attendus, ${d.length} trouvés`);
    const ids = new Set(d.map((p) => p.id));
    if (ids.size !== 10) throw new Error('identifiants de projet en double');
    if (d.filter((p) => p.featured).length !== 4) throw new Error('4 projets "featured" attendus');
    return `${d.length} projets`; }],
  ['blog', () => { const d = read('blog');
    if (d.length !== 5) throw new Error(`5 articles attendus, ${d.length}`);
    return `${d.length} articles`; }],
  ['services', () => { const d = read('services');
    if (d.length !== 4) throw new Error(`4 services attendus, ${d.length}`);
    return `${d.length} services`; }],
  ['skills', () => { const d = read('skills');
    if (!d.every((c) => Array.isArray(c.items))) throw new Error('catégorie sans items[]');
    return `${d.length} catégories, ${d.reduce((n, c) => n + c.items.length, 0)} compétences`; }],
  ['experiences', () => { const d = read('experiences');
    if (d.length !== 3) throw new Error(`3 expériences attendues, ${d.length}`);
    if (!d.every((e) => Array.isArray(e.achievements) && e.achievements.length))
      throw new Error('expérience sans achievements[]');
    return `${d.length} expériences`; }],
  ['profile', () => { const d = read('profile');
    for (const l of ['fr', 'en']) {
      if (!d[l]?.hero || !d[l]?.about) throw new Error(`profile.${l}.hero ou .about manquant`);
    }
    return 'fr + en'; }],
];

let failed = 0;
for (const [name, run] of checks) {
  try { console.log(`  ok   ${name.padEnd(12)} ${run()}`); }
  catch (e) { failed++; console.error(`  FAIL ${name.padEnd(12)} ${e.message}`); }
}
console.log(failed ? `\n${failed} vérification(s) en échec` : '\nArchive complète.');
process.exit(failed ? 1 : 0);
