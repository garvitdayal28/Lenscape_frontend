import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, LayoutGrid, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Category } from '../types';

export default function SubmitPage() {
  const { currentUser, submitArtwork, categories } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('photography');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (!title.trim() || !description.trim()) {
      alert("Please enter a title and description.");
      return;
    }

    // Default image if empty
    const img = imageUrl.trim() || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600';

    submitArtwork(title, description, category, img, videoUrl);
    alert("Submission received! Your artwork is sent to the Jlug curation committee for review.");
    navigate('/profile');
  };

  // If user is not logged in, show Access Gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6 y2k-grid crt-scanlines">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border-y2k-pink text-center">
          <AlertCircle className="w-16 h-16 text-y2k-pink mx-auto mb-4 animate-bounce" />
          <h2 className="font-display text-3xl font-bold uppercase mb-3">ACCESS PROTOCOL DENIED</h2>
          <p className="font-sans text-xs text-chrome mb-8 leading-relaxed">
            You must log into the Lenscape core mainframe with your credentials to submit artworks.
          </p>
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-gradient-to-r from-y2k-pink to-y2k-cyan text-black font-mono text-xs uppercase font-extrabold tracking-widest rounded-full"
            >
              Access Auth Terminal
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white y2k-grid relative crt-scanlines py-12 px-4 md:px-12">
      {/* Background radial flare */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-y2k-lime/5 blur-3xl rounded-full" />

      <div className="max-w-6xl mx-auto z-10 relative">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-chrome hover:text-white transition-colors mb-8 glass-panel px-4 py-2 rounded-full border-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-xs tracking-widest uppercase">Back</span>
          </motion.button>
        </Link>

        <h1 className="font-display text-4xl md:text-6xl font-bold mb-2 uppercase tracking-wide text-center lg:text-left">
          SUBMISSION LAB
        </h1>
        <p className="font-mono text-[10px] text-y2k-cyan tracking-widest uppercase mb-12 text-center lg:text-left">
          TRANSCRIPT YOUR CREATIVE PROTOCOL ON THE JLUG MAIN GRID
        </p>

        {/* Form Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Creator Input panel (Cols 1-7) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 md:p-8 y2k-border relative">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[9px] text-y2k-lime">
              <span className="w-2 h-2 bg-y2k-lime rounded-full animate-ping" /> LAB STATE: RUNNING
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-pink mb-2">
                  Artwork Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cyberpunk Reverie"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-pink transition-colors font-sans text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-cyan mb-2">
                    Medium Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl outline-none focus:border-y2k-cyan transition-colors font-sans text-sm cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c.toUpperCase().replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-cyan mb-2">
                    Media Cover Image Link (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-cyan transition-colors font-sans text-sm"
                  />
                </div>
              </div>

              {/* Media Specific Inputs */}
              {category === 'filmmaking' && (
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-pink mb-2">
                    Film Embed Link (YouTube Embed URL)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-pink transition-colors font-sans text-sm"
                  />
                  <p className="font-mono text-[9px] text-chrome/50 mt-1">Must be formatted as embed code link (e.g. /embed/ID)</p>
                </div>
              )}

              {category === 'animation' && (
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-lime mb-2">
                    Procedural Interactive Canvas Code (CSS/JS prompt)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Prompt e.g. Bouncing metal balls, colors shifting on mouse proximity."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-lime transition-colors font-mono text-xs"
                  />
                  <p className="font-mono text-[9px] text-chrome/50 mt-1">Our system will automatically compile a mouse-reactive particle grid in the Showcase.</p>
                </div>
              )}

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-lime mb-2">
                  Conceptual Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your creative story, tools used, and conceptual guidelines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-lime transition-colors font-sans text-sm resize-none"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-y2k-pink via-y2k-cyan to-y2k-lime text-black font-display font-bold tracking-widest uppercase rounded-full shadow-lg text-sm"
              >
                SUBMIT FOR MODERATION
              </motion.button>
            </form>
          </div>

          {/* Live card preview simulator (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <h3 className="font-mono text-[10px] text-y2k-pink uppercase tracking-widest mb-4 flex items-center gap-1.5 justify-center lg:justify-start">
              <LayoutGrid className="w-3.5 h-3.5" /> LIVE CARD PREVIEW
            </h3>

            {/* Simulated Gallery Card */}
            <div className="glass-panel rounded-3xl overflow-hidden y2k-border relative flex flex-col justify-between max-w-sm mx-auto w-full shadow-2xl">
              <div className="relative aspect-[4/5] overflow-hidden bg-black/60 flex items-center justify-center">
                {imageUrl.trim() ? (
                  <img
                    src={imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <Upload className="w-12 h-12 text-chrome/30 mx-auto mb-3 animate-pulse" />
                    <span className="font-mono text-[9px] text-chrome/50 uppercase">Waiting for Cover Image URL...</span>
                  </div>
                )}
                
                {/* Simulated category tag */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider text-y2k-cyan uppercase">
                  {category}
                </div>

                {/* Simulated action bars */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <span className="font-mono text-[8px] bg-black/70 px-2 py-0.5 rounded text-white/90">
                    BY {currentUser.name.toUpperCase()}
                  </span>
                  <div className="w-8 h-8 rounded-full glass-panel-cyan flex items-center justify-center text-y2k-cyan">
                    <Heart className="w-4 h-4 fill-current animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-white/5 bg-black/40">
                <h3 className="font-display text-xl font-bold mb-1 truncate text-y2k-pink">
                  {title.trim() ? title : 'Untitled Masterpiece'}
                </h3>
                <p className="font-sans text-[11px] text-chrome truncate">
                  by {currentUser.name} ({currentUser.college})
                </p>
                <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2 font-mono text-[9px]">
                  <span className="text-white/40">TODAY</span>
                  <span className="text-y2k-lime font-extrabold">0 VOTES</span>
                </div>
              </div>
            </div>

            {/* Guidelines helper card */}
            <div className="glass-panel rounded-2xl p-5 border-white/10 mt-6 max-w-sm mx-auto w-full">
              <h4 className="font-display text-xs font-bold text-y2k-cyan uppercase mb-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-y2k-cyan" /> SUBMISSION GUIDELINES
              </h4>
              <ul className="space-y-2 font-sans text-[10px] text-chrome leading-relaxed list-disc pl-4">
                <li>All submissions must be original work created by the student.</li>
                <li>Filmmaking submissions require YouTube links in `/embed/ID` format.</li>
                <li>Artworks must comply with the college code of conduct.</li>
                <li>Approved artworks will instantly appear in the public Exhibition Hall.</li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
