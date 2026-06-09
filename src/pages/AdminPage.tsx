import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Users, UploadCloud, CheckCircle, Ban, Trash2, Plus, TrendingUp, BarChart2, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function authHeaders() {
  const token = localStorage.getItem('lenscape_admin_token')
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [adminName, setAdminName] = useState('')
  const [activeTab, setActiveTab] = useState<'moderation' | 'users' | 'categories'>('moderation')

  const [pendingArtworks, setPendingArtworks] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [newCatName, setNewCatName] = useState('')
  const [stats, setStats] = useState({ users: 0, uploads: 0, votes: 0, comments: 0 })

  // ── Verify admin token on mount ──────────────────────────────────────────────
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('lenscape_admin_token')
      if (!token) { navigate('/admin/login'); return }
      try {
        const res = await fetch(`${API}/api/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok || !data.valid) { navigate('/admin/login'); return }
        setAdminName(data.name || localStorage.getItem('lenscape_admin_name') || 'Curator')
      } catch {
        navigate('/admin/login')
        return
      }
      setChecking(false)
    }
    verify()
  }, [navigate])

  // ── Load data after verified ─────────────────────────────────────────────────
  useEffect(() => {
    if (checking) return
    fetchPending()
    fetchUsers()
    fetchCategories()
  }, [checking])

  const fetchPending = async () => {
    const res = await fetch(`${API}/api/artworks/pending`, { headers: authHeaders() })
    if (res.ok) setPendingArtworks(await res.json())
  }

  const fetchUsers = async () => {
    const res = await fetch(`${API}/api/admin/users`, { headers: authHeaders() })
    if (res.ok) {
      const data = await res.json()
      setAllUsers(data)
      const votes = data.reduce((s: number, u: any) => s + (u.votedCategories?.length || 0), 0)
      setStats(prev => ({ ...prev, users: data.length, votes }))
    }
  }

  const fetchCategories = async () => {
    const res = await fetch(`${API}/api/categories`)
    if (res.ok) setCategories(await res.json())
  }

  const approveArtwork = async (id: string) => {
    await fetch(`${API}/api/artworks/${id}/approve`, { method: 'POST', headers: authHeaders() })
    fetchPending()
  }

  const rejectArtwork = async (id: string) => {
    await fetch(`${API}/api/artworks/${id}/reject`, { method: 'POST', headers: authHeaders() })
    fetchPending()
  }

  const banUser = async (userId: string) => {
    await fetch(`${API}/api/admin/users/${userId}/ban`, { method: 'POST', headers: authHeaders() })
    fetchUsers()
  }

  const unbanUser = async (userId: string) => {
    await fetch(`${API}/api/admin/users/${userId}/unban`, { method: 'POST', headers: authHeaders() })
    fetchUsers()
  }

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    await fetch(`${API}/api/categories`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ category: newCatName }),
    })
    setNewCatName('')
    fetchCategories()
  }

  const removeCategory = async (name: string) => {
    await fetch(`${API}/api/categories/${name}`, { method: 'DELETE', headers: authHeaders() })
    fetchCategories()
  }

  const handleLogout = () => {
    localStorage.removeItem('lenscape_admin_token')
    localStorage.removeItem('lenscape_admin_name')
    navigate('/admin/login')
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <span className="font-mono text-xs text-exhibition-gold animate-pulse uppercase tracking-widest">
          Verifying credentials...
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020202] text-exhibition-bone py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-exhibition-gold" />
            <div>
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">
                Curator Dashboard
              </span>
              <span className="font-mono text-sm text-exhibition-gold">{adminName}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 hover:border-red-500 text-red-400 font-mono text-[10px] uppercase tracking-widest transition-colors"
          >
            <LogOut size={12} />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Participants', value: stats.users, Icon: Users, color: 'text-cyan-400' },
            { label: 'Pending', value: pendingArtworks.length, Icon: UploadCloud, color: 'text-exhibition-gold' },
            { label: 'Votes Cast', value: stats.votes, Icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Categories', value: categories.length, Icon: BarChart2, color: 'text-pink-400' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="border border-zinc-900 bg-[#0c0c0c] p-5 flex items-center justify-between">
              <div>
                <span className="font-mono text-[8px] text-zinc-600 block uppercase tracking-widest">{label}</span>
                <span className="editorial-text text-3xl font-bold text-exhibition-gold">{value}</span>
              </div>
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-900 mb-8 font-mono text-[10px] uppercase tracking-widest overflow-x-auto">
          {[
            { id: 'moderation', label: `Queue (${pendingArtworks.length})` },
            { id: 'users', label: 'Users' },
            { id: 'categories', label: 'Categories' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-6 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-exhibition-gold text-exhibition-gold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Moderation Tab ── */}
        {activeTab === 'moderation' && (
          <div className="space-y-5">
            {pendingArtworks.map(art => (
              <div key={art.id} className="border border-zinc-900 bg-[#0c0c0c] p-5 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center">
                <div className="flex gap-4 items-center">
                  <img src={art.thumbnailUrl || art.imageUrl} className="w-16 h-16 object-cover border border-zinc-800" alt="" />
                  <div>
                    <h4 className="font-mono text-sm font-bold text-exhibition-bone">{art.title}</h4>
                    <p className="font-mono text-[10px] text-zinc-500">by {art.artist?.name} · {art.artist?.college}</p>
                    <span className="font-mono text-[8px] text-exhibition-gold uppercase tracking-widest">{art.category}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => approveArtwork(art.id)}
                    className="px-5 py-2 bg-exhibition-gold text-exhibition-void font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
                    Approve
                  </button>
                  <button onClick={() => rejectArtwork(art.id)}
                    className="px-5 py-2 border border-zinc-700 text-zinc-400 font-mono text-[10px] uppercase tracking-widest hover:border-red-500/50 hover:text-red-400 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingArtworks.length === 0 && (
              <div className="text-center py-20 border border-zinc-900">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">No pending submissions.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto border border-zinc-900">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-[9px] text-zinc-600 uppercase tracking-widest">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Votes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id} className="border-b border-zinc-900/50 hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-bold text-exhibition-bone">{u.name}</div>
                      <div className="text-[9px] text-zinc-600">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{u.college}</td>
                    <td className="py-3 px-4 text-exhibition-gold">{u.votedCategories?.length || 0}</td>
                    <td className="py-3 px-4">
                      {u.isBanned
                        ? <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 uppercase">Banned</span>
                        : <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 uppercase">Active</span>
                      }
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.isBanned
                        ? <button onClick={() => unbanUser(u.id)} className="text-[9px] text-exhibition-gold hover:underline uppercase">Restore</button>
                        : <button onClick={() => banUser(u.id)} className="flex items-center gap-1 text-[9px] text-red-400/70 hover:text-red-400 uppercase ml-auto">
                            <Ban size={10} /> Ban
                          </button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Categories Tab ── */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-zinc-900 bg-[#0c0c0c] p-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-exhibition-gold mb-5">Active Categories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat} className="flex justify-between items-center bg-black/20 border border-zinc-900 px-4 py-2.5">
                    <span className="font-mono text-[11px] text-exhibition-bone uppercase tracking-wider">{cat.replace('-', ' ')}</span>
                    <button onClick={() => removeCategory(cat)} disabled={cat === 'other'}
                      className="text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-20">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-zinc-900 bg-[#0c0c0c] p-6 h-fit">
              <h3 className="font-mono text-xs uppercase tracking-widest text-exhibition-gold mb-5">Add Category</h3>
              <form onSubmit={addCategory} className="space-y-4">
                <input
                  type="text"
                  placeholder="e.g. 3D Renders"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full bg-[#111] border border-zinc-800 text-xs font-mono px-4 py-3 text-exhibition-bone focus:outline-none focus:border-exhibition-gold/50"
                  required
                />
                <button type="submit"
                  className="w-full py-3 bg-exhibition-gold text-exhibition-void font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-1.5">
                  <Plus size={12} /> Add Domain
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
