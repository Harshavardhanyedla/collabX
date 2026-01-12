import React from 'react';
import { format } from 'date-fns';
import type { Message } from '../../types';
import { auth } from '../../lib/firebase';

interface MessageBubbleProps {
    message: Message;
    showAvatar?: boolean;
    senderName?: string;
    senderAvatar?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, showAvatar, senderName, senderAvatar }) => {
    const isMe = message.senderId === auth.currentUser?.uid;

    return (
        <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {!isMe && showAvatar && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 border border-gray-100">
                    <img
                        src={senderAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName || 'User'}`}
                        alt={senderName}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            {!isMe && !showAvatar && <div className="w-10" />} {/* Spacer */}

            <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                    className={`px-4 py-2 rounded-2xl text-sm ${isMe
                        ? 'bg-[#0066FF] text-white rounded-br-none'
                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
                        }`}
                >
                    {message.content}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-gray-400">
                        {message.createdAt?.seconds
                            ? format(new Date(message.createdAt.seconds * 1000), 'h:mm a')
                            : 'Just now'}
                    </span>
                    {isMe && (
                        <span className="text-[10px] text-gray-400">
                            {message.read ? '• Read' : '• Sent'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
