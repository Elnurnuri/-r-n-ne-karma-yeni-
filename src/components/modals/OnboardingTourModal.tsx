import React, { useState } from 'react';
import { X, Rocket, Sparkles, Target, TrendingUp, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { playSound } from '../../utils/feedback';

interface OnboardingTourModalProps {
  onClose: () => void;
  onStartCreating: () => void;
}

const STEPS = [
  {
    title: 'Ürün Öne Çıkarma (Boost) Nedir?',
    desc: 'Boost sistemi, e-ticaret mağazanızdaki ürünlerin arama sonuçlarında en üstte, kategori vitrinlerinde ve rakip ürün detay sayfalarında 10 kata kadar daha fazla görünmesini sağlar.',
    icon: Rocket,
    tag: 'Temel Prensip'
  },
  {
    title: 'Boost Çarpanı (Multiplier) Nasıl Çalışır?',
    desc: '1.0x ile 10.0x arasında çarpan belirleyebilirsiniz. 3.5x önerilen optimum seviyedir; 7.0x ve üzeri Turbo modlar ana sayfa vitrininde garantili ilk sıra yerleşimi sağlar.',
    icon: Sparkles,
    tag: 'Algoritma Gücü'
  },
  {
    title: 'Akıllı Yerleşim Kanalları',
    desc: 'Arama Sonuçları, Kategori Sayfaları, Çapraz Satış Önerileri ve Sepet Sayfası olmak üzere 5 farklı stratejik noktada müşterilere ulaşırsınız.',
    icon: Target,
    tag: 'Kanallar'
  },
  {
    title: 'Yüksek ROAS & Ciro Odaklı Büyüme',
    desc: 'Sistem ortalama 7.8x ROAS (Reklam Getirisi) üretir. İstediğiniz zaman kampanyayı duraklatabilir, süresini uzatabilir ve anlık analiz edebilirsiniz.',
    icon: TrendingUp,
    tag: 'Performans & ROI'
  }
];

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  onClose,
  onStartCreating
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const stepData = STEPS[currentStep];
  const StepIcon = stepData.icon;

  const nextStep = () => {
    playSound('click');
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartCreating();
    }
  };

  const prevStep = () => {
    playSound('click');
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        {/* Header & Step progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-8 bg-orange-500'
                    : idx < currentStep
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="text-center space-y-4 py-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-orange-500/25">
            <StepIcon className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            {stepData.tag} ({currentStep + 1}/{STEPS.length})
          </span>

          <h3 className="text-xl font-black text-slate-900">{stepData.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {stepData.desc}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {currentStep > 0 ? (
            <button
              onClick={prevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Atla
            </button>
          )}

          <button
            onClick={nextStep}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{currentStep === STEPS.length - 1 ? 'Hemen Başlayın' : 'Devam Et'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
