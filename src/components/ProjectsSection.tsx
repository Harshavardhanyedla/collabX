import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Define Project interface based on Supabase table
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  looking_for: string;
  members_count: number;
  stars_count: number;
  created_by: string;
  created_at: string;
  // Additional fields for UI that might be joined or mocked for now
  author_name?: string;
  institution?: string;
}

const categories = ['All', 'AI/ML', 'Web Dev', 'App Dev', 'Cybersecurity', 'UI/UX', 'Blockchain'];

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'AI/ML',
    tags: '',
    looking_for: '',
    members_count: 1
  });

  // Newsletter state
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const tagsArray = newProject.tags.split(',').map(tag => tag.trim());

    const { error } = await supabase
      .from('projects')
      .insert([{
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        tags: tagsArray,
        looking_for: newProject.looking_for,
        members_count: newProject.members_count,
        created_by: user.id
      }]);

    if (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again.');
    } else {
      setIsModalOpen(false);
      setNewProject({
        title: '',
        description: '',
        category: 'AI/ML',
        tags: '',
        looking_for: '',
        members_count: 1
      });
      fetchProjects(); // Refresh list
    }
  };

  const handleNewsletterSubmit = async () => {
    if (!email) return;
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) {
      setNewsletterStatus('error');
    } else {
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  const handleCollaborate = (projectTitle: string) => {
    // Simple mailto for V1 as requested
    window.location.href = `mailto:?subject=Collaboration Request: ${projectTitle}&body=Hi, I'm interested in collaborating on your project ${projectTitle}.`;
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container-custom mx-auto">

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Explore Projects</h2>
            <p className="text-gray-500">Discover, collaborate, and build with students from top colleges.</p>
          </div>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/20"
            >
              + Add Project
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content */}
          <div className="flex-1">

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat
                      ? 'bg-[#0066FF] text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-6">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No projects found. Be the first to add one!
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl`}>
                          {project.title.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#0f172a]">{project.title}</h3>
                          <p className="text-sm text-gray-500">
                            {project.category} • <span className="text-gray-400">{new Date(project.created_at).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags && project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-md bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-50 pt-4 gap-4">
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                          </svg>
                          {project.members_count} Members
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-[#0066FF]">Looking for:</span> {project.looking_for}
                        </span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <span className="flex items-center gap-1 text-gray-400 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                          {project.stars_count}
                        </span>
                        <button
                          onClick={() => handleCollaborate(project.title)}
                          className="bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex-1 sm:flex-none"
                        >
                          Collaborate
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-8">

            {/* Newsletter */}
            <div className="bg-[#0066FF] rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
              <h3 className="font-bold mb-2">Weekly Highlights</h3>
              <p className="text-blue-100 text-sm mb-4">Get the best student projects delivered to your inbox every Friday.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-200 focus:outline-none w-full"
                />
                <button
                  onClick={handleNewsletterSubmit}
                  className="bg-white text-[#0066FF] p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
              {newsletterStatus === 'success' && <p className="text-xs text-green-200 mt-2">Subscribed successfully!</p>}
              {newsletterStatus === 'error' && <p className="text-xs text-red-200 mt-2">Error subscribing.</p>}
            </div>

          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Members Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newProject.members_count}
                    onChange={(e) => setNewProject({ ...newProject, members_count: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Node.js, AI"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Looking For</label>
                <input
                  type="text"
                  placeholder="Frontend Dev, Designer..."
                  value={newProject.looking_for}
                  onChange={(e) => setNewProject({ ...newProject, looking_for: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-[#0066FF] text-white font-medium hover:bg-blue-600"
                >
                  Submit Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;