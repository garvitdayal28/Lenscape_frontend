'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Category } from '@/types';

const categories: { value: Category; label: string }[] = [
  { value: 'photography', label: 'Photography' },
  { value: 'filmmaking', label: 'Filmmaking' },
  { value: 'animation', label: 'Animation' },
  { value: 'digital-art', label: 'Digital Art' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'motion-graphics', label: 'Motion Graphics' },
  { value: 'other', label: 'Other' },
];

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'digital-art' as Category,
    imageUrl: '',
    videoUrl: '',
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-y2k-black text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-3xl p-12 text-center y2k-border max-w-md"
        >
          <Sparkles className="w-24 h-24 text-y2k-lime mx-auto mb-6 star-sparkle" />
          <h2 className="font-display text-4xl font-bold mb-4 gradient-text">Submission Received!</h2>
          <p className="font-sans text-chrome mb-8">Your artwork has been submitted for review. You'll receive a notification once it's approved.</p>
          <Link href="/gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-y2k-pink to-y2k-cyan text-white font-sans text-sm tracking-widest uppercase rounded-full neon-glow-pink"
            >
              View Gallery
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-y2k-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-chrome hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-sans text-sm tracking-widest uppercase">Back</span>
              </motion.button>
            </Link>
            
            <h1 className="font-display text-3xl md:text-5xl font-bold gradient-text">
              Submit Artwork
            </h1>
            
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 md:p-12 y2k-border"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div>
              <label className="font-sans text-sm text-chrome uppercase tracking-widest mb-4 block">
                Artwork Image
              </label>
              <div className="relative">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-96 object-cover rounded-3xl"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setPreview(null);
                        setFormData({ ...formData, imageUrl: '' });
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-y2k-pink rounded-full flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-y2k-pink/50 rounded-3xl cursor-pointer hover:border-y2k-pink transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-16 h-16 text-y2k-pink mb-4" />
                      <p className="font-sans text-chrome mb-2">Click to upload artwork</p>
                      <p className="font-sans text-chrome/60 text-sm">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="font-sans text-sm text-chrome uppercase tracking-widest mb-2 block">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-6 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all font-sans"
                placeholder="Enter artwork title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-sans text-sm text-chrome uppercase tracking-widest mb-2 block">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-6 py-4 glass-panel rounded-3xl bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all font-sans resize-none"
                placeholder="Describe your artwork"
              />
            </div>

            {/* Category */}
            <div>
              <label className="font-sans text-sm text-chrome uppercase tracking-widest mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`px-6 py-3 rounded-full font-sans text-sm tracking-widest uppercase transition-all ${
                      formData.category === cat.value
                        ? 'bg-gradient-to-r from-y2k-pink to-y2k-cyan text-white'
                        : 'glass-panel text-chrome hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Video URL (Optional) */}
            <div>
              <label className="font-sans text-sm text-chrome uppercase tracking-widest mb-2 block">
                Video URL (Optional)
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-6 py-4 glass-panel rounded-full bg-transparent border-none outline-none focus:ring-2 focus:ring-y2k-pink transition-all font-sans"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting || !formData.imageUrl}
              className={`w-full py-4 bg-gradient-to-r from-y2k-lime to-y2k-cyan text-white font-sans text-sm tracking-widest uppercase rounded-full neon-glow-cyan ${
                isSubmitting || !formData.imageUrl ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Artwork'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
