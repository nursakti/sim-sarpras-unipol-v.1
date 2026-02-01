
import React, { useState } from 'react';
import { 
  LogIn, 
  Menu, 
  Package, 
  ArrowLeftRight, 
  Wrench, 
  ShieldCheck, 
  Info,
  ChevronRight,
  User as UserIcon,
  Search
} from 'lucide-react';

const HelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'ASSETS' | 'BORROW' | 'MAINTENANCE'>('LOGIN');

  const tabs = [
    { id: 'LOGIN', label: 'Login & Navigasi', icon: <LogIn size={18} /> },
    { id: 'ASSETS', label: 'Pengelolaan Aset', icon: <Package size={18} /> },
    { id: 'BORROW', label: 'Peminjaman', icon: <ArrowLeftRight size={18} /> },
    { id: 'MAINTENANCE', label: 'Pemeliharaan', icon: <Wrench size={18} /> },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Panduan Pengguna</h1>
        <p className="text-slate-500 mt-1">Pelajari cara menggunakan sistem informasi sarana prasarana dengan efektif.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'LOGIN' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <LogIn className="text-indigo-600 mr-2" /> 1. Proses Login
                </h3>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 mr-3">1</div>
                    <p className="text-sm text-slate-600">Buka halaman login, masukkan <strong>Username</strong> dan <strong>Password</strong> sesuai akun yang diberikan oleh admin.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 mr-3">2</div>
                    <p className="text-sm text-slate-600">Untuk keperluan percobaan, Anda bisa menggunakan akun demo (misal: <em>admin/admin</em> atau <em>petugas/petugas</em>).</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center shrink-0 mt-0.5 mr-3">3</div>
                    <p className="text-sm text-slate-600">Klik tombol <strong>"Masuk ke Sistem"</strong>.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <Menu className="text-indigo-600 mr-2" /> 2. Memahami Sidebar & Navigasi
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="p-4 border border-slate-100 rounded-lg bg-white flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Info size={16} /></div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">Akses Berdasarkan Peran</p>
                      <p className="text-xs text-slate-500 mt-1">Menu yang Anda lihat mungkin berbeda tergantung peran (Admin, Petugas, atau Unit User).</p>
                    </div>
                  </li>
                  <li className="p-4 border border-slate-100 rounded-lg bg-white flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Search size={16} /></div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">Bilah Pencarian</p>
                      <p className="text-xs text-slate-500 mt-1">Gunakan Search Bar di bagian atas untuk mencari aset secara instan dari halaman manapun.</p>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          )}

          {activeTab === 'ASSETS' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <Package className="text-indigo-600 mr-2" /> Manajemen Data Aset
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border-l-4 border-indigo-600 bg-indigo-50/50">
                    <div className="shrink-0"><ShieldCheck size={24} className="text-indigo-600" /></div>
                    <div>
                      <p className="font-bold text-slate-900">Siapa yang bisa menambah aset?</p>
                      <p className="text-sm text-slate-600 mt-1">Hanya pengguna dengan peran <strong>Admin</strong> dan <strong>Petugas Sarpras</strong> yang dapat menambah, mengedit, atau menghapus data aset.</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Langkah-langkah:</h4>
                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                      <ChevronRight size={16} className="text-indigo-600" />
                      <p className="text-sm text-slate-700">Pilih menu <strong>"Data Aset"</strong> di sidebar.</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                      <ChevronRight size={16} className="text-indigo-600" />
                      <p className="text-sm text-slate-700">Klik tombol <strong>"+ Tambah Aset"</strong> di pojok kanan atas.</p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                      <ChevronRight size={16} className="text-indigo-600" />
                      <p className="text-sm text-slate-700">Isi formulir lengkap (Kode, Nama, Kategori, Lokasi, dan Harga).</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'BORROW' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <ArrowLeftRight className="text-indigo-600 mr-2" /> Alur Peminjaman Barang
                </h3>
                <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-indigo-600">1</span>
                    </div>
                    <h4 className="font-bold text-slate-900">Pemilihan Aset</h4>
                    <p className="text-sm text-slate-600 mt-1">Sistem hanya akan menampilkan aset dengan status <strong>"Tersedia"</strong> dan kondisi <strong>"Baik"</strong> dalam daftar pilihan peminjaman.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-indigo-600">2</span>
                    </div>
                    <h4 className="font-bold text-slate-900">Pengisian Data</h4>
                    <p className="text-sm text-slate-600 mt-1">Masukkan nama peminjam, unit kerja, tanggal pinjam, dan estimasi tanggal kembali.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-indigo-600">3</span>
                    </div>
                    <h4 className="font-bold text-slate-900">Pengembalian</h4>
                    <p className="text-sm text-slate-600 mt-1">Setelah barang selesai digunakan, klik tombol <strong>"Kembalikan"</strong> pada baris data peminjaman agar status aset kembali menjadi "Tersedia".</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'MAINTENANCE' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <Wrench className="text-indigo-600 mr-2" /> Pencatatan Pemeliharaan
                </h3>
                <p className="text-sm text-slate-600 mb-6">Modul ini digunakan untuk mendata riwayat servis, perbaikan, atau penggantian suku cadang aset.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="font-bold text-orange-800 text-sm flex items-center mb-2">
                      <Clock size={16} className="mr-2" /> Status: Proses
                    </p>
                    <p className="text-xs text-orange-700">Gunakan status ini untuk mencatat aset yang sedang berada di tangan vendor atau sedang diperbaiki.</p>
                  </div>
                  <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                    <p className="font-bold text-green-800 text-sm flex items-center mb-2">
                      <CheckCircle2 size={16} className="mr-2" /> Status: Selesai
                    </p>
                    <p className="text-xs text-green-700">Tandai catatan pemeliharaan sebagai selesai untuk merekam biaya akhir yang dikeluarkan.</p>
                  </div>
                </div>

                <div className="mt-8 bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="font-bold mb-2">Penting: Audit Biaya</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">Seluruh biaya yang diinput akan otomatis terakumulasi di Dashboard sebagai <strong>"Biaya Pemeliharaan YTD"</strong>. Pastikan nominal yang dimasukkan sesuai dengan kwitansi resmi.</p>
                  </div>
                  <Wrench size={80} className="absolute -right-4 -bottom-4 text-white/5" />
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-6 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <UserIcon size={24} />
          </div>
          <div>
            <p className="font-bold">Butuh bantuan lebih lanjut?</p>
            <p className="text-xs text-white/80">Hubungi Biro Administrasi Umum & Kepegawaian (BAUK).</p>
          </div>
        </div>
        <button className="px-5 py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
          Hubungi IT Support
        </button>
      </div>
    </div>
  );
};

// Helper components for Help page
const Clock = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckCircle2 = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default HelpPage;
