import React from 'react';
import { MapPin, Navigation, Phone, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { SERVICE_AREAS } from '../data/servicesData';

interface CoverageAreaSectionProps {
  language: Language;
  onSelectAreaBook: (areaName: string) => void;
}

export const CoverageAreaSection: React.FC<CoverageAreaSectionProps> = ({
  language,
  onSelectAreaBook,
}) => {
  const isBn = language === 'bn';

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left info */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{isBn ? 'পরিষেবা কভারেজ অঞ্চল' : 'Service Coverage Area'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isBn ? 'সমগ্র পশ্চিমবঙ্গ জুড়ে আমাদের ডোরস্টেপ হোম সার্ভিস' : 'Doorstep Home Service All Over West Bengal'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {isBn
                ? 'কলকাতা, উত্তর ও দক্ষিণ ২৪ পরগনা, নদিয়া, হাওড়া, হুগলি, পূর্ব ও পশ্চিম বর্ধমান, শিলিগুড়ি সহ সমগ্র পশ্চিমবঙ্গের প্রতিটি জেলা, শহর ও ব্লকে আমাদের দক্ষ ও ভেরিফায়েড টেকনিশিয়ান নেটওয়ার্ক উপস্থিত।'
                : 'Our verified technician network covers Kolkata, North & South 24 Parganas, Nadia, Howrah, Hooghly, Burdwan, Siliguri, and all districts across West Bengal for reliable doorstep assistance.'}
            </p>

            {/* Quick Contact Highlight */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-blue-900">
                  {isBn ? 'আপনার এলাকায় টেকনিশিয়ান এখনই ডাকতে চান?' : 'Need urgent technician in your area?'}
                </p>
                <p className="text-xs text-blue-700 font-medium">
                  {isBn ? 'সরাসরি হেল্পলাইনে ফোন করুন' : 'Call our 24/7 hotline directly'}
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href="tel:9903796410"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>9903796410</span>
                </a>
                <a
                  href="tel:7318828211"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  <span>7318828211</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Area Badges Grid */}
          <div className="lg:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>{isBn ? 'তাত্ক্ষণিক পরিষেবা প্রাপ্ত অঞ্চলসমূহ:' : 'Instant Service Coverage Areas:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SERVICE_AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => onSelectAreaBook(isBn ? area.nameBn : area.nameEn)}
                  className="flex items-center gap-2 p-3 bg-white hover:bg-blue-50 hover:border-blue-300 rounded-xl border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <MapPin className="w-4 h-4 text-blue-500 group-hover:text-blue-700 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900 truncate">
                    {isBn ? area.nameBn : area.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
