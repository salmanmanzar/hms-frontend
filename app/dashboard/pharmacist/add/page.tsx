'use client';

import { useState } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  Pill, 
  Barcode, 
  DollarSign, 
  PackagePlus, 
  CheckCircle2, 
  AlertCircle, 
  ScanLine, 
  X,
  Loader2
} from 'lucide-react';

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
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Medicine</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Register new pharmaceutical items to the active inventory catalogue.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-6 sm:p-8">
        {/* Smooth Dismissible Alert Banners */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-xs sm:text-sm border border-red-200 flex items-start justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600 transition p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl mb-6 text-xs sm:text-sm border border-emerald-200 flex items-start justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
            <button
              onClick={() => setSuccess('')}
              className="text-emerald-400 hover:text-emerald-700 transition p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Medicine Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Medicine Name
            </label>
            <div className="relative">
              <Pill className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Paracetamol 500mg"
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Barcode Input with Scanner Ready Cue */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Barcode / Product Code
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                Scanner Ready
              </span>
            </div>
            <div className="relative">
              <Barcode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoFocus
                placeholder="Scan or type barcode..."
                className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-mono text-slate-900 bg-slate-50/80 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
              <ScanLine className="w-4 h-4 text-blue-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Grid for Price and Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Price (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rs
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Initial Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Initial Stock
              </label>
              <div className="relative">
                <PackagePlus className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  required
                  min="0"
                  placeholder="e.g. 100"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 bg-slate-50/80 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm py-3 rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Add Medicine'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}