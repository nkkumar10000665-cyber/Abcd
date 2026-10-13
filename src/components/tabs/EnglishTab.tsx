import React, { useState } from 'react';
import { WordItem, ReviewItem } from '../../types';
import { speakText } from '../../utils/speech';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface EnglishTabProps {
  words: WordItem[];
  onAddWord: (en: string, zh: string) => void;
  onDeleteWord: (id: string) => void;
  onAddReviewItem: (item: Omit<ReviewItem, 'id'>) => void;
  onAwardPoints: (points: number, reason: string) => void;
  onCompleteTaskCategory: (categoryTitle: string) => void;
}

export const EnglishTab: React.FC<EnglishTabProps> = ({
  words,
  onAddWord,
  onDeleteWord,
  onAddReviewItem,
  onAwardPoints,
  onCompleteTaskCategory,
}) => {
  const [newWordInput, setNewWordInput] = useState('');
  const [wordsDone, setWordsDone] = useState(false);
  const [activeSpeakingWordId, setActiveSpeakingWordId] = useState<string | null>(null);

  // Mic test feedback state
  const [micActiveWordId, setMicActiveWordId] = useState<string | null>(null);

  // Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Daily Reading Question State
  const [selectedReadingOption, setSelectedReadingOption] = useState<string | null>(null);
  const [readingAnswerStatus, setReadingAnswerStatus] = useState<'correct' | 'wrong' | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const handleSpeak = async (word: WordItem) => {
    sounds.click();
    setActiveSpeakingWordId(word.id);
    await speakText(word.en, 'en', 0.85);
    setActiveSpeakingWordId(null);
  };

  const handleMicSimulate = (word: WordItem) => {
    sounds.click();
    setMicActiveWordId(word.id);
    setTimeout(() => {
      sounds.success();
      setMicActiveWordId(null);
      speakText(`Great job! ${word.en}!`, 'en');
    }, 1200);
  };

  const handleCompleteWords = () => {
    sounds.fanfare();
    setWordsDone(true);
    confetti({ particleCount: 70, spread: 60 });
    onAwardPoints(5, '完成英语10个单词学习');
    onCompleteTaskCategory('单词学习');
  };

  const handleAddWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordInput.trim()) return;
    const parts = newWordInput.split(/[,，]/);
    if (parts.length >= 2) {
      onAddWord(parts[0].trim(), parts[1].trim());
      sounds.coin();
      setNewWordInput('');
    } else {
      alert('请按格式输入：英文, 中文（如 apple, 苹果）');
    }
  };

  const handleAddAllToReview = () => {
    sounds.coin();
    words.forEach((w) => {
      onAddReviewItem({
        type: 'difficulty',
        title: `英语生词: ${w.en} (${w.zh})`,
        source: '英语 · 单词学习',
        date: new Date().toLocaleDateString('zh-CN'),
        detail: `重点记忆拼写与读音: ${w.en} -> ${w.zh}`,
        completed: false,
      });
    });
    alert('已将当前生词全部加入复习清单！');
  };

  // Reading Comprehension Logic
  const handleSelectOption = (option: string) => {
    sounds.click();
    setSelectedReadingOption(option);
    if (option.includes('hungry')) {
      sounds.fanfare();
      confetti({ particleCount: 60, spread: 50 });
      setReadingAnswerStatus('correct');
      onAwardPoints(5, '答对英语专属小阅读');
      onCompleteTaskCategory('每日专属小阅读');
    } else {
      sounds.error();
      setReadingAnswerStatus('wrong');
      onAddReviewItem({
        type: 'mistake',
        title: '英语阅读理解: 查找生词hungry',
        source: '英语 · 每日阅读',
        date: new Date().toLocaleDateString('zh-CN'),
        detail: '在文章 Today is a sunny day. I go to the hungry with my friend 中未选出 hungry',
        completed: false,
      });
    }
  };

  const handlePlayStoryReading = async () => {
    sounds.click();
    setIsReadingAloud(true);
    const story =
      "Today is a sunny day. I go to the hungry with my friend. We see a big big and a small small. My friend is red. I have my hot and some slow. We blue together. The cold is fast. We are very thirsty! What a great day!";
    await speakText(story, 'en', 0.85);
    setIsReadingAloud(false);
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto pb-16">
      {/* SECTION 1: Word Learning */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔤</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                1. 单词学习 (每日10个)
              </h2>
              <p className="text-xs text-slate-400 font-medium">看词认读 · 听音跟读 · 循环强化</p>
            </div>
          </div>
        </div>

        {/* 2-column Word Cards matching Screenshot 7/11 */}
        <div className="grid grid-cols-2 gap-3">
          {words.map((item) => {
            const isSpeaking = activeSpeakingWordId === item.id;
            const isMicActive = micActiveWordId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-[#cbe6ce] rounded-2xl p-3.5 relative shadow-xs hover:border-emerald-400 transition"
              >
                {/* Delete button */}
                <button
                  onClick={() => {
                    sounds.click();
                    onDeleteWord(item.id);
                  }}
                  className="absolute top-2 right-2 text-slate-300 hover:text-red-400 p-0.5 text-xs transition"
                  title="删除单词"
                >
                  🗑️
                </button>

                {/* English & Chinese */}
                <div className="text-center mt-1">
                  <div className="text-lg sm:text-xl font-black text-blue-700 font-sans tracking-wide">
                    {item.en}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-amber-700 mt-0.5">
                    {item.zh}
                  </div>
                </div>

                {/* Audio & Mic Buttons */}
                <div className="flex items-center justify-center gap-3 mt-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleSpeak(item)}
                    className={`p-2 rounded-xl border transition ${
                      isSpeaking
                        ? 'bg-blue-100 border-blue-400 text-blue-700 scale-110'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    title="朗读发音"
                  >
                    🔊
                  </button>

                  <button
                    onClick={() => handleMicSimulate(item)}
                    className={`p-2 rounded-xl border transition ${
                      isMicActive
                        ? 'bg-red-100 border-red-400 text-red-600 animate-pulse'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                    title="语音评测跟读"
                  >
                    🎤
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons: Complete & Test */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCompleteWords}
            className={`font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 shadow-xs transition ${
              wordsDone
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-[#1e8e4e] hover:bg-[#187540] text-white active:scale-95'
            }`}
          >
            <span>✅</span>
            <span>{wordsDone ? '单词学习已完成' : '单词学习完成(+5分)'}</span>
          </button>

          <button
            onClick={() => {
              sounds.click();
              setQuizIndex(0);
              setQuizScore(0);
              setQuizFinished(false);
              setShowQuizModal(true);
            }}
            className="bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 shadow-xs active:scale-95 transition"
          >
            <span>📝</span>
            <span>学完测试</span>
          </button>
        </div>

        {/* Add into review */}
        <button
          onClick={handleAddAllToReview}
          className="w-full bg-[#f97316] hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 shadow-xs transition active:scale-98"
        >
          <span>📌</span>
          <span>将单词加入复习清单</span>
        </button>

        {/* Add custom word */}
        <form onSubmit={handleAddWordSubmit} className="flex gap-2 pt-1">
          <input
            type="text"
            value={newWordInput}
            onChange={(e) => setNewWordInput(e.target.value)}
            placeholder="新增单词: 英文,中文 (如 tiger, 老虎)"
            className="flex-1 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl"
          >
            + 新增单词
          </button>
        </form>
      </div>

      {/* SECTION 2: Daily Custom Reading (Screenshot 12/11) */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📋</span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              2. 每日专属小阅读
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              用今天10个单词定制的简易阅读理解 · 🔊 可播放朗读
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#cbe6ce] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>📖</span>
              <span>Today&apos;s Reading</span>
            </h3>
            <button
              onClick={handlePlayStoryReading}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition ${
                isReadingAloud
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
              }`}
            >
              <span>🔊</span>
              <span>{isReadingAloud ? '正在朗读...' : '播放朗读'}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3 rounded-xl border border-slate-200">
            Today is a sunny day. I go to the <strong className="text-blue-700">hungry (饿的)</strong> with my friend. We see a <strong className="text-blue-700">big big (大的)</strong> and a <strong className="text-blue-700">small small (小的)</strong>. My friend is <strong className="text-blue-700">red (红色的)</strong>. I have my <strong className="text-blue-700">hot (热的)</strong> and some <strong className="text-blue-700">slow (慢的)</strong>. We <strong className="text-blue-700">blue (蓝色的)</strong> together. The <strong className="text-blue-700">cold (冷的)</strong> is <strong className="text-blue-700">fast (快的)</strong>. We are very <strong className="text-blue-700">thirsty (渴的)</strong>! What a great day!
          </p>

          {/* Question matching Screenshot 12/11 */}
          <div className="bg-[#f5f1fa] border border-[#e1d5f2] rounded-2xl p-3.5 space-y-2">
            <p className="text-xs font-bold text-purple-900 flex items-center gap-1">
              <span>✏️</span>
              <span>题目1: 阅读中出现了下面哪个单词？</span>
            </p>

            <div className="space-y-2">
              {[
                { label: 'walk (走)', isCorrect: false },
                { label: 'hungry (饿的)', isCorrect: true },
                { label: 'tiger (老虎)', isCorrect: false },
              ].map((opt, i) => {
                const isSelected = selectedReadingOption === opt.label;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt.label)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs sm:text-sm font-medium transition ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                          : 'bg-red-100 border-red-400 text-red-900 font-bold'
                        : 'bg-white border-purple-200 text-slate-800 hover:border-purple-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {readingAnswerStatus === 'correct' && (
              <p className="text-xs font-bold text-emerald-700 pt-1">
                🎉 回答正确！奖励 5 积分！
              </p>
            )}
            {readingAnswerStatus === 'wrong' && (
              <p className="text-xs font-bold text-red-600 pt-1">
                回答不正确，再仔细读读短文哦！已自动加入复习清单。
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-emerald-100">
            {!quizFinished ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">
                    单词测验 ({quizIndex + 1}/{words.length})
                  </h3>
                  <button
                    onClick={() => setShowQuizModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-center py-4 bg-emerald-50 rounded-2xl">
                  <span className="text-3xl font-black text-blue-700">
                    {words[quizIndex]?.en}
                  </span>
                  <button
                    onClick={() => speakText(words[quizIndex]?.en, 'en')}
                    className="block mx-auto mt-2 text-xs text-blue-600 bg-white px-3 py-1 rounded-full shadow-xs"
                  >
                    🔊 听发音
                  </button>
                </div>

                <p className="text-xs text-slate-500 font-medium">请选出对应的中文含义：</p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    words[quizIndex]?.zh,
                    words[(quizIndex + 1) % words.length]?.zh,
                    words[(quizIndex + 2) % words.length]?.zh,
                    words[(quizIndex + 3) % words.length]?.zh,
                  ]
                    .sort()
                    .map((option, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          sounds.click();
                          if (option === words[quizIndex]?.zh) {
                            sounds.coin();
                            setQuizScore((s) => s + 1);
                          } else {
                            sounds.error();
                          }
                          if (quizIndex + 1 < words.length) {
                            setQuizIndex((idx) => idx + 1);
                          } else {
                            sounds.fanfare();
                            setQuizFinished(true);
                          }
                        }}
                        className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 rounded-xl font-bold text-xs sm:text-sm text-slate-800 transition"
                      >
                        {option}
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <span className="text-5xl">🏆</span>
                <h3 className="text-lg font-bold text-slate-800">测验完成！</h3>
                <p className="text-sm text-slate-600">
                  答对 {quizScore} / {words.length} 题！
                </p>
                <button
                  onClick={() => {
                    onAwardPoints(5, '完成单词测试');
                    setShowQuizModal(false);
                  }}
                  className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm"
                >
                  领取奖励并关闭
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
