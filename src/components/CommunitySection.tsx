import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CommunityPost } from '../types';

const CommunitySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'announcements'>('discussions');

  const discussions: CommunityPost[] = [
    {
      id: '1',
      title: 'Best practices for learning React in 2024',
      content: 'I\'ve been learning React for the past 6 months and wanted to share some insights that really helped me...',
      author: 'Sarah Chen',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      tags: ['React', 'Learning', 'Best Practices']
    },
    {
      id: '2',
      title: 'Looking for study partners for Machine Learning course',
      content: 'Anyone interested in forming a study group for the ML course? We could meet weekly and work on projects together.',
      author: 'Alex Rodriguez',
      timestamp: '5 hours ago',
      likes: 18,
      comments: 12,
      tags: ['Machine Learning', 'Study Group', 'Collaboration']
    },
    {
      id: '3',
      title: 'Showcase: Built a full-stack e-commerce app with MERN',
      content: 'Just finished my first major project! It\'s a complete e-commerce solution with user authentication, payment processing, and admin dashboard.',
      author: 'Mike Johnson',
      timestamp: '1 day ago',
      likes: 45,
      comments: 15,
      tags: ['MERN Stack', 'E-commerce', 'Showcase']
    },
    {
      id: '4',
      title: 'Tips for landing your first developer internship',
      content: 'After going through 20+ interviews, here are the key things that helped me land my first internship...',
      author: 'Emily Watson',
      timestamp: '2 days ago',
      likes: 67,
      comments: 23,
      tags: ['Career', 'Internship', 'Interview Tips']
    }
  ];

  const announcements: CommunityPost[] = [
    {
      id: 'a1',
      title: 'New Learning Path: Cybersecurity Fundamentals',
      content: 'We\'re excited to announce our new cybersecurity learning path! This comprehensive course covers ethical hacking, network security, and more.',
      author: 'Student Corner Team',
      timestamp: '3 days ago',
      likes: 89,
      comments: 5,
      tags: ['Announcement', 'Cybersecurity', 'New Course']
    },
    {
      id: 'a2',
      title: 'Community Guidelines Update',
      content: 'We\'ve updated our community guidelines to ensure a positive and inclusive environment for all students.',
      author: 'Student Corner Team',
      timestamp: '1 week ago',
      likes: 34,
      comments: 2,
      tags: ['Guidelines', 'Community', 'Update']
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    return timestamp;
  };

  return (
    <section id="community" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Community Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with fellow students, ask questions, share knowledge, and build amazing projects together.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-white p-1 rounded-xl shadow-lg">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'discussions'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Discussions
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'announcements'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Announcements
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {(activeTab === 'discussions' ? discussions : announcements).map((post) => (
            <motion.div
              key={post.id}
              className="card card-hover"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-blue text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>👤 {post.author}</span>
                  <span>🕒 {formatTimeAgo(post.timestamp)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join the Conversation
          </h3>
          <p className="text-gray-600 mb-6">
            Have a question or want to share something with the community?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="btn btn-primary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Discussion
            </motion.button>
            <motion.button
              className="btn btn-secondary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse All Posts
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;