"use client";

import projects from "@/data/projects.json"; // chemin vers ton fichier JSON
import { motion } from "framer-motion";
import Image from "next/image";

export default function OtherProjects() {
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">Autres Projets</h2>
        <div className="w-24 h-1 mx-auto mb-4 bg-blue-500 rounded-full"></div>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Découvrez d&apos;autres projets et réalisations issus de mon parcours académique, professionnel et open-source.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {otherProjects
          .filter((p) => !p.featured)
          .map((project) => (
            <motion.div
              key={project.id}
              className="overflow-hidden transition-shadow duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-xl hover:shadow-xl"
              whileHover={{ y: -5 }}
            >
              <div className="relative flex items-center justify-center h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="px-4 text-center text-white">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-6">
                <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">{project.title}</h4>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{project.miniDescription || project.description}</p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Liens */}
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Démo
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== "#" && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Lien global vers GitHub */}
      <div className="mt-12 text-center">
        <a
          href="https://github.com/kybaloo"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 text-white transition bg-blue-600 shadow rounded-xl hover:bg-blue-700"
        >
          Voir plus de projets sur GitHub
        </a>
      </div>
    </motion.section>
  );
}

// Ancienne version avant refactorisation

// <div className="flex items-center justify-center h-48 bg-gradient-to-br from-blue-500 to-purple-600">
//   <div className="text-center text-white">
//     <h3 className="text-xl font-bold">{project.title}</h3>
//   </div>
// </div>
// <div className="p-6">
//   <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">{project.miniDescription}</h4>
//   <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
//   <div className="flex flex-wrap gap-2 mb-4">
//     {project.tags.map((tech) => (
//       <span key={tech} className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded dark:bg-blue-900/30 dark:text-blue-300">
//         {tech}
//       </span>
//     ))}
//   </div>
//   <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
//     {project.liveUrl !== "#" && (
//       <a href={project.liveUrl} target="_blank" className="text-blue-500 hover:underline">
//         Demo
//       </a>
//     )}
//     {project.githubUrl !== "#" && (
//       <a href={project.githubUrl} target="_blank" className="text-blue-500 hover:underline">
//         Code
//       </a>
//     )}
//   </div>
// </div>
