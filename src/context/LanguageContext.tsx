"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type Language = "en" | "fr";

// English translations
export const enTranslations = {
  nav: {
    home: "Home",
    about: "About",
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    contact: "Contact",
    blog: "Blog",
  },
  hero: {
    greeting: "Hi, I'm",
    role: "Full Stack Developer",
    subtitle: "Full Stack Web Developer & Data Analyst",
    currentRole: "Web & SQL Developer at Ecobank Transnational Incorporated",
    description:
      "4+ years of experience building scalable web applications and transforming data into actionable insights. Specialized in React, Vue.js, Laravel, and business intelligence solutions.",
    viewWork: "View My Work",
    contactMe: "Get In Touch",
    scheduleCall: "Schedule a Call",
  },
  about: {
    title: "About Me",
    subtitle: "Full Stack Web Developer &",
    role: "Data Analyst",
    bio1: "With 4 years of experience in full-stack web development and data analysis, I specialize in creating robust, scalable solutions that drive business growth. Currently serving as a Web & SQL Developer at Ecobank Transnational Incorporated, I have successfully delivered enterprise-level applications that serve millions of users across Africa.",
    bio2: "My expertise spans from frontend technologies like React, Vue.js, and Next.js to backend systems using PHP, Laravel, Node.js, and .NET. I'm passionate about leveraging data analytics and business intelligence tools like Power BI and Tableau to transform raw data into actionable insights.",
    yearsExperience: "Years Experience",
    projectsCompleted: "Projects Completed",
    technologiesMastered: "Technologies Mastered",
    clientSatisfaction: "Client Satisfaction",
    name: "Name",
    email: "Email",
    location: "Location",
    currentRole: "Current Role",
    downloadResume: "Download Resume",
    downloadResumeFrench: "French Version",
    downloadResumeEnglish: "English Version",
    linkedinProfile: "LinkedIn Profile",
    withLove: "with ❤️",
    availability: "Availability",
    availabilityStatus: "Open to new opportunities",
    education: "Education",
    languagesAndValues: "Languages & Values",
    languages: "Languages",
    workValues: "Work Values",
    frenchNative: "French - Native",
    englishProfessional: "English - Professional",
    cleanCode: "Clean and maintainable code",
    userCenteredDesign: "User-centered design",
    continuousLearning: "Continuous learning",
    collaborativeSolving: "Collaborative problem solving",
    attentionToDetail: "Attention to detail",
    masterSoftwareArchitecture: "ESGIS – Master in Software Architecture",
    licenceSoftwareEngineering: "ESGIS – Bachelor in Software Engineering",
  },
  calendly: {
    scheduleCall: "Schedule a Call",
    freeConsultation: "Free Consultation (30 min)",
    discussProjectAndGoals: "Discuss your project and goals",
    discoveryCall: "Discovery Call (45 min)",
    inDepthAnalysis: "In-depth analysis of your needs",
    technicalReview: "Technical Review (60 min)",
    technicalAuditAndRecommendations: "Technical audit and recommendations",
    allCallsFreeAndWithoutObligation: "All calls are free and without obligation",
  },
  services: {
    title: "My Services",
    subtitle: "I offer a complete range of services to bring your digital projects to life",
    webDevelopment: {
      title: "Web Development",
      description: "Creating modern and high-performance web applications with React, Next.js and the latest technologies.",
    },
    uiuxDesign: {
      title: "UI/UX Design",
      description: "Designing intuitive user interfaces and optimal user experiences.",
    },
    websites: {
      title: "Websites",
      description: "Development of responsive, fast and SEO-optimized websites.",
    },
    mobileApps: {
      title: "Mobile Applications",
      description: "Creating cross-platform mobile applications with React Native and Flutter.",
    },
  },
  experience: {
    title: "Work Experience",
    subtitle: "4+ years of professional experience in web development and data analysis",
    currentPosition: "Web & SQL Developer",
    freelancePosition: "Full Stack Web Developer",
    internPosition: "Junior Developer Intern",
    keyAchievements: "Key Achievements",
    technologiesUsed: "Technologies Used",
    location: "Location",
    duration: "Duration",
  },
  skills: {
    title: "My Skills",
    description:
      "I've worked with a variety of technologies in the web development world. Here's an overview of my technical skills and expertise.",
    frontend: "Frontend",
    backend: "Backend",
    data: "Data",
    devops: "DevOps",
    tools: "Tools & Others",
    problemSolving: "Problem Solving",
    teamCollaboration: "Team Collaboration",
    cleanCode: "Clean Code",
    responsiveDesign: "Responsive Design",
  },
  projects: {
    title: "My Projects",
    description:
      "Here are some of my recent projects. Each project is built with a focus on performance, accessibility, and user experience.",
    featuredProjects: "Featured Projects",
    otherProjects: "Other Projects",
    liveDemo: "Live Demo",
    viewMore: "More on GitHub",
    viewDetails: "View Details",
    viewAllProjects: "View All Projects",
    keyFeatures: "Key Features",
    technologiesUsed: "Technologies Used",
  },
  projectsPage: {
    title: "Portfolio & Projects",
    description:
      "Discover a selection of my most significant projects. From design to production, each project reflects my passion for development and technological innovation.",
    category: "Web",
    featured: "Featured",
    liveDemo: "Live Demo",
    github: "GitHub",
    projectsCompleted: "Projects completed",
    technologies: "Technologies",
    yearsExperience: "Years of experience",
    clientsSatisfied: "Satisfied clients",
    readyToStart: "Ready to bring your project to life?",
    readyDescription:
      "I am passionate about creating innovative solutions. Let's discuss your next idea and build something extraordinary together.",
    startProject: "Start a project",
    viewMoreGithub: "View more on GitHub",
    modalDescription: "Description",
    modalTechnologiesUsed: "Technologies used",
    viewDemo: "View demo",
    sourceCode: "Source code",
  },
  blog: {
    title: "My Blog",
    description: "Thoughts, insights, and experiences from my journey as a developer.",
    readMore: "Read More",
    recentPosts: "Recent Posts",
    allPosts: "All Posts",
    publishedOn: "Published on",
    by: "by",
    noPostsYet: "No blog posts yet",
    comingSoon:
      "I'm working on some interesting content. Check back soon for articles about web development, data analysis, and more!",
    viewAllBlogPosts: "View All Blog Posts",
  },
  contact: {
    title: "Get In Touch",
    description:
      "Have a project in mind or want to discuss potential opportunities? Feel free to reach out through the form below or via my social media channels.",
    sendMessage: "Send Me a Message",
    yourName: "Your Name",
    yourEmail: "Your Email",
    subject: "Subject",
    selectSubject: "Select a subject",
    jobOpportunity: "Job Opportunity",
    projectInquiry: "Project Inquiry",
    collaboration: "Collaboration",
    other: "Other",
    yourMessage: "Your Message",
    messagePlaceholder: "Hello, I'd like to talk about...",
    sending: "Sending...",
    send: "Send Message",
    successMessage: "Your message has been sent successfully! I'll get back to you soon.",
    errorMessage: "There was an error sending your message. Please try again later.",
    contactInfo: "Contact Information",
    followMe: "Follow Me",
  },
  footer: {
    description: "A unique, developer-centric portfolio showcasing skills and projects with a focus on clean code and modern design.",
    quickLinks: "Quick Links",
    contactInfo: "Contact Info",
    rights: "All rights reserved.",
    designedWith: "Designed with ❤️ using Next.js and Tailwind CSS",
  },
};

