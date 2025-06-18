"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

const experiences: Experience[] = [
  {
    id: "ecobank",
    company: "Ecobank Transnational Incorporated",
    position: "Web & SQL Developer",
    duration: "September 2022 - Present",
    location: "Lomé, Togo",
    description:
      "Leading development of core banking applications and data analytics solutions serving millions of customers across Africa.",
    achievements: [
      "Developed and maintained SmartLoan digital lending platform, processing over $50M in loan applications",
      "Designed and implemented real-time data analytics dashboards using Power BI and Tableau",
      "Optimized database queries resulting in 40% improvement in application performance",
      "Led integration of core banking systems with external APIs and third-party services",
      "Mentored junior developers and conducted code reviews for quality assurance",
    ],
    technologies: ["PHP", "Laravel", "Vue.js", "SQL Server", "Power BI", ".NET", "C#", "REST APIs"],
  },
  {
    id: "freelance",
    company: "Freelance Developer",
    position: "Full Stack Web Developer",
    duration: "January 2021 - August 2022",
    location: "Remote",
    description: "Delivered custom web applications and data solutions for various clients across different industries.",
    achievements: [
      "Built 20+ custom web applications using React, Vue.js, and Laravel",
      "Developed attendance management system with facial recognition technology",
      "Created business intelligence dashboards for data-driven decision making",
      "Implemented e-commerce solutions with payment gateway integrations",
      "Maintained 98% client satisfaction rate with on-time project delivery",
    ],
    technologies: ["React", "Vue.js", "Node.js", "Laravel", "MySQL", "MongoDB", "Python", "TensorFlow"],
  },
  {
    id: "internship",
    company: "Tech Solutions Togo",
    position: "Junior Developer Intern",
    duration: "June 2020 - December 2020",
    location: "Lomé, Togo",
    description:
      "Gained hands-on experience in web development and database management while contributing to various client projects.",
    achievements: [
      "Assisted in development of 5+ web applications using PHP and JavaScript",
      "Learned database design and SQL optimization techniques",
      "Participated in agile development process and daily standups",
      "Contributed to bug fixes and feature enhancements",
      "Completed training in modern web development frameworks",
    ],
    technologies: ["PHP", "JavaScript", "HTML5", "CSS3", "MySQL", "Bootstrap"],
  },
];

export default function AboutPage() {
  const { t } = useLanguage();
  const [activeExperience, setActiveExperience] = useState(experiences[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentExperience = experiences.find((exp) => exp.id === activeExperience) || experiences[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {t.about.title}
          </h1>
          <div className="w-24 h-1 mx-auto bg-blue-500 rounded-full"></div>
        </motion.div>

        {/* About Section */}
        <motion.section className="mb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                {t.about.subtitle} <span className="text-blue-500">{t.about.role}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{t.about.bio1}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">{t.about.bio2}</p>
              {/* Professional Stats */}
              <div className="grid grid-cols-2 gap-6 p-6 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">4+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.about.yearsExperience}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.about.projectsCompleted}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">15+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.about.technologiesMastered}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.about.clientSatisfaction}</div>
                </div>
              </div>
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2">{t.about.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300">TCHANGAI Florentin Kybaloo</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2">{t.about.email}</h4>
                  <p className="text-gray-600 dark:text-gray-300">kybalooflo@gmail.com</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2">{t.about.location}</h4>
                  <p className="text-gray-600 dark:text-gray-300">Lomé, Togo</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2">{t.about.availability}</h4>
                  <p className="text-green-500">{t.about.availabilityStatus}</p>
                </div>
              </div>{" "}
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {/* CV Download Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="inline-flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition-all duration-200 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {t.about.downloadResume}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                      <a
                        href="/cv-francais.txt"
                        download="CV_TCHANGAI_Kybaloo_Francais.txt"
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                          🇫🇷
                        </span>
                        <span className="font-medium">{t.about.downloadResumeFrench}</span>
                      </a>
                      <a
                        href="/cv-english.txt"
                        download="Resume_TCHANGAI_Kybaloo_English.txt"
                        className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                          🇺🇸
                        </span>
                        <span className="font-medium">{t.about.downloadResumeEnglish}</span>
                      </a>
                    </div>
                  )}
                </div>

                <a
                  href="https://linkedin.com/in/kybaloo"
                  className="inline-flex items-center px-6 py-3 font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600/10 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.about.linkedinProfile}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Profile Image */}
            <motion.div
              className="flex justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="relative w-80 h-80">
                <div className="absolute rounded-xl -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rotate-6"></div>
                <div className="absolute rounded-xl -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 -rotate-6"></div>
                <div className="relative w-full h-full overflow-hidden border-4 border-white dark:border-gray-700 rounded-xl shadow-xl">
                  <Image src="/about-me.png" alt="TCHANGAI Florentin Kybaloo" fill style={{ objectFit: "cover" }} />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Education & Languages Section */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Education */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Formation</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800 dark:text-white">ESGIS – Master en Architecture Logicielle</h4>
                  <p className="text-gray-600 dark:text-gray-400">2023 - 2025</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800 dark:text-white">ESGIS – Licence en Génie Logiciel</h4>
                  <p className="text-gray-600 dark:text-gray-400">2020 - 2023</p>
                </div>
              </div>
            </div>

            {/* Languages & Values */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Langues & Valeurs</h3>
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Langues</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                    Français - Natif
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                    Anglais - Professionnel
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Valeurs de travail</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                  <li>Code propre et maintenable</li>
                  <li>Design centré utilisateur</li>
                  <li>Apprentissage continu</li>
                  <li>Résolution collaborative</li>
                  <li>Attention aux détails</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Professional Experience Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Expérience Professionnelle</h2>
            <div className="w-24 h-1 mx-auto bg-blue-500 rounded-full"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Mon parcours professionnel et mes réalisations</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Experience Timeline */}
            <div className="lg:w-1/3">
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setActiveExperience(exp.id)}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                      activeExperience === exp.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 shadow-md"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">{exp.position}</div>
                    <div className="text-blue-600 dark:text-blue-400 font-medium mb-1">{exp.company}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{exp.duration}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Details */}
            <div className="lg:w-2/3">
              <motion.div
                key={activeExperience}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentExperience.position}</h3>
                  <div className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-3">{currentExperience.company}</div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {currentExperience.location}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                      </svg>
                      {currentExperience.duration}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{currentExperience.description}</p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Réalisations clés</h4>
                  <ul className="space-y-3">
                    {currentExperience.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technologies utilisées</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentExperience.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
