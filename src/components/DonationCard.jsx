import ExpiryTimer from './ExpiryTimer';
import { MapPin, User, Users, Clock, Utensils, Leaf, Drumstick, Sparkles, ThumbsUp, Package } from 'lucide-react';
import { DONATION_CATEGORIES, ITEM_CONDITIONS } from '../data/mockData';

const statusConfig = {
  posted: { label: 'Available', class: 'badge-posted', icon: '📦' },
  matched: { label: 'Matched', class: 'badge-matched', icon: '🤝' },
  picked_up: { label: 'In Transit', class: 'badge-picked', icon: '🚴' },
  delivered: { label: 'Delivered', class: 'badge-delivered', icon: '✅' },
  expired: { label: 'Expired', class: 'badge-expired', icon: '⏰' },
};

export default function DonationCard({ donation, actions, showTimer = true, compact = false }) {
  const status = statusConfig[donation.status] || statusConfig.posted;
  const category = DONATION_CATEGORIES.find(c => c.id === donation.category) || DONATION_CATEGORIES[0];
  const isFood = donation.category === 'food';
  const condition = !isFood && donation.condition
    ? ITEM_CONDITIONS.find(c => c.id === donation.condition)
    : null;

  const displayName = donation.itemName || donation.foodName;

  return (
    <div className="glass-card-hover p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">{donation.donorAvatar || category.emoji}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm sm:text-base truncate">{displayName}</h3>
            <p className="text-xs text-slate-500 truncate">{donation.donorName}</p>
          </div>
        </div>
        <span className={status.class}>{status.icon} {status.label}</span>
      </div>

      {!compact && (
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{donation.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {/* Category badge */}
        <CategoryPill emoji={category.emoji} text={category.label} color={category.color} />

        {/* Quantity */}
        <InfoPill icon={<Package size={10} />} text={donation.quantity} />

        {/* Food-specific: veg/non-veg */}
        {isFood && (
          <InfoPill 
            icon={donation.type === 'veg' ? <Leaf size={10} className="text-green-400" /> : <Drumstick size={10} className="text-amber-400" />} 
            text={donation.type === 'both' ? 'Veg & Non-Veg' : donation.type === 'veg' ? 'Vegetarian' : 'Non-Veg'} 
          />
        )}

        {/* Non-food: condition badge */}
        {condition && (
          <InfoPill icon={<Sparkles size={10} className="text-purple-400" />} text={`${condition.emoji} ${condition.label}`} />
        )}

        <InfoPill icon={<MapPin size={10} />} text={donation.location?.address?.split(',')[0] || 'Delhi'} />
      </div>

      {/* Matched Info */}
      {donation.matchedNgoName && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Users size={12} className="text-amber-400 flex-shrink-0" />
          <span className="text-xs text-amber-300 truncate">
            Matched: <span className="font-medium">{donation.matchedNgoName}</span>
          </span>
        </div>
      )}

      {/* Volunteer Info */}
      {donation.volunteerName && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <User size={12} className="text-purple-400 flex-shrink-0" />
          <span className="text-xs text-purple-300 truncate">
            Volunteer: <span className="font-medium">{donation.volunteerName}</span>
          </span>
        </div>
      )}

      {/* Timer — only for food items */}
      {showTimer && isFood && donation.expiresAt && donation.status !== 'delivered' && donation.status !== 'expired' && (
        <div className="mb-3">
          <ExpiryTimer expiresAt={donation.expiresAt} compact={compact} />
        </div>
      )}

      {/* Actions */}
      {actions && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
          {actions}
        </div>
      )}
    </div>
  );
}

function CategoryPill({ emoji, text, color }) {
  const colorMap = {
    primary: 'bg-primary-500/15 text-primary-400 border-primary-500/20',
    sky: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    slate: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border ${colorMap[color] || colorMap.primary}`}>
      {emoji} {text}
    </span>
  );
}

function InfoPill({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-900/80 text-[11px] text-slate-400 border border-white/5">
      {icon} {text}
    </span>
  );
}
