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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src={logoImg} alt="CollabX Logo" className="h-10 w-auto rounded-md shadow-sm" />
                        <span className={`text-2xl font-bold font-variex ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                            CollabX
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        {[
                            { name: 'Learning Roadmaps', id: 'roadmaps' },
                            { name: 'Projects', id: 'projects' },
                            { name: 'Community Hub', id: 'community' },
                            { name: 'Get in Touch', id: 'contact' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`text-sm font-medium transition-colors whitespace-nowrap ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-gray-200 hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-medium ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                                    {user.email?.split('@')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${scrolled
                                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${scrolled
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                                    : 'bg-white text-blue-900 hover:bg-blue-50'
                                    }`}
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
