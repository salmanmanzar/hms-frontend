'use client';

import {
  Calendar,
  FileText,
  CreditCard,
  Pill,
  Users,
  Building2,
  Check
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: 'Appointment Scheduling',
      description:
        'Instant doctor discovery, real-time availability slots, automated booking confirmation, and SMS/Email reminders for patients.',
      iconBg: 'bg-blue-100/70 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400',
      badge: 'Real-Time Sync',
    },
    {
      icon: FileText,
      title: 'Digital Prescriptions & E-Records',
      description:
        'Doctors can issue signed digital prescriptions directly to patient profiles with full dosage instructions and printable PDF summaries.',
      iconBg: 'bg-teal-100/70 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400',
      badge: 'HIPAA Standard',
    },
    {
      icon: CreditCard,
      title: 'Secure Billing & Invoicing',
      description:
        'Itemized patient billing for consultations, lab tests, and procedures with online payment collection and instant digital receipts.',
      iconBg: 'bg-indigo-100/70 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400',
      badge: 'Stripe & Cards',
    },
    {
      icon: Pill,
      title: 'Pharmacy & Stock Control',
      description:
        'Pharmacists manage medicine inventory, track batch expirations, process doctor prescription orders, and issue dispensed items.',
      iconBg: 'bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400',
      badge: 'Inventory Live',
    },
    {
      icon: Users,
      title: 'Role-Based Dashboards',
      description:
        'Dedicated, security-scoped portals tailored for Super Admins, Hospital Admins, Doctors, Receptionists, Pharmacists, and Patients.',
      iconBg: 'bg-sky-100/70 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400',
      badge: 'Multi-Role',
    },
    {
      icon: Building2,
      title: 'Multi-Hospital Management',
      description:
        'Seamless multi-tenant architecture designed to manage individual private clinics or large hospital chains under one organization.',
      iconBg: 'bg-amber-100/70 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400',
      badge: 'Scalable Enterprise',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
            Powerful Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything Required to Modernize Your Healthcare Facility
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Designed to remove operational bottlenecks, reduce waiting times, and elevate patient satisfaction across all care touchpoints.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Row: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${feat.iconBg}`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom Accent line */}
                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Included in standard plan</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
