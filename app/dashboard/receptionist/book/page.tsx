'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  CalendarPlus, 
  Loader2,
  UserCheck
} from 'lucide-react';

interface Doctor {
  id: string;
  specialization: string;
  user: { name: string };
}

interface Patient {
  id: string;
  user: { name: string; email: string };
}

export default function BookAppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);
  const [searchError, setSearchError] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await apiRequest('/doctor');
      setDoctors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setFoundPatient(null);
    try {
      const data = await apiRequest(`/patient/search/by-email?email=${encodeURIComponent(searchEmail)}`);
      setFoundPatient(data);
    } catch (err: any) {
      setSearchError(err.message || 'Patient not found');
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setBookError('');

    if (!date || !selectedDoctorId) {
      setSlots([]);
      return;
    }

    setSlotsLoading(true);
    try {
      const data = await apiRequest(`/doctor/${selectedDoctorId}/available-slots?date=${date}`);
      setSlots(data.availableSlots);
    } catch (err: any) {
      setBookError(err.message || 'Failed to load slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundPatient || !selectedDoctorId || !selectedDate || !selectedSlot) return;

    setBooking(true);
    setBookError('');

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedSlot}:00.000Z`).toISOString();

      await apiRequest('/appointment', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          scheduledAt,
          reason,
          patientId: foundPatient.id,
        }),
      });

      setBookSuccess(`Appointment booked for ${foundPatient.user.name} on ${selectedDate} at ${selectedSlot}.`);
      setFoundPatient(null);
      setSearchEmail('');
      setSelectedDoctorId('');
      setSelectedDate('');
      setSlots([]);
      setSelectedSlot(null);
      setReason('');
    } catch (err: any) {
      setBookError(err.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <CalendarPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Book Appointment for Patient</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Locate patient account by email and schedule an appointment with an available doctor.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Container */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-6 sm:p-8 space-y-6">
        {/* Step 1: Find Patient Search */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-blue-600" />
            Step 1: Find Patient Account
          </label>
          <form onSubmit={handleSearchPatient} className="flex gap-2">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Enter patient's email..."
              required
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </form>
        </div>

        {/* Global Notifications */}
        {searchError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs sm:text-sm border border-red-200 flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {bookSuccess && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs sm:text-sm border border-emerald-200 flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{bookSuccess}</span>
          </div>
        )}

        {/* Patient Found Banner */}
        {foundPatient && (
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between text-emerald-900 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Patient Verified</p>
                <p className="text-sm font-bold text-slate-900">{foundPatient.user.name}</p>
                <p className="text-xs text-slate-500 font-mono">{foundPatient.user.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Book
            </span>
          </div>
        )}

        {/* Step 2: Appointment Form (Revealed when patient is found) */}
        {foundPatient && (
          <form onSubmit={handleBookSubmit} className="space-y-5 pt-2 border-t border-slate-100 animate-in fade-in duration-300">
            {bookError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs sm:text-sm border border-red-200 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{bookError}</span>
              </div>
            )}

            {/* Doctor Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                Select Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  setSelectedDate('');
                  setSlots([]);
                  setSelectedSlot(null);
                }}
                required
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.user.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            {selectedDoctorId && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  Select Date
                </label>
                <DatePicker
                  selected={selectedDate ? new Date(selectedDate) : null}
                  onChange={(date: Date | null) => {
                    if (date) {
                      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                      handleDateChange(formatted);
                    }
                  }}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Click to select an available date"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            )}

            {/* Time Slot Loading */}
            {slotsLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                Fetching available time slots...
              </div>
            )}

            {/* No Slots Available State */}
            {!slotsLoading && selectedDate && slots.length === 0 && (
              <div className="bg-amber-50 text-amber-800 p-3.5 rounded-xl text-xs border border-amber-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                No available time slots found for this doctor on the selected date. Please choose another date.
              </div>
            )}

            {/* Time Slots Grid */}
            {slots.length > 0 && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Select Available Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                            : 'bg-slate-50/80 text-slate-800 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reason for Visit & Final Submit */}
            {selectedSlot && (
              <div className="space-y-4 pt-2 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Reason for Visit <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="Brief description of patient's symptoms or routine checkup..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={booking}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                  {booking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Booking Appointment...
                    </>
                  ) : (
                    `Confirm Appointment at ${selectedSlot}`
                  )}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}