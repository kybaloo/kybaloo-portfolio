"use client";

import OtherProjects from "@/components/OtherProjects";
import { useLanguage } from "@/context/LanguageContext";
import projectsData from "@/data/projects.json";
import { Project } from "@/types/project.types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Use local data instead of API
    setProjects(projectsData as Project[]);
    setLoading(false);
  }, []);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };
  const nextImage = () => {
    if (selectedProject && selectedProject.images) {
      setCurrentImageIndex((prev) => (prev === selectedProject.images!.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (selectedProject && selectedProject.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProject.images!.length - 1 : prev - 1));
    }
  };

  // Filter projects (for now, show all projects)
  const filteredProjects = projects;

  return (
    <main className="min-h-screen py-20">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {" "}
          <h1 className="mb-6 text-5xl font-bold text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text">
            {t.projectsPage.title}
          </h1>
          <div className="w-32 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>{" "}
          <p className="max-w-4xl mx-auto text-xl leading-relaxed text-gray-600 dark:text-gray-300">{t.projectsPage.description}</p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full dark:border-gray-700 animate-spin border-t-blue-500"></div>
              <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <motion.div
              className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {filteredProjects
                .filter((p) => p.featured)
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-lg group dark:bg-gray-800 rounded-2xl hover:shadow-2xl dark:border-gray-700"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => openModal(project)}
                  >
                    {/* Project Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={project.images?.[0] || project.image || "/placeholder-image.jpg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100"></div>
                      <div className="absolute top-4 right-4">
                        {" "}
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 dark:bg-gray-800/90">
                          {project.category || t.projectsPage.category}
                        </span>
                      </div>
                      {project.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                            ⭐ {t.projectsPage.featured}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-800 transition-colors dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {project.title}
                        </h3>
                        <button className="text-gray-400 transition-colors hover:text-blue-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3">{project.description}</p>
                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.slice(0, 4).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 text-sm text-blue-700 border border-blue-200 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300 dark:border-blue-700"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                            +{project.techStack.length - 4}
                          </span>
                        )}
                      </div>{" "}
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {project.liveUrl && project.liveUrl !== "#" && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2 font-medium text-center text-white transition-opacity rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t.projectsPage.liveDemo}
                          </a>
                        )}
                        {project.githubUrl && project.githubUrl !== "#" && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t.projectsPage.github}
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
            {/* Stats Section */}{" "}
            <motion.div
              className="p-8 mb-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                {" "}
                <div>
                  <div className="mb-2 text-3xl font-bold text-blue-600 dark:text-blue-400">{projects.length}+</div>
                  <div className="text-gray-600 dark:text-gray-300">{t.projectsPage.projectsCompleted}</div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-purple-600 dark:text-purple-400">15+</div>
                  <div className="text-gray-600 dark:text-gray-300">{t.projectsPage.technologies}</div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-green-600 dark:text-green-400">4+</div>
                  <div className="text-gray-600 dark:text-gray-300">{t.projectsPage.yearsExperience}</div>
                </div>
                <div>
                  <div className="mb-2 text-3xl font-bold text-orange-600 dark:text-orange-400">100%</div>
                  <div className="text-gray-600 dark:text-gray-300">{t.projectsPage.clientsSatisfied}</div>
                </div>
              </div>
            </motion.div>
            {/* Other Projects Section */}
            <OtherProjects />
            {/* Call to Action */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {" "}
              <div className="p-8 bg-white border border-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl dark:border-gray-700">
                <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">{t.projectsPage.readyToStart}</h2>{" "}
                <p className="max-w-2xl mx-auto mb-6 text-gray-600 dark:text-gray-300">{t.projectsPage.readyDescription}</p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <a
                    href="/contact"
                    className="px-8 py-3 font-medium text-white transition-opacity rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                  >
                    {t.projectsPage.startProject}
                  </a>
                  <a
                    href="https://github.com/kybaloo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 font-medium text-blue-600 transition-colors border border-blue-600 rounded-lg dark:text-blue-400 dark:border-blue-400 hover:bg-blue-600/10"
                  >
                    {t.projectsPage.viewMoreGithub}
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Modal */}
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedProject.title}</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Image Carousel */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div className="relative mb-6">
                    <div className="relative overflow-hidden h-80 rounded-xl">
                      <Image
                        src={selectedProject.images[currentImageIndex]}
                        alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute p-2 text-white transition-colors transform -translate-y-1/2 rounded-full left-4 top-1/2 bg-black/50 hover:bg-black/70"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute p-2 text-white transition-colors transform -translate-y-1/2 rounded-full right-4 top-1/2 bg-black/50 hover:bg-black/70"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Image indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                          {selectedProject.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentImageIndex ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Project Details */}
                <div className="space-y-6">
                  {" "}
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">{t.projectsPage.modalDescription}</h3>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">{selectedProject.description}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                      {t.projectsPage.modalTechnologiesUsed}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm text-blue-700 border border-blue-200 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300 dark:border-blue-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    {selectedProject.demoUrl && (
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 font-medium text-white transition-opacity rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                      >
                        {t.projectsPage.viewDemo}
                      </a>
                    )}
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {t.projectsPage.sourceCode}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
