"use client";

import { useLanguage } from "@/context/LanguageContext";
import projectsData from "@/data/projects.json";
import { Project } from "@/types/project.types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Projects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, setLoading] = useState(true);

  useEffect(() => {
    setProjects(projectsData as Project[]);
    setLoading(false);
  }, []);

  // Filter featured projects
  const featuredProjects = projects.filter((project) => project.featured);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = "unset";
  };

  const nextImage = () => {
    if (selectedProject?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images!.length);
    }
  };

  const prevImage = () => {
    if (selectedProject?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images!.length) % selectedProject.images!.length);
    }
  };

  const getCurrentImages = (project: Project) => {
    return project.images && project.images.length > 0 ? project.images : [project.image || "/placeholder.png"];
  };

  return (
    <>
      <section id="projects" className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">Selected Works</h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-300">
              Featured projects that have been meticulously crafted with passion to drive results and impact.
            </p>
          </div>

          {/* Featured Projects Grid - 2 cards per row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                whileHover={{ y: -8 }}
                onClick={() => openModal(project)}
              >
                {/* Project Image */}
                <div className="relative w-full h-80 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.png"}
                    alt={project.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Project Title on Image */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-200 text-sm leading-relaxed line-clamp-2">{project.miniDescription}</p>
                  </div>

                  {/* Hover Icon */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="p-3 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 5).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 5 && (
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        +{project.techStack.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Projects Link */}
          <div className="mt-16 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl"
            >
              Voir tous les projets
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>{" "}
              <div className="overflow-y-auto max-h-[90vh]">
                {/* Project Image Carousel */}
                <div className="relative w-full h-80">
                  {selectedProject.images && selectedProject.images.length > 1 ? (
                    <>
                      <Image
                        src={selectedProject.images[currentImageIndex]}
                        alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />

                      {/* Navigation Arrows */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {selectedProject.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                              index === currentImageIndex ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Image Counter */}
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedProject.images.length}
                      </div>
                    </>
                  ) : (
                    <Image
                      src={selectedProject.image || "/placeholder.png"}
                      alt={selectedProject.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Project Content */}
                <div className="p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">{selectedProject.title}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  {/* Features */}
                  {selectedProject.features && selectedProject.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Fonctionnalités clés</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedProject.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech Stack */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Technologies utilisées</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Voir le projet
                    </a>
                    {selectedProject.githubUrl !== "#" && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        Voir sur GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Projects;
