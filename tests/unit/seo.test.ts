import {describe, expect, it} from 'vitest';
import robots from '@/app/robots';
import {
  getPersonJsonLd,
  getWebSiteJsonLd,
  getProjectJsonLd,
  getBreadcrumbJsonLd,
} from '@/lib/json-ld';
import {PROJECTS} from '@/lib/projects-data';

describe('robots.ts', () => {
  it('génère un fichier robots.txt interdisant /studio et /api/', () => {
    const r = robots();
    expect(r.rules).toBeDefined();
    expect(r.sitemap).toMatch(/sitemap\.xml$/);
  });
});

describe('JSON-LD structured data', () => {
  it('génère le schéma Person avec les propriétés essentielles', () => {
    const person = getPersonJsonLd();
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe('Florentin Tchangai');
    expect(person.jobTitle).toBe('Technology Architect');
    expect(person.sameAs).toContain('https://github.com/kybaloo');
    expect(person.worksFor.name).toContain('Ecobank');
    expect(person.alumniOf[0]?.name).toContain('ESGIS');
  });

  it('génère le schéma WebSite', () => {
    const site = getWebSiteJsonLd();
    expect(site['@type']).toBe('WebSite');
    expect(site.inLanguage).toEqual(['fr', 'en']);
    expect(site.author.name).toBe('Florentin Tchangai');
  });

  it('génère le schéma SoftwareSourceCode pour un projet', () => {
    const project = PROJECTS[0]!;
    const jsonLd = getProjectJsonLd(project, 'fr');
    expect(jsonLd['@type']).toBe('SoftwareSourceCode');
    expect(jsonLd.name).toBe(project.title);
    expect(jsonLd.programmingLanguage).toEqual(project.stack);
  });

  it('génère le schéma BreadcrumbList', () => {
    const breadcrumb = getBreadcrumbJsonLd([
      {name: 'Accueil', url: 'https://example.com/fr'},
      {name: 'Travaux', url: 'https://example.com/fr/travaux'},
    ]);
    expect(breadcrumb['@type']).toBe('BreadcrumbList');
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[0]?.position).toBe(1);
  });
});
