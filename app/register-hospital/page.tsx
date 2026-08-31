'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

export default function RegisterHospitalPage() {
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [password, setPassword] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const data = await apiRequest('/auth/register-organization', {
                method: 'POST',
                body: JSON.stringify({ adminName, adminEmail, password, organizationName, address }),
            });
            setMessage(data.message);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">
                    Register Your Hospital
                </h1>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Submit your hospital for approval. You'll be notified once reviewed.
                </p>

                {message && (
                    <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-emerald-200">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>
                )}

                {!message && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Hospital Name</label>
                            <input type="text" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Hospital Address (optional)</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Your Name (Admin)</label>
                            <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Your Email</label>
                            <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                            {loading ? 'Submitting...' : 'Submit for Approval'}
                        </button>
                    </form>
                )}

                <p className="text-center text-sm mt-4 text-gray-600">
                    <Link href="/login" className="text-blue-600 hover:underline">← Back to Login</Link>
                </p>
            </div>
        </div>
    );
}