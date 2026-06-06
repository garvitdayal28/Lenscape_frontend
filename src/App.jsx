import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import GallerySection from './components/GallerySection';
import SignUpSection from './components/SignUpSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [orbPos, setOrbPos] = useState({ x: 0, y: 0 });
  const [targetOrbPos, setTargetOrbPos] = useState({ x: 0, y: 0 });

  // Update target position based on mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 60;
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      setTargetOrbPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth lerp animation for the background atmospheric orb
  useEffect(() => {
    let animationFrameId;
    
    const updateOrb = () => {
      setOrbPos(current => {
        const dx = targetOrbPos.x - current.x;
        const dy = targetOrbPos.y - current.y;
        // Adjust the multiplier (0.08) to speed up or slow down the interpolation
        return {
          x: current.x + dx * 0.08,
          y: current.y + dy * 0.08
        };
      });
      animationFrameId = requestAnimationFrame(updateOrb);
    };

    updateOrb();

    return () => cancelAnimationFrame(animationFrameId);
  }, [targetOrbPos]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="relative min-h-screen w-full bg-black text-on-background overflow-x-hidden flex flex-col justify-between">
      
      {/* Background Interactive Orb (Sleek Blur effect) */}
      <div 
        className="orb fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] bg-white/5 rounded-full opacity-30 pointer-events-none"
        style={{
          transform: `translate(calc(-50% + ${orbPos.x}px), calc(-50% + ${orbPos.y}px))`
        }}
      ></div>

      {/* Header Bar */}
      <Header />

      {/* Main Container rendering sections dynamically with smooth opacity fade */}
      <main className="flex-grow w-full relative z-10">
        {activeTab === 'home' && (
          <div className="animate-fade-in">
            <HomeSection onExploreGallery={() => setActiveTab('gallery')} />
          </div>
        )}
        {activeTab === 'gallery' && (
          <div className="animate-fade-in">
            <GallerySection />
          </div>
        )}
        {activeTab === 'signup' && (
          <div className="animate-fade-in">
            <SignUpSection />
          </div>
        )}
      </main>

      {/* Floating Bottom Nav */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
