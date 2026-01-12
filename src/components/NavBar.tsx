import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import AuthModal from './AuthModal';
import {
    HomeIcon,
    BriefcaseIcon,
    UsersIcon,
    BookOpenIcon,
    MapIcon,
    BellIcon,
    MagnifyingGlassIcon,
    ChatBubbleLeftEllipsisIcon,
    Bars3Icon,
    XMarkIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const NavBar: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/', icon: HomeIcon },
        { name: 'Projects', path: '/projects', icon: BriefcaseIcon },
        { name: 'Messages', path: '/messages', icon: ChatBubbleLeftRightIcon },
        { name: 'Students', path: '/students', icon: UsersIcon },
        { name: 'Resources', path: '/resources', icon: BookOpenIcon },
        { name: 'Roadmaps', path: '/roadmaps', icon: MapIcon },
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Brand & Search */}
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                        <Link to="/" className="shrink-0 flex items-center gap-1">
                            <div className="w-8 h-8 bg-[#0066FF] rounded-md flex items-center justify-center font-black text-white text-lg">
                                C
                            </div>
                            <span className="text-xl font-black text-[#0066FF] tracking-tighter hidden sm:block">CollabX</span>
                        </Link>

                        <div className="relative flex-1 hidden md:block ml-4">
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
                    <div className="hidden lg:flex items-center h-full ml-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex flex-col items-center justify-center w-20 h-full border-b-2 transition-all group ${isActive(link.path)
                                    ? 'border-gray-900 text-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                <link.icon className={`h-6 w-6 ${isActive(link.path) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`} />
                                <span className="text-[10px] mt-0.5 font-medium">{link.name}</span>
                            </Link>
                        ))}

                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                        <Link
                            to="/messaging"
                            className="flex flex-col items-center justify-center w-20 h-full text-gray-500 hover:text-gray-900 transition-all relative"
                        >
                            <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
                            <span className="text-[10px] mt-0.5 font-medium">Messaging</span>
                            <span className="absolute top-2 right-6 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">2</span>
                        </Link>

                        <Link
                            to="/notifications"
                            className="flex flex-col items-center justify-center w-20 h-full text-gray-500 hover:text-gray-900 transition-all relative"
                        >
                            <BellIcon className="h-6 w-6" />
                            <span className="text-[10px] mt-0.5 font-medium">Notifications</span>
                            <span className="absolute top-2 right-5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">5</span>
                        </Link>

                        {user ? (
                            <div className="relative group ml-4">
                                <button className="flex flex-col items-center justify-center w-16 h-full text-gray-500 hover:text-gray-900 transition-all">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-[#0066FF]">
                                        {user.displayName?.[0] || user.email?.[0] || 'U'}
                                    </div>
                                    <span className="text-[10px] mt-0.5 font-medium flex items-center gap-0.5">Me</span>
                                </button>
                                <div className="absolute right-0 top-16 w-64 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-lg font-bold text-[#0066FF]">
                                                {user.displayName?.[0] || user.email?.[0] || 'U'}
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

                    {/* Mobile Menu Icon */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className={`fixed inset-0 bg-white z-40 transition-transform duration-300 lg:hidden pt-16 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-900 font-medium border border-transparent hover:border-gray-100"
                        >
                            <link.icon className="h-6 w-6 text-gray-500" />
                            <span>{link.name}</span>
                        </Link>
                    ))}
                    {!user && (
                        <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-gray-100">
                            <button onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }} className="px-4 py-3 border border-[#0066FF] text-[#0066FF] font-bold rounded-full">Log in</button>
                            <button onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }} className="px-4 py-3 bg-[#0066FF] text-white font-bold rounded-full">Sign Up</button>
                        </div>
                    )}
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default NavBar;
