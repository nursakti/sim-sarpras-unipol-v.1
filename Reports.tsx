
import React, { useState } from 'react';
import { FileDown, Printer, Filter, Calendar, X, FileText, Table, Clock } from 'lucide-react';
import { Asset, MaintenanceRecord, BorrowingRecord, User } from '../types';
import { STUDY_PROGRAMS } from '../constants';

interface ReportsProps {
  assets: Asset[];
  maintenance: MaintenanceRecord[];
  borrowing: BorrowingRecord[];
  users: User[];
}

type ReportType = 'PERIOD' | 'UNIT' | 'CONDITION' | null;

const Reports: React.FC<ReportsProps> = ({ assets, maintenance, borrowing, users }) => {
  const [activeReport, setActiveReport] = useState<ReportType>(null);
  const [reportData, setReportData] = useState<any>(null);
  
  // State for date filters
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Find the person designated as "Kepala BAUK"
  const kepalaBauk = users.find(u => u.position?.toLowerCase() === 'kepala bauk') || 
                     users.find(u => u.role === 'ADMIN') || 
                     { name: '..........................' };

  const handlePrint = () => {
    if (!activeReport) {
      alert('Silakan generate laporan terlebih dahulu.');
      return;
    }
    window.print();
  };

  const exportToWord = () => {
    const content = document.getElementById('report-preview')?.innerHTML;
    if (!content) return;

    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Export Word</title><style>"+
            "body { font-family: Arial, sans-serif; } table { border-collapse: collapse; width: 100%; } "+
            "th, td { border: 1px solid black; padding: 8px; text-align: left; } "+
            ".text-center { text-align: center; } .font-bold { font-weight: bold; }"+
            "</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_${reportData.title.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    let content = "";
    
    if (reportData.tableRows) {
      content = "<table><thead><tr>";
      reportData.tableHeader.forEach((h: string) => {
        content += `<th style="background-color: #eeeeee; border: 1px solid #000000;">${h}</th>`;
      });
      content += "</tr></thead><tbody>";
      reportData.tableRows.forEach((row: string[]) => {
        content += "<tr>";
        row.forEach(cell => {
          content += `<td style="border: 1px solid #000000;">${cell}</td>`;
        });
        content += "</tr>";
      });
      content += "</tbody></table>";
    } else if (reportData.stats) {
      content = "<table><thead><tr><th>Indikator</th><th>Nilai</th></tr></thead><tbody>";
      reportData.stats.forEach((s: any) => {
        content += `<tr><td style="border: 1px solid #000000;">${s.label}</td><td style="border: 1px solid #000000;">${s.value}</td></tr>`;
      });
      content += "</tbody></table>";
    }

    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:x='urn:schemas-microsoft-com:office:excel' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/vnd.ms-excel'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_${reportData.title.replace(/\s+/g, '_')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateDates = () => {
    if (!startDate || !endDate) {
      alert('Pilih rentang tanggal terlebih dahulu.');
      return false;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert('Tanggal selesai tidak boleh sebelum tanggal mulai.');
      return false;
    }
    return true;
  };

  const generatePeriodReport = () => {
    if (!validateDates()) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredMaintenance = maintenance.filter(m => {
      const d = new Date(m.date);
      return d >= start && d <= end;
    });
    const filteredBorrowing = borrowing.filter(b => {
      const d = new Date(b.borrowDate);
      return d >= start && d <= end;
    });
    const filteredNewAssets = assets.filter(a => {
      const d = new Date(a.purchaseDate);
      return d >= start && d <= end;
    });

    setReportData({
      title: 'Laporan Aktivitas Inventaris',
      period: `${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`,
      stats: [
        { label: 'Aset Baru Terdaftar', value: filteredNewAssets.length },
        { label: 'Kegiatan Pemeliharaan', value: filteredMaintenance.length },
        { label: 'Peminjaman Dilakukan', value: filteredBorrowing.length }
      ],
      details: [
        { section: 'Detail Pengadaan Aset', items: filteredNewAssets.map(a => `${a.code} - ${a.name} (${a.location.studyProgram}) - Rp ${a.price.toLocaleString('id-ID')}`) },
        { section: 'Detail Pemeliharaan & Perbaikan', items: filteredMaintenance.map(m => `${m.assetName}: ${m.description} (Status: ${m.status}) - Rp ${m.cost.toLocaleString('id-ID')}`) },
        { section: 'Detail Peminjaman', items: filteredBorrowing.map(b => `${b.assetName} oleh ${b.borrowerName} (${b.borrowerUnit})`) }
      ]
    });
    setActiveReport('PERIOD');
  };

  const generateUnitReport = () => {
    if (!validateDates()) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const dataByUnit = STUDY_PROGRAMS.map(unit => {
      // Inventory added during the period for each unit
      const unitAssetsInPeriod = assets.filter(a => 
        a.location.studyProgram === unit && 
        new Date(a.purchaseDate) >= start && 
        new Date(a.purchaseDate) <= end
      );
      const totalValue = unitAssetsInPeriod.reduce((sum, a) => sum + a.price, 0);
      return { unit, count: unitAssetsInPeriod.length, value: totalValue };
    });

    setReportData({
      title: 'Laporan Penambahan Aset per Unit',
      period: `${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}`,
      tableHeader: ['Program Studi / Unit', 'Penambahan Aset', 'Total Investasi Baru'],
      tableRows: dataByUnit.map(d => [d.unit, `${d.count} Unit`, `Rp ${d.value.toLocaleString('id-ID')}`])
    });
    setActiveReport('UNIT');
  };

  const generateConditionReport = () => {
    if (!validateDates()) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate condition based on assets status/purchases within or active up to that period
    const conditions = ['Baik', 'Rusak Ringan', 'Rusak Berat'];
    const conditionStats = conditions.map(c => {
      const count = assets.filter(a => 
        a.condition === c && 
        new Date(a.purchaseDate) <= end // Assets that existed by end of period
      ).length;
      return { condition: c, count };
    });

    const totalAssets = conditionStats.reduce((sum, s) => sum + s.count, 0);

    setReportData({
      title: 'Laporan Status Kondisi Aset',
      period: `Hingga ${new Date(endDate).toLocaleDateString('id-ID')}`,
      stats: conditionStats.map(s => ({ 
        label: s.condition, 
        value: `${s.count} Unit (${totalAssets > 0 ? Math.round((s.count / totalAssets) * 100) : 0}%)` 
      })),
      recommendation: `Berdasarkan data hingga ${new Date(endDate).toLocaleDateString('id-ID')}, sistem merekomendasikan peninjauan rutin pada unit dengan status rusak.`
    });
    setActiveReport('CONDITION');
  };

  const DateFilter = () => (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tgl Mulai</label>
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tgl Selesai</label>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-preview, #report-preview * { visibility: visible; }
          #report-preview { position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: white; z-index: 9999; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col sm:items-center justify-between sm:flex-row gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan Inventaris</h1>
          <p className="text-slate-500">Generate laporan sarana prasarana berdasarkan periode waktu.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
            <Calendar size={18} className="text-indigo-600 mr-2" /> Laporan Aktivitas
          </h3>
          <p className="text-xs text-slate-500 mb-6 flex-grow">Ringkasan seluruh aktivitas pengadaan, pemeliharaan, dan peminjaman dalam periode terpilih.</p>
          <DateFilter />
          <button 
            onClick={generatePeriodReport}
            className="w-full py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            Generate Laporan
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
            <Filter size={18} className="text-indigo-600 mr-2" /> Laporan per Unit
          </h3>
          <p className="text-xs text-slate-500 mb-6 flex-grow">Statistik penambahan inventaris baru dan distribusi aset antar program studi pada periode tertentu.</p>
          <DateFilter />
          <button 
            onClick={generateUnitReport}
            className="w-full py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            Generate Laporan
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
            <FileDown size={18} className="text-indigo-600 mr-2" /> Status & Kondisi
          </h3>
          <p className="text-xs text-slate-500 mb-6 flex-grow">Analisis statistik kondisi aset yang tersedia hingga tanggal akhir periode yang ditentukan.</p>
          <DateFilter />
          <button 
            onClick={generateConditionReport}
            className="w-full py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            Generate Laporan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden no-print">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Ringkasan Data Saat Ini</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="p-6">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Nilai Aset</p>
            <p className="text-2xl font-bold text-slate-900">Rp {assets.reduce((sum, a) => sum + a.price, 0).toLocaleString('id-ID')}</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Peminjaman Aktif</p>
            <p className="text-2xl font-bold text-slate-900">{borrowing.filter(b => b.status === 'Aktif').length} Unit</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Biaya Pemeliharaan (YTD)</p>
            <p className="text-2xl font-bold text-slate-900">Rp {maintenance.filter(m => m.status === 'Selesai').reduce((sum, m) => sum + m.cost, 0).toLocaleString('id-ID')}</p>
          </div>
          <div className="p-6">
            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Item Rusak</p>
            <p className="text-2xl font-bold text-red-600">{assets.filter(a => a.condition !== 'Baik').length} Unit</p>
          </div>
        </div>
      </div>

      {activeReport && reportData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between shrink-0 gap-4">
              <h2 className="text-xl font-bold text-slate-900">Pratinjau Laporan</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={handlePrint}
                  className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-bold shadow-sm transition-all active:scale-95"
                >
                  <Printer size={16} className="mr-2" /> Cetak Sekarang
                </button>
                
                <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
                
                <button 
                  onClick={handlePrint} 
                  className="flex items-center bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 text-sm font-bold transition-all"
                >
                  <FileDown size={16} className="mr-1.5" /> PDF
                </button>

                <button 
                  onClick={exportToWord}
                  className="flex items-center bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 text-sm font-bold transition-all"
                >
                  <FileText size={16} className="mr-1.5" /> Word
                </button>

                <button 
                  onClick={exportToExcel}
                  className="flex items-center bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 text-sm font-bold transition-all"
                >
                  <Table size={16} className="mr-1.5" /> Excel
                </button>

                <button 
                  onClick={() => setActiveReport(null)}
                  className="ml-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div id="report-preview" className="flex-1 overflow-y-auto p-10 bg-white">
              <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Sistem Informasi Sarana Prasarana (SIM-SARPRAS)</h1>
                <h2 className="text-xl font-bold text-indigo-700 uppercase mt-1">Universitas Lamappapoleonro</h2>
                <p className="text-sm text-slate-600 font-medium mt-1">Jl. Salotungo Kel. Lalabata Rilau Kec. Lalabata Kab. Soppeng</p>
                <p className="text-xs text-slate-400 mt-1 italic">Laporan Terintegrasi Universitas</p>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-indigo-600">{reportData.title}</h2>
                    <p className="text-slate-500 font-medium">Periode: {reportData.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase">Dokumen Resmi No.</p>
                    <p className="text-sm font-mono font-bold text-slate-900">RPT-{Math.floor(Math.random()*100000)}/SSP/2024</p>
                  </div>
                </div>

                {reportData.stats && (
                  <div className="grid grid-cols-3 gap-6">
                    {reportData.stats.map((s: any, i: number) => (
                      <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{s.label}</p>
                        <p className="text-3xl font-black text-slate-900">{s.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {reportData.tableRows && (
                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-900 text-white text-xs uppercase font-bold tracking-widest">
                        <tr>
                          {reportData.tableHeader.map((h: string, i: number) => (
                            <th key={i} className="px-6 py-4">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reportData.tableRows.map((row: string[], i: number) => (
                          <tr key={i} className="hover:bg-slate-50">
                            {row.map((cell, j) => (
                              <td key={j} className="px-6 py-4 text-sm text-slate-700 font-medium">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reportData.details && (
                  <div className="space-y-6">
                    {reportData.details.map((section: any, i: number) => (
                      <div key={i} className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 uppercase border-l-4 border-indigo-600 pl-3">{section.section}</h3>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          {section.items.map((item: string, j: number) => (
                            <li key={j} className="text-sm text-slate-600 font-medium">{item}</li>
                          ))}
                          {section.items.length === 0 && <li className="text-sm text-slate-400 italic">Tidak ada data untuk bagian ini.</li>}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {reportData.recommendation && (
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 italic text-sm text-indigo-700">
                    <strong>Rekomendasi:</strong> {reportData.recommendation}
                  </div>
                )}

                <div className="mt-16 pt-12 flex justify-end">
                  <div className="text-center w-64">
                    <p className="text-sm text-slate-900 font-bold mb-8">
                      Watansoppeng, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <div className="h-20"></div>
                    <div className="border-t border-slate-900 pt-2">
                      <p className="text-sm font-bold text-slate-900 uppercase">Kepala BAUK</p>
                      <p className="text-sm font-bold text-slate-900 mt-4 underline">{kepalaBauk.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
