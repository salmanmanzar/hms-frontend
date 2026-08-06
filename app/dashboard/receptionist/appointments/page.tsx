'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

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
      case 'pending': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      case 'confirmed': return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 ring-1 ring-red-200';
      default: return 'bg-gray-50 text-gray-700 ring-1 ring-gray-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Appointments</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-red-200">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-400 text-sm bg-white rounded-xl p-6 text-center ring-1 ring-gray-100">
          No appointments found.
        </p>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-5">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <p className="text-gray-900 font-medium">{appt.patient.user.name}</p>
                  <p className="text-gray-500 text-xs">with Dr. {appt.doctor.user.name}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusStyle(appt.status)}`}>
                  {appt.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{formatDateTime(appt.scheduledAt)}</p>
              {appt.reason && (
                <p className="text-gray-500 text-sm mt-1.5">
                  <span className="text-gray-400">Reason:</span> {appt.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}