
import React, { useState } from 'react';
import { Plus, Search, Calendar, CheckCircle2, AlertCircle, X, Check, Ban } from 'lucide-react';
import { BorrowingRecord, Asset, UserRole, AppNotification, WorkUnit } from '../types';

interface BorrowingProps {
  borrowing: BorrowingRecord[];
  setBorrowing: React.Dispatch<React.SetStateAction<BorrowingRecord[]>>;
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  workUnits: WorkUnit[];
  role: UserRole;
  notify: (msg: string, type: AppNotification['type']) => void;
}

const Borrowing: React.FC<BorrowingProps> = ({ borrowing, setBorrowing, assets, setAssets, workUnits, role, notify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBorrowing = borrowing.filter(b => 
    b.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.borrowerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validate = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    const borrowDate = formData.get('borrowDate') as string;
    const dueDate = formData.get('dueDate') as string;
    const borrowerName = formData.get('borrowerName') as string;
    const borrowerUnit = formData.get('borrowerUnit') as string;
    const assetId = formData.get('assetId') as string;

    if (!assetId) newErrors.assetId = 'Pilih aset yang ingin dipinjam.';
    if (!borrowerName || borrowerName.trim().length < 3) newErrors.borrowerName = 'Nama peminjam minimal 3 karakter.';
    if (!borrowerUnit) newErrors.borrowerUnit = 'Pilih unit kerja peminjam.';
    if (!borrowDate) newErrors.borrowDate = 'Tanggal pinjam wajib diisi.';
    if (!dueDate) newErrors.dueDate = 'Tenggat kembali wajib diisi.';
    
    if (borrowDate && dueDate) {
        if (new Date(dueDate) < new Date(borrowDate)) {
            newErrors.dueDate = 'Tenggat kembali tidak boleh sebelum tanggal pinjam.';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!validate(formData)) return;

    const assetId = formData.get('assetId') as string;
    const asset = assets.find(a => a.id === assetId);

    if (asset?.status !== 'Tersedia') {
      alert('Aset sedang tidak tersedia untuk dipinjam.');
      return;
    }

    const newRecord: BorrowingRecord = {
      id: Math.random().toString(36).substr(2, 9),
      assetId,
      assetName: asset?.name || 'Unknown Asset',
      borrowerName: formData.get('borrowerName') as string,
      borrowerUnit: formData.get('borrowerUnit') as string,
      borrowDate: formData.get('borrowDate') as string,
      dueDate: formData.get('dueDate') as string,
      status: 'Menunggu Persetujuan',
      notes: formData.get('notes') as string,
    };

    setBorrowing([...borrowing, newRecord]);
    notify(`Pengajuan peminjaman "${newRecord.assetName}" telah dikirim dan menunggu persetujuan.`, 'info');
    setIsModalOpen(false);
    setErrors({});
  };

  const handleApprove = (record: BorrowingRecord) => {
    const asset = assets.find(a => a.id === record.assetId);
    if (asset?.status !== 'Tersedia') {
      notify("Gagal menyetujui: Aset sudah tidak tersedia.", "error");
      return;
    }

    setBorrowing(borrowing.map(b => b.id === record.id ? { ...b, status: 'Aktif' } : b));
    setAssets(assets.map(a => a.id === record.assetId ? { ...a, status: 'Dipinjam' } : a));
    notify(`Peminjaman "${record.assetName}" disetujui. Status aset berubah menjadi DIPINJAM.`, 'success');
  };

  const handleReject = (record: BorrowingRecord) => {
    setBorrowing(borrowing.map(b => b.id === record.id ? { ...b, status: 'Ditolak' } : b));
    notify(`Permintaan peminjaman "${record.assetName}" oleh ${record.borrowerName} ditolak.`, 'info');
  };

  const handleReturn = (record: BorrowingRecord) => {
    if (window.confirm(`Proses pengembalian ${record.assetName}?`)) {
      setBorrowing(borrowing.map(b => b.id === record.id ? { ...b, status: 'Kembali', returnDate: new Date().toISOString().split('T')[0] } : b));
      setAssets(assets.map(a => a.id === record.assetId ? { ...a, status: 'Tersedia' } : a));
      notify(`Aset "${record.assetName}" telah resmi dikembalikan.`, 'success');
    }
  };

  const getStatusStyle = (status: BorrowingRecord['status']) => {
    switch (status) {
      case 'Menunggu Persetujuan': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Aktif': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Kembali': return 'bg-green-100 text-green-700 border-green-200';
      case 'Ditolak': return 'bg-red-100 text-red-700 border-red-200';
      case 'Terlambat': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:items-center justify-between sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Peminjaman Aset</h1>
          <p className="text-slate-500">Kelola pengajuan dan pemanfaatan aset oleh unit kerja.</p>
        </div>
        {(role === 'ADMIN' || role === 'OFFICER' || role === 'UNIT_USER') && (
          <button 
            onClick={() => { setErrors({}); setIsModalOpen(true); }}
            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-semibold"
          >
            <Plus size={20} className="mr-2" /> Buat Peminjaman
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Cari peminjam atau nama aset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Aset & Peminjam</th>
                <th className="px-6 py-4">Tgl Pinjam</th>
                <th className="px-6 py-4">Tenggat Kembali</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBorrowing.length > 0 ? filteredBorrowing.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">{record.assetName}</p>
                    <p className="text-xs text-slate-400">{record.borrowerName} • {record.borrowerUnit}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.borrowDate}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{record.dueDate}</p>
                    {record.status === 'Aktif' && new Date(record.dueDate) < new Date() && (
                      <span className="text-[10px] text-red-500 font-bold uppercase flex items-center mt-1">
                        <AlertCircle size={10} className="mr-1" /> Terlambat
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {record.status === 'Menunggu Persetujuan' && (role === 'ADMIN' || role === 'OFFICER') && (
                        <>
                          <button 
                            onClick={() => handleApprove(record)}
                            className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 text-xs font-bold transition-all"
                          >
                            <Check size={14} /> Setujui
                          </button>
                          <button 
                            onClick={() => handleReject(record)}
                            className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100 text-xs font-bold transition-all"
                          >
                            <Ban size={14} /> Tolak
                          </button>
                        </>
                      )}
                      
                      {record.status === 'Aktif' && (role === 'ADMIN' || role === 'OFFICER') && (
                        <button 
                          onClick={() => handleReturn(record)}
                          className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 text-xs font-bold transition-all"
                        >
                          Kembalikan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">Tidak ada data peminjaman.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Form Peminjaman</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                <p className="text-xs text-blue-700 flex items-start">
                  <AlertCircle size={14} className="mr-2 mt-0.5 shrink-0" />
                  Pilih unit kerja dari daftar yang sudah tersimpan di sistem.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Aset (Tersedia)</label>
                <select name="assetId" required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.assetId ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}>
                  <option value="">Pilih Aset...</option>
                  {assets.filter(a => a.status === 'Tersedia').map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.code} - {asset.name}</option>
                  ))}
                </select>
                {errors.assetId && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.assetId}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Peminjam</label>
                  <input name="borrowerName" required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.borrowerName ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} placeholder="Nama lengkap..." />
                  {errors.borrowerName && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.borrowerName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Kerja Peminjam</label>
                  <select name="borrowerUnit" required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.borrowerUnit ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}>
                    <option value="">Pilih Unit...</option>
                    {workUnits.map(unit => (
                      <option key={unit.id} value={unit.name}>{unit.name}</option>
                    ))}
                  </select>
                  {errors.borrowerUnit && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.borrowerUnit}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tgl Pinjam</label>
                  <input name="borrowDate" type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tenggat Kembali</label>
                  <input name="dueDate" type="date" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catatan / Keperluan</label>
                <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Alasan peminjaman..."></textarea>
              </div>
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all font-bold">Kirim Pengajuan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Borrowing;
