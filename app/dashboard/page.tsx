'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import PatientNavbar from '@/components/dashboard/PatientNavbar';
import PatientSidebar from '@/components/dashboard/PatientSidebar';
import PatientDashboardView from '@/components/dashboard/PatientDashboardView';
import PatientBillingView from '@/components/dashboard/PatientBillingView';
import PatientSettingsView from '@/components/dashboard/PatientSettingsView';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard';
import { Loader2 } from 'lucide-react';

interface Doctor {
  id: string;
  specialization: string;
  qualification: string;
  user: { name: string; email: string };
  department: { name: string };
}

interface PatientProfile {
  id: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  address?: string;
  user: { name: string; email: string };
}

export default function DashboardPage() {
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const router = useRouter();
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  // Patient details / Profile form state
  const [patientName, setPatientName] = useState('Patient');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Doctors & Search state
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dynamic Patient History Data
  const [historyAppointments, setHistoryAppointments] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64));
        if (decoded?.name) setPatientName(decoded.name);
      }
    } catch (e) {
      // Ignore token parse error
    }

    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const profile = await apiRequest('/patient/me/profile');
      if (profile) {
        setHasProfile(true);
        setPatientProfile(profile);
        if (profile.user?.name) setPatientName(profile.user.name);
        fetchDoctors('');
        fetchPatientHistory();
      } else {
        setHasProfile(false);
      }
    } catch (err) {
      setHasProfile(false);
    } finally {
      setProfileChecked(true);
    }
  };

  const fetchPatientHistory = async () => {
    try {
      const history = await apiRequest('/patient/me/history');
      if (history) {
        setHistoryAppointments(history.appointments || []);
        setMedicalRecords(history.medicalRecords || []);
      }
    } catch (err) {
      // Fail silently if history cannot be loaded yet
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileLoading(true);

    try {
      await apiRequest('/patient', {
        method: 'POST',
        body: JSON.stringify({ dob, gender, bloodGroup, address }),
      });

      setHasProfile(true);
      fetchDoctors('');
      fetchPatientHistory();
    } catch (err: any) {
      setProfileError(err.message || 'Failed to save profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchDoctors = async (searchTerm: string) => {
    setLoading(true);
    setError('');
    try {
      const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const data = await apiRequest(`/doctor${query}`);
      setDoctors(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors(search);
  };

  const handleSelectDoctor = (doctorId: string) => {
    router.push(`/dashboard/book/${doctorId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  // Initial Auth / Profile check loading state
  if (!profileChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-xs font-semibold tracking-wide">Loading Patient Portal...</p>
      </div>
    );
  }

  // Profile completion step if hasProfile is false
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <PatientNavbar
          patientName={patientName}
          searchQuery={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          onLogout={handleLogout}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <ProfileCompletionCard
          dob={dob}
          setDob={setDob}
          gender={gender}
          setGender={setGender}
          bloodGroup={bloodGroup}
          setBloodGroup={setBloodGroup}
          address={address}
          setAddress={setAddress}
          profileError={profileError}
          setProfileError={setProfileError}
          profileLoading={profileLoading}
          onProfileSubmit={handleProfileSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Fixed Top Navbar */}
      <PatientNavbar
        patientName={patientName}
        searchQuery={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onLogout={handleLogout}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Left Sidebar */}
      <PatientSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="pt-20 lg:pl-68 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {activeTab === 'billing' ? (
          <PatientBillingView historyAppointments={historyAppointments} />
        ) : activeTab === 'settings' ? (
          <PatientSettingsView profile={patientProfile} patientName={patientName} />
        ) : (
          <PatientDashboardView
            patientName={patientName}
            doctors={doctors}
            loadingDoctors={loading}
            searchQuery={search}
            historyAppointments={historyAppointments}
            medicalRecords={medicalRecords}
            onSearchChange={(q) => {
              setSearch(q);
              if (activeTab === 'doctors') {
                fetchDoctors(q);
              } else {
                fetchDoctors(q);
              }
            }}
            onSearchSubmit={handleSearchSubmit}
            onSelectDoctor={handleSelectDoctor}
          />
        )}
      </main>
    </div>
  );
}