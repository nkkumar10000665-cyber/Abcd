/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TabType, TaskItem, ReviewItem, RewardItem, WordItem, DictationWord } from './types';
import { initialTasks, initialDictationWords, initialEnglishWords, initialRewards, initialReviewItems } from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DailyCheckinTab } from './components/tabs/DailyCheckinTab';
import { ChineseTab } from './components/tabs/ChineseTab';
import { MathTab } from './components/tabs/MathTab';
import { EnglishTab } from './components/tabs/EnglishTab';
import { SportsTab } from './components/tabs/SportsTab';
import { GamesTab } from './components/tabs/GamesTab';
import { PointsTab } from './components/tabs/PointsTab';
import { ReviewTab } from './components/tabs/ReviewTab';
import { DinosaurPetTab } from './components/tabs/DinosaurPetTab';
import { sounds } from './utils/sound';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [themeColor, setThemeColor] = useState<'green' | 'orange'>('green');

  // Application Data States with LocalStorage fallback
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('dino_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('dino_points');
    return saved !== null ? Number(saved) : 15;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('dino_streak');
    return saved !== null ? Number(saved) : 3;
  });

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('dino_review_items');
    return saved ? JSON.parse(saved) : initialReviewItems;
  });

  const [dictationWords] = useState<DictationWord[]>(() => {
    const saved = localStorage.getItem('dino_dictation_words');
    return saved ? JSON.parse(saved) : initialDictationWords;
  });

  const [englishWords, setEnglishWords] = useState<WordItem[]>(() => {
    const saved = localStorage.getItem('dino_english_words');
    return saved ? JSON.parse(saved) : initialEnglishWords;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const saved = localStorage.getItem('dino_rewards');
    return saved ? JSON.parse(saved) : initialRewards;
  });

  const [redemptionHistory, setRedemptionHistory] = useState<{ id: string; name: string; points: number; date: string }[]>(() => {
    const saved = localStorage.getItem('dino_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal dialog states
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskCategory, setQuickTaskCategory] = useState<TaskItem['category']>('语文');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('dino_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('dino_points', points.toString());
  }, [points]);
  useEffect(() => {
    localStorage.setItem('dino_streak', streakDays.toString());
  }, [streakDays]);
  useEffect(() => {
    localStorage.setItem('dino_review_items', JSON.stringify(reviewItems));
  }, [reviewItems]);
  useEffect(() => {
    localStorage.setItem('dino_english_words', JSON.stringify(englishWords));
  }, [englishWords]);
  useEffect(() => {
    localStorage.setItem('dino_rewards', JSON.stringify(rewards));
  }, [rewards]);
  useEffect(() => {
    localStorage.setItem('dino_history', JSON.stringify(redemptionHistory));
  }, [redemptionHistory]);

  // Point management helpers
  const handleAwardPoints = (pts: number, reason: string) => {
    sounds.coin();
    setPoints((prev) => prev + pts);
    // Visual mini toast
    console.log(`[Points Awarded] +${pts} for ${reason}`);
  };

  const handleDeductPoints = (pts: number): boolean => {
    if (points >= pts) {
      setPoints((prev) => prev - pts);
      return true;
    }
    return false;
  };

  // Task Handlers
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (title: string, subtitle: string, category: TaskItem['category']) => {
    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      category,
      title,
      subtitle,
      completed: false,
      type: 'custom',
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCompleteTaskCategory = (categoryTitle: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.title.includes(categoryTitle) || categoryTitle.includes(t.title)
          ? { ...t, completed: true }
          : t
      )
    );
  };

  // Review Handlers
  const handleAddReviewItem = (item: Omit<ReviewItem, 'id'>) => {
    // Avoid exact duplicate
    const exists = reviewItems.some((r) => r.title === item.title && !r.completed);
    if (!exists) {
      const newItem: ReviewItem = {
        ...item,
        id: `rev_${Date.now()}_${Math.random()}`,
      };
      setReviewItems((prev) => [newItem, ...prev]);
    }
  };

  const handleCompleteReviewItem = (id: string) => {
    setReviewItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDeleteReviewItem = (id: string) => {
    setReviewItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCompleteAllReviewCategory = (type: 'mistake' | 'difficulty') => {
    setReviewItems((prev) => prev.filter((i) => i.type !== type));
  };

  const handleClearReviewCategory = (type: 'mistake' | 'difficulty') => {
    setReviewItems((prev) => prev.filter((i) => i.type !== type));
  };

  // English Word Handlers
  const handleAddWord = (en: string, zh: string) => {
    const newWord: WordItem = {
      id: `word_${Date.now()}`,
      en,
      zh,
    };
    setEnglishWords((prev) => [...prev, newWord]);
  };

  const handleDeleteWord = (id: string) => {
    setEnglishWords((prev) => prev.filter((w) => w.id !== id));
  };

  // Reward Handlers
  const handleRedeemReward = (reward: RewardItem): boolean => {
    if (points >= reward.points) {
      setPoints((prev) => prev - reward.points);
      setRedemptionHistory((prev) => [
        {
          id: `h_${Date.now()}`,
          name: reward.name,
          points: reward.points,
          date: new Date().toLocaleDateString('zh-CN'),
        },
        ...prev,
      ]);
      setRewards((prev) =>
        prev.map((r) => (r.id === reward.id ? { ...r, claimedCount: r.claimedCount + 1 } : r))
      );
      return true;
    }
    return false;
  };

  const handleAddReward = (name: string, cost: number, icon: string) => {
    const newItem: RewardItem = {
      id: `rw_${Date.now()}`,
      name,
      points: cost,
      icon,
      claimedCount: 0,
    };
    setRewards((prev) => [...prev, newItem]);
  };

  const handleDeleteReward = (id: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResetPoints = () => {
    setPoints(0);
  };

  // Count uncompleted review items
  const activeReviewCount = reviewItems.filter((i) => !i.completed).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#eef7f0] text-slate-800">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          sounds.click();
          setActiveTab(tab);
        }}
        reviewCount={activeReviewCount}
        themeColor={themeColor}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#edf6ee]">
        {/* Top Header */}
        <Header
          themeColor={themeColor}
          onToggleTheme={() => {
            sounds.click();
            setThemeColor((prev) => (prev === 'green' ? 'orange' : 'green'));
          }}
          onOpenQuickAdd={() => setShowQuickAddModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          points={points}
        />

        {/* Scrollable Tab Content Container */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 no-scrollbar">
          {activeTab === 'dinosaur' && (
            <DinosaurPetTab
              points={points}
              onDeductPoints={handleDeductPoints}
              onAwardPoints={handleAwardPoints}
            />
          )}

          {activeTab === 'daily' && (
            <DailyCheckinTab
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              streakDays={streakDays}
            />
          )}

          {activeTab === 'chinese' && (
            <ChineseTab
              dictationWords={dictationWords}
              onAddReviewItem={handleAddReviewItem}
              onAwardPoints={handleAwardPoints}
              onCompleteTaskCategory={handleCompleteTaskCategory}
            />
          )}

          {activeTab === 'math' && (
            <MathTab
              onAddReviewItem={handleAddReviewItem}
              onAwardPoints={handleAwardPoints}
              onCompleteTaskCategory={handleCompleteTaskCategory}
            />
          )}

          {activeTab === 'english' && (
            <EnglishTab
              words={englishWords}
              onAddWord={handleAddWord}
              onDeleteWord={handleDeleteWord}
              onAddReviewItem={handleAddReviewItem}
              onAwardPoints={handleAwardPoints}
              onCompleteTaskCategory={handleCompleteTaskCategory}
            />
          )}

          {activeTab === 'sports' && (
            <SportsTab
              onAwardPoints={handleAwardPoints}
              onCompleteTaskCategory={handleCompleteTaskCategory}
            />
          )}

          {activeTab === 'games' && (
            <GamesTab
              words={englishWords}
              onAwardPoints={handleAwardPoints}
              onCompleteTaskCategory={handleCompleteTaskCategory}
            />
          )}

          {activeTab === 'points' && (
            <PointsTab
              points={points}
              streakDays={streakDays}
              rewards={rewards}
              onRedeemReward={handleRedeemReward}
              onAddReward={handleAddReward}
              onDeleteReward={handleDeleteReward}
              onResetPoints={handleResetPoints}
              redemptionHistory={redemptionHistory}
            />
          )}

          {activeTab === 'review' && (
            <ReviewTab
              items={reviewItems}
              onCompleteItem={handleCompleteReviewItem}
              onDeleteItem={handleDeleteReviewItem}
              onCompleteAllCategory={handleCompleteAllReviewCategory}
              onClearCategory={handleClearReviewCategory}
              onAwardPoints={handleAwardPoints}
            />
          )}
        </main>
      </div>

      {/* Quick Add Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-emerald-100 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <span>➕</span>
                <span>快速添加每日任务</span>
              </h3>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">任务名称</label>
              <input
                type="text"
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                placeholder="例如：复习英语单词、背诵一首古诗..."
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">所属学科类别</label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(['语文', '数学', '英语', '运动'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setQuickTaskCategory(cat)}
                    className={`py-2 rounded-xl font-bold border transition ${
                      quickTaskCategory === cat
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  if (quickTaskTitle.trim()) {
                    sounds.coin();
                    handleAddTask(quickTaskTitle.trim(), `${quickTaskCategory} · 自定义项目`, quickTaskCategory);
                    setQuickTaskTitle('');
                    setShowQuickAddModal(false);
                  }
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-xs"
              >
                确认添加
              </button>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-semibold"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-emerald-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <span>⚙️</span>
                <span>学习工作台设置</span>
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div>
                  <p className="font-bold text-slate-800">导航主题风格</p>
                  <p className="text-[11px] text-slate-400">对应截图的草绿或活力橙</p>
                </div>
                <button
                  onClick={() => setThemeColor((prev) => (prev === 'green' ? 'orange' : 'green'))}
                  className="bg-white border border-slate-200 px-3 py-1 rounded-xl font-bold shadow-xs"
                >
                  {themeColor === 'green' ? '🟢 护眼草绿' : '🟠 活力橙色'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div>
                  <p className="font-bold text-slate-800">打卡天数</p>
                  <p className="text-[11px] text-slate-400">目前连续打卡天数</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setStreakDays((d) => Math.max(0, d - 1))}
                    className="w-6 h-6 rounded-lg bg-slate-200 font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-bold px-2">{streakDays} 天</span>
                  <button
                    onClick={() => setStreakDays((d) => d + 1)}
                    className="w-6 h-6 rounded-lg bg-slate-200 font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div>
                  <p className="font-bold text-slate-800">打卡任务重置</p>
                  <p className="text-[11px] text-slate-400">清空打卡勾选，开启新的一天</p>
                </div>
                <button
                  onClick={() => {
                    sounds.click();
                    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
                    setStreakDays((d) => d + 1);
                    confetti({ particleCount: 50, spread: 50 });
                    alert('已开启全新一天的打卡！连续打卡天数 +1！');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs"
                >
                  开启新一天
                </button>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('确定要恢复默认预设数据吗？')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="w-full text-center text-xs text-red-500 hover:text-red-700 py-1"
              >
                恢复出厂默认数据
              </button>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs sm:text-sm"
            >
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
