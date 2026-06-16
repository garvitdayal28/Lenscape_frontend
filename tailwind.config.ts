import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Pastel Dreamscape Core Tokens ────────────────────────────────────
        // Main bg — soft lavender blush
        'exhibition-void': '#F5EEFF',
        // Accent — light soft orchid/lilac (replaces the old heavy mauve)
        'exhibition-gold': '#C49FDA',
        // Primary text — readable medium-purple (not as dark as before)
        'exhibition-bone': '#5A4590',
        // Subtle overlay fog
        'exhibition-fog':  'rgba(196, 157, 218, 0.08)',

        // "chic-*" aliases used widely across all pages
        'chic-bg':      '#EDE0FF',   // pale lavender card/surface bg
        'chic-primary': '#8A6EB8',   // lighter medium-purple body text
        'chic-muted':   '#B8A8D8',   // light lavender tertiary text
        'chic-accent':  '#E8C8F5',   // very light blush hover accent
        'chic-light':   '#F8F3FF',   // near-white lavender

        // Extended pastel palette
        'pastel-rose':    '#F2B8D4',  // soft blush
        'pastel-lavender':'#C9B1F0',  // main lavender
        'pastel-sky':     '#B8D4F0',  // sky blue
        'pastel-mint':    '#B8EAD8',  // mint
        'pastel-peach':   '#F0C8A8',  // warm peach
        'pastel-lilac':   '#E0C8F8',  // light lilac

        // 3D Scene surface tokens
        'hall-wall':    '#D8CCEE',   // soft lavender-grey walls
        'hall-ceiling': '#EDE5FF',   // palest lavender ceiling
        'hall-floor':   '#C8B8E0',   // slightly deeper lavender floor

        // Legacy Y2K names re-mapped (keeps old references harmless)
        'y2k-black':  '#2D1F4E',
        'y2k-pink':   '#F2B8D4',
        'y2k-cyan':   '#B8D4F0',
        'y2k-lime':   '#B8EAD8',
        'y2k-purple': '#C9B1F0',
        'y2k-yellow': '#F8DDBC',
        'y2k-orange': '#F0C8A8',
        'chrome':       '#C9B1F0',
        'chrome-dark':  '#9B88C0',
        'chrome-light': '#F0EAFF',
        'glass':       'rgba(196,168,232,0.18)',
        'glass-dark':  'rgba(45,31,78,0.35)',
        'glass-pink':  'rgba(242,184,212,0.22)',
        'glass-cyan':  'rgba(184,212,240,0.22)',
      },
      fontFamily: {
        display:   ['Syne', 'sans-serif'],
        sans:      ['"Plus Jakarta Sans"', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
        mono:      ['"Space Grotesk"', 'monospace'],
      },
      animation: {
        'float':    'float 6s ease-in-out infinite',
        'glow':     'glow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s ease-out',
        'fade-in':  'fadeIn 1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
