import React, { useEffect, useState } from 'react';
import { listenToNotifications, markNotificationAsRead } from '../lib/notifications';
import { auth } from '../lib/firebase';
import type { Notification } from '../types';
import { useNavigate } from 'react-router-dom';
import {
    UserIcon,
    BriefcaseIcon,
    CheckCircleIcon,
    HeartIcon,
    ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;
        const unsubscribe = listenToNotifications(user.uid, (data) => {
            setNotifications(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            await markNotificationAsRead(notification.id);
        }

        switch (notification.type) {
            case 'connection_request':
            case 'connection_accepted':
                navigate(`/profile/${notification.senderId}`);
                break;
            case 'project_request':
            case 'project_approved':
            case 'project_invite':
                if (notification.projectId) {
                    navigate(`/projects`); // Ideally to specific project detail if available
                }
                break;
            case 'like':
            case 'comment':
            case 'repost':
                navigate('/'); // Go to feed for now
                break;
            default:
                break;
        }
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'connection_request':
            case 'connection_accepted':
                return <UserIcon className="h-6 w-6 text-blue-500" />;
            case 'project_request':
            case 'project_approved':
            case 'project_invite':
                return <BriefcaseIcon className="h-6 w-6 text-purple-500" />;
            case 'like':
                return <HeartIcon className="h-6 w-6 text-red-500" />;
            case 'comment':
                return <ChatBubbleLeftIcon className="h-6 w-6 text-green-500" />;
            default:
                return <CheckCircleIcon className="h-6 w-6 text-gray-500" />;
        }
    };

    const getMessage = (n: Notification) => {
        if (n.message) return n.message;
        switch (n.type) {
            case 'connection_request': return `sent you a connection request.`;
            case 'connection_accepted': return `accepted your connection request.`;
            case 'project_request': return `requested to join your project ${n.projectId ? '' : ''}.`;
            case 'project_approved': return `approved your request to join ${n.projectId ? 'the project' : 'a project'}.`;
            case 'like': return `liked your post.`;
            case 'comment': return `commented on your post.`;
            default: return 'New notification';
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 mt-16">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No notifications yet.
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 flex items-start gap-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                        >
                            <div className="mt-1">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">
                                    <span className="font-bold">{notification.senderName || 'Someone'}</span>{' '}
                                    {getMessage(notification)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {notification.createdAt?.toDate ? notification.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                </p>
                            </div>
                            {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
