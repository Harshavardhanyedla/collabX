import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getUserProfile, updateProfile } from '../lib/profiles';
import type { UserProfile } from '../types';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSuccess?: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, userId, onSuccess }) => {
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        name: '',
        headline: '',
        bio: '',
        college: '',
        skills: []
    });
    const [skillsText, setSkillsText] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            loadProfile();
        }
    }, [isOpen, userId]);

    const loadProfile = async () => {
        setLoading(true);
        const data = await getUserProfile(userId);
        if (data) {
            setProfile(data);
            setSkillsText(data.skills.join(', '));
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updatedData = {
                ...profile,
                skills: skillsText.split(',').map(s => s.trim()).filter(Boolean)
            };
            await updateProfile(userId, updatedData);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <XMarkIcon className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-gray-500">Loading profile...</div>
                        ) : (
                            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Headline</label>
                                    <input
                                        type="text"
                                        value={profile.headline}
                                        onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all outline-none"
                                        placeholder="e.g. Full Stack Developer | Student at MIT"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">College / Institution</label>
                                    <input
                                        type="text"
                                        value={profile.college}
                                        onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        value={skillsText}
                                        onChange={(e) => setSkillsText(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all outline-none"
                                        placeholder="React, Python, UI Design"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                                    <textarea
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all outline-none resize-none"
                                        rows={4}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-full transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-8 py-2 bg-[#0066FF] text-white font-bold rounded-full hover:bg-blue-600 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileEditModal;
