import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'gallery', icon: 'grid_view', label: 'Gallery' },
    { id: 'signup', icon: 'person_add', label: 'Sign Up' }
  ];

  return (
    <nav className="fixed bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 md:gap-8 glass rounded-full px-5 py-2 md:px-6 md:py-3 shadow-2xl transition-all duration-300">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative p-3 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 outline-none group ${
              isActive 
                ? 'bg-primary text-black scale-110 shadow-lg' 
                : 'text-secondary hover:text-primary'
            }`}
            aria-label={item.label}
          >
            <span 
              className="material-symbols-outlined text-[20px] md:text-[24px]"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300"
              }}
            >
              {item.icon}
            </span>
            {/* Tooltip */}
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-200 rounded bg-black/90 text-white text-[10px] uppercase tracking-widest px-2 py-1 border border-white/10 pointer-events-none whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
