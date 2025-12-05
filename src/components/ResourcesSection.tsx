import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';

interface Resource {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    link?: string;
}

const ResourcesSection: React.FC = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false); // Simplified admin check

    // Form state
    const [isAdding, setIsAdding] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', description: '', icon: '📚', color: 'badge-blue', link: '' });

    useEffect(() => {
        fetchResources();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // TODO: Implement proper admin check
            setIsAdmin(!!currentUser);
        });
        return () => unsubscribe();
    }, []);

    const fetchResources = async () => {
        try {
            const resourcesRef = collection(db, 'resources');
            const q = query(resourcesRef); // You can add orderBy if needed
            const querySnapshot = await getDocs(q);

            const fetchedResources: Resource[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Resource));

            if (fetchedResources.length === 0) {
                // Fallback to default resources if DB is empty
                setResources([
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
                setResources(fetchedResources);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newResource.title || !newResource.description) return;

        try {
            await addDoc(collection(db, 'resources'), newResource);
            setIsAdding(false);
            setNewResource({ title: '', description: '', icon: '📚', color: 'badge-blue', link: '' });
            fetchResources();
        } catch (error) {
            console.error('Error adding resource:', error);
        }
    };

    const handleDeleteResource = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            await deleteDoc(doc(db, 'resources', id));
            fetchResources();
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section id="resources" className="section-padding relative z-10 min-h-[80vh] flex flex-col justify-center bg-gray-50">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="container-custom relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-6 drop-shadow-sm">
                        Student Resources
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                        Curated study materials and exam preparation guides to help you excel in your academic journey.
                    </p>
                </motion.div>

                {isAdmin && (
                    <div className="mb-8 flex justify-center">
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className="bg-[#0066FF] text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                        >
                            {isAdding ? 'Cancel' : '+ Add Resource'}
                        </button>
                    </div>
                )}

                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="max-w-md mx-auto mb-12 bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
                    >
                        <form onSubmit={handleAddResource} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newResource.title}
                                onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0066FF] outline-none"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newResource.description}
                                onChange={e => setNewResource({ ...newResource, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0066FF] outline-none"
                                required
                            />
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Icon (emoji)"
                                    value={newResource.icon}
                                    onChange={e => setNewResource({ ...newResource, icon: e.target.value })}
                                    className="w-1/3 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0066FF] outline-none"
                                />
                                <select
                                    value={newResource.color}
                                    onChange={e => setNewResource({ ...newResource, color: e.target.value })}
                                    className="w-2/3 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0066FF] outline-none"
                                >
                                    <option value="badge-blue">Blue</option>
                                    <option value="badge-yellow">Yellow</option>
                                    <option value="badge-green">Green</option>
                                    <option value="badge-purple">Purple</option>
                                    <option value="badge-red">Red</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-[#0066FF] text-white py-2 rounded-lg font-bold hover:bg-blue-700">
                                Save Resource
                            </button>
                        </form>
                    </motion.div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF]"></div>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {resources.map((resource) => (
                            <motion.div
                                key={resource.id}
                                className="bg-white rounded-2xl p-8 cursor-pointer group border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative"
                                variants={itemVariants}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => navigate(`/resource/${resource.id}`)}
                            >
                                {isAdmin && (
                                    <button
                                        onClick={(e) => handleDeleteResource(resource.id, e)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                )}

                                <div className="mb-6 flex justify-center">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                                        {resource.icon}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-[#0f172a] mb-4 text-center group-hover:text-[#0066FF] transition-colors">
                                    {resource.title}
                                </h3>

                                <p className="text-gray-600 mb-6 leading-relaxed text-center font-light flex-1">
                                    {resource.description}
                                </p>

                                <div className="mt-auto text-center">
                                    <span className="text-[#0066FF] font-medium group-hover:underline underline-offset-4 flex items-center justify-center gap-2">
                                        View Materials <span>→</span>
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default ResourcesSection;
