import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
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
                    setUser(docSnap.data());

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
            } catch (error) {
                console.error("Error fetching user data:", error);
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
            await addDoc(collection(db, 'connections'), {
                requesterId: auth.currentUser.uid,
                recipientId: userId,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            setConnectionStatus('pending');
        } catch (error) {
            console.error("Error sending connection request:", error);
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
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="container-custom mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar - Profile Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                            <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 mb-6 overflow-hidden border-4 border-white shadow-lg">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>

                            <h1 className="text-2xl font-bold text-[#0f172a] mb-2">{user.name}</h1>
                            <p className="text-[#5865F2] font-medium mb-4">{user.role}</p>

                            {isOwnProfile ? (
                                <button
                                    onClick={() => navigate('/onboarding')}
                                    className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={handleConnect}
                                    disabled={connectionStatus !== 'none' || actionLoading}
                                    className={`mb-6 px-6 py-2 rounded-lg text-sm font-bold transition-all ${connectionStatus === 'none'
                                            ? 'bg-[#0066FF] text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {actionLoading ? 'Sending...' : (connectionStatus === 'pending' ? 'Request Sent' : 'Connect')}
                                </button>
                            )}

                            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.534 50.534 0 00-2.658.813m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                </svg>
                                {user.institution}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-8">
                                {user.bio}
                            </p>

                            <div className="flex justify-center gap-4 mb-8">
                                {user.socials?.github && (
                                    <a href={`https://${user.socials.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-[#181717] hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                    </a>
                                )}
                                {user.socials?.linkedin && (
                                    <a href={`https://${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-[#0077b5] hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                                    </a>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                                <div>
                                    <p className="font-bold text-[#0f172a] text-lg">{user.stats.projects}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Projects</p>
                                </div>
                                <div>
                                    <p className="font-bold text-[#0f172a] text-lg">{user.stats.stars}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Stars</p>
                                </div>
                                <div>
                                    <p className="font-bold text-[#0f172a] text-lg">{user.stats.followers}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Followers</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mt-6">
                            <h3 className="font-bold text-[#0f172a] mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content - Projects & Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-[#0f172a]">Featured Projects</h3>
                                <button className="text-sm text-[#5865F2] font-medium hover:underline">View All</button>
                            </div>

                            <div className="space-y-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="group p-4 rounded-xl border border-gray-100 hover:border-[#5865F2]/30 hover:bg-purple-50/30 transition-all cursor-pointer">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-[#0f172a] group-hover:text-[#5865F2] transition-colors">{project.title}</h4>
                                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{project.language}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-4">{project.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                </svg>
                                                {project.stars}
                                            </span>
                                            <span>Updated 2 days ago</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#0f172a] mb-6">Recent Activity</h3>
                            <div className="space-y-6">
                                {[1, 2, 3].map((item: number) => (
                                    <div key={item} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-[#5865F2] shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#0f172a] font-medium">
                                                Commented on <span className="text-[#5865F2] cursor-pointer">"System Design for Beginners"</span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
