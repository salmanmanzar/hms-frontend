'use client';

import Link from 'next/link';
import { Building2, LogIn, ArrowRight, UserPlus, Sparkles } from 'lucide-react';

export default function CtaSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 dark:from-blue-700 dark:via-blue-800 dark:to-teal-700 text-white p-10 sm:p-14 lg:p-16 shadow-2xl border border-blue-500/30 overflow-hidden text-center">
          {/* Ambient Glow circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none transform translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none transform -translate-x-20 translate-y-20"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Transform Your Healthcare Operations Today</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Modernize Your Hospital & Elevate Patient Care?
            </h2>

            <p className="text-blue-50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Join leading healthcare institutions delivering faster appointments, error-free electronic medical records, and seamless billing.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register-hospital"
                className="w-full sm:w-auto text-base font-bold text-blue-700 bg-white hover:bg-slate-100 px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-white"
              >
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Register Your Hospital</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 px-7 py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In to Portal</span>
              </Link>
            </div>

            {/* Patient link */}
            <div className="pt-2 text-xs sm:text-sm text-blue-100/90 flex items-center justify-center gap-1.5">
              <span>Looking for patient services?</span>
              <Link href="/register" className="font-bold underline hover:text-white transition-colors flex items-center gap-1">
                <UserPlus className="w-3.5 h-3.5" />
                Create Patient Account
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
