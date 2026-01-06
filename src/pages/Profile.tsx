import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import type { UserProfile } from '../types';
import { sendConnectionRequest } from '../lib/networking';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected' | 'received'>('none');
    const [actionLoading, setActionLoading] = useState(false);

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    navigate('/login');
                    return;
                }

                const targetUserId = userId || currentUser.uid;
                setIsOwnProfile(targetUserId === currentUser.uid);

                const docRef = doc(db, 'users', targetUserId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUser(docSnap.data() as UserProfile);

                    // Check connection status if not own profile
                    if (targetUserId !== currentUser.uid) {
                        const connectionsRef = collection(db, 'connections');
                        const q = query(
                            connectionsRef,
                            where('requesterId', '==', currentUser.uid),
                            where('recipientId', '==', targetUserId)
                        );
                        const data = await getDocs(q);
                        if (!data.empty) {
                            setConnectionStatus('pending'); // Simplified for now
                        }
                    }
                } else {
                    if (!userId) {
                        navigate('/onboarding');
                    }
                }
            } catch (error: unknown) {
                const err = error as Error;
                console.error("Error fetching user data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate, userId]);

    const handleConnect = async () => {
        if (!auth.currentUser || !userId) return;
        setActionLoading(true);
        try {
            await sendConnectionRequest(userId);
            setConnectionStatus('pending');
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Error sending connection request:", err);
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const projects = [
        {
            id: 1,
            title: 'CollabX',
            description: 'A platform for students to collaborate on projects and find learning resources.',
            stars: 124,
            language: 'TypeScript'
        },
        {
            id: 2,
            title: 'AI Note Taker',
            description: 'An AI-powered tool that summarizes lecture notes and generates quizzes.',
            stars: 89,
            language: 'Python'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF]"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Cover Section */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-[#0066FF] to-[#5865F2] w-full"></div>

            <div className="container-custom mx-auto px-4 -mt-24 md:-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                        >
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-end">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white -mt-16 md:-mt-24">
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-1">{user.name}</h1>
                                    <p className="text-gray-600 text-lg mb-2">{user.role}</p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.534 50.534 0 00-2.658.813m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                            </svg>
                                            {user.institution}
                                        </span>
                                        <span className="text-[#0066FF] font-semibold cursor-pointer hover:underline">500+ connections</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    {isOwnProfile ? (
                                        <button
                                            onClick={() => navigate('/onboarding')}
                                            className="px-6 py-2 bg-[#0066FF] text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                                        >
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleConnect}
                                            disabled={connectionStatus !== 'none' || actionLoading}
                                            className={`px-8 py-2 rounded-full font-bold text-sm transition-all shadow-md ${connectionStatus === 'none'
                                                ? 'bg-[#0066FF] text-white hover:bg-blue-700 shadow-blue-500/20'
                                                : 'bg-gray-100 text-gray-500 cursor-not-allowed shadow-none'
                                                }`}
                                        >
                                            {actionLoading ? 'Sending...' : (connectionStatus === 'pending' ? 'Pending' : 'Connect')}
                                        </button>
                                    )}
                                    {!isOwnProfile && (
                                        <button className="px-6 py-2 border border-[#0066FF] text-[#0066FF] rounded-full font-bold text-sm hover:bg-blue-50 transition-all">
                                            Message
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8"
                        >
                            <h3 className="text-xl font-bold text-[#0f172a] mb-4">About</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {user.bio}
                            </p>
                        </motion.div>

                        {/* Projects Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[#0f172a]">Featured Projects</h3>
                                <button className="text-sm text-[#0066FF] font-bold hover:underline">View All</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                                        <h4 className="font-bold text-[#0f172a] group-hover:text-[#0066FF] mb-2">{project.title}</h4>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium">{project.language}</span>
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                </svg>
                                                {project.stars}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Status/Actions Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
                            <h3 className="font-bold text-[#0f172a] mb-6">Social Links</h3>
                            <div className="space-y-4">
                                {user.socials?.linkedin && (
                                    <a href={`https://${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 text-[#0077b5] hover:bg-blue-50 transition-all border border-blue-100/50">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        <span className="font-bold text-sm">LinkedIn Profile</span>
                                    </a>
                                )}
                                {user.socials?.github && (
                                    <a href={`https://${user.socials.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100 transition-all">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                                        <span className="font-bold text-sm">GitHub Repository</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
                            <h3 className="font-bold text-[#0f172a] mb-6">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill: string) => (
                                    <span key={skill} className="px-4 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-full border border-gray-100 hover:border-[#0066FF] transition-all cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
                            <h3 className="font-bold text-[#0f172a] mb-6">Network</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl text-center">
                                    <p className="font-bold text-2xl text-[#0066FF]">{user.stats?.followers || 0}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Founders</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl text-center">
                                    <p className="font-bold text-2xl text-[#0066FF]">{user.stats?.projects || 0}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Collabs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
