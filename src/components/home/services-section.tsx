import {useTranslations} from 'next-intl';

interface ServiceItem {
  number: string;
  titleKey: 's1Title' | 's2Title' | 's3Title' | 's4Title';
  descKey: 's1Desc' | 's2Desc' | 's3Desc' | 's4Desc';
  focusKey: 's1Focus' | 's2Focus' | 's3Focus' | 's4Focus';
  tags: string[];
}

export function ServicesSection() {
  const t = useTranslations('home');

  const services: ServiceItem[] = [
    {
      number: '01',
      titleKey: 's1Title',
      descKey: 's1Desc',
      focusKey: 's1Focus',
      tags: ['Core Banking', 'High Concurrency', 'Fault Tolerance', 'SQL Server'],
    },
    {
      number: '02',
      titleKey: 's2Title',
      descKey: 's2Desc',
      focusKey: 's2Focus',
      tags: ['Next.js 16', 'React 19', 'TypeScript', 'Design Systems', 'WCAG AA'],
    },
    {
      number: '03',
      titleKey: 's3Title',
      descKey: 's3Desc',
      focusKey: 's3Focus',
      tags: ['PostgreSQL', 'Redis', 'Power BI', 'OLAP Modeling', 'Query Tuning'],
    },
    {
      number: '04',
      titleKey: 's4Title',
      descKey: 's4Desc',
      focusKey: 's4Focus',
      tags: ['Node.js CLI', 'npm Registry', 'CI/CD Pipelines', 'Vision AI', 'Automation'],
    },
  ];

  return (
    <section id="expertise" className="border-b border-line py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="mb-2 font-mono text-xs tracking-widest text-accent uppercase">
            {t('servicesTag')}
          </div>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">{t('servicesTitle')}</h2>
          <p className="mt-2 max-w-2xl text-base text-muted">{t('servicesSubtitle')}</p>
        </div>

        {/* 4 Numbered Pillars Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.number}
              className="group relative flex flex-col justify-between rounded-sm border border-line bg-paper/40 p-6 transition-all duration-200 hover:border-ink/40 hover:bg-paper hover:shadow-xs sm:p-7"
            >
              <div>
                {/* Number & Accent header */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-accent">
                    [{service.number}]
                  </span>
                  <div className="ml-4 h-px flex-1 bg-line/60 transition-colors group-hover:bg-line" />
                </div>

                <h3 className="font-serif text-xl leading-snug text-ink transition-colors group-hover:text-accent sm:text-2xl">
                  {t(service.titleKey)}
                </h3>

                <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
                  {t(service.descKey)}
                </p>

                {/* Focus / Deliverables Callout */}
                <div className="mt-4 rounded-sm border-l-2 border-accent/40 bg-muted/5 py-1.5 pl-3">
                  <p className="font-mono text-xs leading-normal text-ink/80">
                    <span className="mr-1.5 text-muted select-none">→</span>
                    {t(service.focusKey)}
                  </p>
                </div>
              </div>

              {/* Tags / Keywords */}
              <div className="mt-6 flex flex-wrap gap-1.5 border-t border-line/60 pt-4">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xs border border-line bg-paper/60 px-2 py-0.5 font-mono text-[11px] text-muted/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
