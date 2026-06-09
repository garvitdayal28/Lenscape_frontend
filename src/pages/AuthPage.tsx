import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, CheckCircle, RefreshCw, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleField from '../components/ParticleField'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Step types ────────────────────────────────────────────────────────────────
type Step = 'email' | 'otp' | 'profile' | 'done'

export default function AuthPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [otpToken, setOtpToken] = useState('')        // signed token from backend
  const [resendCooldown, setResendCooldown] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Profile fields (new users only)
  const [name, setName] = useState('')
  const [college, setCollege] = useState('')
  const [branch, setBranch] = useState('')
  const [year, setYear] = useState('1st Year')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=cyber')
  const avatarSeeds = ['pixel', 'glitch', 'neon', 'matrix', 'terminal', 'cyber']

  // OTP input refs for auto-focus
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────────
  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to send OTP'); setLoading(false); return }
      setOtpToken(data.token)
      setStep('otp')
      setResendCooldown(60)
      setTimeout(() => otpRefs.current[0]?.focus(), 150)
    } catch {
      setError('Cannot reach server. Check your connection.')
    }
    setLoading(false)
  }

  // ── OTP digit input handling ─────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const digits = [...otpDigits]
    digits[index] = value.slice(-1)
    setOtpDigits(digits)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────────
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const otp = otpDigits.join('')
    if (otp.length < 6) { setError('Enter all 6 digits'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, token: otpToken }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Verification failed'); setLoading(false); return }

      if (data.newUser && !data.token) {
        // Backend says: new user, needs profile — stay on profile step
        setStep('profile')
      } else {
        // Existing user or new user with profile already in response
        saveSession(data.token, data.userId, data.name, data.email)
      }
    } catch {
      setError('Cannot reach server.')
    }
    setLoading(false)
  }

  // ── Step 3: Submit profile (new users) ───────────────────────────────────────
  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !college || !branch) { setError('Name, college and branch are required'); return }
    setError('')
    setLoading(true)
    const otp = otpDigits.join('')
    try {
      const res = await fetch(`${API}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, token: otpToken, name, college, branch, year, bio, avatar }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
      saveSession(data.token, data.userId, data.name, data.email)
    } catch {
      setError('Cannot reach server.')
    }
    setLoading(false)
  }

  const saveSession = (token: string, userId: string, userName: string, userEmail: string) => {
    localStorage.setItem('lenscape_user_token', token)
    localStorage.setItem('lenscape_user_id', userId)
    localStorage.setItem('lenscape_user_name', userName)
    localStorage.setItem('lenscape_user_email', userEmail)
    setStep('done')
    setTimeout(() => navigate('/profile'), 1200)
  }

  // ── Shared card wrapper ──────────────────────────────────────────────────────
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-[#0c0c0c] border border-exhibition-gold/25 p-8 md:p-10 shadow-2xl relative">
      {['top-2 left-2','top-2 right-2','bottom-2 left-2','bottom-2 right-2'].map(pos => (
        <div key={pos} className={`absolute ${pos} w-1.5 h-1.5 bg-exhibition-gold/30 rounded-full`} />
      ))}
      {children}
    </div>
  )

  return (
    <div className="min-h-screen bg-exhibition-void text-exhibition-bone relative overflow-hidden py-16 px-4 flex items-center justify-center select-none">
      <ParticleField color="rgba(201, 168, 76, 0.2)" count={70} />

      <div className="max-w-md w-full z-10">
        <Link to="/">
          <button className="flex items-center gap-2 text-zinc-500 hover:text-exhibition-gold transition-colors mb-8 font-mono text-xs uppercase tracking-widest bg-transparent border-0 cursor-pointer">
            <ArrowLeft size={14} /> Exhibition Hall
          </button>
        </Link>

        <AnimatePresence mode="wait">

          {/* ── Step: Email ── */}
          {step === 'email' && (
            <motion.div key="email" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <Card>
                <div className="text-center mb-8">
                  <span className="font-mono text-[9px] text-exhibition-gold uppercase tracking-[0.3em] block mb-2">
                    Credentials Registry
                  </span>
                  <h2 className="editorial-text text-4xl font-light text-exhibition-bone">Enter Exhibition</h2>
                  <p className="font-mono text-[10px] text-zinc-500 mt-2">
                    We'll send a one-time code to verify your email
                  </p>
                </div>

                <form onSubmit={sendOtp} className="space-y-5">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="you@college.edu"
                        className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono pl-9 pr-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50 placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  {error && <p className="font-mono text-[10px] text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2">{error}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-exhibition-gold text-exhibition-void font-mono font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50">
                    {loading ? 'Sending code...' : 'Send verification code'}
                  </button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* ── Step: OTP ── */}
          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <Card>
                <div className="text-center mb-8">
                  <span className="font-mono text-[9px] text-exhibition-gold uppercase tracking-[0.3em] block mb-2">
                    Verification
                  </span>
                  <h2 className="editorial-text text-4xl font-light text-exhibition-bone">Enter Code</h2>
                  <p className="font-mono text-[10px] text-zinc-500 mt-2">
                    6-digit code sent to <span className="text-exhibition-gold">{email}</span>
                  </p>
                </div>

                <form onSubmit={verifyOtp} className="space-y-6">
                  {/* OTP digit inputs */}
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otpDigits.map((d, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-11 h-14 text-center text-xl font-mono font-bold bg-[#121212] border border-zinc-800 text-exhibition-bone focus:outline-none focus:border-exhibition-gold transition-colors caret-exhibition-gold"
                      />
                    ))}
                  </div>

                  {error && <p className="font-mono text-[10px] text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2 text-center">{error}</p>}

                  <button type="submit" disabled={loading || otpDigits.join('').length < 6}
                    className="w-full py-4 bg-exhibition-gold text-exhibition-void font-mono font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>

                  {/* Resend + change email */}
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <button type="button" onClick={() => { setStep('email'); setOtpDigits(['','','','','','']); setError('') }}
                      className="text-zinc-500 hover:text-exhibition-gold transition-colors uppercase tracking-wider">
                      ← Change email
                    </button>
                    <button type="button" onClick={() => sendOtp()} disabled={resendCooldown > 0}
                      className="flex items-center gap-1 text-zinc-500 hover:text-exhibition-gold transition-colors uppercase tracking-wider disabled:opacity-40">
                      <RefreshCw size={10} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* ── Step: Profile (new users) ── */}
          {step === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <Card>
                <div className="text-center mb-8">
                  <span className="font-mono text-[9px] text-exhibition-gold uppercase tracking-[0.3em] block mb-2">
                    First Visit
                  </span>
                  <h2 className="editorial-text text-4xl font-light text-exhibition-bone">Sign Signature</h2>
                  <p className="font-mono text-[10px] text-zinc-500 mt-2">Complete your artist profile to join</p>
                </div>

                <form onSubmit={submitProfile} className="space-y-5">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Creator Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Tanisha"
                      className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">College</label>
                      <input type="text" value={college} onChange={e => setCollege(e.target.value)} required placeholder="e.g. JNEC"
                        className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50" />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Branch</label>
                      <input type="text" value={branch} onChange={e => setBranch(e.target.value)} required placeholder="e.g. CS"
                        className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Year</label>
                      <select value={year} onChange={e => setYear(e.target.value)}
                        className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50">
                        {['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-2">Bio</label>
                      <input type="text" value={bio} onChange={e => setBio(e.target.value)} placeholder="e.g. 3D Animator"
                        className="w-full bg-[#121212] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50" />
                    </div>
                  </div>

                  {/* Avatar */}
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-zinc-400 mb-3">Identity Avatar</label>
                    <div className="flex gap-3 justify-center flex-wrap">
                      {avatarSeeds.map(seed => {
                        const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`
                        return (
                          <div key={seed} onClick={() => setAvatar(url)}
                            className={`w-10 h-10 border cursor-pointer relative transition-all ${avatar === url ? 'border-exhibition-gold scale-105' : 'border-zinc-800 hover:border-zinc-700'}`}>
                            <img src={url} alt={seed} className="w-full h-full object-contain" />
                            {avatar === url && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-exhibition-gold rounded-full" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {error && <p className="font-mono text-[10px] text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2">{error}</p>}

                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-exhibition-gold text-exhibition-void font-mono font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50">
                    {loading ? 'Registering...' : 'Register Signature'}
                  </button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* ── Step: Done ── */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12">
              <div className="w-16 h-16 border border-exhibition-gold/40 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-exhibition-gold" />
              </div>
              <h2 className="editorial-text text-3xl font-light text-exhibition-bone mb-2">Verified</h2>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Entering your portfolio...</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
