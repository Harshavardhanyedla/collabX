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