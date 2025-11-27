import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';
import projectsData from '../data/projects.json';
import { supabase } from '../lib/supabase';
import ShareProjectModal from './ShareProjectModal';

const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Combine local data with Supabase data
      // Note: In a real app, you might want to migrate local data to Supabase
      const remoteProjects = (data || []).map((p: any) => ({
        id: p.id.toString(),
        title: p.title,
        description: p.description,
        image: '', // Supabase projects might not have images initially
        tags: p.tags || [],
        author: p.author,
        stars: p.stars || 0,
        githubUrl: p.github_url,
        liveUrl: p.live_url,
        language: p.language || 'JavaScript'
      }));

      setProjects([...remoteProjects, ...projectsData]);
    } catch (err) {
      console.error('Error fetching projects:', err);
      // Fallback to local data if Supabase fails (e.g. missing credentials)
      setProjects(projectsData as Project[]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'All' || project.language === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="projects" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Project Showcase
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover amazing projects built by students worldwide. Get inspired, learn from others, and showcase your own work.
          </p>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary text-lg px-8 py-3 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Share Your Project
          </motion.button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-center"
            />
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {['All', 'JavaScript', 'Python', 'TypeScript', 'Vue', 'Solidity'].map((lang) => (
            <button
              key={lang}
              onClick={() => setFilter(lang)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${filter === lang
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {lang}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className="card card-hover flex flex-col h-full"
                  variants={itemVariants}
                  layout
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  {/* Image Container */}
                  <div className="relative mb-6">
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center overflow-hidden">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className="text-6xl text-green-400" style={{ display: project.image ? 'none' : 'flex' }}>
                        💻
                      </div>
                    </div>
                    <div className="badge difficulty-badge bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                      {project.language}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed flex-1 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="badge tag-badge badge-blue text-sm px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stars and Author */}
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{project.stars}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>👤</span>
                        <span>{project.author}</span>
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 btn btn-primary text-center py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          View Code
                        </motion.a>
                      )}
                      {project.liveUrl && (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 btn btn-secondary text-center py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Live Demo
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredProjects.length === 0 && !isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
          </motion.div>
        )}

        <ShareProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            fetchProjects(); // Refresh list after submission
          }}
        />
      </div>
    </section>
  );
};

export default ProjectsSection;