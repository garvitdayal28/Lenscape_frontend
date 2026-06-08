'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Heart, MessageCircle, Share2, X, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Artwork, Category } from '@/types';

// Mock data for artworks
const mockArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Digital Horizon',
    description: 'A journey through digital landscapes exploring the intersection of technology and creativity.',
    category: 'digital-art',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
    videoUrl: null,
    artist: {
      id: 'a1',
      name: 'Alex Chen',
      email: 'alex@college.edu',
      college: 'MIT',
      branch: 'Digital Design',
      year: '3rd Year',
      avatar: null,
      bio: 'Creating digital art that explores the intersection of technology and creativity.',
      joinedDate: new Date('2023-09-01'),
    },
    votes: 124,
    comments: [],
    createdAt: new Date('2024-01-15'),
    status: 'approved',
  },
  {
    id: '2',
    title: 'Neon Dreams',
    description: 'Cyberpunk-inspired photography capturing the essence of urban nightlife.',
    category: 'photography',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400',
    videoUrl: null,
    artist: {
      id: 'a2',
      name: 'Sarah Kim',
      email: 'sarah@college.edu',
      college: 'Stanford',
      branch: 'Photography',
      year: '2nd Year',
      avatar: null,
      bio: 'Capturing the essence of urban nightlife through my lens.',
      joinedDate: new Date('2023-09-01'),
    },
    votes: 89,
    comments: [],
    createdAt: new Date('2024-01-20'),
    status: 'approved',
  },
  {
    id: '3',
    title: 'Motion Study',
    description: 'Experimental motion graphics exploring the boundaries of movement and storytelling.',
    category: 'animation',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    videoUrl: null,
    artist: {
      id: 'a3',
      name: 'Mike Johnson',
      email: 'mike@college.edu',
      college: 'RISD',
      branch: 'Animation',
      year: '4th Year',
      avatar: null,
      bio: 'Exploring the boundaries of motion and storytelling.',
      joinedDate: new Date('2023-09-01'),
    },
    votes: 156,
    comments: [],
    createdAt: new Date('2024-01-18'),
    status: 'approved',
  },
  {
    id: '4',
    title: 'Urban Flow',
    description: 'A cinematic journey through city streets and hidden corners.',
    category: 'filmmaking',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    videoUrl: null,
    artist: {
      id: 'a4',
      name: 'Emma Wilson',
      email: 'emma@college.edu',
      college: 'USC',
      branch: 'Film Production',
      year: '3rd Year',
      avatar: null,
      bio: 'Telling stories through the lens of a camera.',
      joinedDate: new Date('2023-09-01'),
    },
    votes: 201,
    comments: [],
    createdAt: new Date('2024-01-22'),
    status: 'approved',
  },
  {
    id: '5',
    title: 'Abstract Dreams',
    description: 'Hand-drawn illustrations exploring surreal and dreamlike concepts.',
    category: 'illustration',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400',
    videoUrl: null,
    artist: {
      id: 'a5',
      name: 'David Lee',
      email: 'david@college.edu',
      college: 'CalArts',
      branch: 'Illustration',
      year: '2nd Year',
      avatar: null,
      bio: 'Bringing imagination to life through ink and color.',
      joinedDate: new Date('2023-09-01'),
    },
    votes: 78,
    comments: [],
    createdAt: new Date('2024-01-25'),
    status: 'approved',
  },
  {
    id: '6',
    title: 'Kinetic Energy',
    description: 'Dynamic motion graphics with bold colors and smooth transitions.',
    category: 'motion-graphics',
    imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400',
    videoUrl: null,
    artist: {
      id: 'a6',
      name: 'Lisa Park',
      email: 'lisa@college.edu',
      college: 'SVA',
      branch: 'Motion Graphics',
      year: '4th Year',
      avatar: null,
      bio: 'Creating visual experiences that move and inspire.',
      joinedDate: new Date('2023-09-01'),
    },
    votes: 134,
    comments: [],
    createdAt: new Date('2024-01-28'),
    status: 'approved',
  },
];

const categories: Category[] = [
  'photography',
  'filmmaking',
  'animation',
  'digital-art',
  'illustration',
  'motion-graphics',
  'other',
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'most-voted', label: 'Most Voted' },
  { value: 'trending', label: 'Trending' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [votedCategories, setVotedCategories] = useState<Category[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>(mockArtworks);
  const [commentedArtworks, setCommentedArtworks] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleVote = (artwork: Artwork) => {
    if (votedCategories.includes(artwork.category)) {
      return; // Already voted in this category
    }
    
    setVotedCategories([...votedCategories, artwork.category]);
    setArtworks(artworks.map(a => 
      a.id === artwork.id ? { ...a, votes: a.votes + 1 } : a
    ));
  };

  const hasVotedInCategory = (category: Category) => votedCategories.includes(category);

  const handleComment = (artwork: Artwork) => {
    if (!newComment.trim() || commentedArtworks.includes(artwork.id)) {
      return;
    }

    const comment = {
      id: Date.now().toString(),
      artworkId: artwork.id,
      userId: 'user1',
      userName: 'You',
      content: newComment,
      createdAt: new Date(),
    };

    setArtworks(artworks.map(a => 
      a.id === artwork.id 
        ? { ...a, comments: [...a.comments, comment] }
        : a
    ));
    
    setCommentedArtworks([...commentedArtworks, artwork.id]);
    setNewComment('');
  };

  const hasCommentedOnArtwork = (artworkId: string) => commentedArtworks.includes(artworkId);

  // Filter artworks
  const filteredArtworks = artworks.filter((artwork) => {
    const matchesCategory = selectedCategory === 'all' || artwork.category === selectedCategory;
    const matchesSearch = artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artwork.artist.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (selectedSort === 'most-voted') {
      return b.votes - a.votes;
    } else if (selectedSort === 'trending') {
      return b.votes - a.votes; // Simplified trending logic
    }
    // latest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-y2k-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-chrome hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-sans text-sm tracking-widest uppercase">Back</span>
              </motion.button>
            </Link>
            
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text">
              Gallery
            </h1>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full hover:bg-white/10 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span className="font-sans text-sm tracking-widest uppercase hidden md:block">Filter</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chrome" />
            <input
              type="text"
              placeholder="Search artworks or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-sans text-xs tracking-widest uppercase transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-electric-blue to-neon-purple text-white'
                  : 'glass-panel hover:bg-white/10'
              }`}
            >
              All
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-sans text-xs tracking-widest uppercase transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-y2k-pink to-y2k-cyan text-white'
                    : 'glass-panel hover:bg-white/10'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-4 py-2 glass-panel rounded-full bg-transparent border-none outline-none cursor-pointer font-sans text-xs tracking-widest uppercase"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-y2k-black">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pb-16">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {sortedArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="break-inside-avoid"
            >
              <div
                className="glass-panel rounded-3xl overflow-hidden cursor-pointer group y2k-border"
                onClick={() => setSelectedArtwork(artwork)}
              >
                {artwork.thumbnailUrl && (
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={artwork.thumbnailUrl}
                      alt={artwork.title}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-y2k-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Overlay Actions */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Share2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-display text-xl font-bold mb-1">{artwork.title}</h3>
                  <p className="font-sans text-chrome text-sm mb-3">{artwork.artist.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-y2k-pink uppercase tracking-widest">
                      {artwork.category}
                    </span>
                    <div className="flex items-center gap-1 text-chrome text-sm">
                      <Heart className="w-4 h-4" />
                      <span>{artwork.votes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {sortedArtworks.length === 0 && (
          <div className="text-center py-32">
            <Sparkles className="w-16 h-16 text-y2k-cyan mx-auto mb-4 star-sparkle" />
            <p className="font-sans text-xl text-chrome">No artworks found</p>
          </div>
        )}
      </div>

      {/* Artwork Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-y2k-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto glass-panel-dark rounded-3xl y2k-border"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedArtwork(null)}
                className="sticky top-4 right-4 float-right w-12 h-12 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10 neon-glow-pink"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image */}
                  {selectedArtwork.imageUrl && (
                    <div className="aspect-[4/5] rounded-3xl overflow-hidden y2k-border">
                      <Image
                        src={selectedArtwork.imageUrl}
                        alt={selectedArtwork.title}
                        width={800}
                        height={1000}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Details */}
                  <div className="flex flex-col justify-center">
                    <span className="font-sans text-xs text-y2k-pink uppercase tracking-widest mb-2">
                      {selectedArtwork.category}
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                      {selectedArtwork.title}
                    </h2>
                    <p className="font-sans text-chrome mb-6">by {selectedArtwork.artist.name}</p>
                    <p className="font-sans text-chrome/80 mb-8 leading-relaxed">
                      {selectedArtwork.description}
                    </p>
                    
                    {/* Artist Info */}
                    <div className="glass-panel rounded-3xl p-6 mb-8 y2k-border">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                          <span className="font-display text-2xl font-bold">
                            {selectedArtwork.artist.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-display text-lg font-bold">{selectedArtwork.artist.name}</h4>
                          <p className="font-sans text-chrome text-sm">
                            {selectedArtwork.artist.college} • {selectedArtwork.artist.branch}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectedArtwork && handleVote(selectedArtwork)}
                        disabled={selectedArtwork ? hasVotedInCategory(selectedArtwork.category) : false}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-sans text-sm tracking-widest uppercase rounded-full ${
                          selectedArtwork && hasVotedInCategory(selectedArtwork.category)
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-y2k-lime to-y2k-cyan text-white neon-glow-cyan'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${selectedArtwork && hasVotedInCategory(selectedArtwork.category) ? 'fill-current' : ''}`} />
                        {selectedArtwork && hasVotedInCategory(selectedArtwork.category) ? 'Voted' : 'Vote'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 glass-panel text-white font-sans text-sm tracking-widest uppercase rounded-full hover:bg-white/10 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Comment
                      </motion.button>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-8">
                      <h3 className="font-display text-2xl font-bold mb-4">Comments ({selectedArtwork.comments.length})</h3>
                      
                      {/* Comment Input */}
                      {!hasCommentedOnArtwork(selectedArtwork.id) && (
                        <div className="mb-6">
                          <div className="flex gap-4">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="flex-1 px-4 py-3 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleComment(selectedArtwork)}
                              className="px-6 py-3 bg-gradient-to-r from-y2k-pink to-y2k-cyan text-white font-sans text-sm tracking-widest uppercase rounded-full neon-glow-pink"
                            >
                              Post
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="space-y-4 max-h-60 overflow-y-auto">
                        {selectedArtwork.comments.length === 0 ? (
                          <p className="font-sans text-chrome text-center py-8">No comments yet. Be the first to comment!</p>
                        ) : (
                          selectedArtwork.comments.map((comment) => (
                            <div key={comment.id} className="glass-panel rounded-2xl p-4 y2k-border">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-y2k-lime to-y2k-cyan flex items-center justify-center star-sparkle">
                                  <span className="font-display text-sm font-bold">
                                    {comment.userName.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-sans font-semibold text-white">{comment.userName}</span>
                                    <span className="font-sans text-xs text-chrome">
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="font-sans text-chrome/80">{comment.content}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
