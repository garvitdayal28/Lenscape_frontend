import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, MessageCircle, Share2, X, ArrowLeft, Sparkles, Film, Cpu, HelpCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Artwork, Category } from '../types';

// Simple interactive Canvas for Animation Artworks
function InteractiveAnimationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = 600);
    let height = (canvas.height = 400);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];

    // Create particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 4 + 2,
        color: `hsla(${Math.random() * 360}, 100%, 70%, 0.8)`,
      });
    }

    let mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, width, height);

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist / 100})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Gravity pull toward mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x += (dx / dist) * 0.4;
          p.y += (dy / dist) * 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // HUD style indicator
      ctx.font = '10px monospace';
      ctx.fillStyle = '#FF69B4';
      ctx.fillText(`ANIMATION_GRID: ACTIVE // FORCE: ${mouse.x.toFixed(0)}x${mouse.y.toFixed(0)}`, 15, 25);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative border border-y2k-pink/20 rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full object-cover block cursor-crosshair" />
      <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest text-y2k-cyan">
        [MOVE MOUSE TO DISTORT GRID]
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { artworks, categories, voteArtwork, commentArtwork, currentUser, isBanned } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [newComment, setNewComment] = useState('');

  // Handle category query param from landing page clicks
  useEffect(() => {
    const catParam = searchParams.get('cat');
    if (catParam) {
      setSelectedCategory(catParam as Category);
    }
  }, [searchParams]);

  // Filter approved works only
  const approvedArtworks = artworks.filter(a => a.status === 'approved');

  // Filter results
  const filteredArtworks = approvedArtworks.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.artist.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort results
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    if (selectedSort === 'most-voted') {
      return b.votes - a.votes;
    } else if (selectedSort === 'trending') {
      // Votes + comment count weighted
      return (b.votes + b.comments.length * 2) - (a.votes + a.comments.length * 2);
    }
    // Latest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Related artworks calculation
  const getRelatedArtworks = (currentArt: Artwork) => {
    return approvedArtworks
      .filter((a) => a.category === currentArt.category && a.id !== currentArt.id)
      .slice(0, 3);
  };

  const handleVoteClick = (artworkId: string) => {
    if (!currentUser) {
      alert("Please enter the credentials terminal to vote.");
      return;
    }
    voteArtwork(artworkId);
    // Refresh modal info
    const updated = artworks.find(a => a.id === artworkId);
    if (updated) setSelectedArtwork(updated);
  };

  const handleCommentSubmit = (e: React.FormEvent, artworkId: string) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in to submit comments.");
      return;
    }
    if (!newComment.trim()) return;

    const success = commentArtwork(artworkId, newComment);
    if (success) {
      setNewComment('');
      // Refresh modal
      const updated = artworks.find(a => a.id === artworkId);
      if (updated) setSelectedArtwork(updated);
    }
  };

  const handleShare = (artTitle: string) => {
    navigator.clipboard.writeText(window.location.href);
    alert(`Link copied to clipboard! Shared: ${artTitle}`);
  };

  const isVotedInCategory = (category: Category) => {
    if (!currentUser) return false;
    return currentUser.votedCategories.includes(category);
  };

  const hasCommented = (artworkId: string) => {
    if (!currentUser) return false;
    return currentUser.commentedArtworks.includes(artworkId);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white y2k-grid relative crt-scanlines">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-5 px-6 md:px-12 flex justify-between items-center">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-chrome hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-xs tracking-widest uppercase">Back</span>
          </motion.button>
        </Link>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wider gradient-text">Exhibition Hall</h1>
        <div className="w-12" /> {/* spacer */}
      </header>

      {/* Control Panel: Search & Filters */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" />
            <input
              type="text"
              placeholder="Search artworks, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-y2k-pink transition-colors font-sans text-sm"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all whitespace-nowrap border ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-y2k-pink to-y2k-cyan border-transparent text-black font-extrabold'
                  : 'bg-white/5 border-white/10 text-chrome hover:border-white/30'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-y2k-pink to-y2k-cyan border-transparent text-black font-extrabold'
                    : 'bg-white/5 border-white/10 text-chrome hover:border-white/30'
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="w-full lg:w-auto flex justify-end">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-black/60 border border-white/10 rounded-full px-4 py-2 font-mono text-[10px] tracking-widest uppercase text-chrome outline-none cursor-pointer hover:border-white/30"
            >
              <option value="latest">LATEST SUBMISSIONS</option>
              <option value="most-voted">MOST VOTED</option>
              <option value="trending">TRENDING METRICS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Masonry Artwork Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 relative z-10">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {sortedArtworks.map((artwork, idx) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.4), duration: 0.6 }}
              whileHover={{ scale: 1.015 }}
              className="break-inside-avoid"
            >
              <div
                className="glass-panel rounded-3xl overflow-hidden cursor-pointer group y2k-border relative flex flex-col justify-between"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={artwork.thumbnailUrl || ''}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Category Stamp */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider text-y2k-cyan">
                    {artwork.category}
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-mono text-[9px] bg-black/70 px-2.5 py-1 rounded-full text-white/90">
                      BY {artwork.artist.name.toUpperCase()}
                    </span>
                    <div className="flex gap-1.5">
                      <div className="w-8 h-8 rounded-full glass-panel-cyan flex items-center justify-center text-y2k-cyan">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                      <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-white/5">
                  <h3 className="font-display text-xl font-bold mb-1 group-hover:text-y2k-pink transition-colors truncate">{artwork.title}</h3>
                  <p className="font-sans text-[11px] text-chrome truncate">by {artwork.artist.name} ({artwork.artist.college})</p>
                  <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2 font-mono text-[9px]">
                    <span className="text-white/40">{new Date(artwork.createdAt).toLocaleDateString()}</span>
                    <span className="text-y2k-lime font-extrabold">{artwork.votes} VOTES</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {sortedArtworks.length === 0 && (
          <div className="text-center py-32 glass-panel rounded-3xl border-white/10">
            <Sparkles className="w-12 h-12 text-y2k-cyan mx-auto mb-4 star-sparkle" />
            <h3 className="font-display text-2xl font-bold uppercase mb-2">No Artworks Found</h3>
            <p className="font-sans text-xs text-chrome">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>

      {/* Immersive Showcase Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              className="relative max-w-6xl w-full glass-panel-dark rounded-3xl p-6 md:p-8 y2k-border max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute top-4 right-4 w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/20 transition-colors font-mono text-sm border-white/20 z-20"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                
                {/* Media Preview Container (Cols 1-7) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Category check: Film gets player, Animation gets canvas canvas, others get image */}
                  {selectedArtwork.category === 'filmmaking' && selectedArtwork.videoUrl ? (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
                      <iframe
                        src={selectedArtwork.videoUrl}
                        title={selectedArtwork.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : selectedArtwork.category === 'animation' ? (
                    <InteractiveAnimationCanvas />
                  ) : (
                    <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative aspect-square md:aspect-video bg-[#050505] flex items-center justify-center">
                      <img
                        src={selectedArtwork.imageUrl || ''}
                        alt={selectedArtwork.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Related submissions */}
                  <div className="hidden lg:block border-t border-white/5 pt-6">
                    <h4 className="font-mono text-[10px] text-y2k-pink uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Related Submissions
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {getRelatedArtworks(selectedArtwork).length > 0 ? (
                        getRelatedArtworks(selectedArtwork).map((rel) => (
                          <div
                            key={rel.id}
                            onClick={() => setSelectedArtwork(rel)}
                            className="glass-panel p-2 rounded-xl border-white/10 cursor-pointer hover:border-y2k-cyan/40 hover:scale-103 transition-all flex flex-col justify-between h-36"
                          >
                            <img src={rel.thumbnailUrl || ''} className="w-full h-[65%] object-cover rounded-lg" alt="" />
                            <span className="font-display text-[11px] font-bold truncate mt-2 text-white/95 block">{rel.title}</span>
                          </div>
                        ))
                      ) : (
                        <p className="col-span-3 font-mono text-[9px] text-chrome/50">No other submissions in this category yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details & Interactive systems (Cols 8-12) */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-y2k-pink uppercase tracking-[0.2em] mb-2 block">
                      {selectedArtwork.category.replace('-', ' ')}
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                      {selectedArtwork.title}
                    </h2>
                    
                    {/* Artist Portfolio widget */}
                    <div className="glass-panel rounded-2xl p-4 border-white/10 mb-6 flex items-center gap-4">
                      <img
                        src={selectedArtwork.artist.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedArtwork.artist.name}`}
                        className="w-12 h-12 rounded-full border border-y2k-cyan/20"
                        alt=""
                      />
                      <div>
                        <h4 className="font-display text-sm font-bold text-white">{selectedArtwork.artist.name}</h4>
                        <p className="font-sans text-[10px] text-chrome">
                          {selectedArtwork.artist.college} • {selectedArtwork.artist.branch} ({selectedArtwork.artist.year})
                        </p>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-chrome/90 leading-relaxed mb-6 bg-white/5 p-4 rounded-xl border border-white/5">
                      {selectedArtwork.description}
                    </p>
                  </div>

                  {/* Engagement section: Voting / Comments */}
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      {/* Category lock vote system */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleVoteClick(selectedArtwork.id)}
                        disabled={isVotedInCategory(selectedArtwork.category)}
                        className={`flex-1 py-3 px-4 rounded-full font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2 border ${
                          isVotedInCategory(selectedArtwork.category)
                            ? 'bg-y2k-black border-y2k-lime/20 text-y2k-lime/40 cursor-not-allowed'
                            : 'y2k-chrome-btn border-transparent font-bold'
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                        {isVotedInCategory(selectedArtwork.category) ? 'VOTED IN CAT' : `VOTE (+1)`}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleShare(selectedArtwork.title)}
                        className="py-3 px-4 glass-panel border-white/15 rounded-full flex items-center justify-center text-white"
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Single comments list & Input */}
                    <div className="border-t border-white/5 pt-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-display text-sm font-bold uppercase">Comments ({selectedArtwork.comments.length})</h4>
                        <span className="font-mono text-[8px] text-chrome/60 uppercase">1 feedback per user</span>
                      </div>

                      {/* Comment Input */}
                      {currentUser ? (
                        hasCommented(selectedArtwork.id) ? (
                          <div className="bg-y2k-pink/10 border border-y2k-pink/20 text-y2k-pink/80 rounded-xl px-4 py-2 font-mono text-[9px] uppercase tracking-wider text-center mb-4">
                            You have left feedback on this artwork.
                          </div>
                        ) : (
                          <form onSubmit={(e) => handleCommentSubmit(e, selectedArtwork.id)} className="flex gap-2 mb-4">
                            <input
                              type="text"
                              placeholder="Write clean, modern feedback..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-y2k-pink text-xs font-sans"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 bg-gradient-to-r from-y2k-pink to-y2k-cyan rounded-full text-black font-mono text-[10px] uppercase font-bold tracking-widest"
                            >
                              Post
                            </button>
                          </form>
                        )
                      ) : (
                        <div className="bg-white/5 border border-white/10 text-chrome/60 rounded-xl px-4 py-2 font-mono text-[9px] uppercase text-center mb-4">
                          Log in to leave feedback.
                        </div>
                      )}

                      {/* Comments Scrollbox */}
                      <div className="space-y-3 max-h-40 overflow-y-auto pr-2 no-scrollbar">
                        {selectedArtwork.comments.length === 0 ? (
                          <p className="font-mono text-[9px] text-chrome/40 text-center py-6">Be the first to leave review feedback!</p>
                        ) : (
                          selectedArtwork.comments.map((comment) => (
                            <div key={comment.id} className="glass-panel p-3.5 rounded-2xl border-white/5 relative">
                              <div className="flex justify-between items-start mb-1 gap-2">
                                <span className="font-display text-xs font-bold text-white/95">{comment.userName}</span>
                                <span className="font-mono text-[8px] text-chrome/60">{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="font-sans text-[11px] text-chrome/80 leading-relaxed">{comment.content}</p>
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
