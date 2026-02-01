
import React, { useState } from 'react';
import { Plus, Search, Calendar, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';
import { MaintenanceRecord, Asset, UserRole, AppNotification } from '../types';

interface MaintenanceProps {
  maintenance: MaintenanceRecord[];
  setMaintenance: React.Dispatch<React.SetStateAction<MaintenanceRecord[]>>;
  assets: Asset[];
  role: UserRole;
  notify: (msg: string, type: AppNotification['type']) => void;
}

const Maintenance: React.FC<MaintenanceProps> = ({ maintenance, setMaintenance, assets, role, notify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    const cost = Number(formData.get('cost'));
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;

    if (isNaN(cost) || cost < 0) newErrors.cost = 'Biaya tidak boleh negatif.';
    if (!description || description.trim().length < 5) newErrors.description = 'Deskripsi minimal 5 karakter.';
    if (!date) newErrors.date = 'Tanggal pemeliharaan wajib diisi.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!validate(formData)) return;

    const assetId = formData.get('assetId') as string;
    const asset = assets.find(a => a.id === assetId);

    const newRecord: MaintenanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      assetId,
      assetName: asset?.name || 'Unknown Asset',
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as any,
      cost: Number(formData.get('cost')),
      performedBy: formData.get('performedBy') as string,
      status: formData.get('status') as any,
    };

    setMaintenance([...maintenance, newRecord]);
    notify(`Pencatatan pemeliharaan untuk "${newRecord.assetName}" berhasil disimpan.`, 'success');
    setIsModalOpen(false);
    setErrors({});
  };

  const markComplete = (id: string) => {
    const record = maintenance.find(m => m.id === id);
    setMaintenance(maintenance.map(m => m.id === id ? { ...m, status: 'Selesai' } : m));
    notify(`Pemeliharaan "${record?.assetName}" telah ditandai selesai.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:items-center justify-between sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pemeliharaan & Perbaikan</h1>
          <p className="text-slate-500">Rekam jejak pemeliharaan aset berkala.</p>
        </div>
        {(role === 'ADMIN' || role === 'OFFICER' || role === 'UNIT_USER') && (
          <button 
            onClick={() => { setErrors({}); setIsModalOpen(true); }}
            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-semibold"
          >
            <Plus size={20} className="mr-2" /> Ajukan/Rekam Pemeliharaan
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {maintenance.map((record) => (
          <div key={record.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group hover:border-indigo-200 transition-colors">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                  ${record.type === 'Rutin' ? 'bg-blue-100 text-blue-700' : 
                    record.type === 'Perbaikan' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                  {record.type}
                </span>
                <span className={`flex items-center text-[10px] font-bold uppercase
                  ${record.status === 'Selesai' ? 'text-green-600' : 'text-orange-600'}`}>
                  {record.status === 'Selesai' ? <CheckCircle2 size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                  {record.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{record.assetName}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[40px]">{record.description}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Tanggal</p>
                  <p className="text-sm font-medium text-slate-700">{record.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Biaya</p>
                  <p className="text-sm font-medium text-slate-700">Rp {record.cost.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
            {record.status === 'Proses' && (role === 'ADMIN' || role === 'OFFICER') && (
              <button 
                onClick={() => markComplete(record.id)}
                className="w-full py-2.5 bg-slate-50 text-slate-600 hover:bg-green-600 hover:text-white text-sm font-bold transition-all border-t border-slate-100"
              >
                Tandai Selesai
              </button>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Rekam Pemeliharaan</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Aset</label>
                <select name="assetId" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                  {assets.map(asset => <option key={asset.id} value={asset.id}>{asset.code} - {asset.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                  <input name="date" type="date" required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.date ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} />
                  {errors.date && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
                  <select name="type" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="Rutin">Rutin</option>
                    <option value="Perbaikan">Perbaikan</option>
                    <option value="Penggantian">Penggantian</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Masalah/Tindakan</label>
                <textarea name="description" rows={3} required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.description ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} placeholder="Jelaskan detail pemeliharaan..."></textarea>
                {errors.description && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Biaya (Rp)</label>
                  <input name="cost" type="number" required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${errors.cost ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} />
                  {errors.cost && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.cost}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pelaksana</label>
                  <input name="performedBy" required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Vendor / Staff IT" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Awal</label>
                <select name="status" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all font-bold">Simpan Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
