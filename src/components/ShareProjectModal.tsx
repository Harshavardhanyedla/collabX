import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../lib/firebase';
import { addProject } from '../lib/projects';

interface ShareProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ShareProjectModal: React.FC<ShareProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        githubUrl: '',
        liveUrl: '',
        tags: '',
        rolesNeeded: '',
        category: 'Web Dev'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        setIsSubmitting(true);
        setError('');

        try {
            await addProject(auth.currentUser.uid, {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                ownerName: auth.currentUser.displayName || 'Anonymous',
                ownerAvatar: auth.currentUser.photoURL || '',
                githubUrl: formData.githubUrl,
                liveUrl: formData.liveUrl,
                techStack: formData.tags.split(',').map(tag => tag.trim()),
                rolesNeeded: formData.rolesNeeded.split(',').map(role => role.trim()),
                status: 'Open',
                thumbnailUrl: `https://source.unsplash.com/random/800x600?tech,${formData.category}`,
                updatedAt: null // Will be set by serverTimestamp if needed
            });

            setSuccess(true);
            if (onSuccess) onSuccess();

            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({
                    title: '',
                    description: '',
                    githubUrl: '',
                    liveUrl: '',
                    tags: '',
                    rolesNeeded: '',
                    category: 'Web Dev'
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option>AI/ML</option>
                                                <option>Web Dev</option>
                                                <option>Mobile</option>
                                                <option>Blockchain</option>
                                                <option>Design</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Roles Needed</label>
                                            <input
                                                type="text"
                                                value={formData.rolesNeeded}
                                                onChange={e => setFormData({ ...formData, rolesNeeded: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Frontend, Designer"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="react, tailwind, firebase"
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
