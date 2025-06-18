export type Project = {
  id?: string;
  title: string;
  description: string;
  miniDescription: string;
  image?: string;
  images?: string[];
  tags?: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  demoUrl?: string;
  features?: string[];
  duration?: string;
  company?: string;
  event?: string;
  category?: string;
};
