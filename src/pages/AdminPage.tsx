import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Users, UploadCloud, CheckCircle, Ban, Trash2, Plus, Sparkles, TrendingUp, BarChart2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Category } from '../types';

export default function AdminPage() {
  const {
    currentUser,
    users,
    artworks,
    categories,
    adminApproveArtwork,
    adminRejectArtwork,
    adminBanUser,
    adminUnbanUser,
    adminAddCategory,
    adminRemoveCategory,
    bannedUsers,
    isBanned
  } = useApp();

  const navigate = useNavigate();
  const [newCatName, setNewCatName] = useState('');
  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'categories' | 'analytics'>('moderation');

  // Verify Admin session
  const isAdmin = currentUser && currentUser.email === 'admin@jlug.club';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6 y2k-grid crt-scanlines">
        <div className="max-w-md w-full glass-panel rounded-3xl p-8 border-y2k-pink text-center">
          <ShieldAlert className="w-16 h-16 text-y2k-pink mx-auto mb-4 animate-bounce" />
          <h2 className="font-display text-3xl font-bold uppercase mb-3">ADMIN FORBIDDEN</h2>
          <p className="font-sans text-xs text-chrome mb-8 leading-relaxed">
            You do not possess the digital signatures required to access the curator core. Please authenticate as Administrator.
          </p>
          <div className="flex gap-4">
            <Link to="/auth" className="flex-1">
              <button className="w-full py-3 bg-gradient-to-r from-y2k-pink to-y2k-cyan text-black font-mono text-xs uppercase font-extrabold tracking-widest rounded-full">
                Login Terminal
              </button>
            </Link>
            <Link to="/" className="flex-1">
              <button className="w-full py-3 glass-panel text-white border-white/20 font-mono text-xs uppercase font-extrabold tracking-widest rounded-full">
                Hub Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Curation Stats calculation
  const pendingSubmissions = artworks.filter(a => a.status === 'pending');
  const approvedSubmissions = artworks.filter(a => a.status === 'approved');
  const totalVotes = artworks.reduce((acc, curr) => acc + curr.votes, 0);
  const totalComments = artworks.reduce((acc, curr) => acc + curr.comments.length, 0);

  // Group artworks count by category for chart rendering
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = artworks.filter(a => a.category === cat).length;
    return acc;
  }, {} as Record<Category, number>);

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    adminAddCategory(newCatName);
    setNewCatName('');
    alert(`Category "${newCatName}" added to the grid!`);
  };

  // Activity feed simulator data
  const activityLogs = [
    { text: 'Sarah Kim voted in category digital-art', time: '2 mins ago', color: 'text-y2k-cyan' },
    { text: 'Alex Chen left a feedback comment on Chrome Spheres', time: '12 mins ago', color: 'text-y2k-pink' },
    { text: 'David Lee submitted Abstract Dreams to Illustration', time: '40 mins ago', color: 'text-y2k-lime' },
    { text: 'Lisa Park registered a student signature profile', time: '1 hr ago', color: 'text-white' },
  ];

  // Leaderboard Calculation
  const leaderboard = [...approvedSubmissions].sort((a, b) => b.votes - a.votes).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#020202] text-white y2k-grid relative crt-scanlines py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto z-10 relative">
        
        {/* Navigation Head */}
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
          <div className="flex items-center gap-2 text-y2k-pink font-mono text-xs tracking-widest uppercase">
            <ShieldCheck className="w-5 h-5 text-y2k-pink animate-pulse" /> ADMIN MAIN CONTROL
          </div>
        </div>

        {/* Analytics Top Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-3xl border-white/10 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-white/40 block uppercase">PARTICIPANTS</span>
              <span className="font-display text-3xl font-extrabold text-white">{users.length}</span>
            </div>
            <Users className="w-8 h-8 text-y2k-cyan" />
          </div>
          <div className="glass-panel p-6 rounded-3xl border-white/10 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-white/40 block uppercase">TOTAL UPLOADS</span>
              <span className="font-display text-3xl font-extrabold text-white">{artworks.length}</span>
            </div>
            <UploadCloud className="w-8 h-8 text-y2k-pink" />
          </div>
          <div className="glass-panel p-6 rounded-3xl border-white/10 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-white/40 block uppercase">TOTAL VOTES</span>
              <span className="font-display text-3xl font-extrabold text-white">{totalVotes}</span>
            </div>
            <TrendingUp className="w-8 h-8 text-y2k-lime" />
          </div>
          <div className="glass-panel p-6 rounded-3xl border-white/10 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-white/40 block uppercase">FEEDBACK COUNT</span>
              <span className="font-display text-3xl font-extrabold text-white">{totalComments}</span>
            </div>
            <BarChart2 className="w-8 h-8 text-y2k-pink" />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 mb-8 font-mono text-xs tracking-widest uppercase overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'moderation'
                ? 'border-y2k-pink text-white font-bold'
                : 'border-transparent text-chrome hover:text-white'
            }`}
          >
            Curation Queue ({pendingSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-y2k-cyan text-white font-bold'
                : 'border-transparent text-chrome hover:text-white'
            }`}
          >
            Student Directory
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-y2k-lime text-white font-bold'
                : 'border-transparent text-chrome hover:text-white'
            }`}
          >
            Manage Categories
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-y2k-pink text-white font-bold'
                : 'border-transparent text-chrome hover:text-white'
            }`}
          >
            Live Monitor & Charts
          </button>
        </div>

        {/* Tab Layouts */}
        <div className="relative z-10">

          {/* TAB 1: Moderation Queue */}
          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold uppercase mb-4 flex items-center gap-1.5 text-y2k-cyan">
                <UploadCloud className="w-5 h-5" /> Pending Curation Requests
              </h3>
              
              {pendingSubmissions.map((art) => (
                <div key={art.id} className="glass-panel p-6 rounded-3xl border-white/15 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex gap-4 items-center">
                    <img src={art.thumbnailUrl || ''} className="w-20 h-20 object-cover rounded-xl border border-white/10" alt="" />
                    <div>
                      <h4 className="font-display text-lg font-bold text-white">{art.title}</h4>
                      <p className="font-sans text-[11px] text-chrome mb-1">by {art.artist.name} ({art.artist.college})</p>
                      <span className="font-mono text-[9px] bg-y2k-pink/15 text-y2k-pink px-2.5 py-0.5 rounded-full uppercase tracking-wider">{art.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => {
                        adminApproveArtwork(art.id);
                        alert(`Artwork "${art.title}" approved!`);
                      }}
                      className="flex-1 md:flex-none py-2.5 px-6 bg-y2k-lime text-black font-mono text-[10px] uppercase font-bold tracking-widest rounded-full"
                    >
                      APPROVE
                    </button>
                    <button
                      onClick={() => {
                        adminRejectArtwork(art.id);
                        alert(`Artwork "${art.title}" rejected!`);
                      }}
                      className="flex-1 md:flex-none py-2.5 px-6 bg-white/5 border border-white/10 hover:border-y2k-orange/40 hover:text-y2k-orange text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-full"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              ))}

              {pendingSubmissions.length === 0 && (
                <div className="text-center py-20 glass-panel rounded-3xl border-white/10">
                  <CheckCircle className="w-8 h-8 text-y2k-lime mx-auto mb-3" />
                  <p className="font-mono text-xs text-chrome uppercase">Mainframe secure. No pending moderation approvals.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Student Directory */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold uppercase mb-4 flex items-center gap-1.5 text-y2k-cyan">
                <Users className="w-5 h-5" /> Registered Student signatures
              </h3>
              
              <div className="overflow-x-auto glass-panel rounded-3xl border-white/10 p-4">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 font-mono text-[10px] uppercase text-chrome">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">College</th>
                      <th className="py-3 px-4">Submissions</th>
                      <th className="py-3 px-4">Votes CAST</th>
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const userUploads = artworks.filter(a => a.artist.id === u.id).length;
                      const banned = isBanned(u.id);
                      return (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 flex items-center gap-3">
                            <img src={u.avatar || ''} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                            <div>
                              <span className="font-bold block text-white">{u.name}</span>
                              <span className="font-mono text-[9px] text-chrome/70 block">{u.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-[10px] text-chrome">{u.college}</td>
                          <td className="py-4 px-4 font-mono text-white font-bold">{userUploads}</td>
                          <td className="py-4 px-4 font-mono text-white">{u.votedCategories.length}</td>
                          <td className="py-4 px-4">
                            {banned ? (
                              <span className="font-mono text-[8px] bg-y2k-orange/15 text-y2k-orange border border-y2k-orange/20 px-2 py-0.5 rounded uppercase font-bold">Banned</span>
                            ) : (
                              <span className="font-mono text-[8px] bg-y2k-lime/15 text-y2k-lime border border-y2k-lime/20 px-2 py-0.5 rounded uppercase font-bold">Active</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            {banned ? (
                              <button
                                onClick={() => {
                                  adminUnbanUser(u.id);
                                  alert(`Account "${u.name}" restored.`);
                                }}
                                className="font-mono text-[9px] text-y2k-cyan uppercase font-bold hover:underline"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  adminBanUser(u.id);
                                  alert(`Account "${u.name}" has been banned.`);
                                }}
                                className="font-mono text-[9px] text-y2k-orange uppercase font-bold hover:underline flex items-center gap-1 justify-end ml-auto"
                                disabled={u.id === 'user_admin'}
                              >
                                <Ban className="w-3 h-3" /> Ban Account
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Category Management */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Category list */}
              <div className="glass-panel p-6 rounded-3xl border-white/10">
                <h3 className="font-display text-xl font-bold uppercase mb-6 text-y2k-cyan">Active Domains</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="font-mono text-xs text-white uppercase tracking-wider">{cat.replace('-', ' ')}</span>
                      <button
                        onClick={() => {
                          adminRemoveCategory(cat);
                          alert(`Category "${cat}" removed.`);
                        }}
                        className="text-white hover:text-y2k-orange transition-colors"
                        disabled={cat === 'other'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add category form */}
              <div className="glass-panel p-6 rounded-3xl border-white/10 h-fit">
                <h3 className="font-display text-xl font-bold uppercase mb-6 text-y2k-pink">Initialize New Domain</h3>
                <form onSubmit={handleAddCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[10px] text-y2k-pink uppercase tracking-widest mb-2">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Motion Graphics"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-y2k-pink transition-colors font-sans text-xs text-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-y2k-pink to-y2k-cyan text-black font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Inject Domain Grid
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: Live Monitor & Analytics Charts */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Category distribution chart (Cols 1-8) */}
              <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border-white/10">
                <h3 className="font-display text-xl font-bold uppercase mb-6 flex items-center gap-1.5 text-y2k-cyan">
                  <BarChart2 className="w-5 h-5" /> Submission Distribution Chart
                </h3>
                
                {/* SVG/HTML Based Interactive Bar Chart */}
                <div className="space-y-4 py-4">
                  {categories.map((cat) => {
                    const count = categoryCounts[cat] || 0;
                    // Find max count to scale percentage
                    const maxVal = Math.max(...Object.values(categoryCounts), 1);
                    const percent = (count / maxVal) * 100;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between font-mono text-[10px] text-chrome">
                          <span className="uppercase">{cat.replace('-', ' ')}</span>
                          <span className="font-bold text-white">{count} uploads</span>
                        </div>
                        <div className="w-full h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/10 flex">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-y2k-pink via-y2k-cyan to-y2k-lime rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live activity ticker & leaderboards (Cols 9-12) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Live Leaderboard */}
                <div className="glass-panel p-5 rounded-3xl border-white/10">
                  <h4 className="font-display text-xs font-bold text-y2k-pink uppercase mb-4 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-y2k-pink" /> TOP SUBMISSIONS
                  </h4>
                  <div className="space-y-3.5">
                    {leaderboard.map((art, index) => (
                      <div key={art.id} className="flex justify-between items-center font-sans text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[10px] text-y2k-lime">#0{index + 1}</span>
                          <span className="font-bold text-white truncate max-w-[130px]">{art.title}</span>
                        </div>
                        <span className="font-mono text-[10px] text-y2k-cyan font-bold">{art.votes} votes</span>
                      </div>
                    ))}
                    {leaderboard.length === 0 && (
                      <p className="font-mono text-[9px] text-chrome/50">No rankings computed yet.</p>
                    )}
                  </div>
                </div>

                {/* Simulated Ticker Feed */}
                <div className="glass-panel p-5 rounded-3xl border-white/10 flex-1">
                  <h4 className="font-display text-xs font-bold text-y2k-cyan uppercase mb-4">
                    EVENT MONITOR TICKER
                  </h4>
                  <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                    {activityLogs.map((log, index) => (
                      <div key={index} className="font-mono text-[9.5px] border-b border-white/5 pb-2 last:border-0">
                        <p className={log.color}>{log.text}</p>
                        <span className="text-[8px] text-chrome/50">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
