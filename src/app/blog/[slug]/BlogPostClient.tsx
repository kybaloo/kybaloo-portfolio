"use client";

import { useLanguage } from "@/context/LanguageContext";
import blogData from "@/data/blog.json";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  slug?: string;
}

interface BlogPostClientProps {
  slug: string;
}

const BlogPostClient = ({ slug }: BlogPostClientProps) => {
  const { language } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find post by ID or slug
    const foundPost = blogData.find((p) => p.id === slug || p.slug === slug);
    setPost(foundPost || null);
    setLoading(false);
  }, [slug]);

  const translations = {
    fr: {
      backToBlog: "Retour au Blog",
      publishedOn: "Publié le",
      by: "par",
      tags: "Tags",
      readMore: "Lire plus",
      postNotFound: "Article non trouvé",
      postNotFoundDesc: "L'article que vous recherchez n'existe pas ou a été supprimé.",
      goBack: "Retourner au blog",
    },
    en: {
      backToBlog: "Back to Blog",
      publishedOn: "Published on",
      by: "by",
      tags: "Tags",
      readMore: "Read more",
      postNotFound: "Post not found",
      postNotFoundDesc: "The post you're looking for doesn't exist or has been removed.",
      goBack: "Go back to blog",
    },
  };

  const t = translations[language as keyof typeof translations];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t.postNotFound}</h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">{t.postNotFoundDesc}</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.goBack}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToBlog}
          </Link>
        </motion.div>

        {/* Article header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero image */}
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          </div>

          {/* Article meta */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {t.publishedOn} {formatDate(post.date)}
                </span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>
                  {t.by} {post.author}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-6">
              <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium">{post.summary}</p>
          </div>

          {/* Article content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{children}</h3>,
                p: ({ children }) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ol>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">{children}</code>;
                  }
                  return (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
                      <code className="text-sm">{children}</code>
                    </pre>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{children}</td>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </motion.article>

        {/* Related posts or navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToBlog}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostClient;
