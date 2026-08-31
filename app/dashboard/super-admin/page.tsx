'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

interface PendingOrg {
    id: string;
    name: string;
    address: string | null;
    users: { name: string; email: string }[];
}

export default function PendingRequestsPage() {
    const [pending, setPending] = useState<PendingOrg[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await apiRequest('/organization/pending');
            setPending(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try {
            await apiRequest(`/organization/${id}/approve`, { method: 'PATCH' });
            setPending((prev) => prev.filter((org) => org.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to approve');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id);
        try {
            await apiRequest(`/organization/${id}/reject`, { method: 'PATCH' });
            setPending((prev) => prev.filter((org) => org.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to reject');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Hospital Requests</h1>

            {error && (
                <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-red-200">{error}</div>
            )}

            {loading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
            ) : pending.length === 0 ? (
                <p className="text-gray-400 text-sm bg-white rounded-xl p-6 text-center ring-1 ring-gray-100">
                    No pending requests.
                </p>
            ) : (
                <div className="space-y-3">
                    {pending.map((org) => (
                        <div key={org.id} className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-5">
                            <h2 className="text-lg font-semibold text-gray-900">{org.name}</h2>
                            {org.address && <p className="text-gray-500 text-sm">{org.address}</p>}
                            {org.users[0] && (
                                <p className="text-gray-600 text-sm mt-2">
                                    Admin: <span className="font-medium">{org.users[0].name}</span> ({org.users[0].email})
                                </p>
                            )}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleApprove(org.id)}
                                    disabled={actionLoading === org.id}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium transition disabled:opacity-50"
                                >
                                    ✓ Approve
                                </button>
                                <button
                                    onClick={() => handleReject(org.id)}
                                    disabled={actionLoading === org.id}
                                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 text-sm font-medium transition disabled:opacity-50"
                                >
                                    ✕ Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}