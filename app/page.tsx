'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Play, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Artwork, Category } from '@/types';
import { gsap } from 'gsap';
import ThreeBackground from '@/components/ThreeBackground';

// Mock data for featured artworks
const featuredArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Digital Horizon',
    description: 'A journey through digital landscapes',
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
    description: 'Cyberpunk-inspired photography',
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
    description: 'Experimental motion graphics',
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
];

const categories: Category[] = [
  'photography',
  'filmmaking',
  'animation',
  'digital-art',
  'illustration',
  'motion-graphics',
];

const stats = [
  { value: '500+', label: 'Artworks' },
  { value: '200+', label: 'Artists' },
  { value: '10K+', label: 'Votes' },
  { value: '5K+', label: 'Comments' },
];

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const textY = useTransform(scrollY, [0, 300], [0, 100]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (heroTextRef.current) {
      gsap.from(heroTextRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-y2k-black overflow-hidden">
      <ThreeBackground />
      {/* Hero Section */}
      <motion.section
        ref={containerRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex items-center justify-center"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-y2k-pink/30 blur-3xl animate-glow star-sparkle" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-y2k-cyan/30 blur-3xl animate-glow star-sparkle" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-y2k-lime/20 to-y2k-purple/20 blur-3xl" />
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-y2k-yellow/20 blur-3xl animate-glow" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Floating Artwork Frames */}
        <div className="absolute inset-0 pointer-events-none">
          {featuredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              animate={{
                x: mousePosition.x * 100 * (index + 1),
                y: mousePosition.y * 100 * (index + 1),
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 30 }}
              className="absolute"
              style={{
                top: `${20 + index * 20}%`,
                left: `${10 + index * 25}%`,
              }}
            >
              <div className="w-32 h-40 md:w-48 md:h-64 glass-panel rounded-3xl p-2 transform rotate-12 hover:rotate-0 transition-transform duration-500 y2k-border">
                {artwork.thumbnailUrl && (
                  <Image
                    src={artwork.thumbnailUrl}
                    alt={artwork.title}
                    width={200}
                    height={250}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          ref={heroTextRef}
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <Sparkles className="w-16 h-16 text-y2k-pink mx-auto mb-4 star-sparkle" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-display text-7xl md:text-9xl font-bold mb-6 gradient-text"
          >
            Lenscape
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-sans text-xl md:text-2xl text-chrome mb-12 max-w-2xl mx-auto"
          >
            Where Creativity Becomes an Experience
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-y2k-pink to-y2k-cyan text-white font-sans text-sm tracking-widest uppercase rounded-full neon-glow-pink"
              >
                <Play className="w-5 h-5" />
                Explore Gallery
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/submit">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 glass-panel text-white font-sans text-sm tracking-widest uppercase rounded-full hover:bg-white/10 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Submit Artwork
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-chrome rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-3 bg-y2k-lime rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Section 1: Floating Gallery Frames */}
      <section className="min-h-screen py-32 px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-16 text-center gradient-text">
            Featured Artworks
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <div className="glass-panel rounded-3xl overflow-hidden y2k-border">
                  {artwork.imageUrl && (
                    <div className="aspect-[4/5] relative">
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        width={400}
                        height={500}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-y2k-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-bold mb-2">{artwork.title}</h3>
                    <p className="font-sans text-chrome text-sm mb-4">{artwork.artist.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs text-y2k-pink uppercase tracking-widest">
                        {artwork.category}
                      </span>
                      <span className="font-sans text-xs text-chrome">
                        {artwork.votes} votes
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 2: Virtual Corridor */}
      <section className="min-h-screen py-32 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-y2k-black via-y2k-purple/10 to-y2k-black" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-7xl mx-auto text-center"
        >
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-8 gradient-text">
            Enter the Gallery
          </h2>
          <p className="font-sans text-xl text-chrome mb-12 max-w-2xl mx-auto">
            Experience art like never before in our immersive virtual exhibition space
          </p>
          
          <Link href="/gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-y2k-cyan to-y2k-lime text-white font-sans text-sm tracking-widest uppercase rounded-full neon-glow-cyan"
            >
              Start Your Journey
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Section 3: Category Showcase */}
      <section className="min-h-screen py-32 px-4 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-16 text-center gradient-text">
            Explore Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="glass-panel rounded-3xl p-6 text-center cursor-pointer hover:bg-white/10 transition-all y2k-border"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-sans text-sm font-semibold uppercase tracking-widest">
                  {category}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 4: Statistics */}
      <section className="min-h-screen py-32 px-4 md:px-8 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-y2k-lime/20 to-y2k-purple/20 blur-3xl" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-16 text-center gradient-text">
            The Numbers
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-panel rounded-3xl p-8 text-center y2k-border"
              >
                <div className="font-display text-5xl md:text-6xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="font-sans text-chrome uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 5: CTA */}
      <section className="min-h-screen py-32 px-4 md:px-8 lg:px-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-8 gradient-text">
            Ready to Create?
          </h2>
          <p className="font-sans text-xl text-chrome mb-12">
            Submit your artwork and join the most creative digital art exhibition
          </p>
          
          <Link href="/submit">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-y2k-yellow to-y2k-orange text-white font-sans text-sm tracking-widest uppercase rounded-full neon-glow-lime"
            >
              <Upload className="w-6 h-6" />
              Submit Your Artwork
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Artwork Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-y2k-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full glass-panel-dark rounded-3xl p-8 y2k-border"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors neon-glow-pink"
              >
                ×
              </button>
              
              {selectedArtwork.imageUrl && (
                <div className="aspect-[4/3] mb-6 rounded-3xl overflow-hidden y2k-border">
                  <Image
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h2 className="font-display text-4xl font-bold mb-2">{selectedArtwork.title}</h2>
              <p className="font-sans text-chrome mb-4">by {selectedArtwork.artist.name}</p>
              <p className="font-sans text-chrome/80">{selectedArtwork.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
