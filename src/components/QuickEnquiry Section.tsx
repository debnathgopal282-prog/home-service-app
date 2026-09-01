import React, { useState } from 'react';
import { MessageSquare, Phone, Send, CheckCircle2, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { Language } from '../types';
import { SERVICE_AREAS } from '../data/servicesData';

interface QuickEnquirySectionProps {
  language: Language;
}

export const QuickEnquirySection: React.FC<QuickEnquirySectionProps> = ({ language }) => {
  const isBn = language === 'bn';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState(SERVICE_AREAS[0].nameBn);
  const [serviceNeed, setServiceNeed] = useState('');
  const [targetNumber, setTargetNumber] = useState<'7318828211' | '9903796410'>('7318828211');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendWhatsAppEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setLoading(true);

    // Format the WhatsApp message
    const formattedMessage = `馃敂 *唳ㄠΔ唰佮Θ 唳曕唳膏唳熰Ξ唳距Π 唳呧Θ唰佮Ω唳ㄠ唳о唳� (New Customer Enquiry)* 馃敂
鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
馃懁 *唳椸唳班唳灌唰囙Π 唳ㄠ唳�:* ${name.trim()}
馃摓 *唳唳� 唳ㄠΞ唰嵿Μ唳�:* ${phone.trim()}
馃搷 *唳忇Σ唳距唳�:* ${area}
馃洜锔� *唳唳班唰嬥唳ㄠ唰� 唳曕唳�/唳膏Ξ唳膏唳:* ${serviceNeed.trim() || '唳膏唳о唳班Γ 唳呧Θ唰佮Ω唳ㄠ唳о唳� / General Enquiry'}
馃搮 *唳む唳班唳� 唳� 唳膏Ξ唰�:* ${new Date().toLocaleDateString('bn-BD')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
鈿� Fast & Smart Solution - 唳膏Ξ唳椸唳� 唳Χ唰嵿唳苦Ξ唳唰嵿 唳∴唳班Ω唰嵿唰囙Κ 唳膏唳班唳唳�
馃寪 fastsolution.online`;

    // Save to backend silently as well
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          area,
          serviceNeed: serviceNeed.trim(),
          targetNumber,
          createdAt: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error('Failed to log enquiry to server:', err);
    }

    // Direct WhatsApp Link
    const waUrl = `https://wa.me/91${targetNumber}?text=${encodeURIComponent(formattedMessage)}`;
    
    // Open WhatsApp
    window.open(waUrl, '_blank');
    
    setLoading(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setServiceNeed('');
    setIsSubmitted(false);
  };

  return (
    <section id="quick-enquiry-section" className="py-12 bg-gradient-to-b from-blue-50/70 via-indigo-50/50 to-white w-full max-w-full overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Information */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isBn ? '唳膏Π唳距Ω唳班 唳灌唰熰唳熰Ω唳呧唳唳� 唳呧唳唳侧唳班唳�' : 'Instant WhatsApp Alert'}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black leading-snug">
                  {isBn ? (
                    <>
                      唳唳曕唳ㄠ 唳曕唳溹唳� 唳溹Θ唰嵿Ο <br />
                      <span className="text-amber-300">唳灌唰熰唳熰Ω唳呧唳唳 唳呧Θ唰佮Ω唳ㄠ唳о唳�</span> 唳曕Π唰佮Θ
                    </>
                  ) : (
                    <>
                      Need Quick Help? <br />
                      <span className="text-amber-300">Send WhatsApp Enquiry</span>
                    </>
                  )}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {isBn
                    ? '唳嗋Κ唳ㄠ唳� 唳ㄠ唳� 唳� 唳膏Ξ唳膏唳 唳侧唳栢 唳唳犩唳ㄠイ 唳嗋Ξ唳距Ζ唰囙Π 唳熰唳曕Θ唳苦唰嵿Ο唳距Σ 唳熰唳� 唳む唳曕唳粪Γ唳距 唳灌唰熰唳熰Ω唳呧唳唳 唳膏Ξ唰嵿Κ唰傕Π唰嵿Γ 唳唳Π唳� 唳� 唳栢Π唳氞唳� 唳灌唳膏唳� 唳唰熰 唳嗋Κ唳ㄠ唳� 唳膏唳ム 唳唳椸唳唳� 唳曕Π唳啷�'
                    : 'Submit your enquiry below. Our team receives an instant notification with full details on WhatsApp and calls you within 15 minutes.'}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isBn ? '唳︵唳班唳� 唳唳班 唳曕Σ唳唳唳� 唳� 唳班唳� 唳氞唳班唳� 唳膏唳距唳む' : 'Fast free callback with transparent rate chart'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isBn ? '唳呧Ν唳苦唰嵿 唳� 唳唳班唳唰熰唳� 唳∴唳班Ω唰嵿唰囙Κ 唳熰唳曕Θ唳苦Χ唳苦唳距Θ' : 'Experienced & verified doorstep technician'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{isBn ? '唳膏Μ 唳曕唳溹 唰ㄠЕ% 唳唳侧唳唳� 唳涏唰� 唳ㄠ唳多唳氞唳�' : 'Guaranteed 20% flat discount on all jobs'}</span>
                  </div>
                </div>
              </div>

              {/* Direct Call Helper */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{isBn ? '唳膏Π唳距Ω唳班 唳曕Ε唳� 唳Σ唳む 唳唳� 唳曕Π唰佮Θ:' : 'Direct Phone Call:'}</span>
                  <a href="tel:7318828211" className="font-bold text-amber-300 hover:underline">
                    7318828211
                  </a>
                  <span className="text-slate-500 mx-1.5">/</span>
                  <a href="tel:9903796410" className="font-bold text-emerald-400 hover:underline">
                    9903796410
                  </a>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7 p-6 sm:p-8">
              {isSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900">
                      {isBn ? '唳灌唰熰唳熰Ω唳呧唳唳 唳呧Θ唰佮Ω唳ㄠ唳о唳� 唳唳犩唳ㄠ 唳灌唰囙唰�!' : 'Enquiry Sent to WhatsApp!'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                      {isBn
                        ? `唳嗋Κ唳ㄠ唳� 唳呧Θ唰佮Ω唳ㄠ唳о唳ㄠ唳� 唳唳膏唳む唳班唳� 唳唳膏唳溹唳� 唳撪Θ唳距Π唰囙Π 唳灌唰熰唳熰Ω唳呧唳唳� (${targetNumber})-唳� 唳む唳班 唳曕Π唳� 唳灌唰囙唰囙イ 唳嗋Ξ唳距Ζ唰囙Π 唳唳班Δ唳苦Θ唳苦Η唳� 唳︵唳班唳� 唳班唳唳侧唳� 唳︵唳唳ㄠイ`
                        : `Your enquiry message has been forwarded to owner's WhatsApp (${targetNumber}). We will respond immediately.`}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/91${targetNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{isBn ? '唳灌唰熰唳熰Ω唳呧唳唳� 唳氞唳唳� 唳栢唳侧唳�' : 'Open WhatsApp Chat'}</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl"
                    >
                      {isBn ? '唳ㄠΔ唰佮Θ 唳呧Θ唰佮Ω唳ㄠ唳о唳� 唳曕Π唰佮Θ' : 'Send Another Enquiry'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendWhatsAppEnquiry} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>{isBn ? '唳︵唳班唳� 唳唳Π唳� 唳侧唳栢唳� (唰оЕ 唳膏唳曕唳ㄠ唳�)' : 'Quick Enquiry Form (10 sec)'}</span>
                    </h4>

                    {/* WhatsApp Target Number selector */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500 text-[11px] hidden sm:inline">{isBn ? '唳灌唰熰唳熰Ω唳呧唳唳� 唳ㄠΞ唰嵿Μ唳�:' : 'Target WA:'}</span>
                      <select
                        value={targetNumber}
                        onChange={(e) => setTargetNumber(e.target.value as any)}
                        className="bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="7318828211">7318828211 (Primary)</option>
                        <option value="9903796410">9903796410 (Support)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? '唳嗋Κ唳ㄠ唳� 唳ㄠ唳� *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isBn ? '唳唳Θ: 唳班唳溹唳� 唳︵唳�' : 'e.g. Rajesh Das'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? '唳唳唳囙Σ 唳ㄠΞ唰嵿Μ唳� *' : 'Mobile Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? '唳忇Σ唳距唳� 唳ㄠ唳班唳唳氞Θ 唳曕Π唰佮Θ' : 'Select Area'}
                      </label>
                      <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 font-medium"
                      >
                        {SERVICE_AREAS.map((a) => (
                          <option key={a.id} value={isBn ? a.nameBn : a.nameEn}>
                            {isBn ? a.nameBn : a.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isBn ? '唳曕 唳曕唳� 唳 唳曕 唳膏Ξ唳膏唳?' : 'What service or issue?'}
                      </label>
                      <input
                        type="text"
                        value={serviceNeed}
                        onChange={(e) => setServiceNeed(e.target.value)}
                        placeholder={isBn ? '唳唳Θ: 唳唳唳� 唳樴唳班唰� 唳ㄠ / 唳忇Ω唳� 唳椸唳唳� 唳侧唳� / 唳唳囙Κ 唳侧唳曕唳�' : 'e.g. Fan not spinning / AC gas leak / Tap leak'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:shadow-emerald-200"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/20" />
                    <span>
                      {loading
                        ? (isBn ? '唳唳班Ω唰嵿Δ唰佮Δ 唳灌唰嵿唰�...' : 'Preparing...')
                        : (isBn ? '唳灌唰熰唳熰Ω唳呧唳唳 唳撪Θ唳距Π唳曕 唳ㄠ唳熰唳唳曕唳多Θ 唳唳犩唳� (Send WhatsApp Alert)' : 'Send WhatsApp Alert to Owner')}
                    </span>
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? '唳唳膏唳� 唳唳犩唳ㄠ唳� 唳膏唳ム 唳膏唳ム 唳撪Θ唳距Π唰囙Π 唳唳ㄠ 唳ㄠ唳熰唳唳曕唳多Θ 唳唳佮唰� 唳唳啷�' : 'Instant notification will be delivered to owner鈥檚 phone.'}</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
