'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Heart, MessageCircle, Award, Upload, Settings, LogOut, Sparkles, Trophy, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Artwork, Category, Achievement } from '@/types';

// Mock user data
const mockUser = {
  id: 'user1',
  name: 'Alex Chen',
  email: 'alex@college.edu',
  college: 'MIT',
  branch: 'Digital Design',
  year: '3rd Year',
  avatar: null,
  bio: 'Creating digital art that explores the intersection of technology and creativity.',
  votedCategories: [] as Category[],
  commentedArtworks: [] as string[],
  submissions: [] as Artwork[],
  achievements: [] as Achievement[],
  joinedDate: new Date('2023-09-01'),
};

// Mock submissions
const mockSubmissions: Artwork[] = [
  {
    id: '1',
    title: 'Digital Horizon',
    description: 'A journey through digital landscapes',
    category: 'digital-art',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
    videoUrl: null,
    artist: mockUser,
    votes: 124,
    comments: [],
    createdAt: new Date('2024-01-15'),
    status: 'approved',
  },
  {
    id: '2',
    title: 'Neon Dreams',
    description: 'Cyberpunk-inspired digital art',
    category: 'digital-art',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    videoUrl: null,
    artist: mockUser,
    votes: 89,
    comments: [],
    createdAt: new Date('2024-01-20'),
    status: 'approved',
  },
];

