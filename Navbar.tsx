
import React, { useState } from 'react';
import { Bell, Search, Check, Clock } from 'lucide-react';
import { User, AppNotification } from '../types';

interface NavbarProps {
  user: User;
  notifications: AppNotification[];
  markAllAsRead: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, notifications, markAllAsRead }) => {
  const [showNotif, setShowNotif] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20">
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Cari aset, lokasi, atau peminjaman..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => { setShowNotif(!showNotif); if (!showNotif) markAllAsRead(); }}
            className={`p-2 rounded-full transition-colors relative ${showNotif ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)}></div>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-bold text-slate-800 text-sm">Riwayat Aktivitas</h3>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase">Terbaru</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <Bell size={32} className="mx-auto text-slate-200 mb-2" />
                      <p className="text-xs text-slate-400">Belum ada aktivitas.</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3">
                        <div className={`mt-1 shrink-0 w-2 h-2 rounded-full ${
                          n.type === 'success' ? 'bg-green-500' : 
                          n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">{n.message}</p>
                          <div className="flex items-center mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <Clock size={10} className="mr-1" /> {n.timestamp}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-slate-100 text-center">
                  <button onClick={() => setShowNotif(false)} className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">Tutup Panel</button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">{user.name}</p>
            <p className="text-[10px] text-indigo-600 mt-1 uppercase font-bold tracking-wider">{user.role.replace('_', ' ')} • {user.studyProgram}</p>
          </div>
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-indigo-50 shadow-sm">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
