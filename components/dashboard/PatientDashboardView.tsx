'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Video,
  Stethoscope,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  Award,
  Sparkles,
  FileText,
  Search,
  PlusCircle,
  Activity,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';

interface Doctor {
  id: string;
  specialization: string;
  qualification: string;
  user: { name: string; email: string };
  department: { name: string };
}

interface PatientDashboardViewProps {
  patientName?: string;
  doctors: Doctor[];
  loadingDoctors: boolean;
  searchQuery: string;
  historyAppointments?: any[];
  medicalRecords?: any[];
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSelectDoctor: (doctorId: string) => void;
}

export default function PatientDashboardView({
  patientName = 'Patient',
  doctors,
  loadingDoctors,
  searchQuery,
  historyAppointments = [],
  medicalRecords = [],
  onSearchChange,
  onSearchSubmit,
  onSelectDoctor
}: PatientDashboardViewProps) {
  const router = useRouter();
  const [selectedDept, setSelectedDept] = useState<string>('All');

  // Dynamic statistics computation
  const appointmentsCount = historyAppointments.length;
  const prescriptionsCount = historyAppointments.filter((a) => a.prescription).length;

  const lastCheckupDateStr = medicalRecords[0]?.recordDate
    ? new Date(medicalRecords[0].recordDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : historyAppointments[0]?.scheduledAt
    ? new Date(historyAppointments[0].scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No recent checkup';

  // Combine medical records & appointments into a single timeline sorted by date
  const combinedTimeline = [
    ...historyAppointments.map((apt) => ({
      id: `apt-${apt.id}`,
      type: 'appointment',
      date: new Date(apt.scheduledAt),
      title: `Consultation with Dr. ${apt.doctor?.user?.name || 'Specialist'}`,
      description: apt.reason ? `Reason: ${apt.reason}` : 'Scheduled consultation',
      status: apt.status || 'confirmed',
      prescription: apt.prescription,
    })),
    ...medicalRecords.map((rec) => ({
      id: `rec-${rec.id}`,
      type: 'medicalRecord',
      date: new Date(rec.recordDate),
      title: `Diagnosis: ${rec.diagnosis}`,
      description: rec.symptoms ? `Symptoms: ${rec.symptoms}` : 'Clinical medical record',
      status: 'completed',
      prescription: null,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Format today's date
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Department filters
  const departments = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedics'];

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedDept === 'All') return true;
    return doc.department.name.toLowerCase().includes(selectedDept.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-slide-up pb-12">
      {/* 1. WELCOME GREETING HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-teal-600/10 relative overflow-hidden">
        {/* Background decorative vectors */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-teal-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{todayDateStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {patientName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
            Here is your health overview today. Take a look at your appointments, prescriptions, and top specialists.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('doctors-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative z-10 self-start sm:self-center px-5 py-3 rounded-2xl bg-white text-teal-700 hover:bg-slate-50 font-semibold text-xs shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-teal-600" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* 2. STAT SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Appointments Count */}
        <div className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Appointments</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{appointmentsCount} Booked</h3>
            <span className="text-[11px] font-medium text-blue-600">
              {appointmentsCount > 0 ? 'Active Records' : 'No upcoming bookings'}
            </span>
          </div>
        </div>

        {/* Card 2: Active Prescriptions */}
        <div className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-600 shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prescriptions</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{prescriptionsCount} Active</h3>
            <span className="text-[11px] font-medium text-teal-600">
              {prescriptionsCount > 0 ? 'Pharmacy Dispatched' : 'No active prescriptions'}
            </span>
          </div>
        </div>

        {/* Card 3: Last Checkup */}
        <div className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Checkup</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{lastCheckupDateStr}</h3>
            <span className="text-[11px] font-medium text-emerald-600">Vitals & Record</span>
          </div>
        </div>

        {/* Card 4: Health Care Plan */}
        <div className="bg-white p-5 rounded-2xl shadow-sm ring-1 ring-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Health Care Plan</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">Patient Active</h3>
            <span className="text-[11px] font-medium text-amber-600">VisionX HMS Verified</span>
          </div>
        </div>
      </div>

      {/* 3. FIND A DOCTOR SECTION */}
      <div id="doctors-section" className="pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              Find a Doctor
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Book consultations with top-rated medical specialists.</p>
          </div>

          {/* Search query input */}
          <form onSubmit={onSearchSubmit} className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search doctors..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar mb-6">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedDept === dept
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md shadow-blue-500/15'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Doctor Cards Grid */}
        {loadingDoctors ? (
          /* Pulsing Skeleton Loader Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-9 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          /* Empty State Card */
          <div className="bg-white p-10 rounded-2xl border border-slate-100 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Doctors Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              No specialists match your search criteria. Try clearing search filters or choosing a different department.
            </p>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                setSelectedDept('All');
              }}
              className="py-2 px-4 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const docInitials = doc.user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

              return (
                <div
                  key={doc.id}
                  className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group border border-slate-100/80"
                >
                  <div>
                    {/* Header: Avatar + Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-md shrink-0">
                        {docInitials}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                          {doc.user.name}
                        </h3>
                        <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700">
                          {doc.specialization}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100 mb-6">
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.qualification}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Activity className="w-3.5 h-3.5 text-slate-400" />
                        <span>Department: <strong className="text-slate-700">{doc.department.name}</strong></span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectDoctor(doc.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Book Appointment</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. RECENT HEALTH ACTIVITY TIMELINE */}
      <div className="pt-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-emerald-600" />
          Recent Health Timeline
        </h2>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm ring-1 ring-slate-100">
          {combinedTimeline.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No recent activity recorded yet. Book an appointment to get started!
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-6">
              {combinedTimeline.map((item) => {
                const dateStr = item.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                const isAppt = item.type === 'appointment';

                return (
                  <div key={item.id} className="relative">
                    <div
                      className={`absolute -left-[33px] top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs shadow-sm ${
                        isAppt
                          ? 'bg-blue-100 border-blue-500 text-blue-600'
                          : 'bg-emerald-100 border-emerald-500 text-emerald-600'
                      }`}
                    >
                      {isAppt ? <Calendar className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isAppt ? 'text-blue-600' : 'text-emerald-600'
                        }`}
                      >
                        {dateStr} &bull; {item.status}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                      {item.prescription && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-[11px] font-semibold">
                          <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
                          <span>Prescription Attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
