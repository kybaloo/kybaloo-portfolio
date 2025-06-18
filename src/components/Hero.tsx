"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative flex items-center min-h-screen py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-64 h-64 rounded-full top-1/4 right-1/4 bg-blue-500/10 blur-3xl"></div>
        <div className="absolute rounded-full bottom-1/3 left-1/3 w-72 h-72 bg-purple-500/10 blur-3xl"></div>
      </div>

      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          {" "}
          <div className="w-full md:w-1/2 animate-slide-up">
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              <span className="block">{t.hero.greeting}</span>
              <span className="text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text">
                TCHANGAI Florentin Kybaloo
              </span>
            </h1>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{t.hero.subtitle}</h2>
              {/* <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{t.hero.currentRole}</p> */}
            </div>
            <p className="max-w-lg mb-8 text-lg text-gray-600 dark:text-gray-300">{t.hero.description}</p>{" "}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/#projects"
                className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {t.hero.viewWork}
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 font-medium text-blue-600 transition-colors bg-transparent border border-blue-600 rounded-lg dark:text-blue-400 hover:bg-blue-600/10"
              >
                {t.hero.contactMe}
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-12">
              <a href="https://github.com/kybaloo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg
                  className="w-6 h-6 text-gray-700 transition-colors dark:text-gray-300 hover:text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="https://linkedin.com/in/kybaloo" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg
                  className="w-6 h-6 text-gray-700 transition-colors dark:text-gray-300 hover:text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>{" "}
              <a href="https://www.freelancer.com/u/Kybaloo" target="_blank" rel="noopener noreferrer" aria-label="Freelancer">
                <svg
                  className="w-6 h-6 text-gray-700 transition-colors dark:text-gray-300 hover:text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex justify-center w-full md:w-1/2">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Placeholder for profile image - replace with your own image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-xl"></div>
              <div className="relative w-full h-full overflow-hidden border-4 border-white rounded-full shadow-xl dark:border-gray-800">
                <Image src="/about-me-one.png" alt="TCHANGAI Florentin Kybaloo" fill style={{ objectFit: "cover" }} priority />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
