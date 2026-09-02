import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import QuickEnquirySection from './components/QuickEnquirySection';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    } else {
      setSelectedService(null);
    }
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content */}
      <main>
        <Hero onOpenBooking={() => handleOpenBooking()} />
        <Services onOpenBooking={handleOpenBooking} />
        <WhyChooseUs />
        <QuickEnquirySection />
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBooking}
        initialService={selectedService}
      />
    </div>
  );
}
