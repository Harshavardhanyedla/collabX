import React from 'react';
import {
    PhotoIcon,
    CalendarIcon,
    DocumentTextIcon,
    EllipsisHorizontalIcon,
    ChatBubbleLeftIcon,
    ShareIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';

const HomeFeed: React.FC = () => {
    const feedItems = [
        {
            id: 1,
            author: {
                name: "Rahul Sharma",
                role: "Full Stack Developer | React Enthusiast",
                avatar: "R",
                time: "2h ago"
            },
            content: "Just finished building a real-time collaborative code editor with CollabX features! 🚀 Check it out and let me know your thoughts. We're looking for a UI/UX designer to join the team!",
            tags: ["#react", "#webdev", "#collaboration"],
            projects: [
                { title: "CodeSync Pro", status: "Looking for Designer", color: "bg-blue-500" }
            ],
            likes: 24,
            comments: 5
        },
        {
            id: 2,
            author: {
                name: "Priya Patel",
                role: "UX Researcher @ Stanford",
                avatar: "P",
                time: "5h ago"
            },
            content: "Successfully completed the 'Modern Design Systems' roadmap on CollabX! Highly recommend it to anyone starting their design journey. The practical projects at the end are gold. 🎨",
            image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1000&auto=format&fit=crop",
            likes: 89,
            comments: 12
        }
    ];

    return (
        <div className="flex flex-col gap-2">
            {/* Create Post Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-lg shrink-0">
                        H
                    </div>
                    <button className="flex-1 text-left px-4 py-3 border border-gray-300 rounded-full text-gray-400 hover:bg-gray-100 transition-colors text-sm font-medium">
                        Start a project or share an update...
                    </button>
                </div>
                <div className="flex justify-between mt-3 px-2">
                    <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 p-2 rounded transition-colors group">
                        <PhotoIcon className="h-5 w-5 text-blue-400" />
                        <span className="text-sm font-medium group-hover:text-gray-700">Media</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 p-2 rounded transition-colors group">
                        <CalendarIcon className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm font-medium group-hover:text-gray-700">Event</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 p-2 rounded transition-colors group">
                        <DocumentTextIcon className="h-5 w-5 text-orange-400" />
                        <span className="text-sm font-medium group-hover:text-gray-700">Write article</span>
                    </button>
                </div>
            </div>

            {/* Feed Items */}
            {feedItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 py-3 shadow-sm">
                    {/* Item Header */}
                    <div className="flex justify-between px-4 mb-2">
                        <div className="flex gap-2">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-lg">
                                {item.author.avatar}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 flex items-center gap-1 hover:text-[#0066FF] hover:underline cursor-pointer">
                                    {item.author.name}
                                    <span className="text-xs font-normal text-gray-400">• 1st</span>
                                </span>
                                <span className="text-[11px] text-gray-500 truncate w-48 sm:w-80">{item.author.role}</span>
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                    {item.author.time} • <GlobeAltIcon className="h-3 w-3" />
                                </span>
                            </div>
                        </div>
                        <button className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center transition-colors">
                            <EllipsisHorizontalIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Item Content */}
                    <div className="px-4 mb-3">
                        <p className="text-sm text-gray-800 leading-normal">{item.content}</p>
                        {item.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-sm font-bold text-[#0066FF] hover:underline cursor-pointer">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image if exists */}
                    {item.image && (
                        <div className="mb-3">
                            <img src={item.image} alt="Post content" className="w-full h-auto max-h-[512px] object-cover" />
                        </div>
                    )}

                    {/* Project card if exists */}
                    {item.projects && (
                        <div className="px-4 mb-3">
                            {item.projects.map((proj, idx) => (
                                <div key={idx} className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex justify-between items-center group cursor-pointer hover:bg-blue-50/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded ${proj.color || 'bg-blue-500'} flex items-center justify-center text-white font-bold`}>
                                            {proj.title[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#0066FF]">{proj.title}</h4>
                                            <p className="text-xs text-gray-500">{proj.status}</p>
                                        </div>
                                    </div>
                                    <button className="px-3 py-1 bg-white border border-[#0066FF] text-[#0066FF] text-xs font-bold rounded-full hover:bg-blue-50 transition-colors">
                                        Join
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Interaction Stats */}
                    <div className="px-4 flex justify-between items-center pb-2 border-b border-gray-50">
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#0066FF] cursor-pointer">
                            <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <HandThumbUpSolidIcon className="h-2.5 w-2.5" />
                                </div>
                            </div>
                            <span>{item.likes}</span>
                        </div>
                        <div className="flex gap-2 text-[11px] text-gray-500">
                            <span className="hover:text-[#0066FF] hover:underline cursor-pointer">{item.comments} comments</span>
                            <span>•</span>
                            <span className="hover:text-[#0066FF] hover:underline cursor-pointer">2 shares</span>
                        </div>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex px-2 pt-1">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:bg-gray-100 rounded transition-colors group">
                            <HandThumbUpIcon className="h-5 w-5 group-hover:scale-110" />
                            <span className="text-sm font-bold">Like</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:bg-gray-100 rounded transition-colors group">
                            <ChatBubbleLeftIcon className="h-5 w-5 group-hover:scale-110" />
                            <span className="text-sm font-bold">Comment</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:bg-gray-100 rounded transition-colors group">
                            <ShareIcon className="h-5 w-5 group-hover:scale-110" />
                            <span className="text-sm font-bold">Repost</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:bg-gray-100 rounded transition-colors group">
                            <PaperAirplaneIcon className="h-5 w-5 -rotate-45 group-hover:scale-110" />
                            <span className="text-sm font-bold">Send</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomeFeed;
