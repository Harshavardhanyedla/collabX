import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import MainLayout from '../components/MainLayout';
import {
    BookOpenIcon,
    MagnifyingGlassIcon,
    ArrowRightIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

interface Resource {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    link?: string;
}

const Resources: React.FC = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const resourcesRef = collection(db, 'resources');
            const q = query(resourcesRef);
            const querySnapshot = await getDocs(q);

            const fetchedResources: Resource[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Resource));

            if (fetchedResources.length === 0) {
                setResources([
                    {
                        id: 'programming-languages',
                        title: 'Programming Languages',
                        description: 'Detailed guides and resources for Java, Python, C++, JavaScript, and more.',
                        icon: '💻',
                        color: 'badge-purple'
                    },
                    {
                        id: 'roadmaps-merged',
                        title: 'Learning Roadmaps',
                        description: 'Structured paths to help you master new skills and prepare for career goals.',
                        icon: '🗺️',
                        color: 'badge-red'
                    },
                    {
                        id: 'cat',
                        title: 'CAT Resources',
                        description: 'Comprehensive study materials, mock tests, and guides for Common Admission Test preparation.',
                        icon: '📊',
                        color: 'badge-blue'
                    },
                    {
                        id: 'upsc',
                        title: 'UPSC Resources',
                        description: 'Curated notes, current affairs, and syllabus breakdowns for Civil Services Examination.',
                        icon: '🏛️',
                        color: 'badge-yellow'
                    },
                    {
                        id: 'gate',
                        title: 'GATE Resources',
                        description: 'Subject-wise notes, previous year questions, and technical resources for Graduate Aptitude Test in Engineering.',
                        icon: '⚙️',
                        color: 'badge-green'
                    }
                ]);
            } else {
                // If there are resources in DB, we still want to ensure Programming Languages and Roadmaps are handled or added if missing
                // For now, let's assume we want to always have these two at the top if they aren't already there
                const hasProg = fetchedResources.some(r => r.id === 'programming-languages');
                const hasRoadmaps = fetchedResources.some(r => r.id === 'roadmaps-merged');

                let combined = [...fetchedResources];
                if (!hasRoadmaps) {
                    combined.unshift({
                        id: 'roadmaps-merged',
                        title: 'Learning Roadmaps',
                        description: 'Structured paths to help you master new skills and prepare for career goals.',
                        icon: '🗺️',
                        color: 'badge-red'
                    });
                }
                if (!hasProg) {
                    combined.unshift({
                        id: 'programming-languages',
                        title: 'Programming Languages',
                        description: 'Detailed guides and resources for Java, Python, C++, JavaScript, and more.',
                        icon: '💻',
                        color: 'badge-purple'
                    });
                }
                setResources(combined);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const ResourceSkeleton = () => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4"></div>
            <div className="h-5 bg-gray-100 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
        </div>
    );

    return (
        <MainLayout>
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-[#0066FF]">
                            <BookOpenIcon className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#0f172a]">Learning Resources</h1>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Curated study materials and exam preparation guides to help you excel.
                    </p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-[72px] z-10">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search resources, exams, or topics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => <ResourceSkeleton key={i} />)
                    ) : (
                        <AnimatePresence>
                            {filteredResources.length > 0 ? (
                                filteredResources.map((resource) => (
                                    <motion.div
                                        key={resource.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => navigate(`/resource/${resource.id}`)}
                                        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
                                    >
                                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                                            {resource.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#0066FF] transition-colors">
                                                    {resource.title}
                                                </h3>
                                                <ArrowRightIcon className="h-4 w-4 text-gray-300 group-hover:text-[#0066FF] group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
                                                {resource.description}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                                    Study Guide
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                                    Free Access
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <AcademicCapIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0f172a] mb-2">No resources found</h3>
                                    <p className="text-gray-500 text-sm">Try different keywords or check back later.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Resources;
