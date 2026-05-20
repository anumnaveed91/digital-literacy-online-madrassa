import { H5PChallenge, Badge, LeaderboardEntry } from './types';

export const BADGES: Badge[] = [
  {
    id: 'wifi_warrior',
    nameEn: 'Wifi Warrior',
    nameUr: 'انٹرنیٹ کے ہیرو',
    descriptionEn: 'Learned how to identify Wifi, Battery, and critical phone icons!',
    descriptionUr: 'موبائل اور انٹرنیٹ کی بنیادی نشانیوں کی پہچان سیکھی!',
    icon: '⚡',
    colorClass: 'from-amber-400 to-orange-500'
  },
  {
    id: 'safety_shield',
    nameEn: 'Safety Shield',
    nameUr: 'حفاظتی ڈھال',
    descriptionEn: 'Successfully detected SMS and mobile financial fraud scams!',
    descriptionUr: 'جعلی پیغامات اور انعامات کے نام پر دھوکہ دہی کی پہچان کی!',
    icon: '🛡️',
    colorClass: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'typing_pro',
    nameEn: 'Typing Wizard',
    nameUr: 'ٹائپنگ کے استاد',
    descriptionEn: 'Typed digital key phrases and local mobile shortcuts!',
    descriptionUr: 'موبائل کی بورڈ پر لکھنا اور بٹنوں کی پہچان سیکھی!',
    icon: '⌨️',
    colorClass: 'from-purple-500 to-pink-500'
  },
  {
    id: 'search_scholar',
    nameEn: 'Search Scholar',
    nameUr: 'سرچ سکالر',
    descriptionEn: 'Mastered the steps to voice search and learn new skills safely!',
    descriptionUr: 'انٹرنیٹ پر اپنی پسند کے سبق ڈھونڈنا اور تلاش کرنا سیکھا!',
    icon: '🔍',
    colorClass: 'from-emerald-400 to-teal-600'
  },
  {
    id: 'streak_3day',
    nameEn: 'Super Scholar (3-Day Streak)',
    nameUr: 'مسلسل پڑھائی کا تاج',
    descriptionEn: 'Showed up for 3 days in a row to learn digital skills!',
    descriptionUr: 'لگاتار ۳ دن تک پڑھائی کرنے پر حوصلہ افزائی کا خاص تاج!',
    icon: '👑',
    colorClass: 'from-red-500 to-yellow-500'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Ayesha (Lahore)', points: 430, avatar: '👩‍🦳' },
  { name: 'Bilal (Peshawar)', points: 380, avatar: '👦' },
  { name: 'Zainab (Karachi)', points: 350, avatar: '👧' },
  { name: 'Imran (Multan)', points: 290, avatar: '👶' },
  { name: 'Fatima (Quetta)', points: 250, avatar: '👩' },
  { name: 'Hamza (Sialkot)', points: 190, avatar: '👱' }
];

export const ALL_CHALLENGES: H5PChallenge[] = [
  // ==========================================
  // 1. CONNECTIVITY CHALLENGES (EASY / MEDIUM / HARD)
  // ==========================================
  {
    id: 'conn_1_easy',
    category: 'connectivity',
    titleEn: 'Connect to the Web (Guided)',
    titleUr: 'انٹرنیٹ کی نشانیاں (آسان)',
    descriptionEn: 'Learn to match basic digital life icons to their meanings.',
    descriptionUr: 'موبائل اور انٹرنیٹ کی بنیادی تصویروں کو ان کے کام سے جوڑیں۔',
    type: 'match',
    difficulty: 'easy',
    pointsReward: 50,
    badgeId: 'wifi_warrior',
    content: {
      matchPairs: [
        { id: 'wi_1', leftTextEn: 'Wifi', leftTextUr: 'وائی فائی', rightTextEn: 'Connect to internet', rightTextUr: 'انٹرنیٹ سے جوڑنے کے لیے', leftImage: 'Wifi' },
        { id: 'wi_2', leftTextEn: 'Battery', leftTextUr: 'بیٹری چارجنگ', rightTextEn: 'Shows energy left', rightTextUr: 'موبائل پاور اور چارجنگ', leftImage: 'Battery' },
        { id: 'wi_3', leftTextEn: 'Volume', leftTextUr: 'آواز کم یا زیادہ', rightTextEn: 'Controls speaker', rightTextUr: 'موبائل کی آواز کے لیے', leftImage: 'Volume2' }
      ]
    }
  },
  {
    id: 'conn_1_medium',
    category: 'connectivity',
    titleEn: 'Digital Control Board',
    titleUr: 'ڈیجیٹل کنٹرول بورڈ (درمیانہ)',
    descriptionEn: 'Identify key mobile utilities including voice command signals.',
    descriptionUr: 'موبائل کی اہم سیٹنگز اور نشانیاں پہچانیں۔',
    type: 'match',
    difficulty: 'medium',
    pointsReward: 100,
    badgeId: 'wifi_warrior',
    content: {
      matchPairs: [
        { id: 'wm_1', leftTextEn: 'Wifi', leftTextUr: 'وائی فائی', rightTextEn: 'Wireless internet', rightTextUr: 'انٹرنیٹ سے تکیہ جوڑنا', leftImage: 'Wifi' },
        { id: 'wm_2', leftTextEn: 'Mobile Data', leftTextUr: 'موبائل ڈیٹا', rightTextEn: 'Internet from SIM card', rightTextUr: 'سم کارڈ کا انٹرنیٹ', leftImage: 'Signal' },
        { id: 'wm_3', leftTextEn: 'Microphone', leftTextUr: 'مائیکرو فون', rightTextEn: 'Listen to my voice', rightTextUr: 'میری آواز سننے کے لیے', leftImage: 'Mic' },
        { id: 'wm_4', leftTextEn: 'Bluetooth', leftTextUr: 'بلوٹوتھ', rightTextEn: 'Connect other wireless devices', rightTextUr: 'دوسری چیزیں بغیر تار کے جوڑنا', leftImage: 'Bluetooth' }
      ]
    }
  },
  {
    id: 'conn_1_hard',
    category: 'connectivity',
    titleEn: 'Digital Expert Matcher',
    titleUr: 'حقیقی موبائل ماسٹر (مشکل)',
    descriptionEn: 'Match advanced settings icons with no tutorial support.',
    descriptionUr: 'بغیر کسی مدد کے موبائل کے نایاب اور مشکل بٹنوں کا صحیح کام تلاش کریں۔',
    type: 'match',
    difficulty: 'hard',
    pointsReward: 150,
    badgeId: 'wifi_warrior',
    content: {
      matchPairs: [
        { id: 'wh_1', leftTextEn: 'Hotspot', leftTextUr: 'ہاٹ اسپاٹ', rightTextEn: 'Share internet with friends', rightTextUr: 'اپنا انٹرنیٹ دوسروں کو دینا', leftImage: 'Radio' },
        { id: 'wh_2', leftTextEn: 'Location', leftTextUr: 'لوکیشن (مقام)', rightTextEn: 'Help maps find where I am', rightTextUr: 'نقشے پر جگہ ڈھونڈنے میں مدد', leftImage: 'MapPin' },
        { id: 'wh_3', leftTextEn: 'Airplane Mode', leftTextUr: 'فلائٹ موڈ', rightTextEn: 'Turn off all signals instantly', rightTextUr: 'تمام سگنلز فوراً بند کرنا', leftImage: 'Plane' },
        { id: 'wh_4', leftTextEn: 'Do Not Disturb', leftTextUr: 'سائلنٹ (خاموش)', rightTextEn: 'Silence phone completely', rightTextUr: 'فون کو بالکل خاموش رکھنا', leftImage: 'BellOff' },
        { id: 'wh_5', leftTextEn: 'Data Saver', leftTextUr: 'ڈیٹا سیور (بچت)', rightTextEn: 'Stop apps from wasting internet Balance', rightTextUr: 'فالتو بیلنس اور انٹرنیٹ کو بچانا', leftImage: 'Layers' }
      ]
    }
  },

  // ==========================================
  // 2. SAFETY CHALLENGES (EASY / MEDIUM / HARD)
  // ==========================================
  {
    id: 'safe_1_easy',
    category: 'safety',
    titleEn: 'Look Out for Huge Prize Scams',
    titleUr: 'جعلی انعامات سے ہوشیار (آسان)',
    descriptionEn: 'Spot where fake cash prize messages try to trick kids.',
    descriptionUr: 'جعلی انعامی رقم کے پیغامات میں دھوکہ دہی کی نشانیاں تلاش کریں۔',
    type: 'scam-spotter',
    difficulty: 'easy',
    pointsReward: 50,
    badgeId: 'safety_shield',
    content: {
      screenTitleEn: 'Fake Cash Message',
      screenTitleUr: 'جعلی انعامی میسج',
      screenSenderEn: 'SENDER: 0312-XXXXXXX (Unknown Number)',
      screenSenderUr: 'بھیجنے والا: انجان نمبر (موبائل کمپنی نہیں ہے)',
      screenBodyEn: '🎁 CONGRATULATIONS! You won Rs. 50,000 Cash from JEETO PAKISTAN! 🎁\n👉 To claim, please call now at 0345-XXXXXXX or click this link: http://win-paisa-real-scam.ru/win',
      screenBodyUr: '🎁 مبارک ہو! آپ نے جیتو پاکستان کی طرف سے 50,000 روپے نقد جیت لیے ہیں! 🎁\n👉 انعام لینے کے لیے ابھی اس لنک پر کلک کریں: http://win-paisa-real-scam.ru/win',
      hotspots: [
        {
          id: 'h_ea1',
          x: 5,
          y: 2,
          width: 90,
          height: 15,
          isScam: true,
          labelEn: 'Unknown Sender Number',
          labelUr: 'انجان نمبر',
          explanationEn: 'Official government programs or TV shows never send messages from private 11-digit mobile numbers.',
          explanationUr: 'سرکاری پروگرام یا ٹی وی شوز کبھی بھی ۱۱ ہندسوں کے عام موبائل نمبر سے پیغام نہیں بھیجتے۔ ہمیشہ نام لکھا ہوتا ہے۔'
        },
        {
          id: 'h_ea2',
          x: 5,
          y: 20,
          width: 90,
          height: 30,
          isScam: true,
          labelEn: 'Huge Cash Claim without Entry',
          labelUr: 'بغیر کسی مقابلے کے بڑا انعام',
          explanationEn: 'If you did not buy a ticket or enter a game, any message saying you won is a fraud scam!',
          explanationUr: 'اگر آپ نے کسی مقابلے میں حصہ ہی نہیں لیا، تو یہ انعام پکا جھوٹ اور دھوکہ ہے!'
        },
        {
          id: 'h_ea3',
          x: 5,
          y: 60,
          width: 90,
          height: 35,
          isScam: true,
          labelEn: 'Suspicious Web Link',
          labelUr: 'خطرناک لنک (شکی ویب سائٹ)',
          explanationEn: 'Never click on weird links. They can steal your family phone data or hacking passwords.',
          explanationUr: 'کبھی بھی ایسے فالتو لنک پر کلک نہ کریں۔ یہ آپ کے گھر والوں کے فون کی اہم معلومات چوری کر سکتے ہیں۔'
        }
      ]
    }
  },
  {
    id: 'safe_1_medium',
    category: 'safety',
    titleEn: 'Protect Your Easypaisa Wallet',
    titleUr: 'اپنا موبائل والٹ بچائیں (درمیانہ)',
    descriptionEn: 'Learn to protect your family financial money PIN codes.',
    descriptionUr: 'موبائل بینکنگ اور پیسے بھیجنے والے کوڈ (PIN) کی حفاظت سیکھیں۔',
    type: 'scam-spotter',
    difficulty: 'medium',
    pointsReward: 100,
    badgeId: 'safety_shield',
    content: {
      screenTitleEn: 'Verification SMS Scam',
      screenTitleUr: 'جعلی ویریفکیشن میسج',
      screenSenderEn: 'SENDER: 0300-9999999',
      screenSenderUr: 'بھیجنے والا: ایک عام پرسنل نمبر',
      screenBodyEn: '⚠️ EASYPAISA ALERT! Your account will be BLOCKED today. Reply back with your 5-digit secret PIN code or write the OTP you just received to verify immediately!',
      screenBodyUr: '⚠️ ایزی پیسہ الرٹ! آپ کا اکاؤنٹ آج ہی بلاک کر دیا جائے گا۔ تائید کے لیے اپنا ۵ ہندسوں کا خفیہ پن (PIN) کوڈ یا ابھی آنے والا پاس ورڈ (OTP) یہاں لکھ کر بھیجیں!',
      hotspots: [
        {
          id: 'h_med1',
          x: 5,
          y: 10,
          width: 90,
          height: 15,
          isScam: true,
          labelEn: 'Creating urgent fear of Block',
          labelUr: 'اکاؤنٹ بلاک ہونے کا خوف دلانا',
          explanationEn: 'Scammers try to scare children into giving info. Banks do not threaten blocks over simple SMS or WhatsApp messages.',
          explanationUr: 'دھوکے باز ڈرا دھمکا کر کوڈ مانگتے ہیں۔ بینک کبھی بھی یوں جلدی میں بلاک کرنے کا میسج نہیں بھیجتے۔'
        },
        {
          id: 'h_med2',
          x: 5,
          y: 40,
          width: 90,
          height: 40,
          isScam: true,
          labelEn: 'Asking for Private PIN & OTP',
          labelUr: 'خفیہ کوڈ (PIN) مانگنا',
          explanationEn: 'CRITICAL! Bank officers, telecom agents, and Easypaisa representatives will NEVER ask for your secret PIN or OTP code. Keep this completely secret!',
          explanationUr: 'سب سے ضروری بات! دکان دار، بینک یا ایزی پیسہ کا کوئی نمائندہ آپ کا پن کوڈ (PIN) یا عارضی پاس ورڈ (OTP) نہیں مانگتا۔ اپنے پیسے محفوظ رکھنے کے لیے یہ ہرگز مت شیئر کریں!'
        }
      ]
    }
  },
  {
    id: 'safe_1_hard',
    category: 'safety',
    titleEn: 'Social Media Hijack Defense',
    titleUr: 'سوشل میڈیا اور اکاؤنٹ ہیکنگ (مشکل)',
    descriptionEn: 'Spot a modern password thief disguised as an innocent family relative.',
    descriptionUr: 'کسی رشتہ دار کے بھیجے ہوئے میسج میں چھپا فریب پہچانیں جو آپ کی آئی ڈی چرا سکتا ہے۔',
    type: 'scam-spotter',
    difficulty: 'hard',
    pointsReward: 150,
    badgeId: 'safety_shield',
    content: {
      screenTitleEn: 'Innocent Message From Classmate?',
      screenTitleUr: 'کیا یہ واقعی آپ کا دوست ہے؟',
      screenSenderEn: 'SENDER: Bilal (Your friend, whose account is hijacked)',
      screenSenderUr: 'بھیجنے والا: بلال (آپ کا قریبی دوست جس کا اکاؤنٹ ہیک ہے)',
      screenBodyEn: 'Assalam-o-Alaikum! My phone died and I locked my Facebook, so I put your phone number for recovery. You will get a 6-digit text from Google/FB right now. Please tell me that number quickly, I need it to open my account!',
      screenBodyUr: 'السلام علیکم! یار میرا فون خراب ہو گیا ہے اور میرا اکاؤنٹ بند ہے۔ میں نے بازیابی کے لیے تمہارا نمبر دیا ہے۔ ابھی تمہارے پاس گوگل کا ۶ ہندسوں کا کوڈ آئے گا، وہ مجھے جلدی بھیج دو تاکہ میں اکاؤنٹ کھول سکوں!',
      hotspots: [
        {
          id: 'h_hard1',
          x: 5,
          y: 2,
          width: 90,
          height: 35,
          isScam: true,
          labelEn: 'Strange and unusual favor request',
          labelUr: 'غیر متوقع یا عجیب مطالبہ',
          explanationEn: 'If a close classmate suddenly sends instructions about password recoveries or login PINs, verify by talking to them in person first!',
          explanationUr: 'اگر کوئی دوست اچانک آپ سے الٹے سیدھے ہیکنگ کوڈز اور پاس ورڈ سے متعلق مدد مانگے، تو پہلے اس سے مل کر یا آواز کال پر تصدیق کریں!'
        },
        {
          id: 'h_hard2',
          x: 5,
          y: 42,
          width: 90,
          height: 50,
          isScam: true,
          labelEn: 'Sharing OTP / Code of another service',
          labelUr: 'اپنے فون پر آنے والا کوڈ دوسرے کو بھیجنا',
          explanationEn: 'The 6-digit code coming to your phone is NOT for Bilal'+"'"+'s account. It is for YOUR own WhatsApp or Facebook account that hackers are trying to hijack from you!',
          explanationUr: 'جو ۶ ہندسوں کا کوڈ آپ کے فون پر آیا ہے وہ بلال کا نہیں بلکہ آپ کے اپنے واٹس ایپ یا فیس بک کا چابی ہے۔ اگر آپ اسے شیئر کریں گے تو آپ کا اکاؤنٹ ہیک ہوجائے گا!'
        }
      ]
    }
  },

  // ==========================================
  // 3. TYPING CHALLENGES (EASY / MEDIUM / HARD)
  // ==========================================
  {
    id: 'type_1_easy',
    category: 'typing',
    titleEn: 'Enter the Safety Code',
    titleUr: 'حفاظتی نمبر ٹائپ کریں (آسان)',
    descriptionEn: 'Learn to type numbers correctly on a localized keyboard.',
    descriptionUr: 'موبائل کی بورڈ پر صحیح نمبروں کو دبانا اور ٹائپ کرنا سیکھیں۔',
    type: 'typing',
    difficulty: 'easy',
    pointsReward: 50,
    badgeId: 'typing_pro',
    content: {
      wordEn: '3000',
      wordUr: '۳۰۰۰',
      letters: [
        { char: '3', phonetic: 'تین (Three)' },
        { char: '0', phonetic: 'صفر (Zero)' },
        { char: '0', phonetic: 'صفر (Zero)' },
        { char: '0', phonetic: 'صفر (Zero)' }
      ]
    }
  },
  {
    id: 'type_1_medium',
    category: 'typing',
    titleEn: 'Type Pakistan Learning Web Search',
    titleUr: 'سرکاری تعلیم کا پتہ لکھیں (درمیانہ)',
    descriptionEn: 'Type learning web query: "edu.pk" (Official Pakistani learning domains).',
    descriptionUr: 'ملائیے اور لکھیں: "edu.pk" جو پاکستان کی تعلیمی اور اسکولوں کی ویب سائٹ ہوتی ہے۔',
    type: 'typing',
    difficulty: 'medium',
    pointsReward: 100,
    badgeId: 'typing_pro',
    content: {
      wordEn: 'edu.pk',
      wordUr: 'ایجوکیشن پی کے',
      letters: [
        { char: 'e', phonetic: 'ای' },
        { char: 'd', phonetic: 'ڈی' },
        { char: 'u', phonetic: 'یو' },
        { char: '.', phonetic: 'ڈاٹ (نشان)' },
        { char: 'p', phonetic: 'پی' },
        { char: 'k', phonetic: 'کے' }
      ]
    }
  },
  {
    id: 'type_1_hard',
    category: 'typing',
    titleEn: 'Type Free Video Learning Site',
    titleUr: 'مفت بچوں کی پڑھائی کا پتہ (مشکل)',
    descriptionEn: 'Type "youtube.com" securely to search for lessons manually.',
    descriptionUr: 'ویڈیو کی تعلیم کے لئے "youtube.com" ٹائپ کریں۔',
    type: 'typing',
    difficulty: 'hard',
    pointsReward: 150,
    badgeId: 'typing_pro',
    content: {
      wordEn: 'youtube.com',
      wordUr: 'یوٹیوب ڈاٹ کام',
      letters: [
        { char: 'y', phonetic: 'وائی' },
        { char: 'o', phonetic: 'او' },
        { char: 'u', phonetic: 'یو' },
        { char: 't', phonetic: 'ٹی' },
        { char: 'u', phonetic: 'یو' },
        { char: 'b', phonetic: 'بی' },
        { char: 'e', phonetic: 'ای' },
        { char: '.', phonetic: 'نشان (ڈاٹ)' },
        { char: 'c', phonetic: 'سی' },
        { char: 'o', phonetic: 'او' },
        { char: 'm', phonetic: 'ایم' }
      ]
    }
  },

  // ==========================================
  // 4. SMART SEARCH CHALLENGES (EASY / MEDIUM / HARD)
  // ==========================================
  {
    id: 'search_1_easy',
    category: 'search',
    titleEn: 'Voice Search for School Lessons',
    titleUr: 'آواز سے سبق تلاش کریں (آسان)',
    descriptionEn: 'Put the safe voice-search steps in order so you can learn for free.',
    descriptionUr: 'مفت میں یوٹیوب پر سبق تلاش کرنے کے تمام اقدامات کو ترتیب دیں۔',
    type: 'sequence',
    difficulty: 'easy',
    pointsReward: 50,
    badgeId: 'search_scholar',
    content: {
      goalEn: 'How to use free YouTube Voice Search safely:',
      goalUr: 'مفت یوٹیوب پر آواز سے سبق ڈھونڈنے کا طریقہ:',
      steps: [
        { id: 'ss1_1', correctOrder: 1, textEn: 'Open clean learning application', textUr: 'تعلیمی ایپ کھولیں' },
        { id: 'ss1_2', correctOrder: 2, textEn: 'Press the microphone icon button', textUr: 'مائیک کے نشان والے بٹن کو دبائیں' },
        { id: 'ss1_3', correctOrder: 3, textEn: 'Speak: "Easy science lesson for kids"', textUr: 'بولیں: "بچوں کا آسان سائنس کا سبق"' }
      ]
    }
  },
  {
    id: 'search_1_medium',
    category: 'search',
    titleEn: 'Safe Search Selection Checklist',
    titleUr: 'محفوظ انٹرنیٹ تلاش (درمیانہ)',
    descriptionEn: 'Order safety steps when looking up gardening & farming on school tablets.',
    descriptionUr: 'مٹی اکھاڑنے یا پودا لگانے کے بارے میں انٹرنیٹ پر سیف سرچ کرنے کا طریقہ۔',
    type: 'sequence',
    difficulty: 'medium',
    pointsReward: 100,
    badgeId: 'search_scholar',
    content: {
      goalEn: 'Arrange search results filter sequence safely:',
      goalUr: 'پھل اور سبزیاں اگانے کا طریقہ محفوظ طریقے سے تلاش کریں:',
      steps: [
        { id: 'sm2_1', correctOrder: 1, textEn: 'Open search browser on your phone', textUr: 'اینڈرائیڈ براؤزر کھولیں' },
        { id: 'sm2_2', correctOrder: 2, textEn: 'Type: "How to grow tomatoes in Karachi" politely', textUr: 'لکھیں: کراچی میں گملے میں ٹماٹر اگانے کا طریقہ' },
        { id: 'sm2_3', correctOrder: 3, textEn: 'Turn on "SafeSearch Filter" in settings', textUr: 'سیٹنگز میں جا کر "محفوظ تلاش فلٹر" آن کریں' },
        { id: 'sm2_4', correctOrder: 4, textEn: 'Click only trusted website buttons', textUr: 'صرف اور صرف بھروسہ مند تعلیمی بٹن پر کلک کریں' }
      ]
    }
  },
  {
    id: 'search_1_hard',
    category: 'search',
    titleEn: 'Solar & Electricity DIY Search',
    titleUr: 'سولر پینل کی مرمت تلاش کریں (مشکل)',
    descriptionEn: 'Create step-by-step query to fix a broken house fan safely using online help.',
    descriptionUr: 'خراب سولر فین ٹھیک کرنے کی ویڈیو تلاش کرنے کے مراحل ترتیب دیں۔',
    type: 'sequence',
    difficulty: 'hard',
    pointsReward: 150,
    badgeId: 'search_scholar',
    content: {
      goalEn: 'Order safety queries for fixing an electric fan:',
      goalUr: 'پنکھے کی تار لگانے کی ویڈیو دیکھنے کا صحیح ترین طریقہ:',
      steps: [
        { id: 'sh3_1', correctOrder: 1, textEn: 'Ask parents/teachers first before testing power', textUr: 'تاروں کو ہاتھ لگانے سے پہلے والدین یا بڑے کے پاس بیٹھنے کا کہیں' },
        { id: 'sh3_2', correctOrder: 2, textEn: 'Open secure browser and type "how to repair solar solar DC fan safely"', textUr: 'لکھیں: ۱۲ والٹ کا سولر پنکھا ٹھیک کرنے کا طریقہ' },
        { id: 'sh3_3', correctOrder: 3, textEn: 'Avoid download links and skip ads', textUr: 'ہرگز کسی اشتہار یا ڈاؤن لوڈ بٹن پر ہاتھ نہ لگائیں' },
        { id: 'sh3_4', correctOrder: 4, textEn: 'Watch video first, take paper notes and follow under adult supervision', textUr: 'پہلے پوری ویڈیو دیکھیں، کاغذ پر نوٹ بنائیں اور بڑوں کے سامنے کام کریں' }
      ]
    }
  }
];
