import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, School, BookOpen, User, Award, Compass, ShieldAlert } from 'lucide-react'
import { clearSession, getToken } from '../lib/session'
import ExhibitionNav from '../components/ExhibitionNav'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'votes' | 'comments'>('votes')

  // Read session from localStorage — no AppContext needed
  const token = getToken()
  const userId = localStorage.getItem('lenscape_user_id') || ''
  const userName = localStorage.getItem('lenscape_user_name') || ''
  const userEmail = localStorage.getItem('lenscape_user_email') || ''
  const profileComplete = localStorage.getItem('lenscape_profile_complete') === 'true'

  useEffect(() => {
    if (!token) navigate('/auth/login')
    else if (!profileComplete) navigate('/profile/setup')
  }, [token, profileComplete, navigate])

  const handleLogout = () => {
    clearSession()
    navigate('/')
  }

  if (!token || !profileComplete) {
    return (
      <div className="min-h-screen bg-exhibition-void flex items-center justify-center">
        <span className="font-mono text-xs text-exhibition-gold animate-pulse uppercase tracking-widest">Loading...</span>
      </div>
    )
  }

  // Retrieve college/branch/bio from token payload (they're stored after profile setup)
  const college = localStorage.getItem('lenscape_user_college') || ''
  const branch = localStorage.getItem('lenscape_user_branch') || ''
  const bio = localStorage.getItem('lenscape_user_bio') || ''
  const avatar = localStorage.getItem('lenscape_user_avatar') || `https://api.dicebear.com/7.x/bottts/svg?seed=${userEmail}`

  return (
    <div className="min-h-screen bg-exhibition-void text-exhibition-bone pb-24">
      <ExhibitionNav />

      {/* Header */}
      <div className="relative border-b border-zinc-900/60 bg-black/10 py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-32 h-32 bg-[#0c0c0c] border border-exhibition-gold p-2 relative flex-shrink-0 shadow-2xl">
              <img src={avatar} className="w-full h-full object-cover" alt={userName} />
              <div className="absolute -bottom-2 -right-2 bg-exhibition-gold text-exhibition-void px-2 py-0.5 text-[8px] font-mono font-bold tracking-widest uppercase">
                Active
              </div>
            </div>
            <div>
              <span className="font-mono text-[10px] text-exhibition-gold uppercase tracking-[0.3em] block mb-2">
                Registered Student Artist
              </span>
              <h1 className="editorial-text text-5xl md:text-7xl font-light text-exhibition-bone tracking-wide leading-none">
                {userName}
              </h1>
              <p className="text-xs font-mono text-zinc-500 mt-3 max-w-xl italic">
                {bio ? `"${bio}"` : `"Exploring new visual dimensions in Lenscape."`}
              </p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="px-5 py-2.5 border border-red-500/30 hover:border-red-500 text-red-400 text-xs font-mono uppercase tracking-widest transition-colors">
            Exit Terminal
          </button>
        </div>
      </div>

      {/* Info placard */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        {(college || branch) && (
          <div className="border border-zinc-900 p-6 bg-[#0c0c0c] mb-12 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between shadow-lg">
            {college && (
              <div className="flex items-center gap-3">
                <School size={16} className="text-exhibition-gold" />
                <div>
                  <span className="text-[8px] text-zinc-500 font-mono block">INSTITUTION</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-exhibition-bone">{college}</span>
                </div>
              </div>
            )}
            {branch && (
              <div className="flex items-center gap-3">
                <BookOpen size={16} className="text-exhibition-gold" />
                <div>
                  <span className="text-[8px] text-zinc-500 font-mono block">CREATIVE DISCIPLINE</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-exhibition-bone">{branch}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <User size={16} className="text-exhibition-gold" />
              <div>
                <span className="text-[8px] text-zinc-500 font-mono block">EMAIL</span>
                <span className="text-xs font-mono text-exhibition-bone">{userEmail}</span>
              </div>
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="border border-zinc-900 p-8 bg-[#0c0c0c] mb-16">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-exhibition-gold mb-6 flex items-center gap-2">
            <Award size={14} /> Exhibition Badges
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'ach1', title: 'Creative Pioneer', desc: 'First upload', icon: '🚀' },
              { id: 'ach2', title: 'Art Critic', desc: 'First comment', icon: '💬' },
              { id: 'ach3', title: 'Grand Patron', desc: 'Voted in 3 categories', icon: '👑' },
              { id: 'ach4', title: 'Polymath', desc: 'Voted in all domains', icon: '🔮' },
            ].map(ach => (
              <div key={ach.id} className="border border-zinc-900 bg-black/10 opacity-30 p-5 text-center">
                <div className="text-3xl mb-3">{ach.icon}</div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">{ach.title}</h4>
                <p className="text-[9px] font-mono text-zinc-600 mt-1 uppercase">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder content note */}
        <div className="text-center py-20 border border-zinc-900 bg-black/10">
          <Compass className="w-8 h-8 text-zinc-700 mx-auto mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Your submissions and votes will appear here
          </p>
          <Link to="/submit" className="inline-block mt-6">
            <button className="px-6 py-2.5 bg-exhibition-gold text-exhibition-void font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors">
              Submit Your Artwork
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
