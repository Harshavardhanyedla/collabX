import React from 'react';
import { motion } from 'framer-motion';

const students = [
  {
    id: 1,
    name: 'Arjun Reddy',
    role: 'Full Stack Developer',
    institution: 'IIT Madras',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    skills: ['React', 'Node.js', 'AWS'],
    lookingFor: 'UI Designer'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'AI Researcher',
    institution: 'IIIT Hyderabad',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    skills: ['Python', 'PyTorch', 'NLP'],
    lookingFor: 'Frontend Dev'
  },
  {
    id: 3,
    name: 'Rahul Verma',
    role: 'Product Designer',
    institution: 'NID Ahmedabad',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    skills: ['Figma', 'User Research', 'Prototyping'],
    lookingFor: 'Backend Dev'
  },
  {
    id: 4,
    name: 'Sneha Patel',
    role: 'Blockchain Dev',
    institution: 'BITS Pilani',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    skills: ['Solidity', 'Web3.js', 'Rust'],
    lookingFor: 'Marketing Lead'
  }
];

const CommunitySection: React.FC = () => {
  return (
    <section id="community" className="py-24 bg-white">
      <div className="container-custom mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-[#0f172a] mb-4">Meet Your Future Co-founders</h2>
            <p className="text-lg text-gray-500">
              Connect with ambitious students from top universities who are building the next big thing.
            </p>
          </div>
          <button className="btn-primary px-8 py-3 rounded-xl shadow-lg shadow-purple-500/20 whitespace-nowrap">
            Join the Community
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {students.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 text-gray-300 group-hover:text-[#5865F2] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
              </div>

              <div className="w-20 h-20 rounded-full bg-gray-50 mb-6 overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-bold text-[#0f172a] mb-1">{student.name}</h3>
              <p className="text-[#5865F2] font-medium text-sm mb-4">{student.role}</p>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.534 50.534 0 00-2.658.813m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
                {student.institution}
              </div>

              <div className="border-t border-gray-50 pt-4">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full mt-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 hover:text-[#0f172a] transition-colors">
                View Profile
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CommunitySection;