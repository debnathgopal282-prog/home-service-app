import React from 'react';
import { Tag, Sparkles, ArrowRight, ShieldCheck, Clock, Percent } from 'lucide-react';
import { Language } from '../types';

interface SpecialOfferBannerProps {
  language: Language;
  onClaimOffer: () => void;
}

export const SpecialOfferBanner: React.FC<SpecialOfferBannerProps> = ({
  language,
  onClaimOffer,
}) => {
  const isBn = language === 'bn';

  return (
    <section className="py-8 sm:py-12 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-blue-500/30">
          {/* Background shapes */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Col */}
            <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-1.5 bg-amber-400 text-blue-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  <Percent className="w-3.5 h-3.5" />
                  <span>{isBn ? 'পশ্চিমবঙ্গ বিশেষ অফার' : 'West Bengal Special Deal'}</span>
                </div>
                <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                  📍 {isBn ? 'সমগ্র পশ্চিমবঙ্গ' : 'All Over West Bengal'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {isBn
                  ? 'এখনই বুক করুন এবং ২০% ছাড় পান!'
                  : 'Book Now & Get Flat 20% Instant Discount!'}
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-blue-100 max-w-2xl font-medium leading-relaxed">
                {isBn
                  ? 'কলকাতা, উত্তর ও দক্ষিণ ২৪ পরগনা, নদিয়া, হাওড়া, হুগলি সহ সমগ্র পশ্চিমবঙ্গের যেকোনো বাড়িতে এসি সার্ভিসিং, ফ্যান বা ওয়্যারিং মেরামত, প্লাম্বিং, ফ্রিজ বা ওভেন রিপেয়ার বুকিংয়ে কোনো কুপন ছাড়াই স্বয়ংক্রিয় ২০% ছাড় প্রযোজ্য।'
                  : 'Get automatic 20% discount on all AC servicing, electrical wiring, plumbing, fridge, and home appliance repairs across Kolkata, Nadia, North & South 24 Parganas, Howrah, Hooghly and all over West Bengal.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-blue-200">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isBn ? '৩০ দিনের ফ্রি সার্ভিস ওয়ারেন্টি' : '30-Day Service Warranty'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>{isBn ? 'সময়মত নির্ভরযোগ্য ডোরস্টেপ কারিগর' : 'On-Time Doorstep Service'}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Instant 20% Discount Offer Box & CTA */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center space-y-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                {isBn ? 'ফ্ল্যাট বিশেষ ছাড়' : 'FLAT SPECIAL OFFER'}
              </span>

              <div className="bg-amber-400 text-blue-950 font-black text-2xl py-2 px-4 rounded-xl tracking-wider shadow-inner">
                {isBn ? '২০% ফ্ল্যাট ছাড়' : 'FLAT 20% OFF'}
              </div>

              <p className="text-[11px] text-blue-100 font-medium">
                {isBn ? 'সমগ্র পশ্চিমবঙ্গে ফ্রি ইন্সপেকশন সাপোর্ট' : 'Doorstep coverage in all WB districts'}
              </p>

              <button
                id="claim-offer-btn"
                type="button"
                onClick={onClaimOffer}
                className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-blue-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isBn ? '২০% ছাড়ে বুক করুন' : 'Book with 20% Discount'}</span>
                <ArrowRight className="w-4 h-4 text-blue-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
