import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import DonationCard from '../components/DonationCard';
import ImageUploader from '../components/ImageUploader';
import MapView from '../components/MapView';
import CertificateGenerator from '../components/CertificateGenerator';
import { DONATION_CATEGORIES, ITEM_CONDITIONS } from '../data/mockData';
import { Plus, X, Package, Clock, CheckCircle, TrendingUp, MapPin, Utensils, Leaf, Drumstick, Shirt, ShoppingCart, BookOpen, Gift } from 'lucide-react';

export default function DonorDashboard() {
  const { user } = useAuth();
  const { donations, addDonation } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const myDonations = donations.filter(d => d.donorId === user?.id);
  const activeDonations = myDonations.filter(d => ['posted', 'matched', 'picked_up'].includes(d.status));
  const completedDonations = myDonations.filter(d => d.status === 'delivered');

  const filteredDonations = (activeTab === 'active' ? activeDonations : completedDonations).filter(d =>
    categoryFilter === 'all' || d.category === categoryFilter
  );

  const mapMarkers = activeDonations.map(d => ({
    lat: d.location.lat,
    lng: d.location.lng,
    emoji: d.status === 'posted' ? '📦' : d.status === 'matched' ? '🤝' : '🚴',
    popup: { title: d.itemName || d.foodName, subtitle: d.quantity, badge: d.status.replace('_', ' '), badgeColor: 'rgba(34, 197, 94, 0.2)', badgeTextColor: '#22c55e' },
  }));

  return (
    <div className="min-h-screen bg-surface-900 bg-mesh pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 page-enter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">{user?.avatar}</span> Donor Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={18} /> Post Donation
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Package size={18} />} label="Total Donated" value={user?.stats?.donated || activeDonations.length} color="primary" />
          <StatCard icon={<Utensils size={18} />} label="Meals Served" value={user?.stats?.mealsServed || 0} color="amber" />
          <StatCard icon={<TrendingUp size={18} />} label="Items Donated" value={user?.stats?.itemsDonated || 0} color="sky" />
          <StatCard icon={<CheckCircle size={18} />} label="Active Now" value={activeDonations.length} color="purple" />
        </div>

        {/* Map */}
        <div className="glass-card p-4 mb-8">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-primary-400" /> Your Active Donations
          </h3>
          <MapView markers={mapMarkers} height="250px" center={user?.location ? [user.location.lat, user.location.lng] : undefined} />
        </div>

        {/* Tabs + Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 p-1 bg-surface-800/50 rounded-xl w-fit">
            <TabButton active={activeTab === 'active'} onClick={() => setActiveTab('active')} count={activeDonations.length}>
              Active
            </TabButton>
            <TabButton active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} count={completedDonations.length}>
              Completed
            </TabButton>
          </div>
          <div className="flex gap-2 flex-wrap">
            <CategoryFilterPill active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')} emoji="📋" label="All" />
            {DONATION_CATEGORIES.slice(0, 5).map(cat => (
              <CategoryFilterPill key={cat.id} active={categoryFilter === cat.id} onClick={() => setCategoryFilter(cat.id)} emoji={cat.emoji} label={cat.label} />
            ))}
          </div>
        </div>

        {/* Donation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDonations.map(donation => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
          {filteredDonations.length === 0 && (
            <div className="col-span-2 glass-card p-12 text-center">
              <span className="text-4xl block mb-3">📦</span>
              <p className="text-slate-400">No {activeTab} donations {categoryFilter !== 'all' ? `in ${DONATION_CATEGORIES.find(c => c.id === categoryFilter)?.label || categoryFilter}` : ''} yet</p>
              {activeTab === 'active' && (
                <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
                  <Plus size={16} /> Post Your First Donation
                </button>
              )}
            </div>
          )}
        </div>

        {/* Post Donation Modal */}
        {showForm && (
          <PostDonationModal
            user={user}
            onPost={(data) => { addDonation(data); setShowForm(false); }}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
}

function CategoryFilterPill({ active, onClick, emoji, label }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
      active ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-surface-800/50 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/15'
    }`}>
      <span>{emoji}</span> {label}
    </button>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    primary: 'text-primary-400 bg-primary-500/15 border-primary-500/20',
    amber: 'text-amber-400 bg-amber-500/15 border-amber-500/20',
    sky: 'text-sky-400 bg-sky-500/15 border-sky-500/20',
    purple: 'text-purple-400 bg-purple-500/15 border-purple-500/20',
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

function TabButton({ active, onClick, children, count }) {
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

function PostDonationModal({ user, onPost, onClose }) {
  const [category, setCategory] = useState('food');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('veg');
  const [condition, setCondition] = useState('gently_used');
  const [expiryHours, setExpiryHours] = useState(3);
  const [image, setImage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [postedData, setPostedData] = useState(null);

  const isFood = category === 'food';
  const selectedCategory = DONATION_CATEGORIES.find(c => c.id === category);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      donorId: user.id,
      donorName: user.name,
      donorAvatar: user.avatar,
      foodName: itemName,
      itemName,
      description,
      quantity: isFood ? quantity + ' servings' : quantity + ' items',
      category,
      type: isFood ? type : null,
      condition: isFood ? null : condition,
      photoUrl: image,
      location: user.location,
      expiresAt: isFood ? new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString() : null,
    };
    setPostedData(data);
    onPost(data);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Plus size={18} className="text-primary-400" /> Post Donation
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-700 transition-colors text-slate-500">
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center animate-scale-in flex flex-col items-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}>
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Donation Posted! 🎉</h3>
            <p className="text-sm text-slate-400 mb-6">Your generous donation has been published and NGOs will be notified instantly.</p>
            
            <div className="w-full bg-surface-900/50 p-4 rounded-xl border border-white/5 mb-6">
              <CertificateGenerator 
                donorName={user.name}
                cause={selectedCategory?.label || 'General Donation'}
                amount={postedData?.quantity || 'a generous amount'}
                isFood={isFood}
                date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
            </div>

            <button onClick={onClose} className="text-sm text-slate-500 hover:text-white transition-colors">
              Close Window
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">What are you donating? *</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {DONATION_CATEGORIES.filter(c => c.id !== 'other').map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all border ${
                    category === cat.id
                      ? 'bg-primary-500/15 border-primary-500/40 text-primary-400 shadow-lg shadow-primary-500/10'
                      : 'bg-surface-900/50 border-white/5 text-slate-500 hover:border-white/15 hover:text-slate-300'
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              {isFood ? 'Food Name *' : `${selectedCategory?.label || 'Item'} Name *`}
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="input-field"
              placeholder={
                isFood ? 'e.g., Paneer Butter Masala + Naan'
                : category === 'clothes' ? 'e.g., Winter Jackets & Sweaters'
                : category === 'ration' ? 'e.g., Monthly Ration Kit'
                : category === 'books' ? 'e.g., NCERT Textbooks Class 6-12'
                : 'e.g., School Bags & Water Bottles'
              }
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none h-20"
              placeholder={isFood ? 'Describe the food, how it was prepared, etc.' : 'Describe the items, sizes, condition, etc.'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                {isFood ? 'Quantity (servings) *' : 'Quantity (items) *'}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field"
                placeholder={isFood ? '25' : '10'}
                min="1"
                required
              />
            </div>

            {/* Food: Veg/Non-veg | Non-food: Condition */}
            {isFood ? (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('veg')}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-all border ${
                      type === 'veg' ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-surface-900/50 border-white/5 text-slate-500'
                    }`}
                  >
                    <Leaf size={14} /> Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('non-veg')}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-all border ${
                      type === 'non-veg' ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-surface-900/50 border-white/5 text-slate-500'
                    }`}
                  >
                    <Drumstick size={14} /> Non-Veg
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="input-field"
                >
                  {ITEM_CONDITIONS.map(c => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Freshness Window — only for food */}
          {isFood && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Freshness Window</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 6].map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setExpiryHours(h)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      expiryHours === h ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-surface-900/50 border-white/5 text-slate-500'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">📸 Photo</label>
            <ImageUploader onImageSelect={setImage} />
          </div>

          {/* Location */}
          <div className="px-3 py-2 rounded-lg bg-surface-900/50 border border-white/5 flex items-center gap-2">
            <MapPin size={14} className="text-primary-400 flex-shrink-0" />
            <span className="text-xs text-slate-400 truncate">📍 {user?.location?.address || 'Location auto-detected'}</span>
          </div>

          <button type="submit" className="btn-primary w-full !py-3.5">
            <Package size={18} /> Post {selectedCategory?.label || ''} Donation
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
