import React, { useState } from 'react';
import { X, RefreshCw, Zap, ShieldCheck, Check, Calendar } from 'lucide-react';
import { BoostCampaign } from '../../types';
import { formatCurrency, formatMultiplier } from '../../utils/formatters';
import { playSound, triggerBoostCelebration } from '../../utils/feedback';

interface ExtendBoostModalProps {
  campaign: BoostCampaign | null;
  walletBalance: number;
  onClose: () => void;
  onConfirmExtend: (campaignId: string, additionalDays: number, additionalBudget: number) => void;
  onOpenCreditTopUp: () => void;
}

export const ExtendBoostModal: React.FC<ExtendBoostModalProps> = ({
  campaign,
  walletBalance,
  onClose,
  onConfirmExtend,
  onOpenCreditTopUp
}) => {
  const [selectedDays, setSelectedDays] = useState<number>(7);

  if (!campaign) return null;

  const cost = campaign.dailyBudget * selectedDays;
  const hasEnoughBalance = walletBalance >= cost;

  const handleConfirm = () => {
    if (!hasEnoughBalance) {
      playSound('warning');
      onOpenCreditTopUp();
      return;
    }
    triggerBoostCelebration();
    onConfirmExtend(campaign.id, selectedDays, cost);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Boost Süresini Uzat</h3>
              <p className="text-xs text-slate-500">Mevcut görünürlük çarpanınızı kesintisiz devam ettirin.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <img src={campaign.product.imageUrl} alt={campaign.product.name} className="w-12 h-12 rounded-xl object-cover border shrink-0" />
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-900 truncate">{campaign.product.name}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{formatMultiplier(campaign.multiplier)} Çarpan</span>
              <span>•</span>
              <span className="font-bold text-orange-600">{formatCurrency(campaign.dailyBudget)} / gün</span>
            </div>
          </div>
        </div>

        {/* Duration Selection Pills */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Uzatılacak Süreyi Seçin:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[3, 7, 14, 30].map(days => (
              <button
                key={days}
                type="button"
                onClick={() => {
                  playSound('click');
                  setSelectedDays(days);
                }}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedDays === days
                    ? 'bg-orange-50 border-orange-400 text-orange-950 font-black shadow-xs ring-2 ring-orange-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold'
                }`}
              >
                <div className="text-sm">+{days} Gün</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{formatCurrency(campaign.dailyBudget * days)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cost & Balance Breakdown */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>Uzatma Süresi:</span>
            <span className="font-bold text-slate-900">+{selectedDays} Gün</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Cüzdan Bakiyeniz:</span>
            <span className="font-bold text-slate-900">{formatCurrency(walletBalance)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold">
            <span className="text-slate-900">Toplam Uzatma Bedeli:</span>
            <span className="text-base font-black text-orange-600">{formatCurrency(cost)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-1/3 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Vazgeç
          </button>

          <button
            onClick={handleConfirm}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
              hasEnoughBalance
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/30'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
            }`}
          >
            {hasEnoughBalance ? (
              <>
                <Zap className="w-4 h-4" />
                <span>Onayla ve +{selectedDays} Gün Uzat ({formatCurrency(cost)})</span>
              </>
            ) : (
              <span>Bakiye Yükle & Uzat</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
