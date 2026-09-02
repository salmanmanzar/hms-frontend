'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  UserPlus,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  HeartPulse,
  Sparkles,
  Users,
  Stethoscope,
  Pill,
  FileCheck
} from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Decorators */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-blue-400/10 via-teal-400/10 to-indigo-400/10 dark:from-blue-600/15 dark:via-teal-500/15 dark:to-indigo-600/15 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Calls to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium animate-slide-up shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Next-Gen Healthcare Operating System</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Modern Healthcare Management,{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 dark:from-blue-400 dark:via-teal-400 dark:to-teal-300 bg-clip-text text-transparent">
                Simplified.
              </span>
            </h1>

            {/* Supporting Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Book appointments, manage digital medical records, streamline doctor schedules, and automate hospital billing — all from one secure, unified platform.
            </p>

            {/* Primary & Secondary Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/login"
                className="w-full sm:w-auto text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <span>Login to Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/register-hospital"
                className="w-full sm:w-auto text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200/90 dark:border-slate-700 hover:border-blue-500/50 px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Register Your Hospital</span>
              </Link>
            </div>

            {/* Tertiary Link */}
            <div className="pt-1 flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Are you a patient?</span>
              <Link
                href="/register"
                className="font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Create Patient Account
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">HIPAA Conscious</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">24/7 Access</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Multi-Hospital</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visual App Mockup */}
          <div className="lg:col-span-5 relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-teal-500/20 rounded-3xl blur-2xl transform rotate-3 scale-95 pointer-events-none" />

            {/* Central Mockup Card */}
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 dark:border-slate-800 space-y-6">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                    SJ
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dr. Sarah Jenkins</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Chief Cardiologist • St. Jude Medical</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Now
                </span>
              </div>

              {/* Appointment Widget */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Next Appointment
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded font-mono">Today, 02:30 PM</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Routine Cardiac Follow-up</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Patient: Michael Vance</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-1 rounded-lg">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Prescription & Billing Quick Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 p-3 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-semibold text-xs">
                    <Pill className="w-4 h-4" /> Digital Rx
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-bold">3 Medications</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">E-Signed & Sent</p>
                </div>
                <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 p-3 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-semibold text-xs">
                    <FileCheck className="w-4 h-4" /> Instant Bill
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-bold">$120.00 Paid</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Receipt Generated</p>
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Avg Response: &lt; 5 mins
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  View Demo →
                </span>
              </div>
            </div>

            {/* Floating Floating Badge 1 (Top Left) */}
            <div className="absolute -top-5 -left-5 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-float hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Secure & Encrypted</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">100% Data Protection</p>
              </div>
            </div>

            {/* Floating Floating Badge 2 (Bottom Right) */}
            <div className="absolute -bottom-6 -right-5 bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-float [animation-delay:2s] hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">50+ Hospitals</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Connected Network</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
