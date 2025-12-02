import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
import type { User } from '@supabase/supabase-js';

const NavBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'signup'>('login');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

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
        { name: 'Home', path: '/' },
        { name: 'Resources', path: '/resources' }, // Assuming this maps to Roadmaps/Resources
        { name: 'Projects', path: '/projects' },
        { name: 'Students', path: '/students' },
    ];

    const handleNavClick = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center">
                <div className="container-custom w-full flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#5865F2] flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436h.001c-3.698 2.88-8.196 5.263-13.25 5.263a.75.75 0 01-.75-.75c0-5.055 2.383-9.555 6.084-12.436z" clipRule="evenodd" />
                                <path d="M4.786 2.547a.75.75 0 011.004 1.004A22.05 22.05 0 001.5 9.75a22.05 22.05 0 004.29 6.199.75.75 0 01-1.004 1.004A23.55 23.55 0 01.008 9.75c0-2.758.62-5.372 1.73-7.705a.75.75 0 013.048.502z" />
                                <path d="M18.214 21.453a.75.75 0 01-1.004-1.004 22.05 22.05 0 004.29-6.199 22.05 22.05 0 00-4.29-6.199.75.75 0 011.004-1.004 23.55 23.55 0 014.722 7.203c0 2.758-.62 5.372-1.73 7.705a.75.75 0 01-3.048-.502z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-[#0f172a] tracking-tight">CollabX</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link.path)}
                                className="text-sm font-medium text-gray-600 hover:text-[#5865F2] transition-colors"
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    {/* Auth / Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 bg-[#0f172a] text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                <span className="text-sm font-medium">Profile</span>
                            </Link>
                        ) : (
                            <button
                                onClick={() => {
                                    setAuthModalInitialView('login');
                                    setIsAuthModalOpen(true);
                                }}
                                className="bg-[#0f172a] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                Log in
                            </button>
                        )}
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
                                onClick={() => handleNavClick(link.path)}
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
