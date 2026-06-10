import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Compass, Image, Award, Lock, Upload } from 'lucide-react'
import { getToken, clearSession } from '../lib/session'

interface ExhibitionNavProps {
  isVisible?: boolean
}

const ExhibitionNav: React.FC<ExhibitionNavProps> = ({ isVisible = true }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname

  // Read session from localStorage — syncs on every render + storage changes
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken())
  const [profileComplete, setProfileComplete] = useState(
    () => localStorage.getItem('lenscape_profile_complete') === 'true'
  )

  // Re-check on route change (catches login/logout from other tabs too)
  useEffect(() => {
    setIsLoggedIn(!!getToken())
    setProfileComplete(localStorage.getItem('lenscape_profile_complete') === 'true')
  }, [path])

  // Also listen for storage events (cross-tab sync)
  useEffect(() => {
    const onStorage = () => {
      setIsLoggedIn(!!getToken())
      setProfileComplete(localStorage.getItem('lenscape_profile_complete') === 'true')
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleLogout = () => {
    clearSession()
    setIsLoggedIn(false)
    navigate('/')
  }

  const menuItems = [
    { name: 'Exhibition Hall', path: '/', icon: Compass },
    { name: 'Exhibition Rooms', path: '/gallery', icon: Image },
    { name: 'Submit Work', path: '/submit', icon: Upload },
    isLoggedIn && profileComplete
      ? { name: 'My Portfolio', path: '/profile', icon: Award }
      : { name: 'Enter Exhibition', path: '/auth/login', icon: Lock },
  ].filter(Boolean) as { name: string; path: string; icon: React.ElementType }[]

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[900] select-none">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1 md:gap-2 bg-black/60 border border-exhibition-gold/20 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 rounded-full"
          >
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = path === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  className={`flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-full text-[10px] md:text-xs font-mono transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'text-exhibition-gold bg-exhibition-gold/10 border border-exhibition-gold/30 shadow-[0_0_15px_rgba(201,168,76,0.15)]'
                      : 'text-zinc-400 border border-transparent hover:text-exhibition-bone hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'drop-shadow-[0_0_8px_rgba(201,168,76,0.8)]' : ''} />
                  <span className="hidden md:inline tracking-wider uppercase">{item.name}</span>
                </Link>
              )
            })}

            {isLoggedIn && (
              <>
                <div className="w-[1px] h-6 bg-zinc-800 mx-1 md:mx-2" />
                <button
                  onClick={handleLogout}
                  title="Exit Session"
                  className="flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-full text-[10px] md:text-xs font-mono text-red-400/80 border border-transparent hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline tracking-wider uppercase">Exit</span>
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ExhibitionNav
