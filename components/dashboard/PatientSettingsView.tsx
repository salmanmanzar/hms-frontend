'use client';

import React, { useState } from 'react';
import { apiRequest } from '@/lib/api';
import {
  Settings,
  User,
  Mail,
  Heart,
  MapPin,
  Lock,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface PatientProfile {
  id: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  address?: string;
  user: { name: string; email: string };
}

interface PatientSettingsViewProps {
  profile: PatientProfile | null;
  patientName: string;
}

export default function PatientSettingsView({ profile, patientName }: PatientSettingsViewProps) {
  const [bloodGroup, setBloodGroup] = useState(profile?.bloodGroup || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaved(false);

    try {
      if (profile?.id) {
        await apiRequest(`/patient/${profile.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ bloodGroup, address }),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDob = (dob: string) =>
    dob
      ? new Date(dob).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
      : '—';

  return (
    <div className="space-y-6 animate-slide-up pb-12 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-600" />
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your health profile, personal information, and preferences.
        </p>
      </div>

      {/* Profile Information Card */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Read-only fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {profile?.user?.name || patientName}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile?.user?.email || '—'}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Date of Birth
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                {formatDob(profile?.dob || '')}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Gender
              </label>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium capitalize">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {profile?.gender || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Health Details */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-bold text-slate-900">Health Profile</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
          {saveError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-slide-up">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div>
            <label htmlFor="bloodGroup" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Blood Group
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Heart className="w-4 h-4 text-rose-400" />
              </div>
              <input
                id="bloodGroup"
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. O+, A+, B-"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, State, Country"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save Health Profile
              </>
            )}
          </button>
        </form>
      </div>

      {/* Notification Preferences
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">Notification Preferences</h2>
        </div>

        <div className="p-6 space-y-4">
          {[
            {
              label: 'Email Notifications',
              description: 'Receive booking confirmations and receipts via email.',
              value: emailNotifs,
              setValue: setEmailNotifs,
            },
            {
              label: 'Appointment Reminders',
              description: 'Get reminded 24 hours before your consultation.',
              value: appointmentReminders,
              setValue: setAppointmentReminders,
            },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-900">{pref.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{pref.description}</p>
              </div>
              <button
                type="button"
                onClick={() => pref.setValue(!pref.value)}
                className={`relative shrink-0 w-10 h-6 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  pref.value ? 'bg-teal-600' : 'bg-slate-200'
                }`}
                aria-label={`Toggle ${pref.label}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                    pref.value ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div> */}

      {/* Security Section */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">Security</h2>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Password</p>
                <p className="text-[11px] text-slate-500">Last changed: Unknown</p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
