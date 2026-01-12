import React, { useEffect, useState } from 'react';
import { listenToConversations } from '../../lib/messaging';
import { getUserProfile } from '../../lib/profiles';
import type { Conversation, UserProfile } from '../../types';
import { auth } from '../../lib/firebase';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
    onSelectConversation: (id: string, partner: UserProfile) => void;
    selectedConversationId?: string;
}

interface EnrichedConversation extends Conversation {
    partner: UserProfile | null;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelectConversation, selectedConversationId }) => {
    const [conversations, setConversations] = useState<EnrichedConversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) return;

        const unsubscribe = listenToConversations(async (convs) => {
            const enriched = await Promise.all(convs.map(async (conv) => {
                const partnerId = conv.participants.find(p => p !== auth.currentUser?.uid);
                if (!partnerId) return { ...conv, partner: null };

                try {
                    const partner = await getUserProfile(partnerId);
                    return { ...conv, partner };
                } catch {
                    return { ...conv, partner: null };
                }
            }));

            setConversations(enriched.filter(c => c.partner !== null));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>No messages yet.</p>
                <p className="text-sm mt-2">Connect with students to start chatting!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    onClick={() => conv.partner && onSelectConversation(conv.id, conv.partner)}
                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversationId === conv.id ? 'bg-blue-50/50 hover:bg-blue-50' : ''
                        }`}
                >
                    <div className="flex gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                                <img
                                    src={conv.partner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.partner?.name}`}
                                    alt={conv.partner?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Simple online indicator placeholder - would require real presence system */}
                            {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div> */}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-semibold text-sm truncate ${conv.lastMessage && !conv.lastMessage.read && conv.lastMessage.senderId !== auth.currentUser?.uid
                                        ? 'text-black' : 'text-gray-900'
                                    }`}>
                                    {conv.partner?.name}
                                </h3>
                                {conv.updatedAt && (
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                        {formatDistanceToNow(new Date(conv.updatedAt.seconds * 1000), { addSuffix: false })}
                                    </span>
                                )}
                            </div>
                            <p className={`text-xs truncate ${conv.lastMessage && !conv.lastMessage.read && conv.lastMessage.senderId !== auth.currentUser?.uid
                                    ? 'font-bold text-gray-900' : 'text-gray-500'
                                }`}>
                                {conv.lastMessage?.senderId === auth.currentUser?.uid ? 'You: ' : ''}
                                {conv.lastMessage?.content || 'Started a conversation'}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConversationList;
