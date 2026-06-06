import React from 'react';

export default function HomeSection({ onExploreGallery }) {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 md:px-edge-margin-desktop py-24 select-none">
      
      {/* Decorative Viewfinder Borders & Elements */}
      {/* 1. Wireframe Geometric Ring (Thin, floating) */}
      <div className="absolute top-1/4 right-[-40px] w-64 h-64 border border-white/5 rounded-full floating pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-[-80px] w-[320px] h-[320px] border border-white/5 rounded-full floating pointer-events-none" style={{ animationDelay: '-3s' }}></div>
      
      {/* 2. Top-Left Focus Bracket */}
      <div className="absolute top-24 left-6 md:left-edge-margin-desktop w-8 h-8 border-t-2 border-l-2 border-white/20 pointer-events-none"></div>
      
      {/* 3. Top-Right Focus Bracket */}
      <div className="absolute top-24 right-6 md:right-edge-margin-desktop w-8 h-8 border-t-2 border-r-2 border-white/20 pointer-events-none"></div>
      
      {/* 4. Bottom-Left Focus Bracket */}
      <div className="absolute bottom-24 left-6 md:left-edge-margin-desktop w-8 h-8 border-b-2 border-l-2 border-white/20 pointer-events-none"></div>
      
      {/* 5. Bottom-Right Focus Bracket */}
      <div className="absolute bottom-24 right-6 md:right-edge-margin-desktop w-8 h-8 border-b-2 border-r-2 border-white/20 pointer-events-none"></div>
      
      {/* 6. Tiny Crosshair in center */}
      <div className="absolute top-1/2 left-12 -translate-y-1/2 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-4 h-[1px] bg-white/20"></div>
        <div className="h-4 w-[1px] bg-white/20 absolute"></div>
      </div>
      
      {/* 7. Camera Settings Stats (Bottom Right) */}
      <div className="absolute bottom-24 right-16 font-mono text-[10px] text-secondary tracking-widest hidden md:block opacity-50 select-none">
        F/2.8 &nbsp;&bull;&nbsp; 1/250s &nbsp;&bull;&nbsp; ISO 100
      </div>

      {/* 8. Coordinates (Top Right) */}
      <div className="absolute top-24 right-16 font-mono text-[10px] text-secondary tracking-widest hidden md:block opacity-50 select-none">
        45&deg; 12' 33" N &nbsp;&bull;&nbsp; 123&deg; 45' 12" W
      </div>

      {/* Centerpiece Title & Content */}
      <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">
        {/* Animated badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-fade-in opacity-80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white">NOW CURATING</span>
        </div>

        {/* Hero Text with typography settings */}
        <h1 className="text-[28px] sm:text-[38px] md:text-[50px] font-normal leading-snug md:leading-tight text-white max-w-4xl tracking-tight text-center">
          Capture moments, tell stories, and share your unique perspective with a community that values <span className="italic text-secondary font-light">creativity</span>, <span className="underline decoration-white/30 underline-offset-8">vision</span>, and <span className="font-semibold text-white">artistic expression</span>.
        </h1>
        
        {/* Animated Subtitle */}
        <p className="font-label-sm text-secondary mt-8 tracking-[0.4em] md:tracking-[0.6em] uppercase text-xs sm:text-sm select-none">
          Where Creativity Comes Into Focus
        </p>

        {/* CTA Button */}
        <button
          onClick={onExploreGallery}
          className="mt-12 px-8 py-3.5 bg-white text-black font-semibold text-xs uppercase tracking-[0.3em] rounded-full hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
        >
          Explore Gallery
        </button>
      </div>
    </section>
  );
}
