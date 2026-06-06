import React, { useState } from 'react';

const IMAGES = [
  {
    id: 1,
    title: 'Solitude',
    category: 'Landscape',
    src: '/images/tree.png',
    photographer: 'Akihiro Sato',
    specs: '50mm • f/8.0 • 1/250s • ISO 100',
    location: 'Hokkaido, Japan',
    description: 'A study on negative space and isolation. The lonely tree stands resilient against the vast, clean canvas of Hokkaido\'s winter snowfields, under a completely diffused overcast sky.'
  },
  {
    id: 2,
    title: 'Ascension',
    category: 'Architecture',
    src: '/images/stairs.png',
    photographer: 'Elena Rostova',
    specs: '24mm • f/4.0 • 1/60s • ISO 200',
    location: 'Copenhagen, Denmark',
    description: 'Capturing the raw rhythm of spiral concrete curves. The dramatic contrast of shadow and light highlights the clean geometric lines of Scandinavian brutalist architecture.'
  },
  {
    id: 3,
    title: 'Luminance',
    category: 'Conceptual',
    src: '/images/sphere.png',
    photographer: 'Marcus Vance',
    specs: '85mm • f/1.8 • 1/120s • ISO 100',
    location: 'Stockholm, Sweden',
    description: 'An exploration of light refraction. A solid crystal sphere bends a single direct beam of morning sunlight, casting a sharp focal point onto a raw concrete surface.'
  }
];

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  const categories = ['All', 'Landscape', 'Architecture', 'Conceptual'];

  const filteredImages = selectedCategory === 'All' 
    ? IMAGES 
    : IMAGES.filter(img => img.category === selectedCategory);

  return (
    <section className="relative min-h-screen w-full px-6 md:px-edge-margin-desktop py-24 flex flex-col justify-start">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-[-100px] w-80 h-80 border border-white/5 rounded-full pointer-events-none floating"></div>

      {/* Header */}
      <div className="max-w-xl mb-12 mt-6">
        <h2 className="text-xs font-semibold tracking-[0.4em] uppercase text-white/50 mb-3">CURATED SELECTION</h2>
        <h1 className="text-3xl md:text-4xl font-normal text-white tracking-tight leading-tight">
          Visual studies of minimalism, shadow, and silent spaces.
        </h1>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-white/10 pb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-white text-black'
                : 'text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredImages.map(img => (
          <div
            key={img.id}
            onClick={() => setActiveImage(img)}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden glass cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Image container */}
            <div className="w-full h-full bg-surface-container-low overflow-hidden">
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Hover Glassmorphic Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                  {img.category}
                </span>
                <h3 className="text-xl font-normal text-white mt-1 mb-2">
                  {img.title}
                </h3>
                <div className="flex flex-col gap-1 text-xs text-secondary font-mono">
                  <span>{img.location}</span>
                  <span>{img.specs}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 animate-fade-in">
          {/* Close Area */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActiveImage(null)}></div>

          {/* Close Button */}
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 z-50 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[32px]">close</span>
          </button>

          {/* Lightbox Content Container */}
          <div className="relative z-10 w-full max-w-6xl glass rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] md:max-h-[80vh] shadow-2xl">
            {/* Visual Column */}
            <div className="lg:col-span-7 bg-black flex items-center justify-center p-4 min-h-[300px] lg:min-h-[500px]">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="max-w-full max-h-[40vh] lg:max-h-[70vh] object-contain rounded"
              />
            </div>

            {/* Info Column */}
            <div className="lg:col-span-5 p-8 flex flex-col justify-between bg-surface-container-lowest border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase">
                  {activeImage.category}
                </span>
                <h2 className="text-3xl font-normal text-white mt-2 mb-4">
                  {activeImage.title}
                </h2>
                <p className="text-sm text-secondary leading-relaxed mb-6 font-light">
                  {activeImage.description}
                </p>
              </div>

              {/* Specs & Meta */}
              <div className="border-t border-white/10 pt-6 mt-6 flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 uppercase tracking-widest">Artist</span>
                  <span className="text-white font-medium">{activeImage.photographer}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 uppercase tracking-widest">Location</span>
                  <span className="text-white font-medium">{activeImage.location}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50 uppercase tracking-widest font-mono">Parameters</span>
                  <span className="text-white font-mono text-[11px]">{activeImage.specs}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
