import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';


interface ResourceItem {
    id: string;
    title: string;
    type: 'PDF' | 'Video' | 'Link' | 'Book';
    url: string;
    description: string;
}

const ResourceDetail: React.FC = () => {
    const { resourceId } = useParams<{ resourceId: string }>();
    const navigate = useNavigate();

    // Mock data - replace with actual Google Drive links later
    const getResources = (): ResourceItem[] => {
        if (resourceId === 'programming-languages') {
            return [
                { id: 'pl-1', title: 'Java Masterclass', type: 'Video', url: '#', description: 'Complete Java course from basics to advanced multithreading.' },
                { id: 'pl-2', title: 'Python for Data Science', type: 'Book', url: '#', description: 'Essential Python guide for data analysis and ML.' },
                { id: 'pl-3', title: 'C++ Programming Basics', type: 'PDF', url: '#', description: 'Standard C++ syntax and STL overview.' },
                { id: 'pl-4', title: 'C Language Fundamentals', type: 'PDF', url: '#', description: 'Core Concepts of C programming.' },
                { id: 'pl-5', title: 'JavaScript (ES6+) Guide', type: 'Link', url: '#', description: 'Modern JavaScript features and DOM manipulation.' },
                { id: 'pl-6', title: 'TypeScript Deep Dive', type: 'Book', url: '#', description: 'Mastering types and interfaces in TS.' },
                { id: 'pl-7', title: 'Go Programming (Golang)', type: 'Video', url: '#', description: 'Building concurrent applications with Go.' },
                { id: 'pl-8', title: 'Rust Ecosystem', type: 'PDF', url: '#', description: 'Memory safety and performance with Rust.' },
                { id: 'pl-9', title: 'Swift for iOS Development', type: 'Link', url: '#', description: 'Learn Swift UI and mobile development.' },
                { id: 'pl-10', title: 'Kotlin for Android', type: 'Video', url: '#', description: 'Modern Android development with Kotlin.' },
                { id: 'pl-11', title: 'PHP & Laravel', type: 'PDF', url: '#', description: 'Server-side scripting and web frameworks.' },
                { id: 'pl-12', title: 'Ruby on Rails', type: 'Link', url: '#', description: 'Elegant web development with Ruby.' },
                { id: 'pl-13', title: 'SQL & Database Design', type: 'PDF', url: '#', description: 'Learn relational databases and complex queries.' },
            ];
        }

        if (resourceId === 'roadmaps-merged') {
            return [
                { id: 'rm-1', title: 'Frontend Developer Roadmap', type: 'Link', url: 'https://roadmap.sh/frontend', description: 'Step-by-step path to becoming a frontend engineer.' },
                { id: 'rm-2', title: 'Backend Developer Roadmap', type: 'Link', url: 'https://roadmap.sh/backend', description: 'Server-side technologies and architecture path.' },
                { id: 'rm-3', title: 'DevOps Roadmap', type: 'Link', url: 'https://roadmap.sh/devops', description: 'Infrastructure and automation learning path.' },
                { id: 'rm-4', title: 'AI/ML Roadmap', type: 'Link', url: 'https://roadmap.sh/ai-data-scientist', description: 'Data science and artificial intelligence path.' },
            ];
        }

        const commonResources: ResourceItem[] = [
            { id: '1', title: 'Syllabus & Exam Pattern', type: 'PDF', url: '#', description: 'Official syllabus and detailed exam pattern breakdown.' },
            { id: '2', title: 'Previous Year Questions (2020-2024)', type: 'PDF', url: '#', description: 'Solved papers from the last 5 years.' },
            { id: '3', title: 'Important Topics Cheat Sheet', type: 'PDF', url: '#', description: 'Quick revision notes for high-weightage topics.' },
            { id: '4', title: 'Recommended Books List', type: 'Book', url: '#', description: 'Curated list of best preparation books by toppers.' },
        ];

        return commonResources;
    };

    const getExamTitle = (id: string) => {
        switch (id) {
            case 'programming-languages': return 'Programming Languages';
            case 'roadmaps-merged': return 'Learning Roadmaps';
            case 'cat': return 'CAT Study Materials';
            case 'upsc': return 'UPSC Study Materials';
            case 'gate': return 'GATE Study Materials';
            default: return 'Study Materials';
        }
    };

    const resources = getResources();
    const title = getExamTitle(resourceId || '');

    return (
        <div className="min-h-screen bg-white">
            <NavBar />

            <main className="pt-32 pb-20 px-6">
                <div className="container-custom mx-auto">
                    <motion.button
                        onClick={() => navigate('/')}
                        className="mb-8 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-[#5865F2] transition-all flex items-center gap-2 group text-sm font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">{title}</h1>
                        <p className="text-xl text-gray-500 font-light">
                            Access curated resources to boost your preparation.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource, index) => (
                            <motion.div
                                key={resource.id}
                                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${resource.type === 'PDF' ? 'bg-red-50 text-red-600' :
                                        resource.type === 'Video' ? 'bg-blue-50 text-blue-600' :
                                            resource.type === 'Book' ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-green-50 text-green-600'
                                        }`}>
                                        {resource.type}
                                    </span>
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                                        {resource.type === 'PDF' ? '📄' :
                                            resource.type === 'Video' ? '🎥' :
                                                resource.type === 'Book' ? '📚' : '🔗'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-[#5865F2] transition-colors">{resource.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                    {resource.description}
                                </p>

                                <a
                                    href={resource.url}
                                    className="inline-flex items-center text-[#5865F2] font-bold hover:text-[#4752c4] transition-colors text-sm"
                                    onClick={(e) => e.preventDefault()} // Prevent navigation for mock links
                                >
                                    Access Resource <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* <Footer /> */}
        </div>
    );
};

export default ResourceDetail;
