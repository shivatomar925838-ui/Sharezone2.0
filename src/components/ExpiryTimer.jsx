import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function ExpiryTimer({ expiresAt, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  function getTimeLeft(expiry) {
    const diff = new Date(expiry).getTime() - Date.now();
    if (diff <= 0) return { expired: true, hours: 0, minutes: 0, seconds: 0, percent: 0 };
    
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // Calculate percentage (assume max 6 hours)
    const maxTime = 6 * 60 * 60 * 1000;
    const percent = Math.min((diff / maxTime) * 100, 100);
    
    return { expired: false, hours, minutes, seconds, percent };
  }

  const getColor = () => {
    if (timeLeft.expired) return 'danger';
    if (timeLeft.hours === 0 && timeLeft.minutes < 30) return 'danger';
    if (timeLeft.hours === 0) return 'warning';
    return 'safe';
  };

  const color = getColor();
  const colorClasses = {
    safe: { text: 'text-primary-400', bg: 'bg-primary-500/20', border: 'border-primary-500/30', bar: 'bg-primary-500' },
    warning: { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', bar: 'bg-amber-500' },
    danger: { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/30', bar: 'bg-rose-500' },
  };
  const c = colorClasses[color];

  if (timeLeft.expired) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${c.bg} ${c.text} border ${c.border} text-xs font-semibold ${color === 'danger' ? 'animate-pulse' : ''}`}>
        <Clock size={12} />
        Expired
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${c.bg} ${c.text} border ${c.border} text-xs font-semibold ${color === 'danger' ? 'animate-pulse' : ''}`}>
        <Clock size={12} />
        {timeLeft.hours > 0 && `${timeLeft.hours}h `}{String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl ${c.bg} border ${c.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-1.5 ${c.text} text-xs font-semibold`}>
          <Clock size={12} />
          {color === 'danger' ? 'Expiring Soon!' : color === 'warning' ? 'Hurry Up!' : 'Time Remaining'}
        </div>
        <span className={`text-xs font-mono ${c.text} counter-value`}>
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-surface-900/50 overflow-hidden">
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-1000`}
          style={{ width: `${timeLeft.percent}%` }}
        />
      </div>
    </div>
  );
}
