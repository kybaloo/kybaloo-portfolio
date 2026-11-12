import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ProjectCatalog} from '@/modules/projects/project-filter';
import {PROJECTS} from '@/lib/projects-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'work'});

  return {
    title: `${t('title')} — Florentin Tchangai`,
    description: t('subtitle'),
  };
}

export default async function WorkPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'work'});

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="mb-2 font-mono text-xs tracking-widest text-accent uppercase">
            {t('tag')}
          </div>
          <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 font-sans text-base leading-relaxed text-muted sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Catalog with Interactive Filter */}
        <ProjectCatalog initialProjects={PROJECTS} locale={locale} />
      </div>
    </div>
  );
}
