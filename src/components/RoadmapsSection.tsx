import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

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

const RoadmapsSection: React.FC = () => {
    const navigate = useNavigate();
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [newRoadmap, setNewRoadmap] = useState({
        title: '',
        description: '',
        category: 'General',
        link: '',
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        fetchRoadmaps();
        return () => unsubscribe();
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
        }
    };

    const handleAddRoadmap = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            await addDoc(collection(db, 'roadmaps'), {
                ...newRoadmap,
                is_official: true,
                created_at: Timestamp.now().toDate().toISOString()
            });
            setIsModalOpen(false);
            setNewRoadmap({ title: '', description: '', category: 'General', link: '' });
            fetchRoadmaps();
        } catch (error) {
            console.error('Error adding roadmap:', error);
            alert('Failed to add roadmap.');
        }
    };

    const handleDeleteRoadmap = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;
        if (!window.confirm('Are you sure you want to delete this roadmap?')) return;

        try {
            await deleteDoc(doc(db, 'roadmaps', id));
            fetchRoadmaps();
        } catch (error) {
            console.error('Error deleting roadmap:', error);
            alert('Failed to delete roadmap.');
        }
    };

    const handleCardClick = (roadmap: Roadmap) => {
        if (roadmap.link && (roadmap.link.startsWith('http') || roadmap.link.startsWith('https'))) {
            window.open(roadmap.link, '_blank');
        } else {
            navigate(`/roadmap/${roadmap.id}`);
            window.scrollTo(0, 0);
        }
    };

    const filteredRoadmaps = roadmaps.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section id="roadmaps" className="py-24 bg-gray-50">
            <div className="container-custom mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-[#0f172a] mb-4">Find Learning Roadmaps</h2>
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
                            placeholder="Search roadmaps..."
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
                                className="bg-[#0066FF] text-white px-6 py-2 rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                            >
                                + Add Roadmap
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRoadmaps.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">
                            No roadmaps found.
                        </div>
                    ) : (
                        filteredRoadmaps.map((roadmap, index) => (
                            <motion.div
                                key={roadmap.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleCardClick(roadmap)}
                                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative"
                            >
                                {user && (
                                    <button
                                        onClick={(e) => handleDeleteRoadmap(roadmap.id, e)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2"
                                        title="Delete Roadmap"
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
                                    {roadmap.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {roadmap.description}
                                </p>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Roadmap Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Add New Roadmap</h2>
                        <form onSubmit={handleAddRoadmap} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newRoadmap.title}
                                    onChange={(e) => setNewRoadmap({ ...newRoadmap, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={newRoadmap.description}
                                    onChange={(e) => setNewRoadmap({ ...newRoadmap, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0066FF] outline-none"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={newRoadmap.link}
                                    onChange={(e) => setNewRoadmap({ ...newRoadmap, link: e.target.value })}
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
                                    Add Roadmap
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
