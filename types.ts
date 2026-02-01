
export type UserRole = 'ADMIN' | 'OFFICER' | 'LEADER' | 'UNIT_USER';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  studyProgram: string;
  position?: string;
}

export type AssetCondition = 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
export type AssetStatus = 'Tersedia' | 'Dipinjam' | 'Dalam Perbaikan';

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: string;
  type: string;
  location: {
    building: string;
    room: string;
    studyProgram: string;
  };
  condition: AssetCondition;
  status: AssetStatus;
  purchaseDate: string;
  price: number;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  date: string;
  description: string;
  type: 'Rutin' | 'Perbaikan' | 'Penggantian';
  cost: number;
  performedBy: string;
  status: 'Selesai' | 'Proses';
}

export interface BorrowingRecord {
  id: string;
  assetId: string;
  assetName: string;
  borrowerName: string;
  borrowerUnit: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Menunggu Persetujuan' | 'Aktif' | 'Kembali' | 'Terlambat' | 'Ditolak';
  notes: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Location {
  id: string;
  building: string;
  room: string;
}

export interface WorkUnit {
  id: string;
  name: string;
  code?: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: string;
  isRead: boolean;
}
