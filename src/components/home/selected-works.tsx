import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  architecture: string;
  metric?: string;
  image: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export function SelectedWorks() {
  const t = useTranslations('home');

  const projects: ProjectItem[] = [
    {
      id: 'smartloan-ecobank',
      title: 'SmartLoan — Plateforme de Prêt Digital',
      category: 'Fintech & Core Banking',
      description:
        'Automatisation des flux de souscription de crédit, moteur de scoring en temps réel, intégration KYC et rapports réglementaires pour Ecobank Togo.',
      architecture:
        'Optimisation de procédures stockées SQL Server, amélioration de 40% du temps de traitement des requêtes sous charge bancaire.',
      metric: '+$50M de volumes traités',
      image: '/projects/ecobank.png',
      stack: ['C#', '.NET Core', 'SQL Server', 'jQuery', 'REST APIs'],
      githubUrl: '#',
    },
    {
      id: 'attendance-management-system',
      title: 'Univ-Check — Présence par Reconnaissance Faciale',
      category: 'Computer Vision & AI',
      description:
        'Système biométrique complet de suivi de présence avec identification faciale instantanée, portail de supervision RH et synchronisation mobile.',
      architecture:
        'Pipeline de détection et inférence avec modèles TensorFlow/OpenCV connectés à une architecture web Next.js réactive.',
      metric: 'Reconnaissance faciale temps réel',
      image: '/projects/univ-check-admin.png',
      stack: ['Next.js', 'React', 'Python', 'TensorFlow', 'OpenCV', 'Tailwind CSS'],
      liveUrl: 'https://univ-check.vercel.app/',
      githubUrl: 'https://github.com/kybaloo/attendance-management-ui',
    },
    {
      id: 'issuesync',
      title: 'IssueSync — CLI de Synchronisation GitHub',
      category: 'Developer Tools & Open-Source',
      description:
        "Outil en ligne de commande et bibliothèque Node.js pour la synchronisation, déduplication et migration d'issues entre dépôts GitHub distants.",
      architecture:
        "Architecture modulaire avec Commander.js et appels paginés optimisés via l'API REST & GraphQL de GitHub.",
      metric: 'Publié sur npm registry',
      image: '/projects/issue-sync.png',
      stack: ['Node.js', 'TypeScript', 'GitHub API', 'Commander.js', 'npm'],
      liveUrl: 'https://www.npmjs.com/package/issuesync',
      githubUrl: 'https://github.com/kybaloo/issuesync',
    },
    {
      id: 'sapientia-admin',
      title: 'Sapientia — Console de Gestion et Analytics',
      category: 'EdTech & Data Platform',
      description:
        "Panel d'administration pour la plateforme de jeu éducatif Sapientia. Supervision en temps réel des cohortes d'apprenants et analyses statistiques.",
      architecture:
        "Architecture d'API performante avec agrégations SQL complexes sur PostgreSQL et tableau de bord réactif en Next.js.",
      metric: 'Plateforme académique ESGIS',
      image: '/projects/sapientia-dashboard.png',
      stack: ['React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL'],
      liveUrl: 'https://quiz-game-web-seven.vercel.app/',
      githubUrl: '#',
    },
  ];

  return (
    <section id="travaux" className="border-b border-line py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 font-mono text-xs tracking-widest text-accent uppercase">
              01 / PORTFOLIO
            </div>
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">{t('worksTitle')}</h2>
            <p className="mt-2 max-w-xl text-base text-muted">{t('worksSubtitle')}</p>
          </div>
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted uppercase transition-colors hover:text-ink"
          >
            Tous les projets
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col justify-between overflow-hidden rounded-sm border border-line bg-paper transition-all duration-200 hover:border-accent/40"
            >
              <div>
                {/* Visual Thumbnail */}
                <div className="relative h-52 w-full overflow-hidden border-b border-line bg-muted/10">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {project.metric && (
                    <div className="absolute top-3 right-3 rounded-sm border border-line bg-paper/95 px-2.5 py-1 font-mono text-xs text-ink shadow-xs backdrop-blur-sm">
                      {project.metric}
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <div className="mb-1.5 font-mono text-[11px] tracking-wider text-accent uppercase">
                    {project.category}
                  </div>
                  <h3 className="mb-3 font-serif text-xl text-ink transition-colors group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="mb-4 font-sans text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  {/* Architecture Highlight (Style B touch) */}
                  <div className="mb-4 rounded-xs border-l-2 border-accent bg-muted/5 p-3">
                    <span className="mb-0.5 block font-mono text-[11px] tracking-wider text-muted uppercase">
                      {t('architectureLabel')}
                    </span>
                    <span className="font-sans text-xs text-ink/90">{project.architecture}</span>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-xs bg-muted/10 px-2 py-0.5 font-mono text-[11px] text-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between border-t border-line px-6 py-3 font-mono text-xs">
                {project.liveUrl && project.liveUrl !== '#' ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink transition-colors hover:text-accent"
                  >
                    <span>{t('viewLive')}</span>
                    <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <span className="text-muted/60">Usage interne / confidentiel</span>
                )}

                {project.githubUrl && project.githubUrl !== '#' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
                  >
                    <span>{t('viewCode')}</span>
                    <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
