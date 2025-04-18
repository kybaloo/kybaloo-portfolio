"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [section, setSection] = useState('projects');
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Simple authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a simple example - in a real app, you would use a secure authentication method
    if (password === 'kybaloo123') { // You should change this to your preferred password
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      setMessage('Mot de passe incorrect');
    }
  };

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('adminAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Admin Login</h1>
          {message && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {message}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Link 
              href="/"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Voir le site
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-6 py-3 font-medium ${
                section === 'projects'
                  ? 'bg-blue-500 text-white'
                  : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSection('projects')}
            >
              Projets
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                section === 'skills'
                  ? 'bg-blue-500 text-white'
                  : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSection('skills')}
            >
              Compétences
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                section === 'blog'
                  ? 'bg-blue-500 text-white'
                  : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSection('blog')}
            >
              Blog
            </button>
          </div>

          <div className="p-6">
            {section === 'projects' && <ProjectsManager />}
            {section === 'skills' && <SkillsManager />}
            {section === 'blog' && <BlogManager />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Projects Manager Component
function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // In a real app, you would fetch this from an API
    // For now, we'll simulate loading the JSON data
    const fetchProjects = async () => {
      try {
        // In a real app, this would be an API call
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // For demo purposes, load from the imported data
        import('@/data/projects.json')
          .then((data) => {
            setProjects(data.default);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error loading projects data:', err);
            setMessage('Erreur lors du chargement des projets');
          });
      }
    };

    fetchProjects();
  }, []);

  const handleSave = async (project) => {
    // In a real app, you would send this to an API
    setMessage('Fonctionnalité de sauvegarde en cours de développement. Dans une application réelle, cela enregistrerait les modifications dans la base de données.');
    
    // Update the local state for demo purposes
    if (editingProject) {
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      setProjects([...projects, { ...project, id: `project-${Date.now()}` }]);
    }
    
    setEditingProject(null);
  };

  const handleDelete = async (id) => {
    // In a real app, you would send this to an API
    setMessage('Fonctionnalité de suppression en cours de développement. Dans une application réelle, cela supprimerait le projet de la base de données.');
    
    // Update the local state for demo purposes
    setProjects(projects.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestion des Projets</h2>
        <button
          onClick={() => setEditingProject({})}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Ajouter un projet
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
          {message}
        </div>
      )}

      {editingProject ? (
        <ProjectForm 
          project={editingProject} 
          onSave={handleSave} 
          onCancel={() => setEditingProject(null)} 
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.miniDescription}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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
function ProjectForm({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState(project || {
    title: '',
    description: '',
    miniDescription: '',
    image: '',
    tags: [],
    techStack: [],
    liveUrl: '',
    githubUrl: '',
    featured: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [field]: value.split(',').map(item => item.trim())
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-1">
          Titre
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="miniDescription" className="block text-gray-700 dark:text-gray-300 mb-1">
          Mini Description
        </label>
        <input
          type="text"
          id="miniDescription"
          name="miniDescription"
          value={formData.miniDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-1">
          Description complète
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-gray-700 dark:text-gray-300 mb-1">
          Image URL
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-gray-700 dark:text-gray-300 mb-1">
          Tags (séparés par des virgules)
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags.join(', ')}
          onChange={(e) => handleArrayChange(e, 'tags')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="techStack" className="block text-gray-700 dark:text-gray-300 mb-1">
          Tech Stack (séparés par des virgules)
        </label>
        <input
          type="text"
          id="techStack"
          value={formData.techStack.join(', ')}
          onChange={(e) => handleArrayChange(e, 'techStack')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="liveUrl" className="block text-gray-700 dark:text-gray-300 mb-1">
          URL de démonstration
        </label>
        <input
          type="url"
          id="liveUrl"
          name="liveUrl"
          value={formData.liveUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="githubUrl" className="block text-gray-700 dark:text-gray-300 mb-1">
          URL GitHub
        </label>
        <input
          type="url"
          id="githubUrl"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="featured" className="ml-2 block text-gray-700 dark:text-gray-300">
          Projet mis en avant
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}

// Skills Manager Component
function SkillsManager() {
  return (
    <div className="text-center p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Gestion des Compétences</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Cette fonctionnalité est en cours de développement. Vous pourrez bientôt ajouter et modifier vos compétences ici.
      </p>
    </div>
  );
}

// Blog Manager Component
function BlogManager() {
  return (
    <div className="text-center p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Gestion du Blog</h2>
      <p className="text-gray-600 dark:text-gray-400">
        Cette fonctionnalité est en cours de développement. Vous pourrez bientôt ajouter et modifier vos articles de blog ici.
      </p>
    </div>
  );
}
