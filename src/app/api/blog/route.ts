import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET handler to fetch all blog posts
export async function GET() {
  try {
    // Check if the blog data file exists, if not create it with sample data
    const filePath = path.join(process.cwd(), 'src/data/blog.json');
    
    if (!fs.existsSync(filePath)) {
      // Create sample blog data
      const sampleBlogPosts = [
        {
          id: "blog-1",
          title: "Getting Started with Next.js and Tailwind CSS",
          summary: "Learn how to set up a new project with Next.js and Tailwind CSS for rapid development of modern web applications.",
          content: "# Getting Started with Next.js and Tailwind CSS\n\nNext.js is a React framework that enables server-side rendering and static site generation, while Tailwind CSS is a utility-first CSS framework. Together, they form a powerful combination for building modern web applications.\n\n## Setting Up Your Project\n\n1. Create a new Next.js project:\n```bash\nnpx create-next-app my-project\ncd my-project\n```\n\n2. Install Tailwind CSS:\n```bash\nnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p\n```\n\n3. Configure Tailwind CSS in your project...",
          date: "2023-09-15",
          author: "TCHANGAI Florentin Kybaloo",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
          tags: ["Next.js", "Tailwind CSS", "Web Development"],
          slug: "getting-started-with-nextjs-and-tailwind"
        },
        {
          id: "blog-2",
          title: "Mastering Framer Motion Animations in React",
          summary: "Explore advanced animation techniques using Framer Motion to create engaging user interfaces in your React applications.",
          content: "# Mastering Framer Motion Animations in React\n\nFramer Motion is a production-ready motion library for React that makes it easy to create stunning animations and interactions. In this article, we'll explore some advanced techniques to take your UI animations to the next level.\n\n## Basic Animation Concepts\n\nFramer Motion uses a declarative API, which means you describe the end state of your animations and Framer Motion handles the rest...",
          date: "2023-10-22",
          author: "TCHANGAI Florentin Kybaloo",
          image: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
          tags: ["React", "Framer Motion", "Animation", "UI/UX"],
          slug: "mastering-framer-motion-animations-in-react"
        }
      ];
      
      fs.writeFileSync(filePath, JSON.stringify(sampleBlogPosts, null, 2), 'utf8');
    }
    
    // Read blog posts from file
    const fileData = fs.readFileSync(filePath, 'utf8');
    const blogPosts = JSON.parse(fileData);
    
    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Error reading blog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST handler to add or update a blog post
export async function POST(request: Request) {
  try {
    const blogPost = await request.json();
    const filePath = path.join(process.cwd(), 'src/data/blog.json');
    
    // Read existing blog posts
    let blogPosts = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      blogPosts = JSON.parse(fileData);
    }
    
    // Check if blog post already exists (update) or is new (add)
    const existingIndex = blogPosts.findIndex((p: any) => p.id === blogPost.id);
    
    if (existingIndex >= 0) {
      // Update existing blog post
      blogPosts[existingIndex] = blogPost;
    } else {
      // Add new blog post with generated ID if not provided
      if (!blogPost.id) {
        blogPost.id = `blog-${Date.now()}`;
      }
      
      // Generate slug if not provided
      if (!blogPost.slug) {
        blogPost.slug = blogPost.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
      
      blogPosts.push(blogPost);
    }
    
    // Write updated blog posts back to file
    fs.writeFileSync(filePath, JSON.stringify(blogPosts, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, blogPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a blog post
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(process.cwd(), 'src/data/blog.json');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Blog data file does not exist' },
        { status: 404 }
      );
    }
    
    // Read existing blog posts
    const fileData = fs.readFileSync(filePath, 'utf8');
    let blogPosts = JSON.parse(fileData);
    
    // Filter out the blog post to delete
    blogPosts = blogPosts.filter((p: any) => p.id !== id);
    
    // Write updated blog posts back to file
    fs.writeFileSync(filePath, JSON.stringify(blogPosts, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