// Mock achievements
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Submission',
    description: 'Submitted your first artwork',
    icon: '🎨',
    unlockedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Rising Star',
    description: 'Received 100 votes on your artworks',
    icon: '⭐',
    unlockedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Community Builder',
    description: 'Made 10 comments on artworks',
    icon: '💬',
    unlockedAt: new Date('2024-01-25'),
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'voting' | 'achievements'>('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalVotes = mockSubmissions.reduce((sum, artwork) => sum + artwork.votes, 0);
  const totalComments = mockSubmissions.reduce((sum, artwork) => sum + artwork.comments.length, 0);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'submissions' as const, label: 'My Artworks', icon: Upload },
    { id: 'voting' as const, label: 'Voting History', icon: Heart },
    { id: 'achievements' as const, label: 'Achievements', icon: Award },
  ];

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
              Profile
            </h1>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-dark rounded-3xl p-8 mb-8 y2k-border"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                <span className="font-display text-5xl font-bold">
                  {mockUser.name.charAt(0)}
                </span>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-y2k-lime to-y2k-cyan flex items-center justify-center star-sparkle"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="font-display text-4xl font-bold mb-2">{mockUser.name}</h2>
              <p className="font-sans text-chrome mb-4">
                {mockUser.college} • {mockUser.branch} • {mockUser.year}
              </p>
              <p className="font-sans text-chrome/80 mb-6">{mockUser.bio}</p>
              
              {/* Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="font-display text-3xl font-bold gradient-text">
                    {mockSubmissions.length}
                  </div>
                  <div className="font-sans text-xs text-chrome uppercase tracking-widest">
                    Artworks
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl font-bold gradient-text">
                    {totalVotes}
                  </div>
                  <div className="font-sans text-xs text-chrome uppercase tracking-widest">
                    Votes
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl font-bold gradient-text">
                    {totalComments}
                  </div>
                  <div className="font-sans text-xs text-chrome uppercase tracking-widest">
                    Comments
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 glass-panel rounded-full max-w-2xl">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-sans text-sm tracking-widest uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-y2k-pink to-y2k-cyan text-white'
                  : 'text-chrome hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Quick Stats */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-panel rounded-3xl p-6 y2k-border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Total Votes</h3>
                    <p className="font-sans text-chrome text-sm">Across all artworks</p>
                  </div>
                </div>
                <div className="font-display text-4xl font-bold gradient-text">{totalVotes}</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-panel rounded-3xl p-6 y2k-border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Achievements</h3>
                    <p className="font-sans text-chrome text-sm">Badges unlocked</p>
                  </div>
                </div>
                <div className="font-display text-4xl font-bold gradient-text">{mockAchievements.length}</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-panel rounded-3xl p-6 y2k-border"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">Comments</h3>
                    <p className="font-sans text-chrome text-sm">On other artworks</p>
                  </div>
                </div>
                <div className="font-display text-4xl font-bold gradient-text">{totalComments}</div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                className="glass-panel rounded-3xl p-6 md:col-span-2 lg:col-span-3 y2k-border"
              >
                <h3 className="font-display text-2xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 glass-panel rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-y2k-pink" />
                    <div className="flex-1">
                      <p className="font-sans text-white font-medium">Submitted "Digital Horizon"</p>
                      <p className="font-sans text-chrome text-sm">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 glass-panel rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-y2k-purple" />
                    <div className="flex-1">
                      <p className="font-sans text-white font-medium">Voted in Photography category</p>
                      <p className="font-sans text-chrome text-sm">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 glass-panel rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-y2k-pink" />
                    <div className="flex-1">
                      <p className="font-sans text-white font-medium">Commented on "Neon Dreams"</p>
                      <p className="font-sans text-chrome text-sm">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'submissions' && (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-2xl font-bold">My Artworks</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSubmitting(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-blue to-neon-purple text-white font-sans text-sm tracking-widest uppercase rounded-full"
                >
                  <Upload className="w-5 h-5" />
                  Submit New
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSubmissions.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel rounded-2xl overflow-hidden"
                  >
                    {artwork.thumbnailUrl && (
                      <div className="aspect-[4/5] relative">
                        <Image
                          src={artwork.thumbnailUrl}
                          alt={artwork.title}
                          width={400}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 px-3 py-1 glass-panel rounded-full">
                          <span className="font-sans text-xs text-electric-blue uppercase tracking-widest">
                            {artwork.status}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-display text-xl font-bold mb-1">{artwork.title}</h4>
                      <p className="font-sans text-silver text-sm mb-3">{artwork.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-silver text-sm">
                          <Heart className="w-4 h-4" />
                          <span>{artwork.votes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-silver text-sm">
                          <MessageCircle className="w-4 h-4" />
                          <span>{artwork.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'voting' && (
            <motion.div
              key="voting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel rounded-2xl p-8"
            >
              <h3 className="font-display text-2xl font-bold mb-6">Voting History</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass-panel rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-sans text-white font-medium">Photography</h4>
                      <p className="font-sans text-chrome text-sm">Voted for "Neon Dreams"</p>
                    </div>
                  </div>
                  <span className="font-sans text-chrome text-sm">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-4 glass-panel rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-sans text-white font-medium">Digital Art</h4>
                      <p className="font-sans text-chrome text-sm">Voted for "Digital Horizon"</p>
                    </div>
                  </div>
                  <span className="font-sans text-chrome text-sm">2 days ago</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="font-display text-2xl font-bold mb-6">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="glass-panel rounded-2xl p-6 text-center"
                  >
                    <div className="text-5xl mb-4">{achievement.icon}</div>
                    <h4 className="font-display text-xl font-bold mb-2">{achievement.title}</h4>
                    <p className="font-sans text-silver text-sm mb-4">{achievement.description}</p>
                    <span className="font-sans text-xs text-electric-blue uppercase tracking-widest">
                      {achievement.unlockedAt.toLocaleDateString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-deep-black/95 flex items-center justify-center p-4"
            onClick={() => setIsSubmitting(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-2xl w-full glass-panel-dark rounded-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsSubmitting(false)}
                className="absolute top-4 right-4 w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                ×
              </button>
              
              <h3 className="font-display text-3xl font-bold mb-6">Submit Artwork</h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block font-sans text-xs text-silver uppercase tracking-widest mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Artwork title"
                    className="w-full px-4 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-electric-blue transition-all"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs text-silver uppercase tracking-widest mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your artwork"
                    rows={4}
                    className="w-full px-4 py-4 glass-panel rounded-xl bg-transparent border-none outline-none focus:ring-2 focus:ring-electric-blue transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs text-silver uppercase tracking-widest mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-electric-blue transition-all cursor-pointer">
                    <option value="" className="bg-deep-black">Select category</option>
                    <option value="photography" className="bg-deep-black">Photography</option>
                    <option value="filmmaking" className="bg-deep-black">Filmmaking</option>
                    <option value="animation" className="bg-deep-black">Animation</option>
                    <option value="digital-art" className="bg-deep-black">Digital Art</option>
                    <option value="illustration" className="bg-deep-black">Illustration</option>
                    <option value="motion-graphics" className="bg-deep-black">Motion Graphics</option>
                    <option value="other" className="bg-deep-black">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-xs text-silver uppercase tracking-widest mb-2">
                    Upload Image
                  </label>
                  <div className="border-2 border-dashed border-silver/30 rounded-xl p-8 text-center hover:border-electric-blue transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-silver mx-auto mb-4" />
                    <p className="font-sans text-silver">Drag and drop or click to upload</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-electric-blue to-neon-purple text-white font-sans text-sm tracking-widest uppercase rounded-full neon-glow-blue"
                >
                  Submit Artwork
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
