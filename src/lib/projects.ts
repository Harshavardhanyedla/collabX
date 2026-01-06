import { db } from './firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import type { Project } from '../types';

export const addProject = async (userId: string, projectData: Omit<Project, 'id' | 'userId' | 'createdAt'>) => {
    try {
        const docRef = await addDoc(collection(db, 'projects'), {
            ...projectData,
            userId,
            createdAt: Timestamp.now()
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
            updatedAt: Timestamp.now()
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

export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
    try {
        const q = query(
            collection(db, 'projects'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Project));
    } catch (error) {
        console.error("Error fetching user projects:", error);
        throw error;
    }
};
