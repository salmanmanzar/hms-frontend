'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { stripePromise } from '@/lib/stripe';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Building2,
  Check,
  ArrowRight,
  Activity,
  CreditCard,
  Lock,
  ShieldCheck,
  Loader2,
  Sparkles,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const PLAN_PRICES: Record<string, { name: string; price: number; formatted: string }> = {
  basic: { name: 'Basic', price: 5000, formatted: 'PKR 5,000 / month' },
  professional: { name: 'Professional', price: 10000, formatted: 'PKR 10,000 / month' },
  enterprise: { name: 'Enterprise', price: 20000, formatted: 'PKR 20,000 / month' },
};

function RegisterHospitalFormContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'professional';

  const stripe = useStripe();
  const elements = useElements();

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [address, setAddress] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState(initialPlan);
  const [cardHolderName, setCardHolderName] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && ['basic', 'professional', 'enterprise'].includes(planParam)) {
      setSubscriptionPlan(planParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (!stripe || !elements) {
        setError('Payment system is loading. Please try again in a moment.');
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Please enter valid credit / debit card details.');
        setLoading(false);
        return;
      }

      // 1. Fetch Payment Intent for Selected Subscription Plan
      let paymentIntentSucceeded = false;

      try {
        const intentRes = await apiRequest('/payment/subscription-intent', {
          method: 'POST',
          body: JSON.stringify({ plan: subscriptionPlan }),
        });

        if (intentRes?.clientSecret) {
          const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
            intentRes.clientSecret,
            {
              payment_method: {
                card: cardElement,
                billing_details: {
                  name: cardHolderName || adminName,
                  email: adminEmail,
                },
              },
            }
          );

          if (stripeError) {
            setError(`Payment Failed: ${stripeError.message}`);
            setLoading(false);
            return;
          }

          if (paymentIntent && paymentIntent.status === 'succeeded') {
            paymentIntentSucceeded = true;
          }
        }
      } catch (paymentErr: any) {
        // If Stripe payment intent fails due to invalid card or network
        setError(paymentErr.message || 'Payment processing failed. Please verify your card details.');
        setLoading(false);
        return;
      }

      // 2. Submit Hospital Registration only if payment is verified
      const data = await apiRequest('/auth/register-organization', {
        method: 'POST',
        body: JSON.stringify({
          adminName,
          adminEmail,
          password,
          organizationName,
          address,
          subscriptionPlan,
        }),
      });

      setMessage(data.message || 'Hospital registered successfully!');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanInfo = PLAN_PRICES[subscriptionPlan] || PLAN_PRICES.basic;

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 'PKR 5,000/mo',
      desc: 'Appointments & Patient Records',
      color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30',
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 'PKR 10,000/mo',
      desc: 'Appointments + Lab + Pharmacy + Billing',
      color: 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30',
      badge: 'Popular',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'PKR 20,000/mo',
      desc: 'Full Suite + Analytics + Multi-Branch',
      color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30',
    },
  ];

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Register Your Hospital
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Choose a subscription tier, fill institution details, and provide payment card details to activate your hospital portal.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 p-5 rounded-2xl text-sm border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Registration & Payment Submitted!</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">{message}</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 pt-2">
              <Link href="/login" className="text-blue-600 dark:text-blue-400 underline">
                Go to Login Portal →
              </Link>
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 p-4 rounded-2xl text-sm border border-rose-200 dark:border-rose-800">
          {error}
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Subscription Plan Selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>1. Select Subscription Plan</span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                30 Days Initial Access
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {plans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSubscriptionPlan(p.id)}
                  className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all relative flex flex-col justify-between ${
                    subscriptionPlan === p.id
                      ? `${p.color} ring-2 ring-teal-500/50 shadow-md scale-[1.01]`
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-2.5 right-3 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {p.badge}
                    </span>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</span>
                      {subscriptionPlan === p.id && (
                        <div className="w-4 h-4 rounded-full bg-teal-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400">{p.price}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: Hospital & Admin Information */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              2. Hospital & Admin Details
            </label>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Hospital / Organization Name *
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                placeholder="e.g. St. Jude General Hospital"
                className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Hospital Address (Optional)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Health Ave, Suite 5"
                className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Admin Name *
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  placeholder="Dr. John Doe"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Admin Email *
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  placeholder="admin@hospital.com"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* STEP 3: Payment Card Details Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                3. Subscription Payment Card Details
              </label>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
              </span>
            </div>

            {/* Payable Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between shadow-md">
              <div>
                <span className="text-[11px] text-slate-300 font-medium block">Selected Subscription</span>
                <span className="text-sm font-bold text-white">{selectedPlanInfo.name} Plan</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-teal-300 block">Total Due Today</span>
                <span className="text-xl font-black text-teal-400">{selectedPlanInfo.formatted}</span>
              </div>
            </div>

            {/* Card Holder Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder={adminName || 'Name on Credit / Debit Card'}
                className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Stripe Credit Card Element */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Card Number, Expiry & CVC *
              </label>
              <div className="p-3.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-teal-500">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '14px',
                        color: '#0f172a',
                        fontFamily: 'sans-serif',
                        '::placeholder': {
                          color: '#94a3b8',
                        },
                      },
                      invalid: {
                        color: '#ef4444',
                      },
                    },
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" /> Test cards accepted (e.g. 4242 4242 4242 4242).
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Payment & Registration...</span>
              </>
            ) : (
              <>
                <span>Complete Registration & Pay ({selectedPlanInfo.formatted})</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          ← Back to Login
        </Link>
      </p>
    </div>
  );
}

export default function RegisterHospitalPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 transition-colors duration-300 p-4 sm:p-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full py-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-lg">CarePulse HMS</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-grow flex items-center justify-center py-8">
        <Suspense fallback={<div className="text-slate-500">Loading form...</div>}>
          <Elements stripe={stripePromise}>
            <RegisterHospitalFormContent />
          </Elements>
        </Suspense>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
        © {new Date().getFullYear()} CarePulse HMS. All rights reserved.
      </div>
    </div>
  );
}