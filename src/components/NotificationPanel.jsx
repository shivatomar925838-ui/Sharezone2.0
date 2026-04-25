import { useApp } from '../contexts/AppContext';
import { Bell, Check, CheckCheck, X } from 'lucide-react';

export default function NotificationPanel({ onClose }) {
  const { notifications, markNotifRead, markAllRead } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'new_donation': return '🍽️';
      case 'matched': return '🎯';
      case 'picked_up': return '🚴';
      case 'delivered': return '🎉';
      case 'expiry_warning': return '⚠️';
      default: return '🔔';
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="w-80 sm:w-96 glass-card animate-slide-down overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-primary-400" />
          <h3 className="font-semibold text-white text-sm">Notifications</h3>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary-500/20 text-primary-400">
              {notifications.filter(n => !n.read).length} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllRead}
            className="p-1.5 rounded-lg hover:bg-surface-700 transition-colors text-slate-500 hover:text-primary-400"
            title="Mark all read"
          >
            <CheckCheck size={14} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-700 transition-colors text-slate-500 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            No notifications yet
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotifRead(notif.id)}
              className={`px-4 py-3 border-b border-white/5 cursor-pointer transition-colors ${
                notif.read ? 'opacity-60' : 'bg-primary-500/5 hover:bg-primary-500/10'
              }`}
            >
              <div className="flex gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{getIcon(notif.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{notif.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.body}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{timeAgo(notif.createdAt)}</p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
