
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { decodeToken } from '@/lib/jwt';
import {
  UserPlus,
  Users,
  BarChart3,
  Building2,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Activity,
  Lock,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [adminEmail, setAdminEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // ─── Authentication + Organization ───
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.push('/login');
      return;
    }

    const decoded = decodeToken(token);

    if (decoded?.role !== 'admin') {
      router.push('/login');
      return;
    }

    if (decoded) {
      setAdminEmail(decoded.email);
    }

    // Fetch current admin's organization
    fetchOrganization();
  }, []);

  // ─── Fetch Current Admin's Organization ───
  const fetchOrganization = async () => {
    try {
      const org = await apiRequest('/auth/my-organization');

      if (org) {
        setOrgName(org.name);
      }
    } catch (error) {
      console.error('Failed to fetch organization:', error);
    }
  };

  // ─── Close Profile Menu When Clicking Outside ───
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ─── Logout ───
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    router.push('/login');
  };

  // ─── Navigation ───
  const navItems = [
    {
      icon: UserPlus,
      label: 'Add Staff',
      path: '/dashboard/admin',
      enabled: true,
    },
    {
      icon: Activity,
      label: 'Activity Logs',
      path: '/dashboard/admin/logs',
      enabled: true,
    },
    {
      icon: Users,
      label: 'All Staff',
      path: '/dashboard/admin/staff',
      enabled: false,
    },
    {
      icon: Building2,
      label: 'Departments',
      path: '/dashboard/admin/departments',
      enabled: true,
    },
    {
      icon: BarChart3,
      label: 'Reports',
      path: '/dashboard/admin/reports',
      enabled: false,
    },
  ];

  // ─── Admin Initials ───
  const initials = adminEmail
    ? adminEmail.substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">

      {/* ─── Top Navbar ─── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-6 z-40 shadow-xs">

        {/* Left: Mobile toggle + Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-200"
            aria-label="Toggle navigation menu"
          >
            {mobileSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div
            onClick={() => router.push('/dashboard/admin')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >

            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5" />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <span className="text-base font-bold tracking-tight text-slate-900">
                  HMS
                </span>

                <span className="hidden sm:inline-block text-slate-300">
                  |
                </span>

                {/* Organization Name */}
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 max-w-[250px]">

                  <Building2 className="w-3 h-3 shrink-0" />

                  <span className="truncate">
                    {orgName || 'Loading...'}
                  </span>

                </span>

              </div>

              <p className="text-[11px] text-slate-400 font-medium -mt-0.5 hidden sm:block">
                System Administration
              </p>

            </div>
          </div>
        </div>

        {/* ─── Right: Profile dropdown ─── */}
        <div className="flex items-center gap-3 flex-shrink-0">

          <div
            className="relative"
            ref={menuRef}
          >

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 hover:bg-slate-100/80 rounded-xl transition-colors duration-200 border border-transparent hover:border-slate-200/60 group"
              aria-label="Open profile menu"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >

              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm group-hover:shadow transition-shadow duration-200">
                {initials}
              </div>

              <div className="hidden md:flex flex-col text-left">

                <span className="text-xs font-semibold text-slate-900 max-w-[160px] truncate group-hover:text-blue-600 transition-colors duration-200">
                  {adminEmail || 'Administrator'}
                </span>

                <span className="text-[10px] text-slate-400 font-medium">
                  Admin — {orgName || 'Loading...'}
                </span>

              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${menuOpen
                  ? 'rotate-180 text-blue-600'
                  : ''
                  }`}
              />

            </button>

            {/* ─── Profile Dropdown ─── */}
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl ring-1 ring-slate-200/80 py-2 z-50 animate-slide-up"
                role="menu"
              >

                <div className="px-4 py-3 border-b border-slate-100">

                  <div className="flex items-center gap-2 mb-1.5">

                    <ShieldCheck className="w-4 h-4 text-emerald-600" />

                    <p className="text-xs font-semibold text-emerald-700">
                      Authenticated Session
                    </p>

                  </div>

                  <p className="text-xs font-medium text-slate-900 truncate">
                    {adminEmail}
                  </p>

                  {/* Organization */}
                  <div className="flex items-center gap-1.5 mt-1">

                    <Building2 className="w-3 h-3 text-blue-500 shrink-0" />

                    <p className="text-[10px] text-slate-500 truncate">
                      Admin — {orgName || 'Loading...'}
                    </p>

                  </div>

                </div>

                <div className="px-1.5 py-1.5 border-t border-slate-100">

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 font-medium transition-colors duration-200"
                    role="menuitem"
                  >

                    <LogOut className="w-4 h-4 text-rose-500" />

                    Logout

                  </button>

                </div>

              </div>
            )}

          </div>
        </div>
      </header>

      {/* ─── Main Layout Container ─── */}
      <div className="flex pt-16 min-h-screen">

        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* ─── Left Sidebar ─── */}
        <aside
          className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between z-30 transition-transform duration-300 ease-in-out ${mobileSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
            }`}
        >

          <nav
            className="p-4 space-y-1.5"
            aria-label="Admin navigation"
          >

            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Administration
            </div>

            {navItems.map((item) => {

              const isActive =
                pathname === item.path && item.enabled;

              const Icon = item.icon;

              if (!item.enabled) {
                return (
                  <div
                    key={item.path}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 text-slate-300 cursor-not-allowed select-none"
                    title="Coming soon"
                  >

                    <Icon className="w-4.5 h-4.5 text-slate-300" />

                    <span>
                      {item.label}
                    </span>

                    <Lock className="w-3 h-3 ml-auto text-slate-300" />

                  </div>
                );
              }

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-all duration-200 ${isActive
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  aria-current={
                    isActive ? 'page' : undefined
                  }
                >

                  <Icon
                    className={`w-4.5 h-4.5 ${isActive
                      ? 'text-blue-600'
                      : 'text-slate-400'
                      }`}
                  />

                  <span>
                    {item.label}
                  </span>

                </button>
              );
            })}

          </nav>

          {/* ─── Sidebar Footer Info Card ─── */}
          <div className="p-4">

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-100 flex items-center gap-3">

              <ShieldCheck className="w-8 h-8 text-blue-600 bg-blue-50 p-1.5 rounded-lg border border-blue-100 shrink-0" />

              <div className="min-w-0">

                <p className="text-xs font-bold text-slate-900">
                  Admin Console
                </p>

                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />

                  <span className="truncate">
                    {orgName || 'Active Session'}
                  </span>

                </p>

              </div>

            </div>

          </div>

        </aside>

        {/* ─── Main Content Area ─── */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

      </div>
    </div>
  );
}
