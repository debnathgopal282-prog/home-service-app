import React from 'react';
import { Phone, MessageSquare, MapPin, Sparkles, ClipboardList, Wrench } from 'lucide-react';
import { Language } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  onSetLanguage?: (lang: Language) => void;
  onOpenAiHelper: () => void;
  onOpenTracker: () => void;
  bookingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  onSetLanguage,
  onOpenAiHelper,
  onOpenTracker,
  bookingCount,
}) => {
  const isBn = language === 'bn';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs sm:text-sm py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center justify-center bg-amber-400 text-blue-950 text-[11px] font-bold px-2 py-0.5 rounded-full">
              {isBn ? '২০% ছাড়' : '20% OFF'}
            </span>
            <span className="truncate">
              {isBn
                ? '⚡ এখনই বুক করুন এবং ২০% ছাড় পান! সমগ্র পশ্চিমবঙ্গের নির্ভরযোগ্য ও দ্রুত হোম সার্ভিস।'
                : '⚡ Book now & get 20% discount! Reliable home repair service across West Bengal.'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="hidden md:flex items-center gap-1 text-blue-100">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? 'সমগ্র পশ্চিমবঙ্গ' : 'All Over West Bengal'}</span>
            </div>
            <span className="hidden md:inline text-blue-300">|</span>
            <a
              href="tel:9903796410"
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3 h-3 text-emerald-400" /> 9903796410
            </a>
            <a
              href="tel:7318828211"
              className="hidden sm:flex hover:text-amber-300 transition-colors items-center gap-1 font-semibold"
            >
              <Phone className="w-3 h-3 text-emerald-400" /> 7318828211
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0 font-black tracking-wider">
              <span className="text-sm sm:text-base font-extrabold">FSS</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  Fast & Smart <span className="text-blue-600">Solution</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-extrabold tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  {isBn ? 'ভেরিফাইড' : 'Verified'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 truncate max-w-[200px] sm:max-w-none">
                {isBn ? 'ফাস্ট অ্যান্ড স্মার্ট সলিউশন • সমগ্র পশ্চিমবঙ্গ' : 'Fast & Smart Solution • West Bengal'}
              </p>
            </div>
          </a>

          {/* Action Buttons & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Prominent Language Switcher */}
            <LanguageSwitcher
              language={language}
              onToggleLanguage={onToggleLanguage}
              onSetLanguage={onSetLanguage}
              variant="pill"
            />

            {/* AI Diagnostics button - Highlighted */}
            <button
              id="nav-ai-assistant-btn"
              type="button"
              onClick={() => {
                const el = document.getElementById('top-ai-assistant-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  const input = document.getElementById('top-ai-problem-input');
                  if (input) input.focus();
                } else {
                  onOpenAiHelper();
                }
              }}
              className="relative flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-blue-900 text-amber-300 border border-amber-400/50 shadow-md shadow-indigo-900/30 hover:border-amber-300 hover:text-white transition-all cursor-pointer group hover:scale-[1.02] active:scale-98"
            >
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">{isBn ? '⚡ AI অ্যাসিস্ট্যান্ট' : '⚡ AI Assistant'}</span>
              <span className="sm:hidden">{isBn ? '⚡ AI' : '⚡ AI'}</span>
            </button>

            {/* Track Booking Button */}
            <button
              id="nav-track-booking-btn"
              type="button"
              onClick={onOpenTracker}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">{isBn ? 'বুকিং ট্র্যাক' : 'Track Order'}</span>
              {bookingCount > 0 && (
                <span className="inline-flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Direct Call Quick Dial for Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                id="nav-call-btn-1"
                href="tel:9903796410"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>9903796410</span>
              </a>
              <a
                id="nav-whatsapp-btn"
                href="https://wa.me/917318828211?text=Hello%20Fast%20Solution,%20I%20need%20home%20repair%20service."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
