import React, { useState } from 'react';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface SportItem {
  id: string;
  name: string;
  target: string;
  icon: string;
  completed: boolean;
}

interface SportsTabProps {
  onAwardPoints: (points: number, reason: string) => void;
  onCompleteTaskCategory: (categoryTitle: string) => void;
}

export const SportsTab: React.FC<SportsTabProps> = ({
  onAwardPoints,
  onCompleteTaskCategory,
}) => {
  const [sports, setSports] = useState<SportItem[]>([
    { id: 's1', name: '跳绳', target: '200个', icon: '🪢', completed: true },
    { id: 's2', name: '仰卧起坐', target: '30个', icon: '🧘', completed: false },
    { id: 's3', name: '跑步', target: '15分钟', icon: '🏃', completed: false },
    { id: 's4', name: '拍球', target: '100个', icon: '🏀', completed: false },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const completedCount = sports.filter((s) => s.completed).length;
  const totalCount = sports.length;

  const handleToggle = (id: string) => {
    sounds.click();
    setSports((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.completed;
          if (next) {
            sounds.success();
          }
          return { ...item, completed: next };
        }
        return item;
      })
    );

    if (completedCount + 1 === totalCount) {
      sounds.fanfare();
      confetti({ particleCount: 80, spread: 60 });
      onAwardPoints(5, '完成今日全部运动打卡');
      onCompleteTaskCategory('运动打卡');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    sounds.coin();
    setSports([
      ...sports,
      {
        id: `s_${Date.now()}`,
        name: newItemName.trim(),
        target: '适量',
        icon: '🤸',
        completed: false,
      },
    ]);
    setNewItemName('');
  };

  const handleDelete = (id: string) => {
    sounds.click();
    setSports(sports.filter((s) => s.id !== id));
  };

  // Timer helper
  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    let interval: number | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((t) => t - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      sounds.fanfare();
      setTimerRunning(false);
      alert('太棒了！15分钟跑步锻炼已完成！');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-16">
      {/* Top Orange Header Banner matching Screenshot 8/11 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#ff6b2b] via-[#ff7e36] to-[#f9570c] rounded-3xl p-6 text-white text-center shadow-lg">
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-5xl animate-bounce mb-1">🏃</div>
          <h2 className="text-2xl font-bold tracking-tight">运动打卡</h2>
          <p className="text-sm font-medium text-white/95 mt-1">
            今日完成 {completedCount}/{totalCount} 项
          </p>
        </div>
      </div>

      {/* Main List Card */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🏃</span>
          <h3 className="text-lg font-bold text-slate-800">今日运动项目</h3>
        </div>

        <div className="space-y-2.5">
          {sports.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
                item.completed
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-white border-slate-200/90 hover:border-emerald-300'
              }`}
            >
              <div
                onClick={() => handleToggle(item.id)}
                className="flex items-center space-x-3.5 flex-1 cursor-pointer select-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                    item.completed
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'border-2 border-emerald-500 text-transparent'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="text-2xl">{item.icon}</div>

                <div>
                  <h4
                    className={`text-sm sm:text-base font-bold ${
                      item.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}
                  >
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">{item.target}</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="text-slate-300 hover:text-red-400 p-1 text-sm transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add custom sports */}
        <form onSubmit={handleAddSubmit} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="新增运动项目 (如开合跳 50次)"
            className="flex-1 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs"
          >
            + 新增项目
          </button>
        </form>

        {/* Embedded Sport Stopwatch */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 bg-emerald-50/50 p-3 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">⏱️ 跑步/跳绳计时器</p>
            <p className="text-[11px] text-slate-500">倒计时：{formatTimer(timerSeconds)}</p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                sounds.click();
                setTimerRunning(!timerRunning);
              }}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold text-white transition ${
                timerRunning ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
            >
              {timerRunning ? '暂停' : '开始计时'}
            </button>
            <button
              onClick={() => {
                setTimerRunning(false);
                setTimerSeconds(15 * 60);
              }}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-700"
            >
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
