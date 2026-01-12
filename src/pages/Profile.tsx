import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import type { UserProfile, Project } from '../types';
import { sendConnectionRequest, fetchConnectionCount } from '../lib/networking';
import { getOrCreateConversation } from '../lib/messaging';
import { fetchUserProjects, addProject, updateProject, deleteProject } from '../lib/projects';
import AvatarUpload from '../components/AvatarUpload';
import SkillsManager from '../components/SkillsManager';
import IncomingRequests from '../components/IncomingRequests';
import ProfileEditModal from '../components/ProfileEditModal';
import { getUserProfile } from '../lib/profiles';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [connectionCount, setConnectionCount] = useState<number>(0);
    const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected' | 'received'>('none');
    const [actionLoading, setActionLoading] = useState(false);
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [techStackInput, setTechStackInput] = useState<string>('');
    const [projectFormLoading, setProjectFormLoading] = useState(false);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [connectNote, setConnectNote] = useState('');

    const fetchUserData = async () => {
        try {
            const currentUser = auth.currentUser;
            const targetUserId = userId || currentUser?.uid;

            if (!targetUserId) {
                navigate('/login');
                return;
            }

            setIsOwnProfile(targetUserId === currentUser?.uid);

            const userData = await getUserProfile(targetUserId);

            if (userData) {
                setUser(userData);

                if (currentUser && targetUserId !== currentUser.uid) {
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

            const projects = await fetchUserProjects(targetUserId);
            setUserProjects(projects);

            const count = await fetchConnectionCount(targetUserId);
            setConnectionCount(count);

        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

        const techStackArray = techStackInput.split(',').map(s => s.trim()).filter(Boolean);

        if (techStackArray.length === 0) {
            alert("Please add at least one technology to the Tech Stack.");
            return;
        }

        setProjectFormLoading(true);
        try {
            if (editingProject.id) {
                await updateProject(editingProject.id, {
                    ...editingProject,
                    techStack: techStackArray
                } as Project);
            } else {
                await addProject(auth.currentUser.uid, {
                    title: editingProject.title || '',
                    description: editingProject.description || '',
                    techStack: techStackArray,
                    rolesNeeded: [],
                    category: 'Development',
                    ownerName: user?.name || 'Anonymous',
                    ownerAvatar: user?.avatar || '',
                    githubUrl: editingProject.githubUrl,
                    liveUrl: editingProject.liveUrl,
                    status: 'Open',
                    thumbnailUrl: '',
                    updatedAt: null
                });
            }
            fetchUserData();
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

    const handleMessage = async () => {
        if (!user?.uid) return;
        try {
            const conversationId = await getOrCreateConversation(user.uid);
            navigate(`/messages?conversationId=${conversationId}`);
        } catch (error) {
            console.error("Error starting conversation:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0066FF]"></div>
                    <p className="text-gray-500 font-medium text-sm animate-pulse">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <div className="relative h-44 md:h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF] via-[#5865F2] to-[#7000FF] opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>

            <div className="container-custom mx-auto px-4 -mt-24 md:-mt-40 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {isOwnProfile && <IncomingRequests onActionComplete={fetchUserData} />}

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 overflow-hidden"
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-end text-center md:text-left">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#0066FF] to-[#00E0FF] rounded-full blur-md opacity-20"></div>
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
                                                {user.college || user.institution || "Student"}
                                            </span>
                                            <div className="flex items-center gap-2 text-[#0066FF] font-bold text-sm bg-blue-50 px-4 py-1.5 rounded-full">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                {connectionCount} connections
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 w-full md:w-auto mt-6 md:mt-0">
                                        {isOwnProfile ? (
                                            <button
                                                onClick={() => setIsEditModalOpen(true)}
                                                className="flex-1 md:flex-none px-8 py-3 bg-[#0066FF] text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleConnect}
                                                    disabled={connectionStatus !== 'none' || actionLoading}
                                                    className={`flex-1 md:flex-none px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl ${connectionStatus === 'none'
                                                        ? 'bg-[#0066FF] text-white hover:bg-blue-700 shadow-blue-500/20'
                                                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {actionLoading ? '...' : (
                                                        connectionStatus === 'pending' ? 'Pending' :
                                                            connectionStatus === 'connected' ? 'Connected' :
                                                                connectionStatus === 'received' ? 'Accept Request' : 'Connect'
                                                    )}
                                                </button>
                                                <button
                                                    onClick={handleMessage}
                                                    className="flex-1 md:flex-none px-6 py-3 border-2 border-gray-100 text-[#0f172a] rounded-2xl font-bold text-sm hover:bg-gray-50"
                                                >
                                                    Message
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
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

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-8 md:p-10"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black text-[#0f172a] flex items-center gap-3">
                                    <span className="w-1.5 h-8 bg-[#0066FF] rounded-full"></span>
                                    Featured Projects
                                </h3>
                                {isOwnProfile && (
                                    <button
                                        onClick={() => {
                                            setEditingProject({
                                                title: '',
                                                description: '',
                                                techStack: [],
                                                githubUrl: '',
                                                liveUrl: ''
                                            });
                                            setTechStackInput('');
                                            setIsProjectModalOpen(true);
                                        }}
                                        className="px-4 py-2 bg-blue-50 text-[#0066FF] text-sm font-bold rounded-xl hover:bg-blue-100 transition-all"
                                    >
                                        + Add Project
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userProjects.length > 0 ? (
                                    userProjects.map((project) => (
                                        <div key={project.id} className="p-6 rounded-2xl border border-gray-100 hover:border-[#0066FF]/30 hover:bg-[#0066FF]/0.02 transition-all flex flex-col h-full relative group">
                                            {isOwnProfile && (
                                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingProject(project);
                                                            setTechStackInput(project.techStack?.join(', ') || '');
                                                            setIsProjectModalOpen(true);
                                                        }}
                                                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProject(project.id);
                                                        }}
                                                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-red-600"
                                                    >
                                                        Del
                                                    </button>
                                                </div>
                                            )}
                                            <h4 className="font-bold text-xl text-[#0f172a] group-hover:text-[#0066FF] mb-1">{project.title}</h4>
                                            <p className="text-gray-500 text-sm mb-6 line-clamp-3">{project.description}</p>
                                            <div className="mt-auto flex flex-wrap gap-2">
                                                {project.techStack?.map(tech => (
                                                    <span key={tech} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-[10px] font-bold border border-gray-100 uppercase">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                        <p className="text-gray-400 font-medium">No projects added yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-8"
                        >
                            <h3 className="font-black text-xl text-[#0f172a] mb-8 uppercase tracking-widest text-center">Social Links</h3>
                            <div className="space-y-4">
                                {user.socials?.github && (
                                    <a href={user.socials.github} target="_blank" className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                                        <span className="font-bold text-sm">GitHub</span>
                                    </a>
                                )}
                                {user.socials?.linkedin && (
                                    <a href={user.socials.linkedin} target="_blank" className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 text-blue-600">
                                        <span className="font-bold text-sm">LinkedIn</span>
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-8"
                        >
                            <SkillsManager
                                skills={user.skills || []}
                                isOwnProfile={isOwnProfile}
                                onUpdate={updateSkills}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isProjectModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjectModalOpen(false)} className="absolute inset-0 bg-black/70" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-3xl p-8 overflow-hidden">
                            <h3 className="text-2xl font-black mb-6">{editingProject?.id ? 'Edit Project' : 'Add Project'}</h3>
                            <form onSubmit={handleProjectSubmit} className="space-y-6">
                                <input required placeholder="Project Title" value={editingProject?.title || ''} onChange={e => setEditingProject(prev => ({ ...prev, title: e.target.value }))} className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#0066FF]" />
                                <textarea required rows={4} placeholder="Description" value={editingProject?.description || ''} onChange={e => setEditingProject(prev => ({ ...prev, description: e.target.value }))} className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#0066FF] resize-none" />
                                <input required placeholder="Tech Stack (comma separated)" value={techStackInput} onChange={e => setTechStackInput(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#0066FF]" />
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-1 py-4 font-bold text-gray-400">Cancel</button>
                                    <button type="submit" disabled={projectFormLoading} className="flex-[2] py-4 bg-[#0066FF] text-white font-bold rounded-2xl shadow-lg">Save Project</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isConnectModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsConnectModalOpen(false)} className="absolute inset-0 bg-black/60" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-3xl p-8">
                            <h3 className="text-xl font-black mb-4">Send Request</h3>
                            <textarea rows={4} placeholder="Personalized note (optional)" value={connectNote} onChange={e => setConnectNote(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:border-[#0066FF] mb-6" />
                            <div className="flex gap-4">
                                <button onClick={() => setIsConnectModalOpen(false)} className="flex-1 font-bold text-gray-400">Cancel</button>
                                <button onClick={handleConnect} disabled={actionLoading} className="flex-[2] py-3 bg-[#0066FF] text-white font-bold rounded-2xl">Send</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {user && (
                <ProfileEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    userId={user.uid}
                    onSuccess={fetchUserData}
                />
            )}
        </div>
    );
};

export default Profile;
