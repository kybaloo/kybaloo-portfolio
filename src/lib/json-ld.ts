import {siteUrl, SITE} from './site';
import type {Project} from './projects-data';

export function getPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    jobTitle: SITE.role,
    url: siteUrl,
    image: `${siteUrl}/about-me.png`,
    description:
      'Technology Architect & Full-Stack Engineer based in Lomé, Togo. Specializing in high-concurrency systems, core banking architectures, and resilient data infrastructure.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lomé',
      addressCountry: 'Togo',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Ecobank Transnational Incorporated',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'ESGIS (École Supérieure de Gestion, d’Informatique et des Sciences)',
      },
    ],
    sameAs: [SITE.github, SITE.linkedin, 'https://www.npmjs.com/~kybaloo'],
    knowsAbout: [
      'Software Architecture',
      'System Design',
      'Core Banking Systems',
      'Next.js',
      'React',
      'TypeScript',
      'SQL Server',
      'PostgreSQL',
      'Computer Vision',
      'High Availability',
    ],
  };
}

export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Florentin Tchangai — Portfolio',
    url: siteUrl,
    inLanguage: ['fr', 'en'],
    author: {
      '@type': 'Person',
      name: SITE.name,
    },
  };
}

export function getProjectJsonLd(project: Project, locale: string) {
  const isFr = locale === 'fr';
  const description = isFr ? project.summary.fr : project.summary.en;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description,
    programmingLanguage: project.stack,
    creator: {
      '@type': 'Person',
      name: SITE.name,
      url: siteUrl,
    },
    codeRepository:
      project.links.github && project.links.github !== '#' ? project.links.github : undefined,
    url: project.links.live && project.links.live !== '#' ? project.links.live : undefined,
  };
}

export function getBreadcrumbJsonLd(items: {name: string; url: string}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
