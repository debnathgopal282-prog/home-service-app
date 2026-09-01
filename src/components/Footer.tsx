import React from 'react';
import { Phone, MessageSquare, MapPin, Mail, Clock, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';

interface FooterProps {
  language: Language;
  onToggleLanguage?: () => void;
  onSetLanguage?: (lang: Language) => void;
  onOpenBooking: () => void;
  onOpenAiHelper: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onToggleLanguage,
  onSetLanguage,
  onOpenBooking,
  onOpenAiHelper,
  onOpenTracker,
}) => {
  const isBn = language === 'bn';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 sm:pb-12 border-t border-slate-800 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base tracking-wider shadow-md shrink-0">
                FSS
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Fast & Smart <span className="text-blue-400">Solution</span>
                </span>
                <p className="text-xs text-slate-400 font-bold">
                  {isBn ? 'ফাস্ট অ্যান্ড স্মার্ট সলিউশন • সমগ্র পশ্চিমবঙ্গ' : 'Fast & Smart Solution • West Bengal'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {isBn
                ? 'সমগ্র পশ্চিমবঙ্গের নির্ভরযোগ্য ডোরস্টেপ হোম রিপেয়ার সার্ভিস। কলকাতা, উত্তর ও দক্ষিণ ২৪ পরগনা, নদিয়া, হাওড়া, হুগলি, বর্ধমান সহ সমস্ত জেলায় বৈদ্যুতিক ওয়্যারিং, ফ্যান, প্লাম্বিং, এসি-ফ্রিজ ও হোম এপ্লায়েন্সের বিশ্বস্ত সমাধান।'
                : 'Premier doorstep home repair platform serving all over West Bengal including Kolkata, Nadia, North & South 24 Parganas, Howrah, Hooghly & Burdwan. Verified technicians & transparent rates.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'দ্রুত পরিষেবা, বিশ্বস্ত কারিগর!' : 'Fast Service, Trusted Technicians!'}</span>
            </div>
          </div>

          {/* Quick Contact Hotline (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              {isBn ? 'ফোন নম্বর ও হেল্পলাইন' : 'Phone Numbers & Helpline'}
            </h4>

            <div className="space-y-2">
              <a
                href="tel:9903796410"
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
                      9903796410
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {isBn ? 'পশ্চিমবঙ্গ ডোরস্টেপ হেল্পলাইন' : 'West Bengal Doorstep Helpline'}
                    </span>
                  </div>
                </div>
              </a>

              <a
                href="tel:7318828211"
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">
                      7318828211
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {isBn ? 'জরুরি সার্ভিস ও হোয়াটসঅ্যাপ' : 'Urgent Call & WhatsApp'}
                    </span>
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/919903796410?text=Hello%20Fast%20Solution,%20I%20need%20home%20service."
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isBn ? 'WhatsApp-এ সরাসরি বার্তা পাঠান' : 'Direct WhatsApp Chat'}</span>
              </a>
            </div>
          </div>

          {/* Quick Links & Service Areas (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
              {isBn ? 'পরিষেবা এলাকা ও দ্রুত লিংক' : 'Service Areas & Quick Links'}
            </h4>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-1.5 font-semibold text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBn ? 'সমগ্র পশ্চিমবঙ্গ জুড়ে পরিষেবা' : 'Serving All Across West Bengal'}</span>
              </p>
              <p className="pl-5 text-[11px]">
                {isBn ? 'কলকাতা • নদিয়া • উত্তর ও দক্ষিণ ২৪ পরগনা • হাওড়া • হুগলি • বর্ধমান • শিলিগুড়ি' : 'Kolkata • Nadia • North & South 24 Pgs • Howrah • Hooghly • Burdwan • Siliguri'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onOpenBooking}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {isBn ? 'বুকিং করুন (২০% ছাড়)' : 'Book Now (20% Off)'}
              </button>
              <button
                type="button"
                onClick={onOpenAiHelper}
                className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {isBn ? 'AI সমস্যা নির্ণায়ক' : 'AI Troubleshooter'}
              </button>
              <button
                type="button"
                onClick={onOpenTracker}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                {isBn ? 'বুকিং ট্র্যাক করুন' : 'Track Order'}
              </button>
            </div>

            {/* Language Switcher in Footer */}
            {onToggleLanguage && (
              <div className="pt-3 flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">{isBn ? 'ভাষা:' : 'Language:'}</span>
                <LanguageSwitcher
                  language={language}
                  onToggleLanguage={onToggleLanguage}
                  onSetLanguage={onSetLanguage}
                  variant="pill"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center">
          <p>© {new Date().getFullYear()} Fast & Smart Solution. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}</p>
          <p className="flex items-center justify-center gap-1">
            <span>{isBn ? 'কাঁচরাপাড়া ও কল্যাণীর ঘরে ঘরে দ্রুত বিশ্বস্ত সেবা' : 'Doorstep reliable home service with care'}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
