import React, { useState, useEffect } from 'react';
import { 
  Wifi, Battery, Volume2, Signal, Mic, Bluetooth, Radio, MapPin, 
  Plane, BellOff, Layers, ShieldAlert, CheckCircle2, ChevronUp, ChevronDown, 
  Sparkles, HelpCircle, ArrowLeft, RotateCcw, AlertTriangle, Key, Shield, MessageSquare
} from 'lucide-react';
import { H5PChallenge, Language, Difficulty, MatchPair, Hotspot } from '../types';
import { playSuccessSound, playFailureSound, playKeySound, playUrduVoiceSynth } from '../utils/audio';

interface H5PChallengeRunnerProps {
  challenge: H5PChallenge;
  language: Language;
  onComplete: (gainedPoints: number, badgeId: string | null) => void;
  onQuit: () => void;
}

export default function H5PChallengeRunner({ challenge, language, onComplete, onQuit }: H5PChallengeRunnerProps) {
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(challenge.difficulty);
  const [pointsMultiplier, setPointsMultiplier] = useState<number>(1);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  
  // Game state trackers
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [pointsGained, setPointsGained] = useState<number>(0);

  // Match Game states
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // Matched item IDs
  const [failedMatchLeft, setFailedMatchLeft] = useState<string | null>(null);
  const [failedMatchRight, setFailedMatchRight] = useState<string | null>(null);

  // Spot-the-Scam States
  const [foundHotspots, setFoundHotspots] = useState<string[]>([]);
  const [activeExplainHotspot, setActiveExplainHotspot] = useState<Hotspot | null>(null);

  // Sequence Game States
  const [sequenceItems, setSequenceItems] = useState<any[]>([]);
  const [sequenceChecked, setSequenceChecked] = useState<boolean>(false);
  const [sequenceFeedback, setSequenceFeedback] = useState<{[key: string]: boolean}>({});

  // Typing States
  const [typedString, setTypedString] = useState<string>('');
  const [typingError, setTypingError] = useState<boolean>(false);

  // Difficulty adjustment & dynamic state resets
  useEffect(() => {
    resetGameStates();
    // Adjust multiplier based on difficulty selected
    let multiplier = 1;
    if (currentDifficulty === 'medium') multiplier = 1.25;
    if (currentDifficulty === 'hard') multiplier = 1.5;
    setPointsMultiplier(multiplier);
  }, [challenge, currentDifficulty]);

  const resetGameStates = () => {
    setIsCompleted(false);
    setSelectedLeft(null);
    setMatchedPairs([]);
    setFailedMatchLeft(null);
    setFailedMatchRight(null);
    setFoundHotspots([]);
    setActiveExplainHotspot(null);
    setHintsUsed(0);
    setShowHint(false);
    setTypedString('');
    setTypingError(false);

    // Load matching/sequence configs
    if (challenge.type === 'sequence' && challenge.content.steps) {
      // Shuffle initially
      const items = challenge.content.steps.map(s => ({ ...s }));
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setSequenceItems(shuffled);
      setSequenceChecked(false);
      setSequenceFeedback({});
    }
  };

  // Speaks out loud and aids kids
  const speakHelp = (textEn: string, textUr: string) => {
    playUrduVoiceSynth(textEn, textUr, language);
  };

  // Helper mapping icon keys to Lucide SVG elements
  const renderIcon = (iconName?: string) => {
    const props = { className: 'w-6 h-6 stroke-[2.2]' };
    switch (iconName) {
      case 'Wifi': return <Wifi {...props} />;
      case 'Battery': return <Battery {...props} />;
      case 'Volume2': return <Volume2 {...props} />;
      case 'Signal': return <Signal {...props} />;
      case 'Mic': return <Mic {...props} />;
      case 'Bluetooth': return <Bluetooth {...props} />;
      case 'Radio': return <Radio {...props} />;
      case 'MapPin': return <MapPin {...props} />;
      case 'Plane': return <Plane {...props} />;
      case 'BellOff': return <BellOff {...props} />;
      case 'Layers': return <Layers {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  // ==========================================
  // GAME ENGINE 1: MATCH PAIRS
  // ==========================================
  const handleLeftSelect = (id: string) => {
    if (isCompleted) return;
    playKeySound();
    setSelectedLeft(id);
    setFailedMatchLeft(null);
    setFailedMatchRight(null);
  };

  const handleRightSelect = (rightPairId: string) => {
    if (!selectedLeft || isCompleted) return;
    playKeySound();
    
    // Check if the selected key matches the target
    if (selectedLeft === rightPairId) {
      // Correct Match!
      setMatchedPairs(prev => [...prev, selectedLeft]);
      setSelectedLeft(null);
      
      const totalPairsNeeded = challenge.content.matchPairs?.length || 0;
      if (matchedPairs.length + 1 >= totalPairsNeeded) {
        triggerWin();
      }
    } else {
      // Failed Match
      setFailedMatchLeft(selectedLeft);
      setFailedMatchRight(rightPairId);
      playFailureSound();
      
      // Auto-flash error
      setTimeout(() => {
        setFailedMatchLeft(null);
        setFailedMatchRight(null);
      }, 1000);
    }
  };

  // ==========================================
  // GAME ENGINE 2: SCAM SPOTTER
  // ==========================================
  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isCompleted) return;
    playKeySound();
    
    if (hotspot.isScam) {
      if (!foundHotspots.includes(hotspot.id)) {
        setFoundHotspots(prev => [...prev, hotspot.id]);
      }
      setActiveExplainHotspot(hotspot);
      speakHelp(hotspot.explanationEn, hotspot.explanationUr);

      const scamsCount = challenge.content.hotspots?.filter(h => h.isScam).length || 0;
      if (foundHotspots.length + 1 >= scamsCount) {
        triggerWin();
      }
    } else {
      // Friendly message
      playFailureSound();
      const friendlyExpl = {
        en: "This part is normal. Check the link, sender details or the main request text closely!",
        ur: "یہ حصہ بالکل ٹھیک اور محفوظ ہے۔ پیغام بھیجنے والے کا نمبر، عجیب و غریب لنک یا والٹ کا خفیہ پن کوڈ مانگنے والے جملے پر توجہ دیں!"
      };
      speakHelp(friendlyExpl.en, friendlyExpl.ur);
    }
  };

  // ==========================================
  // GAME ENGINE 3: SEQUENCE BUILDER
  // ==========================================
  const moveSequenceItem = (index: number, direction: 'up' | 'down') => {
    if (isCompleted) return;
    playKeySound();
    const newItems = [...sequenceItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      const temp = newItems[index];
      newItems[index] = newItems[targetIndex];
      newItems[targetIndex] = temp;
      setSequenceItems(newItems);
      setSequenceChecked(false);
    }
  };

  const handleCheckSequence = () => {
    let allCorrect = true;
    const feedback: {[key: string]: boolean} = {};
    
    sequenceItems.forEach((item, index) => {
      const isCorrectSlot = item.correctOrder === index + 1;
      feedback[item.id] = isCorrectSlot;
      if (!isCorrectSlot) {
        allCorrect = false;
      }
    });

    setSequenceFeedback(feedback);
    setSequenceChecked(true);

    if (allCorrect) {
      triggerWin();
    } else {
      playFailureSound();
      speakHelp("Some steps are out of order. Keep trying!", "کچھ مراحل غلط ترتیب میں ہیں۔ دوبارہ کوشش کریں اور عقل آزمائی کریں!");
    }
  };

  // ==========================================
  // GAME ENGINE 4: TYPING SIMULATOR
  // ==========================================
  const handleTypeKey = (char: string) => {
    if (isCompleted) return;
    playKeySound();
    
    const targetWord = challenge.content.wordEn || '';
    const nextCharIndex = typedString.length;
    const expectedChar = targetWord[nextCharIndex];

    if (char.toLowerCase() === expectedChar.toLowerCase()) {
      const newTyped = typedString + expectedChar;
      setTypedString(newTyped);
      setTypingError(false);

      if (newTyped.toLowerCase() === targetWord.toLowerCase()) {
        triggerWin();
      }
    } else {
      setTypingError(true);
      playFailureSound();
      // Speak out phonetics to aid them
      const nextLetterPhonetic = challenge.content.letters?.[nextCharIndex]?.phonetic || '';
      speakHelp(`Press character ${expectedChar}`, `یہ والا حرف دبائیں: ${expectedChar} (${nextLetterPhonetic})`);
    }
  };

  // ==========================================
  // COMMON HELPER TRIGGERS
  // ==========================================
  const triggerWin = () => {
    setIsCompleted(true);
    playSuccessSound();
    
    // Compute points deducting penalty for hints
    const basePts = challenge.pointsReward;
    const score = Math.max(10, Math.round(basePts * pointsMultiplier - (hintsUsed * 10)));
    setPointsGained(score);
    
    const winMsgEn = `Brilliant! Challenged cleared! You scored ${score} points!`;
    const winMsgUr = `سبحان اللہ! سبق مکمل ہو گیا! آپ نے ${score} پوائنٹس کمائے!`;
    speakHelp(winMsgEn, winMsgUr);
  };

  const claimLessonRewards = () => {
    onComplete(pointsGained, challenge.badgeId);
  };

  const getUrduDifficulty = (diff: Difficulty) => {
    if (diff === 'easy') return 'آسان';
    if (diff === 'medium') return 'درمیانہ';
    return 'مشکل';
  };

  // Local static translation bundles
  const labels = {
    backBtn: language === 'ur' ? 'پیچھے جائیں' : 'Back to Lessons',
    difficultyLabel: language === 'ur' ? 'لیول کی ترتیب (آٹو):' : 'Level Setting (Auto):',
    pointsEn: language === 'ur' ? 'انعام:' : 'Max Reward:',
    rewardsClaimBtn: language === 'ur' ? 'میرا تحفہ وصول کریں!' : 'Claim My Rewards Now!',
    badgeUnlockSoon: language === 'ur' ? 'روشن گولڈ بیج حاصل ہو گا:' : 'Unlocks Special Badge:',
    hintQuery: language === 'ur' ? 'جگنو سے مدد لیں (اشارہ)' : 'Ask Jugnoo for a Hint',
    hintDeduction: language === 'ur' ? '(اشارہ استعمال کرنے پر ۱۰ پوائنٹس منہا ہوں گے)' : '(-10 points penalty)',
    hintLabel: language === 'ur' ? 'جگنو کا اشارہ:' : 'Jugnoo’s Clue Hint:',
    matchTitleLeft: language === 'ur' ? 'لوگو / نشان منتخب کریں:' : 'Select Digital Icon:',
    matchTitleRight: language === 'ur' ? 'اس کا اصلی کام تلاش کریں:' : 'Find its Real Function:',
    scamTitle: language === 'ur' ? 'دھوکہ دہی کے مقامات (میسج میں دیکھیں):' : 'Spot the Scam Threats:',
    scamInstruction: language === 'ur' ? 'میسج کے اندر عجیب حصوں کو ہاتھ لگا کر تلاش کریں۔ تمام لال خطرات ڈھونڈیں!' : 'Tap on suspicious text parts in the chat screen below to find scam warning triggers!',
    hospotsLeft: language === 'ur' ? 'باقی خطرات:' : 'Scams Remaining:',
    sequenceTask: language === 'ur' ? 'ترتیب درست کریں (اوپر نیچے کھینچیں):' : 'Sort Steps Correctly:',
    sequenceCheckBtn: language === 'ur' ? 'ترتیب چیک کریں' : 'Check Order Placement',
    typingTitle: language === 'ur' ? 'کی بورڈ پر لکھیں:' : 'Practice Keyboard Typing:',
    typingGoal: language === 'ur' ? 'مندرجہ بالا ڈومین یا جملہ ٹائپ کریں:' : 'Type the key address securely step-by-step:',
    congratsTitle: language === 'ur' ? 'ماشاءاللہ! بہت شاندار!' : 'MubarakHo! Amazing Job!',
    pointsEarnedText: language === 'ur' ? 'آپ نے کامیابی سے حاصل کیے:' : 'You earned a total of:',
    explainThreatLabel: language === 'ur' ? 'اس خطرے کی تفصیل:' : 'Threat Assessment Detail:'
  };

  // Dynamically yield hint based on challenge and difficulty
  const getDynamicHint = () => {
    switch (challenge.category) {
      case 'connectivity':
        return language === 'ur' 
          ? 'تصویروں کی شکل اور ان کے کام کے الفاظ دیکھیں۔ سگنل کے نشان کا تعلق ہمیشہ انٹرنیٹ یا سم کارڈ سے ہوتا ہے!'
          : 'Look at the visual icons. The wave/bars signal always relates to internet SIM cards or wireless antennas!';
      case 'safety':
        return language === 'ur'
          ? 'ایزی پیسہ کا خفیہ پانچ ہندسوں کا کوڈ دنیا کی سب سے خفیہ چیز ہے۔ یہ کبھی بھی کسی میسج یا وائس کال پر نہیں بتایا جاتا!'
          : 'The secret 5-digit bank wallet code is completely confidential. Never tap to paste or forward verification OTP codes!';
      case 'typing':
        const nextCharIndex = typedString.length;
        const targetWord = challenge.content.wordEn || '';
        const expected = targetWord[nextCharIndex];
        const phonetic = challenge.content.letters?.[nextCharIndex]?.phonetic || '';
        return language === 'ur'
          ? `اگلا انگریزی حرف دبائیں: "${expected.toUpperCase()}" جس کی اردو آواز ہے: ${phonetic}.`
          : `Tap key "${expected.toUpperCase()}" corresponding to pronunciation match: ${phonetic}.`;
      case 'search':
        return language === 'ur'
          ? 'سب سے پہلے والدین یا بڑے استاد سے حفاظت کی اجازت لیں۔ اس کے بعد تلاش ایپ کھول کر آواز مائیک پر رکارڈ کریں۔'
          : 'First lock down safety permission with parents or teachers. Then launch search and speak direct to mic command.';
      default:
        return 'No hint available';
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-lg border border-slate-100 p-4 sm:p-6 text-slate-800">
      
      {/* Top Utility Command Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-rose-100 gap-3">
        <button
          onClick={onQuit}
          id="quit-challenge-btn"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold text-sm bg-slate-100 px-3 py-2 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {labels.backBtn}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty indicator displaying Adaptive status */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-800">
            <span>{labels.difficultyLabel}</span>
            <span className="bg-rose-600 text-white px-2 py-0.5 rounded-lg uppercase">
              {currentDifficulty === 'easy' ? 'Easy' : currentDifficulty === 'medium' ? 'Medium' : 'Hard'} 
              ({getUrduDifficulty(currentDifficulty)})
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-extrabold text-amber-800">
            {labels.pointsEn} <span className="text-amber-600">{Math.round(challenge.pointsReward * pointsMultiplier)}</span> Pts
          </div>
        </div>
      </div>

      {/* Main Learning Arena Panel */}
      {!isCompleted ? (
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          
          {/* Left Interaction panel */}
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="font-sans font-black text-2xl text-slate-900 leading-tight">
                {language === 'ur' ? challenge.titleUr : challenge.titleEn}
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                {language === 'ur' ? challenge.descriptionUr : challenge.descriptionEn}
              </p>
              
              <button 
                onClick={() => speakHelp(challenge.descriptionEn, challenge.descriptionUr)}
                className="mt-2 text-xs font-bold bg-amber-100 text-amber-800 rounded-lg px-2.5 py-1 inline-flex items-center gap-1.5 cursor-pointer hover:bg-amber-200"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                {language === 'ur' ? 'آواز سنیں (بولیں)' : 'Read Lesson Out Loud'}
              </button>
            </div>

            {/* ==========================================
                WIDGET RENDERER 1: MATCHING CHALLENGE
                ========================================== */}
            {challenge.type === 'match' && challenge.content.matchPairs && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Column (Icons) */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{labels.matchTitleLeft}</h4>
                    {challenge.content.matchPairs.map((pair) => {
                      const isMatched = matchedPairs.includes(pair.id);
                      const isSelected = selectedLeft === pair.id;
                      const hasFailed = failedMatchLeft === pair.id;

                      return (
                        <button
                          key={pair.id}
                          disabled={isMatched}
                          onClick={() => handleLeftSelect(pair.id)}
                          className={`w-full text-left p-3.5 rounded-2xl border-2 transition flex items-center justify-between text-sm ${
                            isMatched 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60' 
                              : isSelected
                                ? 'bg-amber-100 border-amber-500 text-amber-900 ring-4 ring-amber-100 scale-[1.02]'
                                : hasFailed
                                  ? 'bg-red-50 border-red-500 text-red-800 ring-4 ring-red-100 animate-shake'
                                  : 'bg-white border-slate-200 hover:border-slate-400 text-slate-800 hover:bg-slate-50'
                          } cursor-pointer`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-slate-100 rounded-xl text-slate-700">
                              {renderIcon(pair.leftImage)}
                            </span>
                            <span className="font-bold">
                              {language === 'ur' ? pair.leftTextUr : pair.leftTextEn}
                            </span>
                          </div>
                          {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column (Meaning text, randomized placement via shuffled index mappings) */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{labels.matchTitleRight}</h4>
                    {/* Fixed order of right items but map values to simulate mixing card placements */}
                    {challenge.content.matchPairs.map((pair) => {
                      const isMatched = matchedPairs.includes(pair.id);
                      const isFailedMatch = failedMatchRight === pair.id;

                      return (
                        <button
                          key={`right-${pair.id}`}
                          disabled={isMatched || !selectedLeft}
                          onClick={() => handleRightSelect(pair.id)}
                          className={`w-full text-left p-3.5 h-[58px] flex items-center justify-between rounded-2xl border-2 transition text-sm ${
                            isMatched 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60' 
                              : isFailedMatch
                                ? 'bg-red-50 border-red-500 text-red-800 animate-shake'
                                : !selectedLeft
                                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                                  : 'bg-amber-50/50 border-amber-200 hover:border-amber-400 text-slate-800 cursor-pointer hover:bg-amber-50'
                          }`}
                        >
                          <span className="font-medium">
                            {language === 'ur' ? pair.rightTextUr : pair.rightTextEn}
                          </span>
                          {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                WIDGET RENDERER 2: SCAM SPOTTER (SMS SCREEN MOCKUP)
                ========================================== */}
            {challenge.type === 'scam-spotter' && challenge.content.hotspots && (
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                  
                  {/* Left part: Device mockup container */}
                  <div className="relative bg-slate-900 rounded-[32px] p-3 shadow-inner border-4 border-slate-800 max-w-sm w-full mx-auto">
                    {/* Top speaker slit */}
                    <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
                    
                    {/* Screen card area */}
                    <div className="bg-[#e5ddd5] min-h-[340px] rounded-2xl p-3 relative overflow-hidden flex flex-col justify-between">
                      
                      {/* Fake Chat Sender Bar */}
                      <div className="bg-[#075e54] text-white p-2 rounded-xl flex items-center gap-2 text-xs mb-3 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700">👤</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-[11px]">{language === 'ur' ? challenge.content.screenSenderUr : challenge.content.screenSenderEn}</p>
                          <p className="text-[9px] text-[#25d366] font-bold">● SMS / Mobile Notification</p>
                        </div>
                      </div>

                      {/* Chat text message body containing overlays */}
                      <div className="relative bg-white text-slate-800 p-3 rounded-2xl shadow-sm text-xs leading-relaxed max-w-[90%] mx-auto my-3 select-none flex-1">
                        <div className="whitespace-pre-line font-medium text-[11px] text-slate-800 break-words">
                          {language === 'ur' ? challenge.content.screenBodyUr : challenge.content.screenBodyEn}
                        </div>

                        {/* Interactive hotspot boxes positioned absolutely based on coordinate percentages */}
                        {challenge.content.hotspots.map((hotspot) => {
                          const isFound = foundHotspots.includes(hotspot.id);
                          return (
                            <button
                              key={hotspot.id}
                              onClick={() => handleHotspotClick(hotspot)}
                              style={{
                                left: `${hotspot.x}%`,
                                top: `${hotspot.y}%`,
                                width: `${hotspot.width}%`,
                                height: `${hotspot.height}%`,
                              }}
                              className={`absolute border-2 border-dashed rounded-xl transition ${
                                isFound 
                                  ? 'bg-red-500/20 border-red-500 ring-2 ring-red-300 animate-pulse'
                                  : currentDifficulty === 'easy'
                                    ? 'border-[#075e54]/40 bg-[#075e54]/5 hover:bg-[#075e54]/15'
                                    : 'border-transparent hover:border-[#075e54]/30'
                              } cursor-pointer`}
                              title={hotspot.labelEn}
                            />
                          );
                        })}
                      </div>

                      {/* Fake bottom chat controls */}
                      <div className="bg-[#f0f0f0] border border-slate-300 rounded-full py-1.5 px-3 flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span>💬 {language === 'ur' ? 'یہ جعلی خطرہ ہے؟' : 'Is this fraud scam?'}</span>
                        <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full select-none">
                          {labels.hospotsLeft} {challenge.content.hotspots.filter(h => h.isScam).length - foundHotspots.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right part: Threat assessment details output */}
                  <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-500 mb-2">
                      {labels.scamTitle}
                    </h4>
                    <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">
                      {labels.scamInstruction}
                    </p>

                    {activeExplainHotspot ? (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                          <ShieldAlert className="w-5 h-5 text-rose-600" />
                          <span>{language === 'ur' ? activeExplainHotspot.labelUr : activeExplainHotspot.labelEn}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-normal">{labels.explainThreatLabel}</p>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                          {language === 'ur' ? activeExplainHotspot.explanationUr : activeExplainHotspot.explanationEn}
                        </p>
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 text-xs italic">
                        {language === 'ur' ? 'اس میسج میں موجود خطرات تلاش کرنے کے لئے اسکرین پر دیئے گئے مشتبہ حصوں کو کلک کریں!' : 'Tap on sender number, cash promise, or password buttons to see detail analyses!'}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* ==========================================
                WIDGET RENDERER 3: SEQUENCE BUILDER
                ========================================== */}
            {challenge.type === 'sequence' && (
              <div className="space-y-4">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 mb-3">
                  <span className="text-xs text-emerald-800 font-extrabold bg-emerald-100 px-2 py-1 rounded-lg uppercase tracking-wide mr-2 inline-block">GOAL</span>
                  <span className="text-xs font-bold text-emerald-950">
                    {language === 'ur' ? challenge.content.goalUr : challenge.content.goalEn}
                  </span>
                </div>

                <div className="space-y-2 max-w-xl">
                  {sequenceItems.map((item, idx) => {
                    const isChecked = sequenceChecked;
                    const isCorrect = sequenceFeedback[item.id];

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border-2 transition flex items-center justify-between gap-3 ${
                          isChecked
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                              : 'bg-red-50 border-red-300 text-red-900'
                            : 'bg-white border-slate-200 shadow-sm text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 bg-indigo-100 text-indigo-900 font-bold rounded-lg flex items-center justify-center text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-sm">
                            {language === 'ur' ? item.textUr : item.textEn}
                          </span>
                        </div>

                        {/* Order shifter buttons */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveSequenceItem(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 cursor-pointer"
                          >
                            <ChevronUp className="w-4 h-4 stroke-[3]" />
                          </button>
                          <button
                            onClick={() => moveSequenceItem(idx, 'down')}
                            disabled={idx === sequenceItems.length - 1}
                            className="p-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 cursor-pointer"
                          >
                            <ChevronDown className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCheckSequence}
                    id="chk-seq-btn"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl cursor-pointer active:scale-95 transition text-sm shadow hover:shadow-lg"
                  >
                    {labels.sequenceCheckBtn}
                  </button>
                </div>
              </div>
            )}

            {/* ==========================================
                WIDGET RENDERER 4: KEYBOARD TYPING SIMULATOR
                ========================================== */}
            {challenge.type === 'typing' && challenge.content.wordEn && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-center space-y-4 max-w-lg mx-auto shadow-inner">
                  <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    {labels.typingGoal}
                  </p>
                  
                  {/* Target text box showing typed letters */}
                  <div className="flex justify-center items-center gap-1 overflow-x-auto py-2">
                    {challenge.content.wordEn.split('').map((char, index) => {
                      const isTyped = index < typedString.length;
                      const isNext = index === typedString.length;
                      
                      return (
                        <div
                          key={`char-${index}`}
                          className={`w-10 h-14 rounded-xl flex flex-col justify-between items-center p-1.5 border-2 font-mono transition-all text-sm ${
                            isTyped
                              ? 'bg-emerald-500 border-emerald-600 text-white font-bold scale-95 shadow-none'
                              : isNext
                                ? typingError
                                  ? 'bg-rose-100 border-rose-500 text-rose-800 font-bold scale-105 animate-pulse'
                                    : 'bg-amber-100 border-amber-500 text-amber-900 font-black scale-105 shadow ring-4 ring-amber-100'
                                : 'bg-white border-slate-300 text-slate-400'
                          }`}
                        >
                          <span className="text-xs text-slate-400 font-bold">
                            {challenge.content.letters?.[index]?.phonetic || ''}
                          </span>
                          <span className="text-lg font-bold">{char}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-12 h-1 bg-slate-300 mx-auto rounded-full" />
                  
                  {/* On-screen child-friendly virtual keypad */}
                  <div className="bg-slate-200/60 p-3 rounded-2xl shadow-inner max-w-md mx-auto">
                    <div className="grid grid-cols-5 gap-1.5">
                      {/* Lay out characters needed plus standard letters (0-9, alphabet subset) */}
                      {['a', 'b', 'c', 'd', 'e', 'k', 'm', 'o', 'p', 't', 'u', 'y', '.', '0', '3'].map((keyChar) => {
                        const targetWord = challenge.content.wordEn || '';
                        const nextIndex = typedString.length;
                        const targetChar = targetWord[nextIndex] || '';
                        const isMatchTarget = keyChar.toLowerCase() === targetChar.toLowerCase();

                        return (
                          <button
                            key={`vkey-${keyChar}`}
                            onClick={() => handleTypeKey(keyChar)}
                            className={`p-3.5 rounded-xl text-center font-mono font-bold transition text-xs relative ${
                              isMatchTarget && currentDifficulty === 'easy'
                                ? 'bg-amber-400 hover:bg-amber-500 text-amber-900 shadow-md ring-2 ring-amber-200 scale-105 animate-pulse'
                                : 'bg-white text-slate-800 hover:bg-slate-100 active:scale-95'
                            } cursor-pointer shadow-sm`}
                          >
                            {keyChar}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right helper panel: Jugnoo the Firefly Digital Assistant */}
          <div className="w-full md:w-64 bg-amber-50/80 border border-amber-200 rounded-3xl p-4 mt-4 md:mt-0 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl animate-bounce">💡</span>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-none">Jugnoo the Buddy</h4>
                  <p className="text-[10px] text-amber-800 font-bold">موبائل استاد جگنو</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 border border-amber-200 text-xs text-slate-700 leading-relaxed font-medium">
                {showHint ? (
                  <p className="text-amber-950 font-semibold">{getDynamicHint()}</p>
                ) : (
                  <p className="italic text-slate-500">
                    {language === 'ur' 
                      ? 'السلام علیکم! میں آپ کا ڈیجیٹل گائیڈ ہوں۔ اگر سبق حل کرنے میں پریشانی ہو تو ابھی نیچے والا اشارہ بٹن دبائیں۔'
                      : 'Assalam-o-Alaikum! I am your visual digital tutor. Press the button below if you get stuck during active digital matching!'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/50">
              {currentDifficulty !== 'hard' ? (
                <button
                  onClick={() => {
                    setShowHint(true);
                    setHintsUsed(prev => prev + 1);
                    playKeySound();
                  }}
                  disabled={showHint}
                  id="hint-btn"
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    showHint 
                      ? 'bg-amber-100 text-amber-900 cursor-not-allowed opacity-80' 
                      : 'bg-yellow-400 hover:bg-yellow-500 text-slate-900 cursor-pointer shadow-sm active:scale-95'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  {labels.hintQuery}
                </button>
              ) : (
                <div className="text-[10px] italic text-rose-800 font-bold text-center bg-rose-50 border border-rose-200 p-2 rounded-xl">
                  {language === 'ur'
                    ? 'مشکل لیول امتحان کے مترادف ہے! اس میں جگنو مدد نہیں کرے گا۔ خود ہمت کریں!'
                    : 'Hard exams are unguided! Digital search assist is inactive.'}
                </div>
              )}
              {showHint && (
                <p className="text-[9px] text-amber-700 font-bold text-center mt-1">
                  {labels.hintDeduction}
                </p>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* ==========================================
            GAME ENGINE OUTRO: REWARDS & SUCCESS SCREEN
            ========================================== */
        <div className="mt-8 text-center space-y-6 max-w-lg mx-auto py-6 animate-fadeIn relative">
          
          {/* Virtual confetti background items */}
          <div className="absolute top-0 left-0 w-8 h-8 text-yellow-400 animate-spin text-xl select-none">✨</div>
          <div className="absolute top-10 right-4 w-6 h-6 text-emerald-500 animate-bounce text-xl select-none">🎉</div>
          <div className="absolute bottom-6 left-12 w-8 h-8 text-purple-400 animate-pulse text-lg select-none">⭐</div>

          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-300 text-white rounded-full shadow-2xl scale-110 mb-2 border-4 border-amber-100 animate-bounce">
            <Sparkles className="w-12 h-12 stroke-[2]" />
          </div>

          <div>
            <h3 className="font-sans font-black text-3xl text-amber-900">
              {labels.congratsTitle}
            </h3>
            <p className="text-slate-600 text-sm font-medium mt-1">
              {language === 'ur' ? 'آپ نے آف لائن پڑھائی کا چیلنج کامیابی سے مکمل کر لیا ہے!' : 'Offline skill lesson validation was successful!'}
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 shadow-sm max-w-sm mx-auto space-y-3">
            <span className="text-xs uppercase font-black text-slate-400 block tracking-widest">{labels.pointsEarnedText}</span>
            <div className="text-4xl font-sans font-black text-emerald-600 tracking-tight animate-pulse inline-flex items-center gap-1 justify-center">
              <span>+{pointsGained}</span>
              <span className="text-base text-slate-600 font-extrabold">Points</span>
            </div>
          </div>

          {challenge.badgeId && (
            <div className="bg-gradient-to-r from-amber-400/10 to-orange-400/10 border-2 border-amber-300 rounded-2xl p-4 max-w-sm mx-auto flex items-center gap-3">
              <span className="text-3xl bg-amber-400 p-2.5 rounded-xl shadow-md text-white select-none">🏆</span>
              <div className="text-left">
                <span className="text-[10px] font-black text-amber-800 uppercase block tracking-wider">{labels.badgeUnlockSoon}</span>
                <span className="text-sm font-bold text-slate-900">
                  {language === 'ur' ? 'آنکھ کھولیں (کامیاب)' : 'Award Milestone Pin Unlock!'}
                </span>
              </div>
            </div>
          )}

          <div>
            <button
              onClick={claimLessonRewards}
              id="claim-reward-btn"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-base px-8 py-4 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl active:scale-95 transition"
            >
              {labels.rewardsClaimBtn}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
