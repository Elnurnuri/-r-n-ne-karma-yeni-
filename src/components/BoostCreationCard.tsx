import React, { useState, useMemo } from 'react';
import { 
  Rocket, 
  Search, 
  Sparkles, 
  Calendar, 
  Zap, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Layers, 
  Check, 
  AlertCircle, 
  ChevronDown, 
  Info,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  Sliders
} from 'lucide-react';
import { Product, BoostPlacement, BoostPreset } from '../types';
import { formatCurrency, formatNumber, getMultiplierLevel } from '../utils/formatters';
import { playSound, triggerBoostCelebration } from '../utils/feedback';

interface BoostCreationCardProps {
  products: Product[];
  walletBalance: number;
  onLaunchBoost: (newCampaign: {
    productId: string;
    multiplier: number;
    durationDays: number;
    dailyBudget: number;
    placements: BoostPlacement[];
    autoRenew: boolean;
    notes?: string;
  }) => void;
  onOpenCreditTopUp: () => void;
  preselectedProductId?: string | null;
}

const PRESET_DURATIONS: BoostPreset[] = [
  { days: 1, label: '24 Saat (Flaş Boost)' },
  { days: 3, label: '3 Gün (Hafta Sonu)', popular: false },
  { days: 7, label: '7 Gün (Önerilen)', popular: true, discountPercent: 10 },
  { days: 14, label: '14 Gün (Maksimum Verim)', discountPercent: 15 },
  { days: 30, label: '30 Gün (Sürekli Görünürlük)', discountPercent: 20 },
];

const PLACEMENT_OPTIONS: { id: BoostPlacement; title: string; desc: string; icon: string; impact: string }[] = [
  { 
    id: 'search_top', 
    title: 'Arama Sonuçları 1. Sıra', 
    desc: 'Anahtar kelime aramalarında ilk sırada çıkın', 
    icon: 'Search', 
    impact: 'En Yüksek Tıklama' 
  },
  { 
    id: 'category_page', 
    title: 'Kategori Sayfaları Vitrini', 
    desc: 'Kategori içi filtreleme ve listelemelerde tepe nokta', 
    icon: 'Layers', 
    impact: '+45% Keşif' 
  },
  { 
    id: 'similar_products', 
    title: 'Benzer & Rakip Ürün Sayfaları', 
    desc: 'Rakip ürünleri inceleyen müşterilere çapraz teklif', 
    icon: 'Sparkles', 
    impact: 'Yüksek Dönüşüm' 
  },
  { 
    id: 'homepage_showcase', 
    title: 'Ana Sayfa Vitrin Öne Çıkanlar', 
    desc: 'Geniş kitleli vitrin & trend ürünler alanı', 
    icon: 'Rocket', 
    impact: 'Maksimum Erişim' 
  },
  { 
    id: 'cart_recommends', 
    title: 'Sepet & Ödeme Tamamlayıcı', 
    desc: 'Sepete ürün ekleyen kullanıcılara son adım tavsiyesi', 
    icon: 'ShoppingBag', 
    impact: '+28% Sepet Boyutu' 
  },
];

