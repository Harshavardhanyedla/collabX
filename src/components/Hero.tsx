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
    <section className="hero-bg" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-40 right-15 w-16 h-16 bg-white bg-opacity-10 rounded-full"
        animate={{
          y: [0, 20, 0],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 leading-tight font-variex lowercase"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Collabx
        </motion.h1>
        
        <motion.p
          className="text-2xl md:text-3xl font-semibold mb-4 text-blue-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          By Students, For Students
        </motion.p>
        
        <motion.p
          className="text-lg md:text-xl mb-12 text-blue-200 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Discover learning roadmaps, showcase your projects, and connect with a global community of passionate students building the future.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <motion.button
            className="btn btn-primary text-lg px-8 py-4 rounded-xl font-semibold shadow-2xl"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('roadmaps')}
          >
            Explore Roadmaps
          </motion.button>
          
          <motion.button
            className="btn btn-secondary text-lg px-8 py-4 rounded-xl font-semibold shadow-2xl"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#3b82f6",
              color: "white"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('projects')}
          >
            Share a Project
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;