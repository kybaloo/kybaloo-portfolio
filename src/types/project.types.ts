export type Project = {
  id?: string;
  title: string;
  description: string;
  miniDescription: string;
  image: string;
  tags: string[];
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
};