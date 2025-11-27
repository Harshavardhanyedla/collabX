import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface ShareProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShareProjectModal: React.FC<ShareProjectModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        githubUrl: '',
        liveUrl: '',
        tags: '',
        author: '',
        language: 'JavaScript'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            supabase.auth.getUser().then(({ data: { user } }) => {
                if (user?.email) {
                    setFormData(prev => ({
                        ...prev,
                        author: user.email!.split('@')[0]
                    }));
                }
            });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const { error: supabaseError } = await supabase
                .from('projects')
                .insert([
                    {
                        title: formData.title,
                        description: formData.description,
                        github_url: formData.githubUrl,
                        live_url: formData.liveUrl,
                        tags: formData.tags.split(',').map(tag => tag.trim()),
                        author: formData.author,
                        language: formData.language,
                        stars: 0
                    }
                ]);

            if (supabaseError) throw supabaseError;

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({
                    title: '',
                    description: '',
                    githubUrl: '',
                    liveUrl: '',
                    tags: '',
                    author: '',
                    language: 'JavaScript'
                });
            }, 2000);
        } catch (err) {
            console.error('Error submitting project:', err);
            setError('Failed to submit project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                    >
                        <div className="p-6 md:p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Share Your Project</h2>
                            <p className="text-gray-600 mb-6">Showcase your work to the community.</p>

                            {success ? (
                                <div className="text-center py-12">
                                    <div className="text-5xl mb-4">🎉</div>
                                    <h3 className="text-2xl font-bold text-green-600 mb-2">Project Submitted!</h3>
                                    <p className="text-gray-600">Your project has been added successfully.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., AI Study Assistant"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={3}
                                            placeholder="What does your project do?"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.githubUrl}
                                                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Live Demo URL</label>
                                            <input
                                                type="url"
                                                value={formData.liveUrl}
                                                onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.author}
                                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Language</label>
                                            <select
                                                value={formData.language}
                                                onChange={e => setFormData({ ...formData, language: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option>JavaScript</option>
                                                <option>TypeScript</option>
                                                <option>Python</option>
                                                <option>Java</option>
                                                <option>C++</option>
                                                <option>Rust</option>
                                                <option>Go</option>
                                                <option>Swift</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="react, ai, machine-learning"
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-sm">{error}</p>}

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Project'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ShareProjectModal;
