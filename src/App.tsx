import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import QuickEnquirySection from './components/QuickEnquirySection';
import ServiceGrid from './components/ServiceGrid';
import SpecialOfferBanner from './components/SpecialOfferBanner';
import CoverageAreaSection from './components/CoverageAreaSection';
import WhyChooseUs from './components/WhyChooseUs';
import CustomerReviews from './components/CustomerReviews';
import Footer from './components/Footer';
import FloatingCallBar from './components/FloatingCallBar';
import TopAiAssistant from './components/TopAiAssistant';
import LanguageSwitcher from './components/LanguageSwitcher';
import BookingModal from './components/BookingModal';
import BookingTrackerModal from './components/BookingTrackerModal';
import AiDiagnosticModal from './components/AiDiagnosticModal';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleOpenBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedService(serviceId);
    }
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      <main className="flex-grow">
        <HeroBanner onOpenBooking={() => handleOpenBooking()} />
        <QuickEnquirySection />
        <ServiceGrid onSelectService={(id) => handleOpenBooking(id)} />
        <SpecialOfferBanner onOpenBooking={() => handleOpenBooking()} />
        <CoverageAreaSection />
        <WhyChooseUs />
        <CustomerReviews />
      </main>

      <Footer />
      <FloatingCallBar onOpenBooking={() => handleOpenBooking()} />
      <TopAiAssistant onOpenAiModal={() => setIsAiModalOpen(true)} />
      <LanguageSwitcher />

      {/* Modals */}
      {isBookingOpen && (
        <BookingModal 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
          initialService={selectedService}
        />
      )}

      {isTrackerOpen && (
        <BookingTrackerModal 
          isOpen={isTrackerOpen} 
          onClose={() => setIsTrackerOpen(false)} 
        />
      )}

      {isAiModalOpen && (
        <AiDiagnosticModal 
          isOpen={isAiModalOpen} 
          onClose={() => setIsAiModalOpen(false)} 
        />
      )}
    </div>
  );
}
