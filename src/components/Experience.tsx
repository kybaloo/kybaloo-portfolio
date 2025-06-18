"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

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

const Experience = () => {
  const { t } = useLanguage();
  const [activeExperience, setActiveExperience] = useState(experiences[0].id);

  const currentExperience = experiences.find((exp) => exp.id === activeExperience) || experiences[0];

  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{t.experience.title}</h2>
          <div className="w-24 h-1 mx-auto bg-blue-500 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{t.experience.subtitle}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Experience Timeline */}
          <div className="lg:w-1/3">
            <div className="space-y-4">
              {experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => setActiveExperience(exp.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    activeExperience === exp.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{exp.position}</div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{exp.duration}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Experience Details */}
          <div className="lg:w-2/3">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentExperience.position}</h3>
                <div className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-2">{currentExperience.company}</div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    {currentExperience.location}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                    </svg>
                    {currentExperience.duration}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">{currentExperience.description}</p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.experience.keyAchievements}</h4>
                <ul className="space-y-2">
                  {currentExperience.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.experience.technologiesUsed}</h4>
                <div className="flex flex-wrap gap-2">
                  {currentExperience.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
