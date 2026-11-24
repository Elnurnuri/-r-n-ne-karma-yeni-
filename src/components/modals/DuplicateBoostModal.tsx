import React, { useState } from 'react';
import { X, Copy, Rocket, Check, ChevronDown } from 'lucide-react';
import { BoostCampaign, Product } from '../../types';
import { formatCurrency, formatMultiplier } from '../../utils/formatters';
import { playSound, triggerBoostCelebration } from '../../utils/feedback';

interface DuplicateBoostModalProps {
  campaign: BoostCampaign | null;
  products: Product[];
  walletBalance: number;
  onClose: () => void;
  onConfirmDuplicate: (targetProductId: string, multiplier: number, durationDays: number, dailyBudget: number) => void;
}

export const DuplicateBoostModal: React.FC<DuplicateBoostModalProps> = ({
  campaign,
  products,
  walletBalance,
  onClose,
  onConfirmDuplicate
}) => {
  const [targetProductId, setTargetProductId] = useState<string>(
    products.length > 0 ? products[0].id : ''
  );
  const [multiplier, setMultiplier] = useState<number>(campaign ? campaign.multiplier : 3.5);
  const [durationDays, setDurationDays] = useState<number>(campaign ? campaign.durationDays : 7);
  const [dailyBudget, setDailyBudget] = useState<number>(campaign ? campaign.dailyBudget : 300);

  if (!campaign) return null;

  const targetProduct = products.find(p => p.id === targetProductId) || products[0];
  const totalCost = dailyBudget * durationDays;
  const hasEnough = walletBalance >= totalCost;

  const handleConfirm = () => {
    triggerBoostCelebration();
    onConfirmDuplicate(targetProductId, multiplier, durationDays, dailyBudget);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Kampanyayı Çoğalt</h3>
              <p className="text-xs text-slate-500">Aynı ayarları başka bir ürüne hızlıca uygulayın.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Product Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Uygulanacak Hedef Ürün:</label>
          <select
            value={targetProductId}
            onChange={(e) => setTargetProductId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-orange-500"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatCurrency(p.price)} - Stok: {p.stock})
              </option>
            ))}
          </select>
        </div>

        {/* Multiplier & Duration settings */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Boost Çarpanı</label>
            <input
              type="number"
              min="1.0"
              max="10.0"
              step="0.5"
              value={multiplier}
              onChange={(e) => setMultiplier(parseFloat(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Süre (Gün)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
            />
          </div>
        </div>

        {/* Financial */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-600">Günlük Bütçe:</span>
            <span className="font-bold text-slate-900">{formatCurrency(dailyBudget)}</span>
          </div>
          <div className="flex justify-between font-bold pt-1 border-t border-slate-200">
            <span className="text-slate-900">Toplam Kampanya Maliyeti:</span>
            <span className="text-orange-600 text-sm font-black">{formatCurrency(totalCost)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={onClose} className="w-1/3 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
            İptal
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Kopyala ve Başlat ({formatCurrency(totalCost)})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
