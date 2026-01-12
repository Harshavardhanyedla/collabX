export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  link: string;
  is_official: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  content: string;
  imageUrl?: string;
  type: 'post' | 'project_update' | 'resource_share' | 'roadmap_completion';
  tags: string[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: any;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: any;
}

export interface Project {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  category: string;
  title: string;
  description: string;
  techStack: string[];
  rolesNeeded: string[];
  status: 'Open' | 'In Progress' | 'Closed';
  members: string[]; // Array of UIDs
  pendingRequests: string[]; // Array of UIDs
  githubUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: 'like' | 'comment' | 'repost' | 'project_invite' | 'project_request' | 'project_approved' | 'connection_request' | 'connection_accepted';
  postId?: string;
  projectId?: string;
  message?: string;
  read: boolean;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: string;
  isAdmin?: boolean;
  avatar?: string;
  headline?: string;
  college?: string;
  institution?: string;
  bio?: string;
  skills: string[];
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  stats?: {
    followers: number;
    projects: number;
    connections: number;
  };
  lastActive?: any;
}