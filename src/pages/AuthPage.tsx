import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Shield, Check, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import ParticleField from '../components/ParticleField'
import SpotlightCursor from '../components/SpotlightCursor'

export default function AuthPage() {
  const { login, signup, currentUser } = useApp()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [college, setCollege] = useState('')
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState('1st Year')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=cyber')

  const avatarSeeds = ['pixel', 'glitch', 'neon', 'matrix', 'terminal', 'cyber']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      alert('Please fill in email.')
      return
    }

    if (isLogin) {
      const success = login(email)
      if (success) {
        navigate('/profile')
      } else {
        alert('Credentials not recognized. Please sign up or use Quick-Login below.')
      }
    } else {
      if (!name || !college || !branch) {
        alert('Please complete the signature, college, and branch details.')
        return
      }
      signup(name, email, college, branch, year, bio, avatar)
      navigate('/profile')
    }
  }

  const handleQuickLogin = (quickEmail: string) => {
    const success = login(quickEmail)
    if (success) {
      navigate('/profile')
    }
  }

  return (
    <div className="min-h-screen bg-exhibition-void text-exhibition-bone relative overflow-hidden py-16 px-4 flex items-center justify-center select-none">
      {/* Background drifting particles */}
      <ParticleField color="rgba(201, 168, 76, 0.2)" count={70} />
      <SpotlightCursor />

      <div className="max-w-md w-full z-10">
        {/* Back navigation */}
        <Link to="/">
          <button className="flex items-center gap-2 text-zinc-500 hover:text-exhibition-gold transition-colors mb-8 font-mono text-xs uppercase tracking-widest bg-transparent border-0 cursor-pointer">
            <ArrowLeft size={14} />
            <span>Exhibition Hall</span>
          </button>
        </Link>

        {/* Credentials Panel */}
        <div className="bg-[#0c0c0c] border border-exhibition-gold/25 p-8 md:p-10 shadow-2xl relative">
          {/* Metal Corner Screws */}
          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full" />

          <div className="text-center mb-8">
            <span className="font-mono text-[9px] text-exhibition-gold uppercase tracking-[0.3em] block mb-2">
              Credentials Registry
            </span>
            <h2 className="editorial-text text-4xl font-light text-exhibition-bone">
              {isLogin ? 'Enter Exhibition' : 'Sign Signature'}
            </h2>
            {currentUser && (
              <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest mt-2 block">
                Session Active: {currentUser.name}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                {/* Signature / Name */}
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                    Creator Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tanisha"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
                  />
                </div>

                {/* College & Branch */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                      College
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JNEC"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                      Branch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Animation"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
                    />
                  </div>
                </div>

                {/* Year & Bio */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                      Academic Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                      Brief Bio
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3D Animator"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
                    />
                  </div>
                </div>

                {/* Avatar select */}
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-3">
                    Select Identity Avatar
                  </label>
                  <div className="flex gap-3 overflow-x-auto pb-1 justify-center no-scrollbar">
                    {avatarSeeds.map((seed) => {
                      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`
                      return (
                        <div
                          key={seed}
                          onClick={() => setAvatar(avatarUrl)}
                          className={`w-10 h-10 border cursor-pointer flex items-center justify-center relative transition-all ${
                            avatar === avatarUrl
                              ? 'border-exhibition-gold scale-105 bg-exhibition-gold/5'
                              : 'border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <img src={avatarUrl} alt="Avatar" className="w-8 h-8 object-contain" />
                          {avatar === avatarUrl && (
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-exhibition-gold rounded-full" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                Student Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. sarah@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-4 bg-exhibition-gold text-exhibition-void font-mono font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              {isLogin ? 'Sync credentials' : 'Register Signature'}
            </button>
          </form>

          {/* Form Switcher */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="bg-transparent border-none font-mono text-[10px] text-zinc-500 hover:text-exhibition-gold transition-colors underline cursor-pointer uppercase tracking-wider"
            >
              {isLogin ? 'Register a new signature' : 'Enter existing credentials'}
            </button>
          </div>

          {/* Developer quick login */}
          <div className="mt-8 border-t border-zinc-900 pt-6">
            <h3 className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-1.5 justify-center">
              <Shield size={12} className="text-exhibition-gold" />
              <span>Developer Entry Bypass</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleQuickLogin('alex@college.edu')}
                className="py-3 px-4 bg-[#121212] border border-zinc-800 hover:border-exhibition-gold text-center transition-colors group cursor-pointer"
              >
                <div className="font-mono text-xs font-bold text-exhibition-bone group-hover:text-exhibition-gold">
                  Alex Chen
                </div>
                <div className="text-[9px] font-mono text-zinc-500 mt-0.5">Artist account</div>
              </button>

              <button
                onClick={() => handleQuickLogin('admin@jlug.club')}
                className="py-3 px-4 bg-[#121212] border border-zinc-800 hover:border-exhibition-gold text-center transition-colors group cursor-pointer"
              >
                <div className="font-mono text-xs font-bold text-exhibition-bone group-hover:text-exhibition-gold">
                  Jlug Admin
                </div>
                <div className="text-[9px] font-mono text-zinc-500 mt-0.5">Curator account</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
