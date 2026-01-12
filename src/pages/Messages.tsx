import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import type { UserProfile } from '../types';

const Messages: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const conversationId = searchParams.get('conversationId');

    // State to hold the "active" conversation details
    const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationId);
    const [activePartner, setActivePartner] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (conversationId) {
            setActiveConversationId(conversationId);
            // In a real app we might fetch the partner here if we just have the ID from URL
            // But usually the list handles selection. 
            // If deeper linking is needed, we'd need to fetch conversation details by ID -> get participants -> get partner profile.
        }
    }, [conversationId]);

    const handleSelectConversation = (id: string, partner: UserProfile) => {
        setActiveConversationId(id);
        setActivePartner(partner);
        setSearchParams({ conversationId: id });
    };

    return (
        <div className="h-[calc(100vh-64px)] bg-gray-50 flex overflow-hidden">
            {/* Sidebar - Conversation List */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h1 className="font-bold text-xl text-gray-900">Messages</h1>
                    {/* <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <PencilSquareIcon className="w-5 h-5" />
                    </button> */}
                </div>

                {/* Search (Placeholder) */}
                <div className="p-4 pt-0 mt-4">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
                    />
                </div>

                <div className="flex-1 overflow-hidden">
                    <ConversationList
                        onSelectConversation={handleSelectConversation}
                        selectedConversationId={activeConversationId || undefined}
                    />
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
                {activeConversationId && activePartner ? (
                    <>
                        {/* Mobile Back Button Header */}
                        <div className="md:hidden h-16 border-b border-gray-100 flex items-center px-4 bg-white">
                            <button
                                onClick={() => {
                                    setActiveConversationId(null);
                                    setActivePartner(null);
                                    setSearchParams({});
                                }}
                                className="mr-3 text-gray-600 p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <h3 className="font-bold">Back</h3>
                        </div>
                        <ChatWindow
                            conversationId={activeConversationId}
                            partner={activePartner}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300 bg-gray-50/50">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                        </div>
                        <p className="font-medium">Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
