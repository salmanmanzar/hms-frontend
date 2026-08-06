'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/api';

export default function RegisterPatientPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiRequest('/auth/register-patient', {
        method: 'POST',
        body: JSON.stringify({ name, email, dob, gender, bloodGroup, address }),
      });

      setSuccess(`${name} has been registered. An invite email has been sent.`);
      setName('');
      setEmail('');
      setDob('');
      setGender('male');
      setBloodGroup('');
      setAddress('');
    } catch (err: any) {
      setError(err.message || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Register New Patient</h1>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-emerald-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Date of Birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition" />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Blood Group (optional)</label>
            <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="e.g. O+"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition" />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Address (optional)</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition">
            {loading ? 'Registering...' : 'Register Patient'}
          </button>
        </form>
      </div>
    </div>
  );
}