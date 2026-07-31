'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { decodeToken } from '@/lib/jwt';
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

export default function ReceptionistDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'register' | 'book'>('register');

  // Register Patient state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Book Appointment state
  const [searchEmail, setSearchEmail] = useState('');
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);
  const [searchError, setSearchError] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
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
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    const decoded = decodeToken(token);
    if (decoded?.role !== 'receptionist') {
      router.push('/login');
      return;
    }
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);

    try {
      await apiRequest('/auth/register-patient', {
        method: 'POST',
        body: JSON.stringify({ name, email, dob, gender, bloodGroup, address }),
      });

      setRegSuccess(`${name} has been registered. An invite email has been sent.`);
      setName('');
      setEmail('');
      setDob('');
      setGender('male');
      setBloodGroup('');
      setAddress('');
    } catch (err: any) {
      setRegError(err.message || 'Failed to register patient');
    } finally {
      setRegLoading(false);
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

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h1>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded ${activeTab === 'register' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Register Patient
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-2 rounded ${activeTab === 'book' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Book Appointment
          </button>
        </div>

        {activeTab === 'register' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Register New Patient</h2>

            {regError && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{regError}</div>}
            {regSuccess && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{regSuccess}</div>}

            <form onSubmit={handleRegisterSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Date of Birth</label>
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Blood Group (optional)</label>
                <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="e.g. O+"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-gray-700">Address (optional)</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
              </div>
              <button type="submit" disabled={regLoading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {regLoading ? 'Registering...' : 'Register Patient'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'book' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Book Appointment for Patient</h2>

            <form onSubmit={handleSearchPatient} className="mb-4 flex gap-2">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Patient's email"
                required
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Search
              </button>
            </form>

            {searchError && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{searchError}</div>}
            {bookSuccess && <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">{bookSuccess}</div>}

            {foundPatient && (
              <div className="border border-gray-200 rounded p-4 mb-4">
                <p className="text-gray-900 font-medium">{foundPatient.user.name}</p>
                <p className="text-gray-500 text-sm">{foundPatient.user.email}</p>
              </div>
            )}

            {foundPatient && (
              <form onSubmit={handleBookSubmit}>
                {bookError && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{bookError}</div>}

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Select Doctor</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => {
                      setSelectedDoctorId(e.target.value);
                      setSelectedDate('');
                      setSlots([]);
                      setSelectedSlot(null);
                    }}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
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
                    <label className="block text-sm font-medium mb-1 text-gray-700">Select Date</label>
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
                )}

                {slotsLoading && <p className="text-gray-600 mb-4">Loading slots...</p>}

                {!slotsLoading && selectedDate && slots.length === 0 && (
                  <p className="text-gray-600 mb-4">No available slots on this date.</p>
                )}

                {slots.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700">Select Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
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
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1 text-gray-700">Reason for visit</label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={booking}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {booking ? 'Booking...' : `Confirm Appointment at ${selectedSlot}`}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}