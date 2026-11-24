import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  Grid, 
  List, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Clock, 
  Play, 
  Pause, 
  Copy, 
  Trash2, 
  Edit3, 
  Sparkles, 
  ArrowUpDown, 
  CheckSquare, 
  Square, 
  Download, 
  MoreVertical, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Zap,
  BarChart3,
  Calendar,
  Rocket
} from 'lucide-react';
import { BoostCampaign, FilterStatus, SortOption } from '../types';
import { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatMultiplier, 
  getMultiplierLevel, 
  getStatusDetails,
  getTimeRemainingText 
} from '../utils/formatters';
import { playSound } from '../utils/feedback';

interface BoostManagementProps {
  campaigns: BoostCampaign[];
  onToggleStatus: (campaignId: string) => void;
  onExtendCampaign: (campaign: BoostCampaign) => void;
  onEditCampaign: (campaign: BoostCampaign) => void;
  onDuplicateCampaign: (campaign: BoostCampaign) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onViewDetails: (campaign: BoostCampaign) => void;
  onBulkExtend: (campaignIds: string[]) => void;
  onBulkPause: (campaignIds: string[]) => void;
  onBulkExport: (campaignIds: string[]) => void;
  onBulkDelete: (campaignIds: string[]) => void;
}

export const BoostManagement: React.FC<BoostManagementProps> = ({
  campaigns,
  onToggleStatus,
  onExtendCampaign,
  onEditCampaign,
  onDuplicateCampaign,
  onDeleteCampaign,
  onViewDetails,
  onBulkExtend,
  onBulkPause,
  onBulkExport,
  onBulkDelete
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [activeMenuCampaignId, setActiveMenuCampaignId] = useState<string | null>(null);

  // Filter and Sort Campaigns
  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.product.name.toLowerCase().includes(q) ||
        c.product.sku.toLowerCase().includes(q) ||
        c.product.category.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'highest_roas') {
        return b.roas - a.roas;
      }
      if (sortBy === 'highest_revenue') {
        return b.revenueGenerated - a.revenueGenerated;
      }
      if (sortBy === 'highest_multiplier') {
        return b.multiplier - a.multiplier;
      }
      if (sortBy === 'expiring_soon') {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      }
      if (sortBy === 'budget_high') {
        return b.totalBudget - a.totalBudget;
      }
      return 0;
    });

    return result;
  }, [campaigns, statusFilter, searchQuery, sortBy]);

  // Bulk Selection
  const allSelected = filteredCampaigns.length > 0 && selectedCampaignIds.length === filteredCampaigns.length;
  const toggleSelectAll = () => {
    playSound('toggle');
    if (allSelected) {
      setSelectedCampaignIds([]);
    } else {
      setSelectedCampaignIds(filteredCampaigns.map(c => c.id));
    }
  };

  const toggleSelectCampaign = (id: string) => {
    playSound('toggle');
    if (selectedCampaignIds.includes(id)) {
      setSelectedCampaignIds(selectedCampaignIds.filter(i => i !== id));
    } else {
      setSelectedCampaignIds([...selectedCampaignIds, id]);
    }
  };

  const clearSelection = () => {
    setSelectedCampaignIds([]);
  };

  // Status counts
  const counts = useMemo(() => {
    return {
      all: campaigns.length,
      active: campaigns.filter(c => c.status === 'active').length,
      expiring: campaigns.filter(c => c.status === 'expiring').length,
      paused: campaigns.filter(c => c.status === 'paused').length,
      completed: campaigns.filter(c => c.status === 'completed').length,
    };
  }, [campaigns]);

  return (
    <div id="boost-management-section" className="space-y-6 mb-12">
      
      {/* Section Header & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Aktif Boost Kampanyaları Yönetimi
            </h2>
            <span className="bg-orange-100 text-orange-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              {filteredCampaigns.length} Kampanya
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Öne çıkarılan tüm ürünlerin anlık performansını izleyin, bütçe ve sürelerini yönetin.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => {
                playSound('click');
                setViewMode('grid');
              }}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kart Izgara Görünümü"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Kartlar</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                setViewMode('table');
              }}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Detaylı Tablo Görünümü"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tablo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
        
        {/* Top row: Status Tabs & Search & Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none -mx-1 px-1">
            <button
              onClick={() => {
                playSound('click');
                setStatusFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tümü ({counts.all})
            </button>

            <button
              onClick={() => {
                playSound('click');
                setStatusFilter('active');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              Aktif ({counts.active})
            </button>

            <button
              onClick={() => {
                playSound('click');
                setStatusFilter('expiring');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'expiring'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
              Süresi Azalan ({counts.expiring})
            </button>

            <button
              onClick={() => {
                playSound('click');
                setStatusFilter('paused');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'paused'
                  ? 'bg-slate-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Duraklatılan ({counts.paused})
            </button>

            <button
              onClick={() => {
                playSound('click');
                setStatusFilter('completed');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
              }`}
            >
              Tamamlanan ({counts.completed})
            </button>
          </div>

          {/* Search & Sort controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Kampanya veya ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 sm:py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => {
                  playSound('click');
                  setSortBy(e.target.value as SortOption);
                }}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="newest">Sıralama: En Yeni</option>
                <option value="highest_roas">En Yüksek ROAS (Verim)</option>
                <option value="highest_revenue">En Yüksek Ciro</option>
                <option value="highest_multiplier">En Yüksek Çarpan (10x)</option>
                <option value="expiring_soon">Süresi En Yakın</option>
                <option value="budget_high">En Yüksek Bütçe</option>
                <option value="oldest">En Eski</option>
              </select>
            </div>
          </div>

        </div>

        {/* Bulk Action Bar (Visible when items selected) */}
        {selectedCampaignIds.length > 0 && (
          <div className="bg-orange-50/90 border border-orange-200 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-950">
                {selectedCampaignIds.length} Kampanya Seçildi
              </span>
              <button
                onClick={clearSelection}
                className="text-[11px] text-orange-600 underline font-medium cursor-pointer"
              >
                Seçimi Temizle
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  playSound('boost');
                  onBulkExtend(selectedCampaignIds);
                }}
                className="flex-1 sm:flex-none bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer min-h-[34px]"
              >
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                <span>+7 Gün Uzat</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  onBulkPause(selectedCampaignIds);
                }}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer min-h-[34px]"
              >
                <Pause className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">Duraklat</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  onBulkExport(selectedCampaignIds);
                }}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer min-h-[34px]"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">Rapor</span>
              </button>

              <button
                onClick={() => {
                  playSound('warning');
                  onBulkDelete(selectedCampaignIds);
                }}
                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer min-h-[34px]"
                title="Seçilenleri İptal Et"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Campaign List / Cards */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Eşleşen Boost Kampanyası Bulunamadı</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Arama filtrenizi temizleyebilir veya yukarıdaki form üzerinden hemen yeni bir ürün öne çıkarma kampanyası başlatabilirsiniz.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Grid Layout (Card-Based) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((cmp) => {
            const statusMeta = getStatusDetails(cmp.status);
            const multiplierMeta = getMultiplierLevel(cmp.multiplier);
            const remaining = getTimeRemainingText(cmp.endDate);
            const isSelected = selectedCampaignIds.includes(cmp.id);
            const budgetPercentUsed = Math.min(100, Math.round((cmp.spentBudget / cmp.totalBudget) * 100));

            return (
              <div
                key={cmp.id}
                id={`boost-card-${cmp.id}`}
                className={`bg-white rounded-3xl border transition-all duration-200 hover:shadow-xl relative flex flex-col justify-between overflow-hidden group ${
                  isSelected ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200/90 shadow-xs hover:border-orange-300'
                }`}
              >
                {/* Top Banner Accent */}
                <div className={`h-1.5 w-full ${
                  cmp.status === 'active' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                    : cmp.status === 'expiring'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : cmp.status === 'completed'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    : 'bg-slate-300'
                }`} />

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4">
                  
                  {/* Top Bar: Checkbox, Status & Multiplier Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSelectCampaign(cmp.id)}
                        className="text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                        title="Seç"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-orange-600 fill-orange-50" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </button>

                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border ${statusMeta.bg}`}>
                        <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
                        {statusMeta.label}
                      </span>
                    </div>

                    {/* Multiplier Badge */}
                    <div className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl border text-[11px] sm:text-xs font-black flex items-center gap-1 shadow-xs ${multiplierMeta.badgeBg} ${multiplierMeta.badgeBorder} ${multiplierMeta.badgeText}`}>
                      <Zap className="w-3.5 h-3.5" />
                      <span>{formatMultiplier(cmp.multiplier)}</span>
                    </div>
                  </div>

                  {/* Product Details Header */}
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <img
                      src={cmp.product.imageUrl}
                      alt={cmp.product.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs group-hover:scale-102 transition-transform"
                    />
                    <div className="overflow-hidden min-w-0">
                      <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-medium flex-wrap">
                        <span>{cmp.product.category}</span>
                        <span>•</span>
                        <span className="font-mono">{cmp.product.sku}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                        {cmp.product.name}
                      </h4>
                      <div className="text-xs font-bold text-orange-600 mt-1">
                        {formatCurrency(cmp.product.price)}
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics Matrix (Grid) */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/90 rounded-2xl p-2.5 sm:p-3 border border-slate-100">
                    
                    {/* Impressions */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 font-medium truncate">Gösterim</div>
                        <div className="text-xs font-extrabold text-slate-800 truncate">{formatNumber(cmp.impressions)}</div>
                      </div>
                    </div>

                    {/* Clicks & CTR */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                        <MousePointer className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 font-medium truncate">Tıklama (%{cmp.ctr})</div>
                        <div className="text-xs font-extrabold text-slate-800 truncate">{formatNumber(cmp.clicks)}</div>
                      </div>
                    </div>

                    {/* Revenue */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 font-medium truncate">Getirilen Ciro</div>
                        <div className="text-xs font-extrabold text-slate-800 truncate">{formatCurrency(cmp.revenueGenerated)}</div>
                      </div>
                    </div>

                    {/* ROAS Efficiency */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 font-medium truncate">ROAS Verimi</div>
                        <div className="text-xs font-black text-emerald-600">{cmp.roas.toFixed(1)}x Kat</div>
                      </div>
                    </div>

                  </div>

                  {/* Progress & Time Remaining */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] gap-2">
                      <span className="text-slate-500 flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{remaining.text}</span>
                      </span>
                      <span className="font-bold text-slate-700 shrink-0">
                        {formatCurrency(cmp.spentBudget)} / {formatCurrency(cmp.totalBudget)}
                      </span>
                    </div>

                    {/* Budget & Time Progress Bar */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          cmp.status === 'expiring' 
                            ? 'bg-amber-500' 
                            : cmp.status === 'completed'
                            ? 'bg-blue-500'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500'
                        }`}
                        style={{ width: `${budgetPercentUsed}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Card Footer Actions */}
                <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  
                  {/* Left quick actions */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <button
                      onClick={() => {
                        playSound('click');
                        onToggleStatus(cmp.id);
                      }}
                      className={`p-1.5 sm:p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 min-h-[34px] min-w-[34px] justify-center ${
                        cmp.status === 'paused'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title={cmp.status === 'paused' ? 'Kampanyayı Devam Ettir' : 'Geçici Olarak Duraklat'}
                    >
                      {cmp.status === 'paused' ? <Play className="w-3.5 h-3.5 fill-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        playSound('click');
                        onEditCampaign(cmp);
                      }}
                      className="p-1.5 sm:p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center"
                      title="Bütçe ve Çarpan Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        playSound('click');
                        onDuplicateCampaign(cmp);
                      }}
                      className="p-1.5 sm:p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center"
                      title="Kampanyayı Çoğalt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        playSound('click');
                        onViewDetails(cmp);
                      }}
                      className="p-1.5 sm:p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center"
                      title="Detaylı Analiz & Rapor"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary card action: Extend or Details */}
                  {cmp.status !== 'completed' ? (
                    <button
                      onClick={() => {
                        playSound('boost');
                        onExtendCampaign(cmp);
                      }}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98 min-h-[34px]"
                    >
                      <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                      <span>Süreyi Uzat</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        playSound('boost');
                        onDuplicateCampaign(cmp);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-extrabold px-2.5 sm:px-3 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer min-h-[34px]"
                    >
                      <Rocket className="w-3.5 h-3.5 shrink-0" />
                      <span>Yeniden Başlat</span>
                    </button>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* Table List View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 w-10">
                    <button onClick={toggleSelectAll} className="cursor-pointer">
                      {allSelected ? <CheckSquare className="w-4 h-4 text-orange-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Ürün & SKU</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4">Boost Gücü</th>
                  <th className="py-3.5 px-4">Kalan Süre</th>
                  <th className="py-3.5 px-4">Gösterim</th>
                  <th className="py-3.5 px-4">Tıklama (CTR)</th>
                  <th className="py-3.5 px-4">Harcama / Bütçe</th>
                  <th className="py-3.5 px-4">Oluşturulan Ciro</th>
                  <th className="py-3.5 px-4">ROAS</th>
                  <th className="py-3.5 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCampaigns.map((cmp) => {
                  const statusMeta = getStatusDetails(cmp.status);
                  const multiplierMeta = getMultiplierLevel(cmp.multiplier);
                  const remaining = getTimeRemainingText(cmp.endDate);
                  const isSelected = selectedCampaignIds.includes(cmp.id);

                  return (
                    <tr key={cmp.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-orange-50/40' : ''}`}>
                      <td className="py-3.5 px-4">
                        <button onClick={() => toggleSelectCampaign(cmp.id)} className="cursor-pointer">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-orange-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={cmp.product.imageUrl} alt={cmp.product.name} className="w-10 h-10 rounded-xl object-cover border shrink-0" />
                          <div className="max-w-xs">
                            <div className="font-extrabold text-slate-900 truncate">{cmp.product.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <span className="font-mono">{cmp.product.sku}</span>
                              <span>•</span>
                              <span className="font-bold text-orange-600">{formatCurrency(cmp.product.price)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-black ${multiplierMeta.badgeBg} ${multiplierMeta.badgeBorder} ${multiplierMeta.badgeText}`}>
                          {formatMultiplier(cmp.multiplier)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {remaining.text}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-800">
                        {formatNumber(cmp.impressions)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{formatNumber(cmp.clicks)}</div>
                        <div className="text-[10px] text-slate-400">%{cmp.ctr} CTR</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{formatCurrency(cmp.spentBudget)}</div>
                        <div className="text-[10px] text-slate-400">{formatCurrency(cmp.totalBudget)} limit</div>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {formatCurrency(cmp.revenueGenerated)}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-600">
                        {cmp.roas.toFixed(1)}x
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              playSound('boost');
                              onExtendCampaign(cmp);
                            }}
                            className="bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Uzat
                          </button>
                          <button
                            onClick={() => {
                              playSound('click');
                              onViewDetails(cmp);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Detay"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      )}

    </div>
  );
};
