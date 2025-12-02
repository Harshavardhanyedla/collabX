import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-32 pb-20 overflow-hidden bg-white">
      <div className="container-custom mx-auto flex flex-col items-center text-center">

        {/* Beta Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-[#5865F2] text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#5865F2]"></span>
            Beta is Live
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-[#0f172a] tracking-tight mb-6 leading-tight max-w-4xl"
        >
          Build. Learn. <br />
          <span className="text-[#5865F2]">Collaborate.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed"
        >
          The all-in-one platform for students to find exam resources, join ambitious projects, and connect with peers across colleges.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl relative mb-10"
        >
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for 'GATE Notes' or 'React Projects'..."
              className="w-full pl-12 pr-32 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#5865F2] focus:border-transparent outline-none text-gray-700 bg-white"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-[#0f172a] text-white px-6 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              Search
            </button>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <button
            onClick={() => scrollToSection('roadmaps')}
            className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-xl text-base shadow-lg shadow-purple-500/20"
          >
            Find Resources
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="btn-secondary px-8 py-3.5 rounded-xl text-base"
          >
            Join a Project
          </button>
        </motion.div>

        {/* Trusted By */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="border-t border-gray-100 w-full pt-10"
        >
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by students from</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['IIT Bombay', 'BITS Pilani', 'NIT Trichy', 'Delhi University'].map((uni) => (
              <span key={uni} className="text-lg font-bold text-gray-400 hover:text-[#5865F2] transition-colors cursor-default">
                {uni}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;