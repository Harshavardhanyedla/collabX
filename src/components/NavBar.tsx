import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import AuthModal from './AuthModal';

const NavBar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Roadmaps', path: '/#roadmaps', isHash: true },
        { name: 'Projects', path: '/#projects', isHash: true },
        { name: 'Resources', path: '/#resources', isHash: true },
        { name: 'Students', path: '/students', isHash: false },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 rounded-lg bg-[#0066FF] flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                {/* Rays */}
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3V5" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 5.5L17 7" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H19" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 18.5L17 17" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 18.5L7 17" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12H5" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 5.5L7 7" />
                                {/* Fist */}
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10V21" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 7V10" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7V10" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10C17 10 18 11 18 12.5C18 14 17 15 15 15" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-[#0f172a] tracking-tight">CollabX</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            link.isHash ? (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    onClick={(e) => {
                                        if (location.pathname !== '/') {
                                            // Handle hash link from another page: standard navigation will happen
                                        } else {
                                            e.preventDefault();
                                            const id = link.path.substring(2);
                                            const element = document.getElementById(id);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                                window.history.pushState(null, '', link.path);
                                            }
                                        }
                                    }}
                                    className={`text-sm font-medium transition-colors ${location.pathname === '/' && location.hash === link.path.substring(1) ? 'text-[#0066FF]' : 'text-gray-600 hover:text-[#0066FF]'}`}
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-[#0066FF]' : 'text-gray-600 hover:text-[#0066FF]'}`}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold">
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors">
                                    Log in
                                </Link>
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-5 py-2.5 rounded-full bg-[#0f172a] text-white text-sm font-medium hover:bg-[#1e293b] transition-all shadow-lg shadow-gray-200/50"
                                >
                                    Join Now
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl p-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            link.isHash ? (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    className="text-gray-600 font-medium py-2"
                                    onClick={(e) => {
                                        setIsMobileMenuOpen(false);
                                        if (location.pathname === '/') {
                                            e.preventDefault();
                                            const id = link.path.substring(2);
                                            const element = document.getElementById(id);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                                window.history.pushState(null, '', link.path);
                                            }
                                        }
                                    }}
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-gray-600 font-medium py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                        <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <Link to="/profile" className="text-gray-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                                        Profile
                                    </Link>
                                    <button onClick={handleSignOut} className="text-left text-red-500 font-medium py-2">
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-center w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                                        Log in
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsAuthModalOpen(true);
                                        }}
                                        className="w-full py-3 rounded-xl bg-[#0066FF] text-white font-medium shadow-lg shadow-blue-500/30"
                                    >
                                        Join Now
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default NavBar;
