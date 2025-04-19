"use client";

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen py-20">
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {t.about.title}
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">{t.about.subtitle} <span className="text-blue-500">{t.about.role}</span> {t.about.withLove}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{t.about.bio1}</p>
            <p className="text-gray-700 dark:text-gray-300">{t.about.bio2}</p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Education</h3>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                <h4 className="font-medium">ESGIS – Master in Software Architecture</h4>
                <p className="text-gray-600 dark:text-gray-400">2018 - 2020</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h4 className="font-medium">ESGIS – Bachelor in Software Engineering</h4>
                <p className="text-gray-600 dark:text-gray-400">2015 - 2018</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Languages</h3>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
                  <span className="font-medium">French</span> - Native
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
                  <span className="font-medium">English</span> - Professional
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-medium w-24">{t.about.name}</span>
                  <span>TCHANGAI Kybaloo Florentin</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">{t.about.email}</span>
                  <span>kybalooflo@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">{t.about.location}</span>
                  <span>Lomé, Togo</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">{t.about.availability}</span>
                  <span className="text-green-500">{t.about.availabilityStatus}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Work Values</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Clean, maintainable code</li>
                <li>User-centered design</li>
                <li>Continuous learning</li>
                <li>Collaborative problem-solving</li>
                <li>Attention to detail</li>
              </ul>
            </div>
            
            <div className="mt-8">
              <a 
                href="/resume.pdf" 
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.about.downloadResume}
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
