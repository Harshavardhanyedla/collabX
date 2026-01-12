import { db } from './firebase';
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import type { UserProfile } from '../types';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { uid, ...docSnap.data() } as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
};

export const updateProfile = async (uid: string, profileData: Partial<UserProfile>) => {
    try {
        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, {
            ...profileData,
            lastActive: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

export const initializeProfile = async (uid: string, email: string, name: string) => {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            await setDoc(docRef, {
                uid,
                email,
                name,
                college: '',
                role: 'Student',
                skills: [],
                stats: {
                    followers: 0,
                    projects: 0,
                    connections: 0
                },
                createdAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error("Error initializing profile:", error);
    }
};
