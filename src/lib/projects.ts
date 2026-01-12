import { db, auth } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    getDocs,
    getDoc,
    orderBy,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    deleteDoc
} from 'firebase/firestore';
import type { Project } from '../types';

export const addProject = async (ownerId: string, projectData: Omit<Project, 'id' | 'ownerId' | 'createdAt' | 'members' | 'pendingRequests'>) => {
    try {
        const docRef = await addDoc(collection(db, 'projects'), {
            ...projectData,
            ownerId,
            members: [ownerId],
            pendingRequests: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding project:", error);
        throw error;
    }
};

export const updateProject = async (projectId: string, projectData: Partial<Project>) => {
    try {
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
            ...projectData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
};

export const deleteProject = async (projectId: string) => {
    try {
        await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};

export const requestToJoinProject = async (projectId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to join projects");

    try {
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
            pendingRequests: arrayUnion(user.uid)
        });

        const projectSnap = await getDoc(projectRef);
        const projectData = projectSnap.data();

        if (projectData) {
            await addDoc(collection(db, 'notifications'), {
                recipientId: projectData.ownerId,
                senderId: user.uid,
                type: 'project_request',
                projectId,
                projectName: projectData.title,
                read: false,
                createdAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error("Error requesting to join project:", error);
        throw error;
    }
};

export const approveJoinRequest = async (projectId: string, userId: string) => {
    try {
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
            members: arrayUnion(userId),
            pendingRequests: arrayRemove(userId)
        });

        const projectSnap = await getDoc(projectRef);
        const projectData = projectSnap.data();

        if (projectData) {
            await addDoc(collection(db, 'notifications'), {
                recipientId: userId,
                senderId: auth.currentUser?.uid,
                type: 'project_approved',
                projectId,
                projectName: projectData.title,
                read: false,
                createdAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error("Error approving join request:", error);
        throw error;
    }
};

export const rejectJoinRequest = async (projectId: string, userId: string) => {
    try {
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, {
            pendingRequests: arrayRemove(userId)
        });
    } catch (error) {
        console.error("Error rejecting join request:", error);
        throw error;
    }
};

export const fetchAllProjects = async () => {
    try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

export const fetchUserProjects = async (userId: string) => {
    try {
        const q = query(
            collection(db, 'projects'),
            where('members', 'array-contains', userId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
        console.error("Error fetching user projects:", error);
        return [];
    }
};
