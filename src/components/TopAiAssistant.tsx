import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Phone, 
  MessageSquare, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Clock, 
  HelpCircle,
  Wrench,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
  ThumbsUp,
  Info,
  Flame,
  Bot,
  Activity,
  Tv,
  Refrigerator,
  Fan,
  Droplets,
  PackageCheck
} from 'lucide-react';
import { Language, AiDiagnosticResult, ServiceCategory, SubService } from '../types';

interface TopAiAssistantProps {
  language: Language;
  categories: ServiceCategory[];
  onBookFromDiagnosis: (category: ServiceCategory, subService?: SubService, issueText?: string) => void;
  onOpenFullAiModal: () => void;
}

interface PromptChip {
  bn: string;
  en: string;
  icon: string;
}

const POPULAR_PROMPTS: PromptChip[] = [
  { bn: 'ফ্রিজ চলছে কিন্তু নিচে ঠান্ডা হচ্ছে না', en: 'Fridge running but no cooling at bottom', icon: '❄️' },
  { bn: 'কিচেন চিমনির তেলকালি ও সাকশন কমে গেছে', en: 'Kitchen chimney grease & low suction', icon: '🍳' },
  { bn: 'সিলিং ফ্যানের স্পিড কম ও শব্দ করছে', en: 'Ceiling fan slow with humming noise', icon: '🌀' },
  { bn: 'হোম ও অফিস শিফটিং ও পিকআপ সার্ভিস', en: 'Home & office shifting / pickup van', icon: '📦' },
  { bn: 'পানির পাইপ বা কল দিয়ে অনবরত জল লিক', en: 'Water leaking from pipe or faucet', icon: '💧' },
  { bn: 'স্মার্ট টিভিতে সাউন্ড আছে কিন্তু ছবি নেই', en: 'Smart TV has sound but no picture', icon: '📺' },
  { bn: 'এসি কুলিং কম ও ফোম ওয়াশ সার্ভিস', en: 'AC low cooling & foam service', icon: '❄️' },
  { bn: 'ঘরের মেইন সুইচের MCB বারবার ট্রিপ করছে', en: 'Main electrical MCB tripping often', icon: '⚡' }
];

