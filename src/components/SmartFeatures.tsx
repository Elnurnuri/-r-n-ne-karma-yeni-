import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Zap, 
  Target, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  ShieldAlert, 
  Sliders, 
  Lightbulb,
  Award
} from 'lucide-react';
import { SmartRecommendation, OptimalTimingInsight } from '../types';
import { SMART_RECOMMENDATIONS, OPTIMAL_TIMING_INSIGHTS } from '../data/mockData';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { playSound } from '../utils/feedback';

interface SmartFeaturesProps {
  onApplyRecommendation: (rec: SmartRecommendation) => void;
}

export const SmartFeatures: React.FC<SmartFeaturesProps> = ({
  onApplyRecommendation
}) => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'timing' | 'simulator' | 'seasonal'>('recommendations');
  
  // What-if simulator state
  const [simBudget, setSimBudget] = useState<number>(1500);
  const [simMultiplier, setSimMultiplier] = useState<number>(4.0);

  const simEstimatedRevenue = Math.round(simBudget * (simMultiplier * 1.95 + 1.2));
  const simEstimatedOrders = Math.max(1, Math.round(simEstimatedRevenue / 1850));
  const simEstimatedRoas = Number((simEstimatedRevenue / simBudget).toFixed(1));

  return (
    <div id="smart-features-section" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 space-y-5 sm:space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
              Akıllı Boost & Strateji Optimizatörü
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Algoritma destekli ürün analizleri, en yüksek dönüşüm getiren zaman dilimleri ve kâr marjı optimizasyonları.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-[11px] sm:text-xs font-bold self-start md:self-center overflow-x-auto max-w-full">
          <button
            onClick={() => {
              playSound('toggle');
              setActiveTab('recommendations');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'recommendations' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>Ürün Fırsatları</span>
          </button>

          <button
            onClick={() => {
              playSound('toggle');
              setActiveTab('timing');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'timing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Optimal Zamanlar</span>
          </button>

          <button
            onClick={() => {
              playSound('toggle');
              setActiveTab('simulator');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'simulator' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Bütçe Simülatörü</span>
          </button>

          <button
            onClick={() => {
              playSound('toggle');
              setActiveTab('seasonal');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'seasonal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>Sezonluk Stratejiler</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Product Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 animate-in fade-in duration-200">
          {SMART_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden"
            >
              {/* Confidence badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-extrabold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {rec.type === 'high_margin' ? '🔥 Yüksek Kar Marjı' : rec.type === 'trending_category' ? '🚀 Trend Kategori' : '🎯 Düşük Rekabet'}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                  %{rec.confidenceScore} Güven
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={rec.productImage} alt={rec.productName} className="w-12 h-12 rounded-xl object-cover border shrink-0" />
                  <div className="overflow-hidden min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">{rec.productName}</h4>
                    <div className="text-[11px] text-orange-600 font-extrabold mt-0.5">
                      Önerilen: {rec.suggestedMultiplier}x ({rec.suggestedDurationDays} Gün)
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                  {rec.reason}
                </div>

                {/* Metric expectations */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                    <div className="text-[10px] text-slate-400 font-semibold">Tahmini Ciro</div>
                    <div className="font-extrabold text-slate-900 truncate">{formatCurrency(rec.estimatedRevenue)}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                    <div className="text-[10px] text-slate-400 font-semibold">Beklenen ROAS</div>
                    <div className="font-black text-emerald-600">{rec.estimatedRoas}x Kat</div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => {
                  playSound('boost');
                  onApplyRecommendation(rec);
                }}
                className="mt-4 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98 min-h-[42px]"
              >
                <span>Bu Stratejiyi Hemen Uygula</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Optimal Timing Insights */}
      {activeTab === 'timing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 animate-in fade-in duration-200">
          {OPTIMAL_TIMING_INSIGHTS.map((t, idx) => (
            <div key={idx} className="bg-slate-50/80 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {t.conversionMultiplier}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{t.dayName}</h4>
                <div className="text-xs font-bold text-orange-600 mt-0.5">Zirve Saatler: {t.peakHours}</div>
              </div>

              <p className="text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200/80 leading-relaxed">
                {t.recommendation}
              </p>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">Önerilen Yerleşimler:</div>
                <div className="flex flex-wrap gap-1">
                  {t.bestPlacements.map((plc, pidx) => (
                    <span key={pidx} className="text-[11px] font-semibold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                      {plc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: What-If Budget Simulator */}
      {activeTab === 'simulator' && (
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
            <div className="text-center">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Bütçe & Çarpan Artırma Tahmin Motoru</h3>
              <p className="text-xs text-slate-500 mt-1">Bütçenizi veya çarpanınızı artırdığınızda oluşacak tahmini ciro ve ROAS etkisini test edin.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
              {/* Slider 1: Budget */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Test Edilecek Bütçe:</span>
                  <span className="font-black text-orange-600 text-sm">{formatCurrency(simBudget)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={simBudget}
                  onChange={(e) => setSimBudget(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Slider 2: Multiplier */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Test Edilecek Çarpan:</span>
                  <span className="font-black text-amber-600 text-sm">{simMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="10.0"
                  step="0.5"
                  value={simMultiplier}
                  onChange={(e) => setSimMultiplier(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Simulated Outcome Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase">Tahmini Net Ciro</div>
                <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 truncate">{formatCurrency(simEstimatedRevenue)}</div>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase">Tahmini Ek Sipariş</div>
                <div className="text-lg sm:text-xl font-black text-orange-600 mt-1">~{simEstimatedOrders} Adet</div>
              </div>

              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase">Tahmini ROAS Verimi</div>
                <div className="text-lg sm:text-xl font-black text-emerald-600 mt-1">{simEstimatedRoas}x Kat</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Seasonal Strategies */}
      {activeTab === 'seasonal' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 animate-in fade-in duration-200">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-full uppercase">
                Yaklaşan Fırsat
              </span>
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <h4 className="text-sm font-extrabold text-white">Efsane Cuma & Kasım İndirimleri</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kasım ayı boyunca tüm kategorilerde arama hacmi 6 katına çıkar. Kampanya bütçelerinizi %50 önceden rezerve edin.
            </p>
            <div className="text-xs font-bold text-amber-400 pt-2 border-t border-slate-800">
              Önerilen Çarpan: 7.5x Turbo
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full uppercase">
                Sezon Sonu
              </span>
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Sezon Sonu Stok Eritme Boostu</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stokta kalan yazlık ve sezonluk ürünlerde %30 indirim etiketiyle birlikte 3.0x sepet önerisi boostu uygulayın.
            </p>
            <div className="text-xs font-bold text-purple-600 pt-2 border-t border-slate-200">
              Önerilen Çarpan: 3.5x
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full uppercase">
                Haftalık
              </span>
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Hafta Sonu Flaş Vitrin Boostu</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cuma 18:00 - Pazar 23:59 arası 48 saatlik flaş boost ile ana sayfa vitrini ve arama sonuçlarında tepe noktaya yerleşin.
            </p>
            <div className="text-xs font-bold text-emerald-600 pt-2 border-t border-slate-200">
              Önerilen Çarpan: 5.0x
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
