
import React, { useState } from 'react';
import { UserPlus, Shield, Edit, Trash2, X, Eye, EyeOff, AlertTriangle, AlertCircle } from 'lucide-react';
import { User, UserRole, AppNotification } from '../types';
import { STUDY_PROGRAMS } from '../constants';

interface UsersPageProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User;
  notify: (msg: string, type: AppNotification['type']) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ users, setUsers, currentUser, notify }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<{id: string, name: string} | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    const name = formData.get('name') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!name || name.trim().length < 3) newErrors.name = 'Nama lengkap minimal 3 karakter.';
    if (!username || username.trim().length < 4) newErrors.username = 'Username minimal 4 karakter.';
    
    if (!editingUser || (password && password.length > 0)) {
        if (!password || password.length < 4) {
            newErrors.password = 'Password minimal 4 karakter.';
        }
    }

    if (!editingUser || editingUser.username !== username) {
        if (users.some(u => u.username === username)) {
            newErrors.username = 'Username sudah digunakan oleh akun lain.';
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openDeleteConfirm = (id: string, name: string) => {
    if (id === currentUser.id) {
      notify("Keamanan: Anda tidak dapat menghapus akun Anda sendiri.", "error");
      return;
    }
    setUserToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prevUsers) => prevUsers.filter(u => u.id !== userToDelete.id));
      notify(`Pengguna "${userToDelete.name}" telah dihapus dari sistem.`, "info");
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!validate(formData)) return;

    const userData: User = {
      id: editingUser?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      username: formData.get('username') as string,
      password: (formData.get('password') as string) || editingUser?.password || 'admin',
      role: formData.get('role') as UserRole,
      studyProgram: formData.get('studyProgram') as string,
      position: formData.get('position') as string,
    };

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? userData : u));
      notify(`Profil pengguna "${userData.name}" berhasil diperbarui.`, "success");
    } else {
      setUsers(prev => [...prev, userData]);
      notify(`Pengguna baru "${userData.name}" berhasil didaftarkan.`, "success");
    }
    
    setIsModalOpen(false);
    setEditingUser(null);
    setShowPassword(false);
    setErrors({});
  };

  const openAddModal = () => {
    setErrors({});
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setErrors({});
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="text-slate-500">Kelola hak akses dan akun pengguna sistem.</p>
        </div>
        <button 
          type="button"
          onClick={openAddModal}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm transition-all font-semibold active:scale-95"
        >
          <UserPlus size={20} className="mr-2" /> Tambah Pengguna
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map((u) => (
          <div key={u.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <Shield size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{u.name}</h3>
                  {u.id === currentUser.id && (
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase">
                      Anda
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    @{u.username}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider 
                    ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                      u.role === 'OFFICER' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                type="button"
                onClick={() => openEditModal(u)}
                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit Pengguna"
              >
                <Edit size={18} />
              </button>
              <button 
                type="button"
                onClick={() => openDeleteConfirm(u.id, u.name)}
                disabled={u.id === currentUser.id}
                className={`p-2.5 rounded-lg transition-colors ${u.id === currentUser.id ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                title={u.id === currentUser.id ? "Tidak dapat menghapus diri sendiri" : "Hapus Pengguna"}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">{editingUser ? 'Ubah Pengguna' : 'Tambah Pengguna Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input 
                  name="name" 
                  defaultValue={editingUser?.name} 
                  required 
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'}`} 
                  placeholder="Nama Lengkap" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <input name="username" defaultValue={editingUser?.username} required className="w-full px-3 py-2.5 border border-slate-200 rounded-lg" placeholder="username" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input name="password" type="password" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg" placeholder="******" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Peran (Role)</label>
                <select name="role" defaultValue={editingUser?.role || 'UNIT_USER'} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg">
                  <option value="ADMIN">Administrator</option>
                  <option value="OFFICER">Petugas Sarpras</option>
                  <option value="LEADER">Pimpinan</option>
                  <option value="UNIT_USER">Pengguna Unit Kerja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit Kerja</label>
                <select name="studyProgram" defaultValue={editingUser?.studyProgram || STUDY_PROGRAMS[0]} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg">
                  {STUDY_PROGRAMS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                </select>
              </div>
              <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">Batal</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all font-bold">
                  {editingUser ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-300">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Hapus Pengguna?</h2>
              <p className="text-slate-500">Akun "{userToDelete.name}" akan dihapus permanen.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-b-2xl flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl">Batal</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
