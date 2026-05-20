import React, { useState, useEffect } from 'react';
import { 
  Users, Layers, Send, Sparkles, CheckSquare, Plus, MessageSquare, 
  HelpCircle, Trash2, Award, ArrowRight, Share2, Info 
} from 'lucide-react';
import { CommunityChallengeProject, StoryElement, GroupChatMessage, Language } from '../types';
import { playKeySound, playSuccessSound } from '../utils/audio';

interface CommunityChallengeViewProps {
  lang: Language;
  onClose: () => void;
}

const STORAGE_CHALLENGE_KEY = 'roshni_community_challenge_project_v1';

// Available templates representing beautiful interactive activities
const GROUP_PROJECT_TEMPLATES = [
  {
    id: 'village_story',
    titleEn: '🛡️ Our Safe Digital Village Story',
    titleUr: '🛡️ ہماری محفوظ ڈیجیٹل بستی کی کہانی',
    goalEn: 'Co-create a digital textbook story about a village (Roshni Pura) whose kids fought off SMS lottery fraudsters and taught grandparents to type!',
    goalUr: 'مل جل کر ایک دلچسپ کہانی ترتیب دیں جس میں روشن پور کے بچے موبائل فون چالو کر کے جعلی انعامی اسکیم والوں کو پکڑواتے ہیں اور بڑوں کو تعلیم دیتے ہیں۔'
  },
  {
    id: 'phone_infographic',
    titleEn: '📶 Village Cellular Infographic Sheet',
    titleUr: '📶 بستی کا فخر اسمارٹ فون چارٹ',
    goalEn: 'Design an interactive phone basic blueprint chart containing Wifi signal, Bluetooth, Hotspot explanations for community center walls.',
    goalUr: 'مختلف اسباق کا نچوڑ نکال کر وائی فائی اور ضروری بٹنوں کا صحیح کام بتانے والا چارٹ بنائیں جو بستی کے کمپیوٹر کونسل ہال پر لگایا جا سکے۔'
  },
  {
    id: 'finance_poster',
    titleEn: '💸 Easypaisa Safe Guard Poster',
    titleUr: '💸 ایزی پیسہ محفوظ گائیڈ پوسٹر',
    goalEn: 'Design a powerful anti-hack banner instructing never to share secret 5-digit PINs or login OTP password keys with any calls.',
    goalUr: 'گھر کے پیسے محفوظ رکھنے کا معلوماتی چارٹ مل کر تیار کریں تاکہ کوئی بھی دکاندار یا اجنبی فون کر کے خفیہ کوڈ (PIN) نہ چرا سکے۔'
  }
];

