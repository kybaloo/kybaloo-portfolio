import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PhilosophyReading} from '@/components/home/philosophy-reading';
import {Link} from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'writing'});

  return {
    title: `${t('title')} — Florentin Tchangai`,
    description: t('subtitle'),
  };
}

export default async function WritingPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'writing'});

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-14 max-w-3xl">
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

        {/* Editorial Announcement Banner */}
        <div className="mb-16 rounded-sm border border-line bg-paper/60 p-8 sm:p-10">
          <div className="mb-3 flex items-center gap-2 font-mono text-xs text-accent uppercase">
            <span className="h-2 w-2 rounded-full bg-accent" />
            NOTE ÉDITORIALE
          </div>
          <h2 className="font-serif text-2xl text-ink">
            Des écrits centrés sur la réalité du terrain et la robustesse des systèmes.
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted">
            {t('emptyState')} Les thèmes abordés incluront l’optimisation de requêtes SQL critiques
            sous forte charge, la conception d’APIs résilientes et l’artisanat d’interfaces web sans
            frameworks superflus.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link
              href="/contact"
              className="font-mono text-xs text-ink underline decoration-line underline-offset-4 hover:text-accent"
            >
              Être informé des premières publications →
            </Link>
          </div>
        </div>

        {/* Reference Reading List */}
        <div className="-mx-6">
          <PhilosophyReading />
        </div>
      </div>
    </div>
  );
}
