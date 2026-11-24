import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'boost';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 w-full max-w-md px-4 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto w-full bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200"
        >
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <div className="shrink-0 mt-0.5 sm:mt-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
              {toast.type === 'boost' && <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />}
            </div>

            <div className="min-w-0 flex-1">
              <h5 className="text-xs sm:text-sm font-black text-white truncate">{toast.title}</h5>
              {toast.message && <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 line-clamp-2">{toast.message}</p>}
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Kapat"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
