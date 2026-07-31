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

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading patient history...</p>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>;
  }

  if (!history) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-xl font-bold text-gray-900">{history.patient.user.name}</h1>
        <p className="text-gray-600 text-sm">{history.patient.user.email}</p>
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>DOB: {new Date(history.patient.dob).toLocaleDateString()}</span>
          <span>Gender: {history.patient.gender}</span>
          {history.patient.bloodGroup && <span>Blood: {history.patient.bloodGroup}</span>}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-3">Appointments</h2>
      {history.appointments.length === 0 ? (
        <p className="text-gray-600 mb-6">No appointments found.</p>
      ) : (
        <div className="grid gap-3 mb-6">
          {history.appointments.map((appt: any) => (
            <div key={appt.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-1">
                <p className="text-gray-900 font-medium">Dr. {appt.doctor.user.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(appt.status)}`}>
                  {appt.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{formatDateTime(appt.scheduledAt)}</p>
              {appt.reason && <p className="text-gray-500 text-sm mt-1">Reason: {appt.reason}</p>}

              {appt.prescription && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Prescription:</p>
                  {appt.prescription.notes && (
                    <p className="text-sm text-gray-500 mb-1">{appt.prescription.notes}</p>
                  )}
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {appt.prescription.items.map((item: any) => (
                      <li key={item.id}>{item.medicine.name} — {item.dosage}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Medical Records</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddRecord} className="bg-white p-4 rounded-lg shadow mb-4">
          {formError && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{formError}</div>
          )}

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 text-gray-700">Diagnosis</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              placeholder="e.g. Seasonal Flu"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Symptoms (optional)</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
          >
            {formLoading ? 'Saving...' : 'Save Record'}
          </button>
        </form>
      )}

      {history.medicalRecords.length === 0 ? (
        <p className="text-gray-600">No medical records found.</p>
      ) : (
        <div className="grid gap-3">
          {history.medicalRecords.map((record: any) => (
            <div key={record.id} className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-900 font-medium">{record.diagnosis}</p>
              {record.symptoms && (
                <p className="text-gray-500 text-sm mt-1">Symptoms: {record.symptoms}</p>
              )}
              <p className="text-gray-400 text-xs mt-2">
                {new Date(record.recordDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}