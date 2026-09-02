'use client';

import Link from 'next/link';
import { Activity, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 border-t border-slate-800 dark:border-slate-800/90 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column (Spans 2 on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                CarePulse <span className="text-xs px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800 font-semibold">HMS</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering healthcare providers, medical staff, and patients with a unified, secure, and modern digital hospital management platform.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>HIPAA Conscious • Encrypted Health Data</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Appointment Scheduling
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  E-Prescriptions & E-Records
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Billing & Stripe Payments
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Pharmacy & Stock Control
                </a>
              </li>
            </ul>
          </div>

          {/* User Portals Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Staff & Doctor Login
                </Link>
              </li>
              <li>
                <Link href="/register-hospital" className="hover:text-white transition-colors">
                  Register Hospital
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Patient Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>support@carepulse-hms.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>+1 (800) 555-CARE</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Healthcare Tech City, Suite 400</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-12 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CarePulse HMS. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Security & Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
