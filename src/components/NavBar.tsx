import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
import type { User } from '@supabase/supabase-js';
import logoImg from '../assets/logo.jpg';

const NavBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'signup'>('login');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Scroll handler
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-blue-700/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Left Side: Logo + Main Navigation */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img
                                src={logoImg}
                                alt="CollabX Logo"
                                className="h-10 w-10 rounded-full object-cover border-2 border-white/20 shadow-sm"
                            />
                            <span className="text-xl font-bold tracking-tight text-white font-sans">
                                CollabX
                            </span>
                        </div>

                        {/* Main Links (Desktop) */}
                        <div className="hidden md:flex items-center gap-6">
                            {[
                                { name: 'Learning Roadmaps', id: 'roadmaps' },
                                { name: 'Projects', id: 'projects' },
                                { name: 'Community Hub', id: 'community' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-[15px] font-medium text-blue-100 hover:text-white transition-colors whitespace-nowrap"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Search + Contact + Auth */}
                    <div className="flex items-center gap-6">
                        {/* Search Icon */}
                        <button className="text-blue-100 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>

                        {/* Contact Link */}
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="hidden md:block text-[15px] font-medium text-blue-100 hover:text-white transition-colors"
                        >
                            Contact
                        </button>

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-white hidden sm:block">
                                    {user.email?.split('@')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2 rounded-full text-sm font-semibold transition-all bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => {
                                        setAuthModalInitialView('login');
                                        setIsAuthModalOpen(true);
                                    }}
                                    className="text-[15px] font-medium text-blue-100 hover:text-white transition-colors"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => {
                                        setAuthModalInitialView('signup');
                                        setIsAuthModalOpen(true);
                                    }}
                                    className="px-5 py-2 rounded-full text-sm font-bold transition-all bg-cyan-400 text-blue-900 hover:bg-cyan-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Sign up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialView={authModalInitialView}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};

export default NavBar;
