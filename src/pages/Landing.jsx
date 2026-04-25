import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import { ArrowRight, Utensils, MapPin, Clock, Users, Bike, BarChart3, Heart, Shield, Zap, Star, ChevronRight, Sparkles, Shirt, ShoppingCart, BookOpen, Gift, Package } from 'lucide-react';
import { impactStats, testimonials, DONATION_CATEGORIES } from '../data/mockData';
import { useState, useEffect, useRef, useCallback } from 'react';

// Unsplash images (free, no API key)
const SHOWCASE_IMAGES = {
  thali: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
  biryani: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  clothes: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
  ration: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  books: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
  accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
};

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-surface-900">
      <HeroSection isAuthenticated={isAuthenticated} />
      <StatsBar />
      <DonationShowcase />
      <HowItWorks />
      <Features />
      <InfluencerCTA />
      <Testimonials />
      <CTASection isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
}

/* ===== HERO (with floating orbs) ===== */
function HeroSection({ isAuthenticated }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-500/8 rounded-full blur-3xl animate-float delay-300" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" />

      {/* Floating category icons */}
      <div className="hidden lg:flex absolute top-32 left-16 w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 items-center justify-center text-4xl animate-float">🍱</div>
      <div className="hidden lg:flex absolute top-48 right-20 w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/20 items-center justify-center text-4xl animate-float delay-300">👕</div>
      <div className="hidden lg:flex absolute bottom-40 left-24 w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 items-center justify-center text-4xl animate-float delay-200">🛒</div>
      <div className="hidden lg:flex absolute bottom-32 right-32 w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 items-center justify-center text-4xl animate-float delay-100">📚</div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Multi-Category Donation Platform
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 animate-slide-up leading-tight">
            Donate Anything,{' '}
            <span className="gradient-text">Change Lives.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up delay-100 leading-relaxed">
            ServeZone connects donors with NGOs — donate{' '}
            <span className="text-primary-400 font-semibold">food</span>,{' '}
            <span className="text-sky-400 font-semibold">clothes</span>,{' '}
            <span className="text-amber-400 font-semibold">ration</span>,{' '}
            <span className="text-purple-400 font-semibold">books</span>{' '}
            & more. Delivered by volunteers in{' '}
            <span className="text-amber-400 font-semibold">real-time</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
            <Link to={isAuthenticated ? '/dashboard/donor' : '/signup'} className="btn-primary text-base !px-8 !py-4 group">
              Start Donating
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/influencer" className="btn-secondary text-base !px-8 !py-4">
              <Sparkles size={18} />
              Influencer Collab
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in delay-300">
            <TrustBadge icon="🍱" number="12,847" label="Meals Saved" />
            <TrustBadge icon="👕" number="4,520" label="Items Donated" />
            <TrustBadge icon="🏢" number="45+" label="NGO Partners" />
            <TrustBadge icon="🚴" number="189" label="Active Volunteers" />
          </div>
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
      <div className="text-lg font-bold text-white counter-value">{number}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

/* ===== MULTI-CATEGORY DONATION SHOWCASE ===== */
function DonationShowcase() {
  const showcaseItems = [
    { image: SHOWCASE_IMAGES.thali, title: 'Fresh Meals', category: 'Food', donor: 'Sharma Kitchen', count: '40 servings', timeLeft: '2h 30m', color: 'primary', emoji: '🍱' },
    { image: SHOWCASE_IMAGES.clothes, title: 'Winter Clothes', category: 'Clothes', donor: 'Fashion Forward', count: '50 items', timeLeft: null, color: 'sky', emoji: '👕' },
    { image: SHOWCASE_IMAGES.ration, title: 'Monthly Ration Kit', category: 'Ration', donor: 'Gupta Store', count: '20 kits', timeLeft: null, color: 'amber', emoji: '🛒' },
    { image: SHOWCASE_IMAGES.books, title: 'NCERT Textbooks', category: 'Books', donor: 'Delhi Library', count: '200 books', timeLeft: null, color: 'rose', emoji: '📚' },
    { image: SHOWCASE_IMAGES.accessories, title: 'School Bags', category: 'Accessories', donor: 'Lifestyle Store', count: '80 items', timeLeft: null, color: 'purple', emoji: '👜' },

  ];

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">
            <Sparkles size={14} /> Live Donations
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Not Just Food — <span className="gradient-text-warm">Donate Anything</span>
          </h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm">
            From surplus meals to winter clothes to school supplies — every donation finds its way to those who need it most.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {DONATION_CATEGORIES.slice(0, 6).map(cat => (
            <span key={cat.id} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-800/50 border border-white/5 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-default">
              {cat.emoji} {cat.label}
            </span>
          ))}
        </div>

        {/* 3D Interactive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseItems.map((item, i) => (
            <ShowcaseCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({ item, index }) {
  const cardRef = useRef(null);
  const colorMap = {
    primary: 'text-primary-400 bg-primary-500/15 border-primary-500/20',
    sky: 'text-sky-400 bg-sky-500/15 border-sky-500/20',
    amber: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/15 border-rose-500/20',
    purple: 'text-purple-400 bg-purple-500/15 border-purple-500/20',
  };

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative glass-card overflow-hidden cursor-pointer transition-transform duration-200 ease-out group"
    >
      {/* Shine */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)' }}
      />

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent" />

        {/* Category badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${colorMap[item.color]}`}>
          {item.emoji} {item.category}
        </div>

        {/* Timer for food */}
        {item.timeLeft && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-surface-900/80 backdrop-blur-sm text-primary-400 text-xs font-bold flex items-center gap-1 border border-primary-500/30">
            <Clock size={10} /> {item.timeLeft}
          </div>
        )}

        {/* Featured */}
        {item.featured && (
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
            <Star size={10} className="fill-white" /> Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-white text-lg mb-1 group-hover:text-primary-400 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3">by {item.donor}</p>
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${colorMap[item.color]}`}>
            <Package size={11} /> {item.count}
          </span>
          <span className="text-xs text-primary-400 font-medium group-hover:underline flex items-center gap-1">
            Support Cause <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ===== LIVE STATS BAR ===== */
function StatsBar() {
  return (
    <section className="relative -mt-8 z-20 max-w-5xl mx-auto px-4">
      <div className="glass-card p-6 glow-green">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <AnimatedStat icon="🍽️" value={12847} label="Meals Saved" suffix="+" />
          <AnimatedStat icon="📦" value={4520} label="Items Donated" suffix="+" />
          <AnimatedStat icon="🌿" value={19270} label="kg CO₂ Offset" suffix="" />
          <AnimatedStat icon="🏙️" value={12} label="Cities Covered" suffix="" />
        </div>
      </div>
    </section>
  );
}

function AnimatedStat({ icon, value, label, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount(0, value, 2000);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  function animateCount(start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * (end - start) + start));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold text-white counter-value">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

/* ===== HOW IT WORKS ===== */
function HowItWorks() {
  const steps = [
    { icon: '📸', title: 'Post Your Donation', desc: 'Have surplus food, clothes, ration, or books? Post it with photo, quantity, and details.', color: 'from-primary-500 to-emerald-600' },
    { icon: '🎯', title: 'Auto-Match Nearby NGO', desc: 'Our algorithm instantly finds the closest relevant NGO and notifies them. No manual search.', color: 'from-amber-500 to-orange-600' },
    { icon: '🚴', title: 'Volunteer Delivery', desc: 'A nearby volunteer picks up your donation and delivers it. Real-time tracking included.', color: 'from-sky-500 to-blue-600' },
    { icon: '🎉', title: 'Impact Made!', desc: 'Your donation reaches those who need it. Zero waste. Impact tracked on our dashboard.', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <section className="py-24 px-4 bg-mesh">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            From Surplus to <span className="gradient-text">Served</span> in Minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

/* ===== FEATURES ===== */
function Features() {
  const features = [
    { icon: <MapPin size={20} />, title: 'Smart Nearby Matching', desc: 'Location-based matching finds the closest NGO automatically.', color: 'text-primary-400 bg-primary-500/15' },
    { icon: <Package size={20} />, title: 'Multi-Category Donations', desc: 'Donate food, clothes, ration, books, accessories & more — all in one place.', color: 'text-sky-400 bg-sky-500/15' },
    { icon: <Clock size={20} />, title: 'Expiry Timer', desc: 'Live countdown for food ensures it\'s rescued before going to waste.', color: 'text-amber-400 bg-amber-500/15' },
    { icon: <Bike size={20} />, title: 'Volunteer Network', desc: 'Dedicated volunteers pick up and deliver donations in real-time.', color: 'text-purple-400 bg-purple-500/15' },
    { icon: <Shield size={20} />, title: 'Photo Verification', desc: 'Photos ensure quality and build trust in the donation system.', color: 'text-rose-400 bg-rose-500/15' },
    { icon: <Zap size={20} />, title: 'Influencer Collabs', desc: 'Influencers partner with NGOs to run massive donation campaigns.', color: 'text-green-400 bg-green-500/15' },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Features</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            Built for <span className="gradient-text-warm">Speed & Impact</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <TiltFeatureCard key={i} feat={feat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltFeatureCard({ feat }) {
  const ref = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
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
      <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
        style={{ transform: 'translateZ(20px)' }}
      >
        {feat.icon}
      </div>
      <h3 className="font-semibold text-white mb-2" style={{ transform: 'translateZ(15px)' }}>{feat.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed" style={{ transform: 'translateZ(10px)' }}>{feat.desc}</p>
    </div>
  );
}

/* ===== INFLUENCER CTA SECTION ===== */
function InfluencerCTA() {
  return (
    <section className="py-24 px-4 bg-mesh">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card p-8 sm:p-12 relative overflow-hidden" style={{ boxShadow: '0 0 80px rgba(168, 85, 247, 0.1)' }}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            {/* Left: Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
                <Sparkles size={12} /> New Feature
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                Are You an{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Influencer</span>?
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-lg">
                Partner with verified NGOs on ServeZone. Run donation drives, create impact campaigns, and use your platform to make a real difference. Food, clothes, ration — amplify any cause.
              </p>
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3">
                <Link to="/influencer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 group">
                  Collaborate Now
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/influencer" className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1">
                  Learn More <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="flex-shrink-0 grid grid-cols-2 gap-3">
              {[
                { emoji: '📸', label: 'Instagram', followers: '2.5M', color: 'from-pink-500/20 to-purple-500/20' },
                { emoji: '🎬', label: 'YouTube', followers: '1.2M', color: 'from-red-500/20 to-rose-500/20' },
                { emoji: '🐦', label: 'Twitter', followers: '890K', color: 'from-sky-500/20 to-blue-500/20' },
                { emoji: '🌟', label: 'Your Platform', followers: 'Join Now', color: 'from-amber-500/20 to-orange-500/20' },
              ].map((p, i) => (
                <div key={i} className={`w-32 h-24 rounded-xl bg-gradient-to-br ${p.color} border border-white/5 flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform`}>
                  <span className="text-2xl">{p.emoji}</span>
                  <span className="text-[10px] text-slate-400">{p.label}</span>
                  <span className="text-xs font-bold text-white">{p.followers}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===== TESTIMONIALS ===== */
function Testimonials() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3">
            Loved by <span className="gradient-text">Our Community</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card-hover p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== CTA ===== */
function CTASection({ isAuthenticated }) {
  return (
    <section className="py-24 px-4 bg-mesh">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-10 sm:p-14 text-center relative overflow-hidden glow-green">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <span className="text-4xl mb-4 block">🌍</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Join the <span className="gradient-text">Donation</span> Movement
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
              Whether you're donating food, clothes, or books — whether you're an NGO, a volunteer, or an influencer — ServeZone needs you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? '/dashboard/donor' : '/signup'} className="btn-primary text-base !px-8 !py-4 group">
                Start Donating <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to={isAuthenticated ? '/dashboard/volunteer' : '/signup'} className="btn-amber text-base !px-8 !py-4">
                <Heart size={18} /> Volunteer Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
