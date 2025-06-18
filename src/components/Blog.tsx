"use client";

import blogData from "@/data/blog.json";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  tags: string[];
  author: string;
  slug?: string;
}

const Blog = () => {
  const featuredPosts = blogData.slice(0, 3) as BlogPost[];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Latest Posts</h2>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>{" "}
          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-300">
            Découvrez mes derniers articles sur le développement web, les technologies modernes et mes retours d&apos;expérience
          </p>
        </motion.div>

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Post Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Read More Button */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className="px-4 py-2 bg-white/90 hover:bg-white text-gray-800 text-sm font-medium rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Lire l&apos;article
                  </Link>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Date and Tags */}
                <div className="flex items-center justify-between mb-3">
                  <time className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.date)}</time>
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                  <Link href={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                </h3>

                {/* Summary */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">{post.summary}</p>

                {/* Author and Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">K</span>
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{post.author.split(" ")[0]}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                  >
                    Lire plus →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Posts Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl"
          >
            Voir tous les articles
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
