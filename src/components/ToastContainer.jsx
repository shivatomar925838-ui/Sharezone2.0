import { useApp } from '../contexts/AppContext';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-primary-400" />;
      case 'error': return <AlertTriangle size={16} className="text-rose-400" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-400" />;
      default: return <Info size={16} className="text-sky-400" />;
    }
  };

  const getBorder = (type) => {
    switch (type) {
      case 'success': return 'border-primary-500/30';
      case 'error': return 'border-rose-500/30';
      case 'warning': return 'border-amber-500/30';
      default: return 'border-sky-500/30';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-enter glass-card px-4 py-3 flex items-start gap-3 border ${getBorder(toast.type)} shadow-2xl`}
        >
          <span className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</span>
          <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-surface-700 transition-colors text-slate-500"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
