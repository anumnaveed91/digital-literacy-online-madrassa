import React, { useRef } from 'react';
import { Award, Printer, Star, X, CheckCircle } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { BADGES } from '../data';

interface CertificateViewProps {
  profile: UserProfile;
  lang: Language;
  onClose: () => void;
}

export default function CertificateView({ profile, lang, onClose }: CertificateViewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const text = {
    awardTitleEn: 'OFFLINE DIGITAL LITERACY AWARD',
    awardTitleUr: 'ڈیجیٹل خواندگی کا تعلیمی سرٹیفکیٹ',
    certifyEn: 'This award is proudly presented to',
    certifyUr: 'یہ سرٹیفکیٹ نہایت فخر اور خوشی کے ساتھ پیش کیا جاتا ہے بقلم:',
    descEn: 'For outstanding play-based progress, successfully completing interactive challenges in connectivity safeguards, voice browsing safely, and mobile security tools.',
    descUr: 'مختلف اسباق کو مکمل کر کے موبائل چلانے، انٹرنیٹ پر درست معلومات تلاش کرنے، اور پیسے اور پاس ورڈ چوری کرنے والے دھوکے بازوں کی کامیابی سے پہچان کرنے پر۔',
    milestones: lang === 'ur' ? 'حاصل کردہ انعامی بیج:' : 'Milestones Unlocked:',
    congratsMsg: lang === 'ur' ? 'مبارک ہو! آپ بنے پاکستان کے روشن ستارے!' : 'Congratulations! You are officially a Digital Sitarah!',
    dateLabel: lang === 'ur' ? 'تاریخِ اجراء:' : 'Issue Date:',
    signatureLabel: lang === 'ur' ? 'روشن پاکستان کوچ:' : 'Roshni Facilitator:',
    signatureVal: lang === 'ur' ? 'ڈیجیٹل سکول کونسل' : 'Digital Learning Council',
    statusLabel: lang === 'ur' ? 'مستند آف لائن تصدیقی کوڈ:' : 'Offline SECURE validation code:',
    printBtn: lang === 'ur' ? 'سرٹیفکیٹ پرنٹ کریں / تصویر محفوظ کریں' : 'Print / Save Digital Certificate',
    closeBtn: lang === 'ur' ? 'بند کریں' : 'Close'
  };

  const handlePrint = () => {
    window.print();
  };

  const unlockedBadgeDetails = BADGES.filter(b => profile.unlockedBadges.includes(b.id));

  return (
    <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-[32px] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] max-w-3xl w-full p-6 text-slate-800 relative ring-4 ring-amber-400">
        <button
          onClick={onClose}
          id="close-cert"
          className="absolute top-4 right-4 p-2 bg-rose-100 hover:bg-rose-200 border-2 border-slate-900 rounded-full cursor-pointer transition text-slate-900"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Certificate Border Frame */}
        <div 
          ref={certificateRef}
          id="printable-cert-area"
          className="border-4 border-dashed border-amber-500 rounded-2xl p-6 sm:p-10 relative bg-amber-50/70 overflow-hidden"
        >
          {/* Decorative Corner Stars */}
          <div className="absolute top-3 left-3 text-amber-500"><Star className="w-6 h-6 fill-current animate-pulse-soft" /></div>
          <div className="absolute top-3 right-3 text-amber-500"><Star className="w-6 h-6 fill-current animate-pulse-soft" /></div>
          <div className="absolute bottom-3 left-3 text-amber-500"><Star className="w-6 h-6 fill-current" /></div>
          <div className="absolute bottom-3 right-3 text-amber-500"><Star className="w-6 h-6 fill-current" /></div>

          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Award className="w-96 h-96 text-amber-900" />
          </div>

          <div className="text-center relative z-10 font-sans">
            {/* Header Shield */}
            <div className="mx-auto w-20 h-20 bg-amber-400 text-slate-900 flex items-center justify-center rounded-full border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] mb-4 ring-4 ring-amber-100">
              <Award className="w-12 h-12 stroke-[2.2]" />
            </div>

            {/* Titles */}
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-amber-950 leading-none">
              {text.awardTitleEn}
            </h1>
            <h2 className="font-urdu text-xl sm:text-2xl font-black text-amber-900 mt-2 leading-relaxed">
              {text.awardTitleUr}
            </h2>

            <div className="w-32 h-1.5 bg-slate-900 mx-auto my-4 rounded-full" />

            <p className="text-xs sm:text-sm text-slate-600 italic font-bold">{text.certifyEn}</p>
            <p className="text-xs sm:text-sm text-slate-700 font-extrabold mt-1">{text.certifyUr}</p>

            {/* Student's Custom Name */}
            <div className="my-5 px-6 py-2.5 inline-block bg-yellow-205 border-3 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight block">
                {profile.name || (lang === 'ur' ? 'پیارا طالبعلم' : 'Dear Student')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 max-w-xl mx-auto leading-relaxed mt-2 font-bold">
              {lang === 'ur' ? text.descUr : text.descEn}
            </p>

            {/* Score pill */}
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-950 px-4 py-2 rounded-2xl font-black text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)]">
              <CheckCircle className="w-4 h-4 text-emerald-800 stroke-[3]" />
              <span>{profile.points} {lang === 'ur' ? 'پوائنٹس حاصل کیے' : 'Total Points Cleared'}</span>
            </div>

            {/* Badges Display Showcase */}
            <div className="mt-6">
              <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-500 mb-2">{text.milestones}</h4>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {unlockedBadgeDetails.length > 0 ? (
                  unlockedBadgeDetails.map(badge => (
                    <div 
                      key={badge.id}
                      className="bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 hover:scale-105 transition"
                      title={lang === 'ur' ? badge.descriptionUr : badge.descriptionEn}
                    >
                      <span className="text-lg">{badge.icon}</span>
                      <span className="text-[11px] font-black text-slate-900">{lang === 'ur' ? badge.nameUr : badge.nameEn}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-500 font-bold">
                    {lang === 'ur' ? 'ابھی کوئی بیج نایاب نہیں ہوا' : 'No badges completed yet (Keep practicing!)'}
                  </span>
                )}
              </div>
            </div>

            {/* Layout Signatures & Validation */}
            <div className="mt-8 pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">{text.statusLabel}</span>
                <span className="text-[10px] font-mono font-black bg-slate-100 border border-slate-900 px-2 py-0.5 rounded text-slate-905">
                  ROSHNI-OFFLINE-SECURE-{profile.points}-{profile.unlockedBadges.length || 0}-VALID
                </span>
              </div>

              <div className="flex justify-between w-full sm:w-auto gap-8 text-right sm:text-right">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 block">{text.dateLabel}</span>
                  <span className="text-xs font-black text-slate-900 font-sans">2026-05-20</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">{text.signatureLabel}</span>
                  <span className="text-xs font-black text-slate-900 font-sans border-t-2 border-slate-900 pt-0.5 inline-block">
                    {text.signatureVal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action button controls */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={handlePrint}
            id="print-cert-btn"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-3.5 vibrant-button text-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.2]" />
            {text.printBtn}
          </button>
          <button
            onClick={onClose}
            id="close-cert-foot"
            className="sm:flex-none inline-flex items-center justify-center bg-slate-200 hover:bg-slate-300 text-slate-800 font-black px-6 py-3.5 vibrant-button text-sm cursor-pointer"
          >
            {text.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
