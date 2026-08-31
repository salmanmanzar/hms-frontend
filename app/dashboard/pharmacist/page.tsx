'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { 
  Pill, 
  PlusCircle, 
  AlertTriangle, 
  AlertCircle, 
  Search, 
  Package, 
  PackageX, 
  RefreshCw,
  Barcode,
  CheckCircle2
} from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  code: string;
  price: number;
  stockQty: number;
}

export default function MedicineListPage() {
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredMedicines = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = medicines.filter((m) => m.stockQty < 10).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header section with Stats & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Medicines Inventory</h1>
            {!loading && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200/60">
                <Package className="w-3.5 h-3.5" />
                {medicines.length} {medicines.length === 1 ? 'Medicine' : 'Medicines'} in inventory
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor product stock levels, unit pricing, and barcode identifiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMedicines}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition disabled:opacity-50"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => router.push('/dashboard/pharmacist/add')}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/10 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Medicine
          </button>
        </div>
      </div>

      {/* Summary KPI Badges (Low stock notice) */}
      {!loading && lowStockCount > 0 && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold">Low Stock Alert</p>
              <p className="text-xs text-amber-700">
                {lowStockCount} {lowStockCount === 1 ? 'item has' : 'items have'} low stock quantity (&lt; 10 units). Please reorder soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 overflow-hidden">
        {/* Table Controls (Search filter) */}
        {!loading && medicines.length > 0 && (
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search medicine name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Showing {filteredMedicines.length} of {medicines.length}
            </span>
          </div>
        )}

        {loading ? (
          /* Skeleton Loader */
          <div className="p-6 space-y-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 h-10 bg-slate-100/70 rounded-xl p-2 items-center">
                      <div className="h-3 bg-slate-200 rounded col-span-1"></div>
                      <div className="h-3 bg-slate-200 rounded col-span-1"></div>
                      <div className="h-3 bg-slate-200 rounded col-span-1"></div>
                      <div className="h-3 bg-slate-200 rounded col-span-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : medicines.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PackageX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No medicines added yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-5">
              Your pharmacy inventory is currently empty. Add your first medicine to start scanning and billing.
            </p>
            <button
              onClick={() => router.push('/dashboard/pharmacist/add')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" /> Add First Medicine
            </button>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No medicines match standard query &quot;{searchTerm}&quot;
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Medicine Name</th>
                  <th className="px-5 py-3.5">Barcode / Code</th>
                  <th className="px-5 py-3.5 text-right">Price</th>
                  <th className="px-5 py-3.5 text-right">Stock Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMedicines.map((m) => {
                  const isOut = m.stockQty === 0;
                  const isLow = m.stockQty > 0 && m.stockQty < 10;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                            <Pill className="w-4 h-4" />
                          </div>
                          <span>{m.name}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/50">
                          <Barcode className="w-3.5 h-3.5 text-slate-400" />
                          {m.code}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right font-medium text-slate-900">
                        Rs. {m.price.toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                            Out of Stock (0)
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Low Stock ({m.stockQty})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {m.stockQty} Units
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}