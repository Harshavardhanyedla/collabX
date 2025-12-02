import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Resource {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string; // We'll store icon name or SVG string, for now simple text or default
    link: string;
    is_official: boolean;
    created_at: string;
}

const RoadmapsSection: React.FC = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState<Resource[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [newResource, setNewResource] = useState({
        title: '',
        description: '',
        category: 'General',
        link: '',
    });

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        fetchResources();
    }, []);

    const fetchResources = async () => {
        const { data, error } = await supabase
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching resources:', error);
        } else {
            setResources(data || []);
        }
    };

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const { error } = await supabase
            .from('resources')
            .insert([{
                title: newResource.title,
                description: newResource.description,
                category: newResource.category,
                link: newResource.link,
                is_official: true // Default to official for admin added
            }]);

        if (error) {
            console.error('Error adding resource:', error);
            alert('Failed to add resource.');
        } else {
            setIsModalOpen(false);
            setNewResource({ title: '', description: '', category: 'General', link: '' });
            fetchResources();
        }
    };

    const handleDeleteResource = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        if (!user) return;
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        const { error } = await supabase
            .from('resources')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting resource:', error);
            alert('Failed to delete resource.');
        } else {
            fetchResources();
        }
    };

    const handleCardClick = (resource: Resource) => {
        // If it's an internal route (roadmap), navigate. If external link, open new tab.
        // For now, assuming internal routes or we can check the link format.
        if (resource.link && (resource.link.startsWith('http') || resource.link.startsWith('https'))) {
            window.open(resource.link, '_blank');
        } else {
            // Default behavior for now, maybe navigate to a detail page if needed
            // Or if the link is a route like 'roadmap/cat'
            navigate(`/roadmap/${resource.id}`);
            window.scrollTo(0, 0);
        }
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            placeholder="Search resources..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none bg-white"
                        />
                    </div>

                    {/* Admin Add Button */}
                    {user && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary px-6 py-2 rounded-lg shadow-lg shadow-blue-500/20"
                            >
                                + Add Resource
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">
                            No resources found.
                        </div>
                    ) : (
                        filteredResources.map((resource, index) => (
                            <motion.div
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleCardClick(resource)}
                                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative"
                            >
                                {user && (
                                    <button
                                        onClick={(e) => handleDeleteResource(resource.id, e)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2"
                                        title="Delete Resource"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                )}

                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#0066FF]">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-[#0066FF] transition-colors">
                                    {resource.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {resource.description}
                                </p>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Resource Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Add New Resource</h2>
                        <form onSubmit={handleAddResource} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newResource.title}
                                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={newResource.description}
                                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={newResource.link}
                                    onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 rounded-lg bg-[#0066FF] text-white font-medium hover:bg-blue-600"
                                >
                                    Add Resource
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default RoadmapsSection;
