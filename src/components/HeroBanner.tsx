import React from 'react';
import { Phone, MessageSquare, MapPin, Sparkles, ShieldCheck, Clock, Award, Search, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface HeroBannerProps {
  language: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAiHelper: () => void;
  onSelectCategory?: (catId: string) => void;
  onQuickBookClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  searchQuery,
  onSearchChange,
  onOpenAiHelper,
  onQuickBookClick,
}) => {
  const isBn = language === 'bn';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-slate-50 to-white pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-slate-200/80 w-full max-w-full">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative text-center">
        {/* Top Area & Trust Tag */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-200 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            {isBn ? 'সমগ্র পশ্চিমবঙ্গ জুড়ে ডোরস্টেপ সার্ভিস' : 'Doorstep Service Across West Bengal'}
          </span>

          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-2xs">
            ⭐ {isBn ? '৪.৯/৫ স্টার রেটিং ও বিশ্বস্ত সেবা' : '4.9/5 Star Rated Service'}
          </span>
        </div>

        {/* Main Title & Brand Heading */}
        <div className="space-y-3 max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0 font-black text-xl sm:text-2xl tracking-wide">
              FSS
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Fast & Smart <span className="text-blue-600 drop-shadow-xs">Solution</span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 leading-snug">
            {isBn
              ? 'আপনার বাড়ির সমস্ত রকম সমস্যার সমাধান'
              : 'Complete Solution for All Your Home Needs'}
          </p>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? 'বৈদ্যুতিক মেরামত, প্লাম্বিং, এসি-ফ্রিজ, কিচেন চিমনি, হোম শিফটিং, ওভেন-মিক্সার এবং অন্যান্য সকল ঘরোয়া কাজের নির্ভরযোগ্য ও দক্ষ কারিগর এখন আপনার দরজায়।'
              : 'Reliable doorstep technicians for Electrical, Plumbing, AC & Fridge, Kitchen Chimney, Home Shifting & Home Appliance repairs.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center shadow-lg rounded-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              id="hero-service-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isBn
                  ? 'সার্ভিস খুঁজুন (যেমন: হোম শিফটিং, কিচেন চিমনি, ফ্যান মেরামত, এসি গ্যাস)...'
                  : 'Search services (e.g. Home Shifting, Kitchen Chimney, Fan repair, AC)...'
              }
              className="w-full pl-12 pr-28 py-4 bg-white rounded-2xl border border-slate-300 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={onQuickBookClick}
              className="absolute right-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{isBn ? 'খুঁজুন' : 'Search'}</span>
            </button>
          </div>

          {/* Quick AI diagnose prompt */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
            <span>{isBn ? '💡 সমস্যা বুঝতে পারছেন না?' : '💡 Not sure what is broken?'}</span>
            <button
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
              className="text-indigo-700 font-bold hover:underline inline-flex items-center gap-1.5 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>{isBn ? 'AI দিয়ে সমস্যা শনাক্ত করুন' : 'Diagnose with AI Assistant'}</span>
            </button>
          </div>
        </div>

        {/* Direct Contact Phone Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <a
            id="hero-call-number-1"
            href="tel:9903796410"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>9903796410</span>
          </a>

          <a
            id="hero-call-number-2"
            href="tel:7318828211"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4 text-amber-300" />
            <span>7318828211</span>
          </a>

          <a
            id="hero-whatsapp-cta"
            href="https://wa.me/917318828211?text=Hello%20Fast%20Solution,%20I%20want%20to%20enquire%20and%20book%20a%20doorstep%20service."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* 4 Pillar Value Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs text-center space-y-1">
            <Clock className="w-5 h-5 text-blue-600 mx-auto" />
            <p className="text-xs font-extrabold text-slate-800">{isBn ? '৩০-৬০ মিনিটে উপস্থিতি' : '30-60 Min Response'}</p>
            <p className="text-[11px] text-slate-500">{isBn ? 'দ্রুত ডোরস্টেপ সেবা' : 'Doorstep service'}</p>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs text-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
            <p className="text-xs font-extrabold text-slate-800">{isBn ? '১০০% ভেরিফাইড' : 'Verified Experts'}</p>
            <p className="text-[11px] text-slate-500">{isBn ? 'অভিজ্ঞ টেকনিশিয়ান' : 'Background checked'}</p>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs text-center space-y-1">
            <Award className="w-5 h-5 text-amber-600 mx-auto" />
            <p className="text-xs font-extrabold text-slate-800">{isBn ? '৩০ দিনের ওয়ারেন্টি' : '30-Day Warranty'}</p>
            <p className="text-[11px] text-slate-500">{isBn ? 'নিশ্চিন্ত পরিষেবা' : 'Post-service support'}</p>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-xs text-center space-y-1">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 mx-auto" />
            <p className="text-xs font-extrabold text-slate-800">{isBn ? 'ন্যায্য ও স্বচ্ছ চার্জ' : 'Transparent Pricing'}</p>
            <p className="text-[11px] text-slate-500">{isBn ? 'কোনো গোপন চার্জ নেই' : 'No hidden fees'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
