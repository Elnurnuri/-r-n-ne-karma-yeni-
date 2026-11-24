import React, { useState } from 'react';
import { X, Wallet, Sparkles, Check, Gift, ShieldCheck, Zap, CreditCard } from 'lucide-react';
import { PackageOffer, UserWallet } from '../../types';
import { PACKAGE_OFFERS } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { playSound, triggerBoostCelebration } from '../../utils/feedback';

interface CreditTopUpModalProps {
  wallet: UserWallet;
  onClose: () => void;
  onConfirmTopUp: (packageOffer: PackageOffer) => void;
}

export const CreditTopUpModal: React.FC<CreditTopUpModalProps> = ({
  wallet,
  onClose,
  onConfirmTopUp
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-pro-growth');
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedPkg = PACKAGE_OFFERS.find(p => p.id === selectedPackageId) || PACKAGE_OFFERS[1];

  const handlePurchase = () => {
    setIsProcessing(true);
    triggerBoostCelebration();
    setTimeout(() => {
      onConfirmTopUp(selectedPkg);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl lg:max-w-2xl w-full p-3.5 sm:p-5 md:p-6 shadow-2xl border border-slate-200 space-y-3.5 sm:space-y-4 my-auto max-h-[94vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold shadow-sm shadow-orange-500/20 shrink-0">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 truncate">Boost Kredi Paketleri</h3>
                <span className="text-[9px] sm:text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  +%40 Bonus
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                Mevcut Bakiyeniz: <strong className="text-slate-900">{formatCurrency(wallet.balance)}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Kapat"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 3 Tiered Packages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {PACKAGE_OFFERS.map(pkg => {
            const isSelected = pkg.id === selectedPackageId;
            const totalCredits = pkg.credits + pkg.bonusCredits;

            return (
              <div
                key={pkg.id}
                onClick={() => {
                  playSound('click');
                  setSelectedPackageId(pkg.id);
                }}
                className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-orange-50/90 to-amber-50/90 border-orange-500 shadow-sm ring-1.5 ring-orange-500/30'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 sm:-top-2.5 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.2 rounded-full shadow-xs whitespace-nowrap z-10">
                    Popüler
                  </span>
                )}

                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex sm:block items-center justify-between gap-1">
                    <h4 className="text-[11px] sm:text-xs font-extrabold text-slate-900">{pkg.name}</h4>
                    {pkg.tag && (
                      <span className="text-[8px] sm:text-[9px] font-bold text-orange-600 bg-orange-100/70 px-1 py-0.2 rounded sm:mt-0.5 inline-block whitespace-nowrap">
                        {pkg.tag}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-base sm:text-lg lg:text-xl font-black text-slate-900">
                      {formatCurrency(totalCredits)}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-emerald-600 font-bold">
                      +{formatCurrency(pkg.bonusCredits)} Hediye
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 line-through">
                      {formatCurrency(pkg.originalPrice)}
                    </div>
                  </div>

                  <ul className="space-y-0.5 sm:space-y-1 text-[9px] sm:text-[10px] text-slate-600 pt-1.5 border-t border-slate-200/80">
                    {pkg.features.map((f, fidx) => (
                      <li key={fidx} className="flex items-start gap-1">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">Ödenecek:</span>
                  <span className="text-[11px] sm:text-xs font-black text-orange-600">{formatCurrency(pkg.price)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Package Summary & Checkout Button */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] text-slate-400">Seçilen Paket:</div>
            <div className="text-xs sm:text-sm font-black text-white truncate">
              {selectedPkg.name} ({formatCurrency(selectedPkg.credits + selectedPkg.bonusCredits)} Kredi)
            </div>
            <div className="text-[9px] sm:text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="truncate">+{formatCurrency(selectedPkg.bonusCredits)} Bedava Bonus Dahil</span>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] sm:text-xs font-black px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 shrink-0 min-h-[38px]"
          >
            {isProcessing ? (
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Kredi Yükleniyor...</span>
              </div>
            ) : (
              <>
                <CreditCard className="w-3.5 h-3.5 shrink-0" />
                <span>Öde & Ekle ({formatCurrency(selectedPkg.price)})</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-[9px] sm:text-[10px] text-slate-400 text-center flex-wrap">
          <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
          <span>256-Bit SSL Güvenli Ödeme • Anında Hesaba Yansır</span>
        </div>

      </div>
    </div>
  );
};
