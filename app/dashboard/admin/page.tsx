'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { decodeToken } from '@/lib/jwt';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('doctor');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    const decoded = decodeToken(token);
    if (decoded?.role !== 'admin') {
      router.push('/login');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiRequest('/auth/create-staff', {
        method: 'POST',
        body: JSON.stringify({ name, email, role }),
      });

      setSuccess(`${name} has been added as ${role}. An invite email has been sent.`);
      setName('');
      setEmail('');
      setRole('doctor');
    } catch (err: any) {
      setError(err.message || 'Failed to create staff member');
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Add New Staff Member
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending invite...' : 'Add Staff Member'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}