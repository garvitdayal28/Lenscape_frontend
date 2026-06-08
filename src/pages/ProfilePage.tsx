import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, School, BookOpen, User, Award, Compass, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import SpotlightCursor from '../components/SpotlightCursor'
import ExhibitionNav from '../components/ExhibitionNav'

export default function ProfilePage() {
  const { currentUser, logout, artworks } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'submissions' | 'votes' | 'comments'>('submissions')

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-exhibition-void text-exhibition-bone flex items-center justify-center p-6 select-none relative">
        <SpotlightCursor />
        
        <div className="max-w-md w-full bg-[#0d0d0d] border border-exhibition-gold/20 p-10 text-center relative">
          {/* Metal style corner rivets */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />

          <ShieldAlert className="w-12 h-12 text-exhibition-gold mx-auto mb-6" />
          
          <h2 className="editorial-text text-3xl font-light text-exhibition-bone mb-3">
            Gates Locked
          </h2>
          
          <p className="text-xs font-mono text-zinc-500 mb-8 leading-relaxed">
            Please sync your student credentials at the terminal to access your portfolio space.
          </p>

          <Link to="/auth">
            <button className="w-full py-3 bg-exhibition-gold text-exhibition-void font-mono text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
              Access Terminal
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Get current user uploads
  const mySubmissions = artworks.filter((a) => a.artist.id === currentUser.id)

  // Get votes count
  const myVotesCount = currentUser.votedCategories.length

  // Find comments left by user
  const userComments = artworks.flatMap((art) =>
    art.comments
      .filter((c) => c.userId === currentUser.id)
      .map((c) => ({
        ...c,
        artworkTitle: art.title,
        artworkId: art.id,
      }))
  )

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Achievements config
  const achievementsConfig = [
    { id: 'ach1', title: 'Creative Pioneer', desc: 'First upload registered', icon: '🚀' },
    { id: 'ach2', title: 'Art Critic', desc: 'Structured feedback logged', icon: '💬' },
    { id: 'ach3', title: 'Grand Patron', desc: 'Voted in 3 categories', icon: '👑' },
    { id: 'ach4', title: 'Polymath', desc: 'Voted in all domains', icon: '🔮' },
  ]

  const hasUnlockedAchievement = (achId: string) => {
    return currentUser.achievements.some((a) => a.id === achId)
  }

  return (
    <div className="min-h-screen bg-exhibition-void text-exhibition-bone overflow-x-hidden select-none pb-24 relative">
      {/* Spotlight and Nav overlay */}
      <SpotlightCursor />
      <ExhibitionNav />

      {/* Full-bleed Header with massive editorial typography */}
      <div className="relative border-b border-zinc-900/60 bg-black/10 py-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-12 relative z-10">
          
          {/* Artist identity block */}
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            {/* Portrait Frame */}
            <div className="w-32 h-32 bg-[#0c0c0c] border border-exhibition-gold p-2 relative flex-shrink-0 shadow-2xl">
              <img
                src={currentUser.avatar || ''}
                className="w-full h-full object-cover"
                alt={currentUser.name}
              />
              <div className="absolute -bottom-2 -right-2 bg-exhibition-gold text-exhibition-void px-2 py-0.5 text-[8px] font-mono font-bold tracking-widest uppercase">
                Active
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] text-exhibition-gold uppercase tracking-[0.3em] block mb-2">
                Registered Student Artist
              </span>
              <h1 className="editorial-text text-5xl md:text-7xl font-light text-exhibition-bone tracking-wide leading-none">
                {currentUser.name}
              </h1>
              <p className="text-xs font-mono text-zinc-500 mt-3 max-w-xl italic">
                "{currentUser.bio || 'Exploring new visual dimensions in Lenscape.'}"
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 border border-red-500/30 hover:border-red-500 text-red-400 text-xs font-mono uppercase tracking-widest transition-colors"
          >
            Exit Terminal
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        
        {/* Credentials / University Detail Placard */}
        <div className="border border-zinc-900 p-6 bg-[#0c0c0c] mb-12 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <School size={16} className="text-exhibition-gold" />
            <div>
              <span className="text-[8px] text-zinc-500 font-mono block">INSTITUTION</span>
              <span className="text-xs font-mono uppercase tracking-wider text-exhibition-bone">{currentUser.college}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-exhibition-gold" />
            <div>
              <span className="text-[8px] text-zinc-500 font-mono block">CREATIVE DISCIPLINE</span>
              <span className="text-xs font-mono uppercase tracking-wider text-exhibition-bone">{currentUser.branch}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User size={16} className="text-exhibition-gold" />
            <div>
              <span className="text-[8px] text-zinc-500 font-mono block">ACADEMIC LEVEL</span>
              <span className="text-xs font-mono uppercase tracking-wider text-exhibition-bone">{currentUser.year}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Statistics grid */}
        <div className="grid grid-cols-3 gap-6 mb-16 text-center">
          <div className="border border-zinc-900/60 py-6 bg-[#090909]">
            <span className="editorial-text text-4xl font-bold text-exhibition-gold">{mySubmissions.length}</span>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mt-1">Canvases</span>
          </div>
          <div className="border border-zinc-900/60 py-6 bg-[#090909]">
            <span className="editorial-text text-4xl font-bold text-exhibition-gold">{myVotesCount}</span>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mt-1">Votes</span>
          </div>
          <div className="border border-zinc-900/60 py-6 bg-[#090909]">
            <span className="editorial-text text-4xl font-bold text-exhibition-gold">{userComments.length}</span>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mt-1">Feedbacks</span>
          </div>
        </div>

        {/* Physical achievement badges (wood/brass plate aesthetic) */}
        <div className="border border-zinc-900 p-8 bg-[#0c0c0c] mb-16">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-exhibition-gold mb-6 flex items-center gap-2">
            <Award size={14} />
            <span>Exhibition Badges Unlocked</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievementsConfig.map((ach) => {
              const unlocked = hasUnlockedAchievement(ach.id)
              return (
                <div
                  key={ach.id}
                  className={`border p-5 text-center relative transition-all duration-500 ${
                    unlocked
                      ? 'border-exhibition-gold bg-[#0e0d0a] shadow-md shadow-exhibition-gold/5'
                      : 'border-zinc-900 bg-black/10 opacity-30'
                  }`}
                >
                  <div className="text-3xl mb-3">{ach.icon}</div>
                  <h4 className={`font-mono text-xs font-bold uppercase tracking-wider ${unlocked ? 'text-exhibition-gold' : 'text-zinc-500'}`}>
                    {ach.title}
                  </h4>
                  <p className="text-[9px] font-mono text-zinc-500 mt-1 uppercase">
                    {ach.desc}
                  </p>
                  {unlocked && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-exhibition-gold" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-900 mb-8 font-mono text-[10px] uppercase tracking-[0.25em]">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`py-3 px-6 border-b transition-all ${
              activeTab === 'submissions'
                ? 'border-exhibition-gold text-exhibition-gold font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            My Submissions ({mySubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            className={`py-3 px-6 border-b transition-all ${
              activeTab === 'votes'
                ? 'border-exhibition-gold text-exhibition-gold font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Voting Registry ({myVotesCount})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-3 px-6 border-b transition-all ${
              activeTab === 'comments'
                ? 'border-exhibition-gold text-exhibition-gold font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Feedbacks logged ({userComments.length})
          </button>
        </div>

        {/* Tab panels */}
        <div>
          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mySubmissions.map((art) => {
                const statusColors = {
                  approved: 'border-exhibition-gold/40 text-exhibition-gold',
                  pending: 'border-cyan-500/40 text-cyan-400',
                  rejected: 'border-red-500/40 text-red-400',
                }
                return (
                  <div key={art.id} className="border border-zinc-900 p-4 bg-[#0d0d0d] flex flex-col justify-between h-80 relative group hover:border-exhibition-gold/40 transition-colors">
                    {/* Image */}
                    <div className="h-[55%] w-full overflow-hidden border border-zinc-800 relative bg-black">
                      <img
                        src={art.thumbnailUrl || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt=""
                      />
                      <div className={`absolute top-2 right-2 border px-2 py-0.5 text-[8px] font-mono tracking-widest uppercase bg-black/90 ${statusColors[art.status]}`}>
                        {art.status}
                      </div>
                    </div>
                    
                    {/* Metadata */}
                    <div className="mt-4">
                      <h4 className="editorial-text text-lg font-bold text-exhibition-bone truncate">
                        {art.title}
                      </h4>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                        {art.category.replace('-', ' ')}
                      </span>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-900 font-mono text-[9px] text-zinc-500">
                        <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                        <span>{art.votes} votes logged</span>
                      </div>
                    </div>
                  </div>
                )
              })}

              {mySubmissions.length === 0 && (
                <div className="col-span-3 text-center py-20 border border-zinc-900 bg-black/10">
                  <Compass className="w-8 h-8 text-zinc-700 mx-auto mb-4" />
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    No artworks found in your portfolio
                  </p>
                  <Link to="/submit" className="inline-block mt-6">
                    <button className="px-6 py-2.5 bg-exhibition-gold text-exhibition-void font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors">
                      Submit Your Artwork
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Voting registry Tab */}
          {activeTab === 'votes' && (
            <div className="flex flex-col gap-4">
              {currentUser.votedCategories.map((cat) => (
                <div key={cat} className="border border-zinc-900 p-5 bg-[#0c0c0c] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-exhibition-gold" />
                    <div>
                      <span className="text-[8px] text-zinc-500 font-mono block">VOTE LOGGED IN CATEGORY</span>
                      <span className="font-mono text-xs uppercase tracking-widest text-exhibition-bone">
                        {cat.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <Link to="/gallery">
                    <button className="px-4 py-1.5 border border-exhibition-gold/40 hover:border-exhibition-gold text-exhibition-gold text-[10px] font-mono uppercase tracking-widest transition-colors">
                      Enter Room
                    </button>
                  </Link>
                </div>
              ))}

              {currentUser.votedCategories.length === 0 && (
                <div className="text-center py-20 border border-zinc-900 bg-black/10">
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    No votes cast yet.
                  </p>
                  <Link to="/gallery" className="inline-block mt-4">
                    <button className="px-6 py-2.5 bg-exhibition-gold text-exhibition-void font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors">
                      Explore Exhibition
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Activity/Comments Tab */}
          {activeTab === 'comments' && (
            <div className="flex flex-col gap-4">
              {userComments.map((com) => (
                <div key={com.id} className="border border-zinc-900 p-5 bg-[#0c0c0c]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[8px] text-zinc-500 font-mono block">FEEDBACK RECORDED ON CANVAS</span>
                      <span className="editorial-text text-md font-bold text-exhibition-gold">{com.artworkTitle}</span>
                    </div>
                    <span className="font-mono text-[9px] text-zinc-600">{new Date(com.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans italic leading-relaxed">
                    "{com.content}"
                  </p>
                </div>
              ))}

              {userComments.length === 0 && (
                <div className="text-center py-20 border border-zinc-900 bg-black/10">
                  <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    No reviews logged yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
