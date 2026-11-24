import { 
  Product, 
  BoostCampaign, 
  SmartRecommendation, 
  OptimalTimingInsight, 
  PackageOffer, 
  UserWallet,
  NotificationAlert
} from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    name: 'Kablosuz Gürültü Engelleyici Kulak Üstü Kulaklık Pro Max',
    sku: 'ELC-HP-901',
    category: 'Elektronik & Ses',
    price: 3499.00,
    stock: 48,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 342,
    baseMonthlySales: 85,
    marginPercent: 42,
    isTrending: true
  },
  {
    id: 'prod-102',
    name: 'Ergonomik Ortopedik Ofis ve Oyuncu Koltuğu Elite Air',
    sku: 'FUR-CH-402',
    category: 'Ev & Yaşam',
    price: 4850.00,
    stock: 19,
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-c9902636a0cb?w=500&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewsCount: 189,
    baseMonthlySales: 40,
    marginPercent: 38,
    isTrending: false
  },
  {
    id: 'prod-103',
    name: 'Akıllı Robot Süpürge ve Mop Lazer Haritalama V12',
    sku: 'ELC-VAC-303',
    category: 'Ev Aletleri',
    price: 12900.00,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 512,
    baseMonthlySales: 120,
    marginPercent: 35,
    isTrending: true
  },
  {
    id: 'prod-104',
    name: 'Organik Soğuk Sıkım Yüz Bakım ve Gençleştirici Serum 50ml',
    sku: 'COS-SRM-104',
    category: 'Kozmetik & Bakım',
    price: 649.00,
    stock: 140,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 278,
    baseMonthlySales: 210,
    marginPercent: 62,
    isTrending: true
  },
  {
    id: 'prod-105',
    name: 'Ultra Hafif Koşu ve Fitness Spor Ayakkabısı Carbon Flex',
    sku: 'SHO-RUN-505',
    category: 'Spor & Outdoor',
    price: 2199.00,
    stock: 64,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewsCount: 164,
    baseMonthlySales: 95,
    marginPercent: 45,
    isTrending: false
  },
  {
    id: 'prod-106',
    name: 'Paslanmaz Çelik Termos Bardak 750ml Çift Cidarlı',
    sku: 'KIT-TRM-606',
    category: 'Mutfak & Sofra',
    price: 499.00,
    stock: 210,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 420,
    baseMonthlySales: 310,
    marginPercent: 55,
    isTrending: true
  },
  {
    id: 'prod-107',
    name: 'Mekanik RGB Gaming Klavye Hot-Swappable Switch',
    sku: 'ELC-KB-707',
    category: 'Elektronik & Gaming',
    price: 1890.00,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 195,
    baseMonthlySales: 68,
    marginPercent: 40,
    isTrending: false
  },
  {
    id: 'prod-108',
    name: 'Hakiki Deri Minimalist Kartlık ve Cüzdan RFID Korumalı',
    sku: 'ACC-WLT-808',
    category: 'Moda & Aksesuar',
    price: 789.00,
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 310,
    baseMonthlySales: 180,
    marginPercent: 58,
    isTrending: true
  }
];

export const INITIAL_CAMPAIGNS: BoostCampaign[] = [
  {
    id: 'boost-cmp-001',
    productId: 'prod-101',
    product: INITIAL_PRODUCTS[0],
    multiplier: 4.5,
    status: 'active',
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    durationDays: 7,
    placements: ['search_top', 'category_page', 'similar_products'],
    dailyBudget: 450,
    totalBudget: 3150,
    spentBudget: 1350,
    impressions: 84520,
    clicks: 4395,
    ctr: 5.2,
    conversions: 184,
    conversionRate: 4.19,
    revenueGenerated: 643816,
    roas: 6.8,
    organicLiftPercent: 34,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    autoRenew: true,
    notes: 'Hafta sonu arama görünürlüğü için turbo mod'
  },
  {
    id: 'boost-cmp-002',
    productId: 'prod-104',
    product: INITIAL_PRODUCTS[3],
    multiplier: 3.2,
    status: 'expiring',
    startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 - 18 * 3600 * 1000).toISOString(),
    endDate: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), // 6 hours remaining
    durationDays: 7,
    placements: ['search_top', 'homepage_showcase', 'cart_recommends'],
    dailyBudget: 300,
    totalBudget: 2100,
    spentBudget: 2010,
    impressions: 112400,
    clicks: 7640,
    ctr: 6.8,
    conversions: 412,
    conversionRate: 5.39,
    revenueGenerated: 267388,
    roas: 8.4,
    organicLiftPercent: 48,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    autoRenew: false,
    notes: 'Kozmetik kategorisi en çok satanlar listesi 1. sıra'
  },
  {
    id: 'boost-cmp-003',
    productId: 'prod-103',
    product: INITIAL_PRODUCTS[2],
    multiplier: 6.0,
    status: 'active',
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    durationDays: 7,
    placements: ['search_top', 'category_page', 'homepage_showcase'],
    dailyBudget: 850,
    totalBudget: 5950,
    spentBudget: 850,
    impressions: 42100,
    clicks: 1980,
    ctr: 4.7,
    conversions: 38,
    conversionRate: 1.92,
    revenueGenerated: 490200,
    roas: 5.7,
    organicLiftPercent: 22,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    autoRenew: true,
    notes: 'Yüksek sepet tutarlı ürün agresif boost'
  },
  {
    id: 'boost-cmp-004',
    productId: 'prod-106',
    product: INITIAL_PRODUCTS[5],
    multiplier: 2.0,
    status: 'paused',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    durationDays: 14,
    placements: ['similar_products', 'cart_recommends'],
    dailyBudget: 150,
    totalBudget: 2100,
    spentBudget: 980,
    impressions: 38900,
    clicks: 2210,
    ctr: 5.68,
    conversions: 165,
    conversionRate: 7.47,
    revenueGenerated: 82335,
    roas: 7.9,
    organicLiftPercent: 19,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    autoRenew: false,
    notes: 'Stok güncellemesi için geçici olarak duraklatıldı'
  },
  {
    id: 'boost-cmp-005',
    productId: 'prod-108',
    product: INITIAL_PRODUCTS[7],
    multiplier: 3.5,
    status: 'completed',
    startDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    durationDays: 14,
    placements: ['search_top', 'category_page'],
    dailyBudget: 220,
    totalBudget: 3080,
    spentBudget: 3080,
    impressions: 95400,
    clicks: 5820,
    ctr: 6.1,
    conversions: 320,
    conversionRate: 5.5,
    revenueGenerated: 252480,
    roas: 9.1,
    organicLiftPercent: 52,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    autoRenew: false,
    notes: 'Hedeflenen ciro ve ROAS başarıyla aşıldı'
  }
];

