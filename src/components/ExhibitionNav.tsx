import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, Compass, Image, Award, Lock, Upload } from 'lucide-react'
import { useApp } from '../context/AppContext'

const ExhibitionNav: React.FC = () => {
  const location = useLocation()
  const { currentUser, logout } = useApp()
  const [isOpen, setIsOpen] = useState(false)

  // Avoid rendering nav during intro if needed, but this component handles page views.
  const path = location.pathname

  // Menu items list
  const menuItems = [
    { name: 'Exhibition Hall', path: '/', icon: Compass },
    { name: 'Exhibition Rooms', path: '/gallery', icon: Image },
    { name: 'Submit Work', path: '/submit', icon: Upload },
  ]

  // Add Profile or Auth link
  if (currentUser) {
    menuItems.push({ name: 'Artist Portfolio', path: '/profile', icon: Award })
  } else {
    menuItems.push({ name: 'Enter Exhibition', path: '/auth', icon: Lock })
  }

  const activeItem = menuItems.find((item) => item.path === path)
  const roomName = activeItem ? activeItem.name : 'Exhibition'

  return (
    <div className="fixed top-6 right-6 z-[900] select-none">
      {/* Small floating status + menu toggle */}
      <div className="flex items-center gap-3">
        {/* Room name tag */}
        <div className="hidden sm:block px-3 py-1 bg-exhibition-void/85 border border-exhibition-gold/20 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-400">
          Room: <span className="text-exhibition-gold">{roomName}</span>
        </div>

        {/* Floating Circle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-exhibition-void/85 border border-exhibition-gold/30 hover:border-exhibition-gold flex items-center justify-center text-exhibition-gold backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Navigation Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-3 w-64 bg-exhibition-void/95 border border-exhibition-gold/30 backdrop-blur-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-5 flex flex-col gap-4"
          >
            {/* Header */}
            <div className="border-b border-zinc-800 pb-2 flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono">
                Exhibition Guide
              </span>
              {currentUser && (
                <span className="text-xs text-exhibition-gold font-mono truncate mt-1">
                  Artist: {currentUser.name}
                </span>
              )}
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = path === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-mono transition-colors ${
                      isActive
                        ? 'text-exhibition-gold bg-exhibition-gold/5 border-l-2 border-exhibition-gold'
                        : 'text-zinc-400 hover:text-exhibition-bone hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* curator dashboard link removed — /admin is access via direct URL only */}
            </nav>

            {/* Logout Action */}
            {currentUser && (
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm font-mono text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors border-t border-zinc-800/60 mt-2 pt-3"
              >
                <LogOut size={16} />
                <span>Exit Session</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExhibitionNav
