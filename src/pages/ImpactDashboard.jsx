import { useState, useEffect, useRef } from 'react';
import { impactStats } from '../data/mockData';
import Footer from '../components/Footer';
import { BarChart3, TrendingUp, Users, Leaf, Trophy, ArrowUpRight, Utensils, Globe, Heart } from 'lucide-react';

export default function ImpactDashboard() {
  return (
    <div className="min-h-screen bg-surface-900 bg-mesh pt-20 pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 page-enter">
        {/* Header */}
        <div className="text-center mb-12 pt-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
            <BarChart3 size={14} /> Live Impact Tracker
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Our <span className="gradient-text">Collective Impact</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Every meal saved makes a difference. Here's the real-time impact of the FoodBridge community.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <BigStatCard icon="🍽️" value={impactStats.totalMealsSaved} label="Meals Saved" suffix="+" trend="+12%" />
          <BigStatCard icon="👥" value={impactStats.peopleFed} label="People Fed" suffix="+" trend="+18%" />
          <BigStatCard icon="🌿" value={impactStats.kgFoodRescued} label="Kg Food Rescued" suffix="" trend="+9%" />
          <BigStatCard icon="💨" value={impactStats.co2Offset} label="Kg CO₂ Offset" suffix="" trend="+15%" />
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MiniStat icon={<Utensils size={16} />} value={impactStats.activeDonors} label="Active Donors" color="primary" />
          <MiniStat icon={<Heart size={16} />} value={impactStats.activeNgos} label="NGO Partners" color="rose" />
          <MiniStat icon={<Users size={16} />} value={impactStats.activeVolunteers} label="Volunteers" color="amber" />
          <MiniStat icon={<Globe size={16} />} value={impactStats.citiesCovered} label="Cities" color="sky" />
        </div>

        {/* Weekly Trend Chart */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-primary-400" /> Weekly Meals Saved
            </h3>
            <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded-lg">Last 8 Weeks</span>
          </div>
          <BarChartSimple data={impactStats.weeklyData} />
        </div>

        {/* Top Donors */}
        <div className="glass-card p-6 mb-12">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-6">
            <Trophy size={16} className="text-amber-400" /> Top Donors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {impactStats.topDonors.map((donor, i) => (
              <LeaderboardRow key={i} rank={i + 1} name={donor.name} value={`${donor.meals.toLocaleString()} meals`} avatar={donor.avatar} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* ===== ANIMATED STAT CARD ===== */
function BigStatCard({ icon, value, label, suffix, trend }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const duration = 2000;
          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="glass-card-hover p-5 text-center group">
      <span className="text-3xl block mb-3">{icon}</span>
      <p className="text-3xl sm:text-4xl font-bold text-white counter-value mb-1">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs text-slate-500 mb-2">{label}</p>
      {trend && (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
          <ArrowUpRight size={10} /> {trend}
        </span>
      )}
    </div>
  );
}

/* ===== MINI STAT ===== */
function MiniStat({ icon, value, label, color }) {
  const colors = {
    primary: 'text-primary-400 bg-primary-500/15 border-primary-500/20',
    amber: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
    sky: 'text-sky-400 bg-sky-500/15 border-sky-500/20',
    rose: 'text-rose-400 bg-rose-500/15 border-rose-500/20',
  };
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} border flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-[10px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}

/* ===== SIMPLE BAR CHART (Pure CSS) ===== */
function BarChartSimple({ data }) {
  const maxVal = Math.max(...data.map(d => d.meals));

  return (
    <div className="flex items-end gap-2 h-44">
      {data.map((d, i) => {
        const height = (d.meals / maxVal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity counter-value">
              {d.meals.toLocaleString()}
            </span>
            <div className="w-full flex flex-col items-center justify-end flex-1">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-1000 hover:from-primary-500 hover:to-primary-300 group-hover:shadow-lg group-hover:shadow-primary-500/20"
                style={{ height: `${height}%`, minHeight: '8px', animationDelay: `${i * 100}ms` }}
              />
            </div>
            <span className="text-[10px] text-slate-600">{d.week}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ===== LEADERBOARD ROW ===== */
function LeaderboardRow({ rank, name, value, avatar, color = 'amber' }) {
  const medals = ['🥇', '🥈', '🥉'];
  const bgColors = {
    amber: rank <= 3 ? 'bg-amber-500/5 border-amber-500/10' : 'bg-surface-900/30 border-white/5',
    purple: rank <= 3 ? 'bg-purple-500/5 border-purple-500/10' : 'bg-surface-900/30 border-white/5',
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors hover:bg-surface-800/50 ${bgColors[color]}`}>
      <span className="text-lg w-8 text-center flex-shrink-0">
        {rank <= 3 ? medals[rank - 1] : <span className="text-sm text-slate-600">#{rank}</span>}
      </span>
      <span className="text-xl flex-shrink-0">{avatar}</span>
      <p className="text-sm font-medium text-white flex-1 truncate">{name}</p>
      <p className="text-xs text-slate-400 font-medium flex-shrink-0">{value}</p>
    </div>
  );
}
