import React, { useEffect, useState, useRef } from 'react';
import { listenToMessages, sendMessage, markMessageAsRead } from '../../lib/messaging';
import type { Message, UserProfile } from '../../types';
import MessageBubble from './MessageBubble';
import { PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import { auth } from '../../lib/firebase';

interface ChatWindowProps {
    conversationId: string;
    partner: UserProfile;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, partner }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setLoading(true);
        const unsubscribe = listenToMessages(conversationId, (msgs) => {
            setMessages(msgs);
            setLoading(false);

            // Mark last message as read if it's not from me
            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg && lastMsg.senderId !== auth.currentUser?.uid && !lastMsg.read) {
                markMessageAsRead(conversationId, lastMsg.id);
            }
        });

        return () => unsubscribe();
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await sendMessage(conversationId, newMessage.trim());
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        // Implement throttling for typing status if needed
        // setTypingStatus(conversationId, true);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="h-16 border-b border-gray-100 flex items-center px-6 justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                        <img
                            src={partner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.name}`}
                            alt={partner.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">{partner.name}</h3>
                        <p className="text-xs text-green-500 font-medium">Online</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {loading ? (
                    <div className="flex justify-center pt-10">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {messages.map((msg, idx) => {
                            const prevMsg = messages[idx - 1];
                            const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
                            return (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    showAvatar={showAvatar}
                                    senderName={partner.name}
                                    senderAvatar={partner.avatar}
                                />
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
                <form onSubmit={handleSend} className="flex gap-2 items-center bg-gray-50 rounded-2xl px-2 py-2 border border-gray-100 focus-within:border-blue-100 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <PaperClipIcon className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-400 py-2"
                    />
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <FaceSmileIcon className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-[#0066FF] text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
