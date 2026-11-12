'use client';

import {useState} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {Project} from '@/lib/projects-data';

interface ProjectFilterProps {
  initialProjects: Project[];
  locale: string;
}

export function ProjectCatalog({initialProjects, locale}: ProjectFilterProps) {
  const t = useTranslations('work');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    {id: 'all', label: t('filterAll')},
    {id: 'fintech', label: t('filterFintech')},
    {id: 'ai', label: t('filterAI')},
    {id: 'devtools', label: t('filterDevTools')},
    {id: 'web', label: t('filterWeb')},
  ];

  const filtered =
    activeCategory === 'all'
      ? initialProjects
      : initialProjects.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-line/60 pb-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-sm px-3.5 py-1.5 font-mono text-xs transition-all ${
                isActive
                  ? 'bg-ink font-semibold text-paper shadow-xs'
                  : 'border border-line text-muted hover:border-ink/40 hover:text-ink'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {filtered.map((project) => {
          const isFr = locale === 'fr';
          const roleText = isFr ? project.role.fr : project.role.en;
          const summaryText = isFr ? project.summary.fr : project.summary.en;
          const archText = isFr ? project.architecture.fr : project.architecture.en;

          return (
            <article
              key={project.slug}
              className="group flex flex-col justify-between overflow-hidden rounded-sm border border-line bg-paper/50 transition-all duration-300 hover:border-ink/40 hover:bg-paper hover:shadow-xs"
            >
              <div>
                {/* Project Image Container */}
                <div className="relative aspect-16/10 w-full overflow-hidden border-b border-line bg-muted/10">
                  {project.cover ? (
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-102"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted">
                      [Architecture & API Backend]
                    </div>
                  )}

                  {/* Top Badge: Client & Year */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-xs border border-line/80 bg-paper/90 px-2 py-0.5 font-mono text-[11px] text-ink backdrop-blur-xs">
                      {project.client}
                    </span>
                    <span className="rounded-xs border border-line/80 bg-paper/90 px-2 py-0.5 font-mono text-[11px] text-muted backdrop-blur-xs">
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium text-accent">{roleText}</span>
                    {project.metric && (
                      <span className="rounded-xs border border-accent/20 bg-accent/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
                        {project.metric}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl leading-snug text-ink transition-colors group-hover:text-accent sm:text-2xl">
                    {project.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 font-sans text-sm leading-relaxed text-muted">
                    {summaryText}
                  </p>

                  {/* Architecture Highlight */}
                  <div className="mt-4 rounded-sm border-l-2 border-accent/40 bg-muted/5 py-1.5 pl-3">
                    <span className="block font-mono text-[11px] text-muted uppercase">
                      {t('architectureTag')}
                    </span>
                    <p className="mt-0.5 line-clamp-2 font-sans text-xs text-ink/90">{archText}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer: Stack & Actions */}
              <div className="flex flex-col gap-4 border-t border-line/60 px-6 pt-4 pb-6">
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-xs border border-line bg-paper px-2 py-0.5 font-mono text-[11px] text-muted/80"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 5 && (
                    <span className="self-center font-mono text-[11px] text-muted/60">
                      +{project.stack.length - 5}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={{pathname: '/work/[slug]', params: {slug: project.slug}}}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-ink decoration-accent/40 underline-offset-4 group-hover:underline hover:text-accent"
                  >
                    {t('viewCaseStudy')}
                    <span>→</span>
                  </Link>

                  <div className="flex items-center gap-3">
                    {project.links.github && project.links.github !== '#' && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-muted transition-colors hover:text-ink"
                        title="Code GitHub"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {project.links.live && project.links.live !== '#' && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-accent transition-colors hover:underline"
                        title="Aperçu Live"
                      >
                        Live ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
