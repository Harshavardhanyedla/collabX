import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const resources = [
    {
        id: 'cat',
        title: 'CAT Prep',
        description: 'Quantitative aptitude, verbal ability, and logical reasoning notes tailored for CAT aspirants.',
        count: '120+ Resources',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        bg: 'bg-orange-50',
    },
    {
        id: 'gate',
        title: 'GATE Prep',
        description: 'Previous year papers, subject-wise study material, and formula sheets for engineering grads.',
        count: '350+ Resources',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.534 50.534 0 00-2.658.813m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
        ),
        bg: 'bg-blue-50',
    },
    {
        id: 'programming',
        title: 'Programming',
        description: 'Data structures, algorithms, and full-stack development guides for cracking coding interviews.',
        count: '500+ Resources',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 18" />
            </svg>
        ),
        bg: 'bg-green-50',
    },
    {
        id: 'ai-ml',
        title: 'AI & ML',
        description: 'Deep learning, neural networks, and computer vision tutorials powered by industry experts.',
        count: '85+ Resources',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
        ),
        bg: 'bg-purple-50',
    },
    {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        description: 'Ethical hacking paths, network security basics, and cryptography resources.',
        count: '45+ Resources',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        bg: 'bg-red-50',
    },
    {
        id: 'higher-studies',
        title: 'Higher Studies',
        description: 'GRE, GMAT, and IELTS preparation materials for students planning to study abroad.',
        count: '200+ Resources',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.534 50.534 0 00-2.658.813m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
        ),
        bg: 'bg-cyan-50',
    },
];

const RoadmapsSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section id="roadmaps" className="py-24 bg-gray-50">
            <div className="container-custom mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-[#0f172a] mb-4">Find Learning Resources</h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Browse through our extensive library of free educational content, notes, and exam preparation materials.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-8 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for 'Data Structures' or 'CAT 2024'..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#5865F2] focus:border-transparent outline-none bg-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(`/roadmap/${resource.id}`)}
                            className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl ${resource.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    {resource.icon}
                                </div>
                                <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                                    {resource.count}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-[#5865F2] transition-colors">
                                {resource.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                {resource.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoadmapsSection;
