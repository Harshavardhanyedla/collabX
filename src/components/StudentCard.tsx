import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { UserProfile } from '../types';
import { fetchConnectionStatus, sendConnectionRequest } from '../lib/networking';
import { auth } from '../lib/firebase';

interface StudentCardProps {
    student: UserProfile;
    onClick: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
    const [status, setStatus] = useState<'none' | 'pending' | 'received' | 'connected'>('none');
    const [loading, setLoading] = useState(false);
    const currentUser = auth.currentUser;

    useEffect(() => {
        const getStatus = async () => {
            if (currentUser && currentUser.uid !== student.uid) {
                try {
                    const s = await fetchConnectionStatus(student.uid);
                    setStatus(s as 'none' | 'pending' | 'received' | 'connected');
                } catch (err) {
                    console.error("Error fetching status:", err);
                }
            }
        };
        getStatus();
    }, [student.uid, currentUser]);

    const handleConnect = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) return;

        setLoading(true);
        try {
            await sendConnectionRequest(student.uid);
            setStatus('pending');
        } catch (error) {
            const err = error as Error;
            console.error("Error connecting:", err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getButtonText = () => {
        if (loading) return '...';
        switch (status) {
            case 'pending': return 'Pending';
            case 'received': return 'Accept';
            case 'connected': return 'Connected';
            default: return 'Connect';
        }
    };

    const isInteractionDisabled = status === 'pending' || status === 'connected' || student.uid === currentUser?.uid;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"
            onClick={onClick}
        >
            {/* Banner Section */}
            <div className="w-full h-20 bg-gradient-to-r from-[#0066FF]/10 to-[#5865F2]/10 relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                        <img
                            src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                            alt={student.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="pt-12 pb-5 px-4 flex flex-col items-center flex-grow w-full">
                <h3 className="font-bold text-[#0f172a] text-lg line-clamp-1">{student.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 h-8 mb-1 px-2">
                    {student.headline || student.role}
                </p>

                <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-3 uppercase tracking-wider font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.534 50.534 0 00-2.658.813m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                    {student.institution || 'University'}
                </div>

                {student.mutualConnectionsCount !== undefined && student.mutualConnectionsCount > 0 && (
                    <div className="text-[10px] text-gray-400 mb-4 flex items-center gap-1">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-4 h-4 rounded-full border border-white bg-gray-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${student.uid}${i}`} alt="" className="w-full h-full" />
                                </div>
                            ))}
                        </div>
                        <span>{student.mutualConnectionsCount} mutual connections</span>
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-1 mb-5 h-10 overflow-hidden items-start w-full">
                    {student.skills?.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[9px] font-bold rounded-md border border-gray-100 uppercase">
                            {skill}
                        </span>
                    ))}
                    {student.skills?.length > 3 && (
                        <span className="px-2 py-0.5 text-gray-400 text-[9px] font-bold">
                            +{student.skills.length - 3}
                        </span>
                    )}
                </div>

                <div className="flex gap-2 w-full mt-auto">
                    <button
                        onClick={handleConnect}
                        disabled={isInteractionDisabled || loading}
                        className={`flex-1 py-1.5 rounded-full font-bold text-xs transition-colors border ${status === 'connected'
                            ? 'bg-gray-100 text-gray-500 border-transparent cursor-not-allowed'
                            : status === 'pending'
                                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white'
                            }`}
                    >
                        {getButtonText()}
                    </button>
                    <button className="flex-1 py-1.5 rounded-full border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors">
                        View Profile
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentCard;
