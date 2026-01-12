import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '../types';
import StudentCard from '../components/StudentCard';
import StudentFilters from '../components/StudentFilters';
import MainLayout from '../components/MainLayout';
import { UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
                    if (doc.id !== user?.uid) {
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

                const matchesInstitution = !filters.institution || (pc.college === filters.institution || pc.institution === filters.institution);
                const matchesRole = !filters.role || pc.role.toLowerCase().includes(filters.role.toLowerCase());

                return matchesSearch && matchesInstitution && matchesRole;
            })
            .sort((a, b) => {
                if (sortBy === 'connections') {
                    return (b.stats?.connections || 0) - (a.stats?.connections || 0);
                }
                if (sortBy === 'university' && (currentUserProfile?.college || currentUserProfile?.institution)) {
                    const myCollege = currentUserProfile?.college || currentUserProfile?.institution;
                    const aSame = (a.college === myCollege || a.institution === myCollege) ? 1 : 0;
                    const bSame = (b.college === myCollege || b.institution === myCollege) ? 1 : 0;
                    return bSame - aSame;
                }
                return 0;
            });
    }, [students, searchQuery, filters, sortBy, currentUserProfile]);

    const StudentSkeleton = () => (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm p-4 h-[320px] animate-pulse">
            <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-4 mt-8"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto mb-6"></div>
            <div className="h-8 bg-gray-100 rounded-full w-full"></div>
        </div>
    );

    return (
        <MainLayout>
            <div className="flex flex-col gap-4">
                {/* Discovery Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg text-[#0066FF]">
                            <UserGroupIcon className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#0f172a]">Network Discovery</h1>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Connect with ambitious students from top universities and build your community.
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-[72px] z-10">
                    <StudentFilters
                        onSearchChange={setSearchQuery}
                        onFilterChange={(type, val) => setFilters(prev => ({ ...prev, [type]: val }))}
                        onSortChange={setSortBy}
                    />
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <StudentSkeleton key={i} />)
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
                                <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-200">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0f172a] mb-2">No students found</h3>
                                    <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Students;
