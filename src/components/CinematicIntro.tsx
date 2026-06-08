import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleField from './ParticleField'

interface CinematicIntroProps {
  onComplete: () => void
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false)
  const [showContent, setShowContent] = useState(true)

  // Tagline letters for animation
  const tagline = "Every frame tells a story."
  const words = tagline.split(" ")

  const handleEnter = () => {
    setIsExiting(true)
    setTimeout(() => {
      onComplete()
    }, 1200) // Duration of exit transition
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const wordContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.5,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <AnimatePresence>
      {showContent && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[1000] bg-exhibition-void flex flex-col items-center justify-center select-none"
        >
          {/* Drifting amber ambient particles */}
          <ParticleField color="rgba(201, 168, 76, 0.25)" count={80} />

          {/* Vignette Shadow Overlay */}
          <div className="absolute inset-0 bg-radial-gradient-vignette pointer-events-none" />

          {/* Logo and Tagline container */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center px-4"
          >
            {/* The Logo with Glow */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-6xl md:text-8xl font-extrabold tracking-[0.2em] text-exhibition-bone uppercase drop-shadow-[0_0_35px_rgba(201,168,76,0.3)] mb-4 text-center block w-full"
            >
              Lenscape
            </motion.h1>

            {/* Subtle Divider */}
            <motion.div
              variants={itemVariants}
              className="w-16 h-[1px] bg-exhibition-gold mx-auto my-6"
            />

            {/* Tagline revealed word-by-word */}
            <motion.div
              variants={wordContainerVariants}
              className="flex justify-center gap-x-2 flex-wrap mb-12 text-lg md:text-2xl font-light tracking-wide text-zinc-400 font-mono"
            >
              {words.map((word, idx) => (
                <motion.span key={idx} variants={wordVariants}>
                  {word}
                </motion.span>
              ))}
            </motion.div>

            {/* Entrance CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 1 }}
            >
              <button
                onClick={handleEnter}
                className="px-8 py-3 border border-exhibition-gold/40 text-exhibition-gold font-mono uppercase tracking-[0.25em] text-xs hover:bg-exhibition-gold hover:text-exhibition-void hover:border-exhibition-gold transition-all duration-500 shadow-[0_0_20px_rgba(201,168,76,0.05)] hover:shadow-[0_0_30px_rgba(201,168,76,0.25)]"
              >
                Enter the Exhibition
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CinematicIntro
