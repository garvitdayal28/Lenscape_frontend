import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Sparkles, UploadCloud, X } from 'lucide-react'
import ExhibitionNav from '../components/ExhibitionNav'
import { authHeaders, getToken } from '../lib/session'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Fixed event categories & subcategories ───────────────────────────────────
const EVENT_CATEGORIES = [
  {
    id: 'photography',
    label: 'Photography',
    room: '01',
    subcategories: ['Portrait Photography', 'Landscape Photography'],
  },
  {
    id: 'digital-art',
    label: 'Digital Art',
    room: '02',
    subcategories: ['Concept Art', 'Character Design'],
  },
  {
    id: 'cinematography',
    label: 'Cinematography',
    room: '03',
    subcategories: ['Short Film', 'Travel Film'],
  },
  {
    id: 'motion-graphics',
    label: 'Motion Graphics',
    room: '04',
    subcategories: ['Logo Animation', 'Explainer Video'],
  },
]

export default function SubmitPage() {
  const navigate = useNavigate()

  const token = getToken()
  const profileComplete = localStorage.getItem('lenscape_profile_complete') === 'true'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(EVENT_CATEGORIES[0].id)
  const [subcategory, setSubcategory] = useState(EVENT_CATEGORIES[0].subcategories[0])
  const [videoUrl, setVideoUrl] = useState('')

  const selectedCat = EVENT_CATEGORIES.find(c => c.id === category) || EVENT_CATEGORIES[0]

  // When category changes, reset subcategory to first option
  const handleCategoryChange = (id: string) => {
    setCategory(id)
    const cat = EVENT_CATEGORIES.find(c => c.id === id)
    if (cat) setSubcategory(cat.subcategories[0])
  }
  const [imagePreview, setImagePreview] = useState('')
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // ── Handle file selection + Cloudinary upload ────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    await uploadToCloudinary(file)
  }

  const uploadToCloudinary = async (file: File) => {
    setUploading(true)
    setUploadedUrl('')
    try {
      // 1. Get signed upload params from backend
      const sigRes = await fetch(`${API}/api/cloudinary/signature`, { headers: authHeaders() })
      const sig = await sigRes.json()
      if (!sigRes.ok) { setError(sig.error || 'Could not get upload signature'); setUploading(false); return }

      // 2. Upload directly to Cloudinary
      const form = new FormData()
      form.append('file', file)
      form.append('api_key', sig.api_key)
      form.append('timestamp', sig.timestamp)
      form.append('signature', sig.signature)
      form.append('folder', sig.folder)

      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, {
        method: 'POST',
        body: form,
      })
      const upData = await upRes.json()
      if (!upRes.ok) { setError(upData.error?.message || 'Cloudinary upload failed'); setUploading(false); return }

      setUploadedUrl(upData.secure_url)
    } catch {
      setError('Image upload failed. Check your connection.')
    }
    setUploading(false)
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview('')
    setUploadedUrl('')
  }

  // ── Submit artwork to backend ─────────────────────────────────────────────────
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim()) { setError('Title and description are required.'); return }
    if (!uploadedUrl) { setError('Please upload a cover image.'); return }

    setSubmitting(true)
    try {
      const res = await fetch(`${API}/api/artworks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          subcategory,
          imageUrl: uploadedUrl,
          videoUrl: videoUrl.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Submission failed'); setSubmitting(false); return }
      setSuccess(true)
      setTimeout(() => navigate('/profile'), 1500)
    } catch {
      setError('Cannot reach server.')
    }
    setSubmitting(false)
  }

  // ── Auth gate ────────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-exhibition-void text-exhibition-bone flex items-center justify-center p-6 relative">
        <div className="max-w-md w-full bg-[#0d0d0d] border border-exhibition-gold/20 p-10 text-center relative">
          {['top-2 left-2','top-2 right-2','bottom-2 left-2','bottom-2 right-2'].map(p => (
            <div key={p} className={`absolute ${p} w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full`} />
          ))}
          <AlertTriangle className="w-12 h-12 text-exhibition-gold mx-auto mb-6" />
          <h2 className="editorial-text text-3xl font-light mb-3">Curation Gate Locked</h2>
          <p className="text-xs font-mono text-zinc-500 mb-8 leading-relaxed">
            Please sign in to upload artworks to the exhibition.
          </p>
          <Link to="/auth/login">
            <button className="w-full py-3 bg-exhibition-gold text-exhibition-void font-mono text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
              Access Gateway
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (!profileComplete) {
    navigate('/profile/setup')
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-exhibition-void text-exhibition-bone flex items-center justify-center p-6">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-exhibition-gold mx-auto mb-6" />
          <h2 className="editorial-text text-3xl font-light mb-2">Submission Received</h2>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Sent to the curation committee for review
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-exhibition-void text-exhibition-bone pb-24 relative">
      <ExhibitionNav />

      <div className="max-w-6xl mx-auto px-6 pt-24 relative z-10">
        <Link to="/">
          <button className="flex items-center gap-2 text-zinc-500 hover:text-exhibition-gold transition-colors mb-8 font-mono text-xs uppercase tracking-widest bg-transparent border-0 cursor-pointer">
            <ArrowLeft size={14} /> Exhibition Hall
          </button>
        </Link>

        <div className="text-center lg:text-left mb-12">
          <span className="font-mono text-[9px] text-exhibition-gold uppercase tracking-[0.3em] block mb-2">Curation Submission</span>
          <h1 className="editorial-text text-4xl md:text-6xl font-light">Hang Your Work</h1>
          <p className="text-xs font-mono text-zinc-500 mt-2 max-w-sm">
            Configure your canvas below. All uploads are moderated.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7 bg-[#0c0c0c] border border-zinc-900 p-8 relative">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Canvas Title</label>
                <input type="text" placeholder="e.g. Cyberpunk Reverie" value={title} onChange={e => setTitle(e.target.value)} required
                  className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50" />
              </div>

              {/* Image upload */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Cover Image</label>
                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-zinc-800 cursor-pointer hover:border-exhibition-gold/50 transition-colors">
                    <UploadCloud className="w-8 h-8 text-zinc-600 mb-3" />
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Click to upload</span>
                    <span className="font-mono text-[8px] text-zinc-600 mt-1">PNG, JPG, GIF · max 10MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="relative w-full h-44 border border-zinc-800 overflow-hidden">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="font-mono text-[10px] text-exhibition-gold animate-pulse uppercase tracking-widest">Uploading...</span>
                      </div>
                    )}
                    {uploadedUrl && !uploading && (
                      <div className="absolute bottom-2 left-2 bg-exhibition-gold text-exhibition-void px-2 py-0.5 text-[8px] font-mono font-bold uppercase">Uploaded ✓</div>
                    )}
                    <button type="button" onClick={clearImage}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/80 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-3">Category</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {EVENT_CATEGORIES.map(cat => (
                    <div key={cat.id} onClick={() => handleCategoryChange(cat.id)}
                      className={`border p-3 cursor-pointer text-center transition-all ${
                        category === cat.id ? 'border-exhibition-gold bg-exhibition-gold/5 text-exhibition-gold' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Room {cat.room}</div>
                      <div className="text-[11px] font-mono uppercase mt-1 font-bold">{cat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Subcategory */}
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Subcategory</label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedCat.subcategories.map(sub => (
                    <div key={sub} onClick={() => setSubcategory(sub)}
                      className={`border px-3 py-2.5 cursor-pointer text-center transition-all ${
                        subcategory === sub ? 'border-exhibition-gold bg-exhibition-gold/5 text-exhibition-gold' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}>
                      <div className="text-[10px] font-mono uppercase tracking-wide">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video URL for cinematography */}
              {category === 'cinematography' && (
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">YouTube Embed URL</label>
                  <input type="url" placeholder="https://www.youtube.com/embed/..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50" />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Conceptual Statement</label>
                <textarea rows={4} placeholder="The story behind your canvas..." value={description} onChange={e => setDescription(e.target.value)} required
                  className="w-full bg-[#121212] border border-zinc-800 text-xs font-sans px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50 resize-none" />
              </div>

              {error && <p className="font-mono text-[10px] text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2">{error}</p>}

              <button type="submit" disabled={submitting || uploading}
                className="w-full py-4 bg-exhibition-gold text-exhibition-void font-mono font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50">
                {submitting ? 'Submitting...' : uploading ? 'Wait for upload...' : 'Submit for Curation Review'}
              </button>
            </form>
          </div>

          {/* Live preview */}
          <div className="lg:col-span-5">
            <h3 className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Corridor Placard Preview</h3>
            <div className="border border-zinc-900 bg-black/10 p-6">
              <div className="museum-frame aspect-[4/3] relative overflow-hidden mb-4">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">No image yet</div>
                )}
              </div>
              <div className="bg-[#0d0d0d] border border-exhibition-gold/20 p-4 text-center">
                <h4 className="editorial-text text-xl font-bold text-exhibition-bone">{title || 'Untitled Canvas'}</h4>
                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{category.replace('-', ' ')}</p>
              </div>
            </div>

            <div className="border border-zinc-900/60 p-5 mt-6 bg-[#090909]">
              <h4 className="font-mono text-[9px] text-exhibition-gold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sparkles size={12} /> Museum Guidelines
              </h4>
              <ul className="space-y-2 font-mono text-[9px] text-zinc-500 leading-relaxed list-disc pl-4 uppercase">
                <li>Artworks must be fully owned by the submitting student.</li>
                <li>Curation approval typically finishes within few hours.</li>
                <li>Approved canvases will be mounted in the corridor lobby.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