export const BoostCreationCard: React.FC<BoostCreationCardProps> = ({
  products,
  walletBalance,
  onLaunchBoost,
  onOpenCreditTopUp,
  preselectedProductId
}) => {
  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(
    preselectedProductId || (products.length > 0 ? products[0].id : '')
  );
  const [productSearch, setProductSearch] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  
  const [multiplier, setMultiplier] = useState<number>(3.5);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [dailyBudget, setDailyBudget] = useState<number>(350);
  const [selectedPlacements, setSelectedPlacements] = useState<BoostPlacement[]>([
    'search_top',
    'category_page',
    'similar_products'
  ]);
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [campaignNotes, setCampaignNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected Product object
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Filtered products for dropdown search
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    const q = productSearch.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  // Calculations
  const totalBudget = useMemo(() => dailyBudget * durationDays, [dailyBudget, durationDays]);
  const hasEnoughBalance = walletBalance >= totalBudget;
  const balanceDeficit = Math.max(0, totalBudget - walletBalance);

  // Real-time Estimated Performance Metrics based on product price, multiplier, placements and budget
  const estimates = useMemo(() => {
    if (!selectedProduct) {
      return {
        impressionsMin: 0,
        impressionsMax: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        revenue: 0,
        roas: 0
      };
    }

    const baseImpressionPerTL = 45;
    const multiplierBoostEffect = Math.pow(multiplier, 0.85);
    const placementFactor = 1 + (selectedPlacements.length * 0.12);

    const estImpressions = Math.round(totalBudget * baseImpressionPerTL * multiplierBoostEffect * placementFactor);
    const minImpressions = Math.round(estImpressions * 0.85);
    const maxImpressions = Math.round(estImpressions * 1.25);

    // CTR generally between 4.2% and 7.5% depending on multiplier
    const ctr = Math.min(8.5, 3.8 + (multiplier * 0.45));
    const estClicks = Math.round(estImpressions * (ctr / 100));

    // Conversion rate around 3% to 6%
    const conversionRate = Math.min(6.5, 2.5 + (selectedProduct.marginPercent * 0.04));
    const estOrders = Math.max(1, Math.round(estClicks * (conversionRate / 100)));

    const estRevenue = Math.round(estOrders * selectedProduct.price);
    const estRoas = totalBudget > 0 ? Number((estRevenue / totalBudget).toFixed(1)) : 0;

    return {
      impressionsMin: minImpressions,
      impressionsMax: maxImpressions,
      clicks: estClicks,
      ctr: ctr,
      conversions: estOrders,
      revenue: estRevenue,
      roas: estRoas
    };
  }, [selectedProduct, multiplier, durationDays, dailyBudget, selectedPlacements, totalBudget]);

  const multiplierMeta = getMultiplierLevel(multiplier);

  // Toggle Placement
  const togglePlacement = (placement: BoostPlacement) => {
    playSound('toggle');
    if (selectedPlacements.includes(placement)) {
      if (selectedPlacements.length === 1) return; // keep at least 1
      setSelectedPlacements(selectedPlacements.filter(p => p !== placement));
    } else {
      setSelectedPlacements([...selectedPlacements, placement]);
    }
  };

  // 1-Click AI Recommendation Apply
  const applySmartPreset = () => {
    playSound('boost');
    setMultiplier(4.2);
    setDurationDays(7);
    setDailyBudget(450);
    setSelectedPlacements(['search_top', 'category_page', 'similar_products', 'homepage_showcase']);
    setAutoRenew(true);
  };

  // Submit
  const handleLaunch = () => {
    if (!selectedProduct) return;
    if (!hasEnoughBalance) {
      playSound('warning');
      onOpenCreditTopUp();
      return;
    }

    setIsSubmitting(true);
    triggerBoostCelebration();

    setTimeout(() => {
      onLaunchBoost({
        productId: selectedProduct.id,
        multiplier,
        durationDays,
        dailyBudget,
        placements: selectedPlacements,
        autoRenew,
        notes: campaignNotes || `${selectedProduct.name} ${multiplier}x Boost Kampanyası`
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div id="boost-creation-card" className="bg-white rounded-3xl border border-slate-200/90 shadow-lg shadow-slate-200/50 overflow-hidden mb-10 transition-all">
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 p-4 sm:p-6 text-white relative overflow-hidden">
        {/* Decorative background glow rings */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-black/10 blur-xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner shrink-0">
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-white">
                  Yeni Ürün Öne Çıkarıcı (Boost Builder)
                </h2>
                <span className="text-[10px] sm:text-[11px] font-bold bg-white text-orange-600 px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider whitespace-nowrap">
                  Akıllı Simülatör
                </span>
              </div>
              <p className="text-xs sm:text-sm text-orange-100 mt-0.5 leading-snug">
                Ürününüzü seçin, boost çarpanınızı belirleyin ve beklenen satış artışını anında simüle edin.
              </p>
            </div>
          </div>

          {/* AI Optimizer Quick Preset button */}
          <button
            onClick={applySmartPreset}
            className="w-full md:w-auto bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/30 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-102 min-h-[40px]"
            title="Algoritmanın önerdiği ideal kombinasyonu tek tıkla uygula"
          >
            <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
            <span>AI Önerilen Ayarları Doldur (4.2x)</span>
          </button>
        </div>
      </div>

      {/* Form & Simulator 2-Column Grid */}
      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          
          {/* Step 1: Product Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-black">1</span>
                Öne Çıkarılacak Ürünü Seçin
              </label>
              <span className="text-[11px] sm:text-xs text-slate-500">{products.length} Aktif Ürün</span>
            </div>

            {/* Custom Searchable Product Selector Box */}
            <div className="relative">
              <div
                onClick={() => {
                  playSound('toggle');
                  setIsProductDropdownOpen(!isProductDropdownOpen);
                }}
                className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-300/80 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors shadow-xs"
              >
                {selectedProduct ? (
                  <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0">
                    <img 
                      src={selectedProduct.imageUrl} 
                      alt={selectedProduct.name} 
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0" 
                    />
                    <div className="overflow-hidden text-left min-w-0">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{selectedProduct.name}</div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 mt-0.5 flex-wrap">
                        <span className="font-mono bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded text-[10px] sm:text-[11px] font-semibold">
                          {selectedProduct.sku}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-orange-600">{formatCurrency(selectedProduct.price)}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">Stok: {selectedProduct.stock}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">Ürün seçin...</span>
                )}
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {isProductDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 sm:p-3 z-40 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-hidden flex flex-col">
                  <div className="relative mb-2 shrink-0">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ürün adı, SKU veya kategori ara..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="overflow-y-auto space-y-1 divide-y divide-slate-100 flex-1">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          playSound('click');
                          setSelectedProductId(p.id);
                          setIsProductDropdownOpen(false);
                        }}
                        className={`p-2 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer transition-colors ${
                          p.id === selectedProductId ? 'bg-orange-50/80 border border-orange-200' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                          <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                          <div className="overflow-hidden text-left min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{p.name}</div>
                            <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                              <span>{p.category}</span>
                              <span>•</span>
                              <span className="font-bold text-slate-800">{formatCurrency(p.price)}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-semibold">% {p.marginPercent} Marj</span>
                            </div>
                          </div>
                        </div>

                        {p.id === selectedProductId && (
                          <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Multiplier Slider & Numeric Combination */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
              <div>
                <label className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-black">2</span>
                  Boost Multiplier (Görünürlük Çarpanı)
                </label>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Arama ve vitrin algoritmalarında ürününüzün kaç kat öne çıkacağını belirler.
                </p>
              </div>

              {/* Visual Multiplier Badge */}
              <div className={`self-start sm:self-auto px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs ${multiplierMeta.badgeBg} ${multiplierMeta.badgeBorder} ${multiplierMeta.badgeText}`}>
                <Zap className="w-4 h-4" />
                <span>{multiplier.toFixed(1)}x Çarpan</span>
              </div>
            </div>

            {/* Slider & Input Combined */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <input
                  type="range"
                  min="1.0"
                  max="10.0"
                  step="0.1"
                  value={multiplier}
                  onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none"
                />
                <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 shadow-inner shrink-0">
                  <input
                    type="number"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Math.min(10, Math.max(1, parseFloat(e.target.value) || 1)))}
                    className="w-12 text-sm font-extrabold text-slate-900 text-center focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">x</span>
                </div>
              </div>

              {/* Power Gauge Bar */}
              <div className="space-y-1.5">
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      multiplier < 2.5 
                        ? 'bg-amber-400' 
                        : multiplier < 4.5 
                        ? 'bg-orange-500' 
                        : multiplier < 7.5 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500' 
                        : 'bg-gradient-to-r from-orange-600 via-amber-500 to-red-600'
                    }`}
                    style={{ width: `${(multiplier / 10) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-slate-500">
                  <span>1.0x (Standart)</span>
                  <span>3.5x (Önerilen)</span>
                  <span>7.0x (Turbo)</span>
                  <span className="text-orange-600 font-bold">10.0x (Nitro)</span>
                </div>
              </div>

              {/* Level description box */}
              <div className="text-xs text-slate-600 bg-white/80 border border-slate-200/80 rounded-xl p-2.5 flex items-start sm:items-center gap-2">
                <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-tight">
                  <strong className="text-slate-900">{multiplierMeta.label}:</strong> {multiplierMeta.description}
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Duration Presets & Custom */}
          <div>
            <label className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-black">3</span>
              Kampanya Süresi
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {PRESET_DURATIONS.map((preset) => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setDurationDays(preset.days);
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                    durationDays === preset.days
                      ? 'bg-orange-50 border-orange-400 text-orange-900 shadow-xs ring-2 ring-orange-500/20'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}
                >
                  {preset.popular && (
                    <span className="absolute -top-2 right-2 text-[9px] sm:text-[10px] font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.2 rounded-full shadow-xs">
                      En Popüler
                    </span>
                  )}
                  <div className="text-xs font-bold leading-snug">{preset.label}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 mt-1 flex items-center justify-between flex-wrap gap-1">
                    <span>{preset.days} Gün Aktif</span>
                    {preset.discountPercent && (
                      <span className="text-emerald-600 font-semibold">%{preset.discountPercent} İndirim</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Placements Targeting Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-black">4</span>
                Hedef Yerleşim Kanalları
              </label>
              <span className="text-[11px] sm:text-xs text-orange-600 font-semibold">{selectedPlacements.length} Kanal Seçildi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {PLACEMENT_OPTIONS.map((plc) => {
                const isSelected = selectedPlacements.includes(plc.id);
                return (
                  <div
                    key={plc.id}
                    onClick={() => togglePlacement(plc.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-50/70 to-amber-50/70 border-orange-300 text-slate-900 shadow-xs'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">{plc.title}</span>
                        <span className="text-[10px] font-semibold text-orange-600 bg-orange-100/70 px-1.5 py-0.2 rounded whitespace-nowrap">
                          {plc.impact}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{plc.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 5: Daily Budget & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Günlük Boost Bütçesi (TL)</label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Math.max(50, parseFloat(e.target.value) || 50))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">TL / Gün</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Kampanya Notu / Hedef (Opsiyonel)</label>
              <input
                type="text"
                placeholder="Örn: Hafta sonu flaş indirim boostu"
                value={campaignNotes}
                onChange={(e) => setCampaignNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Auto Renew Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Otomatik Yenileme (Auto-Renew)</div>
                <div className="text-[10px] sm:text-[11px] text-slate-500">Kampanya süresi bittiğinde aynı bütçe ve çarpanla otomatik devam eder.</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

        </div>

        {/* Right Column: Real-Time Live Performance & Impact Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-4 sm:p-6 text-white shadow-xl border border-slate-800 space-y-4 sm:space-y-5">
            
            {/* Simulator Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Canlı Etki Simülatörü
                </span>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                {multiplier.toFixed(1)}x Güç
              </span>
            </div>

            {/* Selected Product summary */}
            {selectedProduct && (
              <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/80 flex items-center gap-3">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
                <div className="overflow-hidden min-w-0">
                  <div className="text-xs font-bold text-white truncate">{selectedProduct.name}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
                    <span>Fiyat: {formatCurrency(selectedProduct.price)}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">% {selectedProduct.marginPercent} Marj</span>
                  </div>
                </div>
              </div>
            )}

            {/* Simulated Key Metrics Cards */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              
              {/* Metric 1: Impressions */}
              <div className="bg-slate-800/40 rounded-2xl p-3 sm:p-3.5 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Tahmini Gösterim</span>
                </div>
                <div className="text-sm sm:text-lg font-black text-white truncate">
                  {formatNumber(estimates.impressionsMin)} - {formatNumber(estimates.impressionsMax)}
                </div>
                <div className="text-[10px] text-blue-400 mt-0.5 font-medium truncate">+{Math.round(multiplier * 28)}% Artış</div>
              </div>

              {/* Metric 2: Clicks */}
              <div className="bg-slate-800/40 rounded-2xl p-3 sm:p-3.5 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <MousePointer className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">Tahmini Tıklama</span>
                </div>
                <div className="text-sm sm:text-lg font-black text-white truncate">
                  {formatNumber(estimates.clicks)} Tık
                </div>
                <div className="text-[10px] text-orange-400 mt-0.5 font-medium truncate">%{estimates.ctr.toFixed(1)} CTR</div>
              </div>

              {/* Metric 3: Orders */}
              <div className="bg-slate-800/40 rounded-2xl p-3 sm:p-3.5 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Ek Sipariş</span>
                </div>
                <div className="text-sm sm:text-lg font-black text-white truncate">
                  ~{estimates.conversions} Adet Satış
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5 font-medium truncate">Boost Kaynaklı</div>
              </div>

              {/* Metric 4: ROAS & Revenue */}
              <div className="bg-slate-800/40 rounded-2xl p-3 sm:p-3.5 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Tahmini ROAS</span>
                </div>
                <div className="text-sm sm:text-lg font-black text-amber-400 truncate">
                  {estimates.roas.toFixed(1)}x Kat
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5 font-medium truncate">
                  {formatCurrency(estimates.revenue)} Ciro
                </div>
              </div>

            </div>

            {/* Financial Summary Breakdown */}
            <div className="bg-slate-800/80 rounded-2xl p-3.5 sm:p-4 border border-slate-700/90 space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Günlük Bütçe:</span>
                <span className="font-bold text-white">{formatCurrency(dailyBudget)} / gün</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Süre:</span>
                <span className="font-bold text-white">{durationDays} Gün</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Yerleşim Sayısı:</span>
                <span className="font-bold text-white">{selectedPlacements.length} Kanal</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-white">Toplam Kampanya:</span>
                <span className="text-base sm:text-lg font-black text-orange-400">{formatCurrency(totalBudget)}</span>
              </div>
            </div>

            {/* Wallet Balance Check */}
            <div className="text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Cüzdan Bakiyeniz:</span>
                <span className="font-bold text-white">{formatCurrency(walletBalance)}</span>
              </div>

              {!hasEnoughBalance && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 text-red-300 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="truncate">Yetersiz bakiye. {formatCurrency(balanceDeficit)} eksik.</span>
                  </div>
                  <button
                    onClick={onOpenCreditTopUp}
                    className="text-xs font-bold text-amber-300 underline hover:text-amber-200 cursor-pointer shrink-0"
                  >
                    Bakiye Yükle
                  </button>
                </div>
              )}
            </div>

            {/* Launch Action Button */}
            <button
              id="btn-launch-boost-campaign"
              disabled={isSubmitting}
              onClick={handleLaunch}
              className={`w-full py-3.5 sm:py-4 rounded-2xl font-black text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 min-h-[48px] ${
                hasEnoughBalance
                  ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/40 hover:shadow-orange-500/50'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-600/30'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Algoritma Dağıtılıyor...</span>
                </div>
              ) : hasEnoughBalance ? (
                <>
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>Kampanyayı Başlat ({formatCurrency(totalBudget)})</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>Bakiye Yükle & Başlat</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <span>Garantili Algoritma Önceliği • İstediğiniz an durdurun</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
