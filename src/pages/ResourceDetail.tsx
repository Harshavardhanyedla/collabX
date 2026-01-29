import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import { languagesData } from '../data/languages';


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
            return Object.values(languagesData).map(lang => ({
                id: lang.id,
                title: lang.name,
                type: 'PDF' as any, // We will override the display logic below
                url: `/resource/programming-languages/${lang.id}`,
                description: lang.description
            }));
        }

        if (resourceId === 'roadmaps-merged') {
            return [
                { id: 'rm-1', title: 'Frontend Developer Roadmap', type: 'Link', url: 'https://roadmap.sh/frontend', description: 'Step-by-step path to becoming a frontend engineer.' },
                { id: 'rm-2', title: 'Backend Developer Roadmap', type: 'Link', url: 'https://roadmap.sh/backend', description: 'Server-side technologies and architecture path.' },
                { id: 'rm-3', title: 'DevOps Roadmap', type: 'Link', url: 'https://roadmap.sh/devops', description: 'Infrastructure and automation learning path.' },
                { id: 'rm-4', title: 'AI/ML Roadmap', type: 'Link', url: 'https://roadmap.sh/ai-data-scientist', description: 'Data science and artificial intelligence path.' },
            ];
        }

        if (resourceId === 'cybersecurity') {
            return [
                { id: 'cs-1', title: 'Ethical Hacking', type: 'Video', url: '#', description: 'Learn the fundamentals of penetration testing and ethical hacking.' },
                { id: 'cs-2', title: 'Web Security', type: 'Video', url: '#', description: 'Secure web applications against common vulnerabilities like XSS and SQLi.' },
                { id: 'cs-3', title: 'Network Security', type: 'Video', url: '#', description: 'Protect network infrastructure and data from unauthorized access.' },
                { id: 'cs-4', title: 'OSINT', type: 'Video', url: '#', description: 'Open Source Intelligence gathering techniques and tools.' },
                { id: 'cs-5', title: 'Cloud Security', type: 'Video', url: '#', description: 'Securing cloud environments and native applications.' },
            ];
        }

        if (resourceId === 'data-ai') {
            return [
                { id: 'da-1', title: 'Data Structures & Algorithms', type: 'Video', url: '#', description: 'Core computer science concepts for efficient problem solving.' },
                { id: 'da-2', title: 'Machine Learning', type: 'Video', url: '#', description: 'Supervised, unsupervised, and reinforcement learning algorithms.' },
                { id: 'da-3', title: 'Deep Learning', type: 'Video', url: '#', description: 'Neural networks, computer vision, and NLP foundations.' },
                { id: 'da-4', title: 'Data Science', type: 'Video', url: '#', description: 'Data analysis, visualization, and statistical modeling.' },
                { id: 'da-5', title: 'MLOps', type: 'Video', url: '#', description: 'Deploying, monitoring, and maintaining ML models in production.' },
            ];
        }

        if (resourceId === 'web-app-dev') {
            return [
                { id: 'wd-1', title: 'Frontend Development', type: 'Video', url: '#', description: 'Building responsive and interactive user interfaces.' },
                { id: 'wd-2', title: 'Backend Development', type: 'Video', url: '#', description: 'Server-side logic, databases, and API development.' },
                { id: 'wd-3', title: 'Full Stack Development', type: 'Video', url: '#', description: 'Mastering both client and server-side technologies.' },
                { id: 'wd-4', title: 'Mobile App Development', type: 'Video', url: '#', description: 'Creating native and cross-platform mobile applications.' },
            ];
        }

        if (resourceId === 'cloud-devops') {
            return [
                { id: 'cd-1', title: 'AWS, Azure, GCP', type: 'Video', url: '#', description: 'Mastering major public cloud platforms and services.' },
                { id: 'cd-2', title: 'Docker & Kubernetes', type: 'Video', url: '#', description: 'Containerization and orchestration for scalable applications.' },
                { id: 'cd-3', title: 'CI/CD Pipelines', type: 'Video', url: '#', description: 'Automating software delivery and deployment workflows.' },
                { id: 'cd-4', title: 'Linux & SysAdmin', type: 'Video', url: '#', description: 'Essential Linux skills for server management and operations.' },
            ];
        }

        if (resourceId === 'career-prep') {
            return [
                { id: 'cp-1', title: 'Interview Preparation', type: 'Link', url: '#', description: 'Technical and behavioral interview guides and tips.' },
                { id: 'cp-2', title: 'Resume Building', type: 'Link', url: '#', description: 'Crafting effective resumes and cover letters.' },
                { id: 'cp-3', title: 'System Design', type: 'Link', url: '#', description: 'Designing scalable and reliable software systems.' },
                { id: 'cp-4', title: 'Internship Preparation', type: 'Link', url: '#', description: 'Guide to landing and succeeding in internships.' },
            ];
        }

        if (resourceId === 'competitive-prep') {
            return [
                { id: 'cmp-1', title: 'Placement Aptitude', type: 'Link', url: '#', description: 'Quantitative, logical reasoning, and verbal ability practice.' },
                { id: 'cmp-2', title: 'Coding Practice', type: 'Link', url: '#', description: 'Platform links and problem sets for coding interviews.' },
                { id: 'cmp-3', title: 'CS Fundamentals', type: 'Link', url: '#', description: 'OS, DBMS, Networks, and OOPS core concepts.' },
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
            case 'cybersecurity': return 'Cybersecurity';
            case 'data-ai': return 'Data & AI';
            case 'web-app-dev': return 'Web & App Development';
            case 'cloud-devops': return 'Cloud & DevOps';
            case 'career-prep': return 'Career Preparation';
            case 'competitive-prep': return 'Competitive & Exam Prep';
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
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
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
                                onClick={() => navigate(resource.url)}
                                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${resourceId === 'programming-languages'
                                        ? 'bg-blue-50 text-blue-600'
                                        : resource.type === 'PDF' ? 'bg-red-50 text-red-600' :
                                            resource.type === 'Video' ? 'bg-blue-50 text-blue-600' :
                                                resource.type === 'Book' ? 'bg-yellow-50 text-yellow-600' :
                                                    'bg-green-50 text-green-600'
                                        }`}>
                                        {resourceId === 'programming-languages' ? 'Full Course' : resource.type}
                                    </span>
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                                        {resourceId === 'programming-languages'
                                            ? (languagesData[resource.id]?.icon || '💻')
                                            : resource.type === 'PDF' ? '📄' :
                                                resource.type === 'Video' ? '🎥' :
                                                    resource.type === 'Book' ? '📚' : '🔗'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-[#0066FF] transition-colors">{resource.title}</h3>
                                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">
                                    {resource.description}
                                </p>

                                <div className="inline-flex items-center text-[#0066FF] font-bold group-hover:translate-x-1 transition-transform text-sm">
                                    Access Resource <span className="ml-1">→</span>
                                </div>
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
