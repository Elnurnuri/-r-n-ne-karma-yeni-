import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Mail, Table } from 'lucide-react';
import { BoostCampaign } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { playSound } from '../../utils/feedback';

interface ExportReportModalProps {
  campaigns: BoostCampaign[];
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  campaigns,
  onClose
}) => {
  const [format, setFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [emailTo, setEmailTo] = useState('satici@magaza.com');
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    playSound('success');

    // Simulate file generation
    setTimeout(() => {
      if (format === 'csv') {
        const headers = 'Kampanya ID,Urun Adi,SKU,Carpan,Durum,Gosterim,Tiklama,CTR,Harcama(TL),Ciro(TL),ROAS\n';
        const rows = campaigns.map(c => 
          `"${c.id}","${c.product.name}","${c.product.sku}",${c.multiplier}x,"${c.status}",${c.impressions},${c.clicks},%${c.ctr},${c.spentBudget},${c.revenueGenerated},${c.roas}x`
        ).join('\n');
        
        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `boost_performans_raporu_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setIsExporting(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-auto max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Performans Raporunu Dışa Aktar</h3>
              <p className="text-xs text-slate-500">Tüm metrikleri ve finansal dökümü indirin.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Rapor Başarıyla İndirildi</h4>
            <p className="text-xs text-slate-500">
              {campaigns.length} adet kampanya verisi içeren performans raporu dosyanız hazırlandı.
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Tamam
            </button>
          </div>
        ) : (
          <>
            {/* Format Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Rapor Formatı:</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'csv', name: 'CSV (Excel)', icon: Table },
                  { id: 'pdf', name: 'PDF Özeti', icon: FileText },
                  { id: 'excel', name: 'XLSX Raporu', icon: Table }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        playSound('click');
                        setFormat(item.id as any);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        format === item.id
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-black ring-2 ring-orange-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-bold'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                      <div className="text-xs">{item.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email send optional */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">E-posta ile Gönder (Opsiyonel)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={onClose} className="w-1/3 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                Vazgeç
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isExporting ? (
                  <span>Rapor Oluşturuluyor...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Raporu Oluştur ve İndir</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
