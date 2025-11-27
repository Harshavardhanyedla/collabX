import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Roadmap } from '../types';
import roadmapsData from '../data/roadmaps.json';

const RoadmapsSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const roadmaps: Roadmap[] = roadmapsData as Roadmap[];

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesFilter = filter === 'All' || roadmap.difficulty === filter;
    const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'badge-green';
      case 'Intermediate': return 'badge-yellow';
      case 'Advanced': return 'badge-red';
      default: return 'badge-gray';
    }
  };

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
    <section id="roadmaps" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Learning Roadmaps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Structured learning paths designed by students, for students. From beginner to advanced, we've got you covered.
          </p>
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
              placeholder="Search roadmaps..."
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
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === level
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </motion.div>

        {/* Roadmaps Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredRoadmaps.map((roadmap) => (
            <motion.div
              key={roadmap.id}
              className="card card-hover flex flex-col h-full"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
              }}
            >
              {/* Image Container */}
              <div className="relative mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {roadmap.image ? (
                    <img
                      src={roadmap.image}
                      alt={roadmap.title}
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
                  <div className="text-6xl text-blue-400" style={{ display: roadmap.image ? 'none' : 'flex' }}>
                    📚
                  </div>
                </div>
                <div className={`badge difficulty-badge ${getDifficultyColor(roadmap.difficulty)} px-3 py-1 text-sm font-semibold shadow-sm`}>
                  {roadmap.difficulty}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {roadmap.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                  {roadmap.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {roadmap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge tag-badge badge-blue text-sm px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Duration and Author */}
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{roadmap.duration}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>👤</span>
                    <span>{roadmap.author}</span>
                  </span>
                </div>
                
                {/* Button */}
                <motion.button
                  className="w-full btn btn-primary py-3 text-lg font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open(roadmap.youtubeUrl, '_blank')}
                >
                  Start Learning
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredRoadmaps.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg">No roadmaps found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RoadmapsSection;