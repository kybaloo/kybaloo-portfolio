import {useTranslations} from 'next-intl';

interface LayerItem {
  layerId: string;
  name: string;
  titleKey: 'stackLayer1Title' | 'stackLayer2Title' | 'stackLayer3Title' | 'stackLayer4Title';
  itemsKey: 'stackLayer1Items' | 'stackLayer2Items' | 'stackLayer3Items' | 'stackLayer4Items';
  technologies: {name: string; role: string; highlight?: boolean}[];
}

export function StackLayers() {
  const t = useTranslations('home');

  const layers: LayerItem[] = [
    {
      layerId: '01',
      name: 'CLIENT & INTERACTION',
      titleKey: 'stackLayer1Title',
      itemsKey: 'stackLayer1Items',
      technologies: [
        {name: 'Next.js 16 (App Router)', role: 'SSR & Hybrid Framework', highlight: true},
        {name: 'React 19', role: 'Component Architecture'},
        {name: 'TypeScript', role: 'Type Safety & Contracts', highlight: true},
        {name: 'Tailwind CSS v4', role: 'Token-based Styling'},
        {name: 'Radix UI', role: 'Accessible Headless Primitives'},
      ],
    },
    {
      layerId: '02',
      name: 'RUNTIME & LOGIC',
      titleKey: 'stackLayer2Title',
      itemsKey: 'stackLayer2Items',
      technologies: [
        {name: 'Node.js & Express', role: 'High-throughput APIs'},
        {name: 'Python', role: 'AI & Data Scripts'},
        {name: '.NET Core & C#', role: 'Enterprise & Banking Backends', highlight: true},
        {name: 'REST & GraphQL', role: 'Contract Protocols'},
      ],
    },
    {
      layerId: '03',
      name: 'DATA & PERSISTENCE',
      titleKey: 'stackLayer3Title',
      itemsKey: 'stackLayer3Items',
      technologies: [
        {name: 'SQL Server', role: 'Ecobank Core Banking DB', highlight: true},
        {name: 'PostgreSQL', role: 'Relational Store & JSONB', highlight: true},
        {name: 'Redis', role: 'In-Memory Cache & Job Queues'},
        {name: 'Prisma ORM', role: 'Schema Migrations & Types'},
        {name: 'Power BI / Tableau', role: 'Analytical Dashboards'},
      ],
    },
    {
      layerId: '04',
      name: 'DEVOPS & AI AGENTS',
      titleKey: 'stackLayer4Title',
      itemsKey: 'stackLayer4Items',
      technologies: [
        {name: 'Docker', role: 'Containerized Environments'},
        {name: 'GitHub Actions', role: 'Automated CI/CD & Testing', highlight: true},
        {name: 'npm Registry', role: 'CLI & Package Distribution'},
        {name: 'OpenCV & TensorFlow', role: 'Facial Identification Models'},
        {name: 'Vercel & Linux VPS', role: 'Edge & Cloud Hosting'},
      ],
    },
  ];

  return (
    <section id="stack" className="border-b border-line bg-paper/30 py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="mb-2 font-mono text-xs tracking-widest text-accent uppercase">
            {t('stackTag')}
          </div>
          <h2 className="font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {t('stackTitle')}
          </h2>
          <p className="mt-2 max-w-2xl text-base text-muted">{t('stackSubtitle')}</p>
        </div>

        {/* Stack Layers Timeline / Stacked Cards */}
        <div className="space-y-4">
          {layers.map((layer) => (
            <div
              key={layer.layerId}
              className="rounded-2xl border border-line bg-paper/80 p-5 shadow-2xs backdrop-blur-xs transition-all duration-300 hover:border-accent/40 hover:shadow-md sm:p-6"
            >
              {/* Layer Title Row */}
              <div className="flex flex-col justify-between gap-2 border-b border-line/60 pb-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-accent">
                    L-{layer.layerId}
                  </span>
                  <h3 className="font-sans text-lg font-bold tracking-tight text-ink sm:text-xl">
                    {t(layer.titleKey)}
                  </h3>
                </div>
                <span className="font-mono text-xs tracking-wider text-muted/70">
                  [{layer.name}]
                </span>
              </div>

              {/* Technologies Grid */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {layer.technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col justify-center rounded-xl border border-line/60 bg-paper/70 px-3.5 py-2.5 shadow-2xs transition-colors hover:border-ink/30 hover:bg-paper"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-medium text-ink">{tech.name}</span>
                      {tech.highlight && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-accent"
                          title="Core Production Tool"
                        />
                      )}
                    </div>
                    <span className="mt-0.5 font-sans text-[11px] text-muted">{tech.role}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
