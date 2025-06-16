"use client";

import { Project } from "@/types/project.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [section, setSection] = useState("projects");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // Simple authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a simple example - in a real app, you would use a secure authentication method
    if (password === "kybaloo123") {
      // You should change this to your preferred password
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
    } else {
      setMessage("Mot de passe incorrect");
    }
  };

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem("adminAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h1 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-white">Admin Login</h1>
          {message && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md">{message}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="px-4 py-2 text-gray-800 transition-colors bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Voir le site
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("adminAuthenticated");
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-6 py-3 font-medium ${
                section === "projects"
                  ? "bg-blue-500 text-white"
                  : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setSection("projects")}
            >
              Projets
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                section === "skills"
                  ? "bg-blue-500 text-white"
                  : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setSection("skills")}
            >
              Compétences
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                section === "blog"
                  ? "bg-blue-500 text-white"
                  : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setSection("blog")}
            >
              Blog
            </button>
          </div>

          <div className="p-6">
            {section === "projects" && <ProjectsManager />}
            {section === "skills" && <SkillsManager />}
            {section === "blog" && <BlogManager />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Projects Manager Component
function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // In a real app, you would fetch this from an API
    // For now, we'll simulate loading the JSON data
    const fetchProjects = async () => {
      try {
        // In a real app, this would be an API call
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // For demo purposes, load from the imported data
        import("@/data/projects.json")
          .then((data) => {
            setProjects(data.default);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error loading projects data:", err);
            setMessage("Erreur lors du chargement des projets");
          });
      }
    };

    fetchProjects();
  }, []);

  const handleSave = async (project: Project) => {
    // In a real app, you would send this to an API
    setMessage(
      "Fonctionnalité de sauvegarde en cours de développement. Dans une application réelle, cela enregistrerait les modifications dans la base de données."
    );

    // Update the local state for demo purposes
    if (editingProject) {
      setProjects(projects.map((p) => (p.id === project.id ? project : p)));
    } else {
      setProjects([...projects, { ...project, id: `project-${Date.now()}` }]);
    }

    setEditingProject(null);
  };

  const handleDelete = async (id: string | undefined) => {
    // In a real app, you would send this to an API
    setMessage(
      "Fonctionnalité de suppression en cours de développement. Dans une application réelle, cela supprimerait le projet de la base de données."
    );

    // Update the local state for demo purposes
    if (id) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestion des Projets</h2>
        <button
          onClick={() => setEditingProject({} as Project)}
          className="px-4 py-2 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
        >
          Ajouter un projet
        </button>
      </div>

      {message && <div className="p-3 mb-4 text-blue-700 bg-blue-100 rounded-md">{message}</div>}

      {editingProject ? (
        <ProjectForm project={editingProject} onSave={handleSave} onCancel={() => setEditingProject(null)} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700"
            >
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.miniDescription}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="px-3 py-1 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-1 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Project Form Component
interface ProjectFormProps {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(
    project || {
      title: "",
      description: "",
      miniDescription: "",
      image: "",
      tags: [],
      techStack: [],
      liveUrl: "",
      githubUrl: "",
      featured: false,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    // Cast to HTMLInputElement uniquement si c'est une checkbox
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: isCheckbox ? checked : value,
    });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Project) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [field]: value.split(",").map((item) => item.trim()),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block mb-1 text-gray-700 dark:text-gray-300">
          Titre
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="miniDescription" className="block mb-1 text-gray-700 dark:text-gray-300">
          Mini Description
        </label>
        <input
          type="text"
          id="miniDescription"
          name="miniDescription"
          value={formData.miniDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1 text-gray-700 dark:text-gray-300">
          Description complète
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-1 text-gray-700 dark:text-gray-300">
          Image URL
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="tags" className="block mb-1 text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags?.join(", ") || ""}
          onChange={(e) => handleArrayChange(e, "tags")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="techStack" className="block mb-1 text-gray-700 dark:text-gray-300">
          Tech Stack
        </label>
        <input
          type="text"
          id="techStack"
          value={formData.techStack?.join(", ") || ""}
          onChange={(e) => handleArrayChange(e, "techStack")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="liveUrl" className="block mb-1 text-gray-700 dark:text-gray-300">
          URL de démonstration
        </label>
        <input
          type="url"
          id="liveUrl"
          name="liveUrl"
          value={formData.liveUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="githubUrl" className="block mb-1 text-gray-700 dark:text-gray-300">
          URL GitHub
        </label>
        <input
          type="url"
          id="githubUrl"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="featured" className="block ml-2 text-gray-700 dark:text-gray-300">
          Projet mis en avant
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-800 transition-colors bg-gray-300 rounded-md dark:bg-gray-600 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Annuler
        </button>
        <button type="submit" className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600">
          Enregistrer
        </button>
      </div>
    </form>
  );
}

// Skills Manager Component
interface Skill {
  id?: string;
  name: string;
  icon: string;
  level: number;
  category: string;
}

function SkillsManager() {
  // const [skills, setSkills] = useState<Skill[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   //Todo: Cette fonctionnalité sera implémentée plus tard
  //   setLoading(false);
  // }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Gestion des Compétences</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Cette fonctionnalité est en cours de développement. Vous pourrez bientôt ajouter et modifier vos compétences ici.
      </p>
    </div>
  );
}

// Blog Manager Component
interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishDate: string;
  tags: string[];
  coverImage: string;
}

function BlogManager() {
  // const [posts, setPosts] = useState<BlogPost[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   //TODO: Cette fonctionnalité sera implémentée plus tard
  //   setLoading(false);
  // }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">Gestion du Blog</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Cette fonctionnalité est en cours de développement. Vous pourrez bientôt ajouter et modifier vos articles de blog ici.
      </p>
    </div>
  );
}
