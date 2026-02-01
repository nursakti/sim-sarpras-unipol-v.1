
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import LocationsPage from './pages/Locations';
import Maintenance from './pages/Maintenance';
import Borrowing from './pages/Borrowing';
import Reports from './pages/Reports';
import UsersPage from './pages/Users';
import HelpPage from './pages/Help';
import Login from './pages/Login';
import { User, Asset, MaintenanceRecord, BorrowingRecord, Location, Category, WorkUnit, AppNotification } from './types';
import { INITIAL_ASSETS, INITIAL_MAINTENANCE, INITIAL_BORROWING, INITIAL_USERS, INITIAL_LOCATIONS, INITIAL_CATEGORIES, INITIAL_WORK_UNITS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [borrowing, setBorrowing] = useState<BorrowingRecord[]>(() => {
    const saved = localStorage.getItem('borrowing');
    return saved ? JSON.parse(saved) : INITIAL_BORROWING;
  });

  const [locations, setLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem('locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [workUnits, setWorkUnits] = useState<WorkUnit[]>(() => {
    const saved = localStorage.getItem('work_units');
    return saved ? JSON.parse(saved) : INITIAL_WORK_UNITS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  const addNotification = useCallback((message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20));
    setActiveToast(newNotif);
    
    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setActiveToast(prev => prev?.id === newNotif.id ? null : prev);
    }, 3000);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  useEffect(() => { localStorage.setItem('user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('app_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('assets', JSON.stringify(assets)); }, [assets]);
  useEffect(() => { localStorage.setItem('maintenance', JSON.stringify(maintenance)); }, [maintenance]);
  useEffect(() => { localStorage.setItem('borrowing', JSON.stringify(borrowing)); }, [borrowing]);
  useEffect(() => { localStorage.setItem('locations', JSON.stringify(locations)); }, [locations]);
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('work_units', JSON.stringify(workUnits)); }, [workUnits]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    addNotification(`Selamat datang kembali, ${userData.name}!`, 'success');
  };
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-50 overflow-hidden relative">
        {/* Toast Container */}
        {activeToast && (
          <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right-full duration-300">
            <div className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border ${
              activeToast.type === 'success' ? 'bg-white border-green-100' :
              activeToast.type === 'error' ? 'bg-white border-red-100' :
              'bg-white border-blue-100'
            }`}>
              <div className={`shrink-0 ${
                activeToast.type === 'success' ? 'text-green-500' :
                activeToast.type === 'error' ? 'text-red-500' :
                'text-blue-500'
              }`}>
                {activeToast.type === 'success' ? <CheckCircle size={20} /> : 
                 activeToast.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
              </div>
              <p className="text-sm font-bold text-slate-800 pr-8">{activeToast.message}</p>
              <button onClick={() => setActiveToast(null)} className="absolute right-3 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <Sidebar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar user={user} notifications={notifications} markAllAsRead={markAllAsRead} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
            <Routes>
              <Route path="/" element={<Dashboard assets={assets} maintenance={maintenance} borrowing={borrowing} />} />
              <Route path="/assets" element={<Assets assets={assets} setAssets={setAssets} role={user.role} notify={addNotification} categories={categories} workUnits={workUnits} />} />
              <Route path="/locations" element={<LocationsPage role={user.role} locations={locations} setLocations={setLocations} categories={categories} setCategories={setCategories} workUnits={workUnits} setWorkUnits={setWorkUnits} assets={assets} notify={addNotification} />} />
              <Route path="/maintenance" element={<Maintenance maintenance={maintenance} setMaintenance={setMaintenance} assets={assets} role={user.role} notify={addNotification} />} />
              <Route path="/borrowing" element={<Borrowing borrowing={borrowing} setBorrowing={setBorrowing} assets={assets} setAssets={setAssets} workUnits={workUnits} role={user.role} notify={addNotification} />} />
              <Route path="/reports" element={<Reports assets={assets} maintenance={maintenance} borrowing={borrowing} users={users} workUnits={workUnits} />} />
              <Route path="/users" element={user.role === 'ADMIN' ? <UsersPage users={users} setUsers={setUsers} currentUser={user} notify={addNotification} workUnits={workUnits} /> : <Navigate to="/" />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
