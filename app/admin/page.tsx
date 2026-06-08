'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BarChart3, Users, Image as ImageIcon, Shield, CheckCircle, XCircle, AlertTriangle, Settings, Activity, TrendingUp, Eye, Ban } from 'lucide-react';
import Link from 'next/link';

// Mock analytics data
const analyticsData = {
  totalSubmissions: 156,
  totalVotes: 1243,
  totalUsers: 89,
  totalComments: 523,
  pendingApprovals: 12,
  engagementRate: 78,
};

// Mock pending submissions
const pendingSubmissions = [
  { id: '1', title: 'Digital Dreams', artist: 'Alex Chen', category: 'digital-art', timestamp: '2 hours ago' },
  { id: '2', title: 'Neon City', artist: 'Sarah Kim', category: 'photography', timestamp: '5 hours ago' },
  { id: '3', title: 'Abstract Flow', artist: 'Emma Wilson', category: 'animation', timestamp: '1 day ago' },
];

// Mock users
const users = [
  { id: '1', name: 'Alex Chen', email: 'alex@college.edu', status: 'active', submissions: 3 },
  { id: '2', name: 'Sarah Kim', email: 'sarah@college.edu', status: 'active', submissions: 2 },
  { id: '3', name: 'Mike Johnson', email: 'mike@college.edu', status: 'active', submissions: 5 },
];

// Mock activity feed
const activityFeed = [
  { id: '1', action: 'New submission', user: 'John Doe', time: '10 min ago' },
  { id: '2', action: 'Vote received', user: 'Jane Smith', time: '25 min ago' },
  { id: '3', action: 'Comment added', user: 'Mike Johnson', time: '1 hour ago' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'users'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'submissions' as const, label: 'Submissions', icon: ImageIcon },
    { id: 'users' as const, label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-y2k-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-chrome hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-sans text-sm tracking-widest uppercase">Back</span>
              </motion.button>
            </Link>
            
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text">
              Admin Dashboard
            </h1>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 glass-panel rounded-full max-w-lg">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-sans text-sm tracking-widest uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-y2k-pink to-y2k-cyan text-white'
                  : 'text-chrome hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Submissions', value: analyticsData.totalSubmissions, icon: ImageIcon, color: 'from-y2k-pink to-y2k-cyan' },
                  { label: 'Votes', value: analyticsData.totalVotes, icon: TrendingUp, color: 'from-y2k-lime to-y2k-cyan' },
                  { label: 'Users', value: analyticsData.totalUsers, icon: Users, color: 'from-y2k-purple to-y2k-pink' },
                  { label: 'Pending', value: analyticsData.pendingApprovals, icon: AlertTriangle, color: 'from-y2k-yellow to-y2k-orange' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel rounded-3xl p-6 y2k-border"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-display text-3xl font-bold gradient-text">
                        {stat.value}
                      </div>
                    </div>
                    <div className="font-sans text-sm text-chrome uppercase tracking-widest">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Feed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-panel rounded-3xl p-8 y2k-border"
                >
                  <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                    <Activity className="w-6 h-6" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {activityFeed.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 glass-panel rounded-xl"
                      >
                        <div className="w-2 h-2 rounded-full bg-y2k-pink" />
                        <div className="flex-1">
                          <p className="font-sans text-white font-medium">{activity.action}</p>
                          <p className="font-sans text-chrome text-sm">{activity.user}</p>
                        </div>
                        <span className="font-sans text-chrome text-sm">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Engagement Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-panel rounded-3xl p-8 y2k-border"
                >
                  <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Engagement Overview
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-sans text-chrome">Engagement Rate</span>
                        <span className="font-sans text-white font-bold">{analyticsData.engagementRate}%</span>
                      </div>
                      <div className="w-full h-2 glass-panel rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analyticsData.engagementRate}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="h-full bg-gradient-to-r from-y2k-lime to-y2k-cyan"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-sans text-chrome">Approval Rate</span>
                        <span className="font-sans text-white font-bold">92%</span>
                      </div>
                      <div className="w-full h-2 glass-panel rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-y2k-lime to-y2k-cyan"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-sans text-chrome">User Retention</span>
                        <span className="font-sans text-white font-bold">85%</span>
                      </div>
                      <div className="w-full h-2 glass-panel rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 1, delay: 0.8 }}
                          className="h-full bg-gradient-to-r from-y2k-lime to-y2k-cyan"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'submissions' && (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-2xl font-bold flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" />
                  Pending Approvals
                </h3>
                <span className="px-4 py-2 glass-panel rounded-full text-silver font-sans text-sm tracking-widest uppercase">
                  {pendingSubmissions.length} Pending
                </span>
              </div>

              <div className="space-y-4">
                {pendingSubmissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel rounded-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 glass-panel rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-silver" />
                      </div>
                      <div>
                        <h4 className="font-display text-xl font-bold">{submission.title}</h4>
                        <p className="font-sans text-silver text-sm">
                          {submission.artist} • {submission.category}
                        </p>
                        <p className="font-sans text-silver/60 text-xs mt-1">{submission.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-electric-blue to-neon-purple text-white font-sans text-sm tracking-widest uppercase rounded-full"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 glass-panel text-white font-sans text-sm tracking-widest uppercase rounded-full hover:bg-white/10 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel rounded-2xl p-8"
            >
              <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                User Management
              </h3>

              <div className="space-y-4">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel rounded-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-y2k-pink to-y2k-cyan flex items-center justify-center star-sparkle">
                        <span className="font-display text-xl font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-bold">{user.name}</h4>
                        <p className="font-sans text-chrome text-sm">{user.email}</p>
                        <p className="font-sans text-chrome/60 text-xs mt-1">
                          {user.submissions} submissions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 glass-panel rounded-full text-xs text-y2k-pink uppercase tracking-widest">
                        {user.status}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-red-500/20 transition-colors text-red-400"
                      >
                        <Ban className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
