import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TopAiAssistant } from './components/TopAiAssistant';
import { HeroBanner } from './components/HeroBanner';
import { SpecialOfferBanner } from './components/SpecialOfferBanner';
import { ServiceGrid } from './components/ServiceGrid';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CustomerReviews } from './components/CustomerReviews';
import { CoverageAreaSection } from './components/CoverageAreaSection';
import { QuickEnquirySection } from './components/QuickEnquirySection';
import { Footer } from './components/Footer';
import { FloatingCallBar } from './components/FloatingCallBar';
import { BookingModal } from './components/BookingModal';
import { AiDiagnosticModal } from './components/AiDiagnosticModal';
import { BookingTrackerModal } from './components/BookingTrackerModal';
import { SERVICE_CATEGORIES } from './data/servicesData';
import { Language, ServiceCategory, SubService, Booking } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('fast_solution_lang');
      if (saved === 'en' || saved === 'bn') return saved;
    } catch (e) {
      // ignore
    }
    return 'bn';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null);
  const [initialIssueText, setInitialIssueText] = useState<string>('');

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [trackerQuery, setTrackerQuery] = useState<string>('');

  // Local Bookings List & Badge
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  // Load existing bookings on mount
  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.bookings) {
          setMyBookings(data.bookings);
        }
      })
      .catch((err) => console.error('Error fetching bookings:', err));
  }, []);

  const handleSetLanguage = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('fast_solution_lang', newLang);
    } catch (e) {
      // ignore
    }
  };

  const handleToggleLanguage = () => {
    const next = language === 'bn' ? 'en' : 'bn';
    handleSetLanguage(next);
  };

  const handleOpenBookingWithService = (category: ServiceCategory, subService?: SubService) => {
    setSelectedCategory(category);
    setSelectedSubService(subService || (category.subServices.length > 0 ? category.subServices[0] : null));
    setInitialIssueText('');
    setIsBookingModalOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    setSelectedCategory(SERVICE_CATEGORIES[0]);
    setSelectedSubService(SERVICE_CATEGORIES[0].subServices[0]);
    setInitialIssueText('');
    setIsBookingModalOpen(true);
  };

  const handleBookFromDiagnosis = (category: ServiceCategory, subService?: SubService, issueText?: string) => {
    setSelectedCategory(category);
    setSelectedSubService(subService || (category.subServices.length > 0 ? category.subServices[0] : null));
    setInitialIssueText(issueText || '');
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setMyBookings((prev) => [newBooking, ...prev]);
  };

  const handleSelectAreaBook = (areaName: string) => {
    setSelectedCategory(SERVICE_CATEGORIES[0]);
    setSelectedSubService(SERVICE_CATEGORIES[0].subServices[0]);
    setInitialIssueText(language === 'bn' ? `${areaName} এলাকায় সার্ভিস প্রয়োজন` : `Service needed in ${areaName}`);
    setIsBookingModalOpen(true);
  };

  const handleQuickBookSearch = () => {
    const servicesElement = document.getElementById('services-section');
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSetLanguage={handleSetLanguage}
        onOpenAiHelper={() => setIsAiModalOpen(true)}
        onOpenTracker={() => setIsTrackerModalOpen(true)}
        bookingCount={myBookings.length}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 1st: Website Name & Hero Intro Section with Search */}
        <HeroBanner
          language={language}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAiHelper={() => {
            const el = document.getElementById('top-ai-assistant-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              const input = document.getElementById('top-ai-problem-input');
              if (input) input.focus();
            } else {
              setIsAiModalOpen(true);
            }
          }}
          onSelectCategory={(catId) => {
            const cat = SERVICE_CATEGORIES.find((c) => c.id === catId);
            if (cat) handleOpenBookingWithService(cat);
          }}
          onQuickBookClick={handleQuickBookSearch}
        />

        {/* 2nd: AI Assistant Problem Solver & Instant Estimator */}
        <TopAiAssistant
          language={language}
          categories={SERVICE_CATEGORIES}
          onBookFromDiagnosis={handleBookFromDiagnosis}
          onOpenFullAiModal={() => setIsAiModalOpen(true)}
        />

        {/* 3rd: The 6 Core Services Grid (আমাদের মূল পরিষেবা) */}
        <ServiceGrid
          categories={SERVICE_CATEGORIES}
          language={language}
          searchQuery={searchQuery}
          onSelectSubService={(cat, sub) => handleOpenBookingWithService(cat, sub)}
          onDirectCategoryBook={(cat) => handleOpenBookingWithService(cat)}
        />

        {/* 20% Special Discount Banner */}
        <SpecialOfferBanner
          language={language}
          onClaimOffer={handleOpenGeneralBooking}
        />

        {/* 4 Pillars: Why Choose Fast Solution */}
        <WhyChooseUs
          language={language}
          onCallTechnician={handleOpenGeneralBooking}
        />

        {/* Quick WhatsApp Enquiry Alert Section */}
        <QuickEnquirySection language={language} />

        {/* Local Coverage Areas in Kanchrapara & Kalyani */}
        <CoverageAreaSection
          language={language}
          onSelectAreaBook={handleSelectAreaBook}
        />

        {/* Verified Customer Reviews */}
        <CustomerReviews language={language} />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSetLanguage={handleSetLanguage}
        onOpenBooking={handleOpenGeneralBooking}
        onOpenAiHelper={() => setIsAiModalOpen(true)}
        onOpenTracker={() => setIsTrackerModalOpen(true)}
      />

      {/* Floating Call & WhatsApp Bar for Mobile */}
      <FloatingCallBar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenBooking={handleOpenGeneralBooking}
        onOpenAiHelper={() => setIsAiModalOpen(true)}
      />

      {/* Booking Form Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        categories={SERVICE_CATEGORIES}
        initialCategory={selectedCategory}
        initialSubService={selectedSubService}
        initialIssue={initialIssueText}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSetLanguage={handleSetLanguage}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* AI Smart Problem Diagnostic Modal */}
      <AiDiagnosticModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSetLanguage={handleSetLanguage}
        categories={SERVICE_CATEGORIES}
        onBookFromDiagnosis={handleBookFromDiagnosis}
      />

      {/* Live Booking Tracker Modal */}
      <BookingTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSetLanguage={handleSetLanguage}
        initialQuery={trackerQuery}
      />
    </div>
  );
}
