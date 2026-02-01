
import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Eye, X, AlertCircle } from 'lucide-react';
import { Asset, UserRole, AssetCondition, AssetStatus, AppNotification, Category } from '../types';
import { STUDY_PROGRAMS } from '../constants';

interface AssetsProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  role: UserRole;
  notify: (msg: string, type: AppNotification['type']) => void;
  categories: Category[];
}

const Assets: React.FC<AssetsProps> = ({ assets, setAssets, role, notify, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStudyProgram, setFilterStudyProgram] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredAssets = assets.filter(asset => 
    (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     asset.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStudyProgram === '' || asset.location.studyProgram === filterStudyProgram)
  );

  const validate = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const purchaseDate = formData.get('purchaseDate') as string;
    const category = formData.get('category') as string;

    if (!code || code.trim().length < 3) newErrors.code = 'Kode aset minimal 3 karakter.';
    if (!name || name.trim().length < 3) newErrors.name = 'Nama aset minimal 3 karakter.';
    if (!category) newErrors.category = 'Pilih kategori aset.';
    if (isNaN(price) || price <= 0) newErrors.price = 'Harga harus berupa angka positif.';
    if (!purchaseDate) newErrors.purchaseDate = 'Tanggal perolehan wajib diisi.';
    
    if (!editingAsset || editingAsset.code !== code) {
        if (assets.some(a => a.code === code)) newErrors.code = 'Kode aset sudah terdaftar di sistem.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (id: string) => {
    const asset = assets.find(a => a.id === id);
    if (window.confirm(`Apakah Anda yakin ingin menghapus aset ${asset?.name}?`)) {
      setAssets(assets.filter(a => a.id !== id));
      notify(`Aset "${asset?.name}" berhasil dihapus dari sistem.`, 'info');
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!validate(formData)) return;

    const newAsset: Asset = {
      id: editingAsset?.id || Math.random().toString(36).substr(2, 9),
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      type: formData.get('type') as string,
      location: {
        building: formData.get('building') as string,
        room: formData.get('room') as string,
        studyProgram: formData.get('studyProgram') as string,
      },
      condition: formData.get('condition') as AssetCondition,
      status: (editingAsset?.status || 'Tersedia') as AssetStatus,
      purchaseDate: formData.get('purchaseDate') as string,
      price: Number(formData.get('price')),
    };

    if (editingAsset) {
      setAssets(assets.map(a => a.id === editingAsset.id ? newAsset : a));
      notify(`Perubahan pada aset "${newAsset.name}" berhasil disimpan.`, 'success');
    } else {
      setAssets([...assets, newAsset]);
      notify(`Aset baru "${newAsset.name}" berhasil didaftarkan.`, 'success');
    }
    setIsModalOpen(false);
    setEditingAsset(null);
    setErrors({});
  };

  const handleView = (asset: Asset) => {
    setViewingAsset(asset);
    setIsViewModalOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setErrors({});
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Inventaris Aset</h1>
          <p className="text-slate-500">Kelola dan pantau seluruh sarana prasarana universitas.</p>
        </div>
        {(role === 'ADMIN' || role === 'OFFICER') && (
          <button 
            onClick={() => { setEditingAsset(null); setErrors({}); setIsModalOpen(true); }}
            className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-semibold"
          >
            <Plus size={20} className="mr-2" /> Tambah Aset
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Cari berdasarkan kode atau nama aset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="block w-full md:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filterStudyProgram}
            onChange={(e) => setFilterStudyProgram(e.target.value)}
          >
            <option value="">Semua Program Studi</option>
            {STUDY_PROGRAMS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Kode & Nama</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Lokasi</th>
                <th className="px-6 py-4">Kondisi</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-xs font-mono text-slate-400 mb-0.5">{asset.code}</p>
                    <p className="text-sm font-semibold text-slate-900">{asset.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{asset.category}</p>
                    <p className="text-xs text-slate-400">{asset.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{asset.location.room}</p>
                    <p className="text-xs text-slate-400">{asset.location.building} • {asset.location.studyProgram}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${asset.condition === 'Baik' ? 'bg-green-100 text-green-700' : 
                        asset.condition === 'Rusak Ringan' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${asset.status === 'Tersedia' ? 'bg-indigo-100 text-indigo-700' : 
                        asset.status === 'Dipinjam' ? 'bg-slate-100 text-slate-600' : 'bg-yellow-100 text-yellow-700'}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleView(asset)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      {(role === 'ADMIN' || role === 'OFFICER') && (
                        <>
                          <button 
                            onClick={() => handleEdit(asset)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(asset.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">{editingAsset ? 'Ubah Data Aset' : 'Tambah Aset Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kode Aset</label>
                  <input name="code" defaultValue={editingAsset?.code} required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.code ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} placeholder="Contoh: AST-001" />
                  {errors.code && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.code}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Aset</label>
                  <input name="name" defaultValue={editingAsset?.name} required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} placeholder="Contoh: Proyektor Epson" />
                  {errors.name && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select name="category" defaultValue={editingAsset?.category} required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.category ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}>
                    <option value="">Pilih Kategori...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
                  <input name="type" defaultValue={editingAsset?.type} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Contoh: Peralatan Kantor" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Informasi Lokasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gedung</label>
                    <input name="building" defaultValue={editingAsset?.location.building} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ruangan</label>
                    <input name="room" defaultValue={editingAsset?.location.room} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Program Studi</label>
                    <select name="studyProgram" defaultValue={editingAsset?.location.studyProgram} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                      {STUDY_PROGRAMS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kondisi</label>
                  <select name="condition" defaultValue={editingAsset?.condition || 'Baik'} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tgl Perolehan</label>
                  <input name="purchaseDate" type="date" defaultValue={editingAsset?.purchaseDate} required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.purchaseDate ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} />
                  {errors.purchaseDate && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.purchaseDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp)</label>
                  <input name="price" type="number" defaultValue={editingAsset?.price} required className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.price ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} />
                  {errors.price && <p className="text-xs text-red-600 mt-1 flex items-center"><AlertCircle size={12} className="mr-1" /> {errors.price}</p>}
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all font-bold">
                  {editingAsset ? 'Simpan Perubahan' : 'Tambah Aset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {isViewModalOpen && viewingAsset && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Detail Aset</h2>
              <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-slate-400 mb-0.5">{viewingAsset.code}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{viewingAsset.name}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${viewingAsset.condition === 'Baik' ? 'bg-green-100 text-green-700' : 
                    viewingAsset.condition === 'Rusak Ringan' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                  {viewingAsset.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Kategori</p>
                  <p className="text-sm font-semibold text-slate-700">{viewingAsset.category}</p>
                  <p className="text-xs text-slate-500">{viewingAsset.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Status</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                    ${viewingAsset.status === 'Tersedia' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    {viewingAsset.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Lokasi</p>
                  <p className="text-sm font-semibold text-slate-700">{viewingAsset.location.room}</p>
                  <p className="text-xs text-slate-500">{viewingAsset.location.building} • {viewingAsset.location.studyProgram}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Tanggal Perolehan</p>
                  <p className="text-sm font-semibold text-slate-700">{viewingAsset.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Nilai Aset</p>
                  <p className="text-sm font-bold text-indigo-600">Rp {viewingAsset.price.toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-sm transition-all font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
