'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  FileText,
  ClipboardList,
  CreditCard,
  Settings,
  PhoneCall,
  ShieldAlert
} from 'lucide-react';

interface PatientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function PatientSidebar({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen
}: PatientSidebarProps) {
  const router = useRouter();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'doctors', label: 'Find a Doctor', icon: Stethoscope },
    // { id: 'appointments', label: 'My Appointments', icon: Calendar },
    // { id: 'medical-history', label: 'Medical History', icon: FileText },
    // { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardList },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setIsMobileOpen(false);

    if (id === 'doctors') {
      // Switch to dashboard view first, then scroll to doctors section
      setActiveTab('dashboard');
      setTimeout(() => {
        const el = document.getElementById('doctors-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return;
    }

    setActiveTab(id);
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-200/80 z-40 flex flex-col justify-between py-6 px-3 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Navigation Items list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs font-medium rounded-xl transition-all duration-200 text-left ${isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600 rounded-l-none shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Help / Telehealth Assistance Card */}
        <div className="px-2">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 via-teal-600 to-emerald-600 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-white/20 text-white">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold tracking-tight">24/7 Care Helpline</span>
            </div>
            <p className="text-[11px] text-slate-100 mb-3 leading-relaxed">
              Need immediate medical assistance or appointment advice?
            </p>
            <a
              href="tel:1800-123-4567"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-teal-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
              Call Support
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
