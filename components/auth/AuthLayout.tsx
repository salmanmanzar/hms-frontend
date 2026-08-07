'use client';

import React from 'react';
import { Activity, ShieldCheck, Zap, Stethoscope, HeartPulse, CheckCircle2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 font-sans antialiased text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* LEFT PANEL: Branded Medical Illustration & Graphic Panel */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-5/12 flex-col justify-between p-12 bg-gradient-to-br from-blue-700 via-teal-700 to-emerald-900 text-white overflow-hidden shadow-2xl">
        {/* Abstract Background Floating Blobs & Medical Grid Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

        {/* Decorative EKG Heartbeat Line SVG Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none text-white"
          viewBox="0 0 1000 1000"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M 0 500 L 300 500 L 330 420 L 370 600 L 410 320 L 460 560 L 490 480 L 520 500 L 1000 500" />
        </svg>

        {/* Top Header: Brand Logo & Title */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-teal-300">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              VisionX <span className="text-teal-300 font-normal">HMS</span>
            </h1>
            <p className="text-xs text-teal-100/80 font-medium">Healthcare Management System</p>
          </div>
        </div>

        {/* Center Section: Main Hero Graphic & Features */}
        <div className="relative z-10 my-auto py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-200 mb-6">
            <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Next-Gen Medical Care Suite</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Your Health, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-300 to-white">
              Our Priority.
            </span>
          </h2>

          <p className="text-slate-200 text-sm xl:text-base max-w-md leading-relaxed mb-10">
            Streamlining patient journeys, clinical records, and hospital operations with enterprise-grade security and intuitive digital workflows.
          </p>

          {/* Feature Highlights Grid */}
          <div className="space-y-4 max-w-md">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all duration-300">
              <div className="p-2.5 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">HIPAA & GDPR Compliant</h4>
                <p className="text-xs text-slate-300 mt-0.5">End-to-end encrypted medical data & role-based access control.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all duration-300">
              <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-300 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Real-Time Clinical Insights</h4>
                <p className="text-xs text-slate-300 mt-0.5">Instant patient vitals, EHR sync, and automated appointment queues.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/15 transition-all duration-300">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Smart Telehealth Integration</h4>
                <p className="text-xs text-slate-300 mt-0.5">Seamless doctor-patient communication and digital e-prescriptions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer / Trust Banner */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Trusted by top medical institutions</span>
          </div>
          <span>&copy; {new Date().getFullYear()} VisionX HMS</span>
        </div>
      </div>

      {/* RIGHT PANEL: Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen bg-slate-50 relative">
        {/* Mobile Header Branding (Visible only on mobile/tablet) */}
        <div className="w-full max-w-md lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-600 text-white shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">VisionX HMS</span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-teal-700">Healthcare Portal</span>
            </div>
          </div>
        </div>

        {/* Children Form Component Container */}
        <div className="w-full max-w-md animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  );
}
