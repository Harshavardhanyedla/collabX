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
                    const userData = docSnap.data() as UserProfile;
                    setUser(userData);

                    if (targetUserId !== currentUser.uid) {
                        const connectionsRef = collection(db, 'connections');
                        const q1 = query(
                            connectionsRef,
                            where('requesterId', '==', currentUser.uid),
                            where('recipientId', '==', targetUserId)
                        );
                        const q2 = query(
                            connectionsRef,
                            where('requesterId', '==', targetUserId),
                            where('recipientId', '==', currentUser.uid)
                        );

                        const [sent, received] = await Promise.all([getDocs(q1), getDocs(q2)]);

                        if (!sent.empty) {
                            const status = sent.docs[0].data().status;
                            setConnectionStatus(status === 'accepted' ? 'connected' : 'pending');
                        } else if (!received.empty) {
                            const status = received.docs[0].data().status;
                            setConnectionStatus(status === 'accepted' ? 'connected' : 'received');
                        }
                    }
                } else if (!userId) {
                    navigate('/onboarding');
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
        const targetUserId = userId || (user?.uid);
        if (!auth.currentUser || !targetUserId) return;
        setActionLoading(true);
        try {
            await sendConnectionRequest(targetUserId);
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
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0066FF]"></div>
                    <p className="text-gray-500 font-medium">Loading premium profile...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Dynamic Animated Header */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF] via-[#5865F2] to-[#7000FF] opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                {/* Decorative Elements */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-5%] left-[5%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"
                />
            </div>

            <div className="container-custom mx-auto px-4 -mt-32 md:-mt-40 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left & Center: Profile Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Master Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 overflow-hidden backdrop-blur-sm"
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-end text-center md:text-left">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0066FF] to-[#00E0FF] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                                            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] tracking-tight">{user.name}</h1>
                                            {user.isAdmin && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-[#0066FF] text-[10px] font-black uppercase rounded-md border border-blue-200">Admin</span>
                                            )}
                                        </div>
                                        <p className="text-blue-600 font-semibold text-xl mb-4">{user.role}</p>

                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-6 text-sm text-gray-500 font-medium">
                                            <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#0066FF]">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.534 50.534 0 00-2.658.813m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                                </svg>
                                                {user.institution}
                                            </span>
                                            <span className="text-[#0066FF] font-bold cursor-pointer hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                                                {user.connectionCount || 0} connections
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 w-full md:w-auto mt-6 md:mt-0">
                                        {isOwnProfile ? (
                                            <button
                                                onClick={() => navigate('/onboarding')}
                                                className="flex-1 md:flex-none px-8 py-3 bg-[#0066FF] text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleConnect}
                                                    disabled={connectionStatus !== 'none' || actionLoading}
                                                    className={`flex-1 md:flex-none px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl ${connectionStatus === 'none'
                                                        ? 'bg-[#0066FF] text-white hover:bg-blue-700 shadow-blue-500/20 hover:scale-[1.02]'
                                                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {actionLoading ? '...' : (
                                                        connectionStatus === 'pending' ? 'Pending' :
                                                            connectionStatus === 'connected' ? 'Connected' :
                                                                connectionStatus === 'received' ? 'Accept Request' : 'Connect'
                                                    )}
                                                </button>
                                                <button className="flex-1 md:flex-none px-6 py-3 border-2 border-gray-100 text-[#0f172a] rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">
                                                    Message
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-8 md:p-10"
                        >
                            <h3 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-[#0066FF] rounded-full"></span>
                                About
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {user.bio || "Building Scalable Products that solve modern problems."}
                            </p>
                        </motion.div>

                        {/* Projects Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-8 md:p-10"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black text-[#0f172a] flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-[#0066FF] rounded-full"></span>
                                    Featured Projects
                                </h3>
                                <button className="px-4 py-2 text-sm text-[#0066FF] font-bold hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">View All</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project) => (
                                    <div key={project.id} className="p-6 rounded-2xl border border-gray-100 hover:border-[#0066FF]/30 hover:bg-[#0066FF]/[0.02] transition-all cursor-pointer group flex flex-col h-full">
                                        <h4 className="font-bold text-xl text-[#0f172a] group-hover:text-[#0066FF] mb-3 transition-colors">{project.title}</h4>
                                        <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{project.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100 uppercase tracking-tighter">{project.language}</span>
                                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-bold">{project.stars}</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar: Social & Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Social Links Card - Glassmorphism */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-blue-900/5 border border-white p-8"
                        >
                            <h3 className="font-black text-xl text-[#0f172a] mb-8 uppercase tracking-widest text-center">Social Links</h3>
                            <div className="space-y-4">
                                {user.socials?.linkedin ? (
                                    <a href={user.socials.linkedin.startsWith('http') ? user.socials.linkedin : `https://${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#0077b5] hover:bg-blue-50/10 transition-all shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                        </div>
                                        <span className="font-bold text-sm text-[#0f172a]">LinkedIn</span>
                                    </a>
                                ) : (
                                    <div className="p-4 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest">LinkedNot Found</div>
                                )}

                                {user.socials?.github ? (
                                    <a href={user.socials.github.startsWith('http') ? user.socials.github : `https://${user.socials.github}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-black hover:bg-gray-50 transition-all shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                                        </div>
                                        <span className="font-bold text-sm text-[#0f172a]">GitHub</span>
                                    </a>
                                ) : (
                                    <div className="p-4 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest">No Commits Yet</div>
                                )}

                                {user.socials?.twitter ? (
                                    <a href={user.socials.twitter.startsWith('http') ? user.socials.twitter : `https://${user.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/[0.02] transition-all shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 4.01c-.78.35-1.63.58-2.52.7a4.41 4.41 0 0 0 1.93-2.43 8.78 8.78 0 0 1-2.79 1.07 4.39 4.39 0 0 0-7.49 4c-3.66-.18-6.9-1.94-9.08-4.6a4.39 4.39 0 0 0 1.36 5.85 4.38 4.38 0 0 1-1.99-.55v.06a4.4 4.4 0 0 0 3.51 4.3 4.38 4.38 0 0 1-1.97.07 4.4 4.4 0 0 0 4.1 3.05 8.79 8.79 0 0 1-5.46 1.88c-.35 0-.7-.02-1.05-.06a12.42 12.42 0 0 0 6.72 1.97c8.06 0 12.48-6.68 12.48-12.48 0-.19 0-.38-.01-.57A8.92 8.92 0 0 0 22 4.01z" /></svg>
                                        </div>
                                        <span className="font-bold text-sm text-[#0f172a]">Twitter / X</span>
                                    </a>
                                ) : (
                                    <div className="p-4 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest">Not on X</div>
                                )}
                            </div>
                        </motion.div>

                        {/* Skills Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-8"
                        >
                            <h3 className="font-black text-xl text-[#0f172a] mb-8 uppercase tracking-widest text-center">Tech Stack</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {user.skills?.length > 0 ? (
                                    user.skills.map((skill: string) => (
                                        <span key={skill} className="px-5 py-2 bg-gradient-to-br from-gray-50 to-white text-gray-800 text-xs font-black rounded-xl border border-gray-100 hover:border-[#0066FF] hover:text-[#0066FF] transition-all cursor-default shadow-sm">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <div className="text-gray-300 font-bold italic text-sm py-4">Learning new skills...</div>
                                )}
                            </div>
                        </motion.div>

                        {/* Network Highlights */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#0066FF] rounded-3xl shadow-xl shadow-blue-900/20 p-8 text-white text-center"
                        >
                            <h3 className="font-black text-xl mb-8 uppercase tracking-widest">Network</h3>
                            <div className="grid grid-cols-2 gap-6 relative">
                                <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/20 -translate-x-1/2"></div>
                                <div>
                                    <p className="font-black text-4xl mb-1 tabular-nums">{user.stats?.followers || 0}</p>
                                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Founders</p>
                                </div>
                                <div>
                                    <p className="font-black text-4xl mb-1 tabular-nums">{user.stats?.projects || 0}</p>
                                    <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Collabs</p>
                                </div>
                            </div>

                            {!isOwnProfile && (
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <p className="text-xs font-bold text-white/80 mb-4 uppercase tracking-tighter">Mutual Connections</p>
                                    <div className="flex justify-center -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0066FF] bg-white overflow-hidden shadow-lg relative z-[10-i]">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=friend${i + user.uid}`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full border-2 border-[#0066FF] bg-blue-400 flex items-center justify-center text-[10px] font-black shadow-lg relative z-0">
                                            +{Math.floor(Math.random() * 20) + 5}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
