'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiRequest } from '@/lib/api';


export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchDoctorName();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 350);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const performSearch = async (query: string) => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  const controller = new AbortController();
  abortControllerRef.current = controller;

  setSearching(true);
  try {
    const data = await apiRequest(`/patient/me/search?search=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    });
    setSearchResults(data);
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      setSearchResults([]);
    }
  } finally {
    if (!controller.signal.aborted) {
      setSearching(false);
    }
  }
};

  const fetchDoctorName = async () => {
    try {
      const profile = await apiRequest('/doctor/me/profile');
      if (profile) {
        setDoctorName(profile.user.name);
      }
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  const navItems = [
    { icon: '📅', label: 'My Appointments', path: '/dashboard/doctor' },
    { icon: '📊', label: 'Analysis', path: '/dashboard/doctor/analysis' },
  ];

  const initials = doctorName
    ? doctorName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '..';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 gap-6">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            H
          </div>
          <span className="text-lg font-bold text-gray-900">HMS</span>
          <span className="text-gray-300 mx-2">|</span>
          <span className="text-sm text-gray-500">Doctor Portal</span>
        </div>

        {pathname === '/dashboard/doctor' ? (
          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your patients..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {searching ? '⏳' : '🔍'}
            </span>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg ring-1 ring-gray-100 overflow-hidden z-50">
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      router.push(`/dashboard/doctor/patient/${p.id}`);
                      setSearchResults([]);
                      setSearchQuery('');
                    }}
                    className="w-full text-left text-sm px-4 py-2.5 hover:bg-gray-50 text-gray-700 border-b border-gray-50 last:border-0"
                  >
                    {p.user.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition"
          >
            <span className="text-sm text-gray-700">Dr. {doctorName || '...'}</span>
            <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <span className="text-gray-400 text-xs">{menuOpen ? '▲' : '▼'}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-gray-100 py-1.5 z-40">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-sm font-medium text-gray-900">Dr. {doctorName}</p>
                <p className="text-xs text-gray-400">Doctor Account</p>
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
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col">
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

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">{children}</main>
      </div>
    </div>
  );
}