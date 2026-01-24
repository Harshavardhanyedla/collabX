import React, { useState, useEffect } from 'react';
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
import { auth } from '../lib/firebase';
import { createPost, listenToFeed, toggleLike, getUserLikes } from '../lib/posts';
import type { Post } from '../types';

const HomeFeed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [loadingLikes, setLoadingLikes] = useState<{ [key: string]: boolean }>({});
    const user = auth.currentUser;

    useEffect(() => {
        const unsubscribe = listenToFeed((fetchedPosts) => {
            setPosts(fetchedPosts);
        });

        // Fetch user's likes
        if (user) {
            getUserLikes(user.uid).then(likedIds => {
                setLikedPosts(new Set(likedIds));
            });
        }

        return () => unsubscribe();
    }, [user]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newPostContent.trim() || isPosting) return;

        setIsPosting(true);
        try {
            await createPost({
                userId: user.uid,
                authorName: user.displayName || 'Anonymous User',
                authorAvatar: user.photoURL || '',
                authorRole: 'Student', // Default for now
                content: newPostContent,
                type: 'post',
                tags: (newPostContent.match(/#\w+/g) || [])
            });
            setNewPostContent('');
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleLike = async (postId: string) => {
        if (!user || loadingLikes[postId]) return;

        const isLiked = likedPosts.has(postId);

        // Optimistic UI update
        const originalPosts = [...posts];
        const originalLikedPosts = new Set(likedPosts);

        setLikedPosts(prev => {
            const next = new Set(prev);
            if (isLiked) next.delete(postId);
            else next.add(postId);
            return next;
        });

        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                const count = post.likesCount || 0;
                return {
                    ...post,
                    likesCount: isLiked ? Math.max(0, count - 1) : count + 1
                };
            }
            return post;
        }));

        setLoadingLikes(prev => ({ ...prev, [postId]: true }));

        try {
            await toggleLike(postId, user.uid);
        } catch (error) {
            console.error("Failed to toggle like:", error);
            // Rollback on error
            setPosts(originalPosts);
            setLikedPosts(originalLikedPosts);
        } finally {
            setLoadingLikes(prev => ({ ...prev, [postId]: false }));
        }
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffSeconds < 60) return `${diffSeconds}s ago`;
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
        return `${Math.floor(diffSeconds / 86400)}d ago`;
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Create Post Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-lg shrink-0 overflow-hidden">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                        ) : (
                            user?.displayName?.[0] || user?.email?.[0] || 'U'
                        )}
                    </div>
                    <form onSubmit={handleCreatePost} className="flex-1">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="Start a project or share an update..."
                            className="w-full text-left px-4 py-3 border border-gray-200 rounded-2xl text-gray-800 hover:bg-gray-50 transition-colors text-sm font-medium resize-none focus:outline-none focus:ring-1 focus:ring-blue-100"
                            rows={2}
                        />
                        {newPostContent.trim() && (
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={isPosting}
                                    className="bg-[#0066FF] text-white px-4 py-1.5 rounded-full text-sm font-bold disabled:opacity-50 hover:bg-blue-600 transition-colors"
                                >
                                    {isPosting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
                <div className="flex justify-between mt-3 px-2 border-t border-gray-50 pt-2">
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
            {posts.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 py-3 shadow-sm">
                    {/* Item Header */}
                    <div className="flex justify-between px-4 mb-2">
                        <div className="flex gap-2">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-lg overflow-hidden shrink-0">
                                {item.authorAvatar ? (
                                    <img src={item.authorAvatar} alt={item.authorName} className="w-full h-full object-cover" />
                                ) : (
                                    item.authorName[0]
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 flex items-center gap-1 hover:text-[#0066FF] hover:underline cursor-pointer">
                                    {item.authorName}
                                    <span className="text-xs font-normal text-gray-400">• 1st</span>
                                </span>
                                <span className="text-[11px] text-gray-500 truncate w-48 sm:w-80">{item.authorRole || 'Student'}</span>
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                    {formatTime(item.createdAt)} • <GlobeAltIcon className="h-3 w-3" />
                                </span>
                            </div>
                        </div>
                        <button className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center transition-colors">
                            <EllipsisHorizontalIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Item Content */}
                    <div className="px-4 mb-3">
                        <p className="text-sm text-gray-800 leading-normal whitespace-pre-wrap">{item.content}</p>
                        {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-sm font-bold text-[#0066FF] hover:underline cursor-pointer">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image if exists */}
                    {item.imageUrl && (
                        <div className="mb-3">
                            <img src={item.imageUrl} alt="Post content" className="w-full h-auto max-h-[512px] object-cover" />
                        </div>
                    )}

                    {/* Interaction Stats */}
                    <div className="px-4 flex justify-between items-center pb-2 border-b border-gray-50">
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#0066FF] cursor-pointer">
                            <div className="flex -space-x-1">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${likedPosts.has(item.id) ? 'bg-[#0066FF]' : 'bg-gray-400'}`}>
                                    <HandThumbUpSolidIcon className="h-2.5 w-2.5" />
                                </div>
                            </div>
                            <span className={likedPosts.has(item.id) ? 'text-[#0066FF] font-bold' : ''}>
                                {item.likesCount || 0}
                            </span>
                        </div>
                        <div className="flex gap-2 text-[11px] text-gray-500">
                            <span className="hover:text-[#0066FF] hover:underline cursor-pointer">{item.commentsCount || 0} comments</span>
                            <span>•</span>
                            <span className="hover:text-[#0066FF] hover:underline cursor-pointer">{item.repostsCount || 0} shares</span>
                        </div>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex px-2 pt-1">
                        <button
                            onClick={() => handleLike(item.id)}
                            disabled={loadingLikes[item.id]}
                            className={`flex_1 flex items-center justify-center gap-2 py-2.5 rounded transition-colors group ${likedPosts.has(item.id)
                                    ? 'text-[#0066FF] bg-blue-50/50'
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {likedPosts.has(item.id) ? (
                                <HandThumbUpSolidIcon className={`h-5 w-5 ${loadingLikes[item.id] ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                            ) : (
                                <HandThumbUpIcon className={`h-5 w-5 ${loadingLikes[item.id] ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                            )}
                            <span className="text-sm font-bold">{likedPosts.has(item.id) ? 'Liked' : 'Like'}</span>
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

            {posts.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                    <GlobeAltIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No posts yet. Be the first to share something!</p>
                </div>
            )}
        </div>
    );
};

export default HomeFeed;
