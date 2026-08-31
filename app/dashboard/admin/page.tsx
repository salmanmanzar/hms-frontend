'use client';

import { useState } from 'react';
import {
  UserPlus,
  Stethoscope,
  ClipboardList,
  Pill,
  ShieldCheck,
  Mail,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  User,
  ArrowRight,
  KeyRound,
  LogIn,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

const roles = [
  {
    value: 'doctor',
    label: 'Doctor',
    icon: Stethoscope,
    description: 'Medical practitioner',
    color: 'blue',
  },
  {
    value: 'receptionist',
    label: 'Receptionist',
    icon: ClipboardList,
    description: 'Front desk staff',
    color: 'teal',
  },
  {
    value: 'pharmacist',
    label: 'Pharmacist',
    icon: Pill,
    description: 'Pharmacy staff',
    color: 'emerald',
  },
  {
    value: 'admin',
    label: 'Admin',
    icon: ShieldCheck,
    description: 'System administrator',
    color: 'amber',
  },
] as const;

const roleColorMap: Record<string, { bg: string; border: string; text: string; iconBg: string; ring: string }> = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    iconBg: 'bg-blue-100 text-blue-600',
    ring: 'ring-blue-500/30',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    iconBg: 'bg-teal-100 text-teal-600',
    ring: 'ring-teal-500/30',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-100 text-emerald-600',
    ring: 'ring-emerald-500/30',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    iconBg: 'bg-amber-100 text-amber-600',
    ring: 'ring-amber-500/30',
  },
};

export default function AdminDashboardPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('doctor');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiRequest('/auth/create-staff', {
        method: 'POST',
        body: JSON.stringify({ name, email, role }),
      });

      setSuccess(`${name} has been added as ${role}. An invite email has been sent.`);
      setName('');
      setEmail('');
      setRole('doctor');
    } catch (err: any) {
      setError(err.message || 'Failed to create staff member');
    } finally {
      setLoading(false);
    }
  };

  const onboardingSteps = [
    {
      icon: UserPlus,
      title: 'Create account',
      description: 'You enter their name, email, and role',
    },
    {
      icon: Mail,
      title: 'Email invite sent',
      description: 'They receive a secure invitation link',
    },
    {
      icon: KeyRound,
      title: 'Set password',
      description: 'They create their own secure password',
    },
    {
      icon: LogIn,
      title: 'Ready to go',
      description: 'They log in and start working',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-slide-up">
      {/* ─── Page Header ─── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
          Create accounts for doctors, receptionists, pharmacists, or other admins — they&apos;ll
          receive an email invite to set up their password.
        </p>
      </div>

      {/* ─── Onboarding Flow Stepper ─── */}
      <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-4 sm:p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          How onboarding works
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {onboardingSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative flex flex-col items-center text-center group">
                {/* Connector line */}
                {i < onboardingSteps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-blue-200 to-teal-200" />
                )}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-50 to-teal-50 border border-slate-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200 relative z-10">
                  <Icon className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  <span className="text-blue-600 mr-1">{i + 1}.</span>
                  {step.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug hidden sm:block">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Success Banner ─── */}
      {success && (
        <div
          className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 animate-slide-up"
          role="alert"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-800">Staff member added successfully</p>
            <p className="text-xs text-emerald-600 mt-0.5">{success}</p>
          </div>
          <button
            onClick={() => setSuccess('')}
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-500 transition-colors duration-200"
            aria-label="Dismiss success message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── Error Banner ─── */}
      {error && (
        <div
          className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 animate-slide-up"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Something went wrong</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors duration-200"
            aria-label="Dismiss error message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── Add Staff Form Card ─── */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-slate-100 bg-gradient-to-r from-white to-blue-50/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Add New Staff Member</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill in the details below to send an invitation
                </p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-6 sm:py-8 space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="staff-name" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="staff-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Dr. Sarah Ahmed"
                  className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="staff-email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="staff-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. sarah.ahmed@hospital.com"
                  className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Role Selector Cards */}
            <fieldset>
              <legend className="block text-sm font-semibold text-slate-700 mb-3">
                Assign Role
              </legend>
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                role="radiogroup"
                aria-label="Staff role"
              >
                {roles.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.value;
                  const colors = roleColorMap[r.color];

                  return (
                    <button
                      key={r.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setRole(r.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setRole(r.value);
                        }
                      }}
                      tabIndex={0}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 ${
                        isSelected
                          ? `${colors.bg} ${colors.border} ${colors.text} shadow-sm focus-visible:${colors.ring}`
                          : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 text-slate-500 focus-visible:ring-blue-500/30'
                      }`}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <span className="absolute top-2 right-2">
                          <CheckCircle className={`w-4 h-4 ${colors.text}`} />
                        </span>
                      )}

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                          isSelected ? colors.iconBg : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-semibold ${isSelected ? colors.text : 'text-slate-700'}`}>
                          {r.label}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                          {r.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Sending invite...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4.5 h-4.5" />
                  <span>Add Staff Member</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}