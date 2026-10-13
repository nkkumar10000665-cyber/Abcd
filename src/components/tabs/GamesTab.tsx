import React, { useState, useEffect } from 'react';
import { WordItem } from '../../types';
import { sounds } from '../../utils/sound';
import { speakText } from '../../utils/speech';
import confetti from 'canvas-confetti';

interface GamesTabProps {
  words: WordItem[];
  onAwardPoints: (points: number, reason: string) => void;
  onCompleteTaskCategory: (categoryTitle: string) => void;
}

export const GamesTab: React.FC<GamesTabProps> = ({
  words,
  onAwardPoints,
  onCompleteTaskCategory,
}) => {
  // Mini-game states
  const [activeGame, setActiveGame] = useState<'none' | 'goose' | 'schulte'>('none');

  // GOOSE GAME STATE
  const [gooseList, setGooseList] = useState<{ id: string; en: string; zh: string; caught: boolean; x: number; y: number }[]>([]);
  const [targetGoose, setTargetGoose] = useState<{ en: string; zh: string } | null>(null);
  const [gooseCaughtCount, setGooseCaughtCount] = useState(0);

  // SCHULTE GRID STATE
  const [schulteNumbers, setSchulteNumbers] = useState<number[]>([]);
  const [currentExpected, setCurrentExpected] = useState(1);
  const [schulteStartTime, setSchulteStartTime] = useState<number | null>(null);
  const [schulteElapsedTime, setSchulteElapsedTime] = useState(0);
  const [schulteFinished, setSchulteFinished] = useState(false);
  const [schulteBestRecord, setSchulteBestRecord] = useState<number | null>(null);

  // START GOOSE GAME
  const startGooseGame = () => {
    sounds.click();
    const gameWords = words.slice(0, 6);
    const geese = gameWords.map((w, idx) => ({
      id: w.id,
      en: w.en,
      zh: w.zh,
      caught: false,
      x: 10 + (idx % 3) * 30 + Math.random() * 5,
      y: 15 + Math.floor(idx / 3) * 45 + Math.random() * 5,
    }));
    setGooseList(geese);
    setGooseCaughtCount(0);
    const target = geese[0];
    setTargetGoose(target);
    setActiveGame('goose');
    speakText(`Catch the goose with word: ${target.en}`, 'en');
  };

  const handleCatchGoose = (goose: typeof gooseList[0]) => {
    if (!targetGoose || goose.caught) return;

    if (goose.en === targetGoose.en) {
      sounds.quack();
      sounds.coin();
      const updated = gooseList.map((g) => (g.id === goose.id ? { ...g, caught: true } : g));
      setGooseList(updated);
      const nextCaughtCount = gooseCaughtCount + 1;
      setGooseCaughtCount(nextCaughtCount);

      const remaining = updated.filter((g) => !g.caught);
      if (remaining.length > 0) {
        const nextTarget = remaining[Math.floor(Math.random() * remaining.length)];
        setTargetGoose(nextTarget);
        speakText(`Next: ${nextTarget.en}!`, 'en');
      } else {
        // Win!
        sounds.fanfare();
        confetti({ particleCount: 100, spread: 70 });
        onAwardPoints(10, '抓大鹅全部通关');
        onCompleteTaskCategory('趣味闯关');
        setTargetGoose(null);
      }
    } else {
      sounds.error();
    }
  };

  // START SCHULTE GRID
  const startSchulteGame = () => {
    sounds.click();
    // Shuffle 1 to 25
    const nums = Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    setSchulteNumbers(nums);
    setCurrentExpected(1);
    setSchulteStartTime(Date.now());
    setSchulteElapsedTime(0);
    setSchulteFinished(false);
    setActiveGame('schulte');
  };

  // Schulte timer
  useEffect(() => {
    let interval: number | null = null;
    if (activeGame === 'schulte' && schulteStartTime && !schulteFinished) {
      interval = window.setInterval(() => {
        setSchulteElapsedTime(Math.floor((Date.now() - schulteStartTime) / 1000));
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeGame, schulteStartTime, schulteFinished]);

  const handleSchulteClick = (num: number) => {
    if (schulteFinished) return;
    if (num === currentExpected) {
      sounds.click();
      if (num === 25) {
        // Complete
        sounds.fanfare();
        setSchulteFinished(true);
        const finalTime = schulteStartTime ? Math.floor((Date.now() - schulteStartTime) / 1000) : 25;
        setSchulteElapsedTime(finalTime);
        if (!schulteBestRecord || finalTime < schulteBestRecord) {
          setSchulteBestRecord(finalTime);
        }
        confetti({ particleCount: 100, spread: 70 });
        onAwardPoints(10, '完成舒尔特方格专注力训练');
        onCompleteTaskCategory('趣味闯关');
      } else {
        setCurrentExpected((prev) => prev + 1);
      }
    } else {
      sounds.error();
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-16">
      {/* CARD 1: English Catch Goose matching Screenshot 9/11 */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
        {/* Blue Header Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex justify-center items-center relative overflow-hidden">
          <div className="text-6xl animate-float filter drop-shadow">
            🦢
          </div>
          <div className="absolute top-2 right-3 text-white/50 text-xs font-bold">
            实景互动游戏
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">英语抓大鹅</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            读出单词、找到家里对应实物，即可&ldquo;抓走大鹅&rdquo;。全部抓完闯关成功！实景记单词，不枯燥、记得牢。单词来自&ldquo;英语&rdquo;板块单词学习模块。
          </p>

          <button
            onClick={startGooseGame}
            className="w-full bg-[#2563eb] hover:bg-blue-700 active:scale-98 text-white font-bold py-3 px-4 rounded-2xl shadow-md text-sm sm:text-base flex items-center justify-center gap-2 transition"
          >
            <span>🎮</span>
            <span>开始抓鹅</span>
          </button>
        </div>
      </div>

      {/* CARD 2: Schulte Grid matching Screenshot 9/11 */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
        {/* Purple Header Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 flex justify-center items-center relative overflow-hidden">
          <div className="text-6xl animate-wiggle filter drop-shadow">
            🎯
          </div>
          <div className="absolute top-2 right-3 text-white/50 text-xs font-bold">
            视觉与专注力
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            专注力训练 · 舒尔特方格
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            5×5数字方格，按1→25顺序依次点击，越快越好！训练专注力、视觉搜索能力和反应速度。每天练3次，专注力肉眼可见地提升！
          </p>

          <button
            onClick={startSchulteGame}
            className="w-full bg-[#7c3aed] hover:bg-purple-700 active:scale-98 text-white font-bold py-3 px-4 rounded-2xl shadow-md text-sm sm:text-base flex items-center justify-center gap-2 transition"
          >
            <span>🎮</span>
            <span>开始训练</span>
          </button>
        </div>
      </div>

      {/* GOOSE GAME MODAL */}
      {activeGame === 'goose' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-pop">
          <div className="bg-[#e0f2fe] rounded-3xl p-5 max-w-md w-full shadow-2xl border-4 border-blue-400 relative">
            <button
              onClick={() => setActiveGame('none')}
              className="absolute top-3 right-4 text-slate-500 hover:text-slate-800 text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-3">
              <h3 className="font-black text-blue-900 text-lg flex items-center justify-center gap-2">
                <span>🦢</span>
                <span>英语抓大鹅乐园</span>
              </h3>
              {targetGoose ? (
                <div className="mt-2 bg-white/90 border-2 border-blue-400 px-4 py-2 rounded-2xl inline-block shadow">
                  <span className="text-xs text-blue-600 block">请点击抓走这只大鹅：</span>
                  <span className="text-2xl font-black text-blue-800">{targetGoose.en}</span>
                  <span className="text-sm font-bold text-amber-600 ml-2">({targetGoose.zh})</span>
                </div>
              ) : (
                <div className="mt-2 bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-2xl">
                  🎉 太棒啦！全部大鹅都被你抓住啦！奖励10积分！
                </div>
              )}
            </div>

            {/* Pond field with Geese */}
            <div className="relative h-64 bg-gradient-to-b from-sky-200 to-cyan-100 rounded-2xl border-2 border-sky-300 overflow-hidden p-2 grid grid-cols-3 gap-2">
              {gooseList.map((goose) => (
                <button
                  key={goose.id}
                  onClick={() => handleCatchGoose(goose)}
                  disabled={goose.caught}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                    goose.caught
                      ? 'opacity-20 scale-75 bg-slate-200 pointer-events-none'
                      : 'bg-white/80 hover:bg-white shadow hover:scale-105 active:scale-95'
                  }`}
                >
                  <span className="text-3xl animate-bounce">🦢</span>
                  <span className="text-xs font-black text-blue-900 mt-1">{goose.en}</span>
                  <span className="text-[10px] text-slate-500">{goose.zh}</span>
                  {goose.caught && (
                    <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-emerald-600 bg-white/70 rounded-xl">
                      ✓ 已抓
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-3 flex justify-between items-center text-xs text-blue-800 font-bold px-1">
              <span>已抓捕：{gooseCaughtCount} / {gooseList.length}</span>
              <button
                onClick={startGooseGame}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-xl hover:bg-blue-700"
              >
                🔄 重新抓鹅
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHULTE GRID MODAL */}
      {activeGame === 'schulte' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-pop">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border-4 border-purple-400 relative">
            <button
              onClick={() => setActiveGame('none')}
              className="absolute top-3 right-4 text-slate-400 hover:text-slate-700 text-lg font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-3">
              <h3 className="font-bold text-purple-900 text-base flex items-center justify-center gap-1.5">
                <span>🎯</span>
                <span>舒尔特方格 (5×5)</span>
              </h3>
              <div className="flex justify-around items-center mt-2 bg-purple-50 p-2 rounded-xl text-xs">
                <div>
                  目标数字：
                  <span className="text-xl font-black text-purple-700 ml-1">
                    {schulteFinished ? '完成' : currentExpected}
                  </span>
                </div>
                <div>
                  用时：
                  <span className="text-base font-mono font-bold text-slate-800 ml-1">
                    {schulteElapsedTime} 秒
                  </span>
                </div>
              </div>
            </div>

            {/* 5x5 Matrix */}
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-purple-100 rounded-2xl">
              {schulteNumbers.map((num) => {
                const isPassed = num < currentExpected;
                return (
                  <button
                    key={num}
                    onClick={() => handleSchulteClick(num)}
                    className={`aspect-square flex items-center justify-center font-black text-lg rounded-xl transition active:scale-90 ${
                      isPassed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-white text-slate-800 hover:bg-purple-50 shadow-xs'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {schulteFinished && (
              <div className="mt-3 text-center bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs text-emerald-800 font-bold">
                🎉 挑战成功！最终用时 {schulteElapsedTime} 秒！
                {schulteBestRecord && <p className="text-[11px] text-emerald-600 mt-0.5">历史最佳：{schulteBestRecord} 秒</p>}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={startSchulteGame}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-bold"
              >
                🔄 重新训练
              </button>
              <button
                onClick={() => setActiveGame('none')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
