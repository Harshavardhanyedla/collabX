import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/');
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                setMessage('Account created successfully! You can now sign in.');
                setIsLogin(true);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden font-sans pt-20">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md z-10 p-8 md:p-10 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
            >
                {/* Card Header Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0066FF] flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
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
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#0f172a] mb-2 tracking-tight">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {isLogin ? 'Please enter your details to sign in' : 'Start building your future today'}
                    </p>
                </div>

                {/* Google Login - Top */}
                <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: '#f8fafc' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleGoogleLogin}
                    className="w-full py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-3 hover:border-gray-300 transition-all mb-6"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span>Continue with Google</span>
                </motion.button>

                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute w-full h-px bg-gray-200"></div>
                    <span className="relative px-3 bg-white text-xs font-medium text-gray-400">Or continue with email</span>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Email address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1e293b] border border-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                                placeholder="you@university.edu"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1e293b] border border-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    {isLogin && (
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF]" />
                                <span className="text-gray-600">Remember me</span>
                            </label>
                            <button type="button" className="text-[#0066FF] font-medium hover:underline">
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg"
                            >
                                {error}
                            </motion.div>
                        )}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-green-600 text-sm text-center bg-green-50 py-2 rounded-lg"
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl bg-[#0066FF] text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#0066FF] font-bold hover:underline ml-1"
                        >
                            {isLogin ? 'Sign up for free' : 'Log in'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
