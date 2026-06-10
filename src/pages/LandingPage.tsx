import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Heart, ArrowRight, Send } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authHeaders } from '../lib/session'
import { Artwork } from '../types'
import CinematicIntro from '../components/CinematicIntro'
import ExhibitionNav from '../components/ExhibitionNav'
import ThreeExhibitionScene from '../components/ThreeExhibitionScene'
import ArtworkFrame from '../components/ArtworkFrame'
import { useSpotlightAll } from '../hooks/useSpotlight'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function LandingPage() {
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  
  useSpotlightAll('.spot-md, .spot-lg, .spot-xl')

  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [categories] = useState(['photography', 'digital-art', 'cinematography', 'motion-graphics'])
  const [introComplete, setIntroComplete] = useState<boolean>(() => {
    return sessionStorage.getItem('lenscape_intro_complete') === 'true'
  })

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [commentContent, setCommentContent] = useState('')
  const [showNav, setShowNav] = useState(false)
  const chambersRef = useRef<HTMLElement>(null)

  // Fetch approved artworks from backend
  useEffect(() => {
    fetch(`${API}/api/artworks`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setArtworks(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (chambersRef.current) {
        const top = chambersRef.current.getBoundingClientRect().top
        // Show nav when chambers section enters viewport
        if (top < window.innerHeight - 100) {
          setShowNav(true)
        } else {
          setShowNav(false)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    // Trigger once on mount to set initial state
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem('lenscape_intro_complete', 'true')
    setIntroComplete(true)
  }

  // Filter approved artworks
  const approvedArtworks = artworks.filter((a) => a.status === 'approved')
  const featured = approvedArtworks.slice(0, 3)

  // Calculate dynamic stats
  const totalSubmissions = artworks.length + 142
  const totalVotes = artworks.reduce((acc, curr) => acc + curr.votes, 0) + 4900

  const stats = [
    { value: `${totalSubmissions}+`, label: 'SUBMISSIONS' },
    { value: `${categories.length}`, label: 'DOMAINS' },
    { value: `${(totalVotes / 1000).toFixed(1)}K+`, label: 'VOTES CAST' },
  ]

  // Handle voting from modal/frames
  const handleVote = async (artId: string) => {
    if (!user) return
    try {
      const res = await fetch(`${API}/api/artworks/${artId}/vote`, { method: 'POST', headers: authHeaders() })
      if (res.ok) {
        setArtworks(prev => prev.map(a => a.id === artId ? { ...a, votes: a.votes + 1 } : a))
        if (selectedArtwork?.id === artId) setSelectedArtwork(a => a ? { ...a, votes: a.votes + 1 } : a)
      }
    } catch {}
  }

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent, artId: string) => {
    e.preventDefault()
    if (!commentContent.trim() || !user) return
    try {
      const res = await fetch(`${API}/api/artworks/${artId}/comment`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ content: commentContent.trim() }),
      })
      if (res.ok) {
        const comment = await res.json()
        setArtworks(prev => prev.map(a => a.id === artId ? { ...a, comments: [...a.comments, comment] } : a))
        if (selectedArtwork?.id === artId) setSelectedArtwork(a => a ? { ...a, comments: [...a.comments, comment] } : a)
        setCommentContent('')
      }
    } catch {}
  }

  // Scroll-driven fade + lift for the corridor overlay text
  const { scrollY } = useScroll()
  const useScrollFade = useTransform(scrollY, [0, 400], [1, 0])
  const useScrollY = useTransform(scrollY, [0, 400], [0, -80])

  return (
    <div className="min-h-screen bg-exhibition-void text-exhibition-bone selection:bg-exhibition-gold selection:text-exhibition-void relative">
      {/* 1. Cinematic Preloader Intro */}
      <AnimatePresence>
        {!introComplete && (
          <CinematicIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {introComplete && (
        <>
          {/* Navigation Guide */}
          <ExhibitionNav isVisible={showNav} />

          {/* 
            Scroll-jacked 3D corridor.
            The outer div is 300vh tall — this is the "scroll budget" for the camera walk.
            The inner div is sticky, so the canvas stays fixed while the user scrolls
            through the 300vh. Once past it, normal page content resumes.
          */}
          <div className="relative" style={{ height: '300vh' }} data-corridor="true">
            <div className="sticky top-0 w-full h-screen overflow-hidden">
              {/* 3D scene fills the sticky viewport */}
              <div className="absolute inset-0 w-full h-full pointer-events-auto">
                <ThreeExhibitionScene onArtworkSelect={(art) => setSelectedArtwork(art)} />
              </div>

              {/* Text overlay — fades + moves up as user starts scrolling */}
              <motion.div
                style={{ opacity: useScrollFade, y: useScrollY }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-10"
              >
                <span className="font-mono text-[10px] text-exhibition-gold uppercase tracking-[0.3em] mb-4">
                  Curated Digital Hallway
                </span>
                <h1 className="editorial-text text-4xl md:text-6xl text-exhibition-bone max-w-2xl font-light">
                  Float through the gallery
                </h1>
                <p className="font-sans text-xs text-zinc-500 mt-3 max-w-sm tracking-wide">
                  Scroll down to traverse the virtual museum. Click on any frame to inspect the artwork.
                </p>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-[1px] h-12 bg-exhibition-gold/50 mt-10"
                />
              </motion.div>
            </div>
          </div>

          {/* Main scrollable section overlays */}
          <div className="relative z-10 bg-exhibition-void/90 backdrop-blur-md border-t border-exhibition-gold/15 py-32 px-6 md:px-12">
            
            {/* Section: Featured Artworks */}
            <section className="max-w-6xl mx-auto mb-40">
              <div className="text-center mb-24">
                <span className="font-mono text-xs text-exhibition-gold uppercase tracking-[0.25em] block mb-3">
                  Hall of Honor
                </span>
                <h2 className="editorial-text text-4xl md:text-6xl font-light">
                  Featured Masterpieces
                </h2>
                <p className="text-sm text-zinc-500 mt-2 font-mono">
                  Highly acclaimed student submissions currently curated.
                </p>
              </div>

              {/* Staggered high-fidelity layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
                {featured.map((artwork, idx) => {
                  const isVoted = user ? user?.votedCategories?.includes(artwork.category) : false
                  return (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.8, delay: idx * 0.15 }}
                      className={`flex flex-col ${idx === 1 ? 'md:mt-16' : ''}`}
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
            </section>

            {/* Section: Event Themes */}
            <section className="max-w-6xl mx-auto mb-40">
              <div className="text-center mb-16">
                <span className="font-mono text-xs text-exhibition-gold uppercase tracking-[0.25em] block mb-3">
                  Lenscape 2026
                </span>
                <h2 className="editorial-text text-4xl md:text-6xl font-light">
                  Event Themes
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-exhibition-gold/15">
                {/* Theme 1 */}
                <div className="p-10 border-b md:border-b-0 md:border-r border-exhibition-gold/15 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-exhibition-gold/3 to-transparent pointer-events-none" />
                  <span className="font-mono text-[9px] text-exhibition-gold uppercase tracking-[0.3em] block mb-4">Theme 01</span>
                  <h3 className="editorial-text text-3xl md:text-4xl font-light text-exhibition-bone mb-4">
                    Summer at Your Place
                  </h3>
                  <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                    Capture the warmth, intimacy and vibrancy of summer through your lens — your home, your city, your people.
                  </p>
                </div>

                {/* Theme 2 */}
                <div className="p-10 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-exhibition-gold/3 to-transparent pointer-events-none" />
                  <span className="font-mono text-[9px] text-exhibition-gold uppercase tracking-[0.3em] block mb-4">Theme 02</span>
                  <h3 className="editorial-text text-3xl md:text-4xl font-light text-exhibition-bone mb-4">
                    Open Innovation
                  </h3>
                  <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                    No constraints — explore the intersection of technology, design and imagination. Anything goes.
                  </p>
                </div>
              </div>

              {/* Categories overview */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-exhibition-gold/10">
                {[
                  { room: '01', cat: 'Photography', subs: ['Portrait', 'Landscape'] },
                  { room: '02', cat: 'Digital Art', subs: ['Concept Art', 'Character Design'] },
                  { room: '03', cat: 'Cinematography', subs: ['Short Film', 'Travel Film'] },
                  { room: '04', cat: 'Motion Graphics', subs: ['Logo Animation', 'Explainer Video'] },
                ].map(item => (
                  <div key={item.room} className="bg-exhibition-void p-6">
                    <span className="font-mono text-[9px] text-zinc-600 block mb-2 uppercase tracking-widest">Room {item.room}</span>
                    <h4 className="font-mono text-sm font-bold text-exhibition-gold uppercase tracking-wide mb-3">{item.cat}</h4>
                    <ul className="space-y-1">
                      {item.subs.map(s => (
                        <li key={s} className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-exhibition-gold/40 rounded-full flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Typographic Statistics */}
            <section className="spot-xl max-w-6xl mx-auto mb-40 border-t border-b border-zinc-900 py-24">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="editorial-text text-6xl md:text-7xl font-bold text-exhibition-gold drop-shadow-[0_0_20px_rgba(201,168,76,0.15)]">
                      {stat.value}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.25em] mt-3 block">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Exhibition Rooms CTA */}
            <section ref={chambersRef} className="max-w-5xl mx-auto mb-32">
              <div className="text-center mb-20">
                <span className="font-mono text-xs text-exhibition-gold uppercase tracking-[0.25em] block mb-3">
                  Select a Room
                </span>
                <h2 className="editorial-text text-4xl md:text-5xl font-light">
                  Exhibition Chambers
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Photography wing */}
                <div
                  onClick={() => navigate('/gallery?cat=photography')}
                  className="spot-md group cursor-pointer border border-exhibition-gold/15 bg-black/40 p-8 rounded-none hover:border-exhibition-gold/60 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-exhibition-gold/5 to-transparent pointer-events-none" />
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">Room 01</span>
                  <h3 className="editorial-text text-2xl font-bold text-exhibition-bone mt-2 group-hover:text-exhibition-gold transition-colors">
                    Photography
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 font-mono leading-relaxed">
                    Portrait Photography · Landscape Photography
                  </p>
                  <div className="flex items-center gap-2 mt-6 font-mono text-[10px] text-exhibition-gold uppercase tracking-widest">
                    <span>Enter Wing</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Digital Art wing */}
                <div
                  onClick={() => navigate('/gallery?cat=digital-art')}
                  className="spot-md group cursor-pointer border border-exhibition-gold/15 bg-black/40 p-8 rounded-none hover:border-exhibition-gold/60 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-exhibition-gold/5 to-transparent pointer-events-none" />
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">Room 02</span>
                  <h3 className="editorial-text text-2xl font-bold text-exhibition-bone mt-2 group-hover:text-exhibition-gold transition-colors">
                    Digital Art
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 font-mono leading-relaxed">
                    Concept Art · Character Design
                  </p>
                  <div className="flex items-center gap-2 mt-6 font-mono text-[10px] text-exhibition-gold uppercase tracking-widest">
                    <span>Enter Wing</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Cinematography wing */}
                <div
                  onClick={() => navigate('/gallery?cat=cinematography')}
                  className="spot-md group cursor-pointer border border-exhibition-gold/15 bg-black/40 p-8 rounded-none hover:border-exhibition-gold/60 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-exhibition-gold/5 to-transparent pointer-events-none" />
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">Room 03</span>
                  <h3 className="editorial-text text-2xl font-bold text-exhibition-bone mt-2 group-hover:text-exhibition-gold transition-colors">
                    Cinematography
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 font-mono leading-relaxed">
                    Short Film · Travel Film
                  </p>
                  <div className="flex items-center gap-2 mt-6 font-mono text-[10px] text-exhibition-gold uppercase tracking-widest">
                    <span>Enter Wing</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Motion Graphics wing */}
                <div
                  onClick={() => navigate('/gallery?cat=motion-graphics')}
                  className="spot-md group cursor-pointer border border-exhibition-gold/15 bg-black/40 p-8 rounded-none hover:border-exhibition-gold/60 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-exhibition-gold/5 to-transparent pointer-events-none" />
                  <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">Room 04</span>
                  <h3 className="editorial-text text-2xl font-bold text-exhibition-bone mt-2 group-hover:text-exhibition-gold transition-colors">
                    Motion Graphics
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 font-mono leading-relaxed">
                    Logo Animation · Explainer Video
                  </p>
                  <div className="flex items-center gap-2 mt-6 font-mono text-[10px] text-exhibition-gold uppercase tracking-widest">
                    <span>Enter Wing</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Submit portal callout */}
              <div className="mt-16 border border-exhibition-gold/25 p-10 bg-black/60 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h4 className="editorial-text text-xl font-bold text-exhibition-gold">
                    Have your artwork shown in the corridor?
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    Submit your creations to be curated and voted on by peers.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/submit')}
                  className="px-6 py-3 bg-exhibition-gold text-exhibition-void font-mono font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors self-start md:self-auto"
                >
                  Add Your Canvas
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto border-t border-zinc-900 pt-16 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  LENSCAPE © 2026 // SPONSORED BY JLUG CLUB
                </span>
              </div>
              <div className="flex gap-8 font-mono text-[9px] tracking-widest uppercase text-zinc-400">
                <Link to="/gallery" className="hover:text-exhibition-gold transition-colors">Rooms</Link>
                <Link to="/submit" className="hover:text-exhibition-gold transition-colors">Portal</Link>
                <Link to="/admin" className="hover:text-exhibition-gold transition-colors">Curator</Link>
              </div>
            </footer>
          </div>

          {/* Immersive Artwork Viewer Modal (Full Screen Exhibition focus) */}
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

                  {/* Left Side: Art display */}
                  <div className="w-full md:w-[65%] h-64 sm:h-80 md:h-full flex-shrink-0 bg-black flex items-center justify-center relative p-6 border-b md:border-b-0 md:border-r border-zinc-900">
                    {/* Top wash light */}
                    <div className="absolute top-0 w-32 h-32 bg-exhibition-gold/10 blur-xl rounded-full" />
                    
                    {selectedArtwork.imageUrl ? (
                      <img
                        src={selectedArtwork.imageUrl}
                        alt={selectedArtwork.title}
                        className="max-w-full max-h-full object-contain shadow-2xl border border-white/5"
                      />
                    ) : (
                      <div className="text-zinc-500 font-mono text-sm">Image Unavailable</div>
                    )}
                  </div>

                  {/* Right Side: Information / Placard details & comments */}
                  <div className="w-full md:w-[35%] h-auto md:h-full flex flex-col bg-[#0b0b0b] flex-grow">
                    {/* Art Details */}
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

                      {/* Vote statistics and button */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-900">
                        <span className="text-zinc-500 text-xs font-mono">
                          {selectedArtwork.votes} votes logged
                        </span>
                        {user ? (
                          <button
                            onClick={() => handleVote(selectedArtwork.id)}
                            className="px-4 py-1.5 border border-exhibition-gold/40 hover:border-exhibition-gold text-exhibition-gold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
                          >
                            <Heart size={12} className={user?.votedCategories?.includes(selectedArtwork.category) ? 'fill-exhibition-gold stroke-exhibition-gold' : ''} />
                            <span>VOTE</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-600">Log in to vote</span>
                        )}
                      </div>
                    </div>

                    {/* Feedbacks / Comments section - HIDDEN (kept for future use) */}
                    {false && (
                      <>
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

                        {/* Submit comments bar */}
                        {user ? (
                          <form
                            onSubmit={(e) => handleCommentSubmit(e, selectedArtwork.id)}
                            className="p-4 bg-black/40 border-t border-zinc-900 flex gap-2"
                          >
                            <input
                              type="text"
                              value={commentContent}
                              onChange={(e) => setCommentContent(e.target.value)}
                              placeholder={
                                user.commentedArtworks.includes(selectedArtwork.id)
                                  ? "Feedback already logged"
                                  : "Write a feedback..."
                              }
                              disabled={user.commentedArtworks.includes(selectedArtwork.id)}
                              className="flex-1 bg-zinc-900 border border-zinc-800 text-xs font-sans px-3 py-2 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                              type="submit"
                              disabled={user.commentedArtworks.includes(selectedArtwork.id) || !commentContent.trim()}
                              className="w-8 h-8 flex items-center justify-center bg-exhibition-gold text-exhibition-void hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send size={12} />
                            </button>
                          </form>
                        ) : (
                          <div className="p-4 bg-black/40 border-t border-zinc-900 text-center text-[10px] font-mono text-zinc-600">
                            <Link to="/auth/login" className="text-exhibition-gold hover:underline">Log in</Link> to write a feedback.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

