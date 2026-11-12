export interface Project {
  slug: string;
  title: string;
  category: 'fintech' | 'ai' | 'devtools' | 'web';
  year: string;
  client: string;
  role: {
    fr: string;
    en: string;
  };
  summary: {
    fr: string;
    en: string;
  };
  architecture: {
    fr: string;
    en: string;
  };
  metric: string;
  cover: string;
  stack: string[];
  links: {
    live?: string;
    github?: string;
    npm?: string;
  };
  caseStudy?: {
    context: {
      fr: string;
      en: string;
    };
    constraints: {
      fr: string[];
      en: string[];
    };
    decisions: {
      fr: {title: string; description: string}[];
      en: {title: string; description: string}[];
    };
    outcomes: {
      metric: string;
      label: {
        fr: string;
        en: string;
      };
    }[];
  };
}

export const PROJECTS: Project[] = [
  {
    slug: 'smartloan-ecobank',
    title: 'SmartLoan — Plateforme de Prêt Digital',
    category: 'fintech',
    year: '2024 - Présent',
    client: 'Ecobank Transnational Incorporated',
    role: {
      fr: 'Développeur Web & SQL / Concepteur d’Architecture',
      en: 'Web & SQL Developer / Architecture Engineer',
    },
    summary: {
      fr: 'Automatisation des flux de souscription de crédit, moteur de scoring en temps réel, intégration KYC et rapports réglementaires pour Ecobank.',
      en: 'End-to-end automation of digital loan underwriting, real-time credit scoring engine, KYC integration, and compliance reporting for Ecobank.',
    },
    architecture: {
      fr: 'Optimisation fine de procédures stockées SQL Server, amélioration de 40% du temps d’exécution des requêtes sous forte charge bancaire.',
      en: 'Tuning of core SQL Server stored procedures, reducing query latency by 40% under high-concurrency banking workloads.',
    },
    metric: '+$50M de volume traité',
    cover: '/projects/ecobank.png',
    stack: ['C#', '.NET Core', 'SQL Server', 'REST APIs', 'Power BI'],
    links: {
      github: '#',
    },
    caseStudy: {
      context: {
        fr: 'Les processus manuels d’évaluation et d’approbation de crédit bancaire engendraient des délais de traitement de plusieurs jours. L’objectif était de digitaliser l’ensemble du cycle d’octroi de prêts pour des dizaines de milliers de sociétaires.',
        en: 'Manual credit underwriting workflows introduced multi-day turnaround times. The objective was to digitize the entire loan origination lifecycle across thousands of bank members.',
      },
      constraints: {
        fr: [
          'Intégrité transactionnelle absolue (ACID) sans perte de données financières.',
          'Latence stricte sur le calcul des scores de risque en temps réel.',
          'Auditabilité totale de chaque modification de dossier pour les régulateurs bancaires.',
        ],
        en: [
          'Strict transactional ACID integrity with zero tolerance for financial data anomalies.',
          'Sub-second latency requirements on real-time risk scoring calculations.',
          'Complete audit trail for every application state change mandated by banking regulators.',
        ],
      },
      decisions: {
        fr: [
          {
            title: 'Refonte des index & procédures stockées',
            description:
              'Élimination des scans de table massifs par partitionnement et réécriture des plans d’exécution SQL Server.',
          },
          {
            title: 'Séparation du traitement opérationnel et du reporting',
            description:
              'Isolement des requêtes d’analyse lourdes vers des réplicas en lecture et des cubes Power BI.',
          },
        ],
        en: [
          {
            title: 'Index overhaul & procedure refactoring',
            description:
              'Eliminated costly table scans via table partitioning and SQL Server query execution plan rewrites.',
          },
          {
            title: 'Operational vs. Analytical decoupling',
            description:
              'Isolated heavy analytics workloads onto read replicas and dedicated Power BI models.',
          },
        ],
      },
      outcomes: [
        {
          metric: '+$50,000,000',
          label: {
            fr: 'de demandes de prêts traitées et accordées',
            en: 'in digital loan applications processed',
          },
        },
        {
          metric: '-40%',
          label: {
            fr: 'de réduction du temps d’exécution des requêtes de base de données',
            en: 'reduction in database query execution time',
          },
        },
        {
          metric: '99.9%',
          label: {
            fr: 'de disponibilité opérationnelle en production',
            en: 'operational uptime across production cycles',
          },
        },
      ],
    },
  },
  {
    slug: 'attendance-management-system',
    title: 'Univ-Check — Présence par Reconnaissance Faciale',
    category: 'ai',
    year: '2025',
    client: 'ESGIS University',
    role: {
      fr: 'Architecte Full-Stack & Ingénieur IA',
      en: 'Lead Full-Stack Architect & AI Engineer',
    },
    summary: {
      fr: 'Système biométrique complet de suivi de présence avec identification faciale instantanée, portail de supervision et synchronisation temps réel.',
      en: 'Biometric student attendance monitoring platform powered by instant facial recognition, real-time supervision portal, and mobile sync.',
    },
    architecture: {
      fr: 'Pipeline de détection et inférence avec modèles OpenCV/TensorFlow connectés à une interface réactive Next.js et PostgreSQL.',
      en: 'Detection and inference pipeline running OpenCV/TensorFlow models coupled with a responsive Next.js frontend and PostgreSQL.',
    },
    metric: 'Reconnaissance faciale temps réel',
    cover: '/projects/univ-check-admin.png',
    stack: ['Next.js', 'React', 'TypeScript', 'Python', 'TensorFlow', 'OpenCV', 'Tailwind CSS'],
    links: {
      live: 'https://univ-check.vercel.app/',
      github: 'https://github.com/kybaloo/attendance-management-ui',
    },
    caseStudy: {
      context: {
        fr: 'L’émargement papier dans les amphithéâtres de 300+ étudiants provoquait des pertes de temps significatives et des fraudes de présence. Il fallait un système autonome et infalsifiable.',
        en: 'Paper sign-in sheets in 300+ student auditoriums suffered from severe attendance fraud and lost instructional time. An autonomous, tamper-proof solution was needed.',
      },
      constraints: {
        fr: [
          'Inférence biométrique inférieure à 500 ms par visage.',
          'Résistance aux variations de luminosité et angles de caméra.',
          'Protection stricte des données biométriques (hachage des vecteurs d’embeddings).',
        ],
        en: [
          'Sub-500ms biometric inference latency per face.',
          'Robustness against challenging ambient lighting and camera angles.',
          'Strict privacy safeguards (raw image discard, vector embedding hashing).',
        ],
      },
      decisions: {
        fr: [
          {
            title: 'Stockage des embeddings vectoriels uniquement',
            description:
              'Aucune photo brute n’est conservée après extraction : seuls les vecteurs d’empreinte faciale normalisés sont indexés en base.',
          },
          {
            title: 'Architecture découplée Next.js / API Python',
            description:
              'Le portail d’administration web Next.js communique de façon asynchrone avec le moteur d’inférence Python.',
          },
        ],
        en: [
          {
            title: 'Vector embedding persistence',
            description:
              'Raw facial imagery is discarded immediately after extraction; only normalized embedding vectors are persisted.',
          },
          {
            title: 'Decoupled Next.js / Python API architecture',
            description:
              'The Next.js management portal interacts asynchronously with the dedicated Python inference microservice.',
          },
        ],
      },
      outcomes: [
        {
          metric: '< 400ms',
          label: {
            fr: 'temps moyen d’identification faciale par étudiant',
            en: 'average facial identification time per student',
          },
        },
        {
          metric: '0%',
          label: {
            fr: 'de fraude d’émargement possible',
            en: 'attendance impersonation rate',
          },
        },
      ],
    },
  },
  {
    slug: 'issuesync',
    title: 'IssueSync — CLI de Synchronisation GitHub',
    category: 'devtools',
    year: '2025',
    client: 'Open Source Community',
    role: {
      fr: 'Auteur & Mainteneur Open-Source',
      en: 'Author & Open-Source Maintainer',
    },
    summary: {
      fr: 'Outil en ligne de commande et bibliothèque Node.js pour la synchronisation, déduplication et migration d’issues entre dépôts GitHub distants.',
      en: 'Node.js CLI tool and library for bidirectional synchronization, deduplication, and migration of GitHub issues across remote repositories.',
    },
    architecture: {
      fr: 'Conception modulaire avec Commander.js, pagination optimisée via Octokit REST & GraphQL, et gestion des rate-limits GitHub.',
      en: 'Modular architecture built with Commander.js, paginated API ingestion via Octokit REST & GraphQL, and robust rate-limit backoff.',
    },
    metric: 'Publié sur npm registry',
    cover: '/projects/issue-sync.png',
    stack: ['Node.js', 'TypeScript', 'GitHub Octokit API', 'Commander.js', 'npm'],
    links: {
      live: 'https://www.npmjs.com/package/issuesync',
      github: 'https://github.com/kybaloo/issuesync',
      npm: 'https://www.npmjs.com/package/issuesync',
    },
    caseStudy: {
      context: {
        fr: 'Lors de refontes ou de migrations multi-dépôts, transférer des dizaines d’issues sans perdre les labels, assignations et historiques de commentaires représentait une corvée fastidieuse.',
        en: 'During large refactors or monorepo migrations, moving dozens of issues while preserving tags, milestones, and comment threads was error-prone.',
      },
      constraints: {
        fr: [
          'Respect strict des quotas d’appels de l’API GitHub (Rate Limits).',
          'Gestion sans échec des pannes réseau transitoires avec reprise sur checkpoint.',
        ],
        en: [
          'Strict adherence to GitHub REST & GraphQL API rate limit ceilings.',
          'Resilient recovery from transient network errors using checkpointed sync state.',
        ],
      },
      decisions: {
        fr: [
          {
            title: 'Algorithme de déduplication par signature',
            description:
              'Calcul d’une empreinte unique basée sur le titre et le contenu normalisé pour éviter les créations d’issues en double.',
          },
          {
            title: 'Packaging binaire et bibliothèque universelle',
            description:
              'Utilisable à la fois via `npx issuesync` dans un terminal ou importé en tant que module npm dans un workflow CI/CD.',
          },
        ],
        en: [
          {
            title: 'Signature-based deduplication engine',
            description:
              'Computes deterministic hashes from normalized titles and bodies to prevent duplicate creation.',
          },
          {
            title: 'Dual CLI and library packaging',
            description:
              'Executes seamlessly via `npx issuesync` in the terminal or imported as a programmatic SDK in CI/CD.',
          },
        ],
      },
      outcomes: [
        {
          metric: '100%',
          label: {
            fr: 'de fidélité des métadonnées (labels, jalons, commentaires)',
            en: 'metadata fidelity preserved during repository migration',
          },
        },
        {
          metric: '0 config',
          label: {
            fr: 'exécutable directement via npx',
            en: 'executable out of the box via npx',
          },
        },
      ],
    },
  },
  {
    slug: 'sapientia-admin',
    title: 'Sapientia — Console de Gestion et Analytics',
    category: 'web',
    year: '2025',
    client: 'ESGIS',
    role: {
      fr: 'Architecte Full-Stack',
      en: 'Full-Stack Software Architect',
    },
    summary: {
      fr: 'Panel d’administration pour la plateforme de jeu éducatif Sapientia. Supervision en temps réel des cohortes d’apprenants et analyses statistiques.',
      en: 'Executive administration panel for the Sapientia educational game platform. Real-time cohort monitoring, quiz performance metrics, and insights.',
    },
    architecture: {
      fr: 'Architecture d’API performante avec requêtes SQL PostgreSQL optimisées et tableau de bord réactif en Next.js.',
      en: 'High-performance API layer with tuned PostgreSQL aggregations and reactive Next.js dashboard views.',
    },
    metric: 'Plateforme académique ESGIS',
    cover: '/projects/sapientia-dashboard.png',
    stack: ['React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS'],
    links: {
      live: 'https://quiz-game-web-seven.vercel.app/',
      github: '#',
    },
  },
  {
    slug: 'expo-mit-2023',
    title: 'Expo MIT — Salon des Producteurs du Togo',
    category: 'web',
    year: '2023',
    client: 'Made in Togo (MIT)',
    role: {
      fr: 'Lead Développeur Web',
      en: 'Lead Web Developer',
    },
    summary: {
      fr: 'Plateforme web officielle de l’exposition Made in Togo. Inscription des exposants, plan interactif et blog d’actualités en direct.',
      en: 'Official web platform for the Made in Togo exhibition. Exhibitor registrations, interactive pavilion maps, and live event blogging.',
    },
    architecture: {
      fr: 'Architecture Laravel / Vue.js avec composants réactifs Livewire et cache de requêtes pour absorber les pics de trafic lors de l’inauguration.',
      en: 'Laravel / Vue.js architecture with reactive Livewire components and query caching to absorb event opening traffic spikes.',
    },
    metric: 'Plateforme événementielle nationale',
    cover: '/projects/expo-mit-2023.png',
    stack: ['PHP', 'Laravel', 'Vue.js', 'MySQL', 'Livewire', 'REST APIs'],
    links: {
      live: 'https://expo.togopride.com',
      github: '#',
    },
  },
  {
    slug: 'cod-arena',
    title: 'COD’Arena — Gestion d’Incubateur de Startups',
    category: 'web',
    year: '2023',
    client: 'Ethik Solutions',
    role: {
      fr: 'Développeur Full-Stack',
      en: 'Full-Stack Developer',
    },
    summary: {
      fr: 'Application web de suivi et d’incubation pour startups tech. Jalons d’avancement, revues de projets et supervision des cohortes.',
      en: 'Web management platform for technology startup incubators. Milestone tracking, mentor reviews, and cohort monitoring.',
    },
    architecture: {
      fr: 'Système modulaire avec gestion fine des permissions RBAC (Role-Based Access Control) et modélisation relationnelle MySQL.',
      en: 'Modular architecture with fine-grained RBAC permissions and relational MySQL schema modeling.',
    },
    metric: 'Incubation de cohortes tech',
    cover: '/projects/codearena-hero.png',
    stack: ['Laravel', 'PHP', 'MySQL', 'Blade', 'Tailwind CSS'],
    links: {
      live: 'http://codearena.ethiksolutions.com/',
      github: '#',
    },
  },
  {
    slug: 'va-hire',
    title: 'Va-Hire — Plateforme de Recrutement Spécialisé',
    category: 'web',
    year: '2024',
    client: 'Va-Hire Recruitment',
    role: {
      fr: 'Ingénieur Full-Stack',
      en: 'Full-Stack Engineer',
    },
    summary: {
      fr: 'Plateforme de mise en relation et de gestion du pipeline de recrutement pour talents techniques et assistants virtuels.',
      en: 'Recruitment portal and applicant tracking system matching technical talent and specialized virtual assistants with remote firms.',
    },
    architecture: {
      fr: 'Backend Node.js/Express typé, frontend TypeScript réactif et stockage document MongoDB avec indexation plein texte.',
      en: 'Strictly typed Node.js/Express backend, TypeScript frontend, and MongoDB document store with full-text candidate indexing.',
    },
    metric: 'Plateforme de recrutement',
    cover: '/projects/va-hire-hero.png',
    stack: ['Node.js', 'Express', 'TypeScript', 'React', 'MongoDB'],
    links: {
      live: 'https://va-hire.vercel.app/',
      github: 'https://github.com/kybaloo/va-hire-frontend',
    },
  },
  {
    slug: 'chatbot-ai',
    title: 'AI Conversational Agent — FastAPI & NLP',
    category: 'ai',
    year: '2023',
    client: 'Projet d’Ingénierie',
    role: {
      fr: 'Concepteur Backend & IA',
      en: 'AI & Backend Developer',
    },
    summary: {
      fr: 'Moteur d’agent conversationnel basé sur FastAPI avec traitement du langage naturel et compréhension d’intentions sémantiques.',
      en: 'Conversational agent service powered by FastAPI, featuring natural language processing and semantic intent classification.',
    },
    architecture: {
      fr: 'Microservice Python asynchrone avec pipelines Transformers et intégration par webhooks sécurisés.',
      en: 'Asynchronous Python microservice running Transformers pipelines with secure webhook callbacks.',
    },
    metric: 'Agent conversationnel NLP',
    cover: '/projects/univ-check-admin.png',
    stack: ['Python', 'FastAPI', 'Transformers', 'NLP', 'Docker'],
    links: {
      github: 'https://github.com/kybaloo/chatbot',
    },
  },
];

export function getProjects(category?: string): Project[] {
  if (!category || category === 'all') {
    return PROJECTS;
  }
  return PROJECTS.filter((p) => p.category === category);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
