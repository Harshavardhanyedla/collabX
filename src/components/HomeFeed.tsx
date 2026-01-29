import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    EllipsisHorizontalIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';
import { auth } from '../lib/firebase';
import { createPost, listenToFeed, toggleLike, getUserLikes } from '../lib/posts';
import { containsProfanity, getProfanityErrorMessage, filterProfanity } from '../utils/profanityFilter';
import { fetchConnections } from '../lib/networking';
import { getOrCreateConversation, sendMessage } from '../lib/messaging';
import type { Post, UserProfile } from '../types';

const HomeFeed: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [profanityError, setProfanityError] = useState('');
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [loadingLikes, setLoadingLikes] = useState<{ [key: string]: boolean }>({});

    // Share Modal State
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [postToShare, setPostToShare] = useState<Post | null>(null);
    const [connections, setConnections] = useState<UserProfile[]>([]);
    const [loadingConnections, setLoadingConnections] = useState(false);
    const [sharingIds, setSharingIds] = useState<Set<string>>(new Set());

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

        // Check for profanity before posting
        const profanityCheck = containsProfanity(newPostContent);
        if (profanityCheck.hasProfanity) {
            setProfanityError(getProfanityErrorMessage(profanityCheck.foundWords));
            return;
        }
        setProfanityError('');

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

    const navigateToProfile = (userId: string) => {
        navigate(`/profile/${userId}`);
    };

    const openShareModal = async (post: Post) => {
        if (!user) return;
        setPostToShare(post);
        setIsShareModalOpen(true);

        if (connections.length === 0) {
            setLoadingConnections(true);
            try {
                // Assuming fetchConnections returns UserProfile[]
                // We need to cast or ensure types match. 
                // The fetchConnections returns (UserProfile | null)[], filtered to UserProfile[]
                const conns = await fetchConnections(user.uid);
                setConnections(conns as UserProfile[]);
            } catch (error) {
                console.error("Failed to fetch connections:", error);
            } finally {
                setLoadingConnections(false);
            }
        }
    };

    const handleSharePost = async (targetUserId: string) => {
        if (!user || !postToShare) return;

        setSharingIds(prev => new Set(prev).add(targetUserId));

        try {
            const conversationId = await getOrCreateConversation(targetUserId);
            const shareContent = `Shared a post by ${postToShare.authorName}:\n\n${postToShare.content.substring(0, 100)}...`;

            await sendMessage(conversationId, shareContent);

            // Optional: You could show a transient success message here
        } catch (error) {
            console.error("Failed to share post:", error);
            setSharingIds(prev => {
                const next = new Set(prev);
                next.delete(targetUserId);
                return next;
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Create Post Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-lg shrink-0 overflow-hidden cursor-pointer" onClick={() => user && navigateToProfile(user.uid)}>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Me" className="w-full h-full object-cover" />
                        ) : (
                            user?.displayName?.[0] || user?.email?.[0] || 'U'
                        )}
                    </div>
                    <form onSubmit={handleCreatePost} className="flex-1">
                        {profanityError && (
                            <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {profanityError}
                            </div>
                        )}
                        <textarea
                            value={newPostContent}
                            onChange={(e) => {
                                setNewPostContent(e.target.value);
                                if (profanityError) setProfanityError('');
                            }}
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
            </div>

            {/* Feed Items */}
            {posts.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 py-3 shadow-sm">
                    {/* Item Header */}
                    <div className="flex justify-between px-4 mb-2">
                        <div className="flex gap-2">
                            <div
                                onClick={() => navigateToProfile(item.userId)}
                                className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#0066FF] font-bold text-lg overflow-hidden shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                {item.authorAvatar ? (
                                    <img src={item.authorAvatar} alt={filterProfanity(item.authorName)} className="w-full h-full object-cover" />
                                ) : (
                                    filterProfanity(item.authorName)[0]
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span
                                    onClick={() => navigateToProfile(item.userId)}
                                    className="text-sm font-bold text-gray-900 flex items-center gap-1 hover:text-[#0066FF] hover:underline cursor-pointer"
                                >
                                    {filterProfanity(item.authorName)}
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
                        <p className="text-sm text-gray-800 leading-normal whitespace-pre-wrap">{filterProfanity(item.content)}</p>
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
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded transition-colors group ${likedPosts.has(item.id)
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

                        <button
                            onClick={() => openShareModal(item)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-gray-500 hover:bg-gray-100 rounded transition-colors group"
                        >
                            <PaperAirplaneIcon className="h-5 w-5 -rotate-45 group-hover:scale-110 group-hover:text-[#0066FF]" />
                            <span className="text-sm font-bold group-hover:text-[#0066FF]">Share</span>
                        </button>
                    </div>
                </div>
            ))}

            {/* Share/Send Modal */}
            {isShareModalOpen && postToShare && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsShareModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Share with Connections</h3>
                            <button onClick={() => setIsShareModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-[200px]">
                            {loadingConnections ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : connections.length > 0 ? (
                                <div className="space-y-3">
                                    {connections.map(conn => (
                                        <div key={conn.uid} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden">
                                                    {conn.avatar ? (
                                                        <img src={conn.avatar} alt={conn.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold">
                                                            {conn.name[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{conn.name}</p>
                                                    <p className="text-xs text-gray-500 truncate w-40">{conn.role || 'Student'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSharePost(conn.uid)}
                                                disabled={sharingIds.has(conn.uid)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${sharingIds.has(conn.uid)
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                    }`}
                                            >
                                                {sharingIds.has(conn.uid) ? 'Sent' : 'Send'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No connections found.</p>
                                    <p className="text-sm mt-1">Connect with students to share posts!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
