import { db, auth } from './firebase';
import {
    collection,
    query,
    where,
    getDocs,
    limit,
    orderBy
} from 'firebase/firestore';
import type { UserProfile, Project } from '../types';

export const getRealUserRecommendations = async (limitCount = 3): Promise<UserProfile[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const usersRef = collection(db, 'users');
        // Simple recommendation logic: get recent users who are not me
        // In a real app, this would involve mutual connections or interests
        const q = query(
            usersRef,
            where('uid', '!=', user.uid),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return [];
    }
};

export const getTrendingContent = async () => {
    try {
        // Fetch trending projects (most recent for now, could be most liked)
        const projectsRef = collection(db, 'projects');
        const qProjects = query(projectsRef, orderBy('createdAt', 'desc'), limit(3));
        const projectsSnap = await getDocs(qProjects);

        const trendingProjects = projectsSnap.docs.map(doc => ({
            title: `Project: ${doc.data().title}`,
            views: doc.data().stats?.projectViews || '0',
            time: 'Recently added'
        }));

        // Mock trending resources until we have view tracking for them
        const trendingResources = [
            { title: 'Resource: Mastering React 19', views: '3.4k', time: '1d ago' },
            { title: 'Guide: Python for Data Science', views: '2.1k', time: '2d ago' }
        ];

        return [...trendingProjects, ...trendingResources].slice(0, 3);
    } catch (error) {
        console.error("Error fetching trending content:", error);
        return [];
    }
};
