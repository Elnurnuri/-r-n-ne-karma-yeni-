import React, { useState } from 'react';
import { 
  Eye, 
  MousePointer, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Layers, 
  Sparkles, 
  Activity,
  PieChart,
  ShoppingBag,
  Zap,
  Info
} from 'lucide-react';
import { BoostCampaign } from '../types';
import { TIMELINE_ANALYTICS_DATA } from '../data/mockData';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import { playSound } from '../utils/feedback';

interface AdvancedAnalyticsProps {
  campaigns: BoostCampaign[];
  onExportReport: () => void;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  campaigns,
  onExportReport
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [activeChartMetric, setActiveChartMetric] = useState<'impressions' | 'clicks' | 'revenue' | 'roas'>('revenue');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Compute Aggregate Analytics Metrics
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spentBudget, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenueGenerated, 0);
  const overallRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);

  // Category Distribution calculation
  const categoryStats = campaigns.reduce((acc, c) => {
    const cat = c.product.category;
    if (!acc[cat]) {
      acc[cat] = { name: cat, revenue: 0, spend: 0, roas: 0, count: 0 };
    }
    acc[cat].revenue += c.revenueGenerated;
    acc[cat].spend += c.spentBudget;
    acc[cat].count += 1;
    acc[cat].roas = acc[cat].spend > 0 ? acc[cat].revenue / acc[cat].spend : 0;
    return acc;
  }, {} as Record<string, { name: string; revenue: number; spend: number; roas: number; count: number }>);

  const categoryList = Object.values(categoryStats);

  // SVG Chart Dimensions
  const chartHeight = 220;
  const chartWidth = 640;
  const dataPoints = TIMELINE_ANALYTICS_DATA;

  // Maximum values for normalization
  const maxVal = Math.max(
    ...dataPoints.map(d => {
      if (activeChartMetric === 'impressions') return d.impressions;
      if (activeChartMetric === 'clicks') return d.clicks;
      if (activeChartMetric === 'revenue') return d.revenue;
      return d.roas;
    })
  ) * 1.15;

  // Generate SVG path points
  const points = dataPoints.map((d, idx) => {
    const x = (idx / (dataPoints.length - 1)) * (chartWidth - 40) + 20;
    let val = d.revenue;
    if (activeChartMetric === 'impressions') val = d.impressions;
    if (activeChartMetric === 'clicks') val = d.clicks;
    if (activeChartMetric === 'roas') val = d.roas;
    const y = chartHeight - 30 - (val / (maxVal || 1)) * (chartHeight - 60);
    return { x, y, val, label: d.date, fullData: d };
  });

  const svgPath = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0 
    ? `${svgPath} L ${points[points.length - 1].x} ${chartHeight - 30} L ${points[0].x} ${chartHeight - 30} Z`
    : '';

  return (
    <div id="advanced-analytics-section" className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 space-y-6 sm:space-y-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
              Gelişmiş Performans ve ROI Analitiği
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Boost kampanyalarınızın organik ciroya ve reklam getiri oranına (ROAS) olan net etkisini analiz edin.
          </p>
        </div>

        {/* Range Selector & Export Report */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-[11px] sm:text-xs font-bold overflow-x-auto">
            <button
              onClick={() => {
                playSound('click');
                setTimeRange('today');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                timeRange === 'today' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Bugün
            </button>
            <button
              onClick={() => {
                playSound('click');
                setTimeRange('7d');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                timeRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Son 7 Gün
            </button>
            <button
              onClick={() => {
                playSound('click');
                setTimeRange('30d');
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                timeRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Son 30 Gün
            </button>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onExportReport();
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] sm:text-xs font-bold px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0 min-h-[36px]"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Rapor İndir</span>
          </button>
        </div>
      </div>

      {/* 4 Performance Metric Cards (2x2 on mobile, 4 in row on lg) - Compact & Elegant */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        
        {/* Card 1: Impressions */}
        <div className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">Toplam Gösterim</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl font-black text-slate-900 mt-1 sm:mt-1.5">
            {formatNumber(totalImpressions)}
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-0.5 flex-wrap">
            <ArrowUpRight className="w-3 h-3 shrink-0" />
            <span>+42.8%</span>
            <span className="text-slate-400 font-normal hidden sm:inline">önceki döneme göre</span>
          </div>
        </div>

        {/* Card 2: CTR */}
        <div className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">Tıklama Oranı (CTR)</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
              <MousePointer className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl font-black text-slate-900 mt-1 sm:mt-1.5">
            %{avgCtr.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-0.5 flex-wrap">
            <ArrowUpRight className="w-3 h-3 shrink-0" />
            <span>+1.4%</span>
            <span className="text-slate-400 font-normal hidden sm:inline">sektör ort.</span>
          </div>
        </div>

        {/* Card 3: ROAS Efficiency */}
        <div className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">Verimlilik (ROAS)</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl font-black text-emerald-600 mt-1 sm:mt-1.5">
            {overallRoas.toFixed(1)}x Kat
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-600 font-bold mt-0.5 flex-wrap">
            <ArrowUpRight className="w-3 h-3 shrink-0" />
            <span>+18.2%</span>
            <span className="text-slate-400 font-normal hidden sm:inline">reklam getirisi</span>
          </div>
        </div>

        {/* Card 4: Revenue Generated */}
        <div className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">Boost Net Ciro</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl font-black text-slate-900 mt-1 sm:mt-1.5 truncate">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-purple-600 font-bold mt-0.5 flex-wrap">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>{totalConversions} Sipariş</span>
          </div>
        </div>

      </div>

      {/* Visual Interactive Performance Timeline Chart */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>Zaman İçinde Boost Performansı</span>
              <span className="text-[10px] sm:text-xs font-semibold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
                Haftalık Trend
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Grafik üzerindeki noktalara tıklayarak veya üzerine gelerek detayları inceleyebilirsiniz.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px] sm:text-xs font-bold overflow-x-auto self-start sm:self-auto max-w-full">
            <button
              onClick={() => {
                playSound('toggle');
                setActiveChartMetric('revenue');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeChartMetric === 'revenue' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ciro (TL)
            </button>
            <button
              onClick={() => {
                playSound('toggle');
                setActiveChartMetric('impressions');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeChartMetric === 'impressions' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gösterim
            </button>
            <button
              onClick={() => {
                playSound('toggle');
                setActiveChartMetric('clicks');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeChartMetric === 'clicks' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tıklama
            </button>
            <button
              onClick={() => {
                playSound('toggle');
                setActiveChartMetric('roas');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeChartMetric === 'roas' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ROAS
            </button>
          </div>
        </div>

        {/* Selected Point Details Card for Mobile/Desktop Touch */}
        {hoveredPointIndex !== null && (
          <div className="mb-3 p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-400">{points[hoveredPointIndex].label}:</span>
              <span className="text-slate-300">
                {activeChartMetric === 'revenue' && `Ciro: ${formatCurrency(points[hoveredPointIndex].val)}`}
                {activeChartMetric === 'impressions' && `Gösterim: ${formatNumber(points[hoveredPointIndex].val)}`}
                {activeChartMetric === 'clicks' && `Tıklama: ${formatNumber(points[hoveredPointIndex].val)}`}
                {activeChartMetric === 'roas' && `ROAS: ${points[hoveredPointIndex].val.toFixed(1)}x`}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Sipariş: {points[hoveredPointIndex].fullData.orders} Adet
            </div>
          </div>
        )}

        {/* Custom SVG Responsive Interactive Chart Container */}
        <div className="relative w-full overflow-x-auto pb-2 -mx-1 px-1">
          <div className="min-w-[540px] sm:min-w-[600px] h-[220px] sm:h-[240px]">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradientOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartGradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartGradientEmerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartGradientPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1="20"
                  y1={chartHeight - 30 - ratio * (chartHeight - 60)}
                  x2={chartWidth - 20}
                  y2={chartHeight - 30 - ratio * (chartHeight - 60)}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area fill */}
              <path
                d={areaPath}
                fill={
                  activeChartMetric === 'impressions' 
                    ? 'url(#chartGradientBlue)' 
                    : activeChartMetric === 'clicks' 
                    ? 'url(#chartGradientEmerald)' 
                    : activeChartMetric === 'roas'
                    ? 'url(#chartGradientPurple)'
                    : 'url(#chartGradientOrange)'
                }
              />

              {/* Line path */}
              <path
                d={svgPath}
                fill="none"
                stroke={
                  activeChartMetric === 'impressions' 
                    ? '#3b82f6' 
                    : activeChartMetric === 'clicks' 
                    ? '#10b981' 
                    : activeChartMetric === 'roas'
                    ? '#a855f7'
                    : '#f97316'
                }
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Dots and Labels */}
              {points.map((p, idx) => {
                const isHovered = hoveredPointIndex === idx;
                return (
                  <g key={idx}>
                    {/* Hit target for easier touch on mobile */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="16"
                      fill="transparent"
                      className="cursor-pointer"
                      onClick={() => {
                        playSound('click');
                        setHoveredPointIndex(hoveredPointIndex === idx ? null : idx);
                      }}
                      onTouchStart={() => {
                        playSound('click');
                        setHoveredPointIndex(idx);
                      }}
                      onMouseEnter={() => {
                        playSound('click');
                        setHoveredPointIndex(idx);
                      }}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    />

                    {/* Circle Dot */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? '7' : '4.5'}
                      fill="#ffffff"
                      stroke={
                        activeChartMetric === 'impressions' 
                          ? '#3b82f6' 
                          : activeChartMetric === 'clicks' 
                          ? '#10b981' 
                          : activeChartMetric === 'roas'
                          ? '#a855f7'
                          : '#f97316'
                      }
                      strokeWidth="3"
                      className="pointer-events-none transition-all duration-150"
                    />

                    {/* Date Label on X axis */}
                    <text
                      x={p.x}
                      y={chartHeight - 10}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#64748b"
                      fontWeight="600"
                    >
                      {p.label}
                    </text>

                    {/* Value label on hover */}
                    {isHovered && (
                      <g className="pointer-events-none">
                        <rect
                          x={Math.max(10, Math.min(chartWidth - 120, p.x - 55))}
                          y={Math.max(10, p.y - 45)}
                          width="110"
                          height="34"
                          rx="8"
                          fill="#0f172a"
                          className="shadow-lg"
                        />
                        <text
                          x={Math.max(65, Math.min(chartWidth - 65, p.x))}
                          y={Math.max(30, p.y - 25)}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          {activeChartMetric === 'revenue' && formatCurrency(p.val)}
                          {activeChartMetric === 'impressions' && `${formatNumber(p.val)} Gösterim`}
                          {activeChartMetric === 'clicks' && `${formatNumber(p.val)} Tıklama`}
                          {activeChartMetric === 'roas' && `${p.val.toFixed(1)}x ROAS`}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

      </div>

      {/* Comparison & Funnel Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Comparison: Boosted vs Non-Boosted Performance */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Boost vs Organik Karşılaştırması</span>
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-full whitespace-nowrap">
              +380% Net Fark
            </span>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {/* Metric Comparison 1: Günlük Gösterim */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Ortalama Günlük Gösterim</span>
                <span className="text-orange-600 font-extrabold">+4.8x Artış</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] w-12 sm:w-14 text-slate-400 font-semibold shrink-0">Boost:</span>
                  <div className="h-4 flex-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-md text-[10px] text-white font-bold flex items-center pl-2 truncate">
                    48.500 Gösterim/gün
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] w-12 sm:w-14 text-slate-400 font-semibold shrink-0">Organik:</span>
                  <div className="h-4 w-1/4 min-w-[50px] bg-slate-300 rounded-md text-[10px] text-slate-700 font-bold flex items-center pl-2">
                    10.100
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Comparison 2: Tıklama Dönüşüm Oranı */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Dönüşüm Oranı (CR)</span>
                <span className="text-emerald-600 font-extrabold">+74% Yükseliş</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] w-12 sm:w-14 text-slate-400 font-semibold shrink-0">Boost:</span>
                  <div className="h-4 w-4/5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-md text-[10px] text-white font-bold flex items-center pl-2 truncate">
                    %5.39 Satışa Dönüşüm
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] w-12 sm:w-14 text-slate-400 font-semibold shrink-0">Organik:</span>
                  <div className="h-4 w-2/5 min-w-[50px] bg-slate-300 rounded-md text-[10px] text-slate-700 font-bold flex items-center pl-2">
                    %3.10
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Comparison 3: Sepet Tutarı */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Ortalama Sepet Tutarı (AOV)</span>
                <span className="text-purple-600 font-extrabold">+%32 Artış</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] w-12 sm:w-14 text-slate-400 font-semibold shrink-0">Boost:</span>
                  <div className="h-4 w-3/4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-md text-[10px] text-white font-bold flex items-center pl-2 truncate">
                    ₺2.450 / sipariş
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] w-12 sm:w-14 text-slate-400 font-semibold shrink-0">Organik:</span>
                  <div className="h-4 w-1/2 min-w-[50px] bg-slate-300 rounded-md text-[10px] text-slate-700 font-bold flex items-center pl-2">
                    ₺1.850
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Conversion Funnel Visualization */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Boost Dönüşüm Hunisi</span>
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-500">Tüm Kampanyalar</span>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            
            {/* Step 1: Impressions */}
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs font-black shrink-0">1</div>
                <div className="min-w-0">
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Toplam Boost Gösterimi</div>
                  <div className="text-[10px] text-slate-500 truncate">Arama ve vitrin gösterimleri</div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-900 shrink-0">{formatNumber(totalImpressions)}</span>
            </div>

            {/* Step 2: Clicks */}
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2 sm:ml-4">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs font-black shrink-0">2</div>
                <div className="min-w-0">
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Ürün Detay Tıklaması</div>
                  <div className="text-[10px] text-slate-500 truncate">CTR Oranı: %{avgCtr.toFixed(1)}</div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-orange-600 shrink-0">{formatNumber(totalClicks)}</span>
            </div>

            {/* Step 3: Orders / Conversions */}
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2 sm:ml-8">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-black shrink-0">3</div>
                <div className="min-w-0">
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Satın Alma & Sipariş</div>
                  <div className="text-[10px] text-slate-500 truncate">Toplam Ciro: {formatCurrency(totalRevenue)}</div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-emerald-600 shrink-0">{totalConversions} Sipariş</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
