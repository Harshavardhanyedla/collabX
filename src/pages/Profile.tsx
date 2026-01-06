import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import type { UserProfile, Project } from '../types';
import { sendConnectionRequest } from '../lib/networking';
import { fetchUserProjects, addProject, updateProject, deleteProject } from '../lib/projects';
import { AnimatePresence } from 'framer-motion';
import AvatarUpload from '../components/AvatarUpload';
import SkillsManager from '../components/SkillsManager';
import IncomingRequests from '../components/IncomingRequests';
import { updateDoc } from 'firebase/firestore';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected' | 'received'>('none');
    const [actionLoading, setActionLoading] = useState(false);
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [projectFormLoading, setProjectFormLoading] = useState(false);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [connectNote, setConnectNote] = useState('');

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

                // Fetch real projects
                const projects = await fetchUserProjects(targetUserId);
                setUserProjects(projects);

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

        if (!isConnectModalOpen) {
            setIsConnectModalOpen(true);
            return;
        }

        setActionLoading(true);
        try {
            await sendConnectionRequest(targetUserId, connectNote);
            setConnectionStatus('pending');
            setIsConnectModalOpen(false);
            setConnectNote('');
        } catch (error: unknown) {
            const err = error as Error;
            console.error("Error sending connection request:", err);
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser || !editingProject) return;
        setProjectFormLoading(true);
        try {
            if (editingProject.id) {
                await updateProject(editingProject.id, editingProject);
            } else {
                await addProject(auth.currentUser.uid, editingProject as Omit<Project, 'id' | 'userId' | 'createdAt'>);
            }
            const projects = await fetchUserProjects(user?.uid || auth.currentUser.uid);
            setUserProjects(projects);
            setIsProjectModalOpen(false);
            setEditingProject(null);
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Failed to save project.");
        } finally {
            setProjectFormLoading(false);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await deleteProject(projectId);
            setUserProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Failed to delete project.");
        }
    };

    const updateSkills = async (newSkills: string[]) => {
        if (!auth.currentUser || !user) return;
        try {
            const userRef = doc(db, 'users', user.uid || auth.currentUser.uid);
            await updateDoc(userRef, { skills: newSkills });
            setUser(prev => prev ? { ...prev, skills: newSkills } : null);
        } catch (error) {
            console.error("Error updating skills:", error);
            alert("Failed to update skills.");
        }
    };

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
            <div className="relative h-64 md:h-80 w-full overflow-hidden" style={{ transform: 'translateZ(0)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF] via-[#5865F2] to-[#7000FF] opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" style={{ transform: 'translateZ(0)' }}></div>

                {/* Decorative Elements */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
                    className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        opacity: [0.2, 0.25, 0.2]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
                    className="absolute bottom-[-5%] left-[5%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"
                />
            </div>

            <div className="container-custom mx-auto px-4 -mt-32 md:-mt-40 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left & Center: Profile Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {isOwnProfile && <IncomingRequests onActionComplete={() => {
                            // Optionally refresh stats or connection count
                        }} />}

                        {/* Master Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 overflow-hidden"
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-end text-center md:text-left">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0066FF] to-[#00E0FF] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        {isOwnProfile ? (
                                            <AvatarUpload
                                                userId={auth.currentUser?.uid || ''}
                                                currentAvatar={user.avatar}
                                                onUploadComplete={(newUrl) => setUser(prev => prev ? { ...prev, avatar: newUrl } : null)}
                                            />
                                        ) : (
                                            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                                                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
                                            </div>
                                        )}
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
                                <div className="flex gap-2">
                                    {isOwnProfile && (
                                        <button
                                            onClick={() => {
                                                setEditingProject({
                                                    title: '',
                                                    description: '',
                                                    role: '',
                                                    techStack: [],
                                                    duration: '',
                                                    githubUrl: '',
                                                    liveUrl: ''
                                                });
                                                setIsProjectModalOpen(true);
                                            }}
                                            className="px-4 py-2 bg-blue-50 text-[#0066FF] text-sm font-bold rounded-xl hover:bg-blue-100 transition-all"
                                        >
                                            + Add Project
                                        </button>
                                    )}
                                    <button className="px-4 py-2 text-sm text-[#0066FF] font-bold hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100">View All</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userProjects.length > 0 ? (
                                    userProjects.map((project) => (
                                        <div key={project.id} className="p-6 rounded-2xl border border-gray-100 hover:border-[#0066FF]/30 hover:bg-[#0066FF]/[0.02] transition-all cursor-pointer group flex flex-col h-full relative">
                                            {isOwnProfile && (
                                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingProject(project);
                                                            setIsProjectModalOpen(true);
                                                        }}
                                                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-blue-600"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProject(project.id);
                                                        }}
                                                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-red-600"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            <h4 className="font-bold text-xl text-[#0f172a] group-hover:text-[#0066FF] mb-1 transition-colors">{project.title}</h4>
                                            <p className="text-blue-600 text-xs font-bold mb-3">{project.role}</p>
                                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{project.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-wrap gap-2">
                                                    {project.techStack?.slice(0, 3).map(tech => (
                                                        <span key={tech} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-[10px] font-bold border border-gray-100 uppercase">{tech}</span>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold">{project.duration}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400 font-medium">No projects added yet.</p>
                                        {isOwnProfile && <p className="text-sm text-blue-500 mt-2 cursor-pointer hover:underline" onClick={() => setIsProjectModalOpen(true)}>Add your first project</p>}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar: Social & Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Social Links Card - Glassmorphism */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-8"
                            style={{ willChange: 'transform' }}
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
                            <SkillsManager
                                skills={user.skills || []}
                                isOwnProfile={isOwnProfile}
                                onUpdate={updateSkills}
                            />
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

            {/* Project Modal */}
            <AnimatePresence>
                {isProjectModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProjectModalOpen(false)}
                            className="absolute inset-0 bg-black/70"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-2xl font-black text-[#0f172a]">
                                    {editingProject?.id ? 'Edit Project' : 'Add New Project'}
                                </h3>
                                <button
                                    onClick={() => setIsProjectModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleProjectSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Project Title</label>
                                        <input
                                            required
                                            type="text"
                                            value={editingProject?.title || ''}
                                            onChange={(e) => setEditingProject(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                                            placeholder="e.g. CollabX Networking Module"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Your Role</label>
                                        <input
                                            required
                                            type="text"
                                            value={editingProject?.role || ''}
                                            onChange={(e) => setEditingProject(prev => ({ ...prev, role: e.target.value }))}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                                            placeholder="e.g. Lead Designer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Duration</label>
                                        <input
                                            required
                                            type="text"
                                            value={editingProject?.duration || ''}
                                            onChange={(e) => setEditingProject(prev => ({ ...prev, duration: e.target.value }))}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                                            placeholder="e.g. 3 Months"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={editingProject?.description || ''}
                                            onChange={(e) => setEditingProject(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium resize-none"
                                            placeholder="Tell us about the project goal and your impact..."
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tech Stack (Comma Separated)</label>
                                        <input
                                            type="text"
                                            value={editingProject?.techStack?.join(', ') || ''}
                                            onChange={(e) => setEditingProject(prev => ({ ...prev, techStack: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') }))}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                                            placeholder="e.g. React, Firebase, Tailwind"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">GitHub URL</label>
                                        <input
                                            type="url"
                                            value={editingProject?.githubUrl || ''}
                                            onChange={(e) => setEditingProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Live Demo URL</label>
                                        <input
                                            type="url"
                                            value={editingProject?.liveUrl || ''}
                                            onChange={(e) => setEditingProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                                            className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium"
                                            placeholder="https://collabx.app/..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsProjectModalOpen(false)}
                                        className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={projectFormLoading}
                                        className="flex-[2] px-8 py-4 rounded-2xl bg-[#0066FF] text-white font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                                    >
                                        {projectFormLoading ? 'Saving...' : (editingProject?.id ? 'Update Project' : 'Add Project')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Connection Note Modal */}
            <AnimatePresence>
                {isConnectModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsConnectModalOpen(false)}
                            className="absolute inset-0 bg-[#0f172a]/60"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-xl font-black text-[#0f172a]">Send Connection Request</h3>
                                <p className="text-sm text-gray-500 mt-1">LinkedIn-style personalized note (optional)</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Message (Max 300 chars)</label>
                                    <textarea
                                        rows={4}
                                        maxLength={300}
                                        value={connectNote}
                                        onChange={(e) => setConnectNote(e.target.value)}
                                        className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium resize-none"
                                        placeholder="Hi! I saw your project and would love to connect..."
                                    />
                                    <div className="flex justify-end mt-2">
                                        <span className="text-[10px] font-bold text-gray-400">{connectNote.length}/300</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsConnectModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConnect}
                                        disabled={actionLoading}
                                        className="flex-[2] px-6 py-3 rounded-2xl bg-[#0066FF] text-white font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                                    >
                                        {actionLoading ? 'Sending...' : 'Send Request'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
