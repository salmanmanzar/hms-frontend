'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { stripePromise } from '@/lib/stripe';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Stethoscope,
  Sparkles,
  CreditCard,
  Lock,
  ShieldCheck,
  Receipt,
  User,
} from 'lucide-react';

function PaymentForm({
  clientSecret,
  amount,
  onSuccess,
  onCancel,
}: {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: cardHolderName || undefined,
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment processing failed');
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setError('Payment could not be completed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-teal-600" />
          Card Payment Details
        </label>
        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
          <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
        </span>
      </div>

      {/* Consultation Fee Summary Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shadow-md">
        <div>
          <span className="text-[11px] text-slate-300 font-medium block">Total Payable Amount</span>
          <span className="text-sm font-semibold text-slate-200">Consultation Fee</span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-teal-400">Rs. {amount}</span>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="card-name" className="block text-[11px] font-semibold text-slate-600 uppercase mb-1.5">
          Cardholder Name
        </label>
        <div className="relative rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <input
            id="card-name"
            type="text"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Stripe CardElement */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1.5">
          Credit or Debit Card
        </label>
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#0f172a',
                  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                  '::placeholder': { color: '#94a3b8' },
                },
                invalid: {
                  color: '#e11d48',
                },
              },
            }}
          />
        </div>
      </div>

      <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
        <span>🔒 Test mode — use card number <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">4242 4242 4242 4242</code>, any future expiry & CVC.</span>
      </p>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2 animate-slide-up">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError('')} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="w-1/3 py-3.5 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs transition cursor-pointer disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-2/3 py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 active:scale-[0.99] shadow-lg shadow-teal-600/20 transition-all duration-200 flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-60"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Pay Rs. {amount} & Confirm</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.doctorId as string;

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  const [doctorInfo, setDoctorInfo] = useState<{ name: string; specialization: string; department: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentIntentId, setPaymentIntentId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchDoctorDetails();
  }, [doctorId]);

  const fetchDoctorDetails = async () => {
    try {
      const data = await apiRequest(`/doctor/${doctorId}`);
      if (data) {
        setDoctorInfo({
          name: data.user?.name || 'Medical Specialist',
          specialization: data.specialization || 'Specialist',
          department: data.department?.name || 'Clinical Care',
        });
      }
    } catch (e) {
      setDoctorInfo({
        name: 'Medical Specialist',
        specialization: 'Healthcare Practitioner',
        department: 'Outpatient Clinic',
      });
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setError('');

    if (!date) {
      setSlots([]);
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest(`/doctor/${doctorId}/available-slots?date=${date}`);
      setSlots(data.availableSlots || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load available slots for this date');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedDate || !selectedSlot || !reason.trim()) {
      setError('Please choose a date, time slot, and specify your reason for visit.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/payment/create-intent', { method: 'POST', body: JSON.stringify({ doctorId }), });
      setClientSecret(data.clientSecret);
      setAmount(data.amount);
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment gateway.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (piId: string) => {
    setPaymentIntentId(piId);
    setError('');

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedSlot}:00.000Z`).toISOString();

      await apiRequest('/appointment', {
        method: 'POST',
        body: JSON.stringify({
          doctorId,
          scheduledAt,
          reason,
          paymentIntentId: piId,
        }),
      });

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Payment succeeded but appointment creation failed. Please contact support.');
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans animate-slide-up">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Payment Successful & Confirmed
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Appointment Booked!</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Your appointment with <strong className="text-slate-800">{doctorInfo?.name || 'your doctor'}</strong> is confirmed. A confirmation email has been sent.
          </p>

          {/* Paid Invoice Receipt Summary */}
          <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs text-left">
            <div className="flex items-center justify-between font-bold text-slate-900 pb-2 border-b border-slate-200">
              <span className="flex items-center gap-1.5"><Receipt className="w-4 h-4 text-teal-600" /> Invoice Receipt:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 uppercase tracking-wider font-bold">
                PAID Rs. {amount}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Date & Time:</span>
              <span className="font-semibold text-slate-900">{selectedDate} @ {selectedSlot}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Transaction ID:</span>
              <span className="font-mono text-[11px] text-slate-800 font-semibold truncate max-w-[170px]">{paymentIntentId}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-md transition-all text-xs cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back navigation button */}
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-600 transition-colors p-2 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Doctor Summary Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm ring-1 ring-slate-100 border border-slate-100 flex items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-600 to-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{doctorInfo?.name || 'Book Appointment'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700">
                  Verified Specialist
                </span>
              </div>
              <p className="text-xs font-medium text-teal-600 mt-0.5">
                {doctorInfo?.specialization} &bull; {doctorInfo?.department}
              </p>
            </div>
          </div>

          {amount > 0 && (
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultation Fee</span>
              <span className="text-xl font-extrabold text-slate-900">Rs. {amount}</span>
            </div>
          )}
        </div>

        {/* Main Booking & Billing Container */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            {step === 'details' ? 'Book Consultation & Checkout' : 'Secure Card Payment'}
          </h2>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-3 animate-slide-up"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-rose-500 hover:text-rose-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6">
              {/* Step 1: Interactive Date Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  1. Choose Appointment Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={selectedDate ? new Date(selectedDate) : null}
                    onChange={(date: Date | null) => {
                      if (date) {
                        const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                        handleDateChange(formatted);
                      }
                    }}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Click to select date..."
                    className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Step 2: Time Slot Pills Grid */}
              {selectedDate && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    2. Available Time Slots ({selectedDate})
                  </label>

                  {loading ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500 py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                      <span>Loading available slots...</span>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs text-center border border-slate-200/60">
                      No slots available on this date. Please select another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {slots.map((slot) => {
                        const isSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                              : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                              }`}
                          >
                            <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                            <span>{slot}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Reason for Visit */}
              {selectedSlot && (
                <div className="space-y-4 pt-4 border-t border-slate-100 animate-slide-up">
                  <div>
                    <label htmlFor="reason" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      3. Reason for Visit / Symptoms
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      rows={3}
                      placeholder="Please describe your symptoms or reason for visit..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    disabled={!reason.trim() || loading}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 active:scale-[0.99] shadow-lg shadow-teal-600/20 transition-all duration-200 flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Initializing Payment...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Continue to Payment</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'payment' && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                clientSecret={clientSecret}
                amount={amount}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setStep('details')}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}