export const SMART_RECOMMENDATIONS: SmartRecommendation[] = [
  {
    id: 'rec-01',
    productId: 'prod-104',
    productName: 'Organik Soğuk Sıkım Yüz Bakım Serumu',
    productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
    type: 'high_margin',
    title: 'Yüksek Marjlı Ürün Boost Fırsatı',
    reason: '%62 kar marjı ve %5.4 dönüşüm oranı ile en yüksek ROI potansiyeline sahip. 3.5x boost ile ciroda %180 artış hedeflenebilir.',
    suggestedMultiplier: 3.5,
    suggestedDurationDays: 7,
    estimatedReach: 145000,
    estimatedRevenue: 340000,
    estimatedRoas: 8.9,
    confidenceScore: 96
  },
  {
    id: 'rec-02',
    productId: 'prod-101',
    productName: 'Kablosuz Gürültü Engelleyici Kulak Üstü Kulaklık Pro',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    type: 'trending_category',
    title: 'Elektronik Kategorisinde Arama Trendi',
    reason: 'Hafta sonu "Bluetooth Kulaklık" aramalarında %45 hacim artışı öngörülüyor. Arama sonuçları 1. sıra yerleşimi kritik.',
    suggestedMultiplier: 5.0,
    suggestedDurationDays: 3,
    estimatedReach: 98000,
    estimatedRevenue: 520000,
    estimatedRoas: 7.2,
    confidenceScore: 91
  },
  {
    id: 'rec-03',
    productId: 'prod-108',
    productName: 'Hakiki Deri Minimalist Kartlık ve Cüzdan',
    productImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80',
    type: 'low_competition',
    title: 'Düşük Rekabet - Yüksek Tıklama Oranı',
    reason: 'Kategori reklam maliyetleri şu an %28 daha ucuz. Düşük bütçeyle sepet sayfalarında ve çapraz satışta %9.4 ROAS yakalanabilir.',
    suggestedMultiplier: 2.8,
    suggestedDurationDays: 14,
    estimatedReach: 82000,
    estimatedRevenue: 195000,
    estimatedRoas: 9.4,
    confidenceScore: 88
  }
];

export const OPTIMAL_TIMING_INSIGHTS: OptimalTimingInsight[] = [
  {
    dayName: 'Cuma & Cumartesi Akşamları',
    peakHours: '19:30 - 23:45',
    conversionMultiplier: '+68% Dönüşüm Hacmi',
    recommendation: 'Mobil kullanıcılarda sepet tamamlama zirvede. Arama ve Ana Sayfa Vitrin boost çarpanını 1.5x artırın.',
    bestPlacements: ['Arama Sonuçları 1. Sıra', 'Ana Sayfa Vitrin']
  },
  {
    dayName: 'Pazar Günleri (Tüm Gün)',
    peakHours: '14:00 - 22:00',
    conversionMultiplier: '+54% Trafik & Keşif',
    recommendation: 'Kullanıcılar yeni ürün ve hediye keşfediyor. Benzer ürünler ve Kategori Sayfaları yerleşimi maksimum ROI üretir.',
    bestPlacements: ['Kategori Sayfaları', 'Benzer Ürünler']
  },
  {
    dayName: 'Çarşamba Öğle Arası',
    peakHours: '12:00 - 14:00',
    conversionMultiplier: '+38% Hızlı Satın Alma',
    recommendation: 'Ofis ve hızlı tüketim ürünlerinde ani satın almalar gerçekleşiyor.',
    bestPlacements: ['Sepet Önerileri', 'Arama Sonuçları']
  }
];

