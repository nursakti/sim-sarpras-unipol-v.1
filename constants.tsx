
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Wrench, 
  ArrowLeftRight, 
  FileBarChart, 
  Users, 
  HelpCircle 
} from 'lucide-react';
import { UserRole, Asset, MaintenanceRecord, BorrowingRecord, Category, Location, User, WorkUnit } from './types';

export const INITIAL_WORK_UNITS: WorkUnit[] = [
  { id: '1', name: 'Rektorat' },
  { id: '2', name: 'Magister Manajemen' },
  { id: '3', name: 'Manajemen' },
  { id: '4', name: 'Teknik Informatika' },
  { id: '5', name: 'Sistem Informasi' },
  { id: '6', name: 'Teknik Sipil' },
  { id: '7', name: 'PGSD' },
  { id: '8', name: 'Akuntansi' }
];

export const STUDY_PROGRAMS = INITIAL_WORK_UNITS.map(u => u.name);

export const NAVIGATION_ITEMS = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', roles: ['ADMIN', 'OFFICER', 'LEADER', 'UNIT_USER'] },
  { name: 'Data Aset', icon: <Package size={20} />, path: '/assets', roles: ['ADMIN', 'OFFICER', 'LEADER', 'UNIT_USER'] },
  { name: 'Lokasi & Unit', icon: <MapPin size={20} />, path: '/locations', roles: ['ADMIN', 'OFFICER'] },
  { name: 'Pemeliharaan', icon: <Wrench size={20} />, path: '/maintenance', roles: ['ADMIN', 'OFFICER', 'UNIT_USER'] },
  { name: 'Peminjaman', icon: <ArrowLeftRight size={20} />, path: '/borrowing', roles: ['ADMIN', 'OFFICER', 'UNIT_USER'] },
  { name: 'Laporan', icon: <FileBarChart size={20} />, path: '/reports', roles: ['ADMIN', 'OFFICER', 'LEADER'] },
  { name: 'Manajemen Pengguna', icon: <Users size={20} />, path: '/users', roles: ['ADMIN'] },
  { name: 'Panduan Pengguna', icon: <HelpCircle size={20} />, path: '/help', roles: ['ADMIN', 'OFFICER', 'LEADER', 'UNIT_USER'] },
];

export const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin Pusat', username: 'admin', password: 'admin', role: 'ADMIN', studyProgram: 'Manajemen', position: 'Kepala BAUK' },
  { id: '2', name: 'Petugas IT', username: 'petugas', password: 'petugas', role: 'OFFICER', studyProgram: 'Teknik Informatika', position: 'Staf Sarpras' },
  { id: '3', name: 'Dekan Teknik', username: 'pimpinan', password: 'pimpinan', role: 'LEADER', studyProgram: 'Teknik Sipil', position: 'Pimpinan Fakultas' },
  { id: '4', name: 'Staff Akuntansi', username: 'user', password: 'user', role: 'UNIT_USER', studyProgram: 'Akuntansi', position: 'Staf Administrasi' },
];

export const INITIAL_LOCATIONS: Location[] = [
  { id: '1', building: 'Gedung A', room: 'Laboratorium 1' },
  { id: '2', building: 'Gedung A', room: 'Laboratorium 2' },
  { id: '3', building: 'Gedung B', room: 'Ruang Dosen' },
  { id: '4', building: 'Gedung C', room: 'Ruang 301' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Elektronik', description: 'Peralatan berbasis elektronik' },
  { id: '2', name: 'Mebel', description: 'Perabotan kantor dan kelas' },
  { id: '3', name: 'Alat Peraga', description: 'Media pembelajaran' },
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: '1',
    code: 'AST-001',
    name: 'Proyektor Epson EB-X400',
    category: 'Elektronik',
    type: 'Peralatan Kantor',
    location: { building: 'Gedung A', room: 'Laboratorium 1', studyProgram: 'Teknik Informatika' },
    condition: 'Baik',
    status: 'Tersedia',
    purchaseDate: '2023-01-15',
    price: 6500000
  },
  {
    id: '2',
    code: 'AST-002',
    name: 'Laptop Dell Latitude 5420',
    category: 'Elektronik',
    type: 'Peralatan Kantor',
    location: { building: 'Gedung B', room: 'Ruang Dosen', studyProgram: 'Sistem Informasi' },
    condition: 'Rusak Ringan',
    status: 'Tersedia',
    purchaseDate: '2022-05-20',
    price: 15000000
  },
  {
    id: '3',
    code: 'AST-003',
    name: 'Kursi Kuliah Informa',
    category: 'Mebel',
    type: 'Perabotan',
    location: { building: 'Gedung C', room: 'Ruang 301', studyProgram: 'Manajemen' },
    condition: 'Baik',
    status: 'Dipinjam',
    purchaseDate: '2021-11-10',
    price: 450000
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'm1',
    assetId: '2',
    assetName: 'Laptop Dell Latitude 5420',
    date: '2024-03-01',
    description: 'Pembersihan internal dan upgrade RAM',
    type: 'Rutin',
    cost: 1200000,
    performedBy: 'IT Support',
    status: 'Selesai'
  }
];

export const INITIAL_BORROWING: BorrowingRecord[] = [
  {
    id: 'b1',
    assetId: '3',
    assetName: 'Kursi Kuliah Informa',
    borrowerName: 'Budi Santoso',
    borrowerUnit: 'Manajemen',
    borrowDate: '2024-03-10',
    dueDate: '2024-03-15',
    status: 'Aktif',
    notes: 'Untuk seminar prodi'
  }
];
