'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { decodeToken } from '@/lib/jwt';
import {
  Calendar,
  Clock,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Filter,
  CalendarDays,
  CalendarX,
  FileText,
  DollarSign,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  reason: string | null;
  patient: {
    id: string;
    user: { name: string; email: string };
  };
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [doctorName, setDoctorName] = useState('');

  const [departments, setDepartments] = useState<any[]>([]);
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    const decoded = decodeToken(token);
    if (decoded?.role !== 'doctor') {
      router.push('/login');
      return;
    }
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const profile = await apiRequest('/doctor/me/profile');
      if (profile) {
        setHasProfile(true);
        setDoctorName(profile.user?.name || '');
        fetchAppointments();
      } else {
        setHasProfile(false);
        fetchDepartments();
      }
    } catch (err) {
      setHasProfile(false);
      fetchDepartments();
    } finally {
      setProfileChecked(true);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await apiRequest('/department');
      setDepartments(data);
    } catch (err: any) {
      setProfileError('Failed to load departments');
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/appointment');
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileLoading(true);

    try {
      await apiRequest('/doctor', {
        method: 'POST',
        body: JSON.stringify({
          specialization,
          qualification,
          departmentId,
          consultationFee: Number(consultationFee),
        }),
      });

      setHasProfile(true);
      fetchAppointments();
    } catch (err: any) {
      setProfileError(err.message || 'Failed to save profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    const hours = d.getUTCHours();
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const date = d.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${date} at ${displayHour}:${minutes} ${period}`;
  };

  const statusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/70';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/70';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/70';
      default:
        return 'bg-slate-50 text-slate-700 ring-1 ring-slate-200/70';
    }
  };

  // Compute Statistics
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const todayCount = appointments.filter((a) => {
      const aDate = new Date(a.scheduledAt).toISOString().slice(0, 10);
      return aDate === todayStr;
    }).length;

    const pendingCount = appointments.filter((a) => a.status.toLowerCase() === 'pending').length;
    const completedCount = appointments.filter((a) => a.status.toLowerCase() === 'completed').length;
    const totalCount = appointments.length;

    return { todayCount, pendingCount, completedCount, totalCount };
  }, [appointments]);

  // Filtered Appointments based on Tab
  const filteredAppointments = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    if (activeTab === 'today') {
      return appointments.filter((a) => {
        const aDate = new Date(a.scheduledAt).toISOString().slice(0, 10);
        return aDate === todayStr;
      });
    }
    if (activeTab === 'upcoming') {
      return appointments.filter((a) => {
        const aTime = new Date(a.scheduledAt).getTime();
        return aTime >= now.getTime() && a.status.toLowerCase() !== 'cancelled';
      });
    }
    if (activeTab === 'past') {
      return appointments.filter((a) => {
        const aTime = new Date(a.scheduledAt).getTime();
        return aTime < now.getTime() || a.status.toLowerCase() === 'completed';
      });
    }
    return appointments;
  }, [appointments, activeTab]);

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Profile Setup Screen
  if (!profileChecked) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <div className="h-5 w-48 bg-slate-200 rounded-full" />
          <div className="h-4 w-64 bg-slate-100 rounded-full" />
        </div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4">
        <div className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-100 border border-slate-100">
          <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Complete Your Profile</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Provide your professional details to activate your appointment schedule.
              </p>
            </div>
          </div>

          {profileError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Specialization
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
                placeholder="e.g. Cardiologist, Neurologist"
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Qualification
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                required
                placeholder="e.g. MBBS, FCPS (Cardiology)"
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Consultation Fee (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  Rs.
                </span>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  required
                  min="0"
                  placeholder="e.g. 2500"
                  className="w-full pl-12 pr-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 flex items-center justify-center gap-2 transition duration-150 cursor-pointer"
            >
              {profileLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Practitioner Profile</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-700 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-blue-600/15 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-100 mb-3 border border-white/15">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Dr. {doctorName || 'Doctor'} 👋
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl leading-relaxed">
            Here is an overview of your patient consultations, scheduled appointments, and clinical workload.
          </p>
        </div>
        {/* Background Decorative Circles */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-24 -top-12 w-36 h-36 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Appointments */}
        <div className="bg-white rounded-2xl p-5 shadow-xs ring-1 ring-slate-100 hover:shadow-md transition duration-200 border border-slate-100/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Today&apos;s Appointments
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.todayCount}</p>
            <span className="text-[11px] text-teal-600 font-medium inline-block mt-0.5">
              Scheduled for today
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Appointments */}
        <div className="bg-white rounded-2xl p-5 shadow-xs ring-1 ring-slate-100 hover:shadow-md transition duration-200 border border-slate-100/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalCount}</p>
            <span className="text-[11px] text-slate-500 font-medium inline-block mt-0.5">
              In system registry
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Pending Confirmations */}
        <div className="bg-white rounded-2xl p-5 shadow-xs ring-1 ring-slate-100 hover:shadow-md transition duration-200 border border-slate-100/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Items
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.pendingCount}</p>
            <span className="text-[11px] text-amber-600 font-medium inline-block mt-0.5">
              Action required
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Completed Consultations */}
        <div className="bg-white rounded-2xl p-5 shadow-xs ring-1 ring-slate-100 hover:shadow-md transition duration-200 border border-slate-100/60 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.completedCount}</p>
            <span className="text-[11px] text-emerald-600 font-medium inline-block mt-0.5">
              Successfully fulfilled
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Section Header & Segmented Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs ring-1 ring-slate-100 border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Appointment Directory</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Filter consultations by schedule timeline or status.
            </p>
          </div>

          {/* Segmented Control Filter Tabs */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl gap-1 text-xs font-medium self-start sm:self-auto">
            {(['all', 'today', 'upcoming', 'past'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg capitalize transition-all duration-150 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton Placeholders */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100 animate-pulse space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full" />
                    <div>
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                      <div className="h-3 w-20 bg-slate-100 rounded mt-1" />
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-slate-200 rounded-full" />
                </div>
                <div className="h-3 w-48 bg-slate-200 rounded" />
                <div className="h-8 w-full bg-slate-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          /* Empty State */
          <div className="py-12 px-4 text-center max-w-sm mx-auto">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-3">
              <CalendarX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No appointments found</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              There are no {activeTab !== 'all' ? activeTab : ''} consultations matching your filter.
            </p>
          </div>
        ) : (
          /* Appointments Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map((appt) => {
              const initials = appt.patient?.user?.name
                ? appt.patient.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'P';

              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl p-5 ring-1 ring-slate-100 border border-slate-100 hover:shadow-md hover:border-blue-200/70 transition duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Top: Patient Info & Status */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                          {initials}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {appt.patient?.user?.name || 'Patient'}
                          </h3>
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">
                            {appt.patient?.user?.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadgeStyle(
                          appt.status
                        )}`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl mb-3 border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium">{formatDateTime(appt.scheduledAt)}</span>
                    </div>

                    {/* Reason */}
                    {appt.reason && (
                      <div className="mb-4 text-xs text-slate-600 bg-blue-50/40 p-3 rounded-xl border border-blue-100/50">
                        <span className="font-semibold text-slate-700 block mb-0.5">Reason for Visit:</span>
                        <p className="line-clamp-2 italic text-slate-600">{appt.reason}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Link */}
                  <button
                    onClick={() => router.push(`/dashboard/doctor/patient/${appt.patient.id}`)}
                    className="w-full text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition duration-150 group-hover:shadow-xs cursor-pointer"
                  >
                    <span>View Medical History</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}