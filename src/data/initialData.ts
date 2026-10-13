import { TaskItem, ReviewItem, RewardItem, WordItem, DictationWord } from '../types';

export const initialTasks: TaskItem[] = [
  { id: 't1', category: '语文', title: '课本背诵', subtitle: '语文 · 必背内容', completed: true, type: 'recitation' },
  { id: 't2', category: '语文', title: '词语听写', subtitle: '语文 · 每日10词', completed: false, type: 'dictation' },
  { id: 't3', category: '语文', title: '成语故事', subtitle: '语文 · 每日1个', completed: false, type: 'idiom' },
  { id: 't4', category: '语文', title: '优美积累', subtitle: '语文 · 每日1句', completed: false, type: 'sentence' },
  { id: 't5', category: '语文', title: '阅读理解', subtitle: '语文 · 15分钟', completed: false, type: 'reading' },
  { id: 't6', category: '语文', title: '课外读书', subtitle: '语文 · 15分钟', completed: false, type: 'extra_reading' },
  { id: 't7', category: '数学', title: '计算40题', subtitle: '数学 · 口算+竖式+脱式', completed: false, type: 'math40' },
  { id: 't8', category: '数学', title: '思维拔高', subtitle: '数学 · 每日1题', completed: false, type: 'math_thinking' },
  { id: 't9', category: '英语', title: '单词学习', subtitle: '英语 · 每日10词', completed: false, type: 'english_words' },
  { id: 't10', category: '英语', title: '每日专属小阅读', subtitle: '英语 · 简易阅读理解', completed: false, type: 'english_reading' },
  { id: 't11', category: '运动', title: '运动打卡', subtitle: '运动 · 跳绳/跑步等4项', completed: false, type: 'sports' },
  { id: 't12', category: '其他', title: '闯关挑战', subtitle: '趣味 · 抓大鹅与舒尔特方格', completed: false, type: 'games' },
];

export const initialDictationWords: DictationWord[] = [
  { id: 'dw1', word: '宽阔', pinyin: 'kuān kuò', mastered: false },
  { id: 'dw2', word: '薄雾', pinyin: 'bó wù', mastered: false },
  { id: 'dw3', word: '沸腾', pinyin: 'fèi téng', mastered: false },
  { id: 'dw4', word: '笼罩', pinyin: 'lǒng zhào', mastered: false },
  { id: 'dw5', word: '偶尔', pinyin: 'ǒu ěr', mastered: false },
  { id: 'dw6', word: '恢复', pinyin: 'huī fù', mastered: false },
  { id: 'dw7', word: '灿烂', pinyin: 'càn làn', mastered: false },
  { id: 'dw8', word: '竹竿', pinyin: 'zhú gān', mastered: false },
  { id: 'dw9', word: '规律', pinyin: 'guī lǜ', mastered: false },
  { id: 'dw10', word: '缝隙', pinyin: 'fèng xì', mastered: false },
];

export const initialEnglishWords: WordItem[] = [
  { id: 'ew1', en: 'big', zh: '大的' },
  { id: 'ew2', en: 'small', zh: '小的' },
  { id: 'ew3', en: 'hot', zh: '热的' },
  { id: 'ew4', en: 'cold', zh: '冷的' },
  { id: 'ew5', en: 'fast', zh: '快的' },
  { id: 'ew6', en: 'slow', zh: '慢的' },
  { id: 'ew7', en: 'hungry', zh: '饿的' },
  { id: 'ew8', en: 'thirsty', zh: '渴的' },
  { id: 'ew9', en: 'red', zh: '红色的' },
  { id: 'ew10', en: 'blue', zh: '蓝色的' },
];

export const initialRewards: RewardItem[] = [
  { id: 'rw1', name: '小零食', points: 10, icon: '🍫', claimedCount: 0 },
  { id: 'rw2', name: '小玩具', points: 20, icon: '🧸', claimedCount: 0 },
  { id: 'rw3', name: '自由打游戏一次', points: 30, icon: '🎮', claimedCount: 0 },
  { id: 'rw4', name: '看动画片30分钟', points: 25, icon: '🎬', claimedCount: 0 },
  { id: 'rw5', name: '周末游乐场门票', points: 100, icon: '🎡', claimedCount: 0 },
];

export const initialReviewItems: ReviewItem[] = [
  {
    id: 'rev1',
    type: 'mistake',
    title: '数学拔高: 鸡兔同笼',
    source: '数学 · 思维拔高',
    date: '2026/9/16',
    detail: '35个头，94只脚。算式错在兔子脚数差计算',
    completed: false,
  },
  {
    id: 'rev2',
    type: 'difficulty',
    title: '背诵: 《暮江吟》',
    source: '语文 · 课本必背',
    date: '2026/9/16',
    detail: '注意“露似珍珠月似弓”中的“似”字读音与意境记忆',
    completed: false,
  },
  {
    id: 'rev3',
    type: 'mistake',
    title: '词语听写: 笼罩、沸腾',
    source: '语文 · 词语听写',
    date: '2026/9/16',
    detail: '“笼”字草字头/竹字头易混，“腾”右半边笔顺注意',
    completed: false,
  },
];
