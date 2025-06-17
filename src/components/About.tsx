"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">{t.about.title}</h2>
          <div className="w-24 h-1 mx-auto bg-blue-500 rounded-full"></div>
        </div>

        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
              {t.about.subtitle} <span className="text-blue-500">{t.about.role}</span>
            </h3>

            <p className="mb-6 text-gray-600 dark:text-gray-300">{t.about.bio1}</p>

            <p className="mb-6 text-gray-600 dark:text-gray-300">{t.about.bio2}</p>

            {/* Professional Stats */}
            <div className="grid grid-cols-2 gap-6 p-6 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-700/50">
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

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h4 className="mb-2 font-bold text-gray-700 dark:text-gray-200">{t.about.name}</h4>
                <p className="text-gray-600 dark:text-gray-300">TCHANGAI Florentin Kybaloo</p>
              </div>
              <div>
                <h4 className="mb-2 font-bold text-gray-700 dark:text-gray-200">{t.about.email}</h4>
                <p className="text-gray-600 dark:text-gray-300">kybalooflo@gmail.com</p>
              </div>
              <div>
                <h4 className="mb-2 font-bold text-gray-700 dark:text-gray-200">{t.about.location}</h4>
                <p className="text-gray-600 dark:text-gray-300">Lomé, Togo</p>
              </div>
              <div>
                <h4 className="mb-2 font-bold text-gray-700 dark:text-gray-200">{t.about.currentRole}</h4>
                <p className="text-gray-600 dark:text-gray-300">Web & SQL Developer</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="/resume"
                className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.about.downloadResume}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/kybaloo"
                className="inline-flex items-center px-6 py-3 font-medium text-blue-600 transition-colors bg-transparent border border-blue-600 rounded-lg dark:text-blue-400 hover:bg-blue-600/10"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.about.linkedinProfile}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div className="absolute rounded-lg -inset-4 bg-blue-500/20 rotate-6"></div>
              <div className="absolute rounded-lg -inset-4 bg-purple-500/20 -rotate-6"></div>
              <div className="relative w-full h-full overflow-hidden border-4 border-white rounded-lg shadow-xl dark:border-gray-700">
                <Image src="/about-me.png" alt="TCHANGAI Florentin Kybaloo" fill style={{ objectFit: "cover" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
