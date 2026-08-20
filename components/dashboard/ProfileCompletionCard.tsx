'use client';

import React from 'react';
import {
  UserCheck,
  Calendar,
  Heart,
  MapPin,
  AlertCircle,
  X,
  Loader2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ProfileCompletionCardProps {
  dob: string;
  setDob: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  bloodGroup: string;
  setBloodGroup: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  profileError: string;
  setProfileError: (val: string) => void;
  profileLoading: boolean;
  onProfileSubmit: (e: React.FormEvent) => void;
}

export default function ProfileCompletionCard({
  dob,
  setDob,
  gender,
  setGender,
  bloodGroup,
  setBloodGroup,
  address,
  setAddress,
  profileError,
  setProfileError,
  profileLoading,
  onProfileSubmit
}: ProfileCompletionCardProps) {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 animate-slide-up">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 max-w-lg w-full">
        {/* Top Icon Badge & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20 mb-4">
            <UserCheck className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Quick Onboarding
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Complete Your Profile</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Please provide your health details to activate your patient dashboard and book doctor consultations.
          </p>
        </div>

        {/* Error Alert Banner */}
        {profileError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-3 animate-slide-up"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{profileError}</span>
            </div>
            <button
              type="button"
              onClick={() => setProfileError('')}
              className="text-rose-500 hover:text-rose-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={onProfileSubmit} className="space-y-4">
          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Date of Birth <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Gender Select */}
          <div>
            <label htmlFor="gender" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Gender <span className="text-rose-500">*</span>
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label htmlFor="bloodGroup" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Blood Group <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Heart className="w-4 h-4 text-rose-400" />
              </div>
              <input
                id="bloodGroup"
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. O+, A+, B-"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Address <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="City, State, Country"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={profileLoading}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 active:scale-[0.99] shadow-lg shadow-teal-600/20 transition-all duration-200 flex items-center justify-center gap-2 text-xs cursor-pointer mt-6 disabled:opacity-60"
          >
            {profileLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Details...</span>
              </>
            ) : (
              <>
                <span>Save & Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
