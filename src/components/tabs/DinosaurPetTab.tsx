import React, { useState } from 'react';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface DinosaurPetTabProps {
  points: number;
  onDeductPoints: (pts: number) => boolean;
  onAwardPoints: (pts: number, reason: string) => void;
}

export const DinosaurPetTab: React.FC<DinosaurPetTabProps> = ({
  points,
  onDeductPoints,
}) => {
  const [dinoLevel, setDinoLevel] = useState(3);
  const [dinoExp, setDinoExp] = useState(65);
  const [hunger, setHunger] = useState(70);
  const [happiness, setHappiness] = useState(85);
  const [currentHat, setCurrentHat] = useState<'none' | 'grad' | 'crown' | 'glasses'>('grad');
  const [speech, setSpeech] = useState('今天我们一起攻克了古诗背诵，你真棒！嗷呜~');
  const [isEating, setIsEating] = useState(false);
  const [isDancing, setIsDancing] = useState(false);

  // Feed dinosaur with steak or apple
  const handleFeed = (foodType: 'steak' | 'apple', cost: number) => {
    sounds.click();
    if (onDeductPoints(cost)) {
      sounds.dinoRoar();
      setIsEating(true);
      setHunger((prev) => Math.min(100, prev + 25));
      setDinoExp((prev) => {
        const next = prev + 20;
        if (next >= 100) {
          sounds.fanfare();
          confetti({ particleCount: 100, spread: 70 });
          setDinoLevel((lvl) => lvl + 1);
          setSpeech('太棒啦！我升级到了 Lv.' + (dinoLevel + 1) + ' 霸王龙！');
          return next - 100;
        }
        return next;
      });
      setSpeech(foodType === 'steak' ? '哇！大牛排太美味啦！充满干劲！' : '脆甜大苹果，真好吃！');
      setTimeout(() => setIsEating(false), 1200);
    } else {
      sounds.error();
      alert(`积分不够哦，需要 ${cost} 积分，快去完成今日学习任务赚取积分吧！`);
    }
  };

  // Pet dinosaur head
  const handlePetDino = () => {
    sounds.dinoRoar();
    setIsDancing(true);
    setHappiness((prev) => Math.min(100, prev + 15));
    const dialogues = [
      '嗷呜~ 摸摸头最开心了！',
      '小主人，今天数学口算40题全对了吗？',
      '你每天坚持打卡，我也会变得更强壮！',
      '英语抓大鹅好好玩，我们待会儿再去玩一局！',
    ];
    setSpeech(dialogues[Math.floor(Math.random() * dialogues.length)]);
    setTimeout(() => setIsDancing(false), 1500);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦕</span>
              <h2 className="text-xl font-black">小暴龙·豆豆的家</h2>
            </div>
            <p className="text-xs text-white/90 mt-1">学习成长专属恐龙伴侣 · 伴随打卡升级</p>
          </div>
          <div className="text-right">
            <span className="bg-yellow-400 text-yellow-950 font-black text-xs px-3 py-1 rounded-full shadow">
              Lv.{dinoLevel} 学霸龙
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-5 shadow-xs space-y-4 text-center">
        {/* Speech Bubble */}
        <div className="relative inline-block max-w-sm bg-white border-2 border-emerald-400 px-4 py-2.5 rounded-2xl shadow-sm text-xs sm:text-sm font-bold text-slate-800 animate-pop">
          <span>{speech}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-emerald-400 rotate-45" />
        </div>

        {/* Dino Pet Illustration with Hat */}
        <div className="relative h-56 flex items-center justify-center">
          {/* Hat Accessory */}
          {currentHat === 'grad' && (
            <div className="absolute top-4 text-4xl animate-bounce filter drop-shadow z-20">
              🎓
            </div>
          )}
          {currentHat === 'crown' && (
            <div className="absolute top-4 text-4xl animate-wiggle filter drop-shadow z-20">
              👑
            </div>
          )}
          {currentHat === 'glasses' && (
            <div className="absolute top-16 text-3xl filter drop-shadow z-20">
              🕶️
            </div>
          )}

          {/* Interactive Dinosaur Vector */}
          <div
            onClick={handlePetDino}
            className={`cursor-pointer transition-transform duration-300 ${
              isEating ? 'scale-110 rotate-3' : isDancing ? 'animate-wiggle scale-105' : 'hover:scale-105'
            }`}
            title="点击摸摸恐龙，增加好感度！"
          >
            <svg
              className="w-44 h-44 drop-shadow-md"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Dinosaur Body */}
              <ellipse cx="100" cy="120" rx="50" ry="42" fill="#22c55e" />
              {/* Belly */}
              <ellipse cx="92" cy="126" rx="32" ry="28" fill="#bbf7d0" />
              {/* Back Spikes */}
              <path d="M52 100 L44 88 L60 92 Z" fill="#15803d" />
              <path d="M62 82 L56 70 L72 76 Z" fill="#15803d" />
              <path d="M78 68 L74 54 L88 62 Z" fill="#15803d" />
              {/* Dinosaur Head & Long Neck */}
              <path
                d="M105 110 C110 80, 115 60, 130 55 C150 50, 165 65, 155 85 C145 95, 135 110, 125 120 Z"
                fill="#22c55e"
              />
              {/* Snout */}
              <ellipse cx="145" cy="65" rx="20" ry="14" fill="#22c55e" />
              {/* Nostril */}
              <circle cx="156" cy="63" r="2" fill="#15803d" />
              {/* Cute Big Eye */}
              <circle cx="138" cy="58" r="6" fill="#0f172a" />
              <circle cx="136" cy="56" r="2" fill="#ffffff" />
              {/* Blush */}
              <ellipse cx="140" cy="70" rx="5" ry="3" fill="#f87171" opacity="0.7" />
              {/* Smiling Mouth */}
              <path
                d="M140 73 Q148 78 154 71"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Legs */}
              <rect x="75" y="150" width="16" height="24" rx="8" fill="#16a34a" />
              <rect x="110" y="150" width="16" height="24" rx="8" fill="#16a34a" />
              {/* Feet claws */}
              <circle cx="78" cy="172" r="3" fill="#facc15" />
              <circle cx="84" cy="173" r="3" fill="#facc15" />
              <circle cx="113" cy="172" r="3" fill="#facc15" />
              <circle cx="119" cy="173" r="3" fill="#facc15" />
              {/* Tail */}
              <path
                d="M55 125 C35 130, 20 120, 10 105 C20 115, 35 118, 50 118 Z"
                fill="#22c55e"
              />
              {/* Small cute hands */}
              <ellipse cx="120" cy="120" rx="9" ry="5" fill="#16a34a" transform="rotate(-15 120 120)" />
            </svg>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-2xl border border-slate-200">
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>经验 EXP</span>
              <span>{dinoExp}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${dinoExp}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>饱食度 🥩</span>
              <span>{hunger}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${hunger}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>快乐度 ❤️</span>
              <span>{happiness}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${happiness}%` }} />
            </div>
          </div>
        </div>

        {/* Feeding Actions */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-800 text-left">
            🍴 恐龙食堂 (用学习打卡赚得的积分喂养)：
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFeed('steak', 5)}
              className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center justify-between active:scale-95 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥩</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-amber-900">美味牛排</p>
                  <p className="text-[10px] text-amber-700">+25饱食 +20经验</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-amber-200/80 px-2 py-0.5 rounded-full text-amber-800">
                5积分
              </span>
            </button>

            <button
              onClick={() => handleFeed('apple', 2)}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-between active:scale-95 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-900">清脆苹果</p>
                  <p className="text-[10px] text-emerald-700">+10饱食 +10经验</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-200/80 px-2 py-0.5 rounded-full text-emerald-800">
                2积分
              </span>
            </button>
          </div>
        </div>

        {/* Dressing Room / Hats */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-800 text-left">
            👒 恐龙装扮间 (点击给恐龙戴帽子)：
          </p>
          <div className="flex justify-around">
            {[
              { id: 'grad' as const, label: '博士帽', icon: '🎓' },
              { id: 'crown' as const, label: '小王冠', icon: '👑' },
              { id: 'glasses' as const, label: '酷墨镜', icon: '🕶️' },
              { id: 'none' as const, label: '不戴帽子', icon: '🦖' },
            ].map((hat) => (
              <button
                key={hat.id}
                onClick={() => {
                  sounds.click();
                  setCurrentHat(hat.id);
                }}
                className={`flex flex-col items-center p-2 rounded-xl border text-xs font-bold transition ${
                  currentHat === hat.id
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs scale-105'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{hat.icon}</span>
                <span className="text-[10px] mt-0.5">{hat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