// French translations
export const frTranslations = {
  nav: {
    home: "Accueil",
    about: "À Propos",
    experience: "Expérience",
    skills: "Compétences",
    projects: "Projets",
    contact: "Contact",
    blog: "Blog",
  },
  hero: {
    greeting: "Bonjour, je suis",
    role: "Développeur Full Stack",
    subtitle: "Développeur Web Full Stack & Analyste de Données",
    currentRole: "Développeur Web & SQL chez Ecobank Transnational Incorporated",
    description:
      "4+ années d'expérience dans la création d'applications web évolutives et la transformation de données en insights exploitables. Spécialisé en React, Vue.js, Laravel et solutions de business intelligence.",
    viewWork: "Voir Mes Projets",
    contactMe: "Me Contacter",
    scheduleCall: "Planifier un Appel",
  },
  about: {
    title: "À Propos de Moi",
    subtitle: "Développeur Web Full Stack &",
    role: "Analyste de Données",
    bio1: "Avec 4 années d'expérience en développement web full-stack et analyse de données, je me spécialise dans la création de solutions robustes et évolutives qui stimulent la croissance des entreprises. Actuellement Développeur Web & SQL chez Ecobank Transnational Incorporated, j'ai livré avec succès des applications de niveau entreprise qui servent des millions d'utilisateurs à travers l'Afrique.",
    bio2: "Mon expertise s'étend des technologies frontend comme React, Vue.js et Next.js aux systèmes backend utilisant PHP, Laravel, Node.js et .NET. Je suis passionné par l'exploitation des outils d'analyse de données et de business intelligence comme Power BI et Tableau pour transformer les données brutes en insights exploitables.",
    yearsExperience: "Années d'Expérience",
    projectsCompleted: "Projets Complétés",
    technologiesMastered: "Technologies Maîtrisées",
    clientSatisfaction: "Satisfaction Client",
    name: "Nom",
    email: "Email",
    location: "Localisation",
    currentRole: "Poste Actuel",
    downloadResume: "Télécharger CV",
    downloadResumeFrench: "Version Française",
    downloadResumeEnglish: "Version Anglaise",
    linkedinProfile: "Profil LinkedIn",
    withLove: "avec ❤️",
    availability: "Disponibilité",
    availabilityStatus: "Disponible pour de nouvelles opportunités",
    education: "Formation",
    languagesAndValues: "Langues & Valeurs",
    languages: "Langues",
    workValues: "Valeurs de travail",
    frenchNative: "Français - Natif",
    englishProfessional: "Anglais - Professionnel",
    cleanCode: "Code propre et maintenable",
    userCenteredDesign: "Design centré utilisateur",
    continuousLearning: "Apprentissage continu",
    collaborativeSolving: "Résolution collaborative",
    attentionToDetail: "Attention aux détails",
    masterSoftwareArchitecture: "ESGIS – Master en Architecture Logicielle",
    licenceSoftwareEngineering: "ESGIS – Licence en Génie Logiciel",
  },
  calendly: {
    scheduleCall: "Planifier un Appel",
    freeConsultation: "Consultation Gratuite (30 min)",
    discussProjectAndGoals: "Discuter de votre projet et objectifs",
    discoveryCall: "Appel de découverte (45 min)",
    inDepthAnalysis: "Analyse approfondie de vos besoins",
    technicalReview: "Revue technique (60 min)",
    technicalAuditAndRecommendations: "Audit technique et recommandations",
    allCallsFreeAndWithoutObligation: "Tous les appels sont gratuits et sans engagement",
  },
  services: {
    title: "Mes Services",
    subtitle: "Je propose une gamme complète de services pour concrétiser vos projets digitaux",
    webDevelopment: {
      title: "Développement Web",
      description: "Création d'applications web modernes et performantes avec React, Next.js et les dernières technologies.",
    },
    uiuxDesign: {
      title: "UI/UX Design",
      description: "Conception d'interfaces utilisateur intuitives et d'expériences utilisateur optimales.",
    },
    websites: {
      title: "Sites Web",
      description: "Développement de sites web responsives, rapides et optimisés pour le référencement.",
    },
    mobileApps: {
      title: "Applications Mobiles",
      description: "Création d'applications mobiles cross-platform avec React Native et Flutter.",
    },
  },
  experience: {
    title: "Expérience Professionnelle",
    subtitle: "4+ années d'expérience professionnelle en développement web et analyse de données",
    currentPosition: "Développeur Web & SQL",
    freelancePosition: "Développeur Web Full Stack",
    internPosition: "Stagiaire Développeur Junior",
    keyAchievements: "Réalisations Clés",
    technologiesUsed: "Technologies Utilisées",
    location: "Localisation",
    duration: "Durée",
  },
  skills: {
    title: "Mes Compétences",
    description:
      "J'ai travaillé avec une variété de technologies dans le monde du développement web. Voici un aperçu de mes compétences techniques et de mon expertise.",
    frontend: "Frontend",
    backend: "Backend",
    data: "Données",
    devops: "DevOps",
    tools: "Outils & Autres",
    problemSolving: "Résolution de Problèmes",
    teamCollaboration: "Collaboration d'Équipe",
    cleanCode: "Code Propre",
    responsiveDesign: "Design Responsive",
  },
  projects: {
    title: "Mes Projets",
    description:
      "Voici quelques-uns de mes projets récents. Chaque projet est construit avec un accent sur la performance, l'accessibilité et l'expérience utilisateur.",
    featuredProjects: "Projets en Vedette",
    otherProjects: "Autres Projets",
    liveDemo: "Démo Live",
    viewMore: "Voir Plus sur GitHub",
    viewDetails: "Voir Détails",
    viewAllProjects: "Voir tous les projets",
    keyFeatures: "Fonctionnalités clés",
    technologiesUsed: "Technologies utilisées",
  },
  projectsPage: {
    title: "Portfolio & Projets",
    description:
      "Découvrez une sélection de mes projets les plus significatifs. De la conception à la mise en production, chaque projet reflète ma passion pour le développement et l'innovation technologique.",
    category: "Web",
    featured: "Featured",
    liveDemo: "Démo live",
    github: "GitHub",
    projectsCompleted: "Projets réalisés",
    technologies: "Technologies",
    yearsExperience: "Années d'expérience",
    clientsSatisfied: "Clients satisfaits",
    readyToStart: "Prêt à donner vie à votre projet ?",
    readyDescription:
      "Je suis passionné par la création de solutions innovantes. Discutons de votre prochaine idée et construisons quelque chose d'extraordinaire ensemble.",
    startProject: "Commencer un projet",
    viewMoreGithub: "Voir plus sur GitHub",
    modalDescription: "Description",
    modalTechnologiesUsed: "Technologies utilisées",
    viewDemo: "Voir la démo",
    sourceCode: "Code source",
  },
  blog: {
    title: "Mon Blog",
    description: "Réflexions, idées et expériences de mon parcours en tant que développeur.",
    readMore: "Lire Plus",
    recentPosts: "Articles Récents",
    allPosts: "Tous les Articles",
    publishedOn: "Publié le",
    by: "par",
    noPostsYet: "Pas encore d'articles",
    comingSoon:
      "Je travaille sur du contenu intéressant. Revenez bientôt pour des articles sur le développement web, l'analyse de données et plus encore !",
    viewAllBlogPosts: "Voir tous les articles",
  },
  contact: {
    title: "Entrer en Contact",
    description:
      "Vous avez un projet en tête ou souhaitez discuter d'opportunités potentielles? N'hésitez pas à me contacter via le formulaire ci-dessous ou via mes réseaux sociaux.",
    sendMessage: "Envoyez-moi un Message",
    yourName: "Votre Nom",
    yourEmail: "Votre Email",
    subject: "Sujet",
    selectSubject: "Sélectionnez un sujet",
    jobOpportunity: "Opportunité d'Emploi",
    projectInquiry: "Demande de Projet",
    collaboration: "Collaboration",
    other: "Autre",
    yourMessage: "Votre Message",
    messagePlaceholder: "Bonjour, j'aimerais discuter de...",
    sending: "Envoi en cours...",
    send: "Envoyer le Message",
    successMessage: "Votre message a été envoyé avec succès! Je vous répondrai bientôt.",
    errorMessage: "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer plus tard.",
    contactInfo: "Informations de Contact",
    followMe: "Suivez-moi",
  },
  footer: {
    description:
      "Un portfolio unique centré sur le développeur présentant des compétences et des projets avec un accent sur le code propre et le design moderne.",
    quickLinks: "Liens Rapides",
    contactInfo: "Infos de Contact",
    rights: "Tous droits réservés.",
    designedWith: "Conçu avec ❤️ en utilisant Next.js et Tailwind CSS",
  },
};

type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<Translations>(enTranslations);

  useEffect(() => {
    // Initialize language from localStorage if available
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language | null;
      if (savedLanguage) {
        setLanguageState(savedLanguage);
        setTranslations(savedLanguage === "en" ? enTranslations : frTranslations);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setTranslations(lang === "en" ? enTranslations : frTranslations);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
