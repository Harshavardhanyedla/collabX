import React from 'react';
import {
    PlusIcon,
    ArrowRightIcon,
    InformationCircleIcon
} from '@heroicons/react/24/solid';

const RightSidebar: React.FC = () => {
    const suggestions = [
        { name: 'Sarah Chen', role: 'Full Stack Developer', college: 'Stanford University' },
        { name: 'Alex Rivera', role: 'UI/UX Designer', college: 'MIT' },
        { name: 'James Wilson', role: 'ML Engineer', college: 'IIT Bombay' },
    ];

    const trendingContent = [
        { title: 'Project: Decentralized Voting', views: '1.2k', time: '12h ago' },
        { title: 'Resource: Mastering React 19', views: '3.4k', time: '1d ago' },
        { title: 'Roadmap: AI/ML 2024', views: '5k', time: '2d ago' },
    ];

    return (
        <div className="flex flex-col gap-2">
            {/* Add to Feed Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">Add to your feed</h3>
                    <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
                </div>

                <div className="flex flex-col gap-4">
                    {suggestions.map((person, idx) => (
                        <div key={idx} className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-[#0066FF] font-bold text-xs uppercase">
                                {person.name[0]}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-gray-900 truncate hover:text-[#0066FF] hover:underline cursor-pointer">{person.name}</span>
                                <span className="text-xs text-gray-500 truncate">{person.role} at {person.college}</span>
                                <button className="mt-1.5 flex items-center justify-center gap-1 px-3 py-1 border border-gray-500 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-50 hover:border-gray-800 transition-colors w-24">
                                    <PlusIcon className="h-4 w-4" />
                                    <span>Follow</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-2 border-t border-gray-50">
                    <button className="flex items-center gap-1 text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors w-full group">
                        <span className="text-sm font-bold group-hover:text-gray-700">View all recommendations</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Trending/News Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm sticky top-20">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">CollabX Trending</h3>
                    <InformationCircleIcon className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex flex-col gap-3">
                    {trendingContent.map((item, idx) => (
                        <div key={idx} className="group cursor-pointer">
                            <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#0066FF]">{item.title}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                                <span>{item.views} readers</span>
                                <span>•</span>
                                <span>{item.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-[11px] text-gray-400 flex flex-wrap justify-center gap-x-3 gap-y-1">
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">About</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Accessibility</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Help Center</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Privacy & Terms</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Ad Choices</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Advertising</span>
                    <span className="hover:underline hover:text-[#0066FF] cursor-pointer">Business Services</span>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#0066FF] flex items-center justify-center text-white text-[8px] font-bold">X</div>
                    <span className="text-xs text-gray-500">CollabX Corporation © 2024</span>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
