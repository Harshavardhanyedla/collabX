import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
    BookmarkIcon,
    BriefcaseIcon,
    UserGroupIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

const LeftSidebar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    if (!user) return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-14 bg-gradient-to-r from-blue-400 to-[#0066FF]"></div>
            <div className="px-4 pb-4 -mt-7 text-center">
                <div className="w-16 h-16 rounded-full border-2 border-white bg-blue-50 mx-auto flex items-center justify-center text-blue-500 font-bold text-xl">
                    ?
                </div>
                <div className="mt-4">
                    <h3 className="font-bold text-gray-900">Welcome to CollabX!</h3>
                    <p className="text-xs text-gray-500 mt-1">Sign in to start collaborating</p>
                </div>
                <button className="w-full mt-4 py-2 border-2 border-[#0066FF] text-[#0066FF] rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors">
                    Sign In
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-2">
            {/* User Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="h-14 bg-gradient-to-r from-blue-400 to-[#0066FF]"></div>
                <div className="px-4 pb-4 -mt-8 text-center border-b border-gray-100">
                    <Link to="/profile">
                        <div className="w-17 h-17 rounded-full border-2 border-white bg-blue-100 mx-auto flex items-center justify-center text-[#0066FF] font-bold text-2xl overflow-hidden hover:opacity-90 transition-opacity">
                            {user.email?.[0].toUpperCase()}
                        </div>
                    </Link>
                    <div className="mt-4">
                        <Link to="/profile" className="font-bold text-gray-900 hover:underline">
                            {user.displayName || user.email?.split('@')[0]}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{user.role || 'Student & Aspiring Developer at CollabX'}</p>
                    </div>
                </div>

                <div className="py-3">
                    <div className="px-4 py-1 hover:bg-gray-100 cursor-pointer transition-colors group">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 group-hover:text-gray-700">Profile viewers</span>
                            <span className="text-[#0066FF] font-bold">{(user as any).stats?.profileViews || 0}</span>
                        </div>
                    </div>
                    <div className="px-4 py-1 hover:bg-gray-100 cursor-pointer transition-colors group">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 group-hover:text-gray-700">Project views</span>
                            <span className="text-[#0066FF] font-bold">{(user as any).stats?.projectViews || 0}</span>
                        </div>
                    </div>
                </div>

                <Link to="/saved" className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 hover:bg-gray-100 transition-colors">
                    <BookmarkIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-bold text-gray-800">My Items</span>
                </Link>
            </div>

            {/* Communities/Pages Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm sticky top-20">
                <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-900">Recent</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Link to="/projects" className="flex items-center gap-2 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded cursor-pointer group">
                            <BriefcaseIcon className="h-4 w-4" />
                            <span className="group-hover:text-gray-800 truncate">Popular Projects</span>
                        </Link>
                        <Link to="/students" className="flex items-center gap-2 text-xs text-gray-500 hover:bg-gray-100 p-1 rounded cursor-pointer group">
                            <UserGroupIcon className="h-4 w-4" />
                            <span className="group-hover:text-gray-800 truncate">Student Network</span>
                        </Link>
                    </div>

                    <div className="mt-4 mb-2">
                        <span className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer">Groups</span>
                    </div>
                    <div className="mt-4 mb-2 flex items-center justify-between font-bold text-[#0066FF] hover:underline cursor-pointer">
                        <span className="text-xs">Events</span>
                        <PlusIcon className="h-4 w-4 text-gray-600 hover:bg-gray-100 rounded p-0.5" />
                    </div>
                    <div className="mt-4 mb-2">
                        <span className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer">Followed Hashtags</span>
                    </div>
                </div>
                <div className="border-t border-gray-100 p-3 text-center hover:bg-gray-100 cursor-pointer transition-colors">
                    <span className="text-sm font-bold text-gray-500">Discover more</span>
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;
