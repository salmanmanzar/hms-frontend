'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import {
  Calendar,
  BarChart3,
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Stethoscope,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    { icon: Calendar, label: 'My Appointments', path: '/dashboard/doctor' },
    { icon: BarChart3, label: 'Analysis', path: '/dashboard/doctor/analysis' },
  ];

  const initials = doctorName
    ? doctorName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'DR';

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 antialiased font-sans">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 z-40 gap-4 shadow-xs">
        {/* Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => router.push('/dashboard/doctor')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">HealthPulse</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                  HMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Doctor Portal</p>
            </div>
          </div>
        </div>

        {/* Debounced Patient Search Bar */}
        <div className="relative flex-1 max-w-md hidden sm:block" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients by name or email..."
              className="w-full pl-10 pr-10 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition placeholder:text-slate-400"
            />
            {searching ? (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 animate-spin" />
            ) : searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>

          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl ring-1 ring-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2 bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Patients ({searchResults.length})
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {searchResults.map((p) => {
                  const pInitials = p.user.name
                    ? p.user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'P';
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        router.push(`/dashboard/doctor/patient/${p.id}`);
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50/60 text-slate-700 flex items-center gap-3 transition group"
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-semibold text-xs flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {pInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {p.user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{p.user.email}</p>
                      </div>
                      <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View History &rarr;
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Actions (Notifications & Doctor Profile) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notification Bell */}
          <button
            aria-label="Notifications"
            className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition duration-150"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Doctor Profile Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 hover:bg-slate-100/80 p-1.5 sm:px-3 sm:py-1.5 rounded-xl transition duration-150 group"
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm group-hover:shadow transition">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Dr. {doctorName || 'Doctor'}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">Medical Practitioner</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  menuOpen ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl ring-1 ring-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">Dr. {doctorName || 'Doctor'}</p>
                  <p className="text-xs text-slate-400">Practitioner Account</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      router.push('/dashboard/doctor');
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 flex items-center gap-2.5 font-medium transition"
                  >
                    <User className="w-4 h-4 text-slate-400" /> My Profile & Schedule
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex pt-16 min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-100 flex-col z-30 shadow-xs">
          <div className="p-4 flex-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
              Navigation
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs border-l-4 border-blue-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Help Footer Card */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-2xl">
            <div className="flex items-center gap-2 mb-1.5 text-slate-700 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4 text-teal-600" /> Need Assistance?
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Contact Hospital IT Desk for patient record synchronization.
            </p>
          </div>
        </aside>

        {/* Mobile Slide-over Sidebar */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 max-w-xs bg-white h-full shadow-2xl flex flex-col p-4 z-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900">Doctor Portal</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Patient Search */}
              <div className="mb-4 relative" ref={searchRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient..."
                    className="w-full pl-9 pr-3 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-h-48 overflow-y-auto">
                    {searchResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          router.push(`/dashboard/doctor/patient/${p.id}`);
                          setSearchResults([]);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 border-b border-slate-50 last:border-0"
                      >
                        {p.user.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <nav className="space-y-1 flex-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        router.push(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}