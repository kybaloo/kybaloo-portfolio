"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import skillsData from "@/data/skills.json";
import { motion } from "framer-motion";
import Image from "next/image";
import { containerVariants, itemVariants } from "@/types/animations.types";

// Define types to match our JSON structure
type Skill = {
  name: string;
  level: number;
  icon?: string;
};

type SkillCategory = {
  category: string;
  items: Skill[];
};

const Skills = () => {
  const { t } = useLanguage();
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you might fetch this from an API
    // For now, we'll use the imported JSON data
    setSkillCategories(skillsData as SkillCategory[]);
    setLoading(false);
  }, []);

  // Map category names to translations
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "Frontend":
        return t.skills.frontend;
      case "Backend":
        return t.skills.backend;
      case "Database":
        return t.skills.data || "Data";
      case "DevOps & Cloud":
        return t.skills.devops || "DevOps & Cloud";
      case "Other":
        return t.skills.tools;
      default:
        return category;
    }
  };

  const softSkills = [t.skills.problemSolving, t.skills.teamCollaboration, t.skills.cleanCode, t.skills.responsiveDesign];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <motion.section id="skills" className="py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
            {t.skills.title}
          </h2>
          <motion.div
            className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: 96 }} // 24rem = 96px
            transition={{ delay: 0.3, duration: 0.5 }}
          ></motion.div>
          <p className="max-w-2xl mx-auto mt-6 text-gray-600 dark:text-gray-300">{t.skills.description}</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillCategories.map((category, index) => (
              <motion.div
                key={index}
                className="relative p-6 overflow-hidden transition-shadow bg-white shadow-md dark:bg-gray-800 rounded-xl hover:shadow-lg"
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <motion.h3
                  className="relative mb-6 text-xl font-bold text-center text-gray-800 dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {getCategoryTitle(category.category)}
                  <motion.div
                    className="absolute bottom-0 h-1 transform -translate-x-1/2 rounded-full left-1/2 bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: "30%" }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  />
                </motion.h3>
                <motion.div className="grid grid-cols-2 gap-3">
                  {category.items.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      className="flex items-center p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      whileHover={{ x: 5, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                      variants={{
                        hidden: { opacity: 0, x: -5 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { delay: skillIndex * 0.05 },
                        },
                      }}
                    >
                      {skill.icon && (
                        <div className="flex items-center justify-center w-8 h-8 mr-3 overflow-hidden">
                          <Image
                            src={skill.icon}
                            alt={skill.name}
                            className="w-6 h-6"
                            onError={(e) => {
                              // Fallback to a generic icon if the icon fails to load
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = "https://cdn.simpleicons.org/code";
                            }}
                          />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-2 gap-6 mt-16 text-center md:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          {softSkills.map((softSkill, index) => (
            <motion.div
              key={index}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
              variants={itemVariants}
            >
              <span className="font-medium text-gray-700 dark:text-gray-300">{softSkill}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Skills;
