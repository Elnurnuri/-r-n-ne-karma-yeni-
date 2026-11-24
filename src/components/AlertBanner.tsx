import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  X, 
  ArrowRight, 
  Zap, 
  Gift,
  Clock
} from 'lucide-react';
import { NotificationAlert } from '../types';
import { playSound } from '../utils/feedback';

interface AlertBannerProps {
  alerts: NotificationAlert[];
  onDismiss: (id: string) => void;
  onActionClick: (alert: NotificationAlert) => void;
  onOpenCreditTopUp: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  alerts,
  onDismiss,
  onActionClick,
  onOpenCreditTopUp
}) => {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-4 sm:mb-6">
      {alerts.map((alert) => {
        const isUpgrade = alert.type === 'upgrade';
        const isWarning = alert.type === 'warning';
        const isSuccess = alert.type === 'success';

        return (
          <div
            key={alert.id}
            id={`alert-banner-${alert.id}`}
            className={`relative rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 transition-all duration-200 border shadow-xs ${
              isUpgrade
                ? 'bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border-orange-300 text-orange-950'
                : isWarning
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : isSuccess
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : 'bg-blue-50/90 border-blue-300 text-blue-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pr-7 sm:pr-9">
              
              {/* Left icon and message */}
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isUpgrade
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white'
                    : isWarning
                    ? 'bg-amber-500 text-white'
                    : isSuccess
                    ? 'bg-emerald-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {isUpgrade && <Gift className="w-4 h-4 animate-pulse" />}
                  {isWarning && <Clock className="w-4 h-4 animate-bounce" />}
                  {isSuccess && <CheckCircle2 className="w-4 h-4" />}
                  {!isUpgrade && !isWarning && !isSuccess && <Info className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs sm:text-sm tracking-tight">{alert.title}</span>
                    <span className="text-[10px] sm:text-[11px] opacity-75 font-medium">({alert.timestamp})</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-700 mt-0.5 max-w-3xl leading-normal">
                    {alert.message}
                  </p>
                </div>
              </div>

              {/* Right action button */}
              {alert.actionText && (
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center pl-9.5 sm:pl-0">
                  <button
                    onClick={() => {
                      playSound('click');
                      onActionClick(alert);
                    }}
                    className={`text-[11px] sm:text-xs font-bold px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98 ${
                      isUpgrade
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                        : isWarning
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : isSuccess
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <span>{alert.actionText}</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  </button>
                </div>
              )}

            </div>

            {/* Dismiss Close Button */}
            {alert.dismissible && (
              <button
                onClick={() => {
                  playSound('click');
                  onDismiss(alert.id);
                }}
                className="absolute top-2 right-2 z-20 text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-black/5 transition-colors cursor-pointer flex items-center justify-center"
                title="Kapat"
                aria-label="Bildirimi Kapat"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
