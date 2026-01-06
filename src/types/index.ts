export interface Roadmap {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  duration: string;
  author: string;
  image?: string;
  youtubeUrl: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  role: string;
  techStack: string[];
  duration: string;
  githubUrl?: string;
  liveUrl?: string;
  thumbnailUrl?: string;
  createdAt: string | number | { seconds: number; nanoseconds: number };
  stars?: number;
  language?: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  role: string;
  isAdmin?: boolean;
  headline?: string;
  institution: string;
  avatar: string;
  skills: string[];
  connectionCount?: number;
  mutualConnectionsCount?: number;
  privacySettings?: {
    allowIncomingRequests: boolean;
  };
  lastActive?: string | number | { seconds: number; nanoseconds: number };
  bio?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  stats?: {
    followers: number;
    projects: number;
  };
}