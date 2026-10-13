import React, { useState } from 'react';
import { TaskItem } from '../../types';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface DailyCheckinTabProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, subtitle: string, category: TaskItem['category']) => void;
  onDeleteTask: (id: string) => void;
  streakDays: number;
}

export const DailyCheckinTab: React.FC<DailyCheckinTabProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  streakDays,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (task: TaskItem) => {
    sounds.click();
    const willBeCompleted = !task.completed;
    onToggleTask(task.id);
    if (willBeCompleted) {
      sounds.success();
      // If completing all
      if (completedCount + 1 === totalCount) {
        sounds.fanfare();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    sounds.coin();
    onAddTask(newTaskTitle.trim(), '自主添加 · 今日计划', '其他');
    setNewTaskTitle('');
  };

  // Helper icons for tasks
  const getTaskIcon = (type: string, title: string) => {
    if (title.includes('背诵') || type === 'recitation') return '📜';
    if (title.includes('听写') || type === 'dictation') return '✏️';
    if (title.includes('成语') || type === 'idiom') return '📚';
    if (title.includes('积累') || type === 'sentence') return '✨';
    if (title.includes('阅读') || type === 'reading' || type === 'extra_reading') return '📖';
    if (title.includes('计算') || type === 'math40') return '🧮';
    if (title.includes('思维') || type === 'math_thinking') return '🧠';
    if (title.includes('单词') || type === 'english_words') return '🔤';
    if (title.includes('运动') || type === 'sports') return '🏃';
    if (title.includes('闯关') || type === 'games') return '🎮';
    return '📌';
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-12">
      {/* Top Orange Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#ff6b2b] via-[#ff7e36] to-[#f9570c] rounded-3xl p-6 text-white text-center shadow-lg">
        {/* Subtle decorative circles */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full pointer-events-none blur-sm" />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full pointer-events-none blur-sm" />

        <div className="relative z-10">
          <div className="text-6xl sm:text-7xl font-black tracking-tight drop-shadow-sm font-sans">
            {percentage}%
          </div>
          <p className="text-base sm:text-lg font-medium text-white/95 mt-1.5">
            今日完成 {completedCount}/{totalCount} 项任务
          </p>

          <div className="inline-flex items-center gap-1.5 mt-3.5 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-xs">
            <span>🏆</span>
            <span>连续打卡 {streakDays} 天</span>
          </div>
        </div>
      </div>

      {/* Main Task List Card */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-float">🦕</span>
            <h2 className="text-lg font-bold text-slate-800">今日任务总览</h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
            {completedCount}/{totalCount} 已完成
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 rounded-full h-2.5 mb-5 overflow-hidden">
          <div
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Task Items */}
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 ${
                task.completed
                  ? 'bg-emerald-50/60 border-emerald-200/70 shadow-none'
                  : 'bg-white border-slate-200/80 hover:border-emerald-300 shadow-xs'
              }`}
            >
              {/* Checkbox and icon & title */}
              <div
                onClick={() => handleToggle(task)}
                className="flex items-center space-x-3 flex-1 cursor-pointer select-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                    task.completed
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'border-2 border-emerald-500 text-transparent'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="text-2xl">{getTaskIcon(task.type, task.title)}</div>

                <div className="flex-1">
                  <h3
                    className={`text-sm sm:text-base font-bold transition-colors ${
                      task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">{task.subtitle}</p>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => {
                  sounds.click();
                  onDeleteTask(task.id);
                }}
                className="text-slate-300 hover:text-red-400 p-1.5 transition-colors text-sm"
                title="删除任务"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add custom task */}
        <form onSubmit={handleAddSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="自定义新任务 (如跳绳300个、练字1页...)"
            className="flex-1 text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs active:scale-95 transition"
          >
            + 新增任务
          </button>
        </form>

        {/* Template Quick Options */}
        <div className="mt-3 pt-3 border-t border-dashed border-emerald-200/80 text-center">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-dashed border-emerald-300 px-4 py-1.5 rounded-full transition inline-flex items-center gap-1"
          >
            📋 增删同类型题目与模版
          </button>
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <span>📋</span>
                <span>快速添加学习打卡项</span>
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">点击下列常用儿童每日任务，即可一键加入今日清单：</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { title: '硬笔书法练字', sub: '语文 · 每日1页', cat: '语文' as const },
                { title: '英语绘本跟读', sub: '英语 · 10分钟', cat: '英语' as const },
                { title: '口算对战速算', sub: '数学 · 趣味挑战', cat: '数学' as const },
                { title: '平板时间管控', sub: '习惯 · 限时20分钟', cat: '其他' as const },
                { title: '整理书包书桌', sub: '自律 · 睡前自检', cat: '其他' as const },
                { title: '科学小实验', sub: '综合 · 探索发现', cat: '其他' as const },
              ].map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => {
                    sounds.coin();
                    onAddTask(tpl.title, tpl.sub, tpl.cat);
                    setShowTemplateModal(false);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition"
                >
                  <p className="font-bold text-slate-800">{tpl.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tpl.sub}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTemplateModal(false)}
              className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold"
            >
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
