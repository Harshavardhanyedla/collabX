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

    // Inline styles for Blue/White Theme
    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f9ff', // Light blue tint fallback
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
            // Hero-like gradient: Blue to Light Blue
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
            opacity: 1,
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
            fontSize: '20px',
            letterSpacing: '0.025em',
            fontFamily: 'variex, sans-serif', // Assuming variex is available globally or falls back
        },
        card: {
            width: '100%',
            maxWidth: '360px',
            zIndex: 10,
            padding: '40px 32px',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)', // Stronger shadow for pop
        },
        header: {
            textAlign: 'center' as const,
            marginBottom: '32px',
        },
        title: {
            fontSize: '28px',
            fontWeight: '800',
            color: '#111827', // Dark gray for text on white
            marginBottom: '8px',
            letterSpacing: '-0.02em',
        },
        subtitle: {
            fontSize: '14px',
            color: '#6b7280',
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#f9fafb', // Very light gray
            border: '1px solid #e5e7eb', // Light border
            borderRadius: '12px',
            color: '#1f2937', // Dark text
            fontSize: '15px',
            marginBottom: '16px',
            outline: 'none',
            transition: 'all 0.2s ease',
        },
        primaryButton: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#2563eb', // Brand Blue
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
            marginTop: '8px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            transition: 'transform 0.1s ease',
        },
        secondaryButton: {
            width: '100%',
            padding: '12px',
            backgroundColor: 'white',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontWeight: '500',
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'background-color 0.1s ease',
        },
        divider: {
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '8px 0',
        },
        dividerLine: {
            height: '1px',
            backgroundColor: '#e5e7eb',
            width: '100%',
        },
        dividerText: {
            padding: '0 10px',
            color: '#9ca3af',
            fontSize: '12px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            backgroundColor: 'white',
        },
        footer: {
            marginTop: '32px',
            textAlign: 'center' as const,
            fontSize: '14px',
            color: '#6b7280',
        },
        link: {
            color: '#2563eb',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '4px',
            fontWeight: '600',
        },
    };

    return (
        <div style={styles.container}>
            {/* Background */}
            <div style={styles.backgroundGradient} />

            {/* Logo */}
            <div style={styles.logoContainer}>
                <span style={styles.logoText}>CollabX</span>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={styles.card}
            >
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p style={styles.subtitle}>
                        {isLogin ? 'Enter your details to access your account' : 'Start building your future today'}
                    </p>
                </div>

                <form onSubmit={handleEmailAuth}>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="Email address"
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
                                style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', paddingBottom: '12px' }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ color: '#16a34a', fontSize: '13px', textAlign: 'center', paddingBottom: '12px' }}
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.primaryButton, opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
                    </motion.button>
                </form>

                <div style={styles.divider}>
                    <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={styles.dividerLine}></div>
                        <span style={{ position: 'absolute', ...styles.dividerText }}>OR</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleLogin}
                    style={styles.secondaryButton}
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        style={{ width: '18px', height: '18px' }}
                    />
                    <span>Continue with Google</span>
                </motion.button>

                <div style={styles.footer}>
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={styles.link}
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
