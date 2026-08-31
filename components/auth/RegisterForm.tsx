'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  ArrowRight,
  Loader2,
  Activity,
  Check,
  Building2,
} from 'lucide-react';

import { apiRequest } from '@/lib/api';

interface Organization {
  id: string;
  name: string;
}

export default function RegisterForm() {
  const router = useRouter();

  // =========================
  // Form State
  // =========================
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Organization / Hospital
  const [organizationId, setOrganizationId] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Other states
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // =========================
  // Validation
  // =========================

  const isNameValid = name.trim().length >= 2;

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);

  const hasNumberOrSymbol =
    /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const passwordStrengthScore = [
    hasMinLength,
    hasUppercase,
    hasNumberOrSymbol,
    password.length >= 12,
  ].filter(Boolean).length;

  const isPasswordValid = hasMinLength;

  const isConfirmPasswordValid =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  // =========================
  // Password Strength
  // =========================

  const getStrengthLabel = () => {
    if (!password) {
      return {
        label: '',
        color: 'bg-slate-200',
        text: 'text-slate-400',
      };
    }

    if (passwordStrengthScore <= 1) {
      return {
        label: 'Weak',
        color: 'bg-rose-500',
        text: 'text-rose-600',
      };
    }

    if (passwordStrengthScore === 2) {
      return {
        label: 'Medium',
        color: 'bg-amber-500',
        text: 'text-amber-600',
      };
    }

    return {
      label: 'Strong',
      color: 'bg-emerald-500',
      text: 'text-emerald-600',
    };
  };

  const strength = getStrengthLabel();

  // =========================
  // Fetch Approved Hospitals
  // =========================

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setOrganizationsLoading(true);

      const data = await apiRequest('/auth/organizations');

      setOrganizations(data);
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
      setError('Unable to load hospitals. Please try again.');
    } finally {
      setOrganizationsLoading(false);
    }
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    // Required fields
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !organizationId
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    // Email
    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password
    if (!isPasswordValid) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Confirm password
    if (!isConfirmPasswordValid) {
      setError('Passwords do not match.');
      return;
    }

    // Terms
    if (!termsAccepted) {
      setError(
        'You must accept the Terms of Service and Privacy Policy to continue.'
      );
      return;
    }

    setLoading(true);

    try {
      await apiRequest('/auth/register', {
        method: 'POST',

        body: JSON.stringify({
          name,
          email,
          password,
          organizationId,
        }),
      });

      router.push('/login');
    } catch (err: any) {
      setError(
        err.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">

      {/* =========================
          Header
      ========================= */}

      <div className="text-center mb-8">

        <div className="hidden lg:inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-600 text-white shadow-md mb-4">

          <Activity className="w-6 h-6" />

        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create Account
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Get started with your VisionX HMS account.
        </p>

      </div>

      {/* =========================
          Error
      ========================= */}

      {error && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start justify-between gap-3"
        >

          <div className="flex items-start gap-2.5">

            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />

            <span>{error}</span>

          </div>

          <button
            type="button"
            onClick={() => setError('')}
            className="text-rose-500 hover:text-rose-700 transition-colors p-0.5 rounded-lg"
            aria-label="Dismiss error banner"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      )}

      {/* =========================
          Form
      ========================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
      >

        {/* =========================
            Hospital
        ========================= */}

        <div>

          <label
            htmlFor="organization"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Select Hospital
          </label>

          <div className="relative">

            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-5 h-5" />
            </div>

            <select
              id="organization"
              value={organizationId}
              onChange={(e) =>
                setOrganizationId(e.target.value)
              }
              required
              disabled={organizationsLoading}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none disabled:opacity-60"
            >

              <option value="">
                {organizationsLoading
                  ? 'Loading hospitals...'
                  : 'Choose your hospital'}
              </option>

              {organizations.map((org) => (
                <option
                  key={org.id}
                  value={org.id}
                >
                  {org.name}
                </option>
              ))}

            </select>

          </div>

          {!organizationsLoading &&
            organizations.length === 0 && (
              <p className="text-xs text-rose-500 mt-1.5">
                No approved hospitals are available.
              </p>
            )}

        </div>

        {/* =========================
            Full Name
        ========================= */}

        <div>

          <label
            htmlFor="reg-name"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Full Name
          </label>

          <div className="relative rounded-xl shadow-sm">

            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-5 h-5" />
            </div>

            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr. Jane Doe"
              required
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />

            {name.length > 0 && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">

                {isNameValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}

              </div>
            )}

          </div>

        </div>

        {/* =========================
            Email
        ========================= */}

        <div>

          <label
            htmlFor="reg-email"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Email Address
          </label>

          <div className="relative rounded-xl shadow-sm">

            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-5 h-5" />
            </div>

            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@hospital.com"
              required
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />

            {email.length > 0 && (
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">

                {isEmailValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}

              </div>
            )}

          </div>

        </div>

        {/* =========================
            Password
        ========================= */}

        <div>

          <label
            htmlFor="reg-password"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Password
          </label>

          <div className="relative rounded-xl shadow-sm">

            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-5 h-5" />
            </div>

            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >

              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}

            </button>

          </div>

          {/* Password Strength */}

          {password.length > 0 && (
            <div className="mt-2.5 space-y-2">

              <div className="flex items-center justify-between text-xs">

                <span className="text-slate-500 font-medium">
                  Password Strength:
                </span>

                <span
                  className={`font-semibold ${strength.text}`}
                >
                  {strength.label}
                </span>

              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">

                <div
                  className={`h-full flex-1 transition-all duration-300 ${passwordStrengthScore >= 1
                    ? strength.color
                    : 'bg-slate-200'
                    }`}
                />

                <div
                  className={`h-full flex-1 transition-all duration-300 ${passwordStrengthScore >= 2
                    ? strength.color
                    : 'bg-slate-200'
                    }`}
                />

                <div
                  className={`h-full flex-1 transition-all duration-300 ${passwordStrengthScore >= 3
                    ? strength.color
                    : 'bg-slate-200'
                    }`}
                />

              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-500">

                <div className="flex items-center gap-1.5">

                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasMinLength
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>

                  <span>
                    At least 8 characters
                  </span>

                </div>

                <div className="flex items-center gap-1.5">

                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasUppercase
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>

                  <span>
                    Uppercase letter
                  </span>

                </div>

                <div className="flex items-center gap-1.5">

                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasNumberOrSymbol
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>

                  <span>
                    Number or symbol
                  </span>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* =========================
            Confirm Password
        ========================= */}

        <div>

          <label
            htmlFor="reg-confirm-password"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            Confirm Password
          </label>

          <div className="relative rounded-xl shadow-sm">

            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <input
              id="reg-confirm-password"
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >

              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}

            </button>

            {confirmPassword.length > 0 && (
              <div className="absolute inset-y-0 right-10 pr-2 flex items-center pointer-events-none">

                {isConfirmPasswordValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}

              </div>
            )}

          </div>

        </div>

        {/* =========================
            Terms
        ========================= */}

        <div className="pt-2">

          <label className="flex items-start gap-3 cursor-pointer group">

            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) =>
                setTermsAccepted(e.target.checked)
              }
              className="mt-0.5 w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 cursor-pointer"
            />

            <span className="text-xs text-slate-600 leading-relaxed">

              I agree to the{' '}

              <a
                href="#"
                className="text-teal-600 font-semibold hover:underline"
              >
                Terms of Service
              </a>{' '}

              and{' '}

              <a
                href="#"
                className="text-teal-600 font-semibold hover:underline"
              >
                Privacy Policy
              </a>

              .

            </span>

          </label>

        </div>

        {/* =========================
            Submit
        ========================= */}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 hover:from-blue-700 hover:via-teal-700 hover:to-emerald-700 active:scale-[0.99] shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-6"
        >

          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}

        </button>

      </form>

      {/* =========================
          Login
      ========================= */}

      <div className="mt-6 text-center text-sm text-slate-500 pt-6 border-t border-slate-100">

        Already have an account?{' '}

        <Link
          href="/login"
          className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
        >
          Sign In
        </Link>

      </div>

    </div>
  );
}