export type Category = 
  | 'photography'
  | 'filmmaking'
  | 'animation'
  | 'digital-art'
  | 'illustration'
  | 'motion-graphics'
  | 'other';

export interface Artist {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string;
  avatar: string | null;
  bio: string;
  joinedDate: Date;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  category: Category;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  artist: Artist;
  votes: number;
  comments: Comment[];
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Comment {
  id: string;
  artworkId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  year: string;
  avatar: string | null;
  bio: string;
  votedCategories: Category[];
  commentedArtworks: string[];
  submissions: Artwork[];
  achievements: Achievement[];
  joinedDate: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface Vote {
  id: string;
  artworkId: string;
  userId: string;
  category: Category;
  createdAt: Date;
}
