
import React from 'react';
import { 
  Package, 
  Wrench, 
  ArrowLeftRight, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Asset, MaintenanceRecord, BorrowingRecord } from '../types';

interface DashboardProps {
  assets: Asset[];
  maintenance: MaintenanceRecord[];
  borrowing: BorrowingRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ assets, maintenance, borrowing }) => {
  const stats = [
    { label: 'Total Aset', value: assets.length, icon: <Package className="text-blue-600" />, bg: 'bg-blue-100', change: '+2.5%' },
    { label: 'Pemeliharaan', value: maintenance.filter(m => m.status === 'Proses').length, icon: <Wrench className="text-orange-600" />, bg: 'bg-orange-100', change: '-10%' },
    { label: 'Peminjaman Aktif', value: borrowing.filter(b => b.status === 'Aktif').length, icon: <ArrowLeftRight className="text-green-600" />, bg: 'bg-green-100', change: '+12%' },
    { label: 'Aset Rusak', value: assets.filter(a => a.condition !== 'Baik').length, icon: <AlertTriangle className="text-red-600" />, bg: 'bg-red-100', change: '0%' },
  ];

  const conditionData = [
    { name: 'Baik', value: assets.filter(a => a.condition === 'Baik').length },
    { name: 'Rusak Ringan', value: assets.filter(a => a.condition === 'Rusak Ringan').length },
    { name: 'Rusak Berat', value: assets.filter(a => a.condition === 'Rusak Berat').length },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const recentActivity = [...borrowing].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Inventaris</h1>
          <p className="text-slate-500">Ringkasan kondisi sarana dan prasarana saat ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Distribusi Kondisi Aset</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conditionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {conditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Status Pemanfaatan</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {conditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{assets.length}</p>
                <p className="text-xs text-slate-500">Unit</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {conditionData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{Math.round((item.value / assets.length) * 100 || 0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Aktivitas Peminjaman Terbaru</h3>
          <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Aset</th>
                <th className="px-6 py-4">Peminjam</th>
                <th className="px-6 py-4">Tanggal Pinjam</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{activity.assetName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{activity.borrowerName}</p>
                    <p className="text-xs text-slate-400">{activity.borrowerUnit}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{activity.borrowDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${activity.status === 'Aktif' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentActivity.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">Belum ada aktivitas baru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
