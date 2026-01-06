import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchIncomingRequests, acceptConnectionRequest, ignoreConnectionRequest, type ConnectionRequest } from '../lib/networking';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface IncomingRequestsProps {
    onActionComplete: () => void;
}

const IncomingRequests: React.FC<IncomingRequestsProps> = ({ onActionComplete }) => {
    const [requests, setRequests] = useState<(ConnectionRequest & { requesterName?: string, requesterAvatar?: string })[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const incoming = await fetchIncomingRequests();
            const enhancedRequests = await Promise.all(incoming.map(async (req) => {
                const userDoc = await getDoc(doc(db, 'users', req.requesterId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    return { ...req, requesterName: userData.name, requesterAvatar: userData.avatar };
                }
                return req;
            }));
            setRequests(enhancedRequests);
        } catch (error) {
            console.error("Error loading incoming requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleAccept = async (id: string) => {
        try {
            await acceptConnectionRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
            onActionComplete();
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleIgnore = async (id: string) => {
        try {
            await ignoreConnectionRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
            onActionComplete();
        } catch (error) {
            console.error("Error ignoring request:", error);
        }
    };

    if (loading) return null;
    if (requests.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 p-8 mb-8"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                    Incoming Requests
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-md">{requests.length}</span>
                </h3>
            </div>
            <div className="space-y-4">
                {requests.map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex flex-col md:flex-row gap-4 items-center md:items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <img src={req.requesterAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.requesterId}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h4 className="font-bold text-gray-900">{req.requesterName || "Anonymous Student"}</h4>
                            {req.note && <p className="text-sm text-gray-500 italic mt-1 line-clamp-2">"{req.note}"</p>}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleIgnore(req.id!)}
                                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                Ignore
                            </button>
                            <button
                                onClick={() => handleAccept(req.id!)}
                                className="px-6 py-2 text-xs font-bold bg-[#0066FF] text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default IncomingRequests;
