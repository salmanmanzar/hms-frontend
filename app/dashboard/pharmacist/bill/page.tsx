'use client';

import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  ScanLine, 
  Barcode, 
  ShoppingCart, 
  Trash2, 
  Search, 
  UserCheck, 
  Stethoscope, 
  Printer, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Receipt,
  Loader2,
  X,
  Sparkles,
  Percent
} from 'lucide-react';

interface CartItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  stockAvailable: number;
}

interface Doctor {
  id: string;
  specialization: string;
  user: { name: string };
}

interface Patient {
  id: string;
  user: { name: string; email: string };
}

export default function ScanBillPage() {
  const [scanValue, setScanValue] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scanError, setScanError] = useState('');
  const scanInputRef = useRef<HTMLInputElement>(null);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const [searchEmail, setSearchEmail] = useState('');
  const [foundPatient, setFoundPatient] = useState<Patient | null>(null);
  const [patientError, setPatientError] = useState('');

  const [billResult, setBillResult] = useState<any>(null);
  const [billError, setBillError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [pendingMedicine, setPendingMedicine] = useState<any>(null);
  const [pendingQty, setPendingQty] = useState('1');

  useEffect(() => {
    fetchDoctors();
    scanInputRef.current?.focus();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await apiRequest('/doctor');
      setDoctors(data);
    } catch {
      // ignore
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanError('');

    if (!scanValue.trim()) return;

    try {
      const medicine = await apiRequest(`/medicine/by-code/${encodeURIComponent(scanValue)}`);
      setPendingMedicine(medicine);
      setPendingQty('1');
      setScanValue('');
    } catch (err: any) {
      setScanError(err.message || 'Medicine not found');
      setScanValue('');
    }
  };

  const confirmAddToCart = () => {
    if (!pendingMedicine) return;
    const qty = Number(pendingQty);
    if (qty < 1) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.medicineId === pendingMedicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicineId === pendingMedicine.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          medicineId: pendingMedicine.id,
          name: pendingMedicine.name,
          price: pendingMedicine.price,
          quantity: qty,
          stockAvailable: pendingMedicine.stockQty,
        },
      ];
    });

    setPendingMedicine(null);
    setPendingQty('1');
    scanInputRef.current?.focus();
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.medicineId === medicineId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (medicineId: string) => {
    setCart((prev) => prev.filter((item) => item.medicineId !== medicineId));
  };

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setPatientError('');
    setFoundPatient(null);
    try {
      const data = await apiRequest(`/patient/search/by-email?email=${encodeURIComponent(searchEmail)}`);
      setFoundPatient(data);
    } catch (err: any) {
      setPatientError(err.message || 'Patient not found');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleGenerateBill = async () => {
    if (cart.length === 0) return;
    setGenerating(true);
    setBillError('');

    try {
      const result = await apiRequest('/sale', {
        method: 'POST',
        body: JSON.stringify({
          patientId: foundPatient?.id,
          doctorId: selectedDoctorId || undefined,
          items: cart.map((item) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
          })),
        }),
      });

      setBillResult(result);
      setCart([]);
      setFoundPatient(null);
      setSearchEmail('');
      setSelectedDoctorId('');
    } catch (err: any) {
      setBillError(err.message || 'Failed to generate bill');
    } finally {
      setGenerating(false);
    }
  };

  if (billResult) {
    const billDate = new Date(billResult.createdAt).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    return (
      <div className="max-w-xl mx-auto space-y-6">
        {/* Printable Receipt Card */}
        <div 
          id="printable-bill" 
          className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/80 p-6 sm:p-8 space-y-6"
        >
          {/* Hospital Header */}
          <div className="text-center pb-5 border-b-2 border-slate-900">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-2.5 shadow-md shadow-blue-500/20">
              H
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hospital Management System</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Central Pharmacy & Medical Outlet</p>
            <p className="text-[11px] text-slate-400 mt-1">Rawalpindi, Pakistan · Ph: +92-51-1234567 · pharmacy@hms.com</p>
          </div>

          {/* Receipt Meta */}
          <div className="flex justify-between items-center text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Bill Reference</span>
              <span className="font-bold text-slate-900">#{billResult.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-sans">Date & Time</span>
              <span className="font-semibold text-slate-700">{billDate}</span>
            </div>
          </div>

          {/* Patient / Doctor Metadata */}
          {(billResult.patient || billResult.doctor) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl">
              {billResult.patient && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Patient</span>
                  <span className="font-semibold text-slate-900">{billResult.patient.user.name}</span>
                </div>
              )}
              {billResult.doctor && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Prescribed By</span>
                  <span className="font-semibold text-blue-700">Dr. {billResult.doctor.user.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="text-left py-2.5 font-bold">Sr</th>
                  <th className="text-left py-2.5 font-bold">Medicine</th>
                  <th className="text-center py-2.5 font-bold">Qty</th>
                  <th className="text-right py-2.5 font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {billResult.items.map((item: any, index: number) => (
                  <tr key={item.id}>
                    <td className="py-2.5 text-slate-400 font-mono">{index + 1}</td>
                    <td className="py-2.5 font-medium text-slate-900">{item.medicine.name}</td>
                    <td className="py-2.5 text-center text-slate-700 font-semibold">{item.quantity}</td>
                    <td className="py-2.5 text-right text-slate-900 font-mono">
                      Rs. {(item.priceAtSale * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal / Discount / Total Breakdown */}
          <div className="border-t border-slate-200 pt-4 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono">Rs. {Number(billResult.subtotal).toFixed(2)}</span>
            </div>

            {billResult.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5" /> Doctor Prescription Discount (5%)
                </span>
                <span className="font-mono">- Rs. {Number(billResult.discountAmount).toFixed(2)}</span>
              </div>
            )}

            <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-center text-base sm:text-lg font-extrabold text-slate-900">
              <span>Total Amount</span>
              <span className="font-mono text-blue-600">Rs. {Number(billResult.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700">Thank you for choosing HMS Pharmacy</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Please retain this bill for your medical records</p>
          </div>
        </div>

        {/* Action Buttons (Excluded from print) */}
        <div className="flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-slate-800 hover:bg-slate-900 active:bg-black text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print Bill
          </button>
          <button
            onClick={() => setBillResult(null)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20"
          >
            <PlusCircle className="w-4 h-4" /> New Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scan & Bill (Point of Sale)</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Scan medicine barcodes, update quantities, assign prescriptions, and generate patient bills.
        </p>
      </div>

      {/* Prominent Barcode Scanner Box */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/80 p-5 sm:p-6 transition-all border-2 border-blue-500/30 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10">
        <form onSubmit={handleScan}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-blue-600" />
              Scan Barcode Input
            </label>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Scanner Listening
            </span>
          </div>

          <div className="relative">
            <Barcode className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              ref={scanInputRef}
              type="text"
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              placeholder="Scan barcode or press Enter to lookup..."
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-base sm:text-lg font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </form>

        {scanError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{scanError}</span>
          </div>
        )}
      </div>

      {/* Inline Confirm Quantity Card */}
      {pendingMedicine && (
        <div className="bg-gradient-to-r from-blue-50/90 to-teal-50/50 rounded-2xl ring-1 ring-blue-200/80 p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{pendingMedicine.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {pendingMedicine.stockQty} in stock
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Unit Price: <span className="font-bold text-slate-900">Rs. {pendingMedicine.price.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600">Qty:</label>
                <input
                  type="number"
                  min={1}
                  max={pendingMedicine.stockQty}
                  value={pendingQty}
                  onChange={(e) => setPendingQty(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmAddToCart()}
                  autoFocus
                  className="w-20 bg-white border border-blue-300 rounded-xl py-2 text-center text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <button
                onClick={confirmAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/10 transition"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={() => setPendingMedicine(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Section */}
      {cart.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              Shopping Cart Items ({cart.length})
            </h2>
            <span className="text-xs text-slate-500 font-medium">Itemized List</span>
          </div>

          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div
                key={item.medicineId}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    Rs. {item.price.toFixed(2)} each · <span className="text-slate-400">{item.stockAvailable} available</span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-slate-400 hidden sm:inline">Qty:</label>
                    <input
                      type="number"
                      min={1}
                      max={item.stockAvailable}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.medicineId, Number(e.target.value))}
                      className="w-16 bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 text-center text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <span className="text-sm font-bold text-slate-900 w-24 text-right font-mono">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.medicineId)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Running Subtotal Bar */}
          <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm sm:text-base font-bold text-slate-900">
            <span className="text-slate-600 font-medium">Running Subtotal</span>
            <span className="font-mono text-blue-600 text-lg">Rs. {total.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-8 text-center">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Shopping Cart is Empty</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Scan medicine barcodes above to automatically add products to this cart.
          </p>
        </div>
      )}

      {/* Patient & Prescribing Doctor Selection */}
      {cart.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Search Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Patient Account (Optional)
            </label>

            <form onSubmit={handleSearchPatient} className="flex gap-2">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Patient's email address..."
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
              />
              <button
                type="submit"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1 transition shrink-0"
              >
                <Search className="w-3.5 h-3.5" /> Find
              </button>
            </form>

            {patientError && (
              <p className="text-red-600 text-xs font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {patientError}
              </p>
            )}

            {foundPatient && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">{foundPatient.user.name}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-mono truncate max-w-[120px]">
                  {foundPatient.user.email}
                </span>
              </div>
            )}
          </div>

          {/* Prescribing Doctor Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 p-5 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Prescribing Doctor (Optional)
            </label>

            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
            >
              <option value="">Walk-in (no doctor)</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.user.name} ({doc.specialization})
                </option>
              ))}
            </select>

            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              Selecting a prescribing doctor automatically applies a 5% prescription discount.
            </p>
          </div>
        </div>
      )}

      {/* Bill Generation Error */}
      {billError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs sm:text-sm border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{billError}</span>
        </div>
      )}

      {/* Prominent Generate Bill Button */}
      {cart.length > 0 && (
        <button
          onClick={handleGenerateBill}
          disabled={generating}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base sm:text-lg py-4 rounded-2xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Bill...
            </>
          ) : (
            <>
              <Receipt className="w-5 h-5" />
              Generate Bill — Rs. {total.toFixed(2)}
            </>
          )}
        </button>
      )}
    </div>
  );
}