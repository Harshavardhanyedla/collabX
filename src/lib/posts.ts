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
    getDocs,
    runTransaction
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
    const postRef = doc(db, 'posts', postId);
    const likeId = `${userId}_${postId}`;
    const likeRef = doc(db, 'likes', likeId);

    try {
        await runTransaction(db, async (transaction) => {
            const likeDoc = await transaction.get(likeRef);
            const postDoc = await transaction.get(postRef);

            if (!postDoc.exists()) {
                throw new Error("Post does not exist!");
            }

            const currentLikes = postDoc.data().likesCount || 0;

            if (likeDoc.exists()) {
                // Unlike
                transaction.delete(likeRef);
                transaction.update(postRef, {
                    likesCount: Math.max(0, currentLikes - 1)
                });
            } else {
                // Like
                transaction.set(likeRef, {
                    postId,
                    userId,
                    createdAt: serverTimestamp()
                });
                transaction.update(postRef, {
                    likesCount: currentLikes + 1
                });
            }
        });
    } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
    }
};

export const getUserLikes = async (userId: string) => {
    try {
        const q = query(collection(db, 'likes'), where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data().postId);
    } catch (error) {
        console.error("Error fetching user likes:", error);
        return [];
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
