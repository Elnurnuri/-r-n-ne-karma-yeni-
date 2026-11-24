import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { BoostCreationCard } from './components/BoostCreationCard';
import { BoostManagement } from './components/BoostManagement';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { SmartFeatures } from './components/SmartFeatures';
import { ExtendBoostModal } from './components/modals/ExtendBoostModal';
import { DuplicateBoostModal } from './components/modals/DuplicateBoostModal';
import { EditBoostModal } from './components/modals/EditBoostModal';
import { CreditTopUpModal } from './components/modals/CreditTopUpModal';
import { CampaignDetailsModal } from './components/modals/CampaignDetailsModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { OnboardingTourModal } from './components/modals/OnboardingTourModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_WALLET, 
  INITIAL_ALERTS 
} from './data/mockData';
import { 
  BoostCampaign, 
  Product, 
  UserWallet, 
  NotificationAlert, 
  BoostPlacement, 
  SmartRecommendation,
  PackageOffer
} from './types';
import { playSound, triggerBoostCelebration } from './utils/feedback';

export default function App() {
  // Persistence state
  const [products] = useState<Product[]>(() => {
    const saved = localStorage.getItem('boost_products_v1');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [campaigns, setCampaigns] = useState<BoostCampaign[]>(() => {
    const saved = localStorage.getItem('boost_campaigns_v1');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [wallet, setWallet] = useState<UserWallet>(() => {
    const saved = localStorage.getItem('boost_wallet_v1');
    return saved ? JSON.parse(saved) : INITIAL_WALLET;
  });

  const [alerts, setAlerts] = useState<NotificationAlert[]>(() => {
    const saved = localStorage.getItem('boost_alerts_v1');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('boost_sound_fx') !== 'false';
  });

  // Modal State
  const [activeModal, setActiveModal] = useState<
    'none' | 'extend' | 'duplicate' | 'edit' | 'topup' | 'details' | 'export' | 'onboarding'
  >('none');
  
  const [selectedCampaignForModal, setSelectedCampaignForModal] = useState<BoostCampaign | null>(null);
  const [preselectedProductIdForBuilder, setPreselectedProductIdForBuilder] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('boost_campaigns_v1', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('boost_wallet_v1', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('boost_alerts_v1', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('boost_sound_fx', soundEnabled.toString());
  }, [soundEnabled]);

  // Toast Dispatcher Helper with Duplicate Prevention
  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string) => {
    setToasts(prev => {
      // Check if an identical toast is already active in the last 1.5 seconds to prevent duplicates
      const isDuplicate = prev.some(t => t.title === title && t.message === message);
      if (isDuplicate) return prev;

      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      setTimeout(() => {
        setToasts(current => current.filter(t => t.id !== id));
      }, 4500);

      return [...prev, { id, type, title, message }];
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Compute Aggregates
  const totalImpressions = useMemo(() => campaigns.reduce((acc, c) => acc + c.impressions, 0), [campaigns]);
  const totalRevenue = useMemo(() => campaigns.reduce((acc, c) => acc + c.revenueGenerated, 0), [campaigns]);
  const totalSpent = useMemo(() => campaigns.reduce((acc, c) => acc + c.spentBudget, 0), [campaigns]);
  const overallRoas = totalSpent > 0 ? totalRevenue / totalSpent : 0;
  const activeCampaignsCount = useMemo(() => campaigns.filter(c => c.status === 'active' || c.status === 'expiring').length, [campaigns]);

  // Real-time gentle performance tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => {
        return prev.map(c => {
          if (c.status === 'active' || c.status === 'expiring') {
            const addedImpressions = Math.floor(Math.random() * 12) + 4;
            const addedClicks = Math.random() > 0.6 ? 1 : 0;
            const addedSpend = Math.round(c.dailyBudget / 1440 * (Math.random() * 2 + 1));
            return {
              ...c,
              impressions: c.impressions + addedImpressions,
              clicks: c.clicks + addedClicks,
              spentBudget: Math.min(c.totalBudget, c.spentBudget + addedSpend)
            };
          }
          return c;
        });
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // 1. Launch New Boost Campaign
  const handleLaunchBoost = (newCmpData: {
    productId: string;
    multiplier: number;
    durationDays: number;
    dailyBudget: number;
    placements: BoostPlacement[];
    autoRenew: boolean;
    notes?: string;
  }) => {
    const product = products.find(p => p.id === newCmpData.productId) || products[0];
    const totalCost = newCmpData.dailyBudget * newCmpData.durationDays;

    if (wallet.balance < totalCost) {
      addToast('error', 'Yetersiz Bakiye', 'Lütfen kampanya öncesi boost kredisi yükleyin.');
      setActiveModal('topup');
      return;
    }

    // Deduct wallet balance
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - totalCost
    }));

    const newCampaign: BoostCampaign = {
      id: 'boost-cmp-' + Date.now(),
      productId: product.id,
      product: product,
      multiplier: newCmpData.multiplier,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + newCmpData.durationDays * 24 * 3600 * 1000).toISOString(),
      durationDays: newCmpData.durationDays,
      placements: newCmpData.placements,
      dailyBudget: newCmpData.dailyBudget,
      totalBudget: totalCost,
      spentBudget: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      conversionRate: 0,
      revenueGenerated: 0,
      roas: 0,
      organicLiftPercent: Math.round(newCmpData.multiplier * 8.5),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      autoRenew: newCmpData.autoRenew,
      notes: newCmpData.notes
    };

    setCampaigns(prev => [newCampaign, ...prev]);

    // Success banner & alert
    const newAlert: NotificationAlert = {
      id: 'alt-launch-' + Date.now(),
      type: 'success',
      title: `Yeni Boost Başlatıldı: ${product.name}`,
      message: `${newCmpData.multiplier}x çarpan ile ${newCmpData.durationDays} günlük kampanya yayına alındı. Algoritma dağıtımı başladı.`,
      timestamp: 'Az önce',
      isRead: false,
      dismissible: true
    };
    setAlerts(prev => [newAlert, ...prev]);

    addToast('boost', 'Kampanya Yayında!', `${product.name} için ${newCmpData.multiplier}x boost aktif edildi.`);
  };

  // 2. Toggle Status (Pause / Resume)
  const handleToggleStatus = (campaignId: string) => {
    const target = campaigns.find(c => c.id === campaignId);
    if (!target) return;

    const nextStatus = target.status === 'paused' ? 'active' : 'paused';
    const msg = nextStatus === 'paused' ? 'Kampanya duraklatıldı.' : 'Kampanya yeniden başlatıldı.';
    addToast('info', msg, target.product.name);

    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return { ...c, status: nextStatus, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
  };

  // 3. Extend Campaign
  const handleConfirmExtend = (campaignId: string, additionalDays: number, additionalBudget: number) => {
    if (wallet.balance < additionalBudget) {
      addToast('error', 'Yetersiz Bakiye', 'Lütfen boost kredisi yükleyin.');
      setActiveModal('topup');
      return;
    }

    setWallet(prev => ({
      ...prev,
      balance: prev.balance - additionalBudget
    }));

    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        const currentEnd = new Date(c.endDate).getTime();
        const baseTime = currentEnd > Date.now() ? currentEnd : Date.now();
        const newEnd = new Date(baseTime + additionalDays * 24 * 3600 * 1000).toISOString();
        return {
          ...c,
          status: 'active',
          durationDays: c.durationDays + additionalDays,
          totalBudget: c.totalBudget + additionalBudget,
          endDate: newEnd,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    setActiveModal('none');
    addToast('success', 'Süre Başarıyla Uzatıldı!', `+${additionalDays} gün ilave edildi.`);
  };

  // 4. Duplicate Campaign
  const handleConfirmDuplicate = (targetProductId: string, multiplier: number, durationDays: number, dailyBudget: number) => {
    const product = products.find(p => p.id === targetProductId) || products[0];
    const totalCost = dailyBudget * durationDays;

    if (wallet.balance < totalCost) {
      addToast('error', 'Yetersiz Bakiye', 'Kredi bakiyeniz yetersiz.');
      setActiveModal('topup');
      return;
    }

    setWallet(prev => ({
      ...prev,
      balance: prev.balance - totalCost
    }));

    const newCampaign: BoostCampaign = {
      id: 'boost-cmp-' + Date.now(),
      productId: product.id,
      product: product,
      multiplier,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + durationDays * 24 * 3600 * 1000).toISOString(),
      durationDays,
      placements: ['search_top', 'category_page', 'similar_products'],
      dailyBudget,
      totalBudget: totalCost,
      spentBudget: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      conversionRate: 0,
      revenueGenerated: 0,
      roas: 0,
      organicLiftPercent: Math.round(multiplier * 7.5),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      autoRenew: true,
      notes: `${product.name} Çoğaltılmış Boost`
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setActiveModal('none');
    addToast('boost', 'Kampanya Çoğaltıldı!', `${product.name} için yeni boost başlatıldı.`);
  };

  // 5. Edit Campaign
  const handleSaveEdit = (campaignId: string, multiplier: number, dailyBudget: number, autoRenew: boolean, notes: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        return {
          ...c,
          multiplier,
          dailyBudget,
          autoRenew,
          notes,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    setActiveModal('none');
    addToast('success', 'Kampanya Güncellendi', 'Yeni bütçe ve çarpan ayarları kaydedildi.');
  };

  // 6. Delete / Cancel Campaign
  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    addToast('info', 'Kampanya İptal Edildi', 'Kampanya listeden kaldırıldı.');
  };

  // 7. Top Up Credit Balance
  const handleConfirmTopUp = (pkg: PackageOffer) => {
    const totalCredit = pkg.credits + pkg.bonusCredits;
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + totalCredit,
      bonusCredits: prev.bonusCredits + pkg.bonusCredits
    }));

    setActiveModal('none');
    addToast('boost', 'Kredi Başarıyla Yüklendi!', `${pkg.name} aktif edildi. +${totalCredit.toLocaleString('tr-TR')} TL bakiyenize eklendi.`);
  };

  // 8. Bulk Operations
  const handleBulkExtend = (ids: string[]) => {
    ids.forEach(id => {
      handleConfirmExtend(id, 7, 700);
    });
    addToast('success', 'Toplu Uzatma Başarılı', `${ids.length} adet kampanya 7 gün uzatıldı.`);
  };

  const handleBulkPause = (ids: string[]) => {
    setCampaigns(prev => prev.map(c => {
      if (ids.includes(c.id)) {
        return { ...c, status: c.status === 'paused' ? 'active' : 'paused' };
      }
      return c;
    }));
    addToast('info', 'Toplu Durum Değiştirildi', `${ids.length} adet kampanya güncellendi.`);
  };

  const handleBulkExport = () => {
    setActiveModal('export');
  };

  const handleBulkDelete = (ids: string[]) => {
    setCampaigns(prev => prev.filter(c => !ids.includes(c.id)));
    addToast('info', 'Toplu İptal', `${ids.length} kampanya kaldırıldı.`);
  };

  // Alert Click Handlers
  const handleAlertClick = (alert: NotificationAlert) => {
    if (alert.actionType === 'upgrade') {
      setActiveModal('topup');
    } else if (alert.actionType === 'renew' && alert.targetCampaignId) {
      const cmp = campaigns.find(c => c.id === alert.targetCampaignId);
      if (cmp) {
        setSelectedCampaignForModal(cmp);
        setActiveModal('extend');
      }
    } else if (alert.actionType === 'view_campaign' && alert.targetCampaignId) {
      const cmp = campaigns.find(c => c.id === alert.targetCampaignId);
      if (cmp) {
        setSelectedCampaignForModal(cmp);
        setActiveModal('details');
      }
    }

    // Mark as read
    setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, isRead: true } : a));
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Apply Smart Recommendation directly to creation builder
  const handleApplyRecommendation = (rec: SmartRecommendation) => {
    setPreselectedProductIdForBuilder(rec.productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('boost', 'AI Öneri Formuna Yüklendi', `${rec.productName} için ${rec.suggestedMultiplier}x boost ayarlandı.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-orange-500 selection:text-white">
      
      {/* Header */}
      <Header
        wallet={wallet}
        alerts={alerts}
        onOpenNewBoost={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          addToast('info', 'Boost Oluşturucu', 'Aşağıdaki formu kullanarak yeni boost başlatabilirsiniz.');
        }}
        onOpenCreditTopUp={() => setActiveModal('topup')}
        onOpenOnboarding={() => setActiveModal('onboarding')}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          if (next) playSound('success');
        }}
        onAlertClick={handleAlertClick}
        activeCount={activeCampaignsCount}
        totalImpressions={totalImpressions}
        overallRoas={overallRoas}
        totalRevenue={totalRevenue}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dynamic Alerts Banner */}
        <AlertBanner
          alerts={alerts}
          onDismiss={handleDismissAlert}
          onActionClick={handleAlertClick}
          onOpenCreditTopUp={() => setActiveModal('topup')}
        />

        {/* Boost Creation Form Card (Interactive Simulator & Builder) */}
        <BoostCreationCard
          products={products}
          walletBalance={wallet.balance}
          onLaunchBoost={handleLaunchBoost}
          onOpenCreditTopUp={() => setActiveModal('topup')}
          preselectedProductId={preselectedProductIdForBuilder}
        />

        {/* Boost Management Dashboard (Cards & Table) */}
        <BoostManagement
          campaigns={campaigns}
          onToggleStatus={handleToggleStatus}
          onExtendCampaign={(cmp) => {
            setSelectedCampaignForModal(cmp);
            setActiveModal('extend');
          }}
          onEditCampaign={(cmp) => {
            setSelectedCampaignForModal(cmp);
            setActiveModal('edit');
          }}
          onDuplicateCampaign={(cmp) => {
            setSelectedCampaignForModal(cmp);
            setActiveModal('duplicate');
          }}
          onDeleteCampaign={handleDeleteCampaign}
          onViewDetails={(cmp) => {
            setSelectedCampaignForModal(cmp);
            setActiveModal('details');
          }}
          onBulkExtend={handleBulkExtend}
          onBulkPause={handleBulkPause}
          onBulkExport={handleBulkExport}
          onBulkDelete={handleBulkDelete}
        />

        {/* Advanced Analytics & ROI Charts */}
        <AdvancedAnalytics
          campaigns={campaigns}
          onExportReport={() => setActiveModal('export')}
        />

        {/* Smart AI Features & Strategic Optimizers */}
        <SmartFeatures
          onApplyRecommendation={handleApplyRecommendation}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-700">BoostMaster Engine v2.4</span>
            <span>• Algoritma ve Açık Artırma API Entegrasyonu Aktif</span>
          </div>
          <div>
            Performance Marketing & E-Ticaret Ürün Öne Çıkarma Yönetim Paneli
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeModal === 'extend' && (
        <ExtendBoostModal
          campaign={selectedCampaignForModal}
          walletBalance={wallet.balance}
          onClose={() => setActiveModal('none')}
          onConfirmExtend={handleConfirmExtend}
          onOpenCreditTopUp={() => setActiveModal('topup')}
        />
      )}

      {activeModal === 'duplicate' && (
        <DuplicateBoostModal
          campaign={selectedCampaignForModal}
          products={products}
          walletBalance={wallet.balance}
          onClose={() => setActiveModal('none')}
          onConfirmDuplicate={handleConfirmDuplicate}
        />
      )}

      {activeModal === 'edit' && (
        <EditBoostModal
          campaign={selectedCampaignForModal}
          onClose={() => setActiveModal('none')}
          onSaveEdit={handleSaveEdit}
        />
      )}

      {activeModal === 'topup' && (
        <CreditTopUpModal
          wallet={wallet}
          onClose={() => setActiveModal('none')}
          onConfirmTopUp={handleConfirmTopUp}
        />
      )}

      {activeModal === 'details' && (
        <CampaignDetailsModal
          campaign={selectedCampaignForModal}
          onClose={() => setActiveModal('none')}
          onExtend={(cmp) => {
            setSelectedCampaignForModal(cmp);
            setActiveModal('extend');
          }}
        />
      )}

      {activeModal === 'export' && (
        <ExportReportModal
          campaigns={campaigns}
          onClose={() => setActiveModal('none')}
        />
      )}

      {activeModal === 'onboarding' && (
        <OnboardingTourModal
          onClose={() => setActiveModal('none')}
          onStartCreating={() => {
            setActiveModal('none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Toast Feedback System */}
      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
      />

    </div>
  );
}
