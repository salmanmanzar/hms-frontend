'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';

interface Medicine {
  id: string;
  name: string;
  code: string;
  price: number;
  stockQty: number;
}

export default function MedicineListPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/medicine');
      setMedicines(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Medicines</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-red-200">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : medicines.length === 0 ? (
        <p className="text-gray-400 text-sm bg-white rounded-xl p-6 text-center ring-1 ring-gray-100">
          No medicines added yet.
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Code</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m.id} className="border-t border-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-gray-500">{m.code}</td>
                  <td className="px-4 py-3 text-right text-gray-700">Rs. {m.price}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={m.stockQty < 10 ? 'text-red-600 font-medium' : 'text-gray-700'}>
                      {m.stockQty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}