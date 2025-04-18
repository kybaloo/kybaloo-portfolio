"use client";

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t.about.title}</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {t.about.subtitle} <span className="text-blue-500">{t.about.role}</span> {t.about.withLove}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t.about.bio1}
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t.about.bio2}
            </p>
            
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
                <p className="text-gray-600 dark:text-gray-300">Lome, Togo</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2">{t.about.availability}</h4>
                <p className="text-gray-600 dark:text-gray-300">{t.about.availabilityStatus}</p>
              </div>
            </div>
            
            <a 
              href="/resume.pdf" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.about.downloadResume}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-lg rotate-6"></div>
              <div className="absolute -inset-4 bg-purple-500/20 rounded-lg -rotate-6"></div>
              <div className="relative h-full w-full overflow-hidden rounded-lg border-4 border-white dark:border-gray-700 shadow-xl">
                <Image
                  src="/about-me.jpg"
                  alt="TCHANGAI Florentin Kybaloo"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
