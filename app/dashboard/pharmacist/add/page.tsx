'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/api';

export default function AddMedicinePage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiRequest('/medicine', {
        method: 'POST',
        body: JSON.stringify({
          name,
          code,
          price: Number(price),
          stockQty: Number(stockQty),
        }),
      });

      setSuccess(`${name} has been added.`);
      setName('');
      setCode('');
      setPrice('');
      setStockQty('');
    } catch (err: any) {
      setError(err.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Medicine</h1>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-red-200">{error}</div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-emerald-200">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition" />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">
              Barcode <span className="text-gray-400">(scan or type)</span>
            </label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required
              autoFocus
              placeholder="Scan barcode here..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition" />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Price (Rs.)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition" />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-medium mb-1.5 text-gray-500">Initial Stock</label>
            <input type="number" value={stockQty} onChange={(e) => setStockQty(e.target.value)} required min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition">
            {loading ? 'Saving...' : 'Add Medicine'}
          </button>
        </form>
      </div>
    </div>
  );
}