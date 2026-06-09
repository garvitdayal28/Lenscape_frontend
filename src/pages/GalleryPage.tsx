import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, MessageSquare, Send, Compass } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Artwork, Category } from '../types'
import ArtworkFrame from '../components/ArtworkFrame'
import ExhibitionNav from '../components/ExhibitionNav'

export default function GalleryPage() {
  const { artworks, categories, voteArtwork, commentArtwork, currentUser } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [selectedSort, setSelectedSort] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [commentContent, setCommentContent] = useState('')

  // Activate ceiling spotlights on artwork frames and nav items

  // Handle category query param from landing page clicks
  useEffect(() => {
    const catParam = searchParams.get('cat')
    if (catParam) {
      setSelectedCategory(catParam as Category)
    }
  }, [searchParams])

  // Filter approved works only
  const approvedArtworks = artworks.filter((a) => a.status === 'approved')

  // Filter results
  const filteredArtworks = approvedArtworks.filter((art) => {
    const matchesCategory =
      selectedCategory === 'all' || art.category === selectedCategory
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Sort results
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (selectedSort === 'most-voted') {
      return b.votes - a.votes
    } else if (selectedSort === 'trending') {
      return (
        b.votes +
        b.comments.length * 2 -
        (a.votes + a.comments.length * 2)
      )
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Dynamic visual identity mapping based on room (category)
  const roomThemes: Record<
    string,
    {
      bg: string
      text: string
      titleColor: string
      ambientGlow: string
      fontClass: string
      description: string
      extraClasses: string
    }
  > = {
    all: {
      bg: 'bg-[#080808]',
      text: 'text-exhibition-bone',
      titleColor: 'text-exhibition-gold',
      ambientGlow: 'from-exhibition-gold/10',
      fontClass: 'font-mono',
      description: 'The main hall displaying all creative streams under one dome.',
      extraClasses: '',
    },
    photography: {
      bg: 'bg-[#000000]',
      text: 'text-zinc-100',
      titleColor: 'text-white',
      ambientGlow: 'from-zinc-800/25',
      fontClass: 'font-mono',
      description: 'Room 01: Focus, high-contrast monochrome studies, and human capturing.',
      extraClasses: 'contrast-125 saturate-0',
    },
    filmmaking: {
      bg: 'bg-[#050505]',
      text: 'text-[#e2dac6]',
      titleColor: 'text-amber-500',
      ambientGlow: 'from-amber-950/20',
      fontClass: 'font-mono',
      description: 'Room 02: Cinematic narrative reels, storyboards, and retro grain.',
      extraClasses: 'crt-scanlines',
    },
    animation: {
      bg: 'bg-[#0a0512]',
      text: 'text-pink-100',
      titleColor: 'text-pink-500',
      ambientGlow: 'from-pink-900/20',
      fontClass: 'font-mono',
      description: 'Room 03: Playful render mechanics, motion, and digital keyframes.',
      extraClasses: '',
    },
    'digital-art': {
      bg: 'bg-[#01040a]',
      text: 'text-cyan-100',
      titleColor: 'text-cyan-400',
      ambientGlow: 'from-cyan-900/20',
      fontClass: 'font-mono',
      description: 'Room 04: Shader procedural algorithms, VR scapes, and cyberpunk neon.',
      extraClasses: '',
    },
    illustration: {
      bg: 'bg-[#0e0e0c]',
      text: 'text-[#dfd7c3]',
      titleColor: 'text-amber-700',
      ambientGlow: 'from-yellow-950/15',
      fontClass: 'font-serif',
      description: 'Room 05: Hand-drawn botanical studies, vector concepts, and organic ink.',
      extraClasses: '',
    },
    'motion-graphics': {
      bg: 'bg-[#020904]',
      text: 'text-emerald-100',
      titleColor: 'text-emerald-400',
      ambientGlow: 'from-emerald-900/20',
      fontClass: 'font-mono',
      description: 'Room 06: Kinetic typography loops and strobe color transitions.',
      extraClasses: '',
    },
    other: {
      bg: 'bg-[#0a0a0a]',
      text: 'text-zinc-300',
      titleColor: 'text-zinc-400',
      ambientGlow: 'from-zinc-900/20',
      fontClass: 'font-mono',
      description: 'Room 07: Alternative creative mediums and hybrid representations.',
      extraClasses: '',
    },
  }

  const currentTheme = roomThemes[selectedCategory] || roomThemes.all

  const handleVote = (artId: string) => {
    voteArtwork(artId)
    if (selectedArtwork && selectedArtwork.id === artId) {
      const updated = artworks.find((a) => a.id === artId)
      if (updated) setSelectedArtwork(updated)
    }
  }

  const handleCommentSubmit = (e: React.FormEvent, artId: string) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    const success = commentArtwork(artId, commentContent.trim())
    if (success) {
      setCommentContent('')
      const updated = artworks.find((a) => a.id === artId)
      if (updated) setSelectedArtwork(updated)
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-1000 overflow-x-hidden relative select-none ${currentTheme.bg} ${currentTheme.text} ${currentTheme.extraClasses}`}
    >
      {/* Spotlight Flashlight cursor */}
      {/* <SpotlightCursor /> */}

      {/* Navigation Guide */}
      <ExhibitionNav />

      {/* Header Room Banner */}
      <div className="pt-24 pb-16 px-6 md:px-12 max-w-6xl mx-auto flex flex-col items-center text-center relative">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-b ${currentTheme.ambientGlow} to-transparent blur-3xl rounded-full pointer-events-none -z-10`}
        />

        <div className="flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-zinc-500 uppercase">
          <Compass size={14} />
          <span>Museum Exhibition Rooms</span>
        </div>

        <h1 className="editorial-text text-5xl md:text-7xl font-light tracking-wide text-exhibition-bone">
          {selectedCategory === 'all'
            ? 'Grand Hall'
            : selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1).replace('-', ' ')}
        </h1>

        <p className="text-xs font-mono text-zinc-500 mt-4 max-w-md tracking-wider leading-relaxed">
          {currentTheme.description}
        </p>
      </div>

      {/* Architectural Room-Switch UI (Instead of filter pills) */}
      <div className="w-full border-t border-b border-zinc-900 bg-black/25 backdrop-blur-md sticky top-0 z-50">
        {/* Fade mask on right edge — signals more content to scroll */}
        <div className="relative">
          <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center justify-start md:justify-center gap-6 py-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`font-mono text-[10px] uppercase tracking-[0.25em] whitespace-nowrap transition-colors py-1 px-3 ${
              selectedCategory === 'all'
                ? 'text-exhibition-gold border-b border-exhibition-gold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            00 / Grand Hall
          </button>
          {categories.map((cat, idx) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-mono text-[10px] uppercase tracking-[0.25em] whitespace-nowrap transition-colors py-1 px-3 ${
                selectedCategory === cat
                  ? 'text-exhibition-gold border-b border-exhibition-gold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              0{idx + 1} / {cat.replace('-', ' ')}
            </button>
          ))}
        </div>
          {/* Right fade — indicates more tabs to scroll */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/80 to-transparent md:hidden" />
        </div>
      </div>

      {/* Control overlay: Minimal search + sorting */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row gap-4 items-center justify-between relative z-10">
        {/* Floating Minimal Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search placard, artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0c0c0c] border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-exhibition-gold/50"
          />
        </div>

        {/* Minimal Sorting Dropdown */}
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="bg-[#0c0c0c] border border-zinc-800 px-3 py-2 font-mono text-[10px] tracking-widest uppercase text-zinc-400 outline-none cursor-pointer hover:border-zinc-700"
        >
          <option value="latest">LATEST IN HALL</option>
          <option value="most-voted">MOST ACCLAIMED</option>
          <option value="trending">TRENDING ACTIVITY</option>
        </select>
      </div>

      {/* Main exhibition showcase (Artworks) */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-32 relative z-10">
        {sortedArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {sortedArtworks.map((artwork, idx) => {
              const isVoted = currentUser
                ? currentUser.votedCategories.includes(artwork.category)
                : false
              return (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.08, 0.4), duration: 0.8 }}
                  className={`${idx % 2 === 1 ? 'md:mt-16' : ''}`}
                >
                  <ArtworkFrame
                    artwork={artwork}
                    onClick={() => setSelectedArtwork(artwork)}
                    onVote={() => handleVote(artwork.id)}
                    isVoted={isVoted}
                  />
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-32 border border-zinc-900 bg-black/10">
            <Compass className="w-10 h-10 text-zinc-600 mx-auto mb-4 animate-pulse" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Chamber is Empty
            </h3>
            <p className="text-[10px] text-zinc-600 mt-2 font-mono">
              No submissions are approved in this category yet.
            </p>
          </div>
        )}
      </div>

      {/* Cinematic Modal Viewer overlay */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#000000]/98 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-5xl h-auto max-h-[90vh] md:h-[80vh] bg-[#0d0d0d] border border-exhibition-gold/30 shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 border border-exhibition-gold/20 flex items-center justify-center hover:bg-exhibition-gold hover:text-exhibition-void text-exhibition-gold transition-colors font-mono"
              >
                ×
              </button>

              {/* Left Side: Media display */}
              <div className="w-full md:w-[65%] h-64 sm:h-80 md:h-full flex-shrink-0 bg-black flex items-center justify-center relative p-6 border-b md:border-b-0 md:border-r border-zinc-900">
                <div className="absolute top-0 w-32 h-32 bg-exhibition-gold/10 blur-xl rounded-full" />
                
                {selectedArtwork.category === 'filmmaking' && selectedArtwork.videoUrl ? (
                  <div className="aspect-video w-full max-w-2xl bg-black border border-zinc-800 shadow-2xl relative">
                    <iframe
                      src={selectedArtwork.videoUrl}
                      title={selectedArtwork.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  selectedArtwork.imageUrl ? (
                    <img
                      src={selectedArtwork.imageUrl}
                      alt={selectedArtwork.title}
                      className="max-w-full max-h-full object-contain shadow-2xl border border-white/5"
                    />
                  ) : (
                    <div className="text-zinc-500 font-mono text-sm">Image Unavailable</div>
                  )
                )}
              </div>

              {/* Right Side: details & comment feedbacks */}
              <div className="w-full md:w-[35%] h-auto md:h-full flex flex-col bg-[#0b0b0b] flex-grow">
                <div className="p-6 border-b border-zinc-900">
                  <span className="font-mono text-[9px] text-exhibition-gold uppercase tracking-[0.25em] block mb-1">
                    {selectedArtwork.category.replace('-', ' ')}
                  </span>
                  <h3 className="editorial-text text-2xl md:text-3xl font-light text-exhibition-bone">
                    {selectedArtwork.title}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-2 uppercase tracking-wide">
                    By {selectedArtwork.artist.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {selectedArtwork.artist.college}
                  </p>
                  <p className="text-xs text-zinc-400 mt-4 font-mono font-light leading-relaxed max-h-24 overflow-y-auto pr-2">
                    {selectedArtwork.description}
                  </p>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-900">
                    <span className="text-zinc-500 text-xs font-mono">
                      {selectedArtwork.votes} votes logged
                    </span>
                    {currentUser ? (
                      <button
                        onClick={() => handleVote(selectedArtwork.id)}
                        className="px-4 py-1.5 border border-exhibition-gold/40 hover:border-exhibition-gold text-exhibition-gold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Heart
                          size={12}
                          className={
                            currentUser.votedCategories.includes(selectedArtwork.category)
                              ? 'fill-exhibition-gold stroke-exhibition-gold'
                              : ''
                          }
                        />
                        <span>VOTE</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-600">Log in to vote</span>
                    )}
                  </div>
                </div>

                {/* Feedbacks list */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 max-h-60 md:max-h-none">
                  <h4 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                    Feedbacks ({selectedArtwork.comments?.length || 0})
                  </h4>

                  <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1">
                    {selectedArtwork.comments?.length > 0 ? (
                      selectedArtwork.comments.map((comment) => (
                        <div key={comment.id} className="text-xs font-mono bg-black/20 p-2.5 border border-zinc-900">
                          <div className="flex justify-between text-[10px] text-exhibition-gold mb-1">
                            <span>{comment.userName}</span>
                            <span className="text-zinc-600">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-zinc-300 font-sans">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-zinc-600 text-xs font-mono py-6">
                        No feedbacks logged yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Feedback */}
                {currentUser ? (
                  <form
                    onSubmit={(e) => handleCommentSubmit(e, selectedArtwork.id)}
                    className="p-4 bg-black/40 border-t border-zinc-900 flex gap-2"
                  >
                    <input
                      type="text"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder={
                        currentUser.commentedArtworks.includes(selectedArtwork.id)
                          ? "Feedback already logged"
                          : "Write a feedback..."
                      }
                      disabled={currentUser.commentedArtworks.includes(selectedArtwork.id)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 text-xs font-sans px-3 py-2 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={currentUser.commentedArtworks.includes(selectedArtwork.id) || !commentContent.trim()}
                      className="w-8 h-8 flex items-center justify-center bg-exhibition-gold text-exhibition-void hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={12} />
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-black/40 border-t border-zinc-900 text-center text-[10px] font-mono text-zinc-600">
                    <Link to="/auth" className="text-exhibition-gold hover:underline">Log in</Link> to write a feedback.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
