import React from 'react';
import { Clock, ShieldCheck, Award, BadgePercent, Wrench, Sparkles, PhoneCall } from 'lucide-react';
import { Language } from '../types';

interface WhyChooseUsProps {
  language: Language;
  onCallTechnician: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ language, onCallTechnician }) => {
  const isBn = language === 'bn';

  const pillars = [
    {
      icon: Clock,
      titleBn: 'সময়মত দ্রুত পরিষেবা (Reliable Doorstep Response)',
      titleEn: 'Reliable Doorstep Response',
      descBn: 'বুকিংয়ের পর আপনার সুবিধাজনক সময়ে সমগ্র পশ্চিমবঙ্গের যেকোনো ঠিকানায় দক্ষ টেকনিশিয়ান পৌঁছে যায়।',
      descEn: 'Skilled technicians arrive at your preferred schedule at any address across West Bengal.',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      icon: ShieldCheck,
      titleBn: 'বিশ্বস্ত ও ভেরিফাইড কারিগর (Verified Technicians)',
      titleEn: 'Verified Technicians',
      descBn: 'আমাদের প্রতিটি কারিগর ব্যাকগ্রাউন্ড ভেরিফাইড, ভদ্র এবং ৫ থেকে ১০+ বছরের কাজের অভিজ্ঞতাসম্পন্ন।',
      descEn: 'All mechanics and technicians are background-checked with 5-10+ years of domain experience.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      icon: Award,
      titleBn: '৩০ দিনের সার্ভিস ওয়ারেন্টি (30-Day Warranty)',
      titleEn: '30-Day Service Warranty',
      descBn: 'প্রতিটি মেরামতে দেওয়া হয় ৩০ দিনের নিশ্চিন্ত গ্যারান্টি। কোনো সমস্যা দেখা দিলে বিনামূল্যে পুনরায় পরীক্ষা।',
      descEn: 'Every repair comes with complete peace of mind and 30-day free re-check guarantee.',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      icon: BadgePercent,
      titleBn: 'স্বচ্ছ মূল্য ও ২০% ছাড় (Transparent Pricing)',
      titleEn: 'Transparent Pricing & 20% OFF',
      descBn: 'কোনো লুকানো খরচ নেই। কাজ শুরুর আগেই সঠিক রেট এবং ফ্ল্যাট ২০% বিশেষ ছাড়ের সুবিধা।',
      descEn: 'No hidden charges. Transparent upfront quote with flat 20% discount on every service.',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? 'কেন Fast & Smart Solution বেছে নেবেন?' : 'Why Choose Fast & Smart Solution?'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {isBn ? 'দ্রুত পরিষেবা, বিশ্বস্ত কারিগর!' : 'Fast Service, Trusted Technicians!'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {isBn
              ? 'কাঁচরাপাড়া ও কল্যাণীর বাসিন্দাদের ঘরোয়া মেরামতের সবথেকে নির্ভরযোগ্য সাথী।'
              : 'The most trusted doorstep home maintenance partner for Kanchrapara & Kalyani residents.'}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${p.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {isBn ? p.titleBn : p.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {isBn ? p.descBn : p.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
