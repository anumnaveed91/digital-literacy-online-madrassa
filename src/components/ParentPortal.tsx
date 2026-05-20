import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, ShieldAlert, CheckCircle, Bell, BookOpen, 
  Award, Sparkles, Send, User, ChevronRight, Eye, EyeOff 
} from 'lucide-react';
import { UserProfile, H5PChallenge, GuardianNotification, Language } from '../types';
import { playKeySound, playSuccessSound } from '../utils/audio';

interface ParentPortalProps {
  profile: UserProfile;
  lang: Language;
  allChallenges: H5PChallenge[];
  onAssignChallenge: (challengeId: string | null) => void;
  onClose: () => void;
}

export default function ParentPortal({ 
  profile, 
  lang, 
  allChallenges, 
  onAssignChallenge, 
  onClose 
}: ParentPortalProps) {
  // Passcode authentication state
  const [pin, setPin] = useState('');
  const [savedPin, setSavedPin] = useState(() => {
    return localStorage.getItem('parent_pass_pin') || '1234';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'progress' | 'assign' | 'notifications'>('progress');
  
  // Custom message/advice input from parents to child
  const [guardianMessage, setGuardianMessage] = useState(() => {
    return localStorage.getItem('guardian_motivation_msg') || '';
  });
  const [isSavedMessage, setIsSavedMessage] = useState(false);

  // Success animations
  const [tempSuccess, setTempSuccess] = useState<string | null>(null);

  // Dynamic notification generator based on child's actual progress
  const [notifications, setNotifications] = useState<GuardianNotification[]>([]);

  useEffect(() => {
    // Generate notification stream from actual localStorage state
    const generated: GuardianNotification[] = [
      {
        id: 'init_welcome',
        messageEn: 'Guardian dashboard successfully initialized and secured.',
        messageUr: 'سرپرست کا حفاظتی ڈیش بورڈ کامیابی سے چالو کر دیا گیا ہے۔',
        date: 'Today',
        type: 'recommendation'
      }
    ];

    if (profile.points > 150) {
      generated.push({
        id: 'init_points',
        messageEn: `Outstanding start! ${profile.name} passed 150 total score milestone!`,
        messageUr: `بہترین آغاز! ${profile.name} نے مجموعی طور پر 150 پوائنٹس کا سنگِ میل عبور کیا!`,
        date: 'Just now',
        type: 'streak'
      });
    }

    // Map completed challenges to notifications
    profile.completedChallenges.forEach(id => {
      const ch = allChallenges.find(c => c.id === id);
      if (ch) {
        generated.push({
          id: `notif_comp_${id}`,
          messageEn: `Completed challenge: "${ch.titleEn}" (+${ch.pointsReward} PTS).`,
          messageUr: `سبق کامیابی سے مکمل کیا: "${ch.titleUr}" (+${ch.pointsReward} پوائنٹس)۔`,
          date: 'Completed Offline',
          type: 'lesson'
        });
      }
    });

    // Map unlocked badges
    profile.unlockedBadges.forEach(badgeId => {
      const badgeNames: Record<string, {en: string, ur: string}> = {
        wifi_warrior: { en: 'Wifi Warrior Medal', ur: 'انٹرنیٹ کے ہیرو کا تمغہ' },
        safety_shield: { en: 'Safety Shield Pass', ur: 'حفاظتی ڈھال کی چابی' },
        typing_pro: { en: 'Typing Wizard Badge', ur: 'ٹائپنگ کے استاد کا تاج' },
        search_scholar: { en: 'Search Scholar Crown', ur: 'سرچ سکالر کا اعزاز' },
        streak_3day: { en: 'Super Scholar (3-Day Streak)', ur: 'مسلسل ۳ دن پڑھنے کا تاج' }
      };
      
      const badge = badgeNames[badgeId] || { en: badgeId, ur: badgeId };
      generated.push({
        id: `notif_badge_${badgeId}`,
        messageEn: `Milestone Unlocked! Earned the beautiful "${badge.en}" badge.`,
        messageUr: `نئی کامیابی! فخر سے حاصل کیا: "${badge.ur}" خوبصورت میڈل۔`,
        date: 'Earned Offline',
        type: 'badge'
      });
    });

    setNotifications(generated.reverse());
  }, [profile, allChallenges]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playKeySound();
    if (pin === savedPin) {
      setIsAuthenticated(true);
      setErrorMsg('');
      playSuccessSound();
    } else {
      setErrorMsg(lang === 'ur' ? 'غلط پن کوڈ! دوبارہ کوشش کریں (پہلے سے فکس کوڈ ہے: 1234)' : 'Incorrect PIN! Try again (Default PIN is 1234)');
      setPin('');
    }
  };

  const handleUpdatePin = (newPin: string) => {
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setErrorMsg(lang === 'ur' ? 'پن کوڈ ۴ ہندسوں کا ہونا ضروری ہے' : 'Passcode PIN must be exactly 4 digits');
      return;
    }
    setSavedPin(newPin);
    localStorage.setItem('parent_pass_pin', newPin);
    setTempSuccess(lang === 'ur' ? 'پن کوڈ کامیابی سے تبدیل ہو گیا!' : 'PIN updated successfully!');
    setTimeout(() => setTempSuccess(null), 3000);
  };

  const handleSaveMotivation = () => {
    playKeySound();
    localStorage.setItem('guardian_motivation_msg', guardianMessage);
    setIsSavedMessage(true);
    setTempSuccess(lang === 'ur' ? 'حوصلہ افزائی کا میسج محفوظ کر لیا گیا!' : 'Motivation message saved!');
    setTimeout(() => {
      setIsSavedMessage(false);
      setTempSuccess(null);
    }, 3000);
  };

  const notifyText = {
    gateEn: 'Secure Guardian Guard',
    gateUr: 'والدین اور سرپرستوں کے لیے حفاظتی تالا',
    instructionEn: 'Type your secure 4-digit PIN to access learning telemetry, reports and recommendations. (Default code is: 1234)',
    instructionUr: 'اپنے بچے کا رزلٹ، کھیل میں کارکردگی اور تعلیمی منصوبے دیکھنے کے لیے ۴ ہندسوں کا پن کوڈ لگائیں۔ (پہلے سے متعین کوڈ 1234 ہے)',
    loginBtnEn: 'Unlatch Setup Dashboard ➔',
    loginBtnUr: 'سرپرست کا ڈیش بورڈ کھولیں ➔',
    statsLabelEn: "Child's Interactive Growth",
    statsLabelUr: 'بچے کی مجموعی کارکردگی کا میٹر',
    totalLessonsEn: 'Completed Lessons',
    totalLessonsUr: 'حل شدہ اسباق کی تعداد',
    scorePillEn: 'Total Score',
    scorePillUr: 'حاصل کردہ پوائنٹس',
    streakLabelEn: 'Learning Continuous Streak',
    streakLabelUr: 'مسلسل حاضری کی رفتار',
    completedLabelEn: 'Completed Challenge List',
    completedLabelUr: 'مکمل شدہ امتحانی لسٹ',
    allAvailableEn: 'Classroom Core Challenges',
    allAvailableUr: 'کلاس روم چیلنجز اور ہدایات',
    assignLabelEn: 'Recommend/Assign',
    assignLabelUr: 'سبق تجویز کریں',
    assignedBadgeEn: '★ ASSIGNED BY GUARDIAN',
    assignedBadgeUr: '★ سرپرست کی طرف سے تفویض کردہ',
    completedCheckEn: 'Passed & Validated',
    completedCheckUr: 'کامیابی سے حل شدہ',
    notificationTabEn: 'Parent Reports Feed',
    notificationTabUr: 'تعلیمی نوٹیفیکیشنز',
    motivationLabelEn: "Write a Loving Message to Child's Screen:",
    motivationLabelUr: 'بچے کو جوش دلانے کے لیے اسکرین پر پیارا پیغام لکھیں:',
    placeholderMotivationEn: 'Superb job Bilal! Finish your safe typing homework for a special treat tonight! 🎯',
    placeholderMotivationUr: 'شاباش بلال بیٹا! جلدی سے اپنے آج کے اسباق مکمل کرو تاکہ شام کو گھومنے چلیں۔ 🎯',
    saveMsgBtnEn: 'Pin Message to Kid Homepage',
    saveMsgBtnUr: 'بچے کی اسکرین پر یہ میسج چپکائیں',
    bonusTextEn: 'Child receives 25 bonus Points upon completing your assigned challenge!',
    bonusTextUr: 'سرپرست کا تجویز کردہ سبق حل کرنے پر طالبعلم کو ۲۵ فالتو پوائنٹس ملیں گے!'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#FAF5FF] rounded-[32px] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] max-w-4xl w-full text-slate-900 overflow-hidden relative">
        
        {/* Modal Top Header Bar */}
        <div className="bg-[#B983FF] border-b-4 border-slate-900 p-5 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-900">
              <User className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl tracking-tight leading-none">
                {lang === 'ur' ? 'روشن پاکستان • سرپرست پورٹل' : 'Roshni Pakistan • Parent Guard Portal'}
              </h2>
              <p className="text-xs font-bold text-slate-900/85 mt-0.5 font-sans">
                {lang === 'ur' ? 'بچے کی نگرانی، روزانہ ڈیش بورڈ گائیڈ اور تعلیمی اسباق کی تائید' : 'Telemetry, notifications, and modular learning targets for parents'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 px-3 bg-red-100 hover:bg-red-200 border-2 border-slate-900 rounded-xl cursor-pointer text-slate-950 font-black text-xs h-9 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {lang === 'ur' ? 'بند کریں ✕' : 'Close ✕'}
          </button>
        </div>

        {/* SECURE PIN LOGIN GATE */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-[#FFC55C] border-3 border-slate-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] text-slate-950 animate-bounce">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                {lang === 'ur' ? notifyText.gateUr : notifyText.gateEn}
              </h3>
              <p className="text-xs text-slate-600 font-bold leading-relaxed font-sans">
                {lang === 'ur' ? notifyText.instructionUr : notifyText.instructionEn}
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="relative max-w-xs mx-auto">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="••••"
                  id="guardian-pin-input"
                  className="w-full text-center text-2xl font-mono tracking-widest font-black py-3 px-4 bg-white border-3 border-slate-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {errorMsg && (
                <div className="text-xs text-red-600 font-black flex items-center justify-center gap-1.5 bg-red-50 border-2 border-red-200 p-2 rounded-xl">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                id="parent-unlatch-btn"
                className="w-full max-w-xs bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-6 py-3.5 vibrant-button text-sm cursor-pointer"
              >
                {lang === 'ur' ? notifyText.loginBtnUr : notifyText.loginBtnEn}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED PARENT HUB LAYOUT */
          <div>
            {/* Navigation Tabs Bar inside Dashboard */}
            <div className="bg-[#FAF5FF] border-b-2 border-slate-900 flex px-4 pt-4 gap-2">
              <button
                onClick={() => { playKeySound(); setActiveTab('progress'); }}
                className={`px-4 py-2 text-xs font-black rounded-t-xl border-t-2 border-x-2 border-slate-900 transition-all cursor-pointer ${
                  activeTab === 'progress' 
                    ? 'bg-white text-slate-950 translate-y-0.5 border-b-2 border-b-white py-2.5 z-10' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-50 border-b border-b-slate-900'
                }`}
              >
                📊 {lang === 'ur' ? 'تعلیمی میٹرک' : "Student Analytics"}
              </button>
              <button
                onClick={() => { playKeySound(); setActiveTab('assign'); }}
                className={`px-4 py-2 text-xs font-black rounded-t-xl border-t-2 border-x-2 border-slate-900 transition-all cursor-pointer ${
                  activeTab === 'assign' 
                    ? 'bg-white text-slate-950 translate-y-0.5 border-b-2 border-b-white py-2.5 z-10' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-50 border-b border-b-slate-900'
                }`}
              >
                🎯 {lang === 'ur' ? 'ہوم ورک تفویض کریں' : 'Assign Challenges'}
              </button>
              <button
                onClick={() => { playKeySound(); setActiveTab('notifications'); }}
                className={`px-4 py-2 text-xs font-black rounded-t-xl border-t-2 border-x-2 border-slate-900 transition-all cursor-pointer relative ${
                  activeTab === 'notifications' 
                    ? 'bg-white text-slate-950 translate-y-0.5 border-b-2 border-b-white py-2.5 z-10' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-50 border-b border-b-slate-900'
                }`}
              >
                🔔 {lang === 'ur' ? 'کلاس روم الرٹس' : 'Class Alerts'}
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 border border-slate-900 rounded-full w-4 h-4 flex items-center justify-center text-[8px] text-white font-black">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Dashboard Workspace */}
            <div className="p-6 bg-white max-h-[500px] overflow-y-auto">
              
              {/* Alert Notification Bar */}
              {tempSuccess && (
                <div className="mb-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-950 p-3 rounded-2xl flex items-center gap-2 text-xs font-black animate-slideIn">
                  <CheckCircle className="w-5 h-5 text-emerald-600 stroke-[3]" />
                  <span>{tempSuccess}</span>
                </div>
              )}

              {/* TAB 1: CHILD LEARNING REPORT TRACKER */}
              {activeTab === 'progress' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-amber-50 rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-amber-900 block font-sans">
                        {lang === 'ur' ? notifyText.scorePillUr : notifyText.scorePillEn}
                      </span>
                      <span className="text-3xl font-display font-black text-amber-600 block mt-1">
                        {profile.points} PTS
                      </span>
                    </div>

                    <div className="bg-indigo-50 rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-indigo-900 block font-sans">
                        {lang === 'ur' ? 'طالب علم کا لیول' : "Child's Class Level"}
                      </span>
                      <span className="text-3xl font-display font-black text-indigo-650 block mt-1">
                        LEVEL {profile.level}
                      </span>
                    </div>

                    <div className="bg-rose-50 rounded-2xl p-4 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-rose-900 block font-sans">
                        {lang === 'ur' ? notifyText.streakLabelUr : notifyText.streakLabelEn}
                      </span>
                      <span className="text-3xl font-display font-black text-rose-500 block mt-1">
                        🔥 {profile.streakCount} {lang === 'ur' ? 'دن' : 'Days'}
                      </span>
                    </div>
                  </div>

                  {/* Lovable Guardian message display edit tool */}
                  <div className="bg-purple-50 p-4 border-2 border-slate-900 rounded-[20px] shadow-[4px_4px_0_0_rgba(30,41,59,1)] space-y-3">
                    <label className="text-xs uppercase font-black text-purple-950 block">
                      💬 {lang === 'ur' ? notifyText.motivationLabelUr : notifyText.motivationLabelEn}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={guardianMessage}
                        onChange={(e) => setGuardianMessage(e.target.value)}
                        placeholder={lang === 'ur' ? notifyText.placeholderMotivationUr : notifyText.placeholderMotivationEn}
                        id="guardian-motivation-input"
                        className="flex-1 font-sans font-bold text-slate-800 bg-white border-2 border-slate-900 focus:border-purple-600 focus:outline-none rounded-xl px-4 py-2.5 text-xs transition"
                      />
                      <button
                        onClick={handleSaveMotivation}
                        id="guardian-save-motivation-btn"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-4 py-2.5 rounded-xl border-2 border-slate-900 cursor-pointer shadow-[2px_2px_0_0_rgba(30,41,59,1)] hover:translate-y-px active:translate-y-0.5"
                      >
                        {lang === 'ur' ? 'محفوظ کریں' : 'Stick Message'}
                      </button>
                    </div>
                  </div>

                  {/* Unlocked Badges display */}
                  <div className="border-2 border-slate-900 p-4 rounded-3xl bg-slate-50/50">
                    <h4 className="font-display font-black text-sm text-slate-900 flex items-center gap-1.5 mb-3">
                      🏆 {lang === 'ur' ? 'بچے کے حاصل کردہ میڈلز' : 'Earned Milestones & Medals'}
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {profile.unlockedBadges.length > 0 ? (
                        profile.unlockedBadges.map(badgeId => {
                          const matchingBadge = allChallenges.find(c => c.badgeId === badgeId);
                          const resolvedEn = matchingBadge ? matchingBadge.titleEn : badgeId;
                          const resolvedUr = matchingBadge ? matchingBadge.titleUr : badgeId;
                          return (
                            <div 
                              key={badgeId} 
                              className="bg-yellow-200 text-slate-900 border-2 border-slate-900 px-3 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-[2px_2px_px_rgba(0,0,0,1)]"
                            >
                              <span>⭐</span>
                              <span>{lang === 'ur' ? resolvedUr : resolvedEn}</span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic font-bold">
                          {lang === 'ur' ? 'ابھی تک کوئی میڈل حاصل نہیں ہوا۔' : 'No badges earned yet. Complete challenges to secure some!'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RECOMMEND AND ASSIGN EXAMINATIONS */}
              {activeTab === 'assign' && (
                <div className="space-y-4">
                  <div className="bg-rose-100 border-2 border-slate-900 p-3.5 rounded-2xl text-xs font-bold text-rose-950 flex items-start gap-2 shadow-[2px_2px_0_0_rgba(35,40,60,1)]">
                    <Sparkles className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black">{lang === 'ur' ? notifyText.bonusTextUr : notifyText.bonusTextEn}</p>
                    </div>
                  </div>

                  <div className="space-y-3 font-sans">
                    <h4 className="font-display font-black text-sm text-slate-900">
                      🎯 {lang === 'ur' ? notifyText.allAvailableUr : notifyText.allAvailableEn}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {allChallenges.map((challenge) => {
                        const isCompleted = profile.completedChallenges.includes(challenge.id);
                        const isCurrentlyAssigned = profile.assignedChallengeId === challenge.id;

                        return (
                          <div 
                            key={challenge.id} 
                            className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between gap-3 ${
                              isCurrentlyAssigned 
                                ? 'bg-purple-100 border-purple-800 ring-2 ring-purple-300' 
                                : isCompleted 
                                  ? 'bg-emerald-50 border-slate-900 opacity-80' 
                                  : 'bg-[#F9F9FC] border-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="bg-slate-900 text-white text-[9px] uppercase font-black px-1.5 py-0.5 rounded">
                                  {challenge.category.toUpperCase()}
                                </span>
                                {isCompleted ? (
                                  <span className="bg-emerald-200 border border-slate-900 text-emerald-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                                    {lang === 'ur' ? notifyText.completedCheckUr : notifyText.completedCheckEn}
                                  </span>
                                ) : isCurrentlyAssigned ? (
                                  <span className="bg-purple-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded animate-bounce">
                                    {lang === 'ur' ? notifyText.assignedBadgeUr : notifyText.assignedBadgeEn}
                                  </span>
                                ) : null}
                              </div>

                              <h5 className="font-sans font-black text-xs text-slate-900 truncate">
                                {lang === 'ur' ? challenge.titleUr : challenge.titleEn}
                              </h5>
                              <p className="text-[10px] text-slate-600 font-medium line-clamp-2 leading-relaxed mt-0.5">
                                {lang === 'ur' ? challenge.descriptionUr : challenge.descriptionEn}
                              </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-900/10 pt-2">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                                {challenge.difficulty} • +{challenge.pointsReward} pts
                              </span>

                              {isCompleted ? (
                                <span className="text-[10px] font-black text-emerald-700">✓ Completed</span>
                              ) : isCurrentlyAssigned ? (
                                <button
                                  onClick={() => { playKeySound(); onAssignChallenge(null); }}
                                  className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg cursor-pointer border border-slate-900"
                                >
                                  {lang === 'ur' ? 'تجویز منسوخ کریں' : 'Remove Assignment'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => { 
                                    playKeySound(); 
                                    onAssignChallenge(challenge.id);
                                    setTempSuccess(lang === 'ur' ? 'چیلنج کامیابی سے بچے کی اسکرین پر سجایا گیا!' : 'Challenge assigned to your child!');
                                    setTimeout(() => setTempSuccess(null), 3000);
                                  }}
                                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1.5 rounded-lg cursor-pointer border border-slate-900 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                >
                                  {lang === 'ur' ? 'تجویز کریں ➔' : 'Assign ➔'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EDUCATIONAL NOTIFICATION FEED LOG */}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h4 className="font-display font-black text-sm text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-600 animate-swing" />
                    {lang === 'ur' ? notifyText.notificationTabUr : notifyText.notificationTabEn}
                  </h4>

                  <div className="space-y-2.5 font-sans">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => {
                        const notifColor = 
                          notif.type === 'badge' ? 'bg-amber-50 border-amber-300 text-amber-950' :
                          notif.type === 'lesson' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' :
                          notif.type === 'streak' ? 'bg-rose-50 border-rose-300 text-rose-950' :
                          'bg-indigo-50 border-indigo-300 text-indigo-950';

                        return (
                          <div 
                            key={notif.id} 
                            className={`p-3 rounded-xl border-2 flex items-start gap-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] ${notifColor}`}
                          >
                            <span className="text-base">
                              {notif.type === 'badge' ? '🏆' : notif.type === 'lesson' ? '✅' : notif.type === 'streak' ? '🔥' : '🔔'}
                            </span>
                            <div className="flex-1">
                              <p className="text-xs font-black leading-snug">
                                {lang === 'ur' ? notif.messageUr : notif.messageEn}
                              </p>
                              <span className="text-[9px] opacity-75 font-bold block mt-1">
                                {notif.date}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic font-bold">
                        {lang === 'ur' ? 'ابھی کوئی نوٹیفیکیشن نہیں ملا۔' : 'No logs generated back yet.'}
                      </p>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Guardian footer info settings */}
            <div className="bg-[#FAF5FF] border-t-2 border-slate-900 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block font-sans">
                  {lang === 'ur' ? 'سرپرست حفاظتی اکاؤنٹ پن:' : 'Reset Access Pass PIN:'}
                </span>
                <input
                  type="text"
                  placeholder="New 4-digit numeric PIN"
                  maxLength={4}
                  className="font-mono text-xs font-black w-32 border border-slate-900 rounded bg-white px-2 py-0.5 outline-none focus:ring-1 focus:ring-purple-400 text-center"
                  onChange={(e) => {
                    const cleanVal = e.target.value.replace(/\D/g, '');
                    if (cleanVal.length === 4) {
                      handleUpdatePin(cleanVal);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
              <p className="text-[9px] font-bold text-slate-500 italic max-w-sm text-center sm:text-right font-sans">
                {lang === 'ur' ? 'یہ پورٹل مقامی طور پر مکمل محفوظ ہے۔ کوئی بھی نوٹیفیکیشن انٹرنیٹ کنکشن کا محتاج نہیں۔' : 'Class safety protocols and profile telemetry are stored offline secure.'}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
