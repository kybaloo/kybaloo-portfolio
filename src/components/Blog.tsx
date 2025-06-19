"use client";

import { useLanguage } from "@/context/LanguageContext";
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
  const { t } = useLanguage();
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
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">Latest Posts</h2>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>{" "}
          <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-300">
            Découvrez mes derniers articles sur le développement web, les technologies modernes et mes retours d&apos;expérience
          </p>
        </motion.div>

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="overflow-hidden transition-all duration-500 bg-white shadow-lg group dark:bg-gray-800 rounded-2xl hover:shadow-2xl"
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
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-100" />

                {/* Read More Button */}
                <div className="absolute transition-opacity duration-300 opacity-0 bottom-4 right-4 group-hover:opacity-100">
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className="px-4 py-2 text-sm font-medium text-gray-800 transition-all duration-200 rounded-full shadow-lg bg-white/90 hover:bg-white hover:scale-105"
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
                        className="px-2 py-1 text-xs font-medium text-blue-800 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-gray-800 transition-colors duration-300 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                  <Link href={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                </h3>

                {/* Summary */}
                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-3">{post.summary}</p>

                {/* Author and Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                      <span className="text-sm font-medium text-white">K</span>
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{post.author.split(" ")[0]}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug || post.id}`}
                    className="text-sm font-medium text-blue-600 transition-colors duration-200 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 font-medium text-white transition-opacity duration-300 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 hover:shadow-xl"
          >
            {t.blog.viewAllBlogPosts}
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
