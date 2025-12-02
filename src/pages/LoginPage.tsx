import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

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
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
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
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden font-sans">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Logo */}
            <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#5865F2] flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.534 50.534 0 00-2.658.813m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                </div>
                <span className="text-xl font-bold text-[#0f172a] tracking-tight">CollabX</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-md z-10 p-8 md:p-10 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#0f172a] mb-2 tracking-tight">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {isLogin ? 'Enter your details to access your account' : 'Start building your future today'}
                    </p>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/20 focus:border-[#5865F2] transition-all"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0f172a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5865F2]/20 focus:border-[#5865F2] transition-all"
                            placeholder="Password"
                            minLength={6}
                        />
                    </div>

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
                        className={`w-full py-3.5 rounded-xl bg-[#0f172a] text-white font-bold shadow-lg hover:bg-gray-800 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
                    </motion.button>
                </form>

                <div className="relative flex items-center justify-center my-8">
                    <div className="absolute w-full h-px bg-gray-200"></div>
                    <span className="relative px-3 bg-white text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: '#f8fafc' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium flex items-center justify-center gap-3 hover:border-gray-300 transition-all"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span>Continue with Google</span>
                </motion.button>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#5865F2] font-bold hover:underline ml-1"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
