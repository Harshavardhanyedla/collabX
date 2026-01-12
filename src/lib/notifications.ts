import { db } from './firebase';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
    serverTimestamp,
    addDoc,
    limit
} from 'firebase/firestore';
import type { Notification } from '../types';

export const listenToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
    const q = query(
        collection(db, 'notifications'),
        where('recipientId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
    );
    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Notification));
        callback(notifications);
    });
};

export const markNotificationAsRead = async (notificationId: string) => {
    try {
        await updateDoc(doc(db, 'notifications', notificationId), {
            read: true
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

export const createNotification = async (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
        await addDoc(collection(db, 'notifications'), {
            ...notif,
            read: false,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
