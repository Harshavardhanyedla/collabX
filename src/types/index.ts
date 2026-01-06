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
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  author: string;
  image?: string;
  stars: number;
  language: string;
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