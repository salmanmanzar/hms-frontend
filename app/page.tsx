import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import AudienceSection from '@/components/landing/AudienceSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import StatsSection from '@/components/landing/StatsSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'CarePulse HMS | Modern Healthcare Management System',
  description:
    'Book appointments, manage patient health records, streamline doctor schedules, and run your hospital efficiently with CarePulse HMS.',
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AudienceSection />
        <FeaturesSection />
        <StatsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}