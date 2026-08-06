'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment for Patient</h1>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
        <form onSubmit={handleSearchPatient} className="mb-4 flex gap-2">
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Patient's email"
            required
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition">
            Search
          </button>
        </form>

        {searchError && (
          <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-red-200">{searchError}</div>
        )}
        {bookSuccess && (
          <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-emerald-200">{bookSuccess}</div>
        )}

        {foundPatient && (
          <div className="border border-gray-100 rounded-lg p-3 mb-4 bg-gray-50">
            <p className="text-gray-900 text-sm font-medium">{foundPatient.user.name}</p>
            <p className="text-gray-500 text-xs">{foundPatient.user.email}</p>
          </div>
        )}

        {foundPatient && (
          <form onSubmit={handleBookSubmit}>
            {bookError && (
              <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-red-200">{bookError}</div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium mb-1.5 text-gray-500">Select Doctor</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(e.target.value);
                  setSelectedDate('');
                  setSlots([]);
                  setSelectedSlot(null);
                }}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.user.name} - {doc.specialization}
                  </option>
                ))}
              </select>
            </div>

            {selectedDoctorId && (
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1.5 text-gray-500">Select Date</label>
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
                  placeholderText="Click to select a date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition"
                />
              </div>
            )}

            {slotsLoading && <p className="text-gray-500 text-sm mb-4">Loading slots...</p>}
            {!slotsLoading && selectedDate && slots.length === 0 && (
              <p className="text-gray-500 text-sm mb-4">No available slots on this date.</p>
            )}

            {slots.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2 text-gray-500">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-lg border text-sm transition ${
                        selectedSlot === slot
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSlot && (
              <>
                <div className="mb-4">
                  <label className="block text-xs font-medium mb-1.5 text-gray-500">Reason for visit</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={booking}
                  className="w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium transition"
                >
                  {booking ? 'Booking...' : `Confirm Appointment at ${selectedSlot}`}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}