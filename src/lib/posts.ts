import { db } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    increment,
    where,
    deleteDoc,
    getDocs
} from 'firebase/firestore';
import type { Post, Comment } from '../types';

export const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'repostsCount'>) => {
    try {
        const docRef = await addDoc(collection(db, 'posts'), {
            ...postData,
            likesCount: 0,
            commentsCount: 0,
            repostsCount: 0,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const listenToFeed = (callback: (posts: Post[]) => void) => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Post));
        callback(posts);
    });
};

export const toggleLike = async (postId: string, userId: string) => {
    try {
        const postRef = doc(db, 'posts', postId);

        // Using setDoc with composite ID for easy checking
        const existingLike = await getDocs(query(collection(db, 'likes'), where('postId', '==', postId), where('userId', '==', userId)));

        if (!existingLike.empty) {
            // Unlike
            await deleteDoc(doc(db, 'likes', existingLike.docs[0].id));
            await updateDoc(postRef, {
                likesCount: increment(-1)
            });
        } else {
            // Like
            await addDoc(collection(db, 'likes'), {
                postId,
                userId,
                createdAt: serverTimestamp()
            });
            await updateDoc(postRef, {
                likesCount: increment(1)
            });
        }
    } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
    }
};

export const addComment = async (postId: string, userId: string, userName: string, text: string, userAvatar?: string) => {
    try {
        await addDoc(collection(db, 'comments'), {
            postId,
            userId,
            userName,
            userAvatar,
            text,
            createdAt: serverTimestamp()
        });
        await updateDoc(doc(db, 'posts', postId), {
            commentsCount: increment(1)
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

export const listenToComments = (postId: string, callback: (comments: Comment[]) => void) => {
    const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Comment));
        callback(comments);
    });
};
