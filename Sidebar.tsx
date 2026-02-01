
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, X, Menu } from 'lucide-react';
import { User } from '../types';
import { NAVIGATION_ITEMS } from '../constants';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const filteredNav = NAVIGATION_ITEMS.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <>
      <div className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col h-full relative z-30`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          {isOpen ? (
            <span className="text-xl font-bold text-indigo-600 tracking-tight">SIM-SARPRAS</span>
          ) : (
            <span className="text-xl font-bold text-indigo-600">S</span>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-indigo-600 p-1 rounded-md">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 rounded-lg transition-colors group
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}
              `}
            >
              <span className="min-w-[24px]">{item.icon}</span>
              {isOpen && <span className="ml-3 font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            {isOpen && <span className="ml-3 font-medium">Keluar</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
