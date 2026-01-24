import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { languagesData } from '../data/languages';
import {
    VideoCameraIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    AcademicCapIcon,
    DocumentArrowDownIcon,
    ArrowUpRightIcon,
    PlayCircleIcon
} from '@heroicons/react/24/outline';

const LanguageDetail: React.FC = () => {
    const { languageId } = useParams<{ languageId: string }>();
    const navigate = useNavigate();
    const language = languageId ? languagesData[languageId] : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!language) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Language not found</h2>
                    <button
                        onClick={() => navigate('/resource/programming-languages')}
                        className="text-[#0066FF] font-bold hover:underline"
                    >
                        Return to Languages
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.button
                    onClick={() => navigate('/resource/programming-languages')}
                    className="mb-8 px-4 py-2 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 transition-all flex items-center gap-2 text-sm font-medium shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    ← Back to Languages
                </motion.button>

                {/* Header Section */}
                <motion.div
                    className="bg-white rounded-3xl p-8 mb-8 border border-gray-100 shadow-sm relative overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="relative z-10">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {language.icon}
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{language.name}</h1>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                            {language.description}
                        </p>
                    </div>
                    {/* Decorative Background Icon */}
                    <div className="absolute top-1/2 right-[-20px] -translate-y-1/2 text-[180px] opacity-[0.03] select-none pointer-events-none">
                        {language.icon}
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Courses & Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. YouTube Courses Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <VideoCameraIcon className="h-6 w-6 text-[#FF0000]" />
                                <h2 className="text-2xl font-bold text-gray-900">Best Free Full Courses</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {language.youtubeCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col"
                                    >
                                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <PlayCircleIcon className="h-12 w-12 text-white drop-shadow-lg" />
                                            </div>
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-[10px] font-bold rounded">
                                                {course.duration}
                                            </div>
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <VideoCameraIcon className="h-8 w-8" />
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">{course.title}</h3>
                                            <p className="text-xs text-gray-500 mb-4 font-medium">{course.channel}</p>
                                            <a
                                                href={course.url}
                                                className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#0066FF] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors w-fit"
                                            >
                                                Start Learning <ArrowUpRightIcon className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. Detailed Info Sections */}
                        <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-10">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <InformationCircleIcon className="h-6 w-6 text-[#0066FF]" />
                                    <h2 className="text-xl font-bold text-gray-900">About {language.name}</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed italic border-l-4 border-blue-50 pl-4">
                                    {language.about}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Main Uses</h3>
                                <div className="flex flex-wrap gap-2">
                                    {language.uses.map((use, i) => (
                                        <span key={i} className="px-4 py-2 bg-blue-50 text-[#0066FF] text-sm font-bold rounded-xl border border-blue-100">
                                            {use}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {language.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <CheckCircleIcon className="h-5 w-5 text-green-500 shrink-0" />
                                            <span className="text-sm font-bold text-gray-800">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            sections</section>
                    </div>

                    {/* Right Column: Quick Stats & Notes */}
                    <div className="space-y-6">
                        {/* Notes Section Card */}
                        <div className="bg-gradient-to-br from-[#0066FF] to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <DocumentArrowDownIcon className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-xl font-bold">Language Notes</h2>
                            </div>
                            <p className="text-blue-50 text-sm mb-6 leading-relaxed">
                                Access comprehensive study notes, cheat sheets, and interview questions for {language.name}.
                            </p>
                            <a
                                href={language.notesLink}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-[#0066FF] rounded-2xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg"
                            >
                                Get Drive Notes <ArrowUpRightIcon className="h-4 w-4" />
                            </a>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="flex items-center gap-2 text-md font-bold text-gray-900 mb-4">
                                <AcademicCapIcon className="h-5 w-5 text-orange-500" />
                                Career Scope
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
                                {language.careerScope}
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="flex items-center gap-2 text-md font-bold text-gray-900 mb-4">
                                <InformationCircleIcon className="h-5 w-5 text-indigo-500" />
                                Who should learn?
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed font-semibold">
                                {language.whoShouldLearn}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LanguageDetail;
