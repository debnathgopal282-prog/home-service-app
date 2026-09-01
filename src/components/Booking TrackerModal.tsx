import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  Wrench, 
  Truck, 
  AlertCircle,
  ShieldCheck,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Language, Booking } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';

interface BookingTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onToggleLanguage?: () => void;
  onSetLanguage?: (lang: Language) => void;
  initialQuery?: string;
}

export const BookingTrackerModal: React.FC<BookingTrackerModalProps> = ({
  isOpen,
  onClose,
  language,
  onToggleLanguage,
  onSetLanguage,
  initialQuery = '',
}) => {
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [foundBookings, setFoundBookings] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (isOpen && initialQuery) {
      setSearchQuery(initialQuery);
      fetchBookings(initialQuery);
    } else if (isOpen && !hasSearched) {
      fetchBookings('');
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const fetchBookings = async (q: string) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const url = q.trim() ? `/api/bookings?query=${encodeURIComponent(q.trim())}` : '/api/bookings';
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.bookings) {
        setFoundBookings(data.bookings);
        if (data.bookings.length > 0) {
          setSelectedBooking(data.bookings[0]);
        } else {
          setSelectedBooking(null);
        }
      }
    } catch (err) {
      console.error('Fetch bookings error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings(searchQuery);
  };

  const getStepStatus = (currentStatus: string, stepIndex: number) => {
    const statusOrder = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex === stepIndex - 1) return 'active';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm tracking-wider">
              FSS
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">
                {isBn ? 'লাইভ বুকিং ট্র্যাকার' : 'Live Booking Tracker'}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {isBn ? 'ফাস্ট অ্যান্ড স্মার্ট সলিউশন বুকিং স্ট্যাটাস দেখুন' : 'Fast & Smart Solution Booking Status'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleLanguage && (
              <LanguageSwitcher
                language={language}
                onToggleLanguage={onToggleLanguage}
                onSetLanguage={onSetLanguage}
                variant="pill"
                className="bg-white/20 border-white/30 text-white"
              />
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="booking-tracker-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'বুকিং আইডি (যেমন FS-8842) বা মোবাইল নম্বর দিন...' : 'Enter Booking ID (e.g. FS-8842) or Phone Number...'}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              id="tracker-search-btn"
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              {isBn ? 'খুঁজুন' : 'Search'}
            </button>
          </form>

          {/* Quick Preloaded Samples */}
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span className="font-semibold">{isBn ? 'টেস্ট আইডি:' : 'Sample IDs:'}</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('FS-8842');
                fetchBookings('FS-8842');
              }}
              className="underline font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              FS-8842 (এসি সার্ভিস)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('FS-7731');
                fetchBookings('FS-7731');
              }}
              className="underline font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              FS-7731 (ফ্যান মেরামত)
            </button>
          </div>

          {/* Content Area */}
          {isLoading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-semibold">{isBn ? 'তথ্য লোড হচ্ছে...' : 'Loading records...'}</p>
            </div>
          ) : foundBookings.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 p-6">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                {isBn ? 'কোনো বুকিং পাওয়া যায়নি' : 'No matching booking found'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isBn ? 'অনুগ্রহ করে সঠিক নম্বর বা বুকিং আইডি দিন অথবা হেল্পলাইনে সরাসরি ফোন করুন।' : 'Please check the ID or contact our hotline directly.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* If multiple bookings, show selector pills */}
              {foundBookings.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {foundBookings.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBooking(b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                        selectedBooking?.id === b.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b.id} - {b.subServiceNameBn}
                    </button>
                  ))}
                </div>
              )}

              {selectedBooking && (
                <div className="space-y-5">
                  {/* Status Banner */}
                  <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-white">{selectedBooking.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                            {selectedBooking.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isBn ? selectedBooking.categoryTitleBn : selectedBooking.categoryTitleEn} • {isBn ? selectedBooking.subServiceNameBn : selectedBooking.subServiceNameEn}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">{isBn ? 'মোট প্রদেয়:' : 'Payable:'}</span>
                        <span className="text-xl font-black text-emerald-400">
                          {selectedBooking.basePrice === 0 || selectedBooking.categoryId === 'home_shifting'
                            ? (isBn ? 'কোটেশন সাপেক্ষে' : 'Custom Quote')
                            : `₹${selectedBooking.finalPrice}`}
                        </span>
                      </div>
                    </div>

                    {/* Stepper Timeline */}
                    <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                      <div className="space-y-1">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-black shadow-xs">
                          ✓
                        </div>
                        <p className="text-[11px] font-bold text-slate-200">{isBn ? 'বুকিং গৃহীত' : 'Received'}</p>
                      </div>

                      <div className="space-y-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black shadow-xs ${
                          getStepStatus(selectedBooking.status, 2) === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white animate-pulse'
                        }`}>
                          {getStepStatus(selectedBooking.status, 2) === 'completed' ? '✓' : '2'}
                        </div>
                        <p className="text-[11px] font-bold text-slate-200">{isBn ? 'কারিগর নিযুক্ত' : 'Assigned'}</p>
                      </div>

                      <div className="space-y-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black shadow-xs ${
                          getStepStatus(selectedBooking.status, 3) === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : getStepStatus(selectedBooking.status, 3) === 'active'
                            ? 'bg-amber-500 text-white animate-bounce'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {getStepStatus(selectedBooking.status, 3) === 'completed' ? '✓' : '3'}
                        </div>
                        <p className="text-[11px] font-bold text-slate-200">{isBn ? 'কাজ শুরু' : 'In Progress'}</p>
                      </div>

                      <div className="space-y-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black shadow-xs ${
                          selectedBooking.status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {selectedBooking.status === 'completed' ? '✓' : '4'}
                        </div>
                        <p className="text-[11px] font-bold text-slate-200">{isBn ? 'সম্পন্ন' : 'Completed'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technician Card */}
                  {selectedBooking.technician && (
                    <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                          {selectedBooking.technician.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {isBn ? 'নিযুক্ত কারিগর' : 'Assigned Technician'}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900">
                            {selectedBooking.technician.name}
                          </h4>
                          <p className="text-xs text-slate-600">
                            {selectedBooking.technician.specialty} • ⭐ {selectedBooking.technician.rating}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`tel:${selectedBooking.technician.phone}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{isBn ? 'কারিগরকে কল করুন' : 'Call Technician'}</span>
                      </a>
                    </div>
                  )}

                  {/* Address & Slot details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {isBn ? 'ডোরস্টেপ ঠিকানা:' : 'Doorstep Address:'}
                      </span>
                      <p className="font-bold text-slate-800">
                        {selectedBooking.address}, {selectedBooking.area}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {isBn ? 'সময়সূচী:' : 'Schedule:'}
                      </span>
                      <p className="font-bold text-slate-800">
                        {selectedBooking.preferredDate} ({selectedBooking.preferredTimeSlot})
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
