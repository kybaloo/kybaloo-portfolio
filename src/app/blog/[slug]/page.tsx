import blogData from "@/data/blog.json";
import { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";

// Generate metadata for the blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogData.find((p) => p.id === params.slug || p.slug === params.slug);

  if (!post) {
    return {
      title: "Article non trouvé | TCHANGAI Florentin Kybaloo",
      description: "L'article que vous recherchez n'existe pas.",
    };
  }

  return {
    title: `${post.title} | Blog - TCHANGAI Florentin Kybaloo`,
    description: post.summary,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.summary,
      images: [post.image],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.image],
    },
  };
}

// Generate static params for static generation
export async function generateStaticParams() {
  return blogData.map((post) => ({
    slug: post.slug || post.id,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostClient slug={params.slug} />;
}
