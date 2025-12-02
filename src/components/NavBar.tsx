import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
import type { User } from '@supabase/supabase-js';

const NavBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'signup'>('login');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/', type: 'route' },
        { name: 'Resources', path: 'roadmaps', type: 'scroll' },
        { name: 'Projects', path: 'projects', type: 'scroll' },
        { name: 'Students', path: 'community', type: 'scroll' },
    ];

    const handleNavClick = (link: { name: string; path: string; type: string }) => {
        setIsMobileMenuOpen(false);

        if (link.type === 'route') {
            navigate(link.path);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (location.pathname !== '/') {
                navigate('/');
                // Wait for navigation to complete before scrolling
                setTimeout(() => {
                    const element = document.getElementById(link.path);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                const element = document.getElementById(link.path);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center">
                <div className="container-custom w-full flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 rounded-lg bg-[#0066FF] flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.951a.983.983 0 0 1-.825.59h-1.635a1 1 0 0 1-.822-.425l-2.922-4.591a1.575 1.575 0 0 0-2.672 1.705l3.257 5.113a3.735 3.735 0 0 0 3.16 1.723h5.29a4.5 4.5 0 0 0 4.5-4.5v-6.375a1.575 1.575 0 0 0-3.15 0v-1.5a1.575 1.575 0 0 0-3.15 0v1.5A1.575 1.575 0 0 0 13.2 1.5a1.575 1.575 0 0 0-1.575 1.575v3" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-[#0f172a] tracking-tight">CollabX</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link)}
                                className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors"
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    {/* Auth / Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        {!user && (
                            <Link
                                to="/login"
                                className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors"
                            >
                                Log in
                            </Link>
                        )}

                        <Link
                            to="/profile"
                            className="flex items-center gap-2 bg-[#0f172a] text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            <span className="text-sm font-medium">Profile</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-4 md:hidden">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link)}
                                className="text-left text-gray-600 font-medium py-2 hover:text-[#5865F2]"
                            >
                                {link.name}
                            </button>
                        ))}
                        <hr className="border-gray-100" />
                        {user ? (
                            <div className="flex flex-col gap-3">
                                <Link to="/profile" className="text-gray-600 font-medium py-2">Profile</Link>
                                <button onClick={handleLogout} className="text-red-500 font-medium py-2 text-left">Logout</button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setAuthModalInitialView('login');
                                    setIsAuthModalOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className="bg-[#0f172a] text-white px-6 py-2.5 rounded-full text-sm font-medium text-center"
                            >
                                Log in
                            </button>
                        )}
                    </div>
                )}
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView={authModalInitialView}
            />
        </>
    );
};

export default NavBar;
