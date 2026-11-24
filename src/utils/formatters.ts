export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCurrencyDetailed = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('tr-TR').format(num);
};

export const formatPercent = (val: number): string => {
  return `%${val.toFixed(1).replace('.', ',')}`;
};

export const formatMultiplier = (multiplier: number): string => {
  return `${multiplier.toFixed(1)}x`;
};

export const getMultiplierLevel = (multiplier: number): {
  label: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  glowColor: string;
  description: string;
} => {
  if (multiplier < 2.5) {
    return {
      label: 'Standart Boost',
      badgeBg: 'bg-amber-50',
      badgeBorder: 'border-amber-200',
      badgeText: 'text-amber-700',
      glowColor: 'shadow-amber-500/20',
      description: 'Temel arama görünürlüğü ve kategori listelemesi'
    };
  } else if (multiplier < 4.5) {
    return {
      label: 'Güçlü Boost',
      badgeBg: 'bg-orange-50',
      badgeBorder: 'border-orange-200',
      badgeText: 'text-orange-700',
      glowColor: 'shadow-orange-500/30',
      description: 'Yüksek trafikli aramalarda ilk 3 sıra ve benzer ürün vitrini'
    };
  } else if (multiplier < 7.5) {
    return {
      label: 'Turbo Boost',
      badgeBg: 'bg-gradient-to-r from-orange-500 to-amber-500',
      badgeBorder: 'border-orange-400',
      badgeText: 'text-white',
      glowColor: 'shadow-orange-500/40',
      description: 'Arama 1. sıra garantisi, ana sayfa vitrini ve sepet önerisi'
    };
  } else {
    return {
      label: 'Ultra Nitro Boost',
      badgeBg: 'bg-gradient-to-r from-amber-500 via-orange-600 to-red-600',
      badgeBorder: 'border-red-400',
      badgeText: 'text-white font-bold',
      glowColor: 'shadow-red-500/50',
      description: 'Maksimum algoritma önceliği & çapraz platform reklam dağıtımı'
    };
  }
};

export const getStatusDetails = (status: string) => {
  switch (status) {
    case 'active':
      return {
        label: 'Aktif Boost',
        color: 'emerald',
        bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500 animate-pulse'
      };
    case 'expiring':
      return {
        label: 'Süresi Azalıyor',
        color: 'amber',
        bg: 'bg-amber-500/10 text-amber-800 border-amber-300',
        dot: 'bg-amber-500 animate-ping'
      };
    case 'paused':
      return {
        label: 'Duraklatıldı',
        color: 'slate',
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        dot: 'bg-slate-400'
      };
    case 'completed':
      return {
        label: 'Tamamlandı',
        color: 'blue',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500'
      };
    case 'scheduled':
      return {
        label: 'Planlandı',
        color: 'purple',
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500'
      };
    default:
      return {
        label: status,
        color: 'slate',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400'
      };
  }
};

export const getPlacementInfo = (placement: string) => {
  switch (placement) {
    case 'search_top':
      return { label: 'Arama Sonuçları 1. Sıra', icon: 'Search', desc: 'Arama kelimelerinde en tepede çıkın' };
    case 'category_page':
      return { label: 'Kategori Vitrini', icon: 'Layers', desc: 'İlgili ana ve alt kategorilerde öncelik' };
    case 'similar_products':
      return { label: 'Benzer Ürünler / Çapraz Satış', icon: 'Sparkles', desc: 'Rakip ürün detay sayfalarında çıkın' };
    case 'homepage_showcase':
      return { label: 'Ana Sayfa Öne Çıkanlar', icon: 'Home', desc: 'Milyonlarca ziyaretçiye ana sayfada görün' };
    case 'cart_recommends':
      return { label: 'Sepet & Ödeme Önerisi', icon: 'ShoppingCart', desc: 'Satın alma aşamasında tamamlayıcı ürün önerisi' };
    default:
      return { label: placement, icon: 'Globe', desc: 'Dijital vitrin yerleşimi' };
  }
};

export const getTimeRemainingText = (endDateStr: string): { text: string; isUrgent: boolean; percentLeft: number } => {
  const end = new Date(endDateStr).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) {
    return { text: 'Süre Doldu', isUrgent: false, percentLeft: 0 };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return {
      text: `${days} gün ${remainingHours} sa kaldı`,
      isUrgent: days <= 1,
      percentLeft: Math.min(100, Math.max(10, (diff / (7 * 24 * 3600 * 1000)) * 100))
    };
  } else {
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return {
      text: `${hours} sa ${mins} dk kaldı`,
      isUrgent: true,
      percentLeft: Math.max(5, (diff / (24 * 3600 * 1000)) * 100)
    };
  }
};
