'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  ClipboardList, 
  Calendar, 
  Clock, 
  Stethoscope, 
  User, 
  FileText, 
  RefreshCw, 
  AlertCircle, 
  CalendarX,
  CheckCircle2
} from 'lucide-react';

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    const hours = d.getUTCHours();
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const date = d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });
    return `${date} at ${displayHour}:${minutes} ${period}`;
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/80';
      case 'confirmed': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/80';
      case 'completed': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80';
      case 'cancelled': return 'bg-red-50 text-red-700 ring-1 ring-red-200/80';
      default: return 'bg-slate-50 text-slate-700 ring-1 ring-slate-200/80';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header section with Stats & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Appointments</h1>
            {!loading && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200/60">
                <ClipboardList className="w-3.5 h-3.5" />
                {appointments.length} {appointments.length === 1 ? 'Appointment' : 'Appointments'}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View and manage all patient appointment schedules across hospital departments.
          </p>
        </div>

        <button
          onClick={fetchAppointments}
          disabled={loading}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50 flex items-center gap-2 text-xs font-medium"
          title="Refresh Appointments"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs sm:text-sm border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        /* Skeleton Loaders */
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 ring-1 ring-slate-200/70 shadow-xs animate-pulse space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-1/3">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
              </div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-12 text-center">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarX className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">No Appointments Found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            There are currently no patient appointments scheduled in the hospital system.
          </p>
        </div>
      ) : (
        /* Appointment Cards List */
        <div className="space-y-3.5">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 hover:shadow-md hover:ring-slate-300/80 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-100 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{appt.patient.user.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      <span>with <span className="font-semibold text-slate-700">Dr. {appt.doctor.user.name}</span></span>
                    </p>
                  </div>
                </div>

                <div className="self-start sm:self-center">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize tracking-wide inline-flex items-center gap-1.5 ${statusStyle(appt.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {appt.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 pt-1">
                <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{formatDateTime(appt.scheduledAt)}</span>
                </div>

                {appt.reason && (
                  <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-100">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-xs"><span className="text-slate-400">Reason:</span> {appt.reason}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}