export const TopAiAssistant: React.FC<TopAiAssistantProps> = ({
  language,
  categories,
  onBookFromDiagnosis,
  onOpenFullAiModal,
}) => {
  const isBn = language === 'bn';
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiDiagnosticResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasDiagnosed, setHasDiagnosed] = useState(false);
  const [diyFeedback, setDiyFeedback] = useState<'resolved' | 'unresolved' | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleDiagnose = async (textToUse?: string) => {
    const text = (textToUse !== undefined ? textToUse : query).trim();
    if (!text) {
      setErrorMsg(isBn ? 'দয়া করে আপনার সমস্যার বিবরণ লিখুন।' : 'Please describe your problem or required service.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setResult(null);
    setDiyFeedback(null);
    setCompletedSteps([]);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: text,
          language: language,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isBn ? 'ডায়াগনস্টিক সম্পন্ন হয়নি।' : 'Diagnosis failed.'));
      }

      setResult(data.diagnosis);
      setHasDiagnosed(true);
    } catch (err: any) {
      setErrorMsg(err.message || (isBn ? 'সমস্যা শনাক্ত করতে ত্রুটি হয়েছে।' : 'Error diagnosing problem.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChip = (chipText: string) => {
    setQuery(chipText);
    handleDiagnose(chipText);
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setErrorMsg(null);
    setHasDiagnosed(false);
    setDiyFeedback(null);
    setCompletedSteps([]);
  };

  const toggleStepCompleted = (index: number) => {
    setCompletedSteps((prev) => 
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleInstantBook = () => {
    if (!result) return;
    let matchedCat = categories.find((c) => c.id === result.suggestedCategoryId);
    if (!matchedCat) matchedCat = categories[0];
    const matchedSub = matchedCat.subServices[0];
    onBookFromDiagnosis(
      matchedCat, 
      matchedSub, 
      query || (isBn ? result.detectedProblemBn : result.detectedProblemEn)
    );
  };

  const rootCauses = result ? (isBn ? result.analyzedRootCausesBn : result.analyzedRootCausesEn) || [] : [];
  const quickChecks = result ? (isBn ? result.quickDiagnosticChecksBn : result.quickDiagnosticChecksEn) || [] : [];
  const diySteps = result ? (isBn ? result.diyStepsBn : result.diyStepsEn) || [] : [];
  const toolsNeeded = result ? (isBn ? result.requiredToolsBn : result.requiredToolsEn) || [] : [];
  const fixTime = result ? (isBn ? result.diyEstimatedTimeBn : result.diyEstimatedTimeEn) : '';
  const safetyTips = result ? (isBn ? result.safetyTipsBn : result.safetyTipsEn) || [] : [];
  const diyWarning = result ? (isBn ? result.diyWarningBn : result.diyWarningEn) : '';

  return (
    <section 
      id="top-ai-assistant-section"
      className="relative bg-gradient-to-b from-slate-950 via-[#0b1329] to-slate-900 text-white py-6 sm:py-8 border-b-2 border-indigo-500/40 shadow-2xl overflow-hidden transition-all w-full max-w-full"
    >
      {/* High-Tech Glowing Ambient Mesh & Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
      <div className="absolute -top-10 left-1/4 w-96 h-44 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-96 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-4 w-72 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Prominent AI Highlight Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Main Highlighted Card Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/90 via-slate-900/95 to-slate-950/95 p-4 sm:p-6 lg:p-7 border-2 border-indigo-500/50 shadow-[0_0_35px_rgba(99,102,241,0.25)] backdrop-blur-xl">
          
          {/* Top Floating Badge & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-500/30">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] sm:text-xs px-3 py-1 rounded-full shadow-md shadow-amber-400/30 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 animate-spin" style={{ animationDuration: '3s' }} />
                <span>{isBn ? '⚡ AI চালিত সমস্যার সমাধান' : '⚡ AI Diagnostic Engine'}</span>
              </span>

              <span className="inline-flex items-center gap-1 bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{isBn ? 'লাইভ স্বয়ংক্রিয় ডায়াগনসিস' : 'Live Auto Diagnosis'}</span>
              </span>

              <span className="hidden md:inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{isBn ? 'সমগ্র পশ্চিমবঙ্গ' : 'All Over West Bengal'}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onOpenFullAiModal}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
              >
                <span>{isBn ? 'ফুল স্ক্রিন AI ভিউ' : 'Full Screen AI'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section Header & Subtitle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center mb-5">
            <div className="lg:col-span-8 space-y-1.5">
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-amber-200">
                  {isBn ? 'AI সেলফ-রিপেয়ার গাইড ও হোম সার্ভিস অ্যাসিস্ট্যান্ট' : 'AI Self-Repair Guide & Doorstep Service'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200/90 font-medium leading-relaxed max-w-3xl">
                {isBn 
                  ? 'আপনার ফ্রিজ, চিমনি, ফ্যান, এসি, টিভি, প্লাম্বিং বা শিফটিংয়ের সমস্যা নিচে লিখুন — AI সঙ্গে সঙ্গে সম্ভাব্য কারণ, নিজে ঠিক করার নিরাপদ ধাপ ও খরচের হিসাব বের করে দেবে।'
                  : 'Type your appliance, electrical, plumbing, or shifting problem below — AI instantly detects root causes, provides safe DIY steps, and calculates estimated repair cost.'}
              </p>
            </div>

            {/* Quick Feature Badges on Right */}
            <div className="lg:col-span-4 flex flex-wrap lg:flex-col gap-2 justify-start lg:justify-center">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-200 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
                <span className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">১</span>
                <span>{isBn ? 'নিরাপদ ঘরোয়া চেকলিস্ট ও DIY ধাপ' : 'Safe DIY Home Checklist'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-200 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
                <span className="w-5 h-5 rounded-md bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-xs">২</span>
                <span>{isBn ? 'না পারলে ১-ক্লিকে দক্ষ টেকনিশিয়ান বুকিং' : '1-Click Verified Booking'}</span>
              </div>
            </div>
          </div>

          {/* Mandatory Safety Notice / Disclaimer Banner */}
          <div className="mb-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3 text-amber-200 text-xs flex items-start sm:items-center gap-2.5 shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div className="flex-1 leading-relaxed">
              <span className="font-extrabold text-amber-300">
                {isBn ? '⚠️ গুরুত্বপূর্ণ সতর্কতা: ' : '⚠️ Important Notice: '}
              </span>
              <span className="text-slate-100 font-medium">
                {isBn 
                  ? 'এটি কেবল সাধারণ তথ্যের জন্য। জটিল বা ইলেকট্রিক কাজের ক্ষেত্রে নিজে চেষ্টা না করে পেশাদার টেকনিশিয়ানের সাহায্য নিন।' 
                  : 'This is for general informational purposes only. For complex or electrical tasks, seek professional technician help instead of trying yourself.'}
              </span>
            </div>
          </div>

          {/* High-Tech Search / Query Input Bar */}
          <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border-2 border-indigo-400/50 shadow-[0_0_20px_rgba(99,102,241,0.2)] focus-within:border-amber-400 focus-within:shadow-[0_0_25px_rgba(251,191,36,0.3)] transition-all">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Bot className="w-5 h-5 text-indigo-400 absolute left-3.5 pointer-events-none hidden sm:block" />
                <input
                  id="top-ai-problem-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleDiagnose();
                    }
                  }}
                  placeholder={
                    isBn
                      ? 'যন্ত্রের সমস্যা লিখুন (যেমন: ফ্রিজ ঠান্ডা হচ্ছে না, চিমনি সাকশন কম, ফ্যানের আওয়াজ, পাইপ লিক)...'
                      : 'Type any problem (e.g., fridge not cooling, chimney suction low, fan humming, water leaking)...'
                  }
                  className="w-full pl-3.5 sm:pl-11 pr-10 py-3 sm:py-3.5 bg-slate-950 text-white rounded-xl text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 border border-slate-700/80 shadow-inner"
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                    title={isBn ? 'মুছুন' : 'Clear'}
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                id="top-ai-submit-btn"
                type="button"
                onClick={() => handleDiagnose()}
                disabled={isLoading}
                className="px-5 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-70 active:scale-98 hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{isBn ? 'AI বিশ্লেষণ করছে...' : 'Diagnosing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{isBn ? 'AI ডায়াগনসিস ও খরচ দেখুন' : 'Get AI Diagnosis & Fix'}</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            </div>

            {/* Popular quick prompt chips */}
            {!hasDiagnosed && !isLoading && (
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[11px] text-amber-300 font-extrabold shrink-0 flex items-center gap-1 mr-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {isBn ? 'জনপ্রিয় সমস্যা:' : 'Quick Select:'}
                </span>
                {POPULAR_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectChip(isBn ? prompt.bn : prompt.en)}
                    className="text-[11px] bg-slate-800/90 hover:bg-indigo-900/60 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 hover:border-indigo-400/50 transition-all shrink-0 cursor-pointer font-medium flex items-center gap-1 shadow-xs"
                  >
                    <span>{prompt.icon}</span>
                    <span>{isBn ? prompt.bn : prompt.en}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 bg-red-500/20 border border-red-400/40 text-red-200 text-xs p-3.5 rounded-xl flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-300 hover:text-white text-xs underline cursor-pointer"
              >
                {isBn ? 'বন্ধ করুন' : 'Dismiss'}
              </button>
            </div>
          )}

          {/* Structured Step-by-Step AI Guide (1. DIY Troubleshooting ➜ 2. Professional Booking) */}
          {result && (
            <div className="mt-5 bg-slate-950/90 border-2 border-indigo-500/50 rounded-2xl p-4 sm:p-6 text-white shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header: Root cause and category */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block">
                      {isBn ? 'শনাক্তকৃত বিষয় ও বিভাগ:' : 'Identified Issue & Category:'}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white">
                      {isBn ? result.suggestedCategoryTitleBn : result.suggestedCategoryTitleEn} 
                      {' › '} 
                      <span className="text-emerald-400">{isBn ? result.recommendedSubServiceBn : result.recommendedSubServiceEn}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border ${
                    result.urgencyLevel === 'critical' || result.urgencyLevel === 'high'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}>
                    {result.urgencyLevel === 'critical' ? (isBn ? '🚨 অতি জরুরি' : '🚨 Critical') :
                     result.urgencyLevel === 'high' ? (isBn ? '⚡ দ্রুত ব্যবস্থা নিন' : '⚡ High Priority') :
                     (isBn ? '🔧 সাধারণ সার্ভিস' : '🔧 Normal Routine')}
                  </span>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 border border-white/10"
                    title={isBn ? 'নতুন অনুসন্ধান' : 'Reset'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isBn ? 'রিসেট' : 'Reset'}</span>
                  </button>
                </div>
              </div>

              {/* Mandatory Safety Disclaimer at the start of AI Response */}
              <div className="bg-amber-500/15 border-2 border-amber-400/50 rounded-xl p-3 text-amber-200 text-xs flex items-start gap-2.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-extrabold text-amber-300">
                    {isBn ? '⚠️ ডিসক্লেমার (Disclaimer): ' : '⚠️ Disclaimer: '}
                  </span>
                  <span className="font-semibold text-white">
                    {isBn 
                      ? 'এটি কেবল সাধারণ তথ্যের জন্য। জটিল বা ইলেকট্রিক কাজের ক্ষেত্রে নিজে চেষ্টা না করে পেশাদার টেকনিশিয়ানের সাহায্য নিন।' 
                      : 'This is for general informational purposes only. For complex or electrical work, do not attempt self-repair; please seek assistance from a professional technician.'}
                  </span>
                </div>
              </div>

              {/* Main AI Analysis & Diagnostic Breakdown */}
              <div className="bg-indigo-950/70 p-4 sm:p-5 rounded-2xl border border-indigo-500/40 space-y-3 shadow-inner">
                <div>
                  <p className="text-[11px] font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {isBn ? '🤖 AI স্বয়ংক্রিয় ত্রুটি ডায়াগনসিস (Automated Analysis):' : '🤖 AI Automated Fault Diagnosis:'}
                  </p>
                  <p className="text-slate-100 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed">
                    {isBn ? result.detectedProblemBn : result.detectedProblemEn}
                  </p>
                </div>

                {/* Specific Analyzed Root Causes */}
                {rootCauses.length > 0 && (
                  <div className="pt-3 border-t border-indigo-800/60">
                    <span className="text-[11px] font-bold text-indigo-200 block mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      {isBn ? 'সমস্যার সম্ভাব্য মূল কারণসমূহ (Probable Root Causes):' : 'Probable Root Causes Identified:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {rootCauses.map((cause, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-indigo-100 flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span className="font-medium leading-tight">{cause}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Diagnostic Checks before attempting fix */}
                {quickChecks.length > 0 && (
                  <div className="pt-3 border-t border-indigo-800/60">
                    <span className="text-[11px] font-bold text-emerald-300 block mb-2 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      {isBn ? 'তাৎক্ষণিক পর্যবেক্ষণ ও চেকিং পয়েন্ট (Quick Checks):' : 'Quick Diagnostic Checks to Verify:'}
                    </span>
                    <div className="space-y-1.5">
                      {quickChecks.map((check, idx) => (
                        <div key={idx} className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-2.5 text-xs text-emerald-100 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">🔍</span>
                          <span className="leading-tight">{check}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 1: AI Generated DIY Solutions & Troubleshooting Guide */}
              <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-amber-400/40 space-y-3.5 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      ১
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4" />
                      <span>{isBn ? 'AI-প্রস্তাবিত নিজে ঠিক করার সমাধান ধাপসমূহ (DIY Solutions):' : 'Step 1: AI-Synthesized DIY Solutions & Steps:'}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {fixTime && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-300" />
                        <span>{fixTime}</span>
                      </span>
                    )}
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      {isBn ? 'বিনামূল্যে সমাধান' : 'Free DIY'}
                    </span>
                  </div>
                </div>

                {/* Required Tools */}
                {toolsNeeded.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-300 font-bold text-[11px] flex items-center gap-1">
                      <Wrench className="w-3 h-3 text-amber-400" />
                      {isBn ? 'প্রয়োজনীয় সরঞ্জাম:' : 'Tools Required:'}
                    </span>
                    {toolsNeeded.map((t, idx) => (
                      <span key={idx} className="bg-amber-400/10 text-amber-200 border border-amber-400/20 px-2 py-0.5 rounded text-[11px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* DIY Steps List with interactive checkboxes */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] text-slate-300 font-bold block">
                    {isBn ? 'নিচের পদক্ষেপগুলো ক্রমানুসারে চেষ্টা করুন (ক্লিক করে টিক দিন):' : 'Try the steps below in order (click to check off):'}
                  </span>

                  {diySteps.length > 0 ? (
                    diySteps.map((step, idx) => {
                      const isDone = completedSteps.includes(idx);
                      return (
                        <div 
                          key={idx}
                          onClick={() => toggleStepCompleted(idx)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isDone 
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                {idx + 1}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 text-xs sm:text-sm">
                            <span className={isDone ? 'line-through opacity-80' : 'font-medium'}>
                              {step}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-white/5 p-3 rounded-xl text-xs text-slate-300">
                      {isBn ? result.recommendedActionBn : result.recommendedActionEn}
                    </div>
                  )}
                </div>

                {/* Safety Precaution Banner */}
                {(diyWarning || safetyTips.length > 0) && (
                  <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-amber-300 text-[11px]">
                        {isBn ? '⚠️ নিরাপত্তা সতর্কতা (Safety Precaution):' : '⚠️ Safety Precaution:'}
                      </span>
                      <p className="mt-0.5 leading-relaxed text-[11px] sm:text-xs text-slate-200">
                        {diyWarning || safetyTips[0]}
                      </p>
                    </div>
                  </div>
                )}

                {/* DIY Result Feedback Check */}
                <div className="pt-2.5 border-t border-slate-800">
                  <p className="text-xs text-slate-300 font-medium mb-2.5">
                    {isBn ? '💡 ওপরের AI সমাধান ও ধাপগুলো মেনে আপনার সমস্যা কি সমাধান হয়েছে?' : '💡 Did the above AI troubleshooting steps resolve your issue?'}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDiyFeedback('resolved')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        diyFeedback === 'resolved'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isBn ? '✅ হ্যাঁ, নিজে সমাধান হয়েছে (ধন্যবাদ!)' : '✅ Yes, Fixed it myself!'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDiyFeedback('unresolved')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        diyFeedback === 'unresolved'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isBn ? '❌ না, ঠিক হয়নি — দক্ষ কারিগর প্রয়োজন' : '❌ No, need professional technician'}</span>
                    </button>
                  </div>

                  {/* If user successfully fixed it */}
                  {diyFeedback === 'resolved' && (
                    <div className="mt-3 p-3.5 bg-emerald-900/60 border border-emerald-400/50 rounded-2xl text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-2 animate-in fade-in">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-bold block text-white">{isBn ? 'অভিনন্দন! আপনার কাজ সফলভাবে সম্পন্ন হয়েছে 🎉' : 'Awesome! Problem resolved 🎉'}</span>
                          <span className="text-[11px] text-emerald-300">{isBn ? 'ভবিষ্যতে যেকোনো হোম সার্ভিস বা যন্ত্রাংশের প্রয়োজনে আমরা আপনার পাশে আছি।' : 'We are always here for any future doorstep home services.'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-[11px] bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold shrink-0 cursor-pointer"
                      >
                        {isBn ? 'শেষ করুন' : 'Close'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 2: Professional Technician Solution & Cost */}
              <div className={`bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-2xl p-4 sm:p-5 border-2 transition-all ${
                diyFeedback === 'unresolved' 
                  ? 'border-amber-400 shadow-xl shadow-amber-400/10'
                  : 'border-indigo-500/50'
              }`}>
                <div className="flex items-center justify-between pb-3.5 border-b border-indigo-500/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      ২
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                        <span>{isBn ? 'নিজে সমাধান না হলে — দক্ষ কারিগর বুকিং ও খরচ:' : 'Step 2: If Not Resolved — Professional Booking & Cost:'}</span>
                      </h3>
                      <p className="text-[11px] text-indigo-200">
                        {isBn ? 'আমাদের ভেরিফায়েড টেকনিশিয়ান আপনার সুবিধাজনক সময়ে আপনার বাড়িতে পৌঁছে ঠিক করে দেবেন' : 'Our verified technician will visit your doorstep at your preferred schedule'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-3.5">
                  {/* Left: Service name & price */}
                  <div className="sm:col-span-6 space-y-1 text-left">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                      {isBn ? 'আনুমানিক সার্ভিস চার্জ (২০% ছাড় সহ):' : 'Estimated Cost (20% Off):'}
                    </span>

                    {result.suggestedCategoryId === 'home_shifting' || (result.estimatedCostRange.min === 0 && result.estimatedCostRange.max === 0) ? (
                      <div className="py-0.5">
                        <span className="text-base sm:text-lg font-black text-rose-300 bg-rose-950/60 px-3 py-1 rounded-xl border border-rose-500/40 inline-block">
                          {isBn ? 'আলোচনা সাপেক্ষে (কোটেশন)' : 'Custom Quote on Inspection'}
                        </span>
                        <span className="block text-[10px] text-slate-300 mt-1">
                          {isBn ? 'দূরত্ব ও সামগ্রীর পরিমাণের ভিত্তিতে ন্যায্য দর' : 'Fair pricing based on distance & volume'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                          ₹{result.estimatedCostRange.min} - ₹{result.estimatedCostRange.max}
                        </div>
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                          {isBn ? '⚡ ২০% ছাড়' : '⚡ 20% Off'}
                        </span>
                      </div>
                    )}
                    <span className="text-[11px] text-slate-300 block">
                      {isBn ? '✅ কাজ দেখে ও বুঝে সম্পূর্ণ সন্তুষ্ট হলে পেমেন্ট করুন' : '✅ Pay only after 100% satisfaction'}
                    </span>
                  </div>

                  {/* Right: Booking CTA & Instant Contact */}
                  <div className="sm:col-span-6 space-y-2">
                    <button
                      id="top-ai-instant-book-btn"
                      type="button"
                      onClick={handleInstantBook}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-98"
                    >
                      <Wrench className="w-4 h-4 text-slate-950" />
                      <span>{isBn ? '১-ক্লিকে কারিগর বুক করুন (২০% ছাড়ে)' : '1-Click Book Technician (20% Off)'}</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href="tel:9903796410"
                        className="flex-1 py-2 px-2 bg-white/10 hover:bg-white/20 rounded-xl text-slate-200 font-bold flex items-center justify-center gap-1.5 transition-colors text-xs border border-white/10"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>9903796410</span>
                      </a>
                      <a
                        href={`https://wa.me/917318828211?text=${encodeURIComponent(
                          `হ্যালো Fast & Smart Solution, আমার সমস্যা: ${query || (isBn ? result.detectedProblemBn : result.detectedProblemEn)}। সার্ভিস বুক করতে চাই।`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-2 bg-green-600 hover:bg-green-500 rounded-xl text-white font-bold flex items-center justify-center gap-1.5 transition-colors text-xs shadow-md shadow-green-600/20"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
};
