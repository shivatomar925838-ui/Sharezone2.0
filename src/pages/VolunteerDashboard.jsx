import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useVoice } from '../components/VoiceAssistant';
import MapView from '../components/MapView';
import {
  Bike, MapPin, Package, Clock, CheckCircle, Trophy, Navigation,
  Route, IndianRupee, Wallet, TrendingUp, Flame, Star, Search,
  Target, Award, Timer
} from 'lucide-react';

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const { donations, acceptDelivery, markDelivered } = useApp();
  const { speak, voiceEnabled } = useVoice();
  const [activeTab, setActiveTab] = useState('available');
  const [deliveryTimers, setDeliveryTimers] = useState({});
  const deliveryStartTimes = useRef({});

  const availablePickups = donations.filter(d => d.status === 'matched' && !d.volunteerId);
  const myDeliveries = donations.filter(d => d.volunteerId === user?.id);
  const activeDeliveries = myDeliveries.filter(d => d.status === 'picked_up');
  const completedDeliveries = myDeliveries.filter(d => d.status === 'delivered');

  // Track delivery time
  useEffect(() => {
    activeDeliveries.forEach(d => {
      if (!deliveryStartTimes.current[d.id]) {
        deliveryStartTimes.current[d.id] = Date.now();
      }
    });

    const interval = setInterval(() => {
      const timers = {};
      activeDeliveries.forEach(d => {
        const start = deliveryStartTimes.current[d.id] || Date.now();
        const elapsed = Math.floor((Date.now() - start) / 1000);
        timers[d.id] = elapsed;
      });
      setDeliveryTimers(timers);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeDeliveries.length]);

  const handleAccept = (donationId) => {
    deliveryStartTimes.current[donationId] = Date.now();
    acceptDelivery(donationId, user?.id, user?.name);
  };

  const handleDeliver = (donationId) => {
    const startTime = deliveryStartTimes.current[donationId];
    const totalSeconds = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const timeStr = mins > 0 ? `${mins} minutes and ${secs} seconds` : `${secs} seconds`;

    markDelivered(donationId);

    // Voice: announce delivery time
    if (voiceEnabled) speak(`Delivery completed in ${timeStr}. Great job!`);

    delete deliveryStartTimes.current[donationId];
  };

  // ===== STATS =====
  const RATE_PER_KM = 30;
  const totalKm = user?.stats?.kmTraveled || 234;
  const totalEarnings = totalKm * RATE_PER_KM;
  const totalDeliveries = user?.stats?.delivered || 67;
  const todayDeliveries = 3;
  const todayKm = 12.5;
  const todayEarnings = todayKm * RATE_PER_KM;
  const avgDeliveryTime = 18; // minutes
  const successRate = 97;
  const weeklyPerformance = 85;

  const earningsHistory = [
    { id: 1, food: 'Paneer Butter Masala', from: 'Sharma Kitchen', to: 'Feeding India', km: 3.2, earnings: 96, time: '25 min ago', duration: '14 min' },
    { id: 2, food: 'Biryani (100 servings)', from: 'Royal Banquets', to: 'Akshaya Patra', km: 5.7, earnings: 171, time: '1 hr ago', duration: '22 min' },
    { id: 3, food: 'Gulab Jamun + Jalebi', from: 'Royal Banquets', to: 'Feeding India', km: 3.6, earnings: 108, time: '2 hr ago', duration: '16 min' },
    { id: 4, food: 'Dal Makhani + Rice', from: 'Sharma Kitchen', to: 'Robin Hood Army', km: 4.1, earnings: 123, time: '3 hr ago', duration: '19 min' },
    { id: 5, food: 'Chole Bhature', from: 'Annapoorna', to: 'Goonj Foundation', km: 2.8, earnings: 84, time: 'Yesterday', duration: '12 min' },
  ];

  // Weekly performance data for chart
  const weeklyData = [
    { day: 'MON', value: 76, deliveries: 8 },
    { day: 'TUE', value: 85, deliveries: 11 },
    { day: 'WED', value: 60, deliveries: 6 },
    { day: 'THU', value: 92, deliveries: 14 },
    { day: 'FRI', value: 78, deliveries: 9 },
    { day: 'SAT', value: 85, deliveries: 12 },
    { day: 'SUN', value: 49, deliveries: 5 },
  ];

  const volLat = user?.location?.lat || 28.62;
  const volLng = user?.location?.lng || 77.215;

  const mapMarkers = [
    ...availablePickups.map(d => ({
      lat: d.location.lat, lng: d.location.lng, emoji: '📦', size: 26,
      popup: { title: d.foodName, subtitle: `${d.quantity} — Pickup`, badge: 'Needs Pickup', badgeColor: 'rgba(245,158,11,0.2)', badgeTextColor: '#fbbf24' },
    })),
    ...activeDeliveries.map(d => ({
      lat: d.location.lat, lng: d.location.lng, emoji: '📍', size: 22,
      popup: { title: d.donorName || 'Pickup Point', subtitle: 'Picked up from here', badge: 'Pickup', badgeColor: 'rgba(245,158,11,0.2)', badgeTextColor: '#fbbf24' },
    })),
    ...activeDeliveries.map(d => ({
      lat: (d.location.lat + 0.01), lng: (d.location.lng + 0.005), emoji: '🏢', size: 26,
      popup: { title: d.matchedNgoName || 'NGO', subtitle: 'Delivery destination', badge: 'Deliver Here', badgeColor: 'rgba(34, 197, 94, 0.2)', badgeTextColor: '#22c55e' },
    })),
  ];

  if (activeDeliveries.length === 0) {
    mapMarkers.unshift({
      lat: volLat, lng: volLng, emoji: '🚴', size: 32,
      popup: { title: 'You', subtitle: user?.name, badge: 'Volunteer', badgeColor: 'rgba(34, 197, 94, 0.2)', badgeTextColor: '#22c55e' },
    });
  }

  const routePoints = activeDeliveries.length > 0 ? [
    [volLat, volLng],
    [activeDeliveries[0].location.lat, activeDeliveries[0].location.lng],
    [activeDeliveries[0].location.lat + 0.01, activeDeliveries[0].location.lng + 0.005],
  ] : [];

  const animatedVolunteerMarker = useMemo(() => {
    if (activeDeliveries.length === 0) return null;
    const d = activeDeliveries[0];
    const donorLat = d.location.lat;
    const donorLng = d.location.lng;
    const ngoLat = donorLat + 0.01;
    const ngoLng = donorLng + 0.005;
    return {
      emoji: '🚴', size: 34, speed: 400,
      route: [
        [volLat, volLng], [donorLat, donorLng],
        [donorLat + (ngoLat - donorLat) * 0.25, donorLng + (ngoLng - donorLng) * 0.25 + 0.003],
        [donorLat + (ngoLat - donorLat) * 0.5, donorLng + (ngoLng - donorLng) * 0.5 - 0.002],
        [donorLat + (ngoLat - donorLat) * 0.75, donorLng + (ngoLng - donorLng) * 0.75 + 0.002],
        [ngoLat, ngoLng],
      ],
      popup: { title: 'You (Delivering)', subtitle: `${d.foodName} → ${d.matchedNgoName || 'NGO'}` },
    };
  }, [activeDeliveries.length > 0 ? activeDeliveries[0].id : null, volLat, volLng]);

  const getEstimatedKm = () => (Math.random() * 5 + 1.5).toFixed(1);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-surface-900 bg-mesh pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 page-enter">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">{user?.avatar || '🚴'}</span> Volunteer Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name || 'Pro Volunteer'}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Package size={18} />} label="Total Deliveries" value={totalDeliveries} color="primary" />
          <StatCard icon={<Route size={18} />} label="Km Traveled" value={totalKm} color="amber" />
          <StatCard icon={<Clock size={18} />} label="Hours Given" value={user?.stats?.hoursVolunteered || 89} color="sky" />
          <StatCard icon={<IndianRupee size={18} />} label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} color="rose" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 p-1 bg-surface-800/50 rounded-xl w-fit">
          <TabBtn active={activeTab === 'available'} onClick={() => setActiveTab('available')} count={availablePickups.length}>
            📍 Available Pickups
          </TabBtn>
          <TabBtn active={activeTab === 'active'} onClick={() => setActiveTab('active')} count={activeDeliveries.length}>
            🚴 Active Delivery
          </TabBtn>
          <TabBtn active={activeTab === 'performance'} onClick={() => setActiveTab('performance')}>
            📈 Performance & Earnings
          </TabBtn>
        </div>

        {/* ===== AVAILABLE PICKUPS TAB ===== */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-primary-400" /> Pending Requests
              </h3>
              <div className="space-y-3">
                {availablePickups.map((d) => {
                  const estKm = getEstimatedKm();
                  const estEarnings = (estKm * RATE_PER_KM).toFixed(0);
                  const estTime = Math.floor(Math.random() * 15) + 8;
                  return (
                    <div key={d.id} className="glass-card-hover p-4 border border-white/5 bg-surface-800/30 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center text-xl shrink-0">
                        🍽️
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-white truncate">{d.foodName}</p>
                        <p className="text-xs text-slate-500 truncate">{d.donorName} • {d.quantity}</p>
                      </div>
                      <div className="flex items-center sm:items-end justify-between sm:flex-col shrink-0 gap-2 sm:gap-1">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-amber-400">₹{estEarnings}</p>
                          <p className="text-xs text-slate-500">{estKm}km • ~{estTime}min</p>
                        </div>
                        <button
                          onClick={() => handleAccept(d.id)}
                          className="btn-primary !py-1.5 !px-4 text-xs shrink-0"
                        >
                          Accept Pickup
                        </button>
                      </div>
                    </div>
                  );
                })}
                {availablePickups.length === 0 && (
                  <div className="text-center py-12">
                    <span className="text-4xl block mb-3">☕</span>
                    <p className="text-slate-400">No pickups available right now</p>
                  </div>
                )}
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-4">Nearby Area</h3>
              <MapView
                markers={mapMarkers}
                height="400px"
                center={user?.location ? [user.location.lat, user.location.lng] : undefined}
                showRoute={activeDeliveries.length > 0}
                routePoints={routePoints}
              />
            </div>
          </div>
        )}

        {/* ===== ACTIVE DELIVERY TAB ===== */}
        {activeTab === 'active' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {activeDeliveries.length > 0 ? (
                <div className="glass-card p-6 border-primary-500/30 bg-primary-500/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        In Transit
                      </h3>
                      <p className="text-sm text-slate-400">
                        Delivering <span className="text-primary-300 font-medium">{activeDeliveries[0].foodName}</span> to <span className="text-primary-300 font-medium">{activeDeliveries[0].matchedNgoName}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-900/50 border border-white/5">
                        <Timer size={14} className="text-primary-400" />
                        <span className="text-lg font-mono font-bold text-primary-400">
                          {formatTimer(deliveryTimers[activeDeliveries[0].id] || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-2 rounded-full bg-surface-900 overflow-hidden mb-6">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-1000" style={{
                      width: `${Math.min(((deliveryTimers[activeDeliveries[0].id] || 0) / 1800) * 100, 100)}%`,
                    }} />
                  </div>

                  <button
                    onClick={() => handleDeliver(activeDeliveries[0].id)}
                    className="w-full btn-primary text-base py-3"
                  >
                    ✓ Mark as Delivered
                  </button>
                </div>
              ) : (
                <div className="glass-card p-12 text-center h-full flex flex-col justify-center items-center">
                  <span className="text-5xl block mb-4">😌</span>
                  <h3 className="text-xl font-bold text-white mb-2">You have no active deliveries</h3>
                  <p className="text-slate-400 mb-6">Check the available pickups to start your next delivery run.</p>
                  <button onClick={() => setActiveTab('available')} className="btn-primary">
                    View Available Pickups
                  </button>
                </div>
              )}
            </div>
            
            <div className="glass-card p-5">
              <h3 className="font-semibold text-white mb-4">Live Route</h3>
              <MapView
                markers={mapMarkers}
                height="400px"
                center={user?.location ? [user.location.lat, user.location.lng] : undefined}
                showRoute={activeDeliveries.length > 0}
                routePoints={routePoints}
                animatedMarker={animatedVolunteerMarker}
              />
            </div>
          </div>
        )}

        {/* ===== PERFORMANCE & EARNINGS TAB ===== */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-6">Weekly Performance</h3>
              
              <div className="flex items-center justify-center mb-8">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#22c55e" strokeWidth="8"
                      strokeDasharray={`${weeklyPerformance * 2.64} 264`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-white">{weeklyPerformance}%</span>
                    <span className="text-[10px] text-slate-500">Score</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Success Rate</span>
                  <span className="text-sm font-bold text-white">{successRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Avg Delivery Time</span>
                  <span className="text-sm font-bold text-white">{avgDeliveryTime} mins</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Rating</span>
                  <span className="text-sm font-bold text-amber-400 flex items-center gap-1">4.9 <Star size={12} fill="currentColor" /></span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white">Earnings History</h3>
                <span className="text-sm font-medium text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">
                  Today: ₹{Math.round(todayEarnings)}
                </span>
              </div>

              <div className="space-y-3">
                {earningsHistory.map(item => (
                  <div key={item.id} className="glass-card-hover p-4 border border-white/5 bg-surface-800/30 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center text-lg shrink-0">
                      🍽️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.food}</p>
                      <p className="text-xs text-slate-500 truncate">{item.from} → {item.to}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-amber-400 flex items-center gap-1 justify-end">
                        ₹{item.earnings}
                      </p>
                      <p className="text-[10px] text-slate-500">{item.km}km • {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// ===== SUB COMPONENTS =====

function StatCard({ icon, label, value, color }) {
  const colors = {
    primary: 'text-primary-400 bg-primary-500/15 border-primary-500/20',
    amber: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
    sky: 'text-sky-400 bg-sky-500/15 border-sky-500/20',
    rose: 'text-rose-400 bg-rose-500/15 border-rose-500/20',
  };
  return (
    <div className="glass-card p-4">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} border flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white counter-value">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function TabBtn({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
        active ? 'bg-primary-500/20 text-primary-400' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {children}
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${active ? 'bg-primary-500/30' : 'bg-surface-700'}`}>
          {count}
        </span>
      )}
    </button>
  );
}
