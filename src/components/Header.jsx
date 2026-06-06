import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-[#024644]/90 text-primary flex justify-between items-center px-6 md:px-edge-margin-desktop py-4 z-50 font-label-sm uppercase tracking-[0.2em] transition-all duration-300 border-b border-white/5">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-bold text-white tracking-[0.25em]">LENSCAPE 2026</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-secondary hover:text-white transition-colors cursor-pointer text-xs hidden sm:inline-block">EXHIBIT // NO. 04</span>
        <span className="font-medium text-white/80">JLUG</span>
      </div>
    </header>
  );
}
