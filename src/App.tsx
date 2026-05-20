import React, { useState, useEffect } from 'react';
import { 
  Wifi, Shield, Award, Sparkles, BookOpen, Volume2, HelpCircle, 
  Flame, RefreshCw, Trophy, User, Trash2, HeartHandshake, Eye, CheckCircle,
  Lock, Users
} from 'lucide-react';
import { Language, UserProfile, H5PChallenge, Difficulty } from './types';
import { ALL_CHALLENGES, BADGES, INITIAL_LEADERBOARD } from './data';
import OfflineSyncManager from './components/OfflineSyncManager';
import CertificateView from './components/CertificateView';
import H5PChallengeRunner from './components/H5PChallengeRunner';
import ParentPortal from './components/ParentPortal';
import CommunityChallengeView from './components/CommunityChallengeView';
import { playSuccessSound, playKeySound, playUrduVoiceSynth } from './utils/audio';

const STORAGE_KEY = 'roshni_digital_kids_v1';

export default function App() {
  // Locale State
  const [language, setLanguage] = useState<Language>('ur');
  
  // Profile State with robust defaults for demo engagement
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse offline state:', e);
      }
    }
    return {
      name: 'Bilal Khan',
      avatar: '👦',
      points: 150,
      unlockedBadges: ['wifi_warrior'],
      completedChallenges: ['conn_1_easy'],
      streakCount: 3,
      lastPlayedDate: '2026-05-20',
      level: 1
    };
  });

  // Local Sync state
  const [selectedChallenge, setSelectedChallenge] = useState<H5PChallenge | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showLevelExplainModal, setShowLevelExplainModal] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  // Portals Visibility & Motivation States
  const [showParentPortal, setShowParentPortal] = useState(false);
  const [showCommunityChallenge, setShowCommunityChallenge] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState('');

  useEffect(() => {
    setMotivationMessage(localStorage.getItem('guardian_motivation_msg') || '');
  }, [showParentPortal]);

  // Sync state to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  // Sync parent input field state
  useEffect(() => {
    setNameInput(profile.name);
  }, [profile.name]);

  const speakHeading = (textEn: string, textUr: string) => {
    playUrduVoiceSynth(textEn, textUr, language);
  };

  const handleAvatarChange = (emoji: string) => {
    playKeySound();
    setProfile(prev => ({ ...prev, avatar: emoji }));
  };

  const handleNameChange = (val: string) => {
    setNameInput(val);
    setProfile(prev => ({ ...prev, name: val }));
  };

  // Reset to default settings
  const handleResetStorage = () => {
    if (window.confirm(language === 'ur' ? 'کیا آپ تمام سکورز اور اسباق مٹانا چاہتے ہیں؟' : 'Are you sure you want to clear your local offline savings?')) {
      playKeySound();
      const defaultState = {
        name: 'Bilal Khan',
        avatar: '👦',
        points: 0,
        unlockedBadges: [],
        completedChallenges: [],
        streakCount: 1,
        lastPlayedDate: '2026-05-20',
        level: 1
      };
      setProfile(defaultState);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Handles completion of an interactive H5P module
  const handleChallengeComplete = (gainedPoints: number, badgeId: string | null) => {
    playSuccessSound();
    
    setProfile(prev => {
      // Unlocked badges
      const newBadges = [...prev.unlockedBadges];
      if (badgeId && !newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
      }

      // Add "3-day streak" badge if streak is 3 or more
      if (prev.streakCount >= 3 && !newBadges.includes('streak_3day')) {
        newBadges.push('streak_3day');
      }

      const updatedCompleted = [...prev.completedChallenges];
      if (selectedChallenge && !updatedCompleted.includes(selectedChallenge.id)) {
        updatedCompleted.push(selectedChallenge.id);
      }

      // Check if this was recommended/assigned by parent for a +25 pts bonus!
      const isAssigned = selectedChallenge && prev.assignedChallengeId === selectedChallenge.id;
      const bonusPoints = isAssigned ? 25 : 0;

      // Compute level
      const totalPoints = prev.points + gainedPoints + bonusPoints;
      const computedLevel = Math.max(prev.level, Math.floor(totalPoints / 200) + 1);

      return {
        ...prev,
        points: totalPoints,
        unlockedBadges: newBadges,
        completedChallenges: updatedCompleted,
        level: computedLevel,
        streakCount: prev.streakCount + 1,
        assignedChallengeId: isAssigned ? null : prev.assignedChallengeId // Complete and clear the assignment!
      };
    });

    // Close game runner
    setSelectedChallenge(null);
  };

  // ==========================================
  // ADAPTIVE DIFFICULTY ENGINE
  // ==========================================
  // Resolves the auto-difficulty for a category
  // If the kid has done previous easy lesson of that type, promote to medium, etc.
  const getAdaptiveChallenge = (category: 'connectivity' | 'safety' | 'typing' | 'search') => {
    const categoryCompletedIds = profile.completedChallenges.filter(id => id.startsWith(category === 'connectivity' ? 'conn' : category === 'safety' ? 'safe' : category === 'typing' ? 'type' : 'search'));
    
    // Sort challenges by difficulty level
    const pool = ALL_CHALLENGES.filter(c => c.category === category);
    
    if (categoryCompletedIds.length >= 2) {
      // User passed Easy & Medium -> Give them Hard
      return pool.find(c => c.difficulty === 'hard') || pool[0];
    } else if (categoryCompletedIds.length === 1) {
      // User passed Easy -> Give them Medium
      return pool.find(c => c.difficulty === 'medium') || pool[0];
    } else {
      // Safe Start -> Give Easy
      return pool.find(c => c.difficulty === 'easy') || pool[0];
    }
  };

  const getLeaderboardData = () => {
    // Inject the active user dynamic state directly into comparison database
    let list = [...INITIAL_LEADERBOARD];
    const userIndex = list.findIndex(l => l.name === profile.name || l.isUser);
    
    if (userIndex !== -1) {
      list[userIndex] = {
        name: `${profile.name} (YOU)`,
        points: profile.points,
        avatar: profile.avatar,
        isUser: true
      };
    } else {
      list.push({
        name: `${profile.name || 'Al-Khidmat Center kid'} (YOU)`,
        points: profile.points,
        avatar: profile.avatar,
        isUser: true
      });
    }

    // Sort Descending
    return list.sort((a, b) => b.points - a.points);
  };

  const currentRank = getLeaderboardData().findIndex(x => x.isUser) + 1;

  // Visual translations for central widgets
  const labels = {
    appTitleUr: 'آن لائن مدرسہ برائے ڈیجیٹل خواندگی',
    appTitleEn: 'Digital Literacy Online Madrassa',
    appSubtitle: language === 'ur' ? 'آف لائن تعلیمی مرکز - پاکستان کے روشن ستاروں کے لیے' : 'Offline Learning Portal for Accelerated Learning Cohorts in Pakistan',
    statsLevel: language === 'ur' ? 'طالبِ علم لیول:' : 'Student Level:',
    statsPoints: language === 'ur' ? 'کل پوائنٹس:' : 'Total Points:',
    statsStreak: language === 'ur' ? 'مسلسل پڑھائی:' : 'Daily Streak:',
    statsDays: language === 'ur' ? ' دن' : ' Days',
    avatarSelectionLabel: language === 'ur' ? 'اپنا کارٹون چہرہ منتخب کریں:' : 'Select Your Avatar Character:',
    namePlaceholder: language === 'ur' ? 'اپنا نام درج کریں...' : 'Type your name here...',
    welcomeBuddyMessage: language === 'ur' ? 'خوش آمدید! اپنے بہترین تعلیمی اسباق کا آغاز کریں:' : 'Assalam-o-Alaikum! Choose a play-based topic below to begin learning:',
    lessonConnectivity: language === 'ur' ? '۱. نشانیاں اور کنکشن' : '1. Interface Symbols',
    lessonSafety: language === 'ur' ? '۲. مشتبہ پیغامات و بلاکیج' : '2. Guard Wallet Security',
    lessonTyping: language === 'ur' ? '۳. کی بورڈ پر لکھنا' : '3. Keyboard Spelling',
    lessonSearch: language === 'ur' ? '۴. یوٹیوب سرچ گائیڈ' : '4. Smart Media Looking',
    badgeRackTitle: language === 'ur' ? 'میرے حاصل کردہ انعامی بیج (میڈلز)' : 'My Earned Milestone Badges',
    badgeUnlockEnText: language === 'ur' ? 'سبق حل کر کے بیج سجائیں!' : 'Complete the respective lesson to unlock this badge!',
    certCardTitle: language === 'ur' ? '🎓 تعلیمی سرٹیفکیٹ حاصل کریں' : '🎓 Download Graduation Award',
    certCardDesc: language === 'ur' ? 'جب آپ انٹرنیٹ کے تمام بنیادی اصول سیکھ لیں تو والدین کو دکھانے والا خوبصورت سرٹیفکیٹ یہاں سے پرنٹ کریں۔' : 'Generate your official off-line Sitarah Digital Literacy diploma here.',
    certCardBtn: language === 'ur' ? 'امتحانی سرٹیفکیٹ دیکھیں' : 'View Sitarah Certificate',
    resetLabel: language === 'ur' ? 'پروفائل مٹائیں (نیا اکاؤنٹ)' : 'Reset Offline Account Stats',
    adaptiveInfoEn: language === 'ur' ? 'درجہ بندی تبدیل کریں' : 'Adaptive Difficulty Settings',
    adaptiveStatusText: language === 'ur' ? 'آپ کے گزشتہ اسکور کے مطابق لیول لاک ہے!' : 'Your next challenge auto-adapts according to your last high scores!',
    readAloudBtn: language === 'ur' ? 'پورے کیمپس کو سنائیں' : 'Listen To Urdu Portal Intro'
  };

  const leaderboardLabel = language === 'ur' ? '🏆 تحصیل رینکنگ (کلاس روم)' : '🏆 Local Learning Center Leaderboard';
  const leaderboardSub = language === 'ur' ? 'اپنے ساتھیوں سے صحت مند تعلیمی مقابلہ کریں' : 'Compete playfully with peers across Pakistan centers';

  const assignedChallenge = ALL_CHALLENGES.find(c => c.id === profile.assignedChallengeId);

  return (
    <div className="min-h-screen bg-[#F0FBFF] text-slate-900 font-sans tracking-normal pb-20 select-none">
      
      {/* 1. Main Navigation Header Bar */}
      <nav id="navbar" className="bg-[#6C5ECF] text-white border-b-4 border-slate-900 shadow-[0_4px_0_0_rgba(30,41,59,1)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Titles */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center text-2xl border-3 border-slate-900 shadow-[3px_3px_0_0_rgba(30,41,59,1)] animate-spin-slow">
              ⭐
            </div>
            <div>
              <h1 className="font-display font-black text-xl sm:text-2xl tracking-tight text-white drop-shadow">
                {labels.appTitleUr}
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-200 mt-0.5 font-bold font-sans">
                {labels.appSubtitle}
              </p>
            </div>
          </div>

          {/* Bilingual Language Selection Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => speakHeading("Assalam o Alaikum! Welcome to Digital Learning Portal. Start your practice lessons now and learn phone basics.", "السلام علیکم! ڈیجیٹل روشنی کمپیوٹر تعلیمی مرکز میں خوش آمدید۔ نیچے دیئے گئے عنوانات میں سے کسی ایک کا انتخاب کریں اور بڑھیں!")}
              className="text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0_0_rgba(30,41,59,1)] inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
              {labels.readAloudBtn}
            </button>

            <div className="bg-slate-950 p-1 rounded-2xl border-2 border-slate-900 flex shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <button
                onClick={() => { setLanguage('en'); playKeySound(); }}
                className={`px-3 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${language === 'en' ? 'bg-amber-400 text-slate-950 border-2 border-slate-900' : 'text-slate-200 hover:text-white'}`}
              >
                English
              </button>
              <button
                onClick={() => { setLanguage('ur'); playKeySound(); }}
                className={`px-3 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${language === 'ur' ? 'bg-amber-400 text-slate-950 border-2 border-slate-900' : 'text-slate-200 hover:text-white'}`}
              >
                اردو (Urdu)
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* Main Grid Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-6">

        {/* 2. Top Interactive Indicator - Active Offline Status */}
        <div id="offline-wrapper">
          <OfflineSyncManager 
            lang={language} 
            points={profile.points} 
            completedCount={profile.completedChallenges.length} 
            unlockedBadgeCount={profile.unlockedBadges.length} 
          />
        </div>

        {/* Selected challenge overlay run block */}
        {selectedChallenge ? (
          <div id="learning-play-ground" className="animate-fadeIn">
            <H5PChallengeRunner
              challenge={selectedChallenge}
              language={language}
              onComplete={handleChallengeComplete}
              onQuit={() => { playKeySound(); setSelectedChallenge(null); }}
            />
          </div>
        ) : (
          /* Normal Dashboard Layout */
          <div className="space-y-6 animate-fadeIn">
            
            {/* 2b. Parent & Community Portals Launcher Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              
              {/* Guardian launch card */}
              <button
                onClick={() => { playKeySound(); setShowParentPortal(true); }}
                id="launch-guardian-portal-btn"
                className="flex items-center justify-between p-4 bg-[#B983FF] hover:bg-[#a96eff] border-3 border-slate-900 rounded-[20px] shadow-[4px_4px_0_0_rgba(30,41,59,1)] hover:scale-[1.01] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-left w-full"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white border-2 border-slate-900 rounded-xl text-slate-950 flex items-center justify-center">
                    <Lock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-950 tracking-wider block">
                      {language === 'ur' ? 'والدین اور سرپرستوں کے لیے' : 'FOR PARENTS / GUARDIANS'}
                    </span>
                    <h4 className="font-display font-black text-sm text-slate-950 mt-0.5 leading-none">
                      {language === 'ur' ? 'سرپرست مانیٹر ڈیش بورڈ ➔' : 'View Parent Control Hub ➔'}
                    </h4>
                  </div>
                </div>
                <span className="text-xl">🛡️</span>
              </button>

              {/* Community challenge launch card */}
              <button
                onClick={() => { playKeySound(); setShowCommunityChallenge(true); }}
                id="launch-community-challenge-btn"
                className="flex items-center justify-between p-4 bg-[#4D96FF] hover:bg-[#3987f5] border-3 border-slate-900 rounded-[20px] shadow-[4px_4px_0_0_rgba(30,41,59,1)] hover:scale-[1.01] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-left w-full"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white border-2 border-slate-900 rounded-xl text-slate-950 flex items-center justify-center">
                    <Users className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-950 tracking-wider block">
                      {language === 'ur' ? 'ہم جماعتوں کے ساتھ مل کر سیکھیں' : 'COOPERATIVE GROUP LESSONS'}
                    </span>
                    <h4 className="font-display font-black text-sm text-slate-950 mt-0.5 leading-none">
                      {language === 'ur' ? 'ہم جماعت گروپ لرننگ چیلنج ➔' : 'Classroom Group Challenge ➔'}
                    </h4>
                  </div>
                </div>
                <span className="text-xl">👥</span>
              </button>

            </div>

            {/* Parent Motivation Bubble */}
            {motivationMessage && (
              <div id="guardian-pinned-bubble" className="bg-[#FAF5FF] rounded-[24px] border-3 border-purple-600 shadow-[3px_3px_0_0_rgba(108,94,207,0.15)] p-4 relative overflow-hidden flex items-start gap-3 animate-slideIn">
                <span className="text-2xl">💬</span>
                <div className="font-sans text-left">
                  <span className="text-[9px] uppercase font-black text-purple-600 tracking-wider block leading-none">
                    {language === 'ur' ? 'کلاس روم اسکرین پر والدین کا پیارا پیغام:' : 'Loving Message from Parent Pinned to Your Board:'}
                  </span>
                  <p className="text-xs font-black text-purple-950 italic leading-snug mt-1 inline-block">
                    "{motivationMessage}"
                  </p>
                </div>
              </div>
            )}

            {/* Parent Custom Recommendation banner */}
            {assignedChallenge && !profile.completedChallenges.includes(assignedChallenge.id) && (
              <div id="guardian-homework-banner" className="bg-[#6C5ECF] text-white rounded-[24px] border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(30,41,59,1)] p-5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 animate-slideIn">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-16 h-16 bg-white/10 rounded-full pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10 text-left">
                  <div className="p-2.5 bg-yellow-400 border-2 border-slate-900 text-slate-950 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="text-left font-sans">
                    <span className="bg-yellow-400 text-slate-950 text-[10px] uppercase font-black px-2 py-0.5 rounded-md border border-slate-900 leading-none">
                      {language === 'ur' ? 'والدین کی طرف سے خاص تجویز • ۲۵ پوائنٹس بونس!' : 'Homework Assigned by Parent • +25 PTS Bonus!'}
                    </span>
                    <h4 className="font-display font-black text-base mt-2 text-white leading-tight">
                      {language === 'ur' ? assignedChallenge.titleUr : assignedChallenge.titleEn}
                    </h4>
                    <p className="text-xs text-amber-100 font-medium mt-1 leading-normal">
                      {language === 'ur' ? 'اس سبق کو مکمل کرنے پر ۲۵ فالتو بونس پوائنٹس حاصل کریں!' : 'Complete this adaptive lesson to secure +25 extra bonus points!'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { playKeySound(); setSelectedChallenge(assignedChallenge); }}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black px-5 py-3.5 rounded-xl border-2 border-slate-900 shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)] active:translate-y-0.5 text-xs inline-flex items-center gap-1.5 cursor-pointer relative z-10 shrink-0 select-none font-sans"
                >
                  🚀 {language === 'ur' ? 'ابھی ہوم ورک شروع کریں ➔' : 'Start Homework Now ➔'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* LEFT 2 COLUMNS: Profile Controls and Category Selections Row */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Config Card */}
              <section className="vibrant-card p-6 relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-yellow-50 rounded-full pointer-events-none" />
                
                <h3 className="font-display font-black text-xl text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600 stroke-[2.5]" />
                  {language === 'ur' ? 'طالب علم کا پروفائل' : 'Student Identity Setup'}
                </h3>
                
                <div className="mt-5 flex flex-col sm:flex-row items-center gap-6 relative z-10">
                  {/* Huge avatar viewer */}
                  <div className="relative group">
                    <div className="w-24 h-24 bg-amber-100 text-5xl rounded-full flex items-center justify-center border-3 border-slate-900 shadow-[4px_4px_0_0_rgba(30,41,59,1)] group-hover:scale-105 transition-all">
                      {profile.avatar}
                    </div>
                    <span className="absolute bottom-0 right-0 bg-yellow-400 border-2 border-slate-900 text-slate-950 font-black p-1 rounded-full text-xs shadow">👑</span>
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    <label className="text-xs uppercase font-black text-slate-500 tracking-wider">
                      {labels.avatarSelectionLabel}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['👦', '👧', '👶', '👱', '🐼', '🦁'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleAvatarChange(emoji)}
                          className={`w-10 h-10 text-xl rounded-xl border-2 flex items-center justify-center cursor-pointer transition ${
                            profile.avatar === emoji 
                              ? 'bg-amber-300 border-slate-900 scale-105 shadow-[2px_2px_0_0_rgba(30,41,59,1)]' 
                              : 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder={labels.namePlaceholder}
                        maxLength={22}
                        id="student-name-input"
                        className="w-full max-w-xs font-sans font-black text-slate-800 bg-white hover:bg-slate-50 focus:bg-white border-3 border-slate-900 focus:border-indigo-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm transition shadow-[3px_3px_0_0_rgba(30,41,59,1)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Status stats pills */}
                <div className="mt-6 pt-5 border-t-2 border-slate-900/10 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-emerald-50 rounded-2xl p-2.5 border-2 border-slate-900 shadow-[3px_3px_0_0_rgba(30,41,59,1)]">
                    <span className="text-[10px] uppercase font-black text-slate-500 block tracking-normal">{labels.statsLevel}</span>
                    <span className="text-sm font-display font-black text-slate-900 block">{profile.level}</span>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-2.5 border-2 border-slate-900 shadow-[3px_3px_0_0_rgba(30,41,59,1)]">
                    <span className="text-[10px] uppercase font-black text-slate-500 block tracking-normal">{labels.statsPoints}</span>
                    <span className="text-sm font-display font-black text-amber-600 block">{profile.points} Pts</span>
                  </div>
                  <div className="bg-rose-50 rounded-2xl p-2.5 border-2 border-slate-900 shadow-[3px_3px_0_0_rgba(30,41,59,1)] flex flex-col justify-between items-center">
                    <span className="text-[10px] uppercase font-black text-slate-500 block tracking-normal leading-tight">{labels.statsStreak}</span>
                    <span className="text-sm font-display font-black text-rose-600 flex items-center gap-1 leading-none mt-0.5">
                      <Flame className="w-4 h-4 fill-current text-rose-500 shrink-0" />
                      {profile.streakCount}{labels.statsDays}
                    </span>
                  </div>
                </div>
              </section>

              {/* Learning Trails Gateway selection */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display font-black text-xl text-slate-900">
                      📚 {language === 'ur' ? 'آج کی کلاس (ڈیجیٹل چیلنجز)' : 'Daily Play-Based Challenges'}
                    </h3>
                    <p className="text-xs text-slate-600 font-bold mt-0.5 font-sans">
                      {labels.welcomeBuddyMessage}
                    </p>
                  </div>
                  
                  {/* Adaptive difficulty badge info */}
                  <button 
                    onClick={() => { playKeySound(); setShowLevelExplainModal(!showLevelExplainModal); }}
                    className="self-start sm:self-auto bg-amber-300 hover:bg-amber-400 text-slate-950 border-2 border-slate-900 text-[10px] uppercase font-black tracking-wider px-3.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer shadow-[2px_2px_0_0_rgba(30,41,59,1)] active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    {labels.adaptiveInfoEn}
                  </button>
                </div>

                {/* Level assistant text alert */}
                <div className="bg-indigo-100 border-2 border-slate-900 rounded-2xl p-3 flex items-start gap-2 text-xs text-indigo-950 shadow-[3px_3px_0_0_rgba(30,41,59,1)]">
                  <Sparkles className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <p className="font-black">{labels.adaptiveStatusText}</p>
                </div>

                {/* 4 Core Localized Categories mapped to adaptive levels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans">
                  {[
                    { cat: 'connectivity', title: labels.lessonConnectivity, icon: '⚡', cardStyle: 'vibrant-card-yellow hover:scale-[1.01]', actionColor: 'text-amber-950', descEn: 'Touch screen Basics: learn to decode Wifi, Cellular symbols, Airplane settings!', descUr: 'مختلف اسباق: انٹرنیٹ، وائی فائی اور ضروری بٹنوں کا درست کام سیکھیں۔' },
                    { cat: 'safety', title: labels.lessonSafety, icon: '🛡️', cardStyle: 'vibrant-card-cyan hover:scale-[1.01]', actionColor: 'text-indigo-950', descEn: 'Protection basics: detect Ehsaas cash fraud & Fake message traps!', descUr: 'دھوکہ دہی سے بچاؤ: ایزی پیسہ پاس ورڈ اور انعامی اسکیم کے پیغامات کی پہچان۔' },
                    { cat: 'typing', title: labels.lessonTyping, icon: '⌨️', cardStyle: 'vibrant-card-rose hover:scale-[1.01]', actionColor: 'text-rose-950', descEn: 'Keyboard Training: Type government portal domains with phonetics!', descUr: 'صوتی کی بورڈ: درست ڈیجیٹل ویب سائٹ کے پتے (URLs) ٹائپ کرنا سیکھیں۔' },
                    { cat: 'search', title: labels.lessonSearch, icon: '🔍', cardStyle: 'vibrant-card-emerald hover:scale-[1.01]', actionColor: 'text-emerald-950', descEn: 'Safe browsing: guide safe voice searches for fix guides & DIY classes!', descUr: 'محفوظ سرچنگ: انٹرنیٹ پر تعلیمی پالتو چیزیں تلاش کرنے کے مراحل ترتیب دیں۔' }
                  ].map((item) => {
                    // Resolve active adaptive challenge
                    const resolvedChallenge = getAdaptiveChallenge(item.cat as any);
                    
                    // Determine if any version of this category has been completed
                    const poolIds = ALL_CHALLENGES.filter(c => c.category === item.cat).map(c => c.id);
                    const isCompletedAny = poolIds.some(id => profile.completedChallenges.includes(id));

                    return (
                      <div 
                        key={item.cat}
                        className={`p-5 flex flex-col justify-between cursor-pointer ${item.cardStyle}`}
                        onClick={() => { playKeySound(); setSelectedChallenge(resolvedChallenge); }}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-3xl filter drop-shadow select-none">{item.icon}</span>
                            <div className="flex gap-1.5">
                              {/* Difficulty adaptive tag */}
                              <span className="bg-slate-900 text-white text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-lg border border-slate-900">
                                {resolvedChallenge.difficulty}
                              </span>
                              {isCompletedAny && (
                                <span className="bg-emerald-400 border-2 border-slate-900 text-slate-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg inline-flex items-center gap-0.5 shadow-[1px_1px_0_0_rgba(0,0,0,1)]">
                                  ✓ Cleared
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-display font-black text-lg text-slate-900 tracking-tight leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-800 font-bold mt-1.5 leading-relaxed">
                              {language === 'ur' ? item.descUr : item.descEn}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t-2 border-slate-900/10 flex justify-between items-center bg-white/30 rounded-xl px-2.5 py-1.5 border border-slate-900/5">
                          <span className="text-[10px] font-black uppercase tracking-wide text-slate-600">
                            Reward: +{resolvedChallenge.pointsReward} Pts
                          </span>
                          <span className={`text-xs font-black ${item.actionColor} inline-flex items-center gap-1 hover:translate-x-1 transition-transform`}>
                            {language === 'ur' ? 'جائیں ➔' : 'Start Challenge ➔'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 🎓 Certificate Reveal Banner Card */}
              <section className="bg-gradient-to-r from-teal-400 to-[#4D96FF] border-3 border-slate-900 rounded-3xl p-6 text-slate-950 shadow-[6px_6px_0_0_rgba(30,41,59,1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/20 rounded-full" />
                <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-20 h-20 bg-white/20 rounded-full" />
                
                <div className="relative z-10 space-y-4">
                  <div>
                    <h4 className="font-display font-black text-xl flex items-center gap-2 text-slate-950 leading-none">
                      {labels.certCardTitle}
                    </h4>
                    <p className="text-xs font-black text-slate-900 mt-2 leading-relaxed max-w-lg">
                      {labels.certCardDesc}
                    </p>
                  </div>

                  <button
                    onClick={() => { playKeySound(); setShowCertificate(true); }}
                    id="trigger-cert-diploma"
                    className="bg-slate-950 hover:bg-slate-900 text-white font-black text-xs px-5 py-3.5 vibrant-button inline-flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-amber-300 stroke-[2.5]" />
                    {labels.certCardBtn}
                  </button>
                </div>
              </section>

            </div>

            {/* RIGHT SIDEBAR PANEL: Classroom Leaderboard & Pin Rack */}
            <div className="space-y-6">
              
              {/* Leaderboard Panel Layout */}
              <section className="vibrant-card p-5 bg-white">
                <div className="pb-3 border-b-2 border-slate-900">
                  <h3 className="font-display font-black text-base text-slate-950 leading-none">
                    {leaderboardLabel}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold mt-1.5 font-sans">
                    {leaderboardSub}
                  </p>
                </div>

                <div className="mt-4 space-y-2.5 font-sans">
                  {getLeaderboardData().map((entry, index) => {
                    const rank = index + 1;
                    return (
                      <div 
                        key={`${entry.name}-${index}`}
                        className={`p-3 rounded-2xl flex items-center justify-between text-xs font-bold border-2 transition ${
                          entry.isUser 
                            ? 'bg-amber-300 border-slate-900 text-slate-950 shadow-[2px_2px_0_0_rgba(30,41,59,1)]' 
                            : 'bg-slate-50 border-slate-900 text-slate-900 hover:bg-slate-100 shadow-[1px_1px_0_0_rgba(30,41,59,1)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg font-display font-black flex items-center justify-center text-[10px] border-2 border-slate-900 ${
                            rank === 1 
                              ? 'bg-yellow-400 text-slate-950' 
                              : rank === 2 
                                ? 'bg-slate-350 text-slate-900' 
                                : rank === 3 
                                  ? 'bg-amber-500 text-white' 
                                  : 'bg-white text-slate-500'
                          }`}>
                            #{rank}
                          </span>
                          <span className="text-lg select-none">{entry.avatar}</span>
                          <span className="font-black truncate max-w-[120px]">{entry.name}</span>
                        </div>
                        <span className="font-sans font-black text-slate-950">{entry.points} Pts</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Earned Custom Badges Pin Rack */}
              <section className="vibrant-card p-5 bg-white space-y-4">
                <div>
                  <h3 className="font-display font-black text-base text-slate-950">
                    🏆 {labels.badgeRackTitle}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5 font-sans">
                  {BADGES.map((badge) => {
                    const isUnlocked = profile.unlockedBadges.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`rounded-2xl p-3 border-2 text-center transition-all flex flex-col justify-between items-center gap-2 ${
                          isUnlocked
                            ? 'bg-amber-50 border-slate-900 shadow-[3px_3px_0_0_rgba(30,41,59,1)] scale-100'
                            : 'bg-slate-100 border-slate-300 opacity-60'
                        }`}
                        title={language === 'ur' ? badge.descriptionUr : badge.descriptionEn}
                      >
                        <div className="relative">
                          {isUnlocked ? (
                            <span className="text-3xl select-none animate-pulse-soft block">{badge.icon}</span>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-slate-400 flex items-center justify-center text-slate-500 font-bold text-xs">
                              🔒
                            </div>
                          )}
                        </div>

                        <div>
                          <span className={`text-[10px] font-black block leading-tight ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                            {language === 'ur' ? badge.nameUr : badge.nameEn}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Account Recovery and Cache Clears */}
              <div className="text-center pt-2">
                <button
                  onClick={handleResetStorage}
                  id="reset-storage-btn"
                  className="text-[10px] uppercase font-black tracking-widest text-slate-500 hover:text-red-500 cursor-pointer inline-flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {labels.resetLabel}
                </button>
              </div>

            </div>

          </div>

          </div>
        )}

      </main>

      {/* 3. Adaptive Difficulty Overlay explaining popup */}
      {showLevelExplainModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-amber-50 rounded-[28px] p-6 max-w-sm w-full border-4 border-slate-900 shadow-[6px_6px_0_0_rgba(30,41,59,1)] relative">
            <h4 className="font-display font-black text-lg text-slate-950 flex items-center gap-1.5 leading-none">
              💡 {language === 'ur' ? 'آٹو ایڈاپٹیو لیول سسٹم' : 'Adaptive Learning System'}
            </h4>
            <div className="mt-3 text-xs text-slate-900 leading-relaxed space-y-2 font-bold font-sans">
              <p>
                {language === 'ur' 
                  ? 'ہمارا جدید کمپیوٹر سسٹم طالبعلم کی کارکردگی کو خودکار طریقے سے مانیٹر کرتا ہے۔' 
                  : 'Our classroom prototype monitors pupil milestones automatically.'}
              </p>
              <p>
                {language === 'ur'
                  ? 'جب آپ آسان (Easy) لیول کو کامیابی سے مکمل کریں گے، تو اگلا چیلنج خود بخود درمیانے (Medium) درجے پر فکس ہو جائے گا۔ اسی طرح درمیانے درجے کے بعد آپ کو سب سے انوکھا اور مشکل (Hard) چیلنج دیا جائے گا۔'
                  : 'Every category has 3 built-in adaptive scales: Easy, Medium, and Hard. Scoring high advances the student to next hard tier, unlocking the best medals!'}
              </p>
              <p>
                {language === 'ur'
                  ? 'کوشش کریں کہ کوئی بھی غلط چابی نہ دبائیں۔ جتنا کم اشارے استعمال کریں گے، اتنے زیادہ پوائنٹس حاصل ہوں گے!'
                  : 'Try matching correctly the first time. Using fewer clues secures maximum points!'}
              </p>
            </div>
            <button
              onClick={() => { playKeySound(); setShowLevelExplainModal(false); }}
              id="close-explain-modal-btn"
              className="mt-5 w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-3 rounded-xl border-2 border-slate-900 cursor-pointer shadow-[2px_2px_0_0_rgba(30,41,59,1)] active:translate-y-0.5 active:shadow-none transition-all"
            >
              {language === 'ur' ? 'ٹھیک ہے، سمجھ گیا!' : 'Perfect, I understand!'}
            </button>
          </div>
        </div>
      )}

      {/* 4. Graduation Certificate modal */}
      {showCertificate && (
        <CertificateView
          profile={profile}
          lang={language}
          onClose={() => { playKeySound(); setShowCertificate(false); }}
        />
      )}

      {/* 5. Parent / Guardian Hub Portal Overlay Modal */}
      {showParentPortal && (
        <ParentPortal
          profile={profile}
          lang={language}
          allChallenges={ALL_CHALLENGES}
          onAssignChallenge={(taskId) => {
            setProfile(prev => ({ ...prev, assignedChallengeId: taskId }));
          }}
          onClose={() => { playKeySound(); setShowParentPortal(false); }}
        />
      )}

      {/* 6. Community Group Challenge interactive battle Overlay Modal */}
      {showCommunityChallenge && (
        <CommunityChallengeView
          lang={language}
          onClose={() => { playKeySound(); setShowCommunityChallenge(false); }}
        />
      )}

    </div>
  );
}
