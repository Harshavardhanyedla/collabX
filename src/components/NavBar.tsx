import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
import type { User } from '@supabase/supabase-js';
import logoImg from '../assets/logo.jpg';

const NavBar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-blue-700/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    {/* Left Side: Logo + Main Navigation */}
                    <div className="flex items-center gap-12">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <img src={logoImg} alt="CollabX Logo" className="h-10 w-auto rounded-md shadow-sm" />
                            <span className="text-2xl font-bold font-variex text-white">
                                CollabX
                            </span>
                        </div>

                        {/* Main Links (Desktop) */}
                        <div className="hidden md:flex items-center gap-8">
                            {[
                                { name: 'Learning Roadmaps', id: 'roadmaps' },
                                { name: 'Projects', id: 'projects' },
                                { name: 'Community Hub', id: 'community' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className="text-sm font-semibold text-blue-100 hover:text-white transition-colors whitespace-nowrap"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Contact + Auth */}
                    <div className="flex items-center gap-6">
                        {/* Contact Link */}
                        <button
                            onClick={() => scrollToSection('contact')}
                            className="hidden md:block text-sm font-semibold text-blue-100 hover:text-white transition-colors"
                        >
                            Get in Touch
                        </button>

                        {/* Auth Button */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-white hidden sm:block">
                                    {user.email?.split('@')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white/10 text-white hover:bg-white/20 border border-white/20"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </motion.nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};

export default NavBar;
