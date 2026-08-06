'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';

export default function PatientHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.patientId as string;

  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest(`/patient/${patientId}/history`);
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load patient history');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      await apiRequest(`/patient/${patientId}/medical-record`, {
        method: 'POST',
        body: JSON.stringify({ diagnosis, symptoms }),
      });

      setDiagnosis('');
      setSymptoms('');
      setShowForm(false);
      fetchHistory();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add medical record');
    } finally {
      setFormLoading(false);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-4 w-20 bg-gray-200 rounded mb-4" />
        <div className="h-24 bg-gray-200 rounded-xl mb-6" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-50 text-red-700 p-4 rounded-xl text-sm ring-1 ring-red-200">
        {error}
      </div>
    );
  }

  if (!history) return null;

  const initials = history.patient.user.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-900 mb-5 inline-flex items-center gap-1.5 transition"
      >
        <span>←</span> Back
      </button>

      {/* Patient Header Card */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6 mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{history.patient.user.name}</h1>
          <p className="text-gray-500 text-sm">{history.patient.user.email}</p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full ring-1 ring-gray-200">
            {new Date(history.patient.dob).toLocaleDateString()}
          </span>
          <span className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full ring-1 ring-gray-200 capitalize">
            {history.patient.gender}
          </span>
          {history.patient.bloodGroup && (
            <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full ring-1 ring-red-200 font-medium">
              {history.patient.bloodGroup}
            </span>
          )}
        </div>
      </div>

      {/* Appointments Section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Appointments ({history.appointments.length})
        </h2>

        {history.appointments.length === 0 ? (
          <p className="text-gray-400 text-sm bg-white rounded-xl p-6 text-center ring-1 ring-gray-100">
            No appointments found.
          </p>
        ) : (
          <div className="space-y-3">
            {history.appointments.map((appt: any) => (
              <div key={appt.id} className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-5">
                <div className="flex justify-between items-start mb-1.5">
                  <p className="text-gray-900 font-medium">Dr. {appt.doctor.user.name}</p>
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

                {appt.prescription && (
                  <div className="mt-4 border-t border-gray-50 pt-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Prescription
                    </p>
                    {appt.prescription.notes && (
                      <p className="text-sm text-gray-500 mb-2">{appt.prescription.notes}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {appt.prescription.items.map((item: any) => (
                        <span
                          key={item.id}
                          className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full"
                        >
                          {item.medicine.name} · {item.dosage}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Medical Records Section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Medical Records ({history.medicalRecords.length})
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : '+ Add Record'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddRecord} className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-5 mb-4">
            {formError && (
              <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-3 text-sm ring-1 ring-red-200">
                {formError}
              </div>
            )}

            <div className="mb-3">
              <label className="block text-xs font-medium mb-1.5 text-gray-500">Diagnosis</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
                placeholder="e.g. Seasonal Flu"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium mb-1.5 text-gray-500">Symptoms (optional)</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium transition"
            >
              {formLoading ? 'Saving...' : 'Save Record'}
            </button>
          </form>
        )}

        {history.medicalRecords.length === 0 ? (
          <p className="text-gray-400 text-sm bg-white rounded-xl p-6 text-center ring-1 ring-gray-100">
            No medical records found.
          </p>
        ) : (
          <div className="space-y-3">
            {history.medicalRecords.map((record: any) => (
              <div key={record.id} className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-5">
                <div className="flex justify-between items-start">
                  <p className="text-gray-900 font-medium">{record.diagnosis}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(record.recordDate).toLocaleDateString()}
                  </span>
                </div>
                {record.symptoms && (
                  <p className="text-gray-500 text-sm mt-1.5">{record.symptoms}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}