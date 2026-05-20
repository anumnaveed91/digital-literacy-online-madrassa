export type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'en' | 'ur';
export type ChallengeType = 'match' | 'scam-spotter' | 'sequence' | 'typing';

export interface UserProfile {
  name: string;
  avatar: string; // Emoji or visual identifier
  points: number;
  unlockedBadges: string[];
  completedChallenges: string[]; // List of challenge IDs
  streakCount: number;
  lastPlayedDate: string; // ISO string or simple date
  level: number;
  assignedChallengeId?: string | null; // ID of challenge assigned by parent
}

export interface GuardianNotification {
  id: string;
  messageEn: string;
  messageUr: string;
  date: string;
  type: 'badge' | 'lesson' | 'streak' | 'recommendation';
}

export interface StoryElement {
  id: string;
  author: string;
  textEn: string;
  textUr: string;
  stickerEmoji?: string;
  type: 'text' | 'sticker' | 'milestone';
  createdAt: string;
}

export interface GroupChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface CommunityChallengeProject {
  id: string;
  titleEn: string;
  titleUr: string;
  goalEn: string;
  goalUr: string;
  elements: StoryElement[];
  chatMessages: GroupChatMessage[];
  currentStep: number; // 0: Brainstorm, 1: Draft, 2: Design, 3: Finalized
}

export interface Badge {
  id: string;
  nameEn: string;
  nameUr: string;
  descriptionEn: string;
  descriptionUr: string;
  icon: string; // Emoji
  colorClass: string; // TailWind gradient
}

export interface MatchPair {
  id: string;
  leftTextEn: string;
  leftTextUr: string;
  rightTextEn: string;
  rightTextUr: string;
  leftImage?: string; // Icon identifier
}

export interface Hotspot {
  id: string;
  x: number; // Percent from left
  y: number; // Percent from top
  width: number; // Percent
  height: number; // Percent
  isScam: boolean;
  explanationEn: string;
  explanationUr: string;
  labelEn: string;
  labelUr: string;
}

export interface SequenceStep {
  id: string;
  correctOrder: number;
  textEn: string;
  textUr: string;
}

export interface TypingLetter {
  char: string;
  phonetic: string;
}

export interface ChallengeContent {
  // For matching type
  matchPairs?: MatchPair[];
  // For scam spotter type
  screenImage?: string; // Type of mock screen, e.g. "whatsapp_fwd", "easypaisa_pin_request"
  screenTitleEn?: string;
  screenTitleUr?: string;
  screenBodyEn?: string;
  screenBodyUr?: string;
  screenSenderEn?: string;
  screenSenderUr?: string;
  hotspots?: Hotspot[];
  // For sequence type
  steps?: SequenceStep[];
  goalEn?: string;
  goalUr?: string;
  // For typing type
  letters?: TypingLetter[];
  wordEn?: string;
  wordUr?: string;
}

export interface H5PChallenge {
  id: string;
  category: 'safety' | 'connectivity' | 'typing' | 'search';
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  type: ChallengeType;
  difficulty: Difficulty;
  pointsReward: number;
  badgeId: string;
  content: ChallengeContent;
}

export interface LeaderboardEntry {
  name: string;
  points: number;
  avatar: string;
  isUser?: boolean;
}
