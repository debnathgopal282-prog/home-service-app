import React from 'react';
import { Globe, Check } from 'lucide-react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  language: Language;
  onToggleLanguage: () => void;
  onSetLanguage?: (lang: Language) => void;
  variant?: 'pill' | 'button' | 'badge' | 'compact';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  language,
  onToggleLanguage,
  onSetLanguage,
  variant = 'pill',
  className = '',
}) => {
  const isBn = language === 'bn';

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center p-0.5 bg-slate-100 border border-slate-300 rounded-full shadow-2xs ${className}`}>
        <button
          type="button"
          onClick={() => {
            if (onSetLanguage) onSetLanguage('bn');
            else if (!isBn) onToggleLanguage();
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            isBn
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          title="বাংলায় পরিবর্তন করুন"
        >
          <span>বাংলা</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (onSetLanguage) onSetLanguage('en');
            else if (isBn) onToggleLanguage();
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            !isBn
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          title="Switch to English"
        >
          <span>English</span>
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={onToggleLanguage}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 transition-colors cursor-pointer shadow-2xs ${className}`}
        title={isBn ? 'Switch to English' : 'বাংলায় দেখুন'}
      >
        <Globe className="w-3.5 h-3.5 text-blue-600" />
        <span>{isBn ? 'English' : 'বাংলা'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggleLanguage}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-all cursor-pointer ${className}`}
    >
      <Globe className="w-4 h-4 text-blue-600" />
      <div className="flex items-center gap-1">
        <span className={isBn ? 'text-blue-600 underline' : 'text-slate-500'}>বাং</span>
        <span className="text-slate-300">/</span>
        <span className={!isBn ? 'text-blue-600 underline' : 'text-slate-500'}>EN</span>
      </div>
    </button>
  );
};
