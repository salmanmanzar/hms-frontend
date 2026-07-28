'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

interface Doctor {
  id: string;
  specialization: string;
  qualification: string;
  user: { name: string; email: string };
  department: { name: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const profile = await apiRequest('/patient/me/profile');
      if (profile) {
        setHasProfile(true);
        fetchDoctors('');
      } else {
        setHasProfile(false);
      }
    } catch (err) {
      setHasProfile(false);
    } finally {
      setProfileChecked(true);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileLoading(true);

    try {
      await apiRequest('/patient', {
        method: 'POST',
        body: JSON.stringify({ dob, gender, bloodGroup, address }),
      });

      setHasProfile(true);
      fetchDoctors('');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to save profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchDoctors = async (searchTerm: string) => {
    setLoading(true);
    setError('');
    try {
      const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const data = await apiRequest(`/doctor${query}`);
      setDoctors(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors(search);
  };

  const handleSelectDoctor = (doctorId: string) => {
    router.push(`/dashboard/book/${doctorId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
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
            Please provide your details to continue.
          </p>

          {profileError && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Blood Group (optional)
              </label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. O+"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Address (optional)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              />
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
          <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
          <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialization..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Search
          </button>
        </form>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p className="text-gray-600">No doctors found.</p>
        ) : (
          <div className="grid gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => handleSelectDoctor(doctor.id)}
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-gray-900">{doctor.user.name}</h2>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-sm text-gray-500">{doctor.qualification}</p>
                <p className="text-sm text-gray-500">Department: {doctor.department.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}