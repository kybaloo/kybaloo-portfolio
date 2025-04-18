"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  slug: string;
};

export default function BlogPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        // In a real app, you would fetch from an API
        // For now, we'll use the local JSON file
        const response = await fetch('/api/blog');
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
      }
    }
    
    fetchBlogPosts();
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
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
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
          Blog
        </motion.h1>
        
        <motion.p 
          className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Thoughts, insights, and experiences from my journey as a developer.
        </motion.p>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.length > 0 ? (
              posts.map((post) => (
                <motion.article
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(post.date)}
                      </span>
                      <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {post.author}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-3 hover:text-blue-500 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.summary}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-blue-500 hover:text-blue-700 font-medium inline-flex items-center"
                    >
                      Read more
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-xl font-medium mb-2">No blog posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  I'm working on some interesting content. Check back soon for articles about web development, data analysis, and more!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
