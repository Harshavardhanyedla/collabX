import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [college, setCollege] = useState('');
    const [bio, setBio] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');

    React.useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setName(data.name || '');
                    setRole(data.role || '');
                    setCollege(data.institution || '');
                    setBio(data.bio || '');
                    setSkills(data.skills || []);
                    setGithub(data.socials?.github || '');
                    setLinkedin(data.socials?.linkedin || '');
                }
            }
        };
        fetchUserData();
    }, []);

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (skills.length < 5 && !skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
                setSkillInput('');
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No user logged in');

            await setDoc(doc(db, 'users', user.uid), {
                name,
                role,
                institution: college,
                bio,
                skills,
                socials: {
                    github,
                    linkedin
                },
                stats: { // Initial stats
                    projects: 0,
                    stars: 0,
                    followers: 0,
                    following: 0
                },
                avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                email: user.email,
                joinedAt: new Date().toISOString()
            }, { merge: true });

            navigate('/profile');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#0f172a] mb-2">
                        {name ? 'Update Your Profile' : 'Complete Your Profile'}
                    </h1>
                    <p className="text-gray-500">
                        {name ? 'Update your details below' : 'Tell us a bit about yourself to get started'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Role / Title</label>
                            <input
                                type="text"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="Full Stack Developer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">College / University</label>
                        <input
                            type="text"
                            required
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="University of Technology"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">About Me</label>
                        <textarea
                            required
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                            placeholder="I am passionate about..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Skills <span className="text-gray-400 font-normal">(Max 5)</span>
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {skills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-blue-50 text-[#0066FF] rounded-lg text-sm font-medium flex items-center gap-2">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">×</button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleAddSkill}
                            disabled={skills.length >= 5}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all disabled:opacity-50"
                            placeholder={skills.length >= 5 ? "Max skills reached" : "Type skill and press Enter"}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub (Optional)</label>
                            <input
                                type="text"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="github.com/username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn (Optional)</label>
                            <input
                                type="text"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                placeholder="linkedin.com/in/username"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-[#0066FF] text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : (name ? 'Update Profile' : 'Complete Profile')}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Onboarding;
