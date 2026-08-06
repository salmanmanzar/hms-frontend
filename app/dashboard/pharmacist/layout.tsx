'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeToken } from '@/lib/jwt';

export default function PharmacistLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) setEmail(decoded.email);
    }
  }, []);

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
    { icon: '💊', label: 'Medicines', path: '/dashboard/pharmacist' },
    { icon: '➕', label: 'Add Medicine', path: '/dashboard/pharmacist/add' },
    { icon: '🧾', label: 'Scan & Bill', path: '/dashboard/pharmacist/bill' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            H
          </div>
          <span className="text-lg font-bold text-gray-900">HMS</span>
          <span className="text-gray-300 mx-2">|</span>
          <span className="text-sm text-gray-500">Pharmacy</span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition"
          >
            <span className="text-sm text-gray-700">{email || '...'}</span>
            <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-semibold">
              PH
            </div>
            <span className="text-gray-400 text-xs">{menuOpen ? '▲' : '▼'}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-gray-100 py-1.5 z-40">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-900">{email}</p>
                <p className="text-xs text-gray-400">Pharmacist Account</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex pt-16">
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col print:hidden">
          <nav className="flex-1 p-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-2">
              Menu
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm flex items-center gap-3 transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 ml-64 p-6">{children}</main>
      </div>
    </div>
  );
}