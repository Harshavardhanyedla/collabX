import React from 'react';
import {
    PlusIcon,
    ArrowRightIcon,
    InformationCircleIcon
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const RightSidebar: React.FC = () => {
    const navigate = useNavigate();

    const [students, setStudents] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Dynamic import to avoid SSR issues if any, though likely client side
                const { collection, getDocs, query, limit } = await import('firebase/firestore');
                const { db, auth } = await import('../lib/firebase');

                const q = query(collection(db, 'users'), limit(5));
                const querySnapshot = await getDocs(q);

                const fetchedStudents: any[] = [];
                const currentUserId = auth.currentUser?.uid;

                querySnapshot.forEach((doc) => {
                    if (doc.id !== currentUserId) {
                        fetchedStudents.push({ ...doc.data(), uid: doc.id });
                    }
                });

                setStudents(fetchedStudents.slice(0, 3));
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const resourcePreview = [
        { title: 'Cybersecurity', icon: '🔒', desc: 'Ethical Hacking, Web Security' },
        { title: 'Data & AI', icon: '🤖', desc: 'ML, Deep Learning, MLOps' },
        { title: 'Web Development', icon: '💻', desc: 'Frontend, Backend, DevOps' },
    ];

    return (
        <div className="flex flex-col gap-2">
            {/* Student Network Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">Student Network</h3>
                    <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
                </div>

                <div className="flex flex-col gap-4">
                    {loading ? (
                        // Simple Skeleton
                        [1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0"></div>
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))
                    ) : students.length > 0 ? (
                        students.map((person, idx) => (
                            <div key={idx} className="flex gap-3">
                                {person.avatar ? (
                                    <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-[#0066FF] font-bold text-xs uppercase">
                                        {person.name?.[0] || '?'}
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1">
                                        <span
                                            className="font-bold text-sm text-gray-900 truncate hover:text-[#0066FF] hover:underline cursor-pointer"
                                            onClick={() => navigate(`/profile/${person.uid}`)}
                                        >
                                            {person.name}
                                        </span>
                                        {/* Verification badge can be added if we have a field for it */}
                                    </div>
                                    <span className="text-xs text-gray-500 truncate">
                                        {person.role || 'Student'}
                                        {(person.college || person.institution) && ` at ${person.college || person.institution}`}
                                    </span>
                                    <button
                                        className="mt-1.5 flex items-center justify-center gap-1 px-3 py-1 border border-gray-500 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-50 hover:border-gray-800 transition-colors w-24"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                        <span>Connect</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-sm text-gray-500">
                            No students found yet.
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-2 border-t border-gray-50">
                    <button
                        onClick={() => navigate('/students')}
                        className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors w-full group"
                    >
                        <span className="text-sm font-bold group-hover:text-gray-700">View all students</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Learning Resources Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm sticky top-20">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">Learning Resources</h3>
                    <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex flex-col gap-3">
                    {resourcePreview.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate('/resources')}
                            className="group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-lg">
                                {item.icon}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#0066FF]">{item.title}</h4>
                                <span className="text-[11px] text-gray-500">{item.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-50">
                    <button
                        onClick={() => navigate('/resources')}
                        className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors w-full group"
                    >
                        <span className="text-sm font-bold group-hover:text-gray-700">Explore all resources</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="mt-4 text-[11px] text-gray-400 flex flex-wrap justify-center gap-x-3 gap-y-1">
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">About</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Privacy</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Terms</span>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#0066FF] flex items-center justify-center text-white text-[8px] font-bold">X</div>
                    <span className="text-xs text-gray-500">CollabX © 2024</span>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
