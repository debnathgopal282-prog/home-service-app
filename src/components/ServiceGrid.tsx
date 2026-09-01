import React, { useState } from 'react';
import { 
  Zap, 
  Droplets, 
  Wind, 
  Laptop, 
  Flame, 
  Wrench, 
  Truck,
  ChevronRight, 
  Tag, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Language, ServiceCategory, SubService } from '../types';

interface ServiceGridProps {
  categories: ServiceCategory[];
  language: Language;
  searchQuery: string;
  onSelectSubService: (category: ServiceCategory, subService: SubService) => void;
  onDirectCategoryBook: (category: ServiceCategory) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  categories,
  language,
  searchQuery,
  onSelectSubService,
  onDirectCategoryBook,
}) => {
  const isBn = language === 'bn';
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<ServiceCategory | null>(null);

  // Icon mapping
  const renderIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Zap':
        return <Zap className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Wind':
        return <Wind className={className} />;
      case 'Laptop':
        return <Laptop className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Truck':
        return <Truck className={className} />;
      case 'Wrench':
      default:
        return <Wrench className={className} />;
    }
  };

  // Filter categories and subservices based on search query
  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchCat =
      cat.titleBn.toLowerCase().includes(q) ||
      cat.titleEn.toLowerCase().includes(q) ||
      cat.subtitleBn.toLowerCase().includes(q) ||
      cat.subtitleEn.toLowerCase().includes(q) ||
      cat.itemsBn.some((i) => i.toLowerCase().includes(q)) ||
      cat.itemsEn.some((i) => i.toLowerCase().includes(q));

    const matchSub = cat.subServices.some(
      (sub) =>
        sub.nameBn.toLowerCase().includes(q) ||
        sub.nameEn.toLowerCase().includes(q) ||
        sub.descriptionBn.toLowerCase().includes(q) ||
        sub.descriptionEn.toLowerCase().includes(q)
    );

    return matchCat || matchSub;
  });

  return (
    <section id="services-section" className="py-10 sm:py-16 bg-slate-50 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{isBn ? 'আমাদের প্রধান পরিষেবা সমূহ' : 'Our Comprehensive Services'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {isBn ? 'আপনার বাড়ির সমস্ত মেরামতের এক বিশ্বস্ত ঠিকানা' : 'One Trusted Stop for All Home Repairs'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600">
            {isBn
              ? 'অভিজ্ঞ কারিগর, সাশ্রয়ী মূল্য এবং প্রতিটি সার্ভিসে ২০% ছাড় সহ ৩০ দিনের গ্যারান্টি।'
              : 'Experienced technicians, transparent pricing, and 20% discount on every service.'}
          </p>
        </div>

        {/* 6 Category Cards Grid (2 cols on tablet, 3 cols on desktop) */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
            <p className="text-slate-600 font-semibold mb-2">
              {isBn ? 'কোনো সার্ভিস পাওয়া যায়নি' : 'No services found for your search'}
            </p>
            <p className="text-xs text-slate-400">
              {isBn ? 'অনুগ্রহ করে অন্য শব্দ দিয়ে খুঁজুন অথবা আমাদের সরাসরি কল করুন।' : 'Please try different keywords or call our helpline.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const title = isBn ? category.titleBn : category.titleEn;
              const subtitle = isBn ? category.subtitleBn : category.subtitleEn;
              const items = isBn ? category.itemsBn : category.itemsEn;
              const minPrice = Math.min(...category.subServices.map((s) => s.price));
              const discountedPrice = Math.round(minPrice * 0.8);

              return (
                <div
                  key={category.id}
                  id={`service-card-${category.id}`}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Card Banner Header */}
                  <div className={`p-5 bg-gradient-to-r ${category.bannerColor} text-white relative overflow-hidden`}>
                    <div className="flex items-start justify-between gap-3 relative z-10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white shadow-xs">
                            {renderIcon(category.iconName, 'w-6 h-6')}
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                            {isBn ? '২০% ছাড়' : '20% OFF'}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                          {title}
                        </h3>
                        <p className="text-xs font-semibold text-white/90">
                          {subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Content & Features List */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    {/* Bullet Points from Flyer */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {isBn ? 'কী কী সুবিধা রয়েছে:' : 'Included Services:'}
                      </p>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                        {items.slice(0, 4).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Popular Sub-services Snapshot */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          {category.isCustomQuote
                            ? (isBn ? 'চার্জ নির্ধারণ:' : 'Pricing:')
                            : (isBn ? 'শুরু মাত্র:' : 'Starting at:')}
                        </span>
                        <div className="text-right">
                          {category.isCustomQuote ? (
                            <span className="text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {isBn ? 'আলোচনা সাপেক্ষে' : 'Custom Quote'}
                            </span>
                          ) : (
                            <>
                              <span className="text-xs line-through text-slate-400 mr-1.5 font-medium">
                                ₹{minPrice}
                              </span>
                              <span className="text-base font-black text-blue-600">
                                ₹{discountedPrice}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quick CTA Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          id={`view-services-btn-${category.id}`}
                          type="button"
                          onClick={() => setSelectedCategoryModal(category)}
                          className="w-full py-2 px-3 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>{isBn ? 'তালিকা দেখুন' : 'View Details'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id={`book-category-btn-${category.id}`}
                          type="button"
                          onClick={() => onDirectCategoryBook(category)}
                          className="w-full py-2 px-3 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>{isBn ? (category.isCustomQuote ? 'কোটেশন নিন' : 'বুক করুন') : (category.isCustomQuote ? 'Get Quote' : 'Book Now')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Sub-Services Detail Modal */}
      {selectedCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className={`p-5 bg-gradient-to-r ${selectedCategoryModal.bannerColor} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <span className="p-2 bg-white/20 rounded-xl">
                  {renderIcon(selectedCategoryModal.iconName, 'w-6 h-6 text-white')}
                </span>
                <div>
                  <h3 className="text-xl font-black">
                    {isBn ? selectedCategoryModal.titleBn : selectedCategoryModal.titleEn}
                  </h3>
                  <p className="text-xs text-white/90">
                    {isBn ? selectedCategoryModal.subtitleBn : selectedCategoryModal.subtitleEn}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCategoryModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Sub-services List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-amber-600" />
                  {isBn ? 'ফ্ল্যাট ২০% বিশেষ ছাড়ের অফার প্রযোজ্য!' : 'Flat 20% discount applied automatically!'}
                </span>
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded font-black text-[10px]">
                  {isBn ? '২০% ছাড়' : '20% OFF'}
                </span>
              </div>

              <div className="space-y-3">
                {selectedCategoryModal.subServices.map((sub) => {
                  const subTitle = isBn ? sub.nameBn : sub.nameEn;
                  const subDesc = isBn ? sub.descriptionBn : sub.descriptionEn;
                  const finalDiscountedPrice = Math.round(sub.price * 0.8);

                  return (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                            {subTitle}
                          </h4>
                          {sub.popular && (
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                              {isBn ? 'জনপ্রিয়' : 'Popular'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {subDesc}
                        </p>
                        {sub.warrantyBn && (
                          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold pt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{isBn ? sub.warrantyBn : sub.warrantyEn}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          {sub.onInspectionOnly ? (
                            <div>
                              <span className="text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                                {isBn ? 'আলোচনা সাপেক্ষে' : 'Custom Quote'}
                              </span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">
                                {sub.unit}
                              </span>
                            </div>
                          ) : (
                            <>
                              <span className="text-xs line-through text-slate-400 mr-1.5">
                                ₹{sub.price}
                              </span>
                              <span className="text-lg font-black text-blue-600">
                                ₹{finalDiscountedPrice}
                              </span>
                              <span className="block text-[10px] text-slate-400">
                                {sub.unit}
                              </span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const cat = selectedCategoryModal;
                            setSelectedCategoryModal(null);
                            onSelectSubService(cat, sub);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>{isBn ? (sub.onInspectionOnly ? 'কোটেশন নিন' : 'বুক করুন') : (sub.onInspectionOnly ? 'Get Quote' : 'Book')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {isBn ? 'জরুরি প্রয়োজনে কল করুন: ৯৯০৩৭৯৬৪১০' : 'For urgent queries call: 9903796410'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategoryModal(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-semibold cursor-pointer"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
