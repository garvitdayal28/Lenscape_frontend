import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Category, Artwork } from '../types'
import SpotlightCursor from '../components/SpotlightCursor'
import ArtworkFrame from '../components/ArtworkFrame'
import ExhibitionNav from '../components/ExhibitionNav'

export default function SubmitPage() {
  const { currentUser, submitArtwork, categories } = useApp()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('photography')
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) return

    if (!title.trim() || !description.trim()) {
      alert('Please fill in title and description.')
      return
    }

    const img =
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200'

    submitArtwork(title, description, category, img, videoUrl)
    alert(
      'Your canvas has been submitted to the curation committee. Once approved, it will be hung in the exhibition corridor.'
    )
    navigate('/profile')
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-exhibition-void text-exhibition-bone flex items-center justify-center p-6 select-none relative">
        <SpotlightCursor />
        
        <div className="max-w-md w-full bg-[#0d0d0d] border border-exhibition-gold/20 p-10 text-center relative">
          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />

          <AlertTriangle className="w-12 h-12 text-exhibition-gold mx-auto mb-6" />
          
          <h2 className="editorial-text text-3xl font-light text-exhibition-bone mb-3">
            Curation Gate Locked
          </h2>
          
          <p className="text-xs font-mono text-zinc-500 mb-8 leading-relaxed">
            Please sync your student credentials at the gateway to upload artworks to the exhibition.
          </p>

          <Link to="/auth">
            <button className="w-full py-3 bg-exhibition-gold text-exhibition-void font-mono text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
              Access Gateway
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Generate 1:1 Live Preview Artwork Object
  const previewArtwork: Artwork = {
    id: 'preview-artwork',
    title: title.trim() || 'Untitled Canvas',
    description: description.trim() || 'A masterpiece in progress.',
    category,
    imageUrl: imageUrl.trim() || null,
    thumbnailUrl: imageUrl.trim() || null,
    videoUrl: videoUrl.trim() || null,
    artist: {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      college: currentUser.college,
      branch: currentUser.branch,
      year: currentUser.year,
      avatar: currentUser.avatar,
      bio: currentUser.bio,
      joinedDate: currentUser.joinedDate,
    },
    votes: 0,
    comments: [],
    createdAt: new Date(),
    status: 'pending',
  }

  return (
    <div className="min-h-screen bg-exhibition-void text-exhibition-bone overflow-x-hidden select-none pb-24 relative">
      {/* Spotlight and navigation guides */}
      <SpotlightCursor />
      <ExhibitionNav />

      <div className="max-w-6xl mx-auto px-6 pt-24 relative z-10">
        {/* Back Link */}
        <Link to="/">
          <button className="flex items-center gap-2 text-zinc-500 hover:text-exhibition-gold transition-colors mb-8 font-mono text-xs uppercase tracking-widest bg-transparent border-0 cursor-pointer">
            <ArrowLeft size={14} />
            <span>Exhibition Hall</span>
          </button>
        </Link>

        {/* Title */}
        <div className="text-center lg:text-left mb-12">
          <span className="font-mono text-[9px] text-exhibition-gold uppercase tracking-[0.3em] block mb-2">
            Curation Submission
          </span>
          <h1 className="editorial-text text-4xl md:text-6xl font-light text-exhibition-bone">
            Hang Your Work
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-2 max-w-sm">
            Configure your canvas presentation below. All uploads are moderated.
          </p>
        </div>

        {/* Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input form */}
          <div className="lg:col-span-7 bg-[#0c0c0c] border border-zinc-900 p-8 relative">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[9px] text-exhibition-gold">
              <span className="w-1.5 h-1.5 bg-exhibition-gold rounded-full" />
              <span>Lab Room: 104</span>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                  Canvas Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cyberpunk Reverie"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
                  required
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                  Cover Image URL (Direct Link)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
                />
              </div>

              {/* Category card selector (Instead of standard select dropdown) */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-3">
                  Select Room wing
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat, idx) => (
                    <div
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`border p-3 cursor-pointer text-center transition-all ${
                        category === cat
                          ? 'border-exhibition-gold bg-exhibition-gold/5 text-exhibition-gold'
                          : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-mono text-[9px] uppercase tracking-wider">
                        Room 0{idx + 1}
                      </div>
                      <div className="text-[10px] font-mono uppercase mt-1">
                        {cat.replace('-', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video URL (If Filmmaking) */}
              {category === 'filmmaking' && (
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                    YouTube Embed URL
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
                  />
                  <p className="text-[8px] font-mono text-zinc-500 mt-1">
                    Must format as embed code (YouTube domain ending in /embed/ID)
                  </p>
                </div>
              )}

              {/* Concept description */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                  Conceptual Statement
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell the curation committee the narrative story behind your canvas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 text-xs font-sans px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50 resize-none"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-exhibition-gold text-exhibition-void font-mono font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Submit for curation review
              </button>
            </form>
          </div>

          {/* Live placard preview */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4 text-center lg:text-left">
              1:1 Corridor Placard preview
            </h3>

            <div className="border border-zinc-900 bg-black/10 py-6 px-4">
              <ArtworkFrame artwork={previewArtwork} />
            </div>

            {/* Curation requirements helper */}
            <div className="border border-zinc-900/60 p-5 mt-6 bg-[#090909]">
              <h4 className="font-mono text-[9px] text-exhibition-gold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>Museum Guidelines</span>
              </h4>
              <ul className="space-y-2 font-mono text-[9px] text-zinc-500 leading-relaxed list-disc pl-4 uppercase">
                <li>Artworks must be fully owned by the submitting student.</li>
                <li>Curation approval typically finishes within 24 hours.</li>
                <li>Approved canvases will be mounted in the corridor lobby.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
