import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface UserProfile {
    uid: string;
    name: string;
    role: string;
    institution: string;
    avatar: string;
    skills: string[];
}

const Students: React.FC = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const studentList: UserProfile[] = [];
                querySnapshot.forEach((doc) => {
                    studentList.push({ uid: doc.id, ...doc.data() } as UserProfile);
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

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="container-custom mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-[#0f172a] mb-4">Discover Students</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Connect with fellow students, find collaborators, and grow your network.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {students.map((student) => (
                        <motion.div
                            key={student.uid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"
                            onClick={() => navigate(`/profile/${student.uid}`)}
                        >
                            {/* Banner Section */}
                            <div className="w-full h-20 bg-gradient-to-r from-[#0066FF]/20 to-[#5865F2]/20 relative">
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                                        <img
                                            src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                                            alt={student.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="pt-12 pb-6 px-4 flex flex-col items-center flex-grow w-full">
                                <h3 className="font-bold text-[#0f172a] text-lg line-clamp-1">{student.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-1 mb-1">{student.role}</p>

                                <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-4 uppercase tracking-wider font-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.534 50.534 0 00-2.658.813m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                    </svg>
                                    {student.institution || 'University'}
                                </div>

                                <div className="flex flex-wrap justify-center gap-1.5 mb-6 h-12 overflow-hidden items-start w-full">
                                    {student.skills?.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-md border border-gray-100 uppercase tracking-tighter">
                                            {skill}
                                        </span>
                                    ))}
                                    {student.skills?.length > 3 && (
                                        <span className="px-2 py-1 text-gray-400 text-[10px] font-bold">
                                            +{student.skills.length - 3}
                                        </span>
                                    )}
                                </div>

                                <button className="w-full py-2 rounded-full border border-[#0066FF] text-[#0066FF] font-bold text-sm hover:bg-[#0066FF]/5 transition-colors mt-auto">
                                    View Profile
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Students;
