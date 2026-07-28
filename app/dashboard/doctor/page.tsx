'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { decodeToken } from '@/lib/jwt';

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  reason: string | null;
  patient: {
    user: { name: string; email: string };
  };
}

interface Department {
  id: string;
  name: string;
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    const decoded = decodeToken(token);
    if (decoded?.role !== 'doctor') {
      router.push('/login');
      return;
    }
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const profile = await apiRequest('/doctor/me/profile');
      if (profile) {
        setHasProfile(true);
        fetchAppointments();
      } else {
        setHasProfile(false);
        fetchDepartments();
      }
    } catch (err) {
      setHasProfile(false);
      fetchDepartments();
    } finally {
      setProfileChecked(true);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await apiRequest('/department');
      setDepartments(data);
    } catch (err: any) {
      setProfileError('Failed to load departments');
    }
  };

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileLoading(true);

    try {
      await apiRequest('/doctor', {
        method: 'POST',
        body: JSON.stringify({ specialization, qualification, departmentId }),
      });

      setHasProfile(true);
      fetchAppointments();
    } catch (err: any) {
      setProfileError(err.message || 'Failed to save profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
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

  if (!profileChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">
            Complete Your Profile
          </h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Please provide your professional details to continue.
          </p>

          {profileError && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Specialization
              </label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
                placeholder="e.g. Cardiologist"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Qualification
              </label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                required
                placeholder="e.g. MBBS, FCPS"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Department
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {profileLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-600">No appointments scheduled.</p>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {appt.patient.user.name}
                  </h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{formatDateTime(appt.scheduledAt)}</p>
                {appt.reason && (
                  <p className="text-gray-500 text-sm mt-2">
                    <span className="font-medium">Reason:</span> {appt.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}