import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ClockIcon,
    CalendarIcon,
    AcademicCapIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

const RoadmapDetail = () => {
    // Mock data - in a real app, fetch based on roadmapId
    const courseData = {
        title: "IBM: Data Science",
        subtitle: "Professional Certificate",
        description: "Gain hands-on experience with industry-standard tools and technologies — including data modeling with Python, automation, and applied machine learning — with this comprehensive course, 100% online.",
        duration: "10 weeks",
        pace: "12-13 hours per week",
        startDate: "Jan 28, 2026",
        enrollBy: "Feb 2, 2026",
        stats: [
            { value: "36%", label: "The projected growth of the employment rate for data scientists from 2023 to 2033.", source: "U.S. Bureau of Labor Statistics" },
            { value: "$112,590", label: "The median annual salary for data scientists as of 2024.", source: "U.S. Bureau of Labor Statistics" }
        ],
        curriculum: [
            { title: "Orientation module: Welcome to your Online Campus" },
            { title: "Module 1: Data Science Methodologies" },
            { title: "Module 2: Using Python for Data Science" },
            { title: "Module 3: Python Fundamentals and Data" },
            { title: "Module 4: SQL for Data Science" },
            { title: "Module 5: Using Python to Analyze Data" },
            { title: "Module 6: Data Visualization Using Python" }
        ]
    };

    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subscribe: true
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formState);
        // Handle form submission logic here
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-white">
            <div className="container-custom mx-auto">

                {/* Breadcrumb */}
                <div className="mb-8 text-sm text-gray-500 flex items-center flex-wrap gap-2">
                    <Link to="/" className="hover:text-[#5865F2] transition-colors">Home</Link>
                    <span>›</span>
                    <span className="text-gray-900">Executive Education</span>
                    <span>›</span>
                    <span className="text-gray-400">{courseData.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-xl bg-[#0f172a] flex items-center justify-center text-white shadow-lg">
                                    <span className="text-xl font-bold">IBM</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] leading-tight tracking-tight">
                                {courseData.title}
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl font-light">
                                {courseData.description}
                            </p>

                            <div className="flex flex-wrap gap-8 pt-6 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <ClockIcon className="w-6 h-6 text-[#5865F2] mt-1" />
                                    <div>
                                        <p className="font-bold text-[#0f172a]">{courseData.duration}</p>
                                        <p className="text-sm text-gray-500">{courseData.pace}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CalendarIcon className="w-6 h-6 text-[#5865F2] mt-1" />
                                    <div>
                                        <p className="font-bold text-[#0f172a]">Starts {courseData.startDate}</p>
                                        <p className="text-sm text-gray-500">Enroll by {courseData.enrollBy}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <AcademicCapIcon className="w-6 h-6 text-[#5865F2] mt-1" />
                                    <div>
                                        <p className="font-bold text-[#0f172a]">Instructor-paced</p>
                                        <p className="text-sm text-gray-500">Scheduled classes</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="py-12 bg-gray-50 rounded-3xl p-8 border border-gray-100"
                        >
                            <h2 className="text-2xl font-bold text-[#0f172a] mb-8 text-center">Industry Insights</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                                {/* Vertical Divider for desktop */}
                                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>

                                {courseData.stats.map((stat, index) => (
                                    <div key={index} className="text-center space-y-2">
                                        <p className="text-5xl font-bold text-[#5865F2]">{stat.value}</p>
                                        <p className="text-gray-600 font-medium">{stat.label}</p>
                                        <p className="text-xs text-gray-400 mt-2">{stat.source}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Curriculum Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl font-bold text-[#0f172a]">Course Curriculum</h2>
                            <p className="text-gray-600 max-w-3xl">
                                Develop advanced data science skills in data analysis, visualization, and machine learning models as you work through the weekly modules of this online program.
                            </p>

                            <div className="space-y-3 pt-4">
                                {courseData.curriculum.map((module, index) => (
                                    <div key={index} className="bg-white border border-gray-100 p-5 rounded-xl flex items-center justify-between group hover:border-[#5865F2] hover:shadow-md transition-all cursor-pointer">
                                        <span className="font-medium text-gray-700 group-hover:text-[#5865F2] transition-colors">{module.title}</span>
                                        <ChevronDownIcon className="text-gray-400 group-hover:text-[#5865F2] transition-colors w-5 h-5" />
                                    </div>
                                ))}
                            </div>

                            <button className="text-[#5865F2] font-bold hover:text-[#4752c4] transition-colors flex items-center gap-2 mt-4">
                                Show Full Curriculum
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                        </motion.div>

                    </div>

                    {/* Sidebar / Form Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50"
                            >
                                <h3 className="text-2xl font-bold text-[#0f172a] mb-2">Get Syllabus</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Enter your details to receive the full course syllabus and program guide.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formState.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5865F2] focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formState.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5865F2] focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email Address"
                                            value={formState.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5865F2] focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-gray-50 text-gray-900 placeholder-gray-400"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <p className="text-xs text-gray-500">I agree to receive communications about this program.</p>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="subscribe"
                                                    checked={formState.subscribe === true}
                                                    onChange={() => setFormState(prev => ({ ...prev, subscribe: true }))}
                                                    className="accent-[#5865F2] w-4 h-4"
                                                />
                                                Yes
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="subscribe"
                                                    checked={formState.subscribe === false}
                                                    onChange={() => setFormState(prev => ({ ...prev, subscribe: false }))}
                                                    className="accent-[#5865F2] w-4 h-4"
                                                />
                                                No
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all mt-4"
                                    >
                                        Download Syllabus
                                    </button>

                                    <p className="text-[10px] text-gray-400 mt-4 text-center leading-tight">
                                        By submitting this form, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </form>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RoadmapDetail;
