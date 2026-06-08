import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon, Mail, Shield, Check, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const { login, signup, currentUser } = useApp();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('1st Year');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=cyber');
  
  // Available pre-set avatar seeds for dicebear bottts
  const avatarSeeds = ['pixel', 'glitch', 'neon', 'matrix', 'terminal', 'cyber'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Please fill in email.");
      return;
    }

    if (isLogin) {
      const success = login(email);
      if (success) {
        navigate('/profile');
      } else {
        alert("Account not found. Please sign up first or use Quick-Login below.");
      }
    } else {
      if (!name || !college || !branch) {
        alert("Please fill in Name, College, and Branch.");
        return;
      }
      signup(name, email, college, branch, year, bio, avatar);
      navigate('/profile');
    }
  };

  const handleQuickLogin = (quickEmail: string) => {
    const success = login(quickEmail);
    if (success) {
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-y2k-black text-white relative overflow-hidden y2k-grid py-12 px-4 flex items-center justify-center crt-scanlines">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-y2k-pink/10 blur-3xl rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-y2k-cyan/10 blur-3xl rounded-full" />

      <div className="max-w-xl w-full z-10">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-chrome hover:text-white transition-colors mb-6 glass-panel px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-sans text-xs tracking-widest uppercase">Back to Hub</span>
          </motion.button>
        </Link>

        {/* Auth Terminal Panel */}
        <div className="glass-panel rounded-3xl p-8 y2k-border relative">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-y2k-pink animate-pulse" />
              <span className="font-mono text-xs tracking-widest text-y2k-cyan uppercase">SYSTEM://AUTH_GATEWAY</span>
            </div>
            {currentUser && (
              <span className="font-sans text-xs text-y2k-lime uppercase tracking-widest">
                Active Session: {currentUser.name}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 text-center gradient-text">
            {isLogin ? 'ENTER LENSCAPE' : 'CREATE PROTOCOL'}
          </h1>
          <p className="font-sans text-xs text-chrome text-center mb-8 uppercase tracking-widest">
            {isLogin ? 'Sync credentials with the college digital core' : 'Register your creative signature'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-pink mb-2">Creator Signature (Name)</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" />
                    <input
                      type="text"
                      placeholder="e.g. Tanisha"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-pink transition-colors font-sans text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-cyan mb-2">College Campus</label>
                    <input
                      type="text"
                      placeholder="e.g. JNEC"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-cyan transition-colors font-sans text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-cyan mb-2">Academic Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. Animation & Design"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-cyan transition-colors font-sans text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-lime mb-2">Academic Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 bg-y2k-black border border-white/10 rounded-xl outline-none focus:border-y2k-lime transition-colors font-sans text-sm"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-lime mb-2">Creator Bio</label>
                    <input
                      type="text"
                      placeholder="e.g. 3D animator and photographer"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-lime transition-colors font-sans text-sm"
                    />
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-pink mb-3">Choose Neural Avatar</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
                    {avatarSeeds.map((seed) => {
                      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
                      return (
                        <div
                          key={seed}
                          onClick={() => setAvatar(avatarUrl)}
                          className={`w-12 h-12 rounded-xl glass-panel p-1 cursor-pointer flex items-center justify-center relative border transition-all ${
                            avatar === avatarUrl ? 'border-y2k-pink scale-110' : 'border-transparent hover:border-white/20'
                          }`}
                        >
                          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                          {avatar === avatarUrl && (
                            <div className="absolute -top-1 -right-1 bg-y2k-pink text-black rounded-full p-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-y2k-cyan mb-2">Universal Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome" />
                <input
                  type="email"
                  placeholder="e.g. sarah@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-cyan transition-colors font-sans text-sm"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-y2k-pink via-y2k-cyan to-y2k-lime text-black font-display font-bold tracking-widest uppercase rounded-full shadow-lg hover:shadow-cyan/20 transition-all text-sm"
            >
              {isLogin ? 'EXECUTE SYNCHRONIZATION' : 'INITIALIZE CONTRACT'}
            </motion.button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-mono text-xs text-chrome hover:text-white transition-colors underline uppercase tracking-wider"
            >
              {isLogin ? 'Need a new signature? Create Protocol' : 'Already have credentials? Access terminal'}
            </button>
          </div>

          {/* Quick-Login Panel */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="font-mono text-[10px] text-y2k-pink uppercase tracking-widest mb-3 flex items-center gap-1.5 justify-center">
              <Shield className="w-3.5 h-3.5" /> Developer Access Bypass (Quick Testing)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickLogin('alex@college.edu')}
                className="py-2.5 px-3 glass-panel-cyan rounded-2xl flex flex-col items-center justify-center text-center group"
              >
                <span className="font-display text-xs font-bold text-y2k-cyan group-hover:underline">Alex Chen</span>
                <span className="font-mono text-[9px] text-white/50">Student (Creative)</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickLogin('admin@jlug.club')}
                className="py-2.5 px-3 glass-panel rounded-2xl flex flex-col items-center justify-center text-center group border-y2k-pink"
              >
                <span className="font-display text-xs font-bold text-y2k-pink group-hover:underline">Jlug Admin</span>
                <span className="font-mono text-[9px] text-white/50">Administrator</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
