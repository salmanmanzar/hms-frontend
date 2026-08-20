'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import {
  ArrowLeft,
  Calendar,
  User,
  Activity,
  FileText,
  Plus,
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Droplet,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';

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
    const date = d.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${date} at ${displayHour}:${minutes} ${period}`;
  };

  const statusStyle = (status: string) => {
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 w-24 bg-slate-200 rounded-lg" />
        <div className="h-32 bg-slate-200 rounded-3xl" />
        <div className="h-48 bg-slate-200 rounded-3xl" />
        <div className="h-48 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-2xl text-sm flex items-center gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
        <span>{error}</span>
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="text-xs font-semibold text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50/60 border border-slate-200/80 px-3.5 py-2 rounded-xl inline-flex items-center gap-2 transition duration-150 shadow-2xs group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Appointments</span>
      </button>

      {/* Patient Header Card */}
      <div className="bg-white rounded-3xl shadow-xs ring-1 ring-slate-100 border border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white font-extrabold text-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
            {initials}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {history.patient.user.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{history.patient.user.email}</p>
          </div>
        </div>

        {/* Info Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200/70 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{new Date(history.patient.dob).toLocaleDateString()}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200/70 capitalize font-medium">
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span>{history.patient.gender}</span>
          </span>
          {history.patient.bloodGroup && (
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full border border-rose-200/70 font-semibold">
              <Droplet className="w-3.5 h-3.5 text-rose-600" />
              <span>{history.patient.bloodGroup}</span>
            </span>
          )}
        </div>
      </div>

      {/* Appointments History Section */}
      <section className="bg-white rounded-3xl shadow-xs ring-1 ring-slate-100 border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Consultation History</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Past and scheduled visits ({history.appointments.length})
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
            Records
          </span>
        </div>

        {history.appointments.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs bg-slate-50/60 rounded-2xl border border-slate-100">
            No past appointment visits recorded for this patient.
          </div>
        ) : (
          <div className="space-y-4">
            {history.appointments.map((appt: any) => (
              <div
                key={appt.id}
                className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100/80 hover:bg-white hover:shadow-xs transition duration-150"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <p className="text-sm font-bold text-slate-900">Dr. {appt.doctor.user.name}</p>
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize ${statusStyle(
                      appt.status
                    )}`}
                  >
                    {appt.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDateTime(appt.scheduledAt)}</span>
                </div>

                {appt.reason && (
                  <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 italic">
                    <span className="font-semibold text-slate-700 not-italic">Reason: </span>
                    {appt.reason}
                  </p>
                )}

                {/* Prescription Subsection */}
                {appt.prescription && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                      <Pill className="w-4 h-4 text-teal-600" />
                      <span>Prescribed Medication</span>
                    </div>

                    {appt.prescription.notes && (
                      <p className="text-xs text-slate-500 mb-2.5 italic">
                        &quot;{appt.prescription.notes}&quot;
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {appt.prescription.items.map((item: any) => (
                        <span
                          key={item.id}
                          className="text-xs bg-teal-50 text-teal-800 px-3 py-1.5 rounded-full border border-teal-200/60 font-medium inline-flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                          <span>
                            {item.medicine.name} &bull; {item.dosage}
                          </span>
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
      <section className="bg-white rounded-3xl shadow-xs ring-1 ring-slate-100 border border-slate-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <span>Medical Records</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Clinical diagnoses and notes ({history.medicalRecords.length})
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-xl shadow-xs hover:from-blue-700 hover:to-teal-700 transition duration-150 inline-flex items-center gap-1.5 cursor-pointer"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Record
              </>
            )}
          </button>
        </div>

        {/* Inline Add Record Form */}
        {showForm && (
          <form
            onSubmit={handleAddRecord}
            className="bg-blue-50/40 rounded-2xl border border-blue-100 p-5 mb-6 space-y-4 animate-in fade-in duration-150"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>New Medical Entry</span>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Diagnosis
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
                placeholder="e.g. Acute Bronchitis, Seasonal Flu"
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Symptoms (Optional)
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={3}
                placeholder="Describe patient symptoms, vitals, or clinical notes..."
                className="w-full px-4 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Medical Record'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Existing Medical Records Cards */}
        {history.medicalRecords.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs bg-slate-50/60 rounded-2xl border border-slate-100">
            No medical records added yet for this patient.
          </div>
        ) : (
          <div className="space-y-4">
            {history.medicalRecords.map((record: any) => (
              <div
                key={record.id}
                className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100/80 hover:bg-white hover:shadow-xs transition duration-150"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{record.diagnosis}</h3>
                    {record.symptoms && (
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{record.symptoms}</p>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200/60 flex-shrink-0">
                    {new Date(record.recordDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}