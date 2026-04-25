import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { ngoDirectory } from '../data/mockData';
import Footer from '../components/Footer';
import {
  ArrowRight, Star, Users, Heart, Sparkles, Send, Instagram, Youtube, Twitter,
  Globe, ChevronRight, CheckCircle, MessageSquare, TrendingUp, Zap, Award, ExternalLink
} from 'lucide-react';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-500' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'from-red-500 to-rose-600' },
  { id: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'from-sky-400 to-blue-500' },
  { id: 'other', label: 'Other', icon: Globe, color: 'from-emerald-500 to-teal-600' },
];

export default function InfluencerPage() {
  return (
    <div className="min-h-screen bg-surface-900">
      <HeroSection />
      <HowItWorksSection />
      <NgoDirectorySection />
      <CollabFormSection />
      <SuccessStoriesSection />
      <CTABanner />
      <Footer />
    </div>
  );
}

/* ===== HERO ===== */
function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-mesh pt-20">
      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/8 rounded-full blur-3xl animate-float delay-300" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-8 animate-fade-in">
          <Sparkles size={14} className="animate-pulse" />
          Influencer × NGO Collaboration
        </div>

        {/* Heading */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-6 animate-slide-up leading-tight">
          Amplify Your{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Impact
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up delay-100 leading-relaxed">
          Use your influence for good. Partner directly with verified NGOs on ServeZone to run
          donation drives for food, clothes, ration & more —{' '}
          <span className="text-purple-400 font-semibold">and make real change happen</span>.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
          <a href="#collab-form" className="btn-primary text-base !px-8 !py-4 group !bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-500 hover:!to-pink-500">
            Start Collaborating
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#ngo-directory" className="btn-secondary text-base !px-8 !py-4">
            <Users size={18} /> Browse NGOs
          </a>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in delay-300">
          <TrustBadge icon="🤝" number="45+" label="NGO Partners" />
          <TrustBadge icon="📸" number="120+" label="Influencer Collabs" />
          <TrustBadge icon="🌍" number="5M+" label="People Reached" />
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-900 to-transparent" />
    </section>
  );
}

function TrustBadge({ icon, number, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-lg font-bold text-white">{number}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

/* ===== HOW IT WORKS FOR INFLUENCERS ===== */
function HowItWorksSection() {
  const steps = [
    {
      icon: '📝', title: 'Register & Choose NGO',
      desc: 'Browse our verified NGO directory and pick the cause you want to amplify. Fill out a simple collaboration form.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: '🤝', title: 'Get Connected',
      desc: 'Our team reviews your request and connects you directly with the NGO. Plan your campaign together.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: '📣', title: 'Run Your Campaign',
      desc: 'Launch donation drives, create content, and mobilize your followers. Track your impact in real-time on our dashboard.',
      color: 'from-amber-500 to-orange-600'
    },
  ];

  return (
    <section className="py-24 px-4 bg-mesh">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            Three Steps to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Real Impact</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <div className="glass-card-hover p-6 text-center h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-surface-900/80 text-xs text-slate-500 font-medium mb-3">Step {i + 1}</span>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ChevronRight size={20} className="text-slate-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== NGO DIRECTORY ===== */
function NgoDirectorySection() {
  return (
    <section id="ngo-directory" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Our Partners</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            Verified <span className="gradient-text">NGO Partners</span>
          </h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm">
            Choose an NGO that aligns with your cause. Contact them directly through our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ngoDirectory.map(ngo => (
            <NgoCard key={ngo.id} ngo={ngo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NgoCard({ ngo }) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    ref.current.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card-hover p-6 group transition-transform duration-200 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-primary-500/15 border border-primary-500/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
          {ngo.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-white text-lg group-hover:text-primary-400 transition-colors">{ngo.name}</h3>
          <p className="text-xs text-purple-400 font-medium">{ngo.cause}</p>
          <p className="text-xs text-slate-500 mt-0.5">📍 {ngo.location}</p>
        </div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed mb-4">{ngo.bio}</p>

      {/* Impact */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <TrendingUp size={12} className="text-emerald-400" />
        <span className="text-xs text-emerald-400 font-medium">{ngo.impact}</span>
      </div>

      {/* Accepts */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {ngo.acceptsCategories.map(cat => {
          const catLabel = cat === 'food' ? '🍱 Food' : cat === 'clothes' ? '👕 Clothes' : cat === 'ration' ? '🛒 Ration' : cat === 'books' ? '📚 Books' : cat === 'accessories' ? '👜 Accessories' : `📦 ${cat}`;
          return (
            <span key={cat} className="px-2 py-1 rounded-md bg-surface-900/80 text-[10px] text-slate-400 border border-white/5">
              {catLabel}
            </span>
          );
        })}
      </div>

      {/* Action */}
      <a href="#collab-form" className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors group/link">
        <MessageSquare size={14} />
        Contact for Collaboration
        <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}

/* ===== COLLABORATION FORM ===== */
function CollabFormSection() {
  const { submitInfluencerRequest } = useApp();
  const [formData, setFormData] = useState({
    name: '', handle: '', platform: 'instagram', followers: '', ngoId: '', ngoName: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    if (field === 'ngoId') {
      const ngo = ngoDirectory.find(n => n.id === value);
      setFormData(prev => ({ ...prev, ngoId: value, ngoName: ngo?.name || '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitInfluencerRequest(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', handle: '', platform: 'instagram', followers: '', ngoId: '', ngoName: '', message: '' });
  };

  return (
    <section id="collab-form" className="py-24 px-4 bg-mesh">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Get In Touch</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            Start Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Collaboration</span>
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Fill out the form below and we'll connect you with the NGO of your choice.
          </p>
        </div>

        {submitted ? (
          <div className="glass-card p-10 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Request Submitted! 🎉</h3>
            <p className="text-slate-400 text-sm">Our team will review your request and connect you with the NGO within 24 hours.</p>
          </div>
        ) : (
          <div className="glass-card p-6 sm:p-8 animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Your Name / Brand *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Priya Kapoor"
                  required
                />
              </div>

              {/* Platform + Handle */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Platform *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORMS.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleChange('platform', p.id)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                          formData.platform === p.id
                            ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                            : 'bg-surface-900/50 border-white/5 text-slate-500 hover:border-white/15'
                        }`}
                      >
                        <p.icon size={12} />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Social Handle *</label>
                  <input
                    type="text"
                    value={formData.handle}
                    onChange={(e) => handleChange('handle', e.target.value)}
                    className="input-field"
                    placeholder="@yourhandle"
                    required
                  />
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Follower Count</label>
                    <input
                      type="text"
                      value={formData.followers}
                      onChange={(e) => handleChange('followers', e.target.value)}
                      className="input-field"
                      placeholder="e.g., 500K, 1.2M"
                    />
                  </div>
                </div>
              </div>

              {/* NGO Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Choose NGO to Collaborate With *</label>
                <select
                  value={formData.ngoId}
                  onChange={(e) => handleChange('ngoId', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select an NGO...</option>
                  {ngoDirectory.map(ngo => (
                    <option key={ngo.id} value={ngo.id}>{ngo.avatar} {ngo.name} — {ngo.cause}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Your Message / Proposal *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="input-field resize-none h-28"
                  placeholder="Tell us about your campaign idea, what kind of content you want to create, and how you'd like to collaborate..."
                  required
                />
              </div>

              <button type="submit" className="w-full !py-3.5 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40">
                <Send size={18} /> Submit Collaboration Request
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

/* ===== SUCCESS STORIES ===== */
function SuccessStoriesSection() {
  const stories = [
    {
      influencer: 'Ananya Bhatt',
      handle: '@ananyabhatt',
      platform: 'Instagram',
      followers: '2.5M',
      ngo: 'Goonj Foundation',
      result: '5,000+ clothes donated in one campaign',
      quote: 'ServeZone made it so easy to connect with Goonj. My followers donated over 5,000 clothes in just 3 days!',
      avatar: '👩‍🦰',
    },
    {
      influencer: 'FoodieRaj',
      handle: '@foodieraj',
      platform: 'Instagram',
      followers: '890K',
      ngo: 'Robin Hood Army',
      result: '2,000+ meals served in a weekend',
      quote: 'We ran a food rescue marathon and the whole community came together. ServeZone\'s tracking made it seamless.',
      avatar: '👨‍🍳',
    },
    {
      influencer: 'TechForGood',
      handle: '@techforgood',
      platform: 'YouTube',
      followers: '1.2M',
      ngo: 'Feeding India Foundation',
      result: 'Documentary reached 500K+ viewers',
      quote: 'Our documentary on food waste went viral. The direct NGO connection through ServeZone made this possible.',
      avatar: '🎬',
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Success Stories</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            Influencers Making a <span className="gradient-text-warm">Difference</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <div key={i} className="glass-card-hover p-6 group">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{story.avatar}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{story.influencer}</p>
                  <p className="text-[10px] text-purple-400">{story.handle} • {story.platform} • {story.followers}</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-4 italic">"{story.quote}"</p>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-3">
                <Award size={12} className="text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">{story.result}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500">with</span>
                <span className="text-xs text-primary-400 font-medium">{story.ngo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== BOTTOM CTA ===== */
function CTABanner() {
  return (
    <section className="py-24 px-4 bg-mesh">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-10 sm:p-14 text-center relative overflow-hidden" style={{ boxShadow: '0 0 80px rgba(168, 85, 247, 0.15)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <span className="text-4xl mb-4 block">🌟</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Your Influence Can{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Change Lives</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
              Whether you have 1K or 10M followers, your voice matters. Partner with verified NGOs and turn your platform into a force for good.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#collab-form" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 group">
                Start Collaborating <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link to="/signup" className="btn-secondary text-base !px-8 !py-4">
                <Heart size={18} /> Join ServeZone
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
