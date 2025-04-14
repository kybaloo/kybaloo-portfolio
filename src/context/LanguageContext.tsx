"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'fr';

// English translations
export const enTranslations = {
  nav: {
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Hi, I\'m',
    role: 'Full Stack Developer',
    description: 'I craft elegant solutions with code. Specializing in building exceptional digital experiences that combine functionality with beautiful design.',
    viewWork: 'View My Work',
    contactMe: 'Contact Me',
  },
  about: {
    title: 'About Me',
    subtitle: 'I\'m a passionate',
    role: 'Full Stack Developer',
    withLove: 'with a love for clean code',
    bio1: 'With over 5 years of experience in web development, I specialize in creating responsive, user-friendly applications that solve real-world problems. My journey in tech began with a curiosity about how websites work, which evolved into a career building digital solutions.',
    bio2: 'I believe in writing clean, maintainable code and staying updated with the latest industry trends and technologies. When I\'m not coding, you can find me exploring new hiking trails, reading tech blogs, or contributing to open-source projects.',
    name: 'Name:',
    email: 'Email:',
    location: 'Location:',
    availability: 'Availability:',
    availabilityStatus: 'Open to opportunities',
    downloadResume: 'Download Resume',
  },
  skills: {
    title: 'My Skills',
    description: 'I\'ve worked with a variety of technologies in the web development world. Here\'s an overview of my technical skills and expertise.',
    frontend: 'Frontend',
    backend: 'Backend',
    tools: 'Tools & Others',
    problemSolving: 'Problem Solving',
    teamCollaboration: 'Team Collaboration',
    cleanCode: 'Clean Code',
    responsiveDesign: 'Responsive Design',
  },
  projects: {
    title: 'My Projects',
    description: 'Here are some of my recent projects. Each project is built with a focus on performance, accessibility, and user experience.',
    featuredProjects: 'Featured Projects',
    otherProjects: 'Other Projects',
    liveDemo: 'Live Demo',
    viewMore: 'View More on GitHub',
  },
  contact: {
    title: 'Get In Touch',
    description: 'Have a project in mind or want to discuss potential opportunities? Feel free to reach out through the form below or via my social media channels.',
    sendMessage: 'Send Me a Message',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    subject: 'Subject',
    selectSubject: 'Select a subject',
    jobOpportunity: 'Job Opportunity',
    projectInquiry: 'Project Inquiry',
    collaboration: 'Collaboration',
    other: 'Other',
    yourMessage: 'Your Message',
    messagePlaceholder: 'Hello, I\'d like to talk about...',
    sending: 'Sending...',
    send: 'Send Message',
    successMessage: 'Your message has been sent successfully! I\'ll get back to you soon.',
    errorMessage: 'There was an error sending your message. Please try again later.',
    contactInfo: 'Contact Information',
    followMe: 'Follow Me',
  },
  footer: {
    description: 'A unique, developer-centric portfolio showcasing skills and projects with a focus on clean code and modern design.',
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Info',
    rights: 'All rights reserved.',
    designedWith: 'Designed with ❤️ using Next.js and Tailwind CSS',
  },
};

// French translations
export const frTranslations = {
  nav: {
    home: 'Accueil',
    about: 'À Propos',
    skills: 'Compétences',
    projects: 'Projets',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Bonjour, je suis',
    role: 'Développeur Full Stack',
    description: 'Je crée des solutions élégantes avec du code. Spécialisé dans la construction d\'expériences numériques exceptionnelles qui allient fonctionnalité et design élégant.',
    viewWork: 'Voir Mes Projets',
    contactMe: 'Me Contacter',
  },
  about: {
    title: 'À Propos de Moi',
    subtitle: 'Je suis un',
    role: 'Développeur Full Stack',
    withLove: 'passionné par le code propre',
    bio1: 'Avec plus de 5 ans d\'expérience en développement web, je me spécialise dans la création d\'applications réactives et conviviales qui résolvent des problèmes concrets. Mon parcours dans la technologie a commencé par une curiosité sur le fonctionnement des sites web, qui s\'est transformée en une carrière de construction de solutions numériques.',
    bio2: 'Je crois en l\'écriture de code propre et maintenable, tout en restant à jour avec les dernières tendances et technologies du secteur. Quand je ne code pas, vous pouvez me trouver en train d\'explorer de nouveaux sentiers de randonnée, de lire des blogs technologiques ou de contribuer à des projets open-source.',
    name: 'Nom:',
    email: 'Email:',
    location: 'Localisation:',
    availability: 'Disponibilité:',
    availabilityStatus: 'Ouvert aux opportunités',
    downloadResume: 'Télécharger CV',
  },
  skills: {
    title: 'Mes Compétences',
    description: 'J\'ai travaillé avec une variété de technologies dans le monde du développement web. Voici un aperçu de mes compétences techniques et de mon expertise.',
    frontend: 'Frontend',
    backend: 'Backend',
    tools: 'Outils & Autres',
    problemSolving: 'Résolution de Problèmes',
    teamCollaboration: 'Collaboration d\'Équipe',
    cleanCode: 'Code Propre',
    responsiveDesign: 'Design Responsive',
  },
  projects: {
    title: 'Mes Projets',
    description: 'Voici quelques-uns de mes projets récents. Chaque projet est construit avec un accent sur la performance, l\'accessibilité et l\'expérience utilisateur.',
    featuredProjects: 'Projets en Vedette',
    otherProjects: 'Autres Projets',
    liveDemo: 'Démo Live',
    viewMore: 'Voir Plus sur GitHub',
  },
  contact: {
    title: 'Entrer en Contact',
    description: 'Vous avez un projet en tête ou souhaitez discuter d\'opportunités potentielles? N\'hésitez pas à me contacter via le formulaire ci-dessous ou via mes réseaux sociaux.',
    sendMessage: 'Envoyez-moi un Message',
    yourName: 'Votre Nom',
    yourEmail: 'Votre Email',
    subject: 'Sujet',
    selectSubject: 'Sélectionnez un sujet',
    jobOpportunity: 'Opportunité d\'Emploi',
    projectInquiry: 'Demande de Projet',
    collaboration: 'Collaboration',
    other: 'Autre',
    yourMessage: 'Votre Message',
    messagePlaceholder: 'Bonjour, j\'aimerais discuter de...',
    sending: 'Envoi en cours...',
    send: 'Envoyer le Message',
    successMessage: 'Votre message a été envoyé avec succès! Je vous répondrai bientôt.',
    errorMessage: 'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer plus tard.',
    contactInfo: 'Informations de Contact',
    followMe: 'Suivez-moi',
  },
  footer: {
    description: 'Un portfolio unique centré sur le développeur présentant des compétences et des projets avec un accent sur le code propre et le design moderne.',
    quickLinks: 'Liens Rapides',
    contactInfo: 'Infos de Contact',
    rights: 'Tous droits réservés.',
    designedWith: 'Conçu avec ❤️ en utilisant Next.js et Tailwind CSS',
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
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(enTranslations);

  useEffect(() => {
    // Initialize language from localStorage if available
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language | null;
      if (savedLanguage) {
        setLanguageState(savedLanguage);
        setTranslations(savedLanguage === 'en' ? enTranslations : frTranslations);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setTranslations(lang === 'en' ? enTranslations : frTranslations);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
