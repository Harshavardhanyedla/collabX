import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import MainLayout from '../components/MainLayout';
import {
    MapIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

interface Roadmap {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    link: string;
    is_official: boolean;
    created_at: string;
}

const Roadmaps: React.FC = () => {
    const navigate = useNavigate();
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchRoadmaps();
    }, []);

    const fetchRoadmaps = async () => {
        try {
            const roadmapsRef = collection(db, 'roadmaps');
            const q = query(roadmapsRef, orderBy('created_at', 'desc'));
            const querySnapshot = await getDocs(q);

            const fetchedRoadmaps: Roadmap[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Roadmap));

            setRoadmaps(fetchedRoadmaps);
        } catch (error) {
            console.error('Error fetching roadmaps:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRoadmaps = roadmaps.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardClick = (roadmap: Roadmap) => {
        if (roadmap.link && (roadmap.link.startsWith('http') || roadmap.link.startsWith('https'))) {
            window.open(roadmap.link, '_blank');
        } else {
            navigate(`/roadmap/${roadmap.id}`);
            window.scrollTo(0, 0);
        }
    };

    const RoadmapSkeleton = () => (
        <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="w-12 h-12 bg-gray-100 rounded-xl mb-4"></div>
            <div className="h-5 bg-gray-100 rounded w-2/3 mb-3"></div>
            <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
    );

    return (
        <MainLayout>
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-[#0066FF]">
                            <MapIcon className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#0f172a]">Learning Roadmaps</h1>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Structured paths to help you master new skills and prepare for exams.
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
                            placeholder="Search roadmaps by skill or career path..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => <RoadmapSkeleton key={i} />)
                    ) : (
                        <AnimatePresence>
                            {filteredRoadmaps.length > 0 ? (
                                filteredRoadmaps.map((roadmap) => (
                                    <motion.div
                                        key={roadmap.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={() => handleCardClick(roadmap)}
                                        className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0066FF] group-hover:scale-110 transition-transform">
                                                <MapIcon className="h-6 w-6" />
                                            </div>
                                            {roadmap.is_official && (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">
                                                    <SparklesIcon className="h-3 w-3" />
                                                    OFFICIAL
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#0066FF] transition-colors mb-1 line-clamp-1">
                                            {roadmap.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                                            {roadmap.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                {roadmap.category || 'General'}
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-[#0066FF]">
                                                VIEW PATH
                                                <ChevronRightIcon className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-200">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <MapIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0f172a] mb-2">No roadmaps found</h3>
                                    <p className="text-gray-500 text-sm">Try searching for different skills or paths.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Roadmaps;
