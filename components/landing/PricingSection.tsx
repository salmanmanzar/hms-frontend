'use client';

import Link from 'next/link';
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, Building2 } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      badge: 'Small Clinics & Practices',
      price: '5,000',
      period: 'PKR / month',
      description: 'Ideal for appointment-focused hospitals and standalone practices.',
      features: [
        'Hospital Admin Registration',
        'Doctor & Staff Setup',
        'Patient Records Management',
        'Doctor Appointment Booking',
        'Basic Patient Records History',
        'Standard Support',
      ],
      notIncluded: [
        'Lab Tests & E-Reports',
        'Pharmacy & Inventory Control',
        'Billing & Invoices',
        'Staff Invites & Roles',
        'Multiple Branches',
      ],
      ctaText: 'Register Basic Hospital',
      ctaLink: '/register-hospital?plan=basic',
      accentColor: 'blue',
      featured: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      badge: 'Most Popular',
      price: '10,000',
      period: 'PKR / month',
      description: 'Complete suite for medium-sized hospitals, labs, and pharmacies.',
      features: [
        'Everything in Basic Plan',
        '🧪 Lab Tests & E-Reports',
        '💊 Pharmacy Management',
        '📦 Medicine Inventory Control',
        '💰 Itemized Billing & Invoices',
        '👨‍⚕️ Staff Invites & Role Control',
        '📊 Basic Reports & Financial Summaries',
        '✅ Multi-Department Management',
      ],
      notIncluded: ['Multiple Hospital Branches', 'Advanced Revenue Analytics'],
      ctaText: 'Register Professional Hospital',
      ctaLink: '/register-hospital?plan=professional',
      accentColor: 'teal',
      featured: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      badge: 'Large Medical Chains',
      price: '20,000',
      period: 'PKR / month',
      description: 'Ultimate enterprise system for multi-branch hospital networks.',
      features: [
        'Everything in Professional Plan',
        '📊 Advanced Analytics & Revenue Reports',
        '🏥 Multiple Hospital Branches',
        '🏢 Multiple Departments & Beds',
        '👨‍💼 Advanced Staff Management',
        '💰 Complete Financial Audit Logs',
        '🔔 Priority Notifications & SMS Alerts',
        '⭐ 24/7 Priority Support SLA',
      ],
      notIncluded: [],
      ctaText: 'Register Enterprise Hospital',
      ctaLink: '/register-hospital?plan=enterprise',
      accentColor: 'purple',
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Transparent Hospital Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Choose the Perfect Plan for Your Healthcare Institution
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Scalable hospital subscription plans designed to fit single clinics, medium healthcare centers, or multi-branch hospital chains.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between ${
                plan.featured
                  ? 'bg-slate-900 dark:bg-slate-900 text-white shadow-2xl ring-2 ring-teal-500 scale-[1.03] border border-teal-500/40'
                  : 'bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 hover:shadow-xl'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {plan.badge}
                </span>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    {!plan.featured && (
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs ${
                      plan.featured ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        plan.featured ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Included Features:
                  </p>
                  <ul className="space-y-2.5 text-sm">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            plan.featured
                              ? 'bg-teal-500/20 text-teal-400'
                              : 'bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span
                          className={
                            plan.featured ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'
                          }
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Action */}
              <div className="pt-8 mt-6 border-t border-slate-200/50 dark:border-slate-800">
                <Link
                  href={plan.ctaLink}
                  className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group transition-all duration-200 shadow-md ${
                    plan.featured
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white shadow-teal-500/25'
                      : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-blue-600/20'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>All hospital subscriptions include 30 days initial trial and instant online activation.</span>
        </div>

      </div>
    </section>
  );
}
