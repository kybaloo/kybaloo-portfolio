"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types/project.types';

export default function ProjectsPage() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };
  
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);
  
  return (
    <main className="min-h-screen py-20">
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {t.projects.title}
        </motion.h1>
        
        <motion.p 
          className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t.projects.description}
        </motion.p>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {featuredProjects.length > 0 && (
              <section className="mb-20">
                <h2 className="text-2xl font-bold mb-8">{t.projects.featuredProjects}</h2>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {featuredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                      variants={itemVariants}
                      whileHover={{ 
                        y: -5,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.map((tech, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between mt-4">
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 font-medium"
                          >
                            GitHub
                          </a>
                          {project.demoUrl && (
                            <a 
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
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
                <h2 className="text-2xl font-bold mb-8">{t.projects.otherProjects}</h2>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {otherProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                    >
                      <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 3).map((tech, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-medium">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between mt-4">
                        <a 
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                        >
                          GitHub
                        </a>
                        {project.demoUrl && (
                          <a 
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-500 hover:text-purple-700 font-medium text-sm"
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
            
            <div className="text-center mt-16">
              <a 
                href="https://github.com/kybaloo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
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
