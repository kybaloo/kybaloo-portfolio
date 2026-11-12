import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ServicesSection} from '@/components/home/services-section';
import {StackLayers} from '@/components/home/stack-layers';
import {Link} from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'expertise'});

  return {
    title: `${t('title')} — Florentin Tchangai`,
    description: t('subtitle'),
  };
}

export default async function ExpertisePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'expertise'});

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

        {/* 4 Pillars Section */}
        <div className="-mx-6">
          <ServicesSection />
        </div>

        {/* Technical Stack Layer-by-Layer */}
        <div className="-mx-6 mt-12">
          <StackLayers />
        </div>

        {/* Advisory Approach */}
        <div className="mt-20 rounded-sm border border-line bg-paper/60 p-8 sm:p-10">
          <div className="max-w-2xl">
            <span className="mb-2 block font-mono text-xs tracking-widest text-accent uppercase">
              MÉTHODOLOGIE D&apos;INTERVENTION
            </span>
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">
              Du diagnostic d&apos;architecture au déploiement sans friction
            </h2>
            <div className="mt-6 space-y-4 font-sans text-sm leading-relaxed text-muted">
              <p>
                <strong>1. Cadrage & Audit :</strong> Analyse des goulots d&apos;étranglement,
                inspection des schémas de données, évaluation de la dette technique et des métriques
                de charge.
              </p>
              <p>
                <strong>2. Architecture Cible & Spécifications :</strong> Définition des frontières
                modulaires, choix de persistance adaptés, modélisation des flux transactionnels et
                contrats d&apos;APIs stricts.
              </p>
              <p>
                <strong>3. Implémentation Craft :</strong> Développement TypeScript / Next.js / SQL
                sans artifice, tests automatisés systématiques et accompagnement de vos équipes
                techniques.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-sm bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:bg-ink/85"
              >
                {t('ctaProject')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
