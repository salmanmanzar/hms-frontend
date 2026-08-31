'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeToken } from '@/lib/jwt';
import { apiRequest } from '@/lib/api';
import { 
  Pill, 
  PlusCircle, 
  Receipt, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  Activity,
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function PharmacistLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) setEmail(decoded.email);
    }
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      const org = await apiRequest('/auth/my-organization');
      if (org) {
        setOrgName(org.name);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  const navItems = [
    { icon: Pill, label: 'Medicines Inventory', path: '/dashboard/pharmacist' },
    { icon: PlusCircle, label: 'Add Medicine', path: '/dashboard/pharmacist/add' },
    { icon: Receipt, label: 'Scan & Bill', path: '/dashboard/pharmacist/bill' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-6 z-30 print:hidden shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              H
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">HMS</span>
              <span className="hidden sm:inline-block text-slate-300">|</span>
              {/* Hospital / Organization Name */}
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60 max-w-[200px]">
                <Building2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{orgName || 'Loading...'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 hover:bg-slate-100/80 rounded-xl transition border border-transparent hover:border-slate-200/60"
          >
            <div className="w-9 h-9 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-teal-500/20 shadow-xs">
              PH
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 max-w-[150px] truncate">{email || 'Pharmacist'}</span>
              <span className="text-[10px] text-slate-500 font-medium">Licensed Pharmacist</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl ring-1 ring-slate-200/80 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-semibold text-emerald-700">Authenticated Session</p>
                </div>
                <p className="text-xs font-medium text-slate-900 truncate">{email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-blue-500 shrink-0" />
                  <p className="text-[10px] text-slate-500 truncate">{orgName || 'Hospital'}</p>
                </div>
              </div>

              <div className="px-1.5 py-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex pt-16 min-h-[calc(100vh-4rem)]">
        {/* Backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* Left Sidebar */}
        <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between z-20 transition-transform duration-300 ease-in-out print:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Management Menu
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 shadow-xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Info Card */}
          <div className="p-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/40 border border-slate-100 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-teal-600 bg-teal-50 p-1.5 rounded-lg border border-teal-100 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{orgName || 'Hospital'}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className="truncate">Pharmacy Portal • Active</span>
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}