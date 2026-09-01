import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Wrench, 
  Send, 
  HelpCircle,
  Clock,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { Language, AiDiagnosticResult, ServiceCategory, SubService } from '../types';
import { LanguageSwitcher } from './LanguageSwitcher';

interface AiDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onToggleLanguage?: () => void;
  onSetLanguage?: (lang: Language) => void;
  categories: ServiceCategory[];
  onBookFromDiagnosis: (category: ServiceCategory, subService?: SubService, issueText?: string) => void;
}

const COMMON_SYMPTOMS_BN = [
  'বাড়ি বদল ও হোম শিফটিং (প্যাকার্স & মুভার্স হেল্পার)',
  'কিচেন চিমনির তেলকালি পরিষ্কার ও সাকশন কমে যাওয়া',
  'ফ্রিজে বরফ জমছে কিন্তু নিচে ঠান্ডা হচ্ছে না',
  'সিলিং ফ্যানের স্পিড কমে গেছে ও গোঁ গোঁ শব্দ করছে',
  'জলের কল দিয়ে অবিরাম জল চুইয়ে পড়ছে',
  'স্মার্ট টিভির আওয়াজ আছে কিন্তু ডিসপ্লে পুরো কালো',
  'মাইক্রোওয়েভ ওভেনে খাবার গরম হচ্ছে না ও স্পার্ক করছে',
  'ঘরের মেইন সুইচের MCB বারবার ট্রিপ করে লাইন কাটছে',
  'দরজার তালা জ্যাম হয়ে গেছে, চাবি ঢুকছে না'
];

const COMMON_SYMPTOMS_EN = [
  'House relocation & home shifting (Packers & Movers)',
  'Kitchen chimney grease buildup & low suction service',
  'Fridge freezing on top but not cooling at bottom',
  'Ceiling fan running very slow with humming noise',
  'Continuous water leakage from tap / pipeline',
  'Smart TV has sound but black screen / no picture',
  'Microwave not heating food and sparking',
  'Main MCB tripping repeatedly with light cut',
  'Door lock jammed and key not turning'
];

export const AiDiagnosticModal: React.FC<AiDiagnosticModalProps> = ({
  isOpen,
  onClose,
  language,
  onToggleLanguage,
  onSetLanguage,
  categories,
  onBookFromDiagnosis,
}) => {
  const isBn = language === 'bn';

  const [problemText, setProblemText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<AiDiagnosticResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDiagnose = async (textToUse?: string) => {
    const queryText = (textToUse || problemText).trim();
    if (!queryText) {
      setErrorMsg(isBn ? 'দয়া করে সমস্যার বিবরণ লিখুন।' : 'Please describe the problem.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setDiagnosticResult(null);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemText: queryText,
          language: language,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isBn ? 'ডায়াগনস্টিক সম্পন্ন হয়নি।' : 'Diagnosis could not be completed.'));
      }

      setDiagnosticResult(data.diagnosis);
    } catch (err: any) {
      setErrorMsg(err.message || (isBn ? 'সমস্যা শনাক্ত করতে সমস্যা হয়েছে।' : 'Failed to diagnose issue.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuickChip = (chip: string) => {
    setProblemText(chip);
    handleDiagnose(chip);
  };

  const handleProceedToBooking = () => {
    if (!diagnosticResult) return;

    // Find category
    let matchedCat = categories.find((c) => c.id === diagnosticResult.suggestedCategoryId);
    if (!matchedCat) matchedCat = categories[0];

    // Find subservice or first
    const matchedSub = matchedCat.subServices[0];

    onClose();
    onBookFromDiagnosis(matchedCat, matchedSub, problemText || (isBn ? diagnosticResult.detectedProblemBn : diagnosticResult.detectedProblemEn));
  };

  const commonList = isBn ? COMMON_SYMPTOMS_BN : COMMON_SYMPTOMS_EN;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                <span>{isBn ? 'AI স্মার্ট সমস্যা নির্ণায়ক' : 'AI Problem Diagnostic'}</span>
                <span className="text-[10px] bg-amber-400 text-purple-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Fast & Smart AI
                </span>
              </h3>
              <p className="text-xs text-purple-100 font-medium">
                {isBn
                  ? 'আপনার ঘরের যেকোনো সমস্যার কথা লিখুন, তাৎক্ষণিক কারণ ও খরচ জানুন'
                  : 'Describe any appliance problem to get instant diagnosis & cost estimate'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleLanguage && (
              <LanguageSwitcher
                language={language}
                onToggleLanguage={onToggleLanguage}
                onSetLanguage={onSetLanguage}
                variant="pill"
                className="bg-white/20 border-white/30 text-white"
              />
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Safety Disclaimer Banner */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-extrabold text-amber-800">
                {isBn ? '⚠️ বিশেষ সতর্কতা: ' : '⚠️ Important Notice: '}
              </span>
              <span className="font-semibold text-slate-800">
                {isBn
                  ? 'এটি কেবল সাধারণ তথ্যের জন্য। জটিল বা ইলেকট্রিক কাজের ক্ষেত্রে নিজে চেষ্টা না করে পেশাদার টেকনিশিয়ানের সাহায্য নিন।'
                  : 'This is for general informational purposes only. For complex or electrical tasks, seek assistance from a professional technician.'}
              </span>
            </div>
          </div>

          {/* Quick Problem Suggestions */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>{isBn ? 'সাধারণ সমস্যার উদাহরণ (ক্লিক করে পরীক্ষা করুন):' : 'Common Issues (Click to test):'}</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {commonList.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuickChip(chip)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 border border-slate-200 transition-all text-slate-700 text-left cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* User Input Form */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {isBn ? 'অথবা আপনার নিজের ভাষায় সমস্যা লিখুন:' : 'Or describe your specific issue:'}
            </label>
            <div className="relative">
              <textarea
                id="ai-diagnostic-problem-input"
                rows={3}
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                placeholder={
                  isBn
                    ? 'যেমন: আমার ফ্রিজের নিচে জল জমছে এবং এসি চালানোর পর ঘরের আলো কাঁপছে...'
                    : 'e.g. Water is leaking under fridge and lights flicker when AC starts...'
                }
                className="w-full p-3 pr-12 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
              />
              <button
                id="ai-diagnose-submit-btn"
                type="button"
                disabled={isLoading}
                onClick={() => handleDiagnose()}
                className="absolute right-2.5 bottom-3 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8 space-y-3 bg-purple-50/50 rounded-xl border border-purple-100">
              <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-purple-900">
                {isBn ? 'AI সমস্যা এবং সঠিক টেকনিক্যাল কারণ বিশ্লেষণ করছে...' : 'AI is analyzing symptoms & estimating repair costs...'}
              </p>
              <p className="text-[11px] text-purple-600">
                {isBn ? 'কাঁচরাপাড়া ও কল্যাণীর সার্ভিস রেট ও সেফটি রুলস চেক করা হচ্ছে...' : 'Checking Kanchrapara & Kalyani rates and safety guidelines...'}
              </p>
            </div>
          )}

          {/* Result Card */}
          {diagnosticResult && !isLoading && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {diagnosticResult.isRelevantService === false ? (
                /* Domain Guardrail Alert: Out-of-scope query */
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>
                      {isBn
                        ? 'শুধুমাত্র Fast & Smart Solution হোম সার্ভিস ও মেরামত সহায়তা'
                        : 'Fast & Smart Solution Home Services Only'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {isBn ? diagnosticResult.detectedProblemBn : diagnosticResult.detectedProblemEn}
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs space-y-1.5 text-slate-700">
                    <span className="font-bold text-slate-900 block">
                      {isBn ? '💡 আপনি যেসব বিষয়ে প্রশ্ন করতে পারেন:' : '💡 Valid topics you can ask about:'}
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                      <li>{isBn ? 'সিলিং ফ্যান, লাইট, ওয়্যারিং ও MCB ট্রিপিং সমস্যা' : 'Ceiling fan, lighting, wiring & MCB tripping'}</li>
                      <li>{isBn ? 'এসি কুলিং, গ্যাস রিফিল ও ফোম ওয়াশ সার্ভিস' : 'AC cooling issues, gas leak & foam jet cleaning'}</li>
                      <li>{isBn ? 'ফ্রিজে বরফ জমা বা নিচের চেম্বার ঠান্ডা না হওয়া' : 'Refrigerator freezing or bottom section not cooling'}</li>
                      <li>{isBn ? 'জলের পাইপলাইন লিক, ট্যাপ ও গিজার মেরামত' : 'Plumbing leakage, tap replacement & geyser repair'}</li>
                      <li>{isBn ? 'টিভি, মাইক্রোওয়েভ, মিক্সার ও ইন্ডাকশন মেরামত' : 'Smart TV, microwave oven, mixer & induction repair'}</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProblemText('');
                      setDiagnosticResult(null);
                    }}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                  >
                    {isBn ? '🔄 গৃহস্থালি যন্ত্রের সমস্যা দিয়ে পুনরায় চেষ্টা করুন' : '🔄 Try again with a home repair issue'}
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 space-y-3">
                  {/* Mandatory Safety Disclaimer at the start of AI Response */}
                  <div className="p-2.5 bg-amber-100/90 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-extrabold text-amber-900">
                        {isBn ? '⚠️ ডিসক্লেমার: ' : '⚠️ Disclaimer: '}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {isBn
                          ? 'এটি কেবল সাধারণ তথ্যের জন্য। জটিল বা ইলেকট্রিক কাজের ক্ষেত্রে নিজে চেষ্টা না করে পেশাদার টেকনিশিয়ানের সাহায্য নিন।'
                          : 'This is for general informational purposes only. For complex or electrical work, do not attempt self-repair; please seek assistance from a professional technician.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wider">
                        {isBn ? 'শনাক্তকৃত সমস্যা' : 'Diagnosis Result'}
                      </span>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      diagnosticResult.urgencyLevel === 'critical' || diagnosticResult.urgencyLevel === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {diagnosticResult.urgencyLevel === 'critical' ? (isBn ? 'জরুরি মেরামত' : 'Critical') : (isBn ? 'সাধারণ মেরামত' : 'Standard')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-800">
                      {isBn ? diagnosticResult.detectedProblemBn : diagnosticResult.detectedProblemEn}
                    </p>

                    {/* Analyzed Root Causes */}
                    {((isBn ? diagnosticResult.analyzedRootCausesBn : diagnosticResult.analyzedRootCausesEn) || []).length > 0 && (
                      <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 space-y-1.5">
                        <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-purple-700" />
                          {isBn ? 'AI-বিশ্লেষিত সম্ভাব্য মূল কারণসমূহ:' : 'AI-Analyzed Probable Root Causes:'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1">
                          {(isBn ? diagnosticResult.analyzedRootCausesBn : diagnosticResult.analyzedRootCausesEn)?.map((cause, idx) => (
                            <div key={idx} className="bg-white/80 border border-purple-100 rounded-lg p-1.5 text-xs text-purple-900 flex items-start gap-1.5">
                              <span className="text-purple-600 font-bold">•</span>
                              <span className="font-medium">{cause}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Diagnostic Checks */}
                    {((isBn ? diagnosticResult.quickDiagnosticChecksBn : diagnosticResult.quickDiagnosticChecksEn) || []).length > 0 && (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-1.5">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          {isBn ? 'তাৎক্ষণিক পর্যবেক্ষণ ও চেকিং পয়েন্ট:' : 'Quick Diagnostic Verification Checks:'}
                        </span>
                        <div className="space-y-1 pl-1">
                          {(isBn ? diagnosticResult.quickDiagnosticChecksBn : diagnosticResult.quickDiagnosticChecksEn)?.map((check, idx) => (
                            <div key={idx} className="bg-white/80 border border-emerald-100 rounded-lg p-1.5 text-xs text-emerald-900 flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">🔍</span>
                              <span>{check}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 1: DIY Troubleshooting Steps */}
                  {((isBn ? diagnosticResult.diyStepsBn : diagnosticResult.diyStepsEn) || []).length > 0 && (
                    <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                          <Wrench className="w-4 h-4 text-amber-700" />
                          {isBn ? '🛠️ ধাপ ১: AI-প্রস্তাবিত নিজে ঠিক করার সমাধান ধাপসমূহ (DIY গাইড):' : '🛠️ Step 1: AI-Synthesized DIY Solutions (DIY Guide):'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(isBn ? diagnosticResult.diyEstimatedTimeBn : diagnosticResult.diyEstimatedTimeEn) && (
                            <span className="text-[10px] bg-amber-100 border border-amber-300 text-amber-900 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>{isBn ? diagnosticResult.diyEstimatedTimeBn : diagnosticResult.diyEstimatedTimeEn}</span>
                            </span>
                          )}
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                            {isBn ? 'ঘরোয়া সমাধান' : 'Self Fix'}
                          </span>
                        </div>
                      </div>

                      {/* Required Tools */}
                      {((isBn ? diagnosticResult.requiredToolsBn : diagnosticResult.requiredToolsEn) || []).length > 0 && (
                        <div className="bg-white/80 border border-amber-200 rounded-lg p-2 flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="text-amber-900 font-bold text-[11px] flex items-center gap-1">
                            <Wrench className="w-3 h-3 text-amber-700" />
                            {isBn ? 'প্রয়োজনীয় সরঞ্জাম:' : 'Tools Required:'}
                          </span>
                          {(isBn ? diagnosticResult.requiredToolsBn : diagnosticResult.requiredToolsEn)?.map((tool, idx) => (
                            <span key={idx} className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium">
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1.5 pl-1">
                        {(isBn ? diagnosticResult.diyStepsBn : diagnosticResult.diyStepsEn)?.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-amber-950 bg-white/80 p-2 rounded-lg border border-amber-200">
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="font-medium leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>

                      {/* DIY Warning */}
                      {(isBn ? diagnosticResult.diyWarningBn : diagnosticResult.diyWarningEn) && (
                        <p className="text-[11px] text-amber-800 font-bold flex items-center gap-1 pt-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{isBn ? diagnosticResult.diyWarningBn : diagnosticResult.diyWarningEn}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Safety Precautions */}
                  {diagnosticResult.safetyTipsBn && diagnosticResult.safetyTipsBn.length > 0 && (
                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 space-y-1.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-slate-600" />
                        {isBn ? 'জরুরি ঘরোয়া সতর্কতা:' : 'Immediate Safety Precautions:'}
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 font-medium pl-1">
                        {(isBn ? diagnosticResult.safetyTipsBn : diagnosticResult.safetyTipsEn).map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Step 2: Professional Technician Service & Cost */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2">
                    <span className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                      <span>{isBn ? '🛠️ ধাপ ২: নিজে সমাধান না হলে — প্রফেশনাল কারিগর ও খরচ:' : '🛠️ Step 2: If Not Resolved — Professional Booking & Cost:'}</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-2xs">
                        <span className="text-[11px] text-slate-500 font-semibold block">
                          {isBn ? 'প্রস্তাবিত সার্ভিস:' : 'Recommended Service:'}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-blue-700 flex items-center gap-1 mt-0.5">
                          <Wrench className="w-3.5 h-3.5" />
                          {isBn ? diagnosticResult.recommendedSubServiceBn : diagnosticResult.recommendedSubServiceEn}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-blue-150 shadow-2xs">
                        <span className="text-[11px] text-slate-500 font-semibold block">
                          {isBn ? 'আনুমানিক মেরামত/সার্ভিস চার্জ:' : 'Estimated Service Charges:'}
                        </span>
                        <span className="text-sm sm:text-base font-black text-emerald-600 mt-0.5 block">
                          {diagnosticResult.estimatedCostRange.min === 0 && diagnosticResult.estimatedCostRange.max === 0
                            ? (isBn ? 'আলোচনা সাপেক্ষে (কোটেশন)' : 'Custom Quote on Inspection')
                            : `₹${diagnosticResult.estimatedCostRange.min} - ₹${diagnosticResult.estimatedCostRange.max}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Book from Diagnosis CTA & Direct WhatsApp Enquiry */}
                  <div className="pt-2 space-y-2">
                    <button
                      id="book-from-ai-diagnosis-btn"
                      type="button"
                      onClick={handleProceedToBooking}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>{isBn ? 'নিজে না হলে কারিগর বুক করুন (২০% ছাড়ে)' : 'Book Technician for this Issue (20% Off)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://wa.me/917318828211?text=${encodeURIComponent(
                        `🔔 *AI ডায়াগনস্টিক রিপোর্ট ও অনুসন্ধান (Fast & Smart Solution)* 🔔\n──────────────────────────\n🛠️ *সমস্যা:* ${problemText.trim()}\n🔍 *AI শনাক্তকরণ:* ${isBn ? diagnosticResult.detectedProblemBn : diagnosticResult.detectedProblemEn}\n⚙️ *প্রস্তাবিত সার্ভিস:* ${isBn ? diagnosticResult.recommendedSubServiceBn : diagnosticResult.recommendedSubServiceEn}\n💰 *খরচ রেঞ্জ:* ₹${diagnosticResult.estimatedCostRange.min} - ₹${diagnosticResult.estimatedCostRange.max}\n──────────────────────────\nদয়া করে আমাকে এই কাজের জন্য হেল্প করুন।`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{isBn ? '📲 এই রিপোর্টটি হোয়াটসঅ্যাপে ওনারকে পাঠান (7318828211)' : '📲 Send AI Report to Owner via WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
