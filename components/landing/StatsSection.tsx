'use client';

import { ShieldCheck, CalendarCheck, Building2, Clock, Sparkles } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      value: '500+',
      label: 'Appointments Booked',
      description: 'Processed seamlessly with zero scheduling conflicts',
      icon: CalendarCheck,
    },
    {
      value: '50+',
      label: 'Hospitals Onboarded',
      description: 'Verified healthcare institutions operating daily',
      icon: Building2,
    },
    {
      value: '99.9%',
      label: 'System Uptime',
      description: 'Reliable cloud infrastructure with round-the-clock availability',
      icon: ShieldCheck,
    },
    {
      value: '24/7',
      label: 'Instant Patient Access',
      description: 'On-demand portal access for prescriptions and appointments',
      icon: Clock,
    },
  ];

  return (
    <section id="stats" className="py-16 md:py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 dark:from-slate-950 dark:via-blue-950/90 dark:to-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800 overflow-hidden">
          {/* Decorative ambient background lights */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-12">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-teal-400 border border-slate-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Platform Performance
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Trusted by Patients & Medical Leaders
              </h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`pt-6 sm:pt-0 ${
                      idx !== 0 ? 'sm:pl-6 lg:pl-8' : ''
                    } space-y-2 text-center sm:text-left`}
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/80 text-teal-400 border border-slate-700/60 mb-1">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-4xl sm:text-5xl font-black tracking-tight text-white bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-base font-bold text-slate-200">
                      {stat.label}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
