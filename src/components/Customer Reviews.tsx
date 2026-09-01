import React from 'react';
import { Star, MapPin, CheckCircle, MessageSquareQuote } from 'lucide-react';
import { Language } from '../types';
import { SAMPLE_REVIEWS } from '../data/servicesData';

interface CustomerReviewsProps {
  language: Language;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ language }) => {
  const isBn = language === 'bn';

  return (
    <section className="py-12 sm:py-16 bg-slate-50 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{isBn ? 'সন্তুষ্ট গ্রাহকদের মতামত' : 'Customer Reviews & Feedback'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isBn ? 'পশ্চিমবঙ্গের সম্মানিত গ্রাহকরা কী বলছেন' : 'What Customers Across West Bengal Say'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {isBn
              ? 'পশ্চিমবঙ্গের বাস্তব গ্রাহকদের আসল অভিজ্ঞতা ও ৫-স্টার রেটিং।'
              : 'Verified reviews and ratings from families and homes across West Bengal.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SAMPLE_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                  "{isBn ? rev.commentBn : rev.commentEn}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {rev.name}
                  </h4>
                  <p className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{rev.location}</span>
                  </p>
                </div>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <CheckCircle className="w-3 h-3 mr-0.5" />
                  {isBn ? 'ভেরিফাইড' : 'Verified'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
