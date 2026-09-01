import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Tag, 
  Zap, 
  Sparkles, 
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Language, ServiceCategory, SubService, Booking } from '../types';
import { SERVICE_AREAS } from '../data/servicesData';
import { LanguageSwitcher } from './LanguageSwitcher';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  initialCategory?: ServiceCategory | null;
  initialSubService?: SubService | null;
  initialIssue?: string;
  language: Language;
  onToggleLanguage?: () => void;
  onSetLanguage?: (lang: Language) => void;
  onBookingSuccess: (newBooking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialCategory,
  initialSubService,
  initialIssue = '',
  language,
  onToggleLanguage,
  onSetLanguage,
  onBookingSuccess,
}) => {
  const isBn = language === 'bn';

  // Form states
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [alternatePhone, setAlternatePhone] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>(SERVICE_AREAS[0].nameBn);
  const [address, setAddress] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('আজকে (Today)');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('সকাল ১১টা - দুপুর ২টা (11 AM - 2 PM)');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [discountPercent] = useState<number>(20);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Sync initial props
  useEffect(() => {
    if (initialCategory) {
      setSelectedCatId(initialCategory.id);
      if (initialSubService) {
        setSelectedSubId(initialSubService.id);
      } else if (initialCategory.subServices.length > 0) {
        setSelectedSubId(initialCategory.subServices[0].id);
      }
    } else if (categories.length > 0 && !selectedCatId) {
      setSelectedCatId(categories[0].id);
      if (categories[0].subServices.length > 0) {
        setSelectedSubId(categories[0].subServices[0].id);
      }
    }

    if (initialIssue) {
      setIssueDescription(initialIssue);
    }
  }, [initialCategory, initialSubService, initialIssue, categories]);

  if (!isOpen) return null;

  // Selected object references
  const currentCategory = categories.find((c) => c.id === selectedCatId) || categories[0];
  const currentSubService = currentCategory?.subServices.find((s) => s.id === selectedSubId) || currentCategory?.subServices[0];

  const basePrice = currentSubService ? currentSubService.price : 199;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const finalPrice = basePrice - discountAmount;

  const handleCategoryChange = (catId: string) => {
    setSelectedCatId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat && cat.subServices.length > 0) {
      setSelectedSubId(cat.subServices[0].id);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim()) {
      setFormError(isBn ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 10) {
      setFormError(isBn ? 'সঠিক ১০ সংখ্যার মোবাইল নম্বর দিন।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!address.trim()) {
      setFormError(isBn ? 'আপনার সঠিক ঠিকানা বা ল্যান্ডমার্ক উল্লেখ করুন।' : 'Please enter your address/landmark.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone.trim(),
        area: selectedArea,
        address: address.trim(),
        categoryId: currentCategory.id,
        categoryTitleBn: currentCategory.titleBn,
        categoryTitleEn: currentCategory.titleEn,
        subServiceId: currentSubService.id,
        subServiceNameBn: currentSubService.nameBn,
        subServiceNameEn: currentSubService.nameEn,
        issueDescription: issueDescription.trim(),
        preferredDate,
        preferredTimeSlot: isUrgent ? 'জরুরি অগ্রাধিকার এক্সপ্রেস সার্ভিস (Priority Express Service)' : preferredTimeSlot,
        isUrgent,
        basePrice,
        discountPercentage: discountPercent,
        discountAmount,
        finalPrice,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'বুকিং সম্পন্ন করা সম্ভব হয়নি।');
      }

      setCompletedBooking(data.booking);
      onBookingSuccess(data.booking);

      // Automatically launch WhatsApp with booking details pre-filled for owner
      try {
        const primaryWaUrl = data.whatsAppAlert?.primaryUrl || `https://wa.me/917318828211?text=${encodeURIComponent(
          `🔔 *নতুন হোম সার্ভিস বুকিং (New Booking Alert) - Fast & Smart Solution* 🔔\n──────────────────────────\n🔖 *বুকিং আইডি:* ${data.booking.id}\n👤 *গ্রাহকের নাম:* ${data.booking.customerName}\n📞 *ফোন নম্বর:* ${data.booking.phone}${data.booking.alternatePhone ? `\n📱 *বিকল্প নম্বর:* ${data.booking.alternatePhone}` : ''}\n📍 *এলাকা:* ${data.booking.area}\n🏠 *ঠিকানা:* ${data.booking.address}\n🛠️ *সার্ভিস:* ${data.booking.categoryTitleBn} > ${data.booking.subServiceNameBn}\n📝 *সমস্যা:* ${data.booking.issueDescription || 'সাধারণ সার্ভিস'}\n📅 *পছন্দের সময়:* ${data.booking.preferredDate} (${data.booking.preferredTimeSlot})\n💰 *মূল্য (২০% ছাড় সহ):* ₹${data.booking.finalPrice}\n──────────────────────────`
        )}`;
        window.open(primaryWaUrl, '_blank');
      } catch (popupErr) {
        console.log('Auto-popup blocked or deferred:', popupErr);
      }
    } catch (err: any) {
      setFormError(err.message || 'বুকিং করতে কোনো সমস্যা হয়েছে। সরাসরি ফোন করুন: 9903796410');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCompletedBooking(null);
    setFormError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm tracking-wider">
              FSS
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black leading-tight">
                {isBn ? 'ফাস্ট অ্যান্ড স্মার্ট সলিউশন বুকিং' : 'Fast & Smart Solution Booking'}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {isBn ? 'সমগ্র পশ্চিমবঙ্গের দ্রুততম ডোরস্টেপ সমাধান' : 'Fastest Doorstep Service Across West Bengal'}
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
              id="close-booking-modal-btn"
              type="button"
              onClick={handleResetAndClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {completedBooking ? (
            /* Success View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900">
                  {isBn ? 'বুকিং সফলভাবে সম্পন্ন হয়েছে!' : 'Booking Confirmed Successfully!'}
                </h4>
                <p className="text-sm text-slate-600">
                  {isBn ? 'আপনার বুকিং ট্র্যাকিং আইডি:' : 'Your Booking Reference ID:'}
                </p>
                <div className="inline-block bg-blue-50 border-2 border-blue-500 text-blue-800 font-black text-xl px-4 py-1.5 rounded-xl tracking-wider my-2">
                  {completedBooking.id}
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">{isBn ? 'গ্রাহকের নাম:' : 'Customer Name:'}</span>
                  <span className="font-bold text-slate-800">{completedBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isBn ? 'ফোন নম্বর:' : 'Phone:'}</span>
                  <span className="font-bold text-slate-800">{completedBooking.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isBn ? 'সার্ভিস:' : 'Service:'}</span>
                  <span className="font-bold text-blue-700">
                    {isBn ? completedBooking.subServiceNameBn : completedBooking.subServiceNameEn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isBn ? 'এলাকা ও ঠিকানা:' : 'Area & Address:'}</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">
                    {completedBooking.address}, {completedBooking.area}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{isBn ? 'পছন্দের সময়:' : 'Time Slot:'}</span>
                  <span className="font-bold text-slate-800">{completedBooking.preferredTimeSlot}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-base">
                  <span className="font-bold text-slate-800">{isBn ? 'পরিশোধযোগ্য মূল্য:' : 'Payable Amount:'}</span>
                  <span className="font-black text-emerald-700">
                    {completedBooking.basePrice === 0 || completedBooking.categoryId === 'home_shifting'
                      ? (isBn ? 'আলোচনা সাপেক্ষে (কোটেশন)' : 'Custom Quote')
                      : `₹${completedBooking.finalPrice} (${isBn ? '২০% ছাড় সহ' : '20% Off'})`}
                  </span>
                </div>
              </div>

              {/* Assigned Technician Card */}
              {completedBooking.technician && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-left flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      {isBn ? (completedBooking.categoryId === 'home_shifting' ? 'নিযুক্ত শিফটিং ইনচার্জ' : 'নিযুক্ত টেকনিশিয়ান') : (completedBooking.categoryId === 'home_shifting' ? 'Assigned Shifting Lead' : 'Assigned Technician')}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900">
                      {completedBooking.technician.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {completedBooking.categoryId === 'home_shifting' ? (isBn ? 'প্যাকার্স & মুভার্স স্পেশালিস্ট' : 'Packers & Movers Specialist') : completedBooking.technician.specialty}
                    </p>
                  </div>

                  <a
                    href={`tel:${completedBooking.technician.phone}`}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isBn ? 'কল করুন' : 'Call'}</span>
                  </a>
                </div>
              )}

              {/* WhatsApp Notification Alert Box to Owner */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-left space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="text-xs sm:text-sm font-black">
                      {isBn ? '📲 ওনার ও সার্ভিস টিমের হোয়াটসঅ্যাপে নোটিফিকেশন' : '📲 WhatsApp Notification to Owner & Service Team'}
                    </h5>
                    <p className="text-[11px] text-emerald-700">
                      {isBn ? 'এই বুকিংয়ের বিস্তারিত তথ্য ওনারের হোয়াটসঅ্যাপে পাঠানো নিশ্চিত করুন:' : 'Ensure full booking enquiry details are sent to owner’s WhatsApp:'}
                    </p>
                  </div>
                </div>

                {/* Direct WhatsApp Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/917318828211?text=${encodeURIComponent(
                      `🔔 *নতুন হোম সার্ভিস বুকিং (New Booking Alert) - Fast Solution* 🔔\n──────────────────────────\n🔖 *বুকিং আইডি:* ${completedBooking.id}\n👤 *গ্রাহকের নাম:* ${completedBooking.customerName}\n📞 *ফোন নম্বর:* ${completedBooking.phone}${completedBooking.alternatePhone ? `\n📱 *বিকল্প নম্বর:* ${completedBooking.alternatePhone}` : ''}\n📍 *জেলা/এলাকা:* ${completedBooking.area}\n🏠 *ঠিকানা:* ${completedBooking.address}\n🛠️ *সার্ভিস:* ${completedBooking.categoryTitleBn} > ${completedBooking.subServiceNameBn}\n📝 *সমস্যা:* ${completedBooking.issueDescription || 'সাধারণ সার্ভিস'}\n📅 *পছন্দের সময়:* ${completedBooking.preferredDate} (${completedBooking.preferredTimeSlot})\n💰 *মূল্য:* ${completedBooking.basePrice === 0 || completedBooking.categoryId === 'home_shifting' ? 'আলোচনা সাপেক্ষে (কোটেশন)' : `₹${completedBooking.finalPrice} (২০% ছাড় সহ)`}\n👨‍🔧 *নিযুক্ত টিম:* ${completedBooking.technician ? completedBooking.technician.name : 'অ্যাসাইন হচ্ছে...'}\n──────────────────────────\nFast Solution - সমগ্র পশ্চিমবঙ্গ`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/20" />
                    <span>{isBn ? 'WhatsApp 7318828211-এ পাঠান' : 'Send to WA: 7318828211'}</span>
                  </a>

                  <a
                    href={`https://wa.me/919903796410?text=${encodeURIComponent(
                      `🔔 *নতুন হোম সার্ভিস বুকিং (New Booking Alert) - Fast Solution* 🔔\n──────────────────────────\n🔖 *বুকিং আইডি:* ${completedBooking.id}\n👤 *গ্রাহকের নাম:* ${completedBooking.customerName}\n📞 *ফোন নম্বর:* ${completedBooking.phone}${completedBooking.alternatePhone ? `\n📱 *বিকল্প নম্বর:* ${completedBooking.alternatePhone}` : ''}\n📍 *জেলা/এলাকা:* ${completedBooking.area}\n🏠 *ঠিকানা:* ${completedBooking.address}\n🛠️ *সার্ভিস:* ${completedBooking.categoryTitleBn} > ${completedBooking.subServiceNameBn}\n📝 *সমস্যা:* ${completedBooking.issueDescription || 'সাধারণ সার্ভিস'}\n📅 *পছন্দের সময়:* ${completedBooking.preferredDate} (${completedBooking.preferredTimeSlot})\n💰 *মূল্য:* ${completedBooking.basePrice === 0 || completedBooking.categoryId === 'home_shifting' ? 'আলোচনা সাপেক্ষে (কোটেশন)' : `₹${completedBooking.finalPrice} (২০% ছাড় সহ)`}\n👨‍🔧 *নিযুক্ত টিম:* ${completedBooking.technician ? completedBooking.technician.name : 'অ্যাসাইন হচ্ছে...'}\n──────────────────────────\nFast Solution - সমগ্র পশ্চিমবঙ্গ`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>{isBn ? 'WhatsApp 9903796410-এ পাঠান' : 'Send to WA: 9903796410'}</span>
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {isBn ? 'বন্ধ করুন (Done)' : 'Close Window'}
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmitBooking} className="space-y-4 text-left">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Service Category & Sub-service selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'সার্ভিস ক্যাটাগরি *' : 'Service Category *'}
                  </label>
                  <select
                    id="booking-category-select"
                    value={selectedCatId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {isBn ? cat.titleBn : cat.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'নির্দিষ্ট সার্ভিস বা কাজ *' : 'Specific Service *'}
                  </label>
                  <select
                    id="booking-subservice-select"
                    value={selectedSubId}
                    onChange={(e) => setSelectedSubId(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {currentCategory?.subServices.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {isBn ? sub.nameBn : sub.nameEn} {sub.onInspectionOnly ? (isBn ? '(কোটেশন)' : '(Custom Quote)') : `(₹${Math.round(sub.price * 0.8)})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'আপনার নাম *' : 'Your Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="booking-name-input"
                      type="text"
                      required
                      placeholder={isBn ? 'নাম লিখুন' : 'e.g. Gopal Debnath'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="booking-phone-input"
                      type="tel"
                      required
                      placeholder="10-digit Mobile No."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Service Area Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'আপনার জেলা / সার্ভিস অঞ্চল (সমগ্র পশ্চিমবঙ্গ) *' : 'Your District / Service Area (West Bengal) *'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    id="booking-area-select"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {SERVICE_AREAS.map((area) => (
                      <option key={area.id} value={isBn ? area.nameBn : area.nameEn}>
                        {isBn ? area.nameBn : area.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Full Detailed Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'সম্পূর্ণ ঠিকানা ও ল্যান্ডমার্ক *' : 'Full Doorstep Address & Landmark *'}
                </label>
                <input
                  id="booking-address-input"
                  type="text"
                  required
                  placeholder={isBn ? 'বাড়ি নং, রাস্তা, ল্যান্ডমার্ক (যেমন: বাগপাড়া স্কুল রোড)' : 'House no, Street, Landmark'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Issue Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'সমস্যার সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)' : 'Describe the problem (Optional)'}
                </label>
                <textarea
                  id="booking-issue-input"
                  rows={2}
                  placeholder={isBn ? 'কী সমস্যা হচ্ছে লিখুন (যেমন: ফ্যান আস্তে ঘুরছে বা এসি ঠান্ডা হচ্ছে না)...' : 'Brief problem description...'}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'পছন্দের তারিখ' : 'Preferred Date'}
                  </label>
                  <select
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="আজকে (Today)">{isBn ? 'আজকে (Today)' : 'Today'}</option>
                    <option value="আগামীকাল (Tomorrow)">{isBn ? 'আগামীকাল (Tomorrow)' : 'Tomorrow'}</option>
                    <option value="পরশুদিন (Day after tomorrow)">{isBn ? 'পরশুদিন' : 'Day after tomorrow'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isBn ? 'পছন্দের সময় স্লট' : 'Preferred Time Slot'}
                  </label>
                  <select
                    disabled={isUrgent}
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="সকাল ৮টা - ১১টা (8 AM - 11 AM)">8 AM - 11 AM (সকাল)</option>
                    <option value="সকাল ১১টা - দুপুর ২টা (11 AM - 2 PM)">11 AM - 2 PM (দুপুর)</option>
                    <option value="বিকেল ২টা - ৫টা (2 PM - 5 PM)">2 PM - 5 PM (বিকেল)</option>
                    <option value="সন্ধ্যা ৫টা - রাত ৮টা (5 PM - 8 PM)">5 PM - 8 PM (সন্ধ্যা)</option>
                  </select>
                </div>
              </div>

              {/* Express 30-min urgent checkbox */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <input
                    id="urgent-checkbox"
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="urgent-checkbox" className="text-xs font-bold text-amber-950 cursor-pointer">
                    ⚡ {isBn ? 'জরুরি অগ্রাধিকার এক্সপ্রেস সার্ভিস' : 'Priority Emergency Express Service'}
                  </label>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                  {isBn ? 'দ্রুত পৌঁছাবে' : 'Fast'}
                </span>
              </div>

              {/* Price Calculation Box */}
              {currentSubService?.onInspectionOnly || currentCategory?.isCustomQuote ? (
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 border border-rose-500/30">
                  <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
                    <span>{isBn ? 'শিফটিং চার্জ পলিসি:' : 'Shifting Pricing Policy:'}</span>
                    <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[11px]">
                      {isBn ? 'নির্দিষ্ট রেট চার্ট প্রযোজ্য নয়' : 'No Fixed Rate Chart'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm sm:text-base font-black pt-2 border-t border-slate-700 text-white">
                    <span>{isBn ? 'চার্জ নির্ধারণ:' : 'Estimated Charges:'}</span>
                    <span className="text-base text-rose-400 font-extrabold">
                      {isBn ? 'আলোচনা ও কোটেশন সাপেক্ষে' : 'Custom Quote on Inspection'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 pt-1 leading-relaxed">
                    * {isBn 
                      ? 'শিফটিংয়ের দূরত্ব, ফ্লোর লেভেল ও জিনিসপত্রের পরিমাণের ওপর ভিত্তি করে সবচেয়ে সাশ্রয়ী কোটেশন দেওয়া হবে। বুকিংয়ের পর আমাদের শিফটিং টিম সরাসরি যোগাযোগ করবে।'
                      : 'Final fair price depends on distance, floor level, and items. Our team will contact and provide custom quotation.'}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{isBn ? 'রেগুলার সার্ভিস চার্জ:' : 'Base Service Rate:'}</span>
                    <span className="line-through">₹{basePrice}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                    <span>{isBn ? 'স্পেশাল ডিসকাউন্ট (২০% ছাড়):' : 'Special Discount (20% OFF):'}</span>
                    <span>- ₹{discountAmount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm sm:text-base font-black pt-2 border-t border-slate-700 text-white">
                    <span>{isBn ? 'পরিশোধযোগ্য চূড়ান্ত মূল্য:' : 'Final Estimated Payable:'}</span>
                    <span className="text-lg text-emerald-400">₹{finalPrice}</span>
                  </div>

                  <p className="text-[10px] text-slate-400 pt-1">
                    * {isBn ? 'কাজ সম্পন্ন হওয়ার পর সন্তুষ্ট হলে সরাসরি টেকনিশিয়ানকে ক্যাশ বা UPI মাধ্যমে প্রদান করুন।' : 'Pay after work completion via Cash or UPI.'}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="submit-booking-confirm-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>{isBn ? 'অনুরোধ পাঠানো হচ্ছে...' : 'Processing Request...'}</span>
                ) : (
                  <>
                    <span>
                      {currentSubService?.onInspectionOnly || currentCategory?.isCustomQuote
                        ? (isBn ? 'শিফটিং বুকিং ও ফ্রি কোটেশন রিকোয়েস্ট পাঠান' : 'Submit Shifting Booking & Quote Request')
                        : (isBn ? 'বুকিং নিশ্চিত করুন (২০% ছাড়ে)' : 'Confirm Booking (20% Discount)')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
