import React, { useState } from 'react';

export default function SignUpSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'Landscape',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interests = [
    'Landscape',
    'Architecture',
    'Conceptual/Abstract',
    'Fine Art Portrait',
    'Street Minimal'
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API submit delay
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    }
  };

  return (
    <section className="relative min-h-screen w-full px-6 md:px-edge-margin-desktop py-24 flex items-center justify-center">
      {/* Abstract circles */}
      <div className="absolute top-1/4 left-[-40px] w-64 h-64 border border-white/5 rounded-full pointer-events-none floating"></div>
      <div className="absolute bottom-12 right-12 w-4 h-[1px] bg-white/20 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[1px] h-4 bg-white/20 absolute"></div>
      </div>

      <div className="w-full max-w-md glass rounded-lg p-8 relative z-10 shadow-2xl transition-all duration-500 hover:border-white/15">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Form Title */}
            <div className="text-center mb-2">
              <h2 className="text-xs font-semibold tracking-[0.4em] uppercase text-white/50 mb-2">JOIN THE CIRCLE</h2>
              <h1 className="text-2xl font-light text-white tracking-wide">Register Vision</h1>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[10px] font-semibold tracking-wider text-secondary uppercase">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Akihiro Sato"
                className={`w-full bg-white/5 border rounded px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:bg-white/10 transition-all ${
                  errors.name ? 'border-red-400' : 'border-white/10 focus:border-white/30'
                }`}
              />
              {errors.name && <span className="text-[11px] text-red-400">{errors.name}</span>}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[10px] font-semibold tracking-wider text-secondary uppercase">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sato@lenscape.art"
                className={`w-full bg-white/5 border rounded px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:bg-white/10 transition-all ${
                  errors.email ? 'border-red-400' : 'border-white/10 focus:border-white/30'
                }`}
              />
              {errors.email && <span className="text-[11px] text-red-400">{errors.email}</span>}
            </div>

            {/* Interest Select */}
            <div className="flex flex-col gap-2">
              <label htmlFor="interest" className="text-[10px] font-semibold tracking-wider text-secondary uppercase">
                Focus Interest
              </label>
              <div className="relative">
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 appearance-none cursor-pointer focus:bg-surface-container-high transition-colors"
                >
                  {interests.map(item => (
                    <option key={item} value={item} className="bg-black text-white">
                      {item}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[10px] font-semibold tracking-wider text-secondary uppercase">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-white/5 border rounded px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:bg-white/10 transition-all ${
                  errors.password ? 'border-red-400' : 'border-white/10 focus:border-white/30'
                }`}
              />
              {errors.password && <span className="text-[11px] text-red-400">{errors.password}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-white text-black font-semibold text-xs uppercase tracking-[0.25em] rounded hover:bg-white/90 active:scale-95 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        ) : (
          /* Success Micro-animation Layout */
          <div className="flex flex-col items-center text-center py-8 gap-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-emerald-400 relative">
              <span className="material-symbols-outlined text-[32px] animate-scale-up">check</span>
              <span className="w-16 h-16 rounded-full border border-emerald-400/30 absolute animate-ping pointer-events-none"></span>
            </div>
            
            <div>
              <h1 className="text-2xl font-light text-white mb-2">Application Received</h1>
              <p className="text-sm text-secondary leading-relaxed font-light">
                Welcome to Lenscape, <span className="text-white font-medium">{formData.name}</span>. 
                Your preference for <span className="italic text-white">{formData.interest}</span> has been noted. We will review your entry and connect shortly.
              </p>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', interest: 'Landscape', password: '' });
              }}
              className="mt-4 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-[10px] uppercase tracking-widest rounded transition-all"
            >
              Submit Another Application
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
