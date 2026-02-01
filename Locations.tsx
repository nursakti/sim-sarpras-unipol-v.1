
import React, { useState } from 'react';
import { MapPin, Tag, Plus, Edit2, Trash2, X, Building2 } from 'lucide-react';
import { UserRole, Location, Category, Asset, WorkUnit, AppNotification } from '../types';

interface LocationsPageProps {
  role: UserRole;
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  workUnits: WorkUnit[];
  setWorkUnits: React.Dispatch<React.SetStateAction<WorkUnit[]>>;
  assets: Asset[];
  notify: (msg: string, type: AppNotification['type']) => void;
}

const LocationsPage: React.FC<LocationsPageProps> = ({ role, locations, setLocations, categories, setCategories, workUnits, setWorkUnits, assets, notify }) => {
  const [activeTab, setActiveTab] = useState<'LOC' | 'CAT' | 'UNIT'>('LOC');
  
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Location | null>(null);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<WorkUnit | null>(null);

  // Handlers for Locations
  const handleSaveLoc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLoc: Location = {
      id: editingLoc?.id || Math.random().toString(36).substr(2, 9),
      building: formData.get('building') as string,
      room: formData.get('room') as string,
    };
    if (editingLoc) {
      setLocations(locations.map(l => l.id === editingLoc.id ? newLoc : l));
      notify(`Lokasi "${newLoc.room}" berhasil diubah.`, 'success');
    } else {
      setLocations([...locations, newLoc]);
      notify(`Lokasi baru "${newLoc.room}" ditambahkan ke data master.`, 'success');
    }
    setIsLocModalOpen(false);
    setEditingLoc(null);
  };

  const handleDeleteLoc = (id: string) => {
    const loc = locations.find(l => l.id === id);
    if (window.confirm('Hapus lokasi ini?')) {
      setLocations(locations.filter(l => l.id !== id));
      notify(`Lokasi "${loc?.room}" dihapus.`, 'info');
    }
  };

  // Handlers for Categories
  const handleSaveCat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCat: Category = {
      id: editingCat?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };
    if (editingCat) {
      setCategories(categories.map(c => c.id === editingCat.id ? newCat : c));
      notify(`Kategori "${newCat.name}" berhasil diubah.`, 'success');
    } else {
      setCategories([...categories, newCat]);
      notify(`Kategori baru "${newCat.name}" berhasil ditambahkan.`, 'success');
    }
    setIsCatModalOpen(false);
    setEditingCat(null);
  };

  const handleDeleteCat = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (window.confirm('Hapus kategori ini?')) {
      setCategories(categories.filter(c => c.id !== id));
      notify(`Kategori "${cat?.name}" dihapus.`, 'info');
    }
  };

  // Handlers for Work Units
  const handleSaveUnit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUnit: WorkUnit = {
      id: editingUnit?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
    };
    if (editingUnit) {
      setWorkUnits(workUnits.map(u => u.id === editingUnit.id ? newUnit : u));
      notify(`Unit Kerja "${newUnit.name}" berhasil diperbarui.`, 'success');
    } else {
      setWorkUnits([...workUnits, newUnit]);
      notify(`Unit Kerja "${newUnit.name}" berhasil ditambahkan ke sistem.`, 'success');
    }
    setIsUnitModalOpen(false);
    setEditingUnit(null);
  };

  const handleDeleteUnit = (id: string) => {
    const unit = workUnits.find(u => u.id === id);
    if (window.confirm(`Hapus Unit Kerja "${unit?.name}"? Tindakan ini mungkin berpengaruh pada data aset yang tertaut.`)) {
      setWorkUnits(workUnits.filter(u => u.id !== id));
      notify(`Unit Kerja "${unit?.name}" dihapus.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:items-center justify-between sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Master Data & Konfigurasi</h1>
          <p className="text-slate-500">Kelola lokasi, kategori aset, dan unit kerja universitas.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/30 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('LOC')}
            className={`px-6 py-4 text-sm font-bold flex items-center transition-all ${activeTab === 'LOC' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <MapPin size={18} className="mr-2" /> Daftar Lokasi
          </button>
          <button 
            onClick={() => setActiveTab('UNIT')}
            className={`px-6 py-4 text-sm font-bold flex items-center transition-all ${activeTab === 'UNIT' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Building2 size={18} className="mr-2" /> Unit Kerja / Prodi
          </button>
          <button 
            onClick={() => setActiveTab('CAT')}
            className={`px-6 py-4 text-sm font-bold flex items-center transition-all ${activeTab === 'CAT' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Tag size={18} className="mr-2" /> Kategori Aset
          </button>
        </div>

        <div className="p-6 min-h-[400px]">
          {activeTab === 'LOC' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Manajemen Ruangan & Gedung</h3>
                {(role === 'ADMIN' || role === 'OFFICER') && (
                  <button onClick={() => { setEditingLoc(null); setIsLocModalOpen(true); }} className="flex items-center text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                    <Plus size={14} className="mr-1" /> Tambah Lokasi
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map(loc => {
                  const assetCount = assets.filter(a => a.location.room === loc.room).length;
                  return (
                    <div key={loc.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex items-center justify-between group">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{loc.room}</p>
                        <p className="text-xs text-slate-500">{loc.building}</p>
                        <span className="text-[10px] mt-2 inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-bold">{assetCount} Aset</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingLoc(loc); setIsLocModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteLoc(loc.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'UNIT' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Daftar Unit Kerja & Program Studi</h3>
                {(role === 'ADMIN' || role === 'OFFICER') && (
                  <button onClick={() => { setEditingUnit(null); setIsUnitModalOpen(true); }} className="flex items-center text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                    <Plus size={14} className="mr-1" /> Tambah Unit
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workUnits.map(unit => {
                  const assetCount = assets.filter(a => a.location.studyProgram === unit.name).length;
                  return (
                    <div key={unit.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-indigo-600">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{unit.name}</p>
                          <span className="text-[10px] inline-block text-slate-400 font-bold uppercase tracking-wider">{assetCount} Aset Terdaftar</span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingUnit(unit); setIsUnitModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteUnit(unit.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'CAT' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Pengelompokan Kategori Aset</h3>
                {(role === 'ADMIN' || role === 'OFFICER') && (
                  <button onClick={() => { setEditingCat(null); setIsCatModalOpen(true); }} className="flex items-center text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                    <Plus size={14} className="mr-1" /> Tambah Kategori
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100">
                {categories.map(cat => (
                  <div key={cat.id} className="py-4 flex items-center justify-between hover:bg-slate-50 px-4 rounded-lg transition-colors group">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{cat.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{cat.description || 'Tidak ada deskripsi'}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingCat(cat); setIsCatModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteCat(cat.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isLocModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editingLoc ? 'Ubah Lokasi' : 'Tambah Lokasi'}</h2>
              <button onClick={() => setIsLocModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveLoc} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gedung</label>
                <input name="building" defaultValue={editingLoc?.building} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Gedung A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Ruangan</label>
                <input name="room" defaultValue={editingLoc?.room} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Lab Komputer" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsLocModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Batal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUnitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editingUnit ? 'Ubah Unit Kerja' : 'Tambah Unit Kerja'}</h2>
              <button onClick={() => setIsUnitModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveUnit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Unit / Program Studi</label>
                <input name="name" defaultValue={editingUnit?.name} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Teknik Informatika" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsUnitModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Batal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCatModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editingCat ? 'Ubah Kategori' : 'Tambah Kategori'}</h2>
              <button onClick={() => setIsCatModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveCat} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kategori</label>
                <input name="name" defaultValue={editingCat?.name} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Elektronik" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                <textarea name="description" defaultValue={editingCat?.description} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Keterangan kategori..."></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Batal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
