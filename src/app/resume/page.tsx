"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download, Eye } from "lucide-react";
import Link from "next/link";

export default function ResumePage() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div className="mb-8" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au portfolio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Mon CV / My Resume
          </h1>
          <div className="w-24 h-1 mx-auto bg-blue-500 rounded-full"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Téléchargez mon CV en français ou en anglais</p>
        </motion.div>

        {/* CV Options */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* French CV */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">FR</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">CV Français</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Version française de mon curriculum vitae avec toutes mes expériences et compétences.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/cv-francais.txt"
                className="w-full inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:opacity-90 transition-opacity"
                download="CV_TCHANGAI_Kybaloo_Francais.txt"
              >
                <Download className="w-5 h-5 mr-2" />
                Télécharger CV (FR)
              </a>
              <a
                href="/cv-francais.txt"
                className="w-full inline-flex items-center justify-center px-6 py-3 font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-600/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="w-5 h-5 mr-2" />
                Voir en ligne
              </a>
            </div>
          </div>

          {/* English Resume */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">EN</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">English Resume</h2>
              <p className="text-gray-600 dark:text-gray-300">
                English version of my resume with all my professional experiences and skills.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="/cv-english.txt"
                className="w-full inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                download="Resume_TCHANGAI_Kybaloo_English.txt"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Resume (EN)
              </a>
              <a
                href="/cv-english.txt"
                className="w-full inline-flex items-center justify-center px-6 py-3 font-medium text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 rounded-lg hover:bg-purple-600/10 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Online
              </a>
            </div>
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          className="max-w-2xl mx-auto mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Informations sur les CV</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-semibold mb-2">Format</h4>
                <p>Fichiers texte (.txt) lisibles sur tous les appareils</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contenu</h4>
                <p>Expériences, formation, compétences et réalisations</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mise à jour</h4>
                <p>Dernière mise à jour : Juin 2025</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p>kybalooflo@gmail.com pour toute question</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Access to Portfolio Sections */}
        <motion.div
          className="max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">Explorer mon portfolio</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/about"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white">À propos</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Mon parcours et mes expériences</p>
            </Link>

            <Link
              href="/projects"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white">Projets</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Mes réalisations techniques</p>
            </Link>

            <Link
              href="/contact"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white">Contact</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Restons en contact</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