export const PACKAGE_OFFERS: PackageOffer[] = [
  {
    id: 'pkg-starter',
    name: 'Başlangıç Boost Paketi',
    credits: 2500,
    bonusCredits: 500,
    price: 2500,
    originalPrice: 3000,
    tag: '%20 Bonus Hediye',
    features: [
      '3.000 TL Kullanılabilir Boost Bakiyesi',
      'Standart Arama & Kategori Yerleşimleri',
      'Temel Performans Analitiği',
      'Haftalık Otomatik Raporlama'
    ],
    popular: false
  },
  {
    id: 'pkg-pro-growth',
    name: 'Pro Büyüme & Hızlandırma',
    credits: 7500,
    bonusCredits: 2250,
    price: 7500,
    originalPrice: 9750,
    tag: 'EN ÇOK TERCİH EDİLEN (%30 Bonus)',
    features: [
      '9.750 TL Toplam Boost Kredisi',
      'Tüm Premium Yerleşimler (Vitrin + Sepet Dahil)',
      '10x\'e Varan Turbo Multiplier Desteği',
      'AI Akıllı Zamanlama ve Fiyatlama Önerileri',
      'A/B Kampanya Test Modülü'
    ],
    popular: true
  },
  {
    id: 'pkg-enterprise-vip',
    name: 'Enterprise VIP Turbo',
    credits: 20000,
    bonusCredits: 8000,
    price: 20000,
    originalPrice: 28000,
    tag: '%40 Ekstra Kredi & Özel Danışman',
    features: [
      '28.000 TL Ultra Boost Bakiyesi',
      'Öncelikli Algoritma Dağıtımı & Garantili İlk Sıra',
      'Dedicated Performance Marketing Danışmanı',
      'Gerçek Zamanlı API Entegrasyonu & Webhook',
      'Özel Rakip Fiyat ve Trafik İzleme'
    ],
    popular: false
  }
];

export const INITIAL_WALLET: UserWallet = {
  balance: 4850.00,
  bonusCredits: 1200.00,
  freeBoostsRemaining: 2,
  tier: 'Pro Seller'
};

export const INITIAL_ALERTS: NotificationAlert[] = [
  {
    id: 'alt-1',
    type: 'upgrade',
    title: 'Haftalık Fırsat: %30 Ekstra Boost Kredisi',
    message: 'Pro Büyüme paketinde geçerli 2.250 TL bonus kredi hakkınız hazır. Boost kampanyalarınızı 3 katına çıkarın!',
    timestamp: '10 dk önce',
    actionText: 'Paketleri İncele',
    actionType: 'upgrade',
    isRead: false,
    dismissible: true
  },
  {
    id: 'alt-2',
    type: 'warning',
    title: 'Süresi Dolmak Üzere: "Organik Soğuk Sıkım Yüz Serumu"',
    message: 'Kampanyanın bitmesine 6 saat kaldı. ROAS 8.4x seviyesinde seyrediyor. Satış kaybı yaşamamak için hemen uzatın.',
    timestamp: '25 dk önce',
    actionText: 'Hemen 7 Gün Uzat',
    actionType: 'renew',
    targetCampaignId: 'boost-cmp-002',
    isRead: false,
    dismissible: true
  },
  {
    id: 'alt-3',
    type: 'success',
    title: 'Tebrikler! ROAS Hedefi Aşıldı',
    message: '"Deri Minimalist Cüzdan" kampanyası 9.1x ROAS ile 252.480 TL ciro üretti ve başarıyla tamamlandı.',
    timestamp: '2 saat önce',
    actionText: 'Raporu Görüntüle',
    actionType: 'view_campaign',
    targetCampaignId: 'boost-cmp-005',
    isRead: false,
    dismissible: true
  }
];

export const TIMELINE_ANALYTICS_DATA = [
  { date: '21 Ağu', impressions: 24500, clicks: 1280, spend: 380, revenue: 3200, roas: 8.4 },
  { date: '22 Ağu', impressions: 32100, clicks: 1740, spend: 520, revenue: 4450, roas: 8.5 },
  { date: '23 Ağu', impressions: 41200, clicks: 2310, spend: 710, revenue: 5980, roas: 8.4 },
  { date: '24 Ağu', impressions: 49800, clicks: 2950, spend: 890, revenue: 7620, roas: 8.5 },
  { date: '25 Ağu', impressions: 64200, clicks: 3880, spend: 1150, revenue: 10450, roas: 9.0 },
  { date: '26 Ağu', impressions: 78900, clicks: 4920, spend: 1420, revenue: 13200, roas: 9.3 },
  { date: '27 Ağu (Bugün)', impressions: 82500, clicks: 5120, spend: 1540, revenue: 14650, roas: 9.5 }
];
