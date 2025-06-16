"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Project } from "@/types/project.types";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
      },
    },
  };

  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <main className="min-h-screen py-20">
      <motion.div
        className="container px-4 mx-auto sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="mb-4 text-4xl font-bold text-center text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {t.projects.title}
        </motion.h1>

        <motion.p
          className="max-w-3xl mx-auto mb-16 text-center text-gray-600 dark:text-gray-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t.projects.description}
        </motion.p>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {featuredProjects.length > 0 && (
              <section className="mb-20">
                <h2 className="mb-8 text-2xl font-bold">{t.projects.featuredProjects}</h2>
                <motion.div
                  className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {featuredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="overflow-hidden bg-white shadow-lg dark:bg-gray-800 rounded-xl"
                      variants={itemVariants}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <div className="h-48 overflow-hidden">
                        <Image
                          src={project.image || "/placeholder-image.jpg"}
                          alt={project.title}
                          width={400}
                          height={200}
                          className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                        <p className="mb-4 text-gray-600 dark:text-gray-300 line-clamp-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.map((tech, index) => (
                            <span key={index} className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-md dark:bg-gray-700">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between mt-4">
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-500 hover:text-blue-700"
                          >
                            GitHub
                          </a>
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-white transition-opacity rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                            >
                              {t.projects.liveDemo}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {otherProjects.length > 0 && (
              <section>
                <h2 className="mb-8 text-2xl font-bold">{t.projects.otherProjects}</h2>
                <motion.div
                  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {otherProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="mb-2 text-lg font-bold">{project.title}</h3>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 3).map((tech, index) => (
                          <span key={index} className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-md dark:bg-gray-700">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-md dark:bg-gray-700">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between mt-4">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-500 hover:text-blue-700"
                        >
                          GitHub
                        </a>
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-purple-500 hover:text-purple-700"
                          >
                            {t.projects.liveDemo}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            <div className="mt-16 text-center">
              <a
                href="https://github.com/kybaloo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 font-medium text-white transition-opacity rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
              >
                {t.projects.viewMore}
              </a>
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
