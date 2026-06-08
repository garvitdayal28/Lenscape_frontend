import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Play, Upload, Star, ChevronRight, Eye, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Artwork } from '../types';
import ThreeBackground from '../components/ThreeBackground';

export default function LandingPage() {
  const { artworks, categories, currentUser } = useApp();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch approved artworks for displays
  const approvedArtworks = artworks.filter(a => a.status === 'approved');
  const featured = approvedArtworks.slice(0, 3);

  // Scroll tracking for parallax
  const corridorRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: corridorRef,
    offset: ["start end", "end start"]
  });

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.9]);
  
  // corridor virtual depth translations
  const corridorZ = useTransform(scrollYProgress, [0, 1], [-200, 150]);
  const corridorOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroContainerRef.current) return;
      const rect = heroContainerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate dynamic stats
  const totalSubmissions = artworks.length + 142; // Base + dynamic
  const totalVotes = artworks.reduce((acc, curr) => acc + curr.votes, 0) + 4900;
  const totalComments = artworks.reduce((acc, curr) => acc + curr.comments.length, 0) + 1200;

  const stats = [
    { value: `${totalSubmissions}+`, label: 'SUBMISSIONS' },
    { value: `${categories.length}`, label: 'DOMAINS' },
    { value: `${(totalVotes / 1000).toFixed(1)}K+`, label: 'VOTES CAST' },
    { value: `${totalComments}+`, label: 'FEEDBACKS' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden relative selection:bg-y2k-pink selection:text-black">
      <ThreeBackground />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center font-display font-extrabold text-black text-sm star-sparkle">
            L
          </div>
          <span className="font-display text-xl font-bold tracking-wider gradient-text">Lenscape</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-xs font-mono tracking-widest uppercase">
          <Link to="/gallery" className="text-chrome hover:text-y2k-cyan transition-colors">Exhibition Hall</Link>
          <Link to="/submit" className="text-chrome hover:text-y2k-lime transition-colors">Submit Portal</Link>
          {currentUser && currentUser.id === 'user_admin' && (
            <Link to="/admin" className="text-y2k-pink hover:text-white transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-y2k-pink rounded-full animate-ping" /> Core Admin
            </Link>
          )}
        </nav>
        <div className="flex gap-4 items-center">
          {currentUser ? (
            <Link to="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 glass-panel-cyan px-4 py-2 rounded-full cursor-pointer"
              >
                <img src={currentUser.avatar || ''} className="w-6 h-6 rounded-full" alt="Avatar" />
                <span className="font-mono text-[10px] uppercase tracking-widest hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              </motion.div>
            </Link>
          ) : (
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="y2k-chrome-btn px-6 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase font-bold"
              >
                Access Terminal
              </motion.button>
            </Link>
          )}
        </div>
      </header>

      {/* Immersive Hero Section */}
      <motion.section
        ref={heroContainerRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex flex-col justify-center items-center pt-20"
      >
        {/* Neon Light Flares */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-10 w-72 h-72 bg-y2k-pink/10 blur-3xl star-sparkle" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-y2k-cyan/10 blur-3xl" />
        </div>

        {/* Floating Interactive Frame Previews */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {featured.map((artwork, idx) => {
            const offsets = [
              { top: '22%', left: '12%', rot: -12 },
              { top: '45%', right: '14%', rot: 15 },
              { top: '65%', left: '18%', rot: -8 }
            ];
            const currentOffset = offsets[idx] || offsets[0];
            return (
              <motion.div
                key={artwork.id}
                animate={{
                  x: mousePosition.x * 60 * (idx + 1),
                  y: mousePosition.y * 60 * (idx + 1),
                }}
                transition={{ type: 'spring', stiffness: 80, damping: 25 }}
                className="absolute"
                style={{ ...currentOffset }}
              >
                <div 
                  style={{ transform: `rotate(${currentOffset.rot}deg)` }}
                  className="w-44 h-56 glass-panel rounded-2xl p-2.5 hover:rotate-0 transition-transform duration-500 hover:scale-105 border-y2k-pink/40 shadow-2xl"
                >
                  <img src={artwork.thumbnailUrl || ''} alt="" className="w-full h-full object-cover rounded-xl" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hero Content */}
        <div className="text-center z-10 max-w-4xl px-4 relative mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full border-y2k-pink/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-y2k-pink" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-chrome uppercase">PRESENTED BY JLUG CLUB</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="font-display text-7xl md:text-9xl font-extrabold tracking-tight mb-6 leading-none select-none uppercase gradient-text glitch-hover"
          >
            Lenscape
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="font-sans text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-12 font-light tracking-wide"
          >
            Where Creativity Becomes <span className="font-editorial italic font-normal text-y2k-cyan">an Experience</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-y2k-pink to-y2k-cyan text-black font-display font-extrabold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-pink/20 hover:shadow-cyan/30 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                Explore Gallery
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/submit">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-8 py-4 glass-panel text-white border-white/20 font-display font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-white/10"
              >
                <Upload className="w-4 h-4" />
                Submit Artwork
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Mouse/Scroll helper */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] text-chrome tracking-widest uppercase opacity-60">Scroll to Enter Corridor</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1"
          >
            <div className="w-1 h-2 bg-y2k-pink rounded-full" />
          </motion.div>
        </div>
      </motion.section>

      {/* Section 1 & 2: 3D CSS Corridor Tunnel & Virtual Hallway */}
      <section ref={corridorRef} className="min-h-[160vh] relative flex items-center justify-center py-24">
        {/* corridor background grids */}
        <div className="absolute inset-0 y2k-grid opacity-30 pointer-events-none" />
        
        {/* 3D Perspective Box Tunnel wrapper */}
        <motion.div 
          style={{ 
            translateZ: corridorZ,
            opacity: corridorOpacity,
            perspective: '1200px'
          }}
          className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center sticky top-1/4"
        >
          <h2 className="font-editorial text-4xl md:text-6xl text-center mb-4 tracking-wide font-normal">
            Walking The <span className="font-display uppercase font-bold gradient-text">Virtual Corridor</span>
          </h2>
          <p className="font-mono text-[10px] text-y2k-cyan tracking-widest uppercase text-center mb-16 max-w-md">
            As you scroll down, float deep into the Jlug digital museum matrix.
          </p>

          {/* Perspective grid corridor simulation */}
          <div className="relative w-full h-[400px] border border-white/10 rounded-3xl overflow-hidden glass-panel flex items-center justify-center">
            {/* Perspective sides */}
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-y2k-pink via-y2k-cyan to-y2k-lime opacity-50" />
            <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-y2k-lime via-y2k-cyan to-y2k-pink opacity-50" />
            
            {/* Curated scroll showcase grid */}
            <div className="flex gap-8 px-8 overflow-x-auto w-full py-6 no-scrollbar snap-x snap-mandatory">
              {approvedArtworks.map((art) => (
                <motion.div 
                  key={art.id}
                  whileHover={{ scale: 1.03 }}
                  className="flex-shrink-0 w-64 h-80 glass-panel rounded-2xl p-3 border-y2k-cyan/30 cursor-pointer snap-center relative overflow-hidden group"
                  onClick={() => setSelectedArtwork(art)}
                >
                  <img src={art.thumbnailUrl || ''} className="w-full h-[65%] object-cover rounded-xl mb-3" alt="" />
                  <div>
                    <h3 className="font-display text-sm font-bold truncate">{art.title}</h3>
                    <p className="font-sans text-[11px] text-chrome truncate">by {art.artist.name}</p>
                    <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2">
                      <span className="font-mono text-[8px] bg-y2k-pink/15 text-y2k-pink px-2 py-0.5 rounded-full uppercase tracking-wider">{art.category}</span>
                      <span className="font-mono text-[10px] text-white/70">{art.votes} votes</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 3: Curated Featured Artworks Showcase */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
          <div>
            <div className="flex items-center gap-2 text-y2k-lime font-mono text-[10px] tracking-widest uppercase mb-2">
              <Star className="w-4 h-4 fill-current" /> MASTERPIECES ON STAGE
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold uppercase">Featured Artworks</h2>
          </div>
          <Link to="/gallery">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="y2k-chrome-btn px-6 py-3 rounded-full font-mono text-[10px] tracking-widest uppercase flex items-center gap-2 font-bold"
            >
              Enter Exhibition Hall <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featured.map((artwork, idx) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              onClick={() => setSelectedArtwork(artwork)}
              className="glass-panel rounded-3xl overflow-hidden cursor-pointer group y2k-border relative flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={artwork.imageUrl || ''}
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase text-y2k-pink">
                  {artwork.category}
                </div>
                
                {/* Overlay Action details */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-xs">
                  <div className="w-12 h-12 rounded-full glass-panel-cyan flex items-center justify-center text-y2k-cyan border-y2k-cyan">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-white/5">
                <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-y2k-cyan transition-colors">{artwork.title}</h3>
                <p className="font-sans text-chrome text-xs mb-4">by {artwork.artist.name} ({artwork.artist.college})</p>
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-white/40">{new Date(artwork.createdAt).toLocaleDateString()}</span>
                  <span className="text-y2k-lime uppercase tracking-widest">{artwork.votes} Votes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4: Animated Category Showcase */}
      <section className="py-32 px-6 md:px-12 bg-[#050505] border-t border-white/5 relative">
        <div className="absolute inset-0 y2k-dots opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="font-display text-5xl md:text-7xl font-bold uppercase mb-4">COMPETITION DOMAINS</h2>
          <p className="font-sans text-lg text-chrome max-w-2xl mx-auto mb-16 font-light">
            Students can challenge their creativity across 6 distinct digital design mediums.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => {
              const icons: Record<string, string> = {
                'photography': '📸',
                'filmmaking': '🎬',
                'animation': '👾',
                'digital-art': '🎨',
                'illustration': '✏️',
                'motion-graphics': '⚡',
                'other': '📦'
              };
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  onClick={() => navigate(`/gallery?cat=${cat}`)}
                  className="glass-panel rounded-2xl p-6 text-center cursor-pointer border-y2k-cyan/20 group hover:border-y2k-cyan hover:shadow-cyan/10"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/5 group-hover:bg-gradient-to-r group-hover:from-y2k-pink group-hover:to-y2k-cyan flex items-center justify-center text-2xl transition-colors duration-300">
                    {icons[cat] || '🎨'}
                  </div>
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider group-hover:text-white transition-colors text-chrome">
                    {cat.replace('-', ' ')}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Statistics & Participation metrics */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative border-t border-white/5">
        <div className="absolute top-10 left-10 w-96 h-96 bg-y2k-lime/5 blur-3xl" />
        <div className="relative z-10 text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase mb-4">THE DIGITAL PULSE</h2>
          <p className="font-mono text-xs text-y2k-lime tracking-widest uppercase">Live Competition statistics generated in real-time</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel rounded-3xl p-8 text-center border-white/10 hover:border-y2k-pink/30 hover:shadow-pink/5"
            >
              <div className="font-display text-4xl md:text-5xl font-extrabold gradient-text-blue-purple mb-2">
                {stat.value}
              </div>
              <div className="font-mono text-[9px] text-chrome tracking-widest uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 6: Calls-to-action */}
      <section className="py-32 px-6 md:px-12 border-t border-white/5 relative flex items-center justify-center">
        {/* Large neon graphic mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gradient-to-r from-y2k-pink/15 via-y2k-cyan/15 to-y2k-lime/10 blur-3xl opacity-60 rounded-full" />
        
        <div className="max-w-4xl text-center relative z-10">
          <h2 className="font-display text-6xl md:text-8xl font-bold uppercase mb-6 leading-none">LAUNCH CREATIVE PROTOCOL</h2>
          <p className="font-sans text-xl text-chrome max-w-2xl mx-auto mb-12 font-light">
            Upload your masterworks. Challenge minds. Grab votes. Unlock achievements and write your name into the college digital art registry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-y2k-pink to-y2k-cyan text-black font-display font-extrabold text-xs tracking-widest uppercase rounded-full shadow-lg hover:shadow-cyan/20"
              >
                <Upload className="w-5 h-5" />
                Submit Your Artwork
              </motion.button>
            </Link>
            <Link to="/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-10 py-5 glass-panel text-white border-white/20 font-display font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-white/10"
              >
                Explore Hall
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030303] py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center text-black font-display font-bold text-xs">
            L
          </div>
          <span className="font-mono text-xs text-chrome tracking-widest uppercase">LENSCAPE © 2026 // ORGANIZED BY JLUG</span>
        </div>
        <div className="flex gap-8 font-mono text-[10px] tracking-wider text-chrome uppercase">
          <Link to="/gallery" className="hover:text-y2k-cyan">Gallery</Link>
          <Link to="/submit" className="hover:text-y2k-lime">Submit</Link>
          <Link to="/admin" className="hover:text-y2k-pink">Admin Hub</Link>
        </div>
      </footer>

      {/* Artwork Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#000000]/95 flex items-center justify-center p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full glass-panel rounded-3xl p-8 border-y2k-pink"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors font-mono text-sm border-white/20"
              >
                ×
              </button>

              <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 y2k-border relative">
                <img src={selectedArtwork.imageUrl || ''} className="w-full h-full object-cover" alt="" />
                {selectedArtwork.videoUrl && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-16 h-16 text-y2k-cyan fill-current" />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-start mb-4 gap-4">
                <div>
                  <h3 className="font-display text-3xl font-extrabold">{selectedArtwork.title}</h3>
                  <p className="font-mono text-xs text-chrome uppercase tracking-wider">Created by {selectedArtwork.artist.name} • {selectedArtwork.artist.college}</p>
                </div>
                <Link to="/gallery">
                  <button className="y2k-chrome-btn px-4 py-2 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest">
                    Open in Hall
                  </button>
                </Link>
              </div>

              <p className="font-sans text-white/80 text-sm leading-relaxed mb-6">{selectedArtwork.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
