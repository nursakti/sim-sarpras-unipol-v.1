
import React, { useState } from 'react';
import { Lock, User as UserIcon, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mencari pengguna di localStorage
    const savedUsersStr = localStorage.getItem('app_users');
    const users: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    
    // Cari pengguna berdasarkan username
    const foundUser = users.find(u => u.username === username);

    // Verifikasi password dari data user
    // Fallback: Jika user dari data awal belum punya password (migrasi), pakai username sebagai password
    if (foundUser) {
        const storedPassword = foundUser.password || foundUser.username;
        if (password === storedPassword) {
            onLogin(foundUser);
            return;
        }
    }

    // Fallback untuk akun demo jika localStorage benar-benar kosong (first run)
    if (username === 'admin' && password === 'admin') {
      onLogin({ id: '1', username: 'admin', password: 'admin', name: 'Administrator', role: 'ADMIN', studyProgram: 'Manajemen' });
    } else if (username === 'petugas' && password === 'petugas') {
      onLogin({ id: '2', username: 'petugas', password: 'petugas', name: 'Petugas Sarpras', role: 'OFFICER', studyProgram: 'Sarpras Pusat' });
    } else if (username === 'pimpinan' && password === 'pimpinan') {
      onLogin({ id: '3', username: 'pimpinan', password: 'pimpinan', name: 'Pimpinan Universitas', role: 'LEADER', studyProgram: 'Rektorat' });
    } else if (username === 'user' && password === 'user') {
      onLogin({ id: '4', username: 'user', password: 'user', name: 'User Unit Kerja', role: 'UNIT_USER', studyProgram: 'Teknik Informatika' });
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">SIM-SARPRAS UNIPOL</h1>
          <p className="text-slate-500 mt-2">Sistem Informasi Sarana dan Prasarana Universitas Lamappapoleonro</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 animate-pulse">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <UserIcon size={18} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="Masukkan username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              Masuk ke Sistem
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400">
              Level Akses:<br/>
              <b>admin</b>, <b>operator</b>, <b>pimpinan</b>, <b>user</b>
            </p>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8">
          © 2024 SIM-SARPRAS UNIPOL. Hak Cipta Dilindungi Undang-Undang.
        </p>
      </div>
    </div>
  );
};

export default Login;
