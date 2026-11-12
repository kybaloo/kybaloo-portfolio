import type {Metadata} from 'next';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {getProjectBySlug, PROJECTS} from '@/lib/projects-data';

export function generateStaticParams() {
  const params: {locale: string; slug: string}[] = [];
  for (const locale of routing.locales) {
    for (const project of PROJECTS) {
      params.push({locale, slug: project.slug});
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {title: 'Projet introuvable'};

  const isFr = locale === 'fr';
  const summary = isFr ? project.summary.fr : project.summary.en;

  return {
    title: `${project.title} — Florentin Tchangai`,
    description: summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations({locale, namespace: 'work'});
  const isFr = locale === 'fr';
  const roleText = isFr ? project.role.fr : project.role.en;
  const summaryText = isFr ? project.summary.fr : project.summary.en;
  const archText = isFr ? project.architecture.fr : project.architecture.en;

  const caseStudy = project.caseStudy;

  return (
    <div className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
          >
            {t('backToWork')}
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-xs border border-accent/20 bg-accent/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-accent">
              {project.metric}
            </span>
            <span className="font-mono text-xs text-muted/60">•</span>
            <span className="font-mono text-xs text-muted">{project.client}</span>
            <span className="font-mono text-xs text-muted/60">•</span>
            <span className="font-mono text-xs text-muted">{project.year}</span>
          </div>

          <h1 className="font-serif text-3xl leading-tight text-ink sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-muted sm:text-xl">
            {summaryText}
          </p>
        </div>

        {/* Cover Screenshot */}
        {project.cover && (
          <div className="relative mb-14 aspect-16/9 w-full overflow-hidden rounded-sm border border-line bg-muted/10">
            <Image
              src={project.cover}
              alt={project.title}
              fill
              priority
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Main Case Study Column */}
          <div className="space-y-12 lg:col-span-8">
            {/* Architecture Highlight Box */}
            <div className="rounded-sm border border-l-2 border-accent border-line bg-paper/80 p-6 sm:p-7">
              <span className="mb-2 block font-mono text-xs tracking-wider text-accent uppercase">
                {t('architectureTag')}
              </span>
              <p className="font-sans text-base leading-relaxed text-ink">{archText}</p>
            </div>

            {/* Context & Challenge */}
            {caseStudy && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-accent">01</span>
                  <h2 className="font-serif text-2xl text-ink">{t('contextTitle')}</h2>
                </div>
                <p className="font-sans text-base leading-relaxed text-muted">
                  {isFr ? caseStudy.context.fr : caseStudy.context.en}
                </p>
              </section>
            )}

            {/* Technical Constraints */}
            {caseStudy && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-accent">02</span>
                  <h2 className="font-serif text-2xl text-ink">{t('constraintsTitle')}</h2>
                </div>
                <ul className="space-y-2.5">
                  {(isFr ? caseStudy.constraints.fr : caseStudy.constraints.en).map((c, idx) => (
                    <li key={idx} className="flex items-start gap-3 font-sans text-sm text-muted">
                      <span className="font-mono text-accent select-none">↳</span>
                      <span className="text-ink/90">{c}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Key Architecture Decisions */}
            {caseStudy && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-accent">03</span>
                  <h2 className="font-serif text-2xl text-ink">{t('decisionsTitle')}</h2>
                </div>
                <div className="space-y-4">
                  {(isFr ? caseStudy.decisions.fr : caseStudy.decisions.en).map((dec, idx) => (
                    <div
                      key={idx}
                      className="space-y-2 rounded-sm border border-line bg-paper/40 p-5"
                    >
                      <h3 className="font-serif text-lg text-ink">{dec.title}</h3>
                      <p className="font-sans text-sm leading-relaxed text-muted">
                        {dec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Measured Outcomes */}
            {caseStudy && caseStudy.outcomes.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-accent">04</span>
                  <h2 className="font-serif text-2xl text-ink">{t('outcomesTitle')}</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {caseStudy.outcomes.map((outcome, idx) => (
                    <div key={idx} className="rounded-sm border border-line bg-paper/60 p-5">
                      <div className="font-mono text-2xl font-semibold tracking-tight text-accent sm:text-3xl">
                        {outcome.metric}
                      </div>
                      <p className="mt-2 font-sans text-xs text-muted sm:text-sm">
                        {isFr ? outcome.label.fr : outcome.label.en}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Metadata Column */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            {/* Meta Card */}
            <div className="space-y-5 rounded-sm border border-line bg-paper/60 p-6">
              <div className="border-b border-line/60 pb-3">
                <span className="block font-mono text-xs text-muted uppercase">
                  {t('clientLabel')}
                </span>
                <span className="mt-0.5 block font-sans text-base font-medium text-ink">
                  {project.client}
                </span>
              </div>

              <div className="border-b border-line/60 pb-3">
                <span className="block font-mono text-xs text-muted uppercase">
                  {t('yearLabel')}
                </span>
                <span className="mt-0.5 block font-mono text-sm text-ink">{project.year}</span>
              </div>

              <div className="border-b border-line/60 pb-3">
                <span className="block font-mono text-xs text-muted uppercase">
                  {t('roleLabel')}
                </span>
                <span className="mt-0.5 block font-sans text-sm text-ink">{roleText}</span>
              </div>

              {/* Stack Chips */}
              <div>
                <span className="mb-2 block font-mono text-xs text-muted uppercase">
                  {t('stackTitle')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-xs border border-line bg-paper px-2 py-0.5 font-mono text-[11px] text-muted/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-2 border-t border-line/60 pt-2">
                <span className="mb-1 block font-mono text-xs text-muted uppercase">
                  {t('linksTitle')}
                </span>

                {project.links.live && project.links.live !== '#' && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-sm bg-ink px-4 py-2 font-sans text-xs font-medium text-paper transition-colors hover:bg-ink/85"
                  >
                    {t('viewLive')} ↗
                  </a>
                )}

                {project.links.github && project.links.github !== '#' && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-sm border border-line bg-paper px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    {t('viewCode')} ↗
                  </a>
                )}

                {project.links.npm && (
                  <a
                    href={project.links.npm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-sm border border-line bg-paper px-4 py-2 font-mono text-xs text-red-600 transition-colors hover:border-red-500 dark:text-red-400"
                  >
                    {t('viewNpm')} ↗
                  </a>
                )}
              </div>
            </div>

            {/* Inquire CTA */}
            <div className="rounded-sm border border-line/80 bg-paper p-5 text-center">
              <p className="font-serif text-base text-ink">Un défi technique similaire ?</p>
              <p className="mt-1 font-sans text-xs text-muted">
                Concevons une architecture résiliente pour votre plateforme.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center justify-center rounded-sm border border-line px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Échanger sur un projet →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
