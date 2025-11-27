import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
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
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
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
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Inline styles to bypass missing Tailwind JIT
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            position: 'relative' as const,
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        backgroundGradient: {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, #0f172a 0%, #000000 100%)',
            opacity: 0.8,
        },
        logoContainer: {
            position: 'absolute' as const,
            top: '24px',
            left: '24px',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        logoText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px',
            letterSpacing: '0.025em',
        },
        card: {
            width: '100%',
            maxWidth: '320px',
            zIndex: 10,
            padding: '0 16px',
        },
        header: {
            textAlign: 'center' as const,
            marginBottom: '32px',
        },
        title: {
            fontSize: '24px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '8px',
        },
        input: {
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#111',
            border: '1px solid #333',
            borderRadius: '6px',
            color: 'white',
            fontSize: '14px',
            marginBottom: '16px',
            outline: 'none',
        },
        primaryButton: {
            width: '100%',
            padding: '10px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: '8px',
        },
        secondaryButton: {
            width: '100%',
            padding: '10px',
            backgroundColor: 'black',
            color: 'white',
            border: '1px solid #333',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
        },
        divider: {
            height: '20px',
        },
        footer: {
            marginTop: '32px',
            textAlign: 'center' as const,
            fontSize: '12px',
            color: '#666',
        },
        link: {
            color: '#3b82f6',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '4px',
        },
    };

    return (
        <div style={styles.container}>
            {/* Background */}
            <div style={styles.backgroundGradient} />

            {/* Logo */}
            <div style={styles.logoContainer}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L20 20H4L12 4Z" fill="white" />
                </svg>
                <span style={styles.logoText}>CollabX</span>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={styles.card}
            >
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        {isLogin ? 'Log in to CollabX' : 'Sign up for CollabX'}
                    </h1>
                </div>

                <form onSubmit={handleEmailAuth}>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="Email Address"
                    />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        placeholder="Password"
                        minLength={6}
                    />

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center', paddingBottom: '10px' }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ color: '#22c55e', fontSize: '12px', textAlign: 'center', paddingBottom: '10px' }}
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.primaryButton, opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Continue with Email' : 'Sign Up with Email')}
                    </button>
                </form>

                <div style={styles.divider}></div>

                <button
                    onClick={handleGoogleLogin}
                    style={styles.secondaryButton}
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        style={{ width: '16px', height: '16px' }}
                    />
                    <span>Continue with Google</span>
                </button>

                <div style={styles.footer}>
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={styles.link}
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
