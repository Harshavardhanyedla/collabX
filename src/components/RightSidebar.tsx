import React, { useState, useEffect } from 'react';
import {
    PlusIcon,
    ArrowRightIcon,
    InformationCircleIcon
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import type { UserProfile } from '../types';
import { sendConnectionRequest, fetchConnectionStatusData } from '../lib/networking';

const RightSidebar: React.FC = () => {
    const navigate = useNavigate();
    const [suggestedStudents, setSuggestedStudents] = useState<UserProfile[]>([]);
    const [connectionStates, setConnectionStates] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const user = auth.currentUser;
                const usersRef = collection(db, 'users');
                // Fetch a few more than needed to handle filtering self
                const q = query(usersRef, limit(5));
                const snapshot = await getDocs(q);

                const validUsers: UserProfile[] = [];
                for (const doc of snapshot.docs) {
                    const userData = doc.data() as UserProfile;
                    // Exclude current user
                    if (user && userData.uid === user.uid) continue;

                    // Simple check to ensure basic data exists
                    if (userData.name) {
                        validUsers.push(userData);
                    }
                }

                setSuggestedStudents(validUsers.slice(0, 3));

                // Fetch connection statuses
                if (user) {
                    const states: { [key: string]: string } = {};
                    for (const u of validUsers.slice(0, 3)) {
                        const { status } = await fetchConnectionStatusData(u.uid);
                        states[u.uid] = status;
                    }
                    setConnectionStates(states);
                }

            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };
        fetchSuggestions();
    }, []);

    const handleConnect = async (targetId: string) => {
        if (!auth.currentUser) return navigate('/login');
        if (connectionStates[targetId] !== 'none') return;

        try {
            await sendConnectionRequest(targetId);
            setConnectionStates(prev => ({ ...prev, [targetId]: 'pending' }));
        } catch (error) {
            console.error("Connection request failed:", error);
        }
    };

    const resourcePreview = [
        { title: 'Cybersecurity', icon: '🔒', desc: 'Ethical Hacking, Web Security' },
        { title: 'Data & AI', icon: '🤖', desc: 'ML, Deep Learning, MLOps' },
        { title: 'Web Development', icon: '💻', desc: 'Frontend, Backend, DevOps' },
    ];

    return (
        <div className="flex flex-col gap-2">
            {/* Student Network Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">Student Network</h3>
                    <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
                </div>

                <div className="flex flex-col gap-4">
                    {suggestedStudents.length > 0 ? (
                        suggestedStudents.map((person) => (
                            <div key={person.uid} className="flex gap-3">
                                <div
                                    className="w-10 h-10 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-[#0066FF] font-bold text-xs uppercase cursor-pointer"
                                    onClick={() => navigate(`/profile/${person.uid}`)}
                                >
                                    {person.avatar ? (
                                        <img src={person.avatar} alt={person.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        person.name?.[0] || 'U'
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="font-bold text-sm text-gray-900 truncate hover:text-[#0066FF] hover:underline cursor-pointer"
                                            onClick={() => navigate(`/profile/${person.uid}`)}
                                        >
                                            {person.name}
                                        </span>
                                        {/* Simple verification check if needed, strictly mock for now unless user has field */}
                                        {/* {person.verified && <CheckBadgeIcon className="h-3.5 w-3.5 text-[#0066FF]" />} */}
                                    </div>
                                    <span className="text-xs text-gray-500 truncate">{person.role || 'Student'} {person.college ? `at ${person.college}` : ''}</span>

                                    <button
                                        onClick={() => handleConnect(person.uid)}
                                        disabled={connectionStates[person.uid] !== 'none' && connectionStates[person.uid] !== undefined}
                                        className={`mt-1.5 flex items-center justify-center gap-1 px-3 py-1 border rounded-full text-sm font-bold transition-colors w-24 ${connectionStates[person.uid] === 'pending'
                                            ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-default'
                                            : connectionStates[person.uid] === 'connected'
                                                ? 'bg-green-50 text-green-600 border-green-200 cursor-default'
                                                : 'border-gray-500 text-gray-600 hover:bg-gray-50 hover:border-gray-800'
                                            }`}
                                    >
                                        {connectionStates[person.uid] === 'pending' ? (
                                            <span>Pending</span>
                                        ) : connectionStates[person.uid] === 'connected' ? (
                                            <span>Friends</span>
                                        ) : (
                                            <>
                                                <PlusIcon className="h-4 w-4" />
                                                <span>Connect</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-xs text-gray-500">
                            Loading suggestions...
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-2 border-t border-gray-50">
                    <button
                        onClick={() => navigate('/students')}
                        className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors w-full group"
                    >
                        <span className="text-sm font-bold group-hover:text-gray-700">View all students</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Learning Resources Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm sticky top-20">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">Learning Resources</h3>
                    <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex flex-col gap-3">
                    {resourcePreview.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate('/resources')}
                            className="group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-lg">
                                {item.icon}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#0066FF]">{item.title}</h4>
                                <span className="text-[11px] text-gray-500">{item.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-50">
                    <button
                        onClick={() => navigate('/resources')}
                        className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors w-full group"
                    >
                        <span className="text-sm font-bold group-hover:text-gray-700">Explore all resources</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="mt-4 text-[11px] text-gray-400 flex flex-wrap justify-center gap-x-3 gap-y-1">
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">About</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Privacy</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Terms</span>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#0066FF] flex items-center justify-center text-white text-[8px] font-bold">X</div>
                    <span className="text-xs text-gray-500">CollabX © 2024</span>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
