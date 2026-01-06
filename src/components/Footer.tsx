import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#0f172a] text-white py-16 border-t border-gray-800">
            <div className="container-custom mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
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
                            <span className="text-xl font-bold tracking-tight">CollabX</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Empowering the next generation of builders and learners. Connecting campuses, one project at a time.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="font-bold text-lg mb-6">Platform</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/#resources" className="hover:text-[#0066FF] transition-colors">Resources</Link></li>
                            <li><Link to="/#projects" className="hover:text-[#0066FF] transition-colors">Projects</Link></li>
                            <li><Link to="/students" className="hover:text-[#0066FF] transition-colors">Students</Link></li>
                            <li><Link to="/mentorship" className="hover:text-[#0066FF] transition-colors">Mentorship</Link></li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="font-bold text-lg mb-6">Community</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-[#0066FF] transition-colors">Discord Server</a></li>
                            <li><a href="#" className="hover:text-[#0066FF] transition-colors">Hackathons</a></li>
                            <li><a href="#" className="hover:text-[#0066FF] transition-colors">Events</a></li>
                            <li><a href="#" className="hover:text-[#0066FF] transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-bold text-lg mb-6">Connect</h3>
                        <div className="flex gap-4">
                            <a href="https://x.com/x_collab56418" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0066FF] hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                            </a>
                            <a href="https://www.linkedin.com/company/105358117/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0066FF] hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="https://github.com/Harshavardhanyedla/collabX" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#0066FF] hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>&copy; 2026 CollabX. All rights reserved.</span>
                        <span className="hidden md:inline">|</span>
                        <span>Powered by Google Cloud</span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
