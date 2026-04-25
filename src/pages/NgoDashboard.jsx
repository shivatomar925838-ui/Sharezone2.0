import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import DonationCard from '../components/DonationCard';
import ExpiryTimer from '../components/ExpiryTimer';
import MapView from '../components/MapView';
import { DONATION_CATEGORIES } from '../data/mockData';
import { Search, MapPin, Package, Users, Heart, Filter, List, Map as MapIcon, Bike, Clock, Navigation, Phone } from 'lucide-react';

export default function NgoDashboard() {
  const { user } = useAuth();
  const { donations, claimDonation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('available');

  const availableDonations = donations.filter(d => d.status === 'posted');
  const myMatched = donations.filter(d => d.matchedNgoId === user?.id);
  const myIncoming = myMatched.filter(d => ['matched', 'picked_up'].includes(d.status));
  const myReceived = myMatched.filter(d => d.status === 'delivered');

  const filteredAvailable = availableDonations.filter(d => {
    const displayName = d.itemName || d.foodName || '';
    const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || d.type === filterType || (filterType === 'both' && d.type === 'both');
    const matchesCategory = filterCategory === 'all' || d.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleClaim = (donationId) => {
    claimDonation(donationId, user?.id, user?.name);
  };

  // Map markers for available food tab
  const availableMapMarkers = [
    { lat: user?.location?.lat || 28.61, lng: user?.location?.lng || 77.23, emoji: '🏢', size: 32,
      popup: { title: user?.name || 'Your Location', subtitle: 'Your NGO', badge: 'You', badgeColor: 'rgba(14,165,233,0.2)', badgeTextColor: '#38bdf8' } },
    ...filteredAvailable.map(d => ({
      lat: d.location.lat + (Math.random() - 0.5) * 0.01,
      lng: d.location.lng + (Math.random() - 0.5) * 0.01,
      emoji: (DONATION_CATEGORIES.find(c => c.id === d.category) || DONATION_CATEGORIES[0]).emoji, size: 26,
      popup: { title: d.itemName || d.foodName, subtitle: `${d.quantity} — ${d.donorName}`, badge: 'Available', badgeColor: 'rgba(34, 197, 94, 0.2)', badgeTextColor: '#22c55e' },
    })),
  ];

  // Static markers for incoming tab (NGO + donor pickup points, NOT the volunteer — he's animated)
  const incomingMapMarkers = [
    { lat: user?.location?.lat || 28.61, lng: user?.location?.lng || 77.23, emoji: '🏢', size: 32,
      popup: { title: user?.name || 'Your NGO', subtitle: 'Delivery destination', badge: 'You', badgeColor: 'rgba(14,165,233,0.2)', badgeTextColor: '#38bdf8' } },
    ...myIncoming.filter(d => d.status === 'matched').map(d => ({
      lat: d.location.lat,
      lng: d.location.lng,
      emoji: '📦', size: 26,
      popup: { title: d.donorName, subtitle: `Waiting for pickup: ${d.itemName || d.foodName}`, badge: '⏳ Waiting', badgeColor: 'rgba(245,158,11,0.2)', badgeTextColor: '#fbbf24' },
    })),
    // Donor pickup point (for active deliveries)
    ...myIncoming.filter(d => d.status === 'picked_up').map(d => ({
      lat: d.location.lat,
      lng: d.location.lng,
      emoji: '📍', size: 22,
      popup: { title: 'Pickup Point', subtitle: d.donorName, badge: 'Picked Up', badgeColor: 'rgba(34, 197, 94, 0.2)', badgeTextColor: '#22c55e' },
    })),
  ];

  // Route from donor → mid-waypoints → NGO for the animated volunteer
  const ngoLat = user?.location?.lat || 28.61;
  const ngoLng = user?.location?.lng || 77.23;

  // Build animated volunteer marker for picked_up deliveries
  const activePickedUp = myIncoming.find(d => d.status === 'picked_up');
  const animatedVolunteer = useMemo(() => {
    if (!activePickedUp) return null;
    const donorLat = activePickedUp.location.lat;
    const donorLng = activePickedUp.location.lng;
    // Create a multi-waypoint route: Donor → intermediate stops → NGO
    const midLat1 = donorLat + (ngoLat - donorLat) * 0.3;
    const midLng1 = donorLng + (ngoLng - donorLng) * 0.3 + 0.004;
    const midLat2 = donorLat + (ngoLat - donorLat) * 0.6;
    const midLng2 = donorLng + (ngoLng - donorLng) * 0.6 - 0.003;
    const midLat3 = donorLat + (ngoLat - donorLat) * 0.85;
    const midLng3 = donorLng + (ngoLng - donorLng) * 0.85 + 0.002;

    return {
      emoji: '🚴',
      size: 34,
      speed: 500,
      route: [
        [donorLat, donorLng],
        [midLat1, midLng1],
        [midLat2, midLng2],
        [midLat3, midLng3],
        [ngoLat, ngoLng],
      ],
      popup: {
        title: activePickedUp.volunteerName || 'Volunteer',
        subtitle: `Delivering: ${activePickedUp.itemName || activePickedUp.foodName}`,
      },
    };
  }, [activePickedUp?.id, ngoLat, ngoLng]);

  // Dashed route line from donor to NGO
  const incomingRoutePoints = activePickedUp
    ? [
        [activePickedUp.location.lat, activePickedUp.location.lng],
        [ngoLat, ngoLng],
      ]
    : [];

  return (
    <div className="min-h-screen bg-surface-900 bg-mesh pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 page-enter">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{user?.avatar || '🏢'}</span> NGO Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">Welcome, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Package size={18} />} label="Available Nearby" value={availableDonations.length} color="primary" />
          <StatCard icon={<Heart size={18} />} label="Total Received" value={user?.stats?.received || myReceived.length} color="rose" />
          <StatCard icon={<Users size={18} />} label="People Fed" value={user?.stats?.peopleFed || 0} color="amber" />
          <StatCard icon={<MapPin size={18} />} label="Partners" value={user?.stats?.partnered || 0} color="sky" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 p-1 bg-surface-800/50 rounded-xl w-fit">
          <TabBtn active={activeTab === 'available'} onClick={() => setActiveTab('available')} count={filteredAvailable.length}>
            🍽️ Available
          </TabBtn>
          <TabBtn active={activeTab === 'incoming'} onClick={() => setActiveTab('incoming')} count={myIncoming.length}>
            🚴 Incoming
          </TabBtn>
          <TabBtn active={activeTab === 'received'} onClick={() => setActiveTab('received')} count={myReceived.length}>
            ✅ Received
          </TabBtn>
        </div>

        {/* ===== AVAILABLE TAB ===== */}
        {activeTab === 'available' && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search donations..."
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="input-field !w-auto !py-2 text-sm"
                >
                  <option value="all">📋 All Categories</option>
                  {DONATION_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                  ))}
                </select>

                {/* Food Type Filter — only show when category is food or all */}
                {(filterCategory === 'all' || filterCategory === 'food') && (
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="input-field !w-auto !py-2 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="veg">🌿 Veg Only</option>
                    <option value="non-veg">🍗 Non-Veg</option>
                  </select>
                )}

                <div className="flex border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-500 hover:text-white'}`}
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2.5 transition-colors ${viewMode === 'map' ? 'bg-primary-500/20 text-primary-400' : 'text-slate-500 hover:text-white'}`}
                  >
                    <MapIcon size={16} />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === 'map' && (
              <div className="glass-card p-4 mb-6">
                <MapView markers={availableMapMarkers} height="350px" />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAvailable.map(donation => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  actions={
                    <button
                      onClick={() => handleClaim(donation.id)}
                      className="btn-primary flex-1 !py-2.5 text-sm"
                    >
                      <Heart size={14} /> Claim This Donation
                    </button>
                  }
                />
              ))}
              {filteredAvailable.length === 0 && (
                <div className="col-span-2 glass-card p-12 text-center">
                  <span className="text-4xl block mb-3">🔍</span>
                  <p className="text-slate-400">No available donations nearby right now</p>
                  <p className="text-xs text-slate-600 mt-1">New donations are matched automatically — you'll be notified!</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== INCOMING TAB WITH LIVE VOLUNTEER TRACKING ===== */}
        {activeTab === 'incoming' && (
          <div>
            {/* Live Tracking Map */}
            {myIncoming.length > 0 && (
              <div className="glass-card p-4 mb-6">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
                  <span>Live Volunteer Tracking</span>
                </h3>
                <MapView
                  markers={incomingMapMarkers}
                  height="350px"
                  center={user?.location ? [user.location.lat, user.location.lng] : undefined}
                  showRoute={incomingRoutePoints.length > 0}
                  routePoints={incomingRoutePoints}
                  animatedMarker={animatedVolunteer}
                />
              </div>
            )}

            {/* Incoming Delivery Cards */}
            <div className="space-y-4">
              {myIncoming.map(donation => (
                <IncomingDeliveryCard key={donation.id} donation={donation} />
              ))}
              {myIncoming.length === 0 && (
                <div className="glass-card p-12 text-center">
                  <span className="text-4xl block mb-3">📭</span>
                  <p className="text-slate-400">No incoming deliveries</p>
                  <p className="text-xs text-slate-600 mt-1">Claim donations from the Available tab to get started</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== RECEIVED TAB ===== */}
        {activeTab === 'received' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myReceived.map(donation => (
              <DonationCard key={donation.id} donation={donation} showTimer={false} />
            ))}
            {myReceived.length === 0 && (
              <div className="col-span-2 glass-card p-12 text-center">
                <span className="text-4xl block mb-3">📦</span>
                <p className="text-slate-400">No received donations yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== INCOMING DELIVERY CARD WITH VOLUNTEER STATUS, MAP, TIMER ===== */
function IncomingDeliveryCard({ donation }) {
  const [eta, setEta] = useState(() => Math.floor(Math.random() * 15) + 5); // 5-20 min ETA
  const [seconds, setSeconds] = useState(0);
  const category = DONATION_CATEGORIES.find(c => c.id === donation.category) || DONATION_CATEGORIES[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev >= 59) {
          setEta(e => Math.max(0, e - 1));
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isPickedUp = donation.status === 'picked_up';
  const estimatedKm = (Math.random() * 4 + 1).toFixed(1);
  const displayName = donation.itemName || donation.foodName;

  return (
    <div className={`glass-card p-5 ${isPickedUp ? 'border-purple-500/20' : 'border-amber-500/20'}`}>
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left: Food Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{donation.donorAvatar || category.emoji}</span>
              <div>
                <h3 className="font-semibold text-white">{displayName}</h3>
                <p className="text-xs text-slate-500">{donation.donorName} • {donation.quantity}</p>
              </div>
            </div>
            <span className={isPickedUp ? 'badge-picked' : 'badge-matched'}>
              {isPickedUp ? '🚴 In Transit' : '⏳ Waiting Pickup'}
            </span>
          </div>

          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-500/10 text-[11px] text-primary-400 font-semibold border border-primary-500/20">
              {category.emoji} {category.label}
            </span>
          </div>

          {/* Expiry Timer — only for food */}
          {donation.category === 'food' && donation.expiresAt && (
            <div className="mb-3">
              <ExpiryTimer expiresAt={donation.expiresAt} />
            </div>
          )}

          {/* Volunteer Info (if picked up) */}
          {isPickedUp && donation.volunteerName && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚴</span>
                  <div>
                    <p className="text-sm font-medium text-white">{donation.volunteerName}</p>
                    <p className="text-[10px] text-slate-500">Volunteer Rider</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/20 text-purple-400 hover:bg-purple-500/25 transition-colors">
                  <Phone size={14} />
                </button>
              </div>

              {/* ETA & Distance */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-900/50 border border-white/5">
                  <Clock size={12} className="text-amber-400" />
                  <span className="text-sm font-mono font-bold text-amber-400">
                    {eta > 0 ? `${eta}:${String(60 - seconds).padStart(2, '0')}` : '00:00'}
                  </span>
                  <span className="text-[10px] text-slate-500">ETA</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-900/50 border border-white/5">
                  <Navigation size={12} className="text-primary-400" />
                  <span className="text-sm font-bold text-primary-400">{estimatedKm} km</span>
                  <span className="text-[10px] text-slate-500">away</span>
                </div>
              </div>
            </div>
          )}

          {/* Waiting for volunteer */}
          {!isPickedUp && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-amber-400 font-medium">Looking for a volunteer to pick up...</span>
              </div>
            </div>
          )}

          {/* Delivery Progress */}
          {isPickedUp && (
            <div className="flex items-center gap-2 mt-3">
              <ProgressStep label="Donor" icon="🍳" done />
              <ProgressLine done />
              <ProgressStep label="Picked Up" icon="📦" done />
              <ProgressLine active />
              <ProgressStep label="In Transit" icon="🚴" active />
              <ProgressLine />
              <ProgressStep label="Delivered" icon="🏢" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressStep({ label, icon, done, active }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${
        done ? 'bg-primary-500/20 border-primary-500 text-primary-400' :
        active ? 'bg-purple-500/20 border-purple-500 text-purple-400 animate-pulse' :
        'bg-surface-800 border-slate-600 text-slate-600'
      }`}>
        {icon}
      </div>
      <span className={`text-[8px] font-medium ${done ? 'text-primary-400' : active ? 'text-purple-400' : 'text-slate-600'}`}>{label}</span>
    </div>
  );
}

function ProgressLine({ done, active }) {
  return (
    <div className={`flex-1 h-0.5 rounded-full ${
      done ? 'bg-primary-500' : active ? 'bg-gradient-to-r from-primary-500 to-purple-500' : 'bg-slate-700'
    }`} />
  );
}

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
      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${active ? 'bg-primary-500/30' : 'bg-surface-700'}`}>
        {count}
      </span>
    </button>
  );
}
