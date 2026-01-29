import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import AuthModal from './AuthModal';
import {
    HomeIcon,
    BriefcaseIcon,
    UsersIcon,
    BookOpenIcon,
    BellIcon,
    MagnifyingGlassIcon,
    ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeSolid,
    BriefcaseIcon as BriefcaseSolid,
    UsersIcon as UsersSolid,
    BookOpenIcon as BookOpenSolid,
    BellIcon as BellSolid
} from '@heroicons/react/24/solid';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const NavBar: React.FC = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Listen to Unread Notifications
    useEffect(() => {
        if (!user) {
            setUnreadNotifications(0);
            return;
        }
        const q = query(
            collection(db, 'notifications'),
            where('recipientId', '==', user.uid),
            where('read', '==', false)
        );
        const unsubscribe = onSnapshot(q, (snap) => {
            setUnreadNotifications(snap.size);
        });
        return () => unsubscribe();
    }, [user]);

    // Listen to Unread Messages
    useEffect(() => {
        if (!user) {
            setUnreadMessages(0);
            return;
        }
        const q = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', user.uid)
        );
        const unsubscribe = onSnapshot(q, (snap) => {
            let count = 0;
            snap.docs.forEach(doc => {
                const data = doc.data();
                if (data.lastMessage && data.lastMessage.senderId !== user.uid && data.lastMessage.read === false) {
                    count++;
                }
            });
            setUnreadMessages(count);
        });
        return () => unsubscribe();
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSearchCheck = () => {
        if (window.innerWidth < 1024) {
            navigate('/explore');
        }
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: HomeIcon, activeIcon: HomeSolid },
        { name: 'Projects', path: '/projects', icon: BriefcaseIcon, activeIcon: BriefcaseSolid },
        { name: 'Students', path: '/students', icon: UsersIcon, activeIcon: UsersSolid },
        { name: 'Resources', path: '/resources', icon: BookOpenIcon, activeIcon: BookOpenSolid },
        { name: 'Notifications', path: '/notifications', icon: BellIcon, activeIcon: BellSolid },
    ];

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    // Mobile Top Header
    const MobileHeader = () => (
        <div className="lg:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-50 h-16 px-4 flex items-center justify-between gap-3">
            <Link to="/" className="shrink-0">
                <div className="w-8 h-8 bg-[#0066FF] rounded-md flex items-center justify-center font-black text-white text-lg">
                    C
                </div>
            </Link>

            <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={handleSearchCheck}
                    className="block w-full pl-9 pr-3 py-2 bg-[#edf3f8] border-transparent rounded-full text-sm transition-all focus:bg-white focus:ring-1 focus:ring-blue-100 focus:w-full border"
                />
            </div>

            <div className="shrink-0 flex items-center gap-3">
                <Link to="/messages" className="relative text-gray-500">
                    <ChatBubbleLeftEllipsisIcon className="h-7 w-7" />
                    {unreadMessages > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                            {unreadMessages}
                        </span>
                    )}
                </Link>
                {user ? (
                    <Link to="/profile" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-xs overflow-hidden">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                        ) : (
                            user.displayName?.[0] || user.email?.[0] || 'U'
                        )}
                    </Link>
                ) : (
                    <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-bold text-[#0066FF]">
                        Join
                    </button>
                )}
            </div>
        </div>
    );

    // Mobile Bottom Nav
    const MobileBottomNav = () => (
        <div className="lg:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 h-16 pb-safe flex items-center justify-around px-2">
            {navLinks.map((link) => {
                const active = isActive(link.path);
                const Icon = active ? link.activeIcon : link.icon;
                return (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors ${active ? 'text-[#0066FF]' : 'text-gray-500'}`}
                    >
                        <div className="relative">
                            <Icon className="h-7 w-7" />
                            {link.name === 'Notifications' && unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                    {unreadNotifications}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium mt-1">{link.name}</span>
                    </Link>
                );
            })}
        </div>
    );

    return (
        <>
            {/* Desktop Navigation (Hidden on Mobile) */}
            <nav className="hidden lg:block fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Brand & Search */}
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                        <Link to="/" className="shrink-0 flex items-center gap-1">
                            <div className="w-8 h-8 bg-[#0066FF] rounded-md flex items-center justify-center font-black text-white text-lg">
                                C
                            </div>
                            <span className="text-xl font-black text-[#0066FF] tracking-tighter">CollabX</span>
                        </Link>

                        <div className="relative flex-1 ml-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-9 pr-3 py-1.5 bg-[#edf3f8] border-transparent rounded-md text-sm transition-all focus:bg-white focus:ring-1 focus:ring-gray-300 focus:w-full border"
                            />
                        </div>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="flex items-center h-full ml-auto">
                        <Link to="/" className={`flex flex-col items-center justify-center w-20 h-full border-b-2 transition-all group ${isActive('/') ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
                            {isActive('/') ? <HomeSolid className="h-6 w-6" /> : <HomeIcon className="h-6 w-6" />}
                            <span className="text-[10px] mt-0.5 font-medium">Home</span>
                        </Link>
                        <Link to="/projects" className={`flex flex-col items-center justify-center w-20 h-full border-b-2 transition-all group ${isActive('/projects') ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
                            {isActive('/projects') ? <BriefcaseSolid className="h-6 w-6" /> : <BriefcaseIcon className="h-6 w-6" />}
                            <span className="text-[10px] mt-0.5 font-medium">Projects</span>
                        </Link>
                        <Link to="/students" className={`flex flex-col items-center justify-center w-20 h-full border-b-2 transition-all group ${isActive('/students') ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
                            {isActive('/students') ? <UsersSolid className="h-6 w-6" /> : <UsersIcon className="h-6 w-6" />}
                            <span className="text-[10px] mt-0.5 font-medium">Students</span>
                        </Link>
                        <Link to="/resources" className={`flex flex-col items-center justify-center w-20 h-full border-b-2 transition-all group ${isActive('/resources') ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
                            {isActive('/resources') ? <BookOpenSolid className="h-6 w-6" /> : <BookOpenIcon className="h-6 w-6" />}
                            <span className="text-[10px] mt-0.5 font-medium">Resources</span>
                        </Link>

                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                        <Link to="/messages" className="flex flex-col items-center justify-center w-20 h-full text-gray-500 hover:text-gray-900 transition-all relative">
                            <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
                            <span className="text-[10px] mt-0.5 font-medium">Messaging</span>
                            {unreadMessages > 0 && (
                                <span className="absolute top-2 right-6 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                    {unreadMessages}
                                </span>
                            )}
                        </Link>

                        <Link to="/notifications" className="flex flex-col items-center justify-center w-20 h-full text-gray-500 hover:text-gray-900 transition-all relative">
                            {isActive('/notifications') ? <BellSolid className="h-6 w-6" /> : <BellIcon className="h-6 w-6" />}
                            <span className="text-[10px] mt-0.5 font-medium">Notifications</span>
                            {unreadNotifications > 0 && (
                                <span className="absolute top-2 right-5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                    {unreadNotifications}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative group ml-4">
                                <button className="flex flex-col items-center justify-center w-16 h-full text-gray-500 hover:text-gray-900 transition-all">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-[#0066FF] overflow-hidden">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                                        ) : (
                                            user.displayName?.[0] || user.email?.[0] || 'U'
                                        )}
                                    </div>
                                    <span className="text-[10px] mt-0.5 font-medium flex items-center gap-0.5">Me</span>
                                </button>
                                <div className="absolute right-0 top-16 w-64 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-lg font-bold text-[#0066FF] overflow-hidden">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                                                ) : (
                                                    user.displayName?.[0] || user.email?.[0] || 'U'
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{user.displayName || 'Contributor'}</span>
                                                <span className="text-xs text-gray-500 line-clamp-1">{user.email}</span>
                                            </div>
                                        </div>
                                        <Link to="/profile" className="mt-3 block w-full text-center py-1 border border-[#0066FF] text-[#0066FF] rounded-full text-sm font-bold hover:bg-blue-50 transition-all">
                                            View Profile
                                        </Link>
                                    </div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Sign Out</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-4">
                                <button onClick={() => setIsAuthModalOpen(true)} className="px-4 py-2 text-[#0066FF] font-bold text-sm hover:bg-blue-50 rounded-full transition-all">Log in</button>
                                <button onClick={() => setIsAuthModalOpen(true)} className="px-4 py-2 border border-[#0066FF] text-[#0066FF] font-bold text-sm hover:bg-blue-50 rounded-full transition-all">Join Now</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Header (Top) */}
            <MobileHeader />

            {/* Mobile Bottom Nav */}
            <MobileBottomNav />

            {/* Auth Modal */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default NavBar;
