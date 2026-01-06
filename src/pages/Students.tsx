import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '../types';
import StudentCard from '../components/StudentCard';
import StudentFilters from '../components/StudentFilters';

const Students: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ institution: '', role: '' });
    const [sortBy, setSortBy] = useState('recent');
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Fetch current user for context-based sorting
                const user = auth.currentUser;
                if (user) {
                    const profileRef = doc(db, 'users', user.uid);
                    const profileSnap = await getDoc(profileRef);
                    if (profileSnap.exists()) {
                        setCurrentUserProfile(profileSnap.data() as UserProfile);
                    }
                }

                const querySnapshot = await getDocs(collection(db, 'users'));
                const studentList: UserProfile[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data() as UserProfile;
                    // Don't show current user in discovery
                    if (doc.id !== user?.uid) {
                        // Ensure uid is explicitly set from doc.id, overwriting if data already had one
                        studentList.push({ ...data, uid: doc.id });
                    }
                });
                setStudents(studentList);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = useMemo(() => {
        return students
            .filter(pc => {
                const searchLower = searchQuery.toLowerCase();
                const matchesSearch =
                    pc.name.toLowerCase().includes(searchLower) ||
                    pc.role.toLowerCase().includes(searchLower) ||
                    (pc.headline && pc.headline.toLowerCase().includes(searchLower)) ||
                    pc.skills?.some(skill => skill.toLowerCase().includes(searchLower));

                const matchesInstitution = !filters.institution || pc.institution === filters.institution;
                const matchesRole = !filters.role || pc.role.toLowerCase().includes(filters.role.toLowerCase());

                return matchesSearch && matchesInstitution && matchesRole;
            })
            .sort((a, b) => {
                if (sortBy === 'connections') {
                    return (b.connectionCount || 0) - (a.connectionCount || 0);
                }
                if (sortBy === 'university' && currentUserProfile?.institution) {
                    const aSame = a.institution === currentUserProfile.institution ? 1 : 0;
                    const bSame = b.institution === currentUserProfile.institution ? 1 : 0;
                    return bSame - aSame;
                }
                // 'recent' fallback (mocking recent by UID for now, or createdAt if exists)
                return 0;
            });
    }, [students, searchQuery, filters, sortBy, currentUserProfile]);

    const StudentSkeleton = () => (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm p-4 h-[320px] animate-pulse">
            <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-4 mt-8"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto mb-6"></div>
            <div className="h-8 bg-gray-100 rounded-full w-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
            <div className="container-custom mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4">Network & Collaborate</h1>
                    <p className="text-gray-500 text-lg">
                        Connect with ambitious students from top universities and build your community.
                    </p>
                </div>

                <StudentFilters
                    onSearchChange={setSearchQuery}
                    onFilterChange={(type, val) => setFilters(prev => ({ ...prev, [type]: val }))}
                    onSortChange={setSortBy}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <StudentSkeleton key={i} />)
                    ) : (
                        <AnimatePresence>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <StudentCard
                                        key={student.uid}
                                        student={student}
                                        onClick={() => navigate(`/profile/${student.uid}`)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0f172a] mb-2">No students found</h3>
                                    <p className="text-gray-500">Try adjusting your filters or search query.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Students;
