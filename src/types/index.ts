export type TabType = 
  | 'dinosaur'
  | 'daily'
  | 'chinese'
  | 'math'
  | 'english'
  | 'sports'
  | 'games'
  | 'points'
  | 'review';

export interface TaskItem {
  id: string;
  category: '语文' | '数学' | '英语' | '运动' | '其他';
  title: string;
  subtitle: string;
  completed: boolean;
  type: string;
}

export interface ReviewItem {
  id: string;
  type: 'mistake' | 'difficulty'; // 错题 or 难点
  title: string;
  source: string;
  date: string;
  detail?: string;
  completed: boolean;
}

export interface RewardItem {
  id: string;
  name: string;
  points: number;
  icon: string;
  claimedCount: number;
}

export interface WordItem {
  id: string;
  en: string;
  zh: string;
  pinyin?: string;
}

export interface DictationWord {
  id: string;
  word: string;
  pinyin: string;
  mastered: boolean;
}

export interface MathQuestion {
  id: number;
  expr: string;
  answer: number;
  userAnswer: string;
  isCorrect?: boolean;
}

export interface DinosaurState {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  hunger: number; // 0 - 100
  happiness: number; // 0 - 100
  favoriteFood: string;
  hat: string;
}
