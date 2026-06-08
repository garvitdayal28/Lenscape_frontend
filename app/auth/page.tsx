'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Sparkles, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    year: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-y2k-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-y2k-pink/30 blur-3xl animate-glow star-sparkle" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-y2k-cyan/30 blur-3xl animate-glow star-sparkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-y2k-lime/20 blur-3xl animate-glow" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-chrome hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-sans text-sm tracking-widest uppercase">Back</span>
          </motion.button>
        </Link>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Sparkles className="w-16 h-16 text-y2k-pink mx-auto mb-4 star-sparkle" />
          <h1 className="font-display text-4xl font-bold gradient-text mb-2">Lenscape</h1>
          <p className="font-sans text-chrome">Where Creativity Becomes an Experience</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel-dark rounded-3xl p-8 y2k-border"
        >
          {/* Toggle */}
          <div className="flex gap-2 mb-8 p-1 glass-panel rounded-full">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-full font-sans text-sm tracking-widest uppercase transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-y2k-pink to-y2k-cyan text-white'
                  : 'text-chrome hover:text-white'
              }`}
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-full font-sans text-sm tracking-widest uppercase transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-y2k-pink to-y2k-cyan text-white'
                  : 'text-chrome hover:text-white'
              }`}
            >
              Sign Up
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-sans text-xs text-chrome uppercase tracking-widest mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chrome" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs text-chrome uppercase tracking-widest mb-2">
                      College
                    </label>
                    <input
                      type="text"
                      placeholder="MIT"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-4 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-xs text-chrome uppercase tracking-widest mb-2">
                        Branch
                      </label>
                      <input
                        type="text"
                        placeholder="CSE"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-4 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs text-chrome uppercase tracking-widest mb-2">
                        Year
                      </label>
                      <input
                        type="text"
                        placeholder="3rd"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-4 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block font-sans text-xs text-chrome uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chrome" />
                <input
                  type="email"
                  placeholder="john@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs text-chrome uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-chrome" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-chrome hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-y2k-lime to-y2k-cyan text-white font-sans text-sm tracking-widest uppercase rounded-full neon-glow-cyan"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-sans text-chrome text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-y2k-pink hover:text-y2k-cyan transition-colors font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
