import React from 'react';
import { 
  X, 
  BarChart3, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Clock, 
  Layers, 
  ShoppingBag, 
  Calendar, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { BoostCampaign } from '../../types';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier, 
  getMultiplierLevel, 
  getStatusDetails, 
  getPlacementInfo 
} from '../../utils/formatters';

interface CampaignDetailsModalProps {
  campaign: BoostCampaign | null;
  onClose: () => void;
  onExtend: (campaign: BoostCampaign) => void;
}

export const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({
  campaign,
  onClose,
  onExtend
}) => {
  if (!campaign) return null;

  const statusMeta = getStatusDetails(campaign.status);
  const multiplierMeta = getMultiplierLevel(campaign.multiplier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img 
              src={campaign.product.imageUrl} 
              alt={campaign.product.name} 
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
                  {statusMeta.label}
                </span>
                <span className={`px-2 py-0.5 rounded-lg border text-xs font-black ${multiplierMeta.badgeBg} ${multiplierMeta.badgeBorder} ${multiplierMeta.badgeText}`}>
                  {formatMultiplier(campaign.multiplier)} Boost Gücü
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">{campaign.product.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Toplam Gösterim</div>
            <div className="text-xl font-black text-slate-900 mt-1">{formatNumber(campaign.impressions)}</div>
            <div className="text-[10px] text-blue-600 font-bold mt-0.5">+{campaign.organicLiftPercent}% Organik Artış</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Tıklama (CTR)</div>
            <div className="text-xl font-black text-slate-900 mt-1">{formatNumber(campaign.clicks)}</div>
            <div className="text-[10px] text-orange-600 font-bold mt-0.5">%{campaign.ctr} CTR Oranı</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Oluşturulan Ciro</div>
            <div className="text-xl font-black text-slate-900 mt-1">{formatCurrency(campaign.revenueGenerated)}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{campaign.conversions} Sipariş</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">ROAS Verimi</div>
            <div className="text-xl font-black text-emerald-600 mt-1">{campaign.roas.toFixed(1)}x Kat</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Harcama: {formatCurrency(campaign.spentBudget)}</div>
          </div>
        </div>

        {/* Placements & Settings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aktif Yerleşim Kanalları:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {campaign.placements.map(plc => {
              const info = getPlacementInfo(plc);
              return (
                <div key={plc} className="p-3 rounded-xl bg-orange-50/50 border border-orange-200 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{info.label}</div>
                    <div className="text-[10px] text-slate-500">{info.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Notes & Meta */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Başlangıç Tarihi:</span>
            <span className="font-bold text-slate-800">{new Date(campaign.startDate).toLocaleDateString('tr-TR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Bitiş Tarihi:</span>
            <span className="font-bold text-slate-800">{new Date(campaign.endDate).toLocaleDateString('tr-TR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Otomatik Yenileme:</span>
            <span className="font-bold text-slate-800">{campaign.autoRenew ? 'Açık' : 'Kapalı'}</span>
          </div>
          {campaign.notes && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500">Notlar:</span>
              <p className="text-slate-800 font-medium mt-0.5">{campaign.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
            Kapat
          </button>
          <button
            onClick={() => {
              onClose();
              onExtend(campaign);
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black shadow-md hover:from-orange-600 hover:to-amber-600 cursor-pointer"
          >
            Süreyi Uzat
          </button>
        </div>

      </div>
    </div>
  );
};
