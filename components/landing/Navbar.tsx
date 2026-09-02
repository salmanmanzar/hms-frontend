'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Menu, X, Building2, LogIn, UserPlus } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800/80 py-3'
          : 'bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-sm border-b border-slate-200/40 dark:border-slate-800/40 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                CarePulse <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/80 font-semibold tracking-normal">HMS</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline-block">Hospital Management System</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#audiences"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
            >
              Who It's For
            </a>
            <a
              href="#features"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
            >
              Features
            </a>
            <a
              href="#stats"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
            >
              Impact
            </a>
            <a
              href="#about"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
            >
              About
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/register"
              className="text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200/80 dark:border-teal-800/80 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Patient Signup
            </Link>

            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <LogIn className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Login
            </Link>

            <Link
              href="/register-hospital"
              className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <Building2 className="w-4 h-4" />
              Register Hospital
            </Link>
          </div>

          {/* Mobile Menu Toggle & Theme */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />

            <Link
              href="/login"
              className="text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all md:hidden"
            >
              Login
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-slide-up">
          <nav className="flex flex-col space-y-3 font-medium text-slate-700 dark:text-slate-200">
            <a
              href="#audiences"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Who It's For
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Features
            </a>
            <a
              href="#stats"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Impact
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
            >
              About
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Sign In to Portal
            </Link>

            <Link
              href="/register-hospital"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-600 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Register Your Hospital
            </Link>

            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 py-2 rounded-xl flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create Patient Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
