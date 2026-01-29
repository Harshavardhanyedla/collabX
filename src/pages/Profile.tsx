import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../lib/firebase';
import { doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import type { UserProfile, Project } from '../types';
import { sendConnectionRequest, fetchConnectionCount, acceptConnectionRequest } from '../lib/networking';
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
    const [requestId, setRequestId] = useState<string | null>(null);
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

                // Increment views if viewing someone else
                if (currentUser && targetUserId !== currentUser.uid) {
                    const { incrementProfileViews } = await import('../lib/profiles');
                    incrementProfileViews(targetUserId);

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
                        const data = sent.docs[0].data();
                        setConnectionStatus(data.status === 'accepted' ? 'connected' : 'pending');
                        setRequestId(sent.docs[0].id);
                    } else if (!received.empty) {
                        const data = received.docs[0].data();
                        setConnectionStatus(data.status === 'accepted' ? 'connected' : 'received');
                        setRequestId(received.docs[0].id);
                    } else {
                        setConnectionStatus('none');
                        setRequestId(null);
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

        if (connectionStatus === 'received') {
            if (requestId) {
                setActionLoading(true);
                try {
                    await acceptConnectionRequest(requestId, targetUserId);
                    setConnectionStatus('connected');
                    setConnectionCount(prev => prev + 1);
                } catch (error) {
                    console.error("Error accepting request:", error);
                } finally {
                    setActionLoading(false);
                }
            }
            return;
        }

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
        <div className="min-h-screen bg-[#F4F6F8] pb-20">
            {/* Gradient Banner */}
            <div className="relative h-32 md:h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF] via-[#5865F2] to-[#7000FF] opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>

            <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-10 max-w-6xl">
                {isOwnProfile && <IncomingRequests onActionComplete={fetchUserData} />}

                {/* Two-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* LEFT SIDEBAR - Identity Rail */}
                    <div className="lg:w-80 flex-shrink-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {/* Profile Photo & Basic Info */}
                            <div className="p-6 text-center border-b border-gray-100">
                                <div className="relative inline-block mb-4">
                                    {isOwnProfile ? (
                                        <AvatarUpload
                                            userId={auth.currentUser?.uid || ''}
                                            currentAvatar={user.avatar}
                                            onUploadComplete={(newUrl) => setUser(prev => prev ? { ...prev, avatar: newUrl } : null)}
                                        />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white mx-auto">
                                            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <h1 className="text-xl font-bold text-[#0f172a]">{user.name}</h1>
                                    {user.isAdmin && (
                                        <span className="px-2 py-0.5 bg-blue-100 text-[#0066FF] text-[9px] font-bold uppercase rounded">Admin</span>
                                    )}
                                </div>
                                <p className="text-[#0066FF] font-medium text-sm mb-2">{user.role}</p>
                                <p className="text-gray-500 text-xs mb-3">{user.college || user.institution || "Student"}</p>

                                <div className="flex items-center justify-center gap-1 text-[#0066FF] font-semibold text-sm">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    {connectionCount} connections
                                </div>
                            </div>

                            {/* Action Buttons - Always visible including mobile */}
                            <div className="p-4 space-y-3">
                                {isOwnProfile ? (
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="w-full py-3 bg-[#0066FF] text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleConnect}
                                            disabled={connectionStatus !== 'none' || actionLoading}
                                            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${connectionStatus === 'none'
                                                ? 'bg-[#0066FF] text-white hover:bg-blue-700'
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
                                            className="w-full py-3 border-2 border-gray-200 text-[#0f172a] rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
                                        >
                                            Message
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Social Links */}
                            {(user.socials?.github || user.socials?.linkedin) && (
                                <div className="px-4 pb-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Social Links</h3>
                                    <div className="space-y-2">
                                        {user.socials?.github && (
                                            <a href={user.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                                <span className="text-sm font-medium text-gray-700">GitHub</span>
                                            </a>
                                        )}
                                        {user.socials?.linkedin && (
                                            <a href={user.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                                                <svg className="w-5 h-5 text-[#0066FF]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                                <span className="text-sm font-medium text-[#0066FF]">LinkedIn</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Skills / Tech Stack */}
                            <div className="px-4 pb-6">
                                <SkillsManager
                                    skills={user.skills || []}
                                    isOwnProfile={isOwnProfile}
                                    onUpdate={updateSkills}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN - Content Area */}
                    <div className="flex-1 space-y-6">
                        {/* About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-[#0066FF] rounded-full"></span>
                                About
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {user.bio || "Building Scalable Products that solve modern problems."}
                            </p>
                        </motion.div>

                        {/* Projects Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                                    <span className="w-1 h-5 bg-[#0066FF] rounded-full"></span>
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
                                        className="px-4 py-2 bg-blue-50 text-[#0066FF] text-sm font-semibold rounded-lg hover:bg-blue-100 transition-all"
                                    >
                                        + Add Project
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userProjects.length > 0 ? (
                                    userProjects.map((project) => (
                                        <div key={project.id} className="p-5 rounded-xl border border-gray-100 hover:border-[#0066FF]/30 hover:shadow-sm transition-all flex flex-col h-full relative group">
                                            {isOwnProfile && (
                                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingProject(project);
                                                            setTechStackInput(project.techStack?.join(', ') || '');
                                                            setIsProjectModalOpen(true);
                                                        }}
                                                        className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 text-xs"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProject(project.id);
                                                        }}
                                                        className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100 text-gray-400 hover:text-red-600 text-xs"
                                                    >
                                                        Del
                                                    </button>
                                                </div>
                                            )}
                                            <h4 className="font-semibold text-[#0f172a] group-hover:text-[#0066FF] mb-2">{project.title}</h4>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{project.description}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                                {project.techStack?.slice(0, 4).map(tech => (
                                                    <span key={tech} className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[10px] font-medium border border-gray-100">{tech}</span>
                                                ))}
                                                {project.techStack && project.techStack.length > 4 && (
                                                    <span className="px-2 py-0.5 text-gray-400 text-[10px] font-medium">+{project.techStack.length - 4}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-400 font-medium">No projects added yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Project Modal */}
            <AnimatePresence>
                {isProjectModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjectModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white rounded-2xl p-6 overflow-hidden">
                            <h3 className="text-xl font-bold mb-5">{editingProject?.id ? 'Edit Project' : 'Add Project'}</h3>
                            <form onSubmit={handleProjectSubmit} className="space-y-4">
                                <input required placeholder="Project Title" value={editingProject?.title || ''} onChange={e => setEditingProject(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#0066FF] text-sm" />
                                <textarea required rows={3} placeholder="Description" value={editingProject?.description || ''} onChange={e => setEditingProject(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#0066FF] resize-none text-sm" />
                                <input required placeholder="Tech Stack (comma separated)" value={techStackInput} onChange={e => setTechStackInput(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#0066FF] text-sm" />
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-1 py-3 font-semibold text-gray-400 hover:text-gray-600">Cancel</button>
                                    <button type="submit" disabled={projectFormLoading} className="flex-[2] py-3 bg-[#0066FF] text-white font-semibold rounded-xl shadow-sm disabled:opacity-50">Save Project</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Connect Modal */}
            <AnimatePresence>
                {isConnectModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsConnectModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">Send Connection Request</h3>
                            <textarea rows={3} placeholder="Add a personalized note (optional)" value={connectNote} onChange={e => setConnectNote(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[#0066FF] mb-4 text-sm" />
                            <div className="flex gap-3">
                                <button onClick={() => setIsConnectModalOpen(false)} className="flex-1 font-semibold text-gray-400 hover:text-gray-600">Cancel</button>
                                <button onClick={handleConnect} disabled={actionLoading} className="flex-[2] py-3 bg-[#0066FF] text-white font-semibold rounded-xl disabled:opacity-50">Send</button>
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
