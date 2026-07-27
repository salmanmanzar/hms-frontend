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
    fetchDoctors('');
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
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
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Dr. {doctor.user.name}
                </h2>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-sm text-gray-500">{doctor.qualification}</p>
                <p className="text-sm text-gray-500">
                  Department: {doctor.department.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}