import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import AuthModal from '../components/AuthModal';
import ShareProjectModal from '../components/ShareProjectModal';
import MainLayout from '../components/MainLayout';
import {
    BriefcaseIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';

import type { Project } from '../types';
import { fetchAllProjects, requestToJoinProject } from '../lib/projects';

const Projects: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [joiningId, setJoiningId] = useState<string | null>(null);

    useEffect(() => {
        loadProjects();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        const fetched = await fetchAllProjects();
        setProjects(fetched);
        setLoading(false);
    };

    const handleJoinRequest = async (projectId: string) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setJoiningId(projectId);
        try {
            await requestToJoinProject(projectId);
            // Refresh projects
            await loadProjects();
        } catch (error) {
            console.error("Failed to join project:", error);
        } finally {
            setJoiningId(null);
        }
    };

    const handleShareProject = () => {
        if (!user) {
            setIsAuthModalOpen(true);
        } else {
            setIsShareModalOpen(true);
        }
    };

    const categories = ['All', 'AI/ML', 'Web Dev', 'Mobile', 'Blockchain', 'Design'];

    const filteredProjects = projects.filter(project => {
        const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.techStack?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const ProjectSkeleton = () => (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm animate-pulse">
            <div className="h-40 bg-gray-100"></div>
            <div className="p-4">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                    <div className="h-4 bg-gray-100 rounded w-12"></div>
                    <div className="h-4 bg-gray-100 rounded w-12"></div>
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout>
            <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-[#0066FF]">
                                <BriefcaseIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#0f172a]">Collaboration Projects</h1>
                                <p className="text-gray-500 text-sm">Find projects to join and talented students to collaborate with.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleShareProject}
                            className="bg-[#0066FF] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Post Project
                        </button>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-[72px] z-10 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title, description, or stack..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0066FF] focus:bg-white focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <div className="flex items-center gap-1.5 mr-2 shrink-0 text-gray-500">
                            <FunnelIcon className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Filters:</span>
                        </div>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${activeCategory === category
                                    ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-md'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => <ProjectSkeleton key={i} />)
                    ) : (
                        <AnimatePresence>
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer"
                                    >
                                        <div className="h-40 overflow-hidden relative">
                                            <img
                                                src={project.thumbnailUrl || `https://source.unsplash.com/random/800x600?tech,${project.category}`}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-[#0f172a] uppercase border border-white shadow-sm">
                                                    {project.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-[10px] overflow-hidden shrink-0">
                                                    {project.ownerAvatar ? (
                                                        <img src={project.ownerAvatar} alt={project.ownerName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        project.ownerName[0]
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium">{project.ownerName}</span>
                                            </div>

                                            <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-[#0066FF] transition-colors mb-1 line-clamp-1">{project.title}</h3>
                                            <p className="text-xs text-gray-600 line-clamp-2 mb-4 h-8">{project.description}</p>

                                            <div className="flex flex-wrap gap-1 mb-4 h-6 overflow-hidden">
                                                {project.techStack?.map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold text-[#0066FF] bg-blue-50 px-2 py-0.5 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <BriefcaseIcon className="h-4 w-4" />
                                                    <span className="text-[11px] font-medium">{project.members?.length || 0} members</span>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (project.members?.includes(user?.uid || '')) return;
                                                        if (project.pendingRequests?.includes(user?.uid || '')) return;
                                                        handleJoinRequest(project.id);
                                                    }}
                                                    disabled={joiningId === project.id || project.members?.includes(user?.uid || '') || project.pendingRequests?.includes(user?.uid || '')}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${project.members?.includes(user?.uid || '')
                                                        ? 'bg-green-50 text-green-600 border border-green-100 cursor-default'
                                                        : project.pendingRequests?.includes(user?.uid || '')
                                                            ? 'bg-yellow-50 text-yellow-600 border border-yellow-100 cursor-default'
                                                            : 'bg-[#0066FF] text-white hover:bg-blue-600'
                                                        }`}
                                                >
                                                    {project.members?.includes(user?.uid || '')
                                                        ? 'Joined'
                                                        : project.pendingRequests?.includes(user?.uid || '')
                                                            ? 'Pending'
                                                            : joiningId === project.id ? 'Joining...' : 'Join'
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center bg-white rounded-xl border border-gray-200">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <BriefcaseIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0f172a] mb-2">No projects found</h3>
                                    <p className="text-gray-500 text-sm">Be the first to post a project in this category!</p>
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <ShareProjectModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} onSuccess={loadProjects} />
        </MainLayout>
    );
};

export default Projects;
