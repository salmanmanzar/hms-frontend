'use client';

import { useState, useEffect, useRef } from 'react';
import { apiRequest } from '@/lib/api';

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
    <div className="max-w-md mx-auto">
      <div id="printable-bill" className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
        <div className="text-center mb-4 pb-4 border-b-2 border-gray-800">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">
            H
          </div>
          <h1 className="text-lg font-bold text-gray-900">Hospital Management System</h1>
          <p className="text-xs text-gray-500 mt-1">Rawalpindi, Pakistan</p>
          <p className="text-xs text-gray-500">Ph: +92-51-1234567 · pharmacy@hms.com</p>
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>Bill #{billResult.id.slice(0, 8).toUpperCase()}</span>
          <span>{billDate}</span>
        </div>

        {billResult.patient && (
          <p className="text-sm text-gray-600 mb-1">
            Patient: <span className="text-gray-900 font-medium">{billResult.patient.user.name}</span>
          </p>
        )}
        {billResult.doctor && (
          <p className="text-sm text-gray-600 mb-4">
            Prescribed by: <span className="text-gray-900 font-medium">Dr. {billResult.doctor.user.name}</span>
          </p>
        )}

        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b-2 border-gray-800 text-xs text-gray-500 uppercase">
              <th className="text-left py-2">Sr</th>
              <th className="text-left py-2">Medicine</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {billResult.items.map((item: any, index: number) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2 text-gray-500">{index + 1}</td>
                <td className="py-2 text-gray-900">{item.medicine.name}</td>
                <td className="py-2 text-center text-gray-700">{item.quantity}</td>
                <td className="py-2 text-right text-gray-700">
                  Rs. {item.priceAtSale * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Subtotal / Discount / Total Breakdown */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>Rs. {billResult.subtotal}</span>
          </div>

          {billResult.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Doctor Prescription Discount (5%)</span>
              <span>- Rs. {billResult.discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t-2 border-gray-800 pt-2 flex justify-between text-base font-bold text-gray-900">
            <span>Total Amount</span>
            <span>Rs. {billResult.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* {billResult.commissionAmount && (
          <p className="text-xs text-gray-400 mt-2 print:hidden">
            Dr. {billResult.doctor?.user.name} commission: Rs. {billResult.commissionAmount.toFixed(2)}
          </p>
        )} */}

        <p className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
          Thank you for choosing HMS Pharmacy
        </p>
      </div>

      <div className="flex gap-2 mt-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-700 text-white py-2.5 rounded-lg hover:bg-gray-800 text-sm font-medium transition"
        >
          🖨️ Print Bill
        </button>
        <button
          onClick={() => setBillResult(null)}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition"
        >
          New Bill
        </button>
      </div>
    </div>
  );
}
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Scan & Bill</h1>

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6 mb-4">
        <form onSubmit={handleScan}>
          <label className="block text-xs font-medium mb-1.5 text-gray-500">
            Scan Barcode
          </label>
          <input
            ref={scanInputRef}
            type="text"
            value={scanValue}
            onChange={(e) => setScanValue(e.target.value)}
            placeholder="Ready to scan..."
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base text-gray-900 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition"
          />
        </form>
        {scanError && <p className="text-red-600 text-sm mt-2">{scanError}</p>}
      </div>
      {pendingMedicine && (
  <div className="bg-blue-50 rounded-xl ring-1 ring-blue-200 p-4 mb-4">
    <p className="text-sm font-medium text-gray-900 mb-1">{pendingMedicine.name}</p>
    <p className="text-xs text-gray-500 mb-3">
      Rs. {pendingMedicine.price} each · {pendingMedicine.stockQty} in stock
    </p>
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500">Quantity:</label>
      <input
        type="number"
        min={1}
        max={pendingMedicine.stockQty}
        value={pendingQty}
        onChange={(e) => setPendingQty(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && confirmAddToCart()}
        autoFocus
        className="w-20 border border-blue-200 rounded-lg px-2 py-1.5 text-sm text-center text-black"
      />
      <button
        onClick={confirmAddToCart}
        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
      <button
        onClick={() => setPendingMedicine(null)}
        className="text-gray-400 hover:text-gray-600 text-sm"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      {cart.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 overflow-hidden mb-4">
          {cart.map((item) => (
            <div key={item.medicineId} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">Rs. {item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                {/* <input
                  type="number"
                  min={1}
                  max={item.stockAvailable}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.medicineId, Number(e.target.value))}
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-sm text-center"
                /> */}
                <span className="text-sm text-gray-700 w-16 text-right">
                  Rs. {item.price * item.quantity}
                </span>
                <button
                  onClick={() => removeItem(item.medicineId)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <div className="px-4 py-3 bg-gray-50 flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6 mb-4 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-gray-500">
              Patient (optional)
            </label>
            <form onSubmit={handleSearchPatient} className="flex gap-2">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Patient's email"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50"
              />
              <button type="submit" className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200">
                Find
              </button>
            </form>
            {patientError && <p className="text-red-600 text-xs mt-1">{patientError}</p>}
            {foundPatient && (
              <p className="text-emerald-600 text-xs mt-1">✓ {foundPatient.user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-gray-500">
              Prescribing Doctor (optional — for commission tracking)
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-gray-50"
            >
              <option value="">Walk-in (no doctor)</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.user.name} - {doc.specialization}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {billError && (
        <div className="bg-red-50 text-red-700 p-2.5 rounded-lg mb-4 text-sm ring-1 ring-red-200">{billError}</div>
      )}

      {cart.length > 0 && (
        <button
          onClick={handleGenerateBill}
          disabled={generating}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium transition"
        >
          {generating ? 'Generating...' : `Generate Bill — Rs. ${total}`}
        </button>
      )}
    </div>
  );
}