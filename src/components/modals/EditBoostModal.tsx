import React, { useState } from 'react';
import { X, Edit3, Save, Check } from 'lucide-react';
import { BoostCampaign } from '../../types';
import { formatCurrency, formatMultiplier } from '../../utils/formatters';
import { playSound } from '../../utils/feedback';

interface EditBoostModalProps {
  campaign: BoostCampaign | null;
  onClose: () => void;
  onSaveEdit: (campaignId: string, multiplier: number, dailyBudget: number, autoRenew: boolean, notes: string) => void;
}

export const EditBoostModal: React.FC<EditBoostModalProps> = ({
  campaign,
  onClose,
  onSaveEdit
}) => {
  const [multiplier, setMultiplier] = useState<number>(campaign ? campaign.multiplier : 3.5);
  const [dailyBudget, setDailyBudget] = useState<number>(campaign ? campaign.dailyBudget : 300);
  const [autoRenew, setAutoRenew] = useState<boolean>(campaign ? campaign.autoRenew : true);
  const [notes, setNotes] = useState<string>(campaign ? (campaign.notes || '') : '');

  if (!campaign) return null;

  const handleSave = () => {
    playSound('success');
    onSaveEdit(campaign.id, multiplier, dailyBudget, autoRenew, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Kampanyayı Düzenle</h3>
              <p className="text-xs text-slate-500">Boost gücünü ve günlük bütçenizi anlık güncelleyin.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
          <img src={campaign.product.imageUrl} alt={campaign.product.name} className="w-12 h-12 rounded-xl object-cover border shrink-0" />
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-slate-900 truncate">{campaign.product.name}</div>
            <div className="text-[11px] text-slate-500 font-mono">{campaign.product.sku}</div>
          </div>
        </div>

        {/* Multiplier */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <span>Boost Çarpanı (Multiplier)</span>
            <span className="text-orange-600 font-black">{multiplier.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.1"
            value={multiplier}
            onChange={(e) => setMultiplier(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Daily Budget */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Günlük Boost Bütçesi (TL)</label>
          <input
            type="number"
            min="50"
            step="50"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Math.max(50, parseFloat(e.target.value) || 50))}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Kampanya Notu</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Kampanya hedefi..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
          />
        </div>

        {/* Auto renew toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <span className="font-bold text-slate-800">Otomatik Yenileme (Auto-Renew)</span>
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded cursor-pointer"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={onClose} className="w-1/3 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
            İptal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Değişiklikleri Kaydet</span>
          </button>
        </div>

      </div>
    </div>
  );
};
