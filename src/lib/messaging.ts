import { db, auth } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    setDoc,
    limit,
    getDoc
} from 'firebase/firestore';
import type { Conversation, Message } from '../types';

// Create or get existing conversation
export const getOrCreateConversation = async (otherUserId: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // 1. Check if conversation exists
    // Note: Firestore doesn't support array-contains-any for exact match of array content easily without composite keys or logic.
    // Ideally we store a composite key or use a separate collection for mapping. 
    // For simplicity/scale, we query where 'participants' array-contains user.uid, then filter client side (or use a better structure).
    // Better approach for scaling: create a deterministic ID based on sorted UIDs.
    const sortedIds = [user.uid, otherUserId].sort();
    const conversationId = sortedIds.join('_');

    const convRef = doc(db, 'conversations', conversationId);
    const convSnap = await getDoc(convRef);

    if (convSnap.exists()) {
        return conversationId;
    }

    // 2. Create new if not exists
    await setDoc(convRef, {
        id: conversationId,
        participants: sortedIds,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        isTyping: {}
    });

    return conversationId;
};

// Send a message
export const sendMessage = async (
    conversationId: string,
    content: string,
    type: 'text' | 'image' | 'file' = 'text',
    attachments?: Message['attachments']
) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const convRef = doc(db, 'conversations', conversationId);

    // Add message
    await addDoc(messagesRef, {
        conversationId,
        senderId: user.uid,
        content,
        type,
        attachments: attachments || [],
        createdAt: serverTimestamp(),
        read: false
    });

    // Update parent conversation
    await updateDoc(convRef, {
        lastMessage: {
            content,
            senderId: user.uid,
            createdAt: serverTimestamp(),
            type,
            read: false
        },
        updatedAt: serverTimestamp()
    });
};

// Listen to conversations list
export const listenToConversations = (callback: (conversations: Conversation[]) => void) => {
    const user = auth.currentUser;
    if (!user) return () => { };

    const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', user.uid),
        orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Conversation));
        callback(conversations);
    });
};

// Listen to messages in a conversation
export const listenToMessages = (conversationId: string, callback: (messages: Message[]) => void) => {
    const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(100)
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Message));
        callback(messages);
    });
};

// Mark message as read
export const markMessageAsRead = async (conversationId: string, messageId: string) => {
    const msgRef = doc(db, 'conversations', conversationId, 'messages', messageId);
    await updateDoc(msgRef, {
        read: true,
        readAt: serverTimestamp()
    });
};

// Mark entire conversation as read (optional helper)
export const markConversationAsRead = async (conversationId: string) => {
    // Ideally update the specific messages, but for header badge, updating the conversation's lastMessage.read is fastest if I am the receiver
    // But better to loop through unread messages or query them.
    // For now, let's update the lastMessage read status if I am the recipient
    const user = auth.currentUser;
    if (!user) return;

    // This logic usually requires more complex backend or batch updates to be 100% accurate for all messages
    // We will implement simple "last message read" for the conversation list view
    const convRef = doc(db, 'conversations', conversationId);
    const convSnap = await getDoc(convRef);
    if (!convSnap.exists()) return;

    const data = convSnap.data() as Conversation;
    if (data.lastMessage && data.lastMessage.senderId !== user.uid && !data.lastMessage.read) {
        await updateDoc(convRef, {
            'lastMessage.read': true
        });
    }
};

// Set typing status
let typingTimeout: any;
export const setTypingStatus = async (conversationId: string, isTyping: boolean) => {
    const user = auth.currentUser;
    if (!user) return;

    const convRef = doc(db, 'conversations', conversationId);

    // Use dot notation to update specific user's typing status in the map
    await updateDoc(convRef, {
        [`isTyping.${user.uid}`]: isTyping
    });

    if (isTyping) {
        // Auto turn off after 3 seconds
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            setTypingStatus(conversationId, false);
        }, 3000);
    }
};
