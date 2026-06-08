import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, School, Sparkles, BookOpen, Award, CheckSquare, MessageCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { currentUser, logout, artworks } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'submissions' | 'votes' | 'comments'>('submissions');

  if (!currentUser) {
    // If not logged in, show access warning
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6 y2k-grid crt-scanlines">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border-y2k-pink text-center">
          <Award className="w-16 h-16 text-y2k-pink mx-auto mb-4 animate-pulse" />
          <h2 className="font-display text-3xl font-bold uppercase mb-3">ACCESS GATES LOCKED</h2>
          <p className="font-sans text-xs text-chrome mb-8 leading-relaxed">
            Please sync your student credentials to view and manage your creative portfolio registry.
          </p>
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full py-4 bg-gradient-to-r from-y2k-pink to-y2k-cyan text-black font-mono text-xs uppercase font-extrabold tracking-widest rounded-full"
            >
              Access Auth Terminal
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  // Get current user uploads from context (so it updates in real time)
  const mySubmissions = artworks.filter(a => a.artist.id === currentUser.id);

  // Get votes count
  const myVotesCount = currentUser.votedCategories.length;

  // Find actual artworks the user voted for
  // Note: we can list the categories the user voted in
  const votedCategoriesList = currentUser.votedCategories;

  // Find comments left by user
  const userComments = artworks.flatMap(art => 
    art.comments.filter(c => c.userId === currentUser.id).map(c => ({
      ...c,
      artworkTitle: art.title,
      artworkId: art.id
    }))
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define achievements list
  const achievementsList = [
    { id: 'ach1', title: 'Creative Pioneer', desc: 'Upload 1st Artwork', icon: '🚀' },
    { id: 'ach2', title: 'Art Critic', desc: 'Post a Comment', icon: '💬' },
    { id: 'ach3', title: 'Grand Patron', desc: 'Vote in 3 domains', icon: '👑' },
    { id: 'ach4', title: 'Polymath', desc: 'Vote in all domains', icon: '🔮' },
  ];

  const hasUnlockedAchievement = (achId: string) => {
    return currentUser.achievements.some(a => a.id === achId);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white y2k-grid relative crt-scanlines py-12 px-4 md:px-12">
      {/* Background neon flares */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-y2k-pink/5 blur-3xl rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-y2k-cyan/5 blur-3xl rounded-full" />

      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Header Options */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-chrome hover:text-white transition-colors glass-panel px-4 py-2 rounded-full border-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-xs tracking-widest uppercase">Back</span>
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-y2k-orange hover:text-white transition-colors glass-panel px-4 py-2 rounded-full border-y2k-orange/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-mono text-xs tracking-widest uppercase">Logout</span>
          </motion.button>
        </div>

        {/* Profile Details (Top Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left card: Bio & details (Cols 1-8) */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-6 md:p-8 y2k-border relative flex flex-col justify-between">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl glass-panel p-1.5 border-y2k-cyan relative flex-shrink-0">
                <img src={currentUser.avatar || ''} className="w-full h-full object-contain" alt="" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-y2k-cyan flex items-center justify-center text-black font-mono text-[9px] font-bold">
                  S
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                  <h2 className="font-display text-3xl font-extrabold">{currentUser.name}</h2>
                  <Sparkles className="w-5 h-5 text-y2k-pink star-sparkle" />
                </div>
                <p className="font-mono text-[10px] text-y2k-cyan uppercase tracking-widest text-center md:text-left mb-4">
                  {currentUser.email}
                </p>
                <p className="font-sans text-xs text-chrome/90 text-center md:text-left max-w-xl italic">
                  "{currentUser.bio || 'This student artist is exploring futuristic mediums in Lenscape.'}"
                </p>
              </div>
            </div>

            {/* University Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 border-t border-white/5 pt-6 font-mono text-xs text-chrome">
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-y2k-pink" />
                <div>
                  <span className="text-[8px] text-white/40 block">COLLEGE</span>
                  <span className="truncate max-w-[150px] block font-bold text-white">{currentUser.college}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-y2k-cyan" />
                <div>
                  <span className="text-[8px] text-white/40 block">BRANCH</span>
                  <span className="truncate max-w-[150px] block font-bold text-white">{currentUser.branch}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                <User className="w-4 h-4 text-y2k-lime" />
                <div>
                  <span className="text-[8px] text-white/40 block">ACADEMIC YEAR</span>
                  <span className="font-bold text-white">{currentUser.year}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right card: Stats counters (Cols 9-12) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 md:p-8 border-white/10 flex flex-col justify-around gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="font-mono text-[10px] text-y2k-pink uppercase tracking-widest">SUBMISSIONS</span>
              <span className="font-display text-3xl font-extrabold text-white">{mySubmissions.length}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="font-mono text-[10px] text-y2k-cyan uppercase tracking-widest">VOTES SUBMITTED</span>
              <span className="font-display text-3xl font-extrabold text-white">{myVotesCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-y2k-lime uppercase tracking-widest">FEEDBACK REVIEWED</span>
              <span className="font-display text-3xl font-extrabold text-white">{userComments.length}</span>
            </div>
          </div>
        </div>

        {/* Achievement Badges Section */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 y2k-border mb-12">
          <h3 className="font-display text-2xl font-bold uppercase mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-y2k-pink" /> NEURAL CREATIVE BADGES
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievementsList.map((ach) => {
              const unlocked = hasUnlockedAchievement(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`glass-panel rounded-2xl p-5 text-center relative border transition-all ${
                    unlocked
                      ? 'border-y2k-lime/40 bg-y2k-lime/5 shadow-lg shadow-lime/5'
                      : 'border-white/5 opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-2">{ach.icon}</div>
                  <h4 className={`font-display text-xs font-bold ${unlocked ? 'text-y2k-lime' : 'text-chrome'}`}>
                    {ach.title}
                  </h4>
                  <p className="font-mono text-[9px] text-chrome/70 mt-1 uppercase tracking-wider">{ach.desc}</p>
                  {unlocked && (
                    <div className="absolute top-2 right-2 bg-y2k-lime text-black rounded-full p-0.5 text-[8px] font-bold">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/10 mb-8 font-mono text-xs tracking-widest uppercase">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`py-3 px-6 border-b-2 transition-colors ${
              activeTab === 'submissions'
                ? 'border-y2k-pink text-white font-bold'
                : 'border-transparent text-chrome hover:text-white'
            }`}
          >
            My Artworks ({mySubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            className={`py-3 px-6 border-b-2 transition-colors ${
              activeTab === 'votes'
                ? 'border-y2k-cyan text-white font-bold'
                : 'border-transparent text-chrome hover:text-white'
            }`}
          >
            Voting Registry ({myVotesCount})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-3 px-6 border-b-2 transition-colors ${
              activeTab === 'comments'
                ? 'border-y2k-lime text-white font-bold'
                : 'border-transparent text-chrome hover:text-white'
            }`}
          >
            Activity Feed ({userComments.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="relative z-10">
          
          {/* Tab 1: submissions */}
          {activeTab === 'submissions' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mySubmissions.map((art) => {
                const statusColors = {
                  approved: 'bg-y2k-lime/10 text-y2k-lime border-y2k-lime/20',
                  pending: 'bg-y2k-cyan/10 text-y2k-cyan border-y2k-cyan/20',
                  rejected: 'bg-y2k-orange/10 text-y2k-orange border-y2k-orange/20',
                };
                return (
                  <div key={art.id} className="glass-panel rounded-2xl p-4 border-white/10 relative flex flex-col justify-between h-80 group">
                    <div className="h-[55%] w-full rounded-xl overflow-hidden mb-3 border border-white/5 relative">
                      <img src={art.thumbnailUrl || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      <div className={`absolute top-2 right-2 border px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase ${statusColors[art.status]}`}>
                        {art.status}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-display text-md font-bold truncate text-white/95">{art.title}</h4>
                      <span className="font-mono text-[9px] text-y2k-pink uppercase tracking-wider">{art.category}</span>
                      <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2 font-mono text-[9px] text-chrome">
                        <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                        <span className="text-white/80">{art.votes} votes</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {mySubmissions.length === 0 && (
                <div className="col-span-3 text-center py-20 glass-panel rounded-3xl border-white/10">
                  <Sparkles className="w-8 h-8 text-y2k-pink mx-auto mb-3 star-sparkle" />
                  <p className="font-mono text-xs text-chrome uppercase">No uploads detected. Head over to Submission Lab!</p>
                  <Link to="/submit" className="inline-block mt-4">
                    <button className="y2k-chrome-btn px-6 py-2.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest">
                      Submit Artwork
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: votes registry */}
          {activeTab === 'votes' && (
            <div className="space-y-4">
              {votedCategoriesList.map((cat) => (
                <div key={cat} className="glass-panel p-4 rounded-2xl border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-y2k-cyan rounded-full animate-ping" />
                    <div>
                      <span className="font-mono text-[8px] text-white/40 block">VOTED DOMAIN</span>
                      <span className="font-display text-sm font-extrabold text-white uppercase tracking-wide">{cat.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <Link to="/gallery">
                    <button className="y2k-chrome-btn px-4 py-2 rounded-full font-mono text-[9px] uppercase font-bold tracking-widest">
                      Exhibition Hall
                    </button>
                  </Link>
                </div>
              ))}
              {votedCategoriesList.length === 0 && (
                <div className="text-center py-20 glass-panel rounded-3xl border-white/10">
                  <CheckSquare className="w-8 h-8 text-y2k-cyan mx-auto mb-3" />
                  <p className="font-mono text-xs text-chrome uppercase">No votes cast yet. Discover student masterpieces!</p>
                  <Link to="/gallery" className="inline-block mt-4">
                    <button className="y2k-chrome-btn px-6 py-2.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-widest">
                      Explore Gallery
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: comments feed */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {userComments.map((com) => (
                <div key={com.id} className="glass-panel p-5 rounded-2xl border-white/10 relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[8px] text-white/40 font-mono block">COMMENT ON ARTWORK</span>
                      <span className="font-display text-sm font-extrabold text-y2k-pink">{com.artworkTitle}</span>
                    </div>
                    <span className="font-mono text-[8px] text-chrome/60">{new Date(com.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-sans text-xs text-chrome/80 italic leading-relaxed">
                    "{com.content}"
                  </p>
                </div>
              ))}
              {userComments.length === 0 && (
                <div className="text-center py-20 glass-panel rounded-3xl border-white/10">
                  <MessageCircle className="w-8 h-8 text-y2k-lime mx-auto mb-3" />
                  <p className="font-mono text-xs text-chrome uppercase">No feedback loops recorded yet.</p>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
