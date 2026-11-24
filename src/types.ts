export type BoostStatus = 'active' | 'expiring' | 'paused' | 'completed' | 'scheduled';

export type BoostPlacement = 
  | 'search_top'      // Arama Sonuçları En Üst
  | 'category_page'   // Kategori Sayfaları
  | 'similar_products'// Benzer Ürünler / Çapraz Satış
  | 'homepage_showcase'// Ana Sayfa Vitrin
  | 'cart_recommends'; // Sepet Sayfası Önerileri

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  baseMonthlySales: number;
  marginPercent: number;
  isTrending?: boolean;
}

export interface BoostCampaign {
  id: string;
  productId: string;
  product: Product;
  multiplier: number; // e.g. 2.5x, 5.0x
  status: BoostStatus;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  durationDays: number;
  placements: BoostPlacement[];
  dailyBudget: number; // in TL
  totalBudget: number; // in TL
  spentBudget: number; // in TL
  
  // Performance metrics
  impressions: number;
  clicks: number;
  ctr: number; // % Click-Through Rate
  conversions: number;
  conversionRate: number; // %
  revenueGenerated: number; // in TL
  roas: number; // Return on Ad Spend (e.g. 5.8x)
  organicLiftPercent: number; // % Organic sales lift
  
  // Timestamps & meta
  createdAt: string;
  updatedAt: string;
  autoRenew: boolean;
  notes?: string;
}

export interface BoostPreset {
  days: number;
  label: string;
  popular?: boolean;
  discountPercent?: number;
}

export interface PerformanceMetricSummary {
  totalImpressions: number;
  totalImpressionsChange: number; // %
  totalClicks: number;
  totalClicksChange: number; // %
  avgCtr: number;
  avgCtrChange: number; // %
  totalSpent: number;
  totalRevenue: number;
  totalRevenueChange: number; // %
  overallRoas: number;
  overallRoasChange: number; // %
  activeBoostsCount: number;
  expiringBoostsCount: number;
  boostedProductsCount: number;
}

export interface SmartRecommendation {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  type: 'high_margin' | 'trending_category' | 'low_competition' | 'seasonal_opportunity';
  title: string;
  reason: string;
  suggestedMultiplier: number;
  suggestedDurationDays: number;
  estimatedReach: number;
  estimatedRevenue: number;
  estimatedRoas: number;
  confidenceScore: number; // 0-100
}

export interface OptimalTimingInsight {
  dayName: string;
  peakHours: string;
  conversionMultiplier: string;
  recommendation: string;
  bestPlacements: string[];
}

export interface PackageOffer {
  id: string;
  name: string;
  credits: number;
  bonusCredits: number;
  price: number;
  originalPrice: number;
  tag?: string;
  features: string[];
  popular?: boolean;
}

export interface UserWallet {
  balance: number; // TL credit balance
  bonusCredits: number;
  freeBoostsRemaining: number;
  tier: 'Standard' | 'Pro Seller' | 'Enterprise VIP';
}

export interface NotificationAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'upgrade';
  title: string;
  message: string;
  timestamp: string;
  actionText?: string;
  actionType?: 'upgrade' | 'renew' | 'view_campaign' | 'fix_stock';
  targetCampaignId?: string;
  isRead: boolean;
  dismissible: boolean;
}

export type SortOption = 
  | 'newest'
  | 'oldest'
  | 'highest_roas'
  | 'highest_revenue'
  | 'highest_multiplier'
  | 'expiring_soon'
  | 'budget_high';

export type FilterStatus = 'all' | 'active' | 'expiring' | 'paused' | 'completed';
