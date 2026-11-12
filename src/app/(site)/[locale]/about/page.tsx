import type {Metadata} from 'next';
import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'about'});

  return {
    title: `${t('title')} — Florentin Tchangai`,
    description: t('subtitle'),
  };
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'about'});

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

        {/* Bio & Portrait */}
        <div className="mb-20 grid grid-cols-1 items-start gap-12 border-b border-line pb-16 lg:grid-cols-12">
          <div className="space-y-5 font-sans text-base leading-relaxed text-ink/90 lg:col-span-8">
            <p>{t('bioP1')}</p>
            <p>{t('bioP2')}</p>
            <p>{t('bioP3')}</p>

            {/* Resume Downloads */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center gap-2 rounded-sm border border-line bg-paper px-4 py-2.5 font-mono text-xs text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <svg
                  className="h-4 w-4 text-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                {t('downloadCv')}
              </a>

              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-1.5 rounded-sm border border-line/60 bg-paper/60 px-3 py-2 font-mono text-xs text-muted transition-colors hover:text-ink"
              >
                {t('cvEnglish')} (PDF)
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-4 lg:justify-end">
            <div className="relative h-56 w-56 overflow-hidden rounded-sm border border-line bg-muted/10 shadow-sm">
              <Image
                src="/about-me.png"
                alt="Florentin Tchangai Kybaloo"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 224px, 224px"
              />
            </div>
          </div>
        </div>

        {/* Experience & Education Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Professional Experience */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-line pb-3">
              <span className="font-mono text-xs font-semibold text-accent">01</span>
              <h2 className="font-serif text-xl text-ink sm:text-2xl">{t('experienceTitle')}</h2>
            </div>

            <div className="space-y-6">
              <article className="space-y-2 rounded-sm border border-line bg-paper/50 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium text-accent">2022 — Présent</span>
                  <span className="font-mono text-[11px] text-muted">Lomé, Togo</span>
                </div>
                <h3 className="font-serif text-lg text-ink">Ecobank Transnational Incorporated</h3>
                <p className="font-mono text-xs text-muted">Développeur Web & SQL</p>
                <p className="pt-1 font-sans text-xs leading-relaxed text-muted/90">
                  Développement et optimisation de la plateforme SmartLoan (+$50M de demandes
                  traitées). Optimisation de requêtes SQL critiques (+40% de performance), reporting
                  Power BI et intégration Core Banking.
                </p>
              </article>

              <article className="space-y-2 rounded-sm border border-line bg-paper/50 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium text-accent">2021 — 2022</span>
                  <span className="font-mono text-[11px] text-muted">Remote</span>
                </div>
                <h3 className="font-serif text-lg text-ink">Consultant & Développeur Freelance</h3>
                <p className="font-mono text-xs text-muted">Ingénieur Full Stack</p>
                <p className="pt-1 font-sans text-xs leading-relaxed text-muted/90">
                  Conception de 20+ applications web sur mesure avec React, Node.js et Laravel.
                  Système de reconnaissance faciale, passerelles de paiement et architectures
                  résilientes.
                </p>
              </article>
            </div>
          </section>

          {/* Academic Background */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-line pb-3">
              <span className="font-mono text-xs font-semibold text-accent">02</span>
              <h2 className="font-serif text-xl text-ink sm:text-2xl">{t('educationTitle')}</h2>
            </div>

            <div className="space-y-6">
              <article className="space-y-2 rounded-sm border border-line bg-paper/50 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium text-accent">2018 — 2020</span>
                  <span className="font-mono text-[11px] text-muted">ESGIS</span>
                </div>
                <h3 className="font-serif text-lg text-ink">Master en Architecture Logicielle</h3>
                <p className="pt-1 font-sans text-xs leading-relaxed text-muted/90">
                  Spécialisation en modélisation de systèmes distribués, patrons de conception
                  (Design Patterns), génie logiciel avancé et sécurité des architectures
                  d’information.
                </p>
              </article>

              <article className="space-y-2 rounded-sm border border-line bg-paper/50 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-medium text-accent">2015 — 2018</span>
                  <span className="font-mono text-[11px] text-muted">ESGIS</span>
                </div>
                <h3 className="font-serif text-lg text-ink">Licence en Génie Logiciel</h3>
                <p className="pt-1 font-sans text-xs leading-relaxed text-muted/90">
                  Bases algorithmiques, structures de données, conception orientée objet,
                  modélisation relationnelle de bases de données et développement web.
                </p>
              </article>
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 border-t border-line pt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-sm bg-ink px-6 py-3 font-sans text-sm font-medium text-paper transition-colors hover:bg-ink/85"
          >
            Échanger avec Florentin →
          </Link>
        </div>
      </div>
    </div>
  );
}
