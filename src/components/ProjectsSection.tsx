import React, { useState } from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: 'EcoTrack - Carbon Footprint Calculator',
    author: 'Ananya Gupta',
    institution: 'IIT Delhi',
    time: '2 days ago',
    description: 'A React Native app helping students track their daily carbon usage on campus. Integrating gamification to encourage greener choices.',
    tags: ['React Native', 'Node.js', 'Sustainability'],
    members: 3,
    lookingFor: 'UI/UX Designer',
    stars: 24,
    initial: 'A',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    id: 2,
    title: 'AI Study Buddy',
    author: 'Rohan Mehta',
    institution: 'BITS Pilani',
    time: '4 hours ago',
    description: 'Using Gemini API to generate personalized quizzes based on lecture notes. Currently in beta testing with 50+ users.',
    tags: ['Python', 'AI/ML', 'Gemini API'],
    members: 2,
    lookingFor: 'Frontend Dev',
    stars: 45,
    initial: 'R',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 3,
    title: 'Campus Marketplace',
    author: 'David Kim',
    institution: 'Manipal Institute',
    time: '1 day ago',
    description: 'A peer-to-peer platform for buying and selling used books and dorm essentials within the college network. Secure and verified.',
    tags: ['MERN Stack', 'E-commerce'],
    members: 4,
    lookingFor: 'Marketing Lead',
    stars: 12,
    initial: 'D',
    color: 'bg-blue-100 text-blue-600'
  }
];

const trendingProjects = [
  { id: 1, title: 'Neural Vision', institution: 'IIT Bombay', stars: 128 },
  { id: 2, title: 'CodeSync', institution: 'DTU', stars: 95 },
  { id: 3, title: 'Mars Rover Sim', institution: 'BITS Pilani', stars: 84 },
];

const categories = ['All', 'AI/ML', 'Web Dev', 'App Dev', 'Cybersecurity', 'UI/UX', 'Blockchain'];

const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container-custom mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#0f172a] mb-2">Explore Projects</h2>
          <p className="text-gray-500">Discover, collaborate, and build with students from top colleges.</p>
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
                      ? 'bg-[#5865F2] text-white'
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
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-6">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl ${project.color} flex items-center justify-center font-bold text-xl`}>
                        {project.initial}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0f172a]">{project.title}</h3>
                        <p className="text-sm text-gray-500">
                          {project.author} • <span className="text-gray-400">{project.institution}</span> • <span className="text-gray-400">{project.time}</span>
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
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
                        {project.members} Members
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[#5865F2]">Looking for:</span> {project.lookingFor}
                      </span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <span className="flex items-center gap-1 text-gray-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                        {project.stars}
                      </span>
                      <button className="bg-[#0f172a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex-1 sm:flex-none">
                        Collaborate
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-8">

            {/* Trending Projects */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#0f172a]">Trending Projects</h3>
                <button className="text-xs text-[#5865F2] font-medium">View All</button>
              </div>
              <div className="space-y-6">
                {trendingProjects.map((project, index) => (
                  <div key={project.id} className="flex items-center gap-4">
                    <span className="text-gray-300 font-bold text-lg w-4">{index + 1}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#0f172a] text-sm">{project.title}</h4>
                      <p className="text-xs text-gray-500">{project.institution}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md">
                      <span>★</span> {project.stars}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#0f172a] mb-4">Popular Categories</h3>
              <div className="flex flex-wrap gap-2">
                {['#Generative AI', '#SaaS', '#FinTech', '#EdTech'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-[#5865F2] rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
              <h3 className="font-bold mb-2">Weekly Highlights</h3>
              <p className="text-indigo-100 text-sm mb-4">Get the best student projects delivered to your inbox every Friday.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-indigo-200 focus:outline-none w-full"
                />
                <button className="bg-white text-[#5865F2] p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;