export default function CommunityChallengeView({ lang, onClose }: CommunityChallengeViewProps) {
  // Current active project
  const [project, setProject] = useState<CommunityChallengeProject>(() => {
    const saved = localStorage.getItem(STORAGE_CHALLENGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse community challenges:', e);
      }
    }
    
    // Default fallback initial starting project
    return {
      id: 'village_story',
      titleEn: GROUP_PROJECT_TEMPLATES[0].titleEn,
      titleUr: GROUP_PROJECT_TEMPLATES[0].titleUr,
      goalEn: GROUP_PROJECT_TEMPLATES[0].goalEn,
      goalUr: GROUP_PROJECT_TEMPLATES[0].goalUr,
      currentStep: 1, // Start on Step 2 (drafting)
      elements: [
        {
          id: 'elem_1',
          author: 'Zainab (Karachi)',
          textEn: 'Once upon a time in Roshni Pura, Bilal woke up to an SMS saying he won a heavy bike jackpot of Rs 100,000!',
          textUr: 'ایک دفعہ کا ذکر ہے کہ روشن پور نامی بستی میں صبح سویرے بلال کو ایک پیغام ملا جس میں لکھا تھا کہ آپ کا دیسی موٹر سائیکل کا انعام نکلا ہے!',
          type: 'text',
          createdAt: '2 hrs ago'
        },
        {
          id: 'elem_2',
          author: 'Ayesha (Lahore)',
          textEn: 'He immediately checked the sender number. It was a generic personal number, not an official brand!',
          textUr: 'بلال نے سمجھداری دکھاتے ہوئے سب سے پہلے بھیجنے والے کا نمبر دیکھا۔ وہ تو کسی عام شخص کا پرائیویٹ نمبر تھا، کوئی سرکاری کمپنی نہیں تھی۔',
          type: 'text',
          createdAt: '1 hr ago'
        },
        {
          id: 'elem_3',
          author: 'Hamza (Sialkot)',
          stickerEmoji: '🛡️',
          textEn: 'Pinned safety shield emoji coordinates to signify protective alert!',
          textUr: 'ہمزہ نے بستی کو فریب سے بچانے کے لئے حفاظتی ڈھال کا نشان چسپاں کیا!',
          type: 'sticker',
          createdAt: '30 mins ago'
        }
      ],
      chatMessages: [
        {
          id: 'msg_1',
          sender: 'Ayesha (Lahore)',
          avatar: '👩‍🦳',
          text: 'Assalam-o-Alaikum friends! Let\'s finish Step 2 of our story quickly. I will add the next sequence!',
          timestamp: '2 hrs ago'
        },
        {
          id: 'msg_2',
          sender: 'Zainab (Karachi)',
          avatar: '👧',
          text: 'Superb! I have already pinned the initial fake prize details on the notice board.',
          timestamp: '1 hr ago'
        },
        {
          id: 'msg_3',
          sender: 'Hamza (Sialkot)',
          avatar: '👱',
          text: 'I added the Shield sticker! It looks so colorful next to Bilal\'s paragraph.',
          timestamp: '25 mins ago'
        }
      ]
    };
  });

  // Local state for contributor tools
  const [authorName, setAuthorName] = useState('');
  const [typedEn, setTypedEn] = useState('');
  const [typedUr, setTypedUr] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('🛡️');
  const [chatInput, setChatInput] = useState('');
  
  // Storage sync
  useEffect(() => {
    localStorage.setItem(STORAGE_CHALLENGE_KEY, JSON.stringify(project));
  }, [project]);

  const handleSwitchTemplate = (templateId: string) => {
    playKeySound();
    const t = GROUP_PROJECT_TEMPLATES.find(x => x.id === templateId);
    if (!t) return;

    if (window.confirm(lang === 'ur' ? 'کیا آپ نیا گروپ موضوع منتخب کرنا چاہتے ہیں؟ موجودہ ریسرچ کینوس مٹ جائے گا' : 'Switching topic will reset your team board drawings. Do you want to continue?')) {
      const freshProject: CommunityChallengeProject = {
        id: t.id,
        titleEn: t.titleEn,
        titleUr: t.titleUr,
        goalEn: t.goalEn,
        goalUr: t.goalUr,
        currentStep: 0,
        elements: [
          {
            id: 'fresh_1',
            author: 'System Guide',
            textEn: `Group collaboration initialized for "${t.titleEn}". Write details below!`,
            textUr: `گروپ کی اجتماعی سرگرمی برائے "${t.titleUr}" شروع ہو چکی ہے۔`,
            type: 'milestone',
            createdAt: 'Just now'
          }
        ],
        chatMessages: [
          {
            id: 'fresh_chat_1',
            sender: 'Digital Facilitator',
            avatar: '⭐',
            text: lang === 'ur' ? 'کوشش کریں کہ سب طالبعلم مل کر اس پروجیکٹ کو مکمل کریں!' : 'Cooperate with your classmates to build the shared display card!',
            timestamp: 'Now'
          }
        ]
      };
      setProject(freshProject);
    }
  };

  // Add text segment to story element corkboard
  const handleAddTextElement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedEn.trim() && !typedUr.trim()) return;
    playKeySound();

    const contributor = authorName.trim() || (lang === 'ur' ? 'روشن ستارہ' : 'Anonymous Sitarah');
    const newElement: StoryElement = {
      id: `elem_${Date.now()}`,
      author: contributor,
      textEn: typedEn || (lang === 'ur' ? 'No English text provided' : ''),
      textUr: typedUr || (lang === 'ur' ? '' : 'No Urdu translation added'),
      type: 'text',
      createdAt: 'Just now'
    };

    setProject(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));

    // Auto-reply mock feedback to make it asynchronous feel extremely fun!
    triggerSimulationReply(contributor);

    // Reset inputs
    setTypedEn('');
    setTypedUr('');
  };

  // Add Sticker to corkboard
  const handleAddSticker = () => {
    playKeySound();
    const contributor = authorName.trim() || (lang === 'ur' ? 'روشن ستارہ' : 'Anonymous Sitarah');
    const newElement: StoryElement = {
      id: `elem_stk_${Date.now()}`,
      author: contributor,
      stickerEmoji: selectedSticker,
      textEn: `Placed sticker "${selectedSticker}" on group storyboard`,
      textUr: `${contributor} نے گروپ کینوس پر خوبصورت چمکیلا نشان "${selectedSticker}" سجایا!`,
      type: 'sticker',
      createdAt: 'Just now'
    };

    setProject(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };

  // Chat message submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    playKeySound();

    const senderName = authorName.trim() || (lang === 'ur' ? 'پیارا طالبعلم (مستند)' : 'Student User');
    const newChat: GroupChatMessage = {
      id: `chat_${Date.now()}`,
      sender: senderName,
      avatar: '👶',
      text: chatInput,
      timestamp: 'Just now'
    };

    setProject(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newChat]
    }));

    setChatInput('');

    // Trigger instant cute conversational reply
    setTimeout(() => {
      const peerNames = ['Ayesha (Lahore) 👩‍🦳', 'Bilal (Peshawar) 👦', 'Zainab (Karachi) 👧', 'Hamza (Sialkot) 👱'];
      const textReplies = [
        "Incredible suggestion! I am adding a card detailing OTP safety right away to match.",
        "واہ! کیا زبردست بات کہی آپ نے۔ میں بھی اس پوسٹر میں اپنا کارٹون جوڑنے لگا ہوں۔",
        "Yes, let's keep working together so we can advance our goal step to Step 4 (Finalized)!",
        "زبردست! آپ کی تجویز کے مطابق میں نے مائیکرو فون کا فائدہ واجبی الفاظ میں ٹائپ کر دیا ہے۔"
      ];
      
      const pIdx = Math.floor(Math.random() * peerNames.length);
      const rIdx = Math.floor(Math.random() * textReplies.length);

      const systemReply: GroupChatMessage = {
        id: `chat_reply_${Date.now()}`,
        sender: peerNames[pIdx],
        avatar: peerNames[pIdx].includes('Ayesha') ? '👩‍🦳' : peerNames[pIdx].includes('Bilal') ? '👦' : peerNames[pIdx].includes('Zainab') ? '👧' : '👱',
        text: textReplies[rIdx],
        timestamp: 'Just now'
      };

      setProject(p => ({
        ...p,
        chatMessages: [...p.chatMessages, systemReply]
      }));
      playSuccessSound();
    }, 1800);
  };

  // Simulated peer reactions
  const triggerSimulationReply = (usr: string) => {
    setTimeout(() => {
      const feedbackElement: StoryElement = {
        id: `elem_v_reply_${Date.now()}`,
        author: 'Ayesha (Lahore) 👩‍🦳',
        type: 'milestone',
        textEn: `Peer Review: Rated ${usr}'s block high definition! Keep going!`,
        textUr: `عائشہ نے کہا: بہت خوبصورت بات لکھی ہے! کہانی مزید تفریحی بن گئی ہے۔`,
        createdAt: 'Just now'
      };
      setProject(prev => ({
        ...prev,
        elements: [...prev.elements, feedbackElement]
      }));
      playSuccessSound();
    }, 3000);
  };

  // Clear entire corkboard settings
  const handleResetChallenge = () => {
    if (window.confirm(lang === 'ur' ? 'کیا آپ واقعی پورا کینوس صاف کرنا چاہتے ہیں؟' : 'Are you sure you want to reset this group challenge board?')) {
      playKeySound();
      setProject(prev => ({
        ...prev,
        currentStep: 1,
        elements: [
          {
            id: 'elem_init',
            author: 'System Guide',
            textEn: 'Canvas cleared. Add fresh, safe advice cards or creative indicators here!',
            textUr: 'کینوس صاف کر دیا گیا ہے۔ اپنے نئے خیالات، تصاویر اور حفاظتی کوڈ یہاں لکھیں۔',
            type: 'milestone',
            createdAt: 'Just now'
          }
        ]
      }));
    }
  };

  // Group Progress Steps advances
  const handleAdvanceStep = () => {
    playKeySound();
    if (project.currentStep >= 3) {
      // Completed, give congratulations
      playSuccessSound();
      setProject(prev => ({ ...prev, currentStep: 4 }));
      alert(lang === 'ur' ? 'مبارک ہو! آپ کا گروپ چیلنج کامیابی سے مکمل اور پبلش ہو گیا ہے!' : 'Bravo! Your classroom team challenge has been finalized and published to the school network!');
    } else {
      setProject(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const stepsList = [
    { num: 1, titleEn: 'Brainstorm Ideas', titleUr: 'خیالات کا تبادلہ' },
    { num: 2, titleEn: 'Write Core Drafts', titleUr: 'تفصیلی کہانی لکھنا' },
    { num: 3, titleEn: 'Add Design Stickers', titleUr: 'چمکیلے نشان سجانا' },
    { num: 4, titleEn: 'Publish & Graduate', titleUr: 'سرٹیفکیٹ و نمائش' }
  ];

  const stickersRow = ['📶', '🛡️', '⚡', '✅', '🇵🇰', '⭐', '📚', '⌨️', '🔍', '🎁', '🔔', '👑'];

  return (
    <div className="fixed inset-0 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#FFFDF6] rounded-[32px] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] max-w-5xl w-full text-slate-800 overflow-hidden relative">
        
        {/* Top Community Navigation Header bar */}
        <div className="bg-[#4D96FF] border-b-4 border-slate-900 p-5 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-slate-905">
              <Users className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl tracking-tight leading-none text-slate-950">
                {lang === 'ur' ? 'روشن ستارے • گروپ لرننگ چیلنج' : 'Sitaray Cohort • Community Challenge Hub'}
              </h2>
              <p className="text-xs font-bold text-slate-950 mt-1 font-sans">
                {lang === 'ur' ? 'پاکستان کے مختلف مراکز کے طلباء کے ساتھ مل کر اسباق اور ڈرائنگ ترتیب دیں!' : 'Asynchronous coordination playground where kids design digital safeguards together'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 px-4 bg-red-100 hover:bg-red-200 border-2 border-slate-900 rounded-xl cursor-pointer text-slate-950 font-black text-xs h-10 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] transition-all"
          >
            {lang === 'ur' ? 'بند کریں ✕' : 'Close ✕'}
          </button>
        </div>

        {/* Project Switcher Row */}
        <div className="bg-[#FAF7EC] border-b-2 border-slate-900 p-3.5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider font-sans">
            {lang === 'ur' ? 'گروپ کام کا موضوع منتخب کریں:' : 'Select Team Project Canvas:'}
          </span>
          <div className="flex flex-wrap gap-1.5 font-sans">
            {GROUP_PROJECT_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSwitchTemplate(t.id)}
                className={`px-3 py-1.5 text-xs font-black rounded-lg border-2 transition ${
                  project.id === t.id 
                    ? 'bg-amber-400 border-slate-900 text-slate-950 shadow-[1px_1px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {lang === 'ur' ? t.titleUr.split('•')[0] : t.titleEn.split('•')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Shared Progress tracker bar header */}
        <div className="p-5 bg-yellow-50 border-b-2 border-slate-900/10">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#6C5ECF] font-sans">
                {lang === 'ur' ? 'گروپ کی مجموعی پیش رفت' : 'Shared Milestones Tracker'}
              </span>
              <span className="text-xs bg-[#6C5ECF] text-white font-black px-2.5 py-0.5 rounded-full border border-slate-900 shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                {lang === 'ur' ? `مرحلہ ${project.currentStep}/4` : `Step ${project.currentStep}/4`}
              </span>
            </div>

            {/* Visual Step Tracker Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-sans">
              {stepsList.map(step => {
                const isActive = project.currentStep >= step.num;
                const isCurrent = project.currentStep === step.num;
                return (
                  <div key={step.num} className="space-y-1">
                    <div className={`h-3 rounded-full border border-slate-900 transition-all ${
                      isCurrent 
                        ? 'bg-amber-400 animate-pulse' 
                        : isActive 
                          ? 'bg-emerald-400' 
                          : 'bg-white'
                    }`} />
                    <span className={`font-black tracking-tight leading-none block line-clamp-1 truncate ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                      {lang === 'ur' ? step.titleUr : step.titleEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN MULTI-PANEL WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-slate-900">
          
          {/* LEFT 2 COLS: Group Canvas / Story Board Notice board */}
          <div className="lg:col-span-2 p-6 space-y-6 max-h-[480px] overflow-y-auto">
            
            {/* Top Challenge Statement Box */}
            <div className="vibrant-card bg-[#F0FBFF] p-4 relative overflow-hidden">
              <div className="flex gap-2.5 items-start">
                <div className="text-xl shrink-0 mt-0.5">💡</div>
                <div className="space-y-1.5 font-sans">
                  <h4 className="font-display font-black text-sm text-indigo-950">
                    {lang === 'ur' ? project.titleUr : project.titleEn}
                  </h4>
                  <p className="text-xs text-indigo-900 font-bold leading-relaxed leading-snug">
                    {lang === 'ur' ? project.goalUr : project.goalEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive Corkboard/Canvas Showcase */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  📌 {lang === 'ur' ? 'گروپ ڈسپلے کینوس' : 'Interactive Corkboard Canvas'}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {lang === 'ur' ? 'تمام کارڈز آف لائن محفوظ ہیں' : 'All elements cached locally'}
                </span>
              </div>

              {/* Noticeboard Layout Canvas */}
              <div className="bg-[#FAF5E6] border-3 border-slate-900 rounded-[24px] p-5 relative min-h-[300px] shadow-[inset_4px_4px_10px_0_rgba(110,80,30,0.08)] bg-[radial-gradient(#E8DFCA_1.5px,transparent_1.5px)] [background-size:16px_16px]">
                
                <div className="absolute top-2 right-4 text-[10px] font-mono font-black border border-amber-900/20 bg-amber-200/40 text-amber-950 rounded px-1.5 py-0.5">
                  🇵🇰 AL-KHIDMAT SCHOOL HUB
                </div>

                <div className="space-y-4 pt-4">
                  {project.elements.map((el) => {
                    if (el.type === 'milestone') {
                      return (
                        <div key={el.id} className="bg-emerald-100 border border-emerald-400 p-2 px-3 rounded-lg text-[10px] font-sans font-black text-emerald-950 flex items-center gap-1.5">
                          <span>📢</span>
                          <span>{lang === 'ur' ? el.textUr : el.textEn}</span>
                        </div>
                      );
                    }

                    if (el.type === 'sticker') {
                      return (
                        <div 
                          key={el.id}
                          className="bg-amber-100 border-2 border-slate-900 inline-flex items-center gap-2 p-2 px-3 rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:rotate-1 transition-all"
                        >
                          <span className="text-2xl animate-pulse-soft">{el.stickerEmoji}</span>
                          <div>
                            <span className="text-[9px] text-[#6C5ECF] font-black block">{el.author}</span>
                            <span className="text-[9px] font-bold text-slate-700 leading-none">{lang === 'ur' ? el.textUr : el.textEn}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={el.id}
                        className="bg-white border-2 border-slate-900 p-3.5 rounded-[18px] shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:-translate-y-0.5 transition-all relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-300 opacity-20 hover:opacity-40 transition-opacity flex items-center justify-center text-xs pointer-events-none">✨</div>
                        
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] bg-slate-900 text-white font-black px-2 py-0.5 rounded-lg border border-slate-900">
                            👤 {el.author}
                          </span>
                          <span className="text-[9px] font-mono font-black text-slate-400">{el.createdAt}</span>
                        </div>

                        <div className="mt-2.5 space-y-1">
                          {el.textUr && (
                            <p className="font-urdu text-base font-black text-slate-900 leading-relaxed text-right">
                              {el.textUr}
                            </p>
                          )}
                          {el.textEn && (
                            <p className="font-sans text-[11px] font-bold text-slate-600 leading-relaxed">
                              {el.textEn}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Interactive User Input Tools panel */}
            <div className="bg-white p-5 border-3 border-slate-900 rounded-[24px] shadow-[4px_4px_0_grow_rgba(0,0,0,1)] space-y-4">
              
              <div className="grid grid-cols-2 gap-3.5 font-sans">
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                    👤 {lang === 'ur' ? 'اپنا نام درج کریں:' : 'Your Interactive Name:'}
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={lang === 'ur' ? 'مثال: فہد علی' : 'e.g. Fahad Ali (Karachi)'}
                    id="contributor-name-input"
                    className="w-full font-sans font-bold text-xs bg-slate-50 border-2 border-slate-900 focus:border-[#4D96FF] focus:outline-none rounded-xl px-3.5 py-2.5 transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                    ✨ {lang === 'ur' ? 'چمکیلا نشان منتخب کریں:' : 'Choose Digital Sticker:'}
                  </label>
                  <div className="flex gap-1">
                    <select
                      value={selectedSticker}
                      onChange={(e) => setSelectedSticker(e.target.value)}
                      className="flex-1 font-sans font-bold text-xs bg-slate-50 border-2 border-slate-900 focus:border-[#4D96FF] focus:outline-none rounded-xl px-2 py-2.5 transition h-10"
                    >
                      {stickersRow.map(stk => (
                        <option value={stk} key={stk}>{stk} {stk === '📶' ? 'Signal' : stk === '🛡️' ? 'Shield' : stk === '🇵🇰' ? 'Flag' : 'Badge'}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddSticker}
                      className="bg-[#4D96FF] hover:bg-[#3b85ee] text-slate-950 font-black text-xs px-3 rounded-xl border-2 border-slate-900 cursor-pointer shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-px h-10"
                    >
                      {lang === 'ur' ? 'چپکائیں' : 'Pin It'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Story segment form input fields */}
              <form onSubmit={handleAddTextElement} className="space-y-3 font-sans">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider inline-flex items-center gap-1">
                      🇵🇰 {lang === 'ur' ? 'اردو لکھائی شامل کریں:' : 'Add Urdu Sentence:'}
                    </label>
                    <span className="text-[9px] text-[#6C5ECF] font-bold">Recommended for Urdu storytellers</span>
                  </div>
                  <input
                    type="text"
                    value={typedUr}
                    onChange={(e) => setTypedUr(e.target.value)}
                    placeholder={lang === 'ur' ? 'یہاں پاکستان کے کسی قصبے کی روداد لکھیں...' : 'Type Urdu draft lines here...'}
                    className="w-full font-urdu font-black text-[15px] bg-[#FFFDFC] border-2 border-slate-900 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-right transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black text-slate-500 tracking-wider block mb-1">
                    🇬🇧 {lang === 'ur' ? 'انگریزی ترجمہ (اختیاری):' : 'Add English Text (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={typedEn}
                    onChange={(e) => setTypedEn(e.target.value)}
                    placeholder={lang === 'ur' ? 'Translate to english if possible...' : 'Type English explanation/translation here...'}
                    className="w-full font-sans font-bold text-xs bg-[#FFFDFC] border-2 border-slate-900 focus:border-[#4D96FF] focus:outline-none rounded-xl px-3 py-2 transition"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-between">
                  <button
                    type="button"
                    onClick={handleResetChallenge}
                    className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-red-500 cursor-pointer h-10 inline-flex items-center gap-1 hover:bg-slate-50 px-2.5 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {lang === 'ur' ? 'کینوس صاف کریں' : 'Clear Board'}
                  </button>

                  <button
                    type="submit"
                    id="add-canvas-card-btn"
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl border-2 border-slate-900 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-0.5 inline-flex items-center gap-1.5 h-10 justify-center"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    {lang === 'ur' ? 'پروجیکٹ بورڈ پر چپکائیں ➔' : 'Pin to Story Board ➔'}
                  </button>
                </div>
              </form>

            </div>

          </div>

          {/* RIGHT SIDEBAR: Group messenger chat discussion board */}
          <div className="p-5 flex flex-col justify-between max-h-[480px] bg-[#FAF5FF]">
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  {lang === 'ur' ? 'گروپ ڈسکشن روم' : 'Group Study Chat'}
                </span>
                <span className="bg-emerald-100 text-emerald-950 text-[9px] uppercase font-black px-1.5 py-0.5 rounded border border-slate-900">
                  ● ACTIVE
                </span>
              </div>

              {/* Messenger Rows */}
              <div className="space-y-3 font-sans">
                {project.chatMessages.map(msg => (
                  <div key={msg.id} className="text-xs space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm select-none">{msg.avatar}</span>
                      <span className="font-black text-[10px] text-slate-900">{msg.sender}</span>
                      <span className="text-[9px] text-slate-400 font-bold ml-auto">{msg.timestamp}</span>
                    </div>
                    <div className="bg-white border border-slate-900 p-2 rounded-xl rounded-tl-none shadow-[1px_1px_0px_rgba(30,41,59,1)]">
                      <p className="font-medium text-slate-700 leading-snug">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat bottom input box */}
            <form onSubmit={handleChatSubmit} className="pt-2 border-t border-slate-900/10 flex gap-1.5 font-sans">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={lang === 'ur' ? 'مثال: السلام علیکم! میں نے فائنل...' : 'Ask teammate advice...'}
                id="group-chat-input"
                className="flex-1 font-sans text-xs bg-white border-2 border-slate-900 focus:border-[#4D96FF] focus:outline-none rounded-xl px-3 py-2 transition"
              />
              <button
                type="submit"
                id="send-group-chat-btn"
                className="p-2.5 bg-[#6C5ECF] text-white hover:bg-[#5849be] rounded-xl border-2 border-slate-900 cursor-pointer shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] active:translate-y-px"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

        {/* Bottom Facilitator Publish checklist controller bar */}
        <div className="bg-yellow-100 border-t-4 border-slate-900 p-4.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 max-w-xl">
            <div className="text-xl">🎓</div>
            <div className="space-y-0.5 font-sans">
              <p className="text-xs font-black text-slate-900">
                {lang === 'ur' ? 'مدرسِ کونسل کا تصدیقی وال:' : 'Facilitator Classroom Action Checklist:'}
              </p>
              <p className="text-[10px] font-bold text-slate-600 leading-snug">
                {lang === 'ur' ? 'جب تمام ہم جماعت اسباق اور ڈرائنگ چپکا چکیں، تو مشترکہ ڈگری پبلش کرنے کے لئے اگلا مرحلہ آگے بڑھائیں۔' : 'Coordinate milestones step by step. Advancing through Checklist awards certificate highlights!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto font-sans">
            {project.currentStep === 4 ? (
              <div className="bg-emerald-500 text-white border-2 border-slate-100 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <Award className="w-4 h-4" />
                {lang === 'ur' ? 'پروجیکٹ پبلش اور کامیاب!' : 'Published & Shared Completed!'}
              </div>
            ) : (
              <button
                onClick={handleAdvanceStep}
                id="advance-group-step-btn"
                className="w-full md:w-auto bg-[#6C5ECF] hover:bg-[#5547bb] text-white font-black px-5 py-3 rounded-xl border-2 border-slate-900 cursor-pointer shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:translate-y-px active:translate-y-0.5 text-xs flex justify-center items-center gap-1.5"
              >
                <span>{lang === 'ur' ? 'اگلے تعلیمی مرحلے پر جائیں' : 'Advance Collective Step'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
