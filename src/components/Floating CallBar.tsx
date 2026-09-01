import React from 'react';
import { Phone, MessageSquare, Globe, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface FloatingCallBarProps {
  language: Language;
  onToggleLanguage?: () => void;
  onOpenBooking: () => void;
  onOpenAiHelper: () => void;
}

export const FloatingCallBar: React.FC<FloatingCallBarProps> = ({
  language,
  onToggleLanguage,
  onOpenBooking,
  onOpenAiHelper,
}) => {
  const isBn = language === 'bn';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-2 sm:hidden">
      <div className="flex items-center justify-between gap-1.5">
        {/* Call button */}
        <a
          id="mobile-float-call-btn"
          href="tel:9903796410"
          className="flex-1 py-2.5 px-2 bg-slate-900 text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-xs"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{isBn ? 'কল ৯৯০৩৭৯৬৪১০' : 'Call 9903796410'}</span>
        </a>

        {/* WhatsApp button */}
        <a
          id="mobile-float-whatsapp-btn"
          href="https://wa.me/917318828211?text=Hello%20Fast%20Solution,%20I%20need%20doorstep%20service%20in%20Kanchrapara%20/%20Kalyani."
          target="_blank"
          rel="noreferrer"
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-xs transition-colors"
          title="WhatsApp Enquiry (7318828211)"
        >
          <MessageSquare className="w-4 h-4" />
        </a>

        {/* Language switch button */}
        {onToggleLanguage && (
          <button
            type="button"
            onClick={onToggleLanguage}
            className="p-2 bg-slate-100 border border-slate-300 text-slate-800 rounded-xl flex items-center justify-center text-[10px] font-black cursor-pointer shadow-xs"
            title="Change Language"
          >
            {isBn ? 'EN' : 'বাং'}
          </button>
        )}

        {/* Book Now button */}
        <button
          id="mobile-float-book-btn"
          type="button"
          onClick={onOpenBooking}
          className="flex-1 py-2.5 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-md cursor-pointer"
        >
          <span>{isBn ? 'বুকিং (২০% ছাড়)' : 'Book (20% Off)'}</span>
          <ArrowRight className="w-3 h-3 shrink-0" />
        </button>
      </div>
    </div>
  );
};
