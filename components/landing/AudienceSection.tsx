'use client';

import Link from 'next/link';
import { Heart, Building2, LogIn, ArrowRight } from 'lucide-react';

export default function AudienceSection() {
  const audiences = [
    {
      title: 'For Patients',
      badge: 'Easy Healthcare Access',
      icon: Heart,
      iconBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/60',
      description:
        'Book appointments with specialist doctors, view your medical history, receive digital prescriptions, and pay bills online — all from your phone or computer.',
      ctaText: 'Create Patient Account',
      ctaLink: '/register',
      accentColor: 'rose',
    },
    {
      title: 'For Hospitals & Admins',
      badge: 'Complete Digital Suite',
      icon: Building2,
      iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/60',
      description:
        'Register your hospital or clinic to manage medical staff, department schedules, patient admissions, pharmacy inventory, and automated billing seamlessly.',
      ctaText: 'Register Your Hospital',
      ctaLink: '/register-hospital',
      accentColor: 'blue',
      featured: true,
    },
    {
      title: 'For Doctors & Staff',
      badge: 'Role-Based Dashboard',
      icon: LogIn,
      iconBg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/60',
      description:
        'Already registered as a hospital admin, doctor, receptionist, or pharmacist? Sign in directly to access your personalized role-based control center.',
      ctaText: 'Sign In to Portal',
      ctaLink: '/login',
      accentColor: 'teal',
    },
  ];

  return (
    <section id="audiences" className="py-20 md:py-28 bg-white dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 px-3 py-1 rounded-full">
            Who Is This For?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tailored Experiences for Every Healthcare User
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Whether you are a patient seeking care, a hospital administrator managing operations, or a medical staff member, our platform is built for you.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {audiences.map((aud, index) => {
            const Icon = aud.icon;
            return (
              <div
                key={index}
                className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                  aud.featured
                    ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-2xl ring-2 ring-blue-500 scale-[1.02] border border-slate-800'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl'
                }`}
              >
                {aud.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-md">
                    Recommended for Providers
                  </span>
                )}

                <div className="space-y-6">
                  {/* Top Header & Icon */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${
                        aud.featured
                          ? 'bg-gradient-to-tr from-blue-600 to-teal-500 text-white border-transparent'
                          : aud.iconBg
                      }`}
                    >
                      <Icon className="w-7 h-7 stroke-[2]" />
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        aud.featured
                          ? 'bg-slate-800 text-teal-400 border border-slate-700'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {aud.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3
                      className={`text-2xl font-bold ${
                        aud.featured ? 'text-white' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {aud.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        aud.featured ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {aud.description}
                    </p>
                  </div>
                </div>

                {/* Card CTA Link */}
                <div className="pt-8 mt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <Link
                    href={aud.ctaLink}
                    className={`w-full py-3 px-5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 group transition-all ${
                      aud.featured
                        ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:from-blue-500 hover:to-teal-400 shadow-md shadow-blue-500/25'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-300/80 dark:border-slate-700 hover:border-blue-500 shadow-sm'
                    }`}
                  >
                    <span>{aud.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
