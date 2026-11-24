import React, { useState } from 'react';
import { 
  Rocket, 
  Wallet, 
  Plus, 
  Bell, 
  TrendingUp, 
  Eye, 
  Zap, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserWallet, NotificationAlert } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { playSound } from '../utils/feedback';

interface HeaderProps {
  wallet: UserWallet;
  alerts: NotificationAlert[];
  onOpenNewBoost: () => void;
  onOpenCreditTopUp: () => void;
  onOpenOnboarding: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onAlertClick: (alert: NotificationAlert) => void;
  activeCount: number;
  totalImpressions: number;
  overallRoas: number;
  totalRevenue: number;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  alerts,
  onOpenNewBoost,
  onOpenCreditTopUp,
  onOpenOnboarding,
  soundEnabled,
  onToggleSound,
  onAlertClick,
  activeCount,
  totalImpressions,
  overallRoas,
  totalRevenue
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadAlerts = alerts.filter(a => !a.isRead);

  return (
    <header className="relative bg-white border-b border-slate-200/80 shadow-xs">
      {/* Subtle top amber glow accent line */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400 w-full" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Top utility row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-start gap-3">
            <div className="relative group shrink-0">
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 ring-4 ring-orange-500/10 transition-transform duration-300 group-hover:scale-105">
                <Rocket className="w-5 h-5 sm:w-7 sm:h-7 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white" title="Sistem Aktif" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Ürün Öne Çıkarma Yönetimi
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200/80 shadow-xs whitespace-nowrap">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" />
                  Performance Boost v2.4
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-none">
                Algoritma destekli çarpanlarla ürünlerinizin arama, kategori ve sepet sayfalarındaki görünürlüğünü katlayın, ROI odaklı ciro artışı yakalayın.
              </p>
            </div>
          </div>

          {/* Right Action Controls: Wallet, Alerts, Quick Actions */}
          <div className="flex items-center justify-between sm:justify-end flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
            
            {/* Wallet & Balance Pill */}
            <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/80 rounded-xl p-1.5 pr-2.5 sm:pr-3 shadow-xs flex-1 sm:flex-initial min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold shrink-0">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">Kullanılabilir Bakiye</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1 flex-wrap">
                  <span>{formatCurrency(wallet.balance)}</span>
                  {wallet.bonusCredits > 0 && (
                    <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 whitespace-nowrap" title="Bonus Kredi">
                      +{formatCurrency(wallet.bonusCredits)}
                    </span>
                  )}
                </div>
              </div>
              <button
                id="btn-header-topup"
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  onOpenCreditTopUp();
                }}
                className="ml-auto sm:ml-1 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-100/80 hover:bg-orange-200/80 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0 min-h-[32px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yükle</span>
              </button>
            </div>

            {/* Utility action buttons group */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Sound Toggle */}
              <button
                id="btn-header-sound-toggle"
                onClick={onToggleSound}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  soundEnabled 
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                    : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
                title={soundEnabled ? 'Ses Efektleri Açık' : 'Ses Efektleri Kapalı'}
                aria-label="Ses Efektleri Aç / Kapat"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-600" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Help / Guide */}
              <button
                id="btn-header-help"
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  onOpenOnboarding();
                }}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Kullanım Rehberi ve Tüyolar"
                aria-label="Rehber"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Notifications Dropdown Container */}
              <div className="relative">
                <button
                  id="btn-header-notifications"
                  onClick={() => {
                    if (soundEnabled) playSound('click');
                    setShowNotifications(!showNotifications);
                  }}
                  className="relative w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Bildirimler & Fırsatlar"
                  aria-label="Bildirimler"
                >
                  <Bell className="w-4 h-4" />
                  {unreadAlerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {unreadAlerts.length}
                    </span>
                  )}
                </button>

                {/* Notification Popover (Mobile Responsive Positioned) */}
                {showNotifications && (
                  <div className="fixed sm:absolute inset-x-3 sm:inset-x-auto right-auto sm:right-0 top-20 sm:top-auto sm:mt-2 w-auto sm:w-96 max-w-sm sm:max-w-none bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-orange-500" />
                        Kampanya Bildirimleri
                      </div>
                      <span className="text-xs text-slate-500">{alerts.length} Bildirim</span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-72 sm:max-h-80 overflow-y-auto my-1">
                      {alerts.map(alert => (
                        <div 
                          key={alert.id}
                          onClick={() => {
                            onAlertClick(alert);
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer flex gap-3 text-left ${
                            !alert.isRead ? 'bg-orange-50/50 hover:bg-orange-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {alert.type === 'upgrade' && <Sparkles className="w-4 h-4 text-orange-600" />}
                            {alert.type === 'warning' && <Zap className="w-4 h-4 text-amber-500" />}
                            {alert.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            {alert.type === 'info' && <Bell className="w-4 h-4 text-blue-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{alert.title}</div>
                            <div className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{alert.message}</div>
                            <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                              <span>{alert.timestamp}</span>
                              {alert.actionText && (
                                <span className="text-orange-600 font-semibold flex items-center gap-0.5">
                                  {alert.actionText} <ChevronRight className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-center">
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 px-4 cursor-pointer"
                      >
                        Kapat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Action: New Boost (Full width on very small screens, responsive on tablet/desktop) */}
            <button
              id="btn-header-new-boost"
              onClick={() => {
                if (soundEnabled) playSound('boost');
                onOpenNewBoost();
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[40px]"
            >
              <Zap className="w-4 h-4 fill-white shrink-0" />
              <span>Yeni Ürün Öne Çıkar</span>
            </button>
          </div>
        </div>

        {/* Hero Performance Summary Badges Row - 2 cols on mobile, 4 cols on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-5 pt-4 sm:pt-5 border-t border-slate-100">
          
          {/* Badge 1: Active Boosts */}
          <div className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 transition-colors">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Aktif Kampanyalar</div>
              <div className="text-sm sm:text-lg font-extrabold text-slate-900 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span>{activeCount} Ürün</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                  Canlı
                </span>
              </div>
            </div>
          </div>

          {/* Badge 2: Total Impressions */}
          <div className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 transition-colors">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Toplam Boost Gösterimi</div>
              <div className="text-sm sm:text-lg font-extrabold text-slate-900 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span>{formatNumber(totalImpressions)}</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-blue-600 bg-blue-100/60 px-1.5 py-0.2 rounded">
                  +38%
                </span>
              </div>
            </div>
          </div>

          {/* Badge 3: Average ROAS */}
          <div className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 transition-colors">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Ortalama ROAS Verimi</div>
              <div className="text-sm sm:text-lg font-extrabold text-slate-900 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span>{overallRoas.toFixed(1)}x Kat</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-orange-600 bg-orange-100/60 px-1.5 py-0.2 rounded">
                  Yüksek
                </span>
              </div>
            </div>
          </div>

          {/* Badge 4: Revenue Impact */}
          <div className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 transition-colors">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Oluşturulan Ciro</div>
              <div className="text-sm sm:text-lg font-extrabold text-slate-900 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span className="truncate">{formatCurrency(totalRevenue)}</span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-600 bg-purple-100/60 px-1.5 py-0.2 rounded whitespace-nowrap">
                  +₺240K
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
