'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BookAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.doctorId as string;

  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, []);

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setError('');

    if (!date) {
      setSlots([]);
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest(`/doctor/${doctorId}/available-slots?date=${date}`);
      setSlots(data.availableSlots);
    } catch (err: any) {
      setError(err.message || 'Failed to load slots');
    } finally {
      setLoading(false);
    }
  };
  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate) return;

    setBooking(true);
    setError('');

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedSlot}:00.000Z`).toISOString();

      await apiRequest('/appointment', {
        method: 'POST',
        body: JSON.stringify({
          doctorId,
          scheduledAt,
          reason,
        }),
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Appointment Booked!
          </h1>
          <p className="text-gray-600 mb-6">
            Your appointment on {selectedDate} at {selectedSlot} has been confirmed.
            A confirmation email will be sent shortly.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Book Appointment</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
  <label className="block text-sm font-medium mb-1 text-gray-700">
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
    placeholderText="Click to select a date"
    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
  />
</div>

        {loading && <p className="text-gray-600">Loading slots...</p>}

        {!loading && selectedDate && slots.length === 0 && (
          <p className="text-gray-600">No available slots on this date.</p>
        )}

        {slots.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Select Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleSlotClick(slot)}
                  className={`py-2 rounded border text-sm ${
                    selectedSlot === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSlot && (
          <form onSubmit={handleBookingSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Reason for visit
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                placeholder="Describe your symptoms or reason for visit..."
              />
            </div>

            <button
              type="submit"
              disabled={booking}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {booking ? 'Booking...' : `Confirm Appointment at ${selectedSlot}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}