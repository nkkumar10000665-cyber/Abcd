import React, { useState, useRef, useEffect } from 'react';
import { DictationWord, ReviewItem } from '../../types';
import { speakText, dictateWordThreeTimes } from '../../utils/speech';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface ChineseTabProps {
  dictationWords: DictationWord[];
  onAddReviewItem: (item: Omit<ReviewItem, 'id'>) => void;
  onAwardPoints: (points: number, reason: string) => void;
  onCompleteTaskCategory: (categoryTitle: string) => void;
}

export const ChineseTab: React.FC<ChineseTabProps> = ({
  dictationWords,
  onAddReviewItem,
  onAwardPoints,
  onCompleteTaskCategory,
}) => {
  // Recitation Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Recitation checkboxes
  const [autoNext, setAutoNext] = useState(true);
  const [repeatTomorrow, setRepeatTomorrow] = useState(true);
  const [autoAddToReview, setAutoAddToReview] = useState(true);

  // Dictation state
  const [showPinyin, setShowPinyin] = useState(true);
  const [isDictatingLoop, setIsDictatingLoop] = useState(false);
  const [currentDictatingIndex, setCurrentDictatingIndex] = useState<number | null>(null);
  const [dictationRepeatCount, setDictationRepeatCount] = useState<number>(1);
  const [wrongWordIds, setWrongWordIds] = useState<string[]>([]);
  const [dictationDone, setDictationDone] = useState(false);

  // Reading timer (15 mins)
  const [readingTimeLeft, setReadingTimeLeft] = useState(15 * 60);
  const [readingTimerActive, setReadingTimerActive] = useState(false);

  // Format seconds to MM : SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  // Recording Logic
  const startRecording = async () => {
    sounds.click();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      // Fallback simulated recording if mic access isn't allowed in iframe
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    sounds.click();
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const playRecordedAudio = () => {
    sounds.click();
    if (audioUrl) {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(audioUrl);
      } else {
        audioPlayerRef.current.src = audioUrl;
      }
      setIsPlayingAudio(true);
      audioPlayerRef.current.play();
      audioPlayerRef.current.onended = () => setIsPlayingAudio(false);
    } else {
      // Simulated playback voice
      speakText('一道残阳铺水中，半江瑟瑟半江红。可怜九月初三夜，露似珍珠月似弓。', 'zh', 0.9);
    }
  };

  const handleRecitationFail = () => {
    sounds.error();
    if (autoAddToReview) {
      onAddReviewItem({
        type: 'mistake',
        title: '背诵: 《暮江吟》',
        source: '语文 · 课本必背',
        date: new Date().toLocaleDateString('zh-CN'),
        detail: '九月初三夜，露似珍珠月似弓背诵不熟练，次日需复查',
        completed: false,
      });
    }
    alert('已记录为"次日继续"，并自动加入复习清单！');
  };

  const handleRecitationPass = () => {
    sounds.fanfare();
    confetti({ particleCount: 80, spread: 60 });
    onAwardPoints(5, '课本背诵通关');
    onCompleteTaskCategory('课本背诵');
  };

  // Dictation Voice Control
  const handleStartDictationLoop = async () => {
    sounds.click();
    if (isDictatingLoop) {
      setIsDictatingLoop(false);
      window.speechSynthesis?.cancel();
      return;
    }

    setIsDictatingLoop(true);
    for (let i = 0; i < dictationWords.length; i++) {
      setCurrentDictatingIndex(i);
      const word = dictationWords[i];
      await dictateWordThreeTimes(word.word, (c) => setDictationRepeatCount(c));
      await new Promise((r) => setTimeout(r, 1500));
    }
    setIsDictatingLoop(false);
    setCurrentDictatingIndex(null);
    sounds.success();
  };

  const toggleWrongWord = (id: string) => {
    sounds.click();
    if (wrongWordIds.includes(id)) {
      setWrongWordIds(wrongWordIds.filter((x) => x !== id));
    } else {
      setWrongWordIds([...wrongWordIds, id]);
    }
  };

  const handleFinishDictation = () => {
    sounds.fanfare();
    setDictationDone(true);
    confetti({ particleCount: 70, spread: 60 });
    onAwardPoints(5, '词语听写完成');
    onCompleteTaskCategory('词语听写');

    // Add wrong words to review
    if (wrongWordIds.length > 0) {
      const wrongList = dictationWords
        .filter((w) => wrongWordIds.includes(w.id))
        .map((w) => w.word)
        .join('、');
      onAddReviewItem({
        type: 'mistake',
        title: `听写错词: ${wrongList}`,
        source: '语文 · 词语听写',
        date: new Date().toLocaleDateString('zh-CN'),
        detail: `三四年级重点词语写错：${wrongList}，需重新抄写订正`,
        completed: false,
      });
    }
  };

  // Reading Timer Effect
  useEffect(() => {
    let interval: number | null = null;
    if (readingTimerActive && readingTimeLeft > 0) {
      interval = window.setInterval(() => {
        setReadingTimeLeft((t) => t - 1);
      }, 1000);
    } else if (readingTimeLeft === 0) {
      sounds.fanfare();
      onAwardPoints(5, '完成课外阅读15分钟');
      onCompleteTaskCategory('课外读书');
      setReadingTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [readingTimerActive, readingTimeLeft, onAwardPoints, onCompleteTaskCategory]);

  return (
    <div className="space-y-5 max-w-xl mx-auto pb-16">
      {/* SECTION 1: Recitation */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Title */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📜</span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            1. 课本必背内容 (第1段)
          </h2>
        </div>

        {/* Poem Card */}
        <div className="bg-white border border-[#cbe6ce] rounded-2xl p-4 sm:p-5 shadow-xs relative">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">《暮江吟》</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                作者: 白居易 · 类型: 古诗
              </p>
            </div>
            <button
              onClick={() => speakText('暮江吟。白居易。一道残阳铺水中，半江瑟瑟半江红。可怜九月初三夜，露似珍珠月似弓。', 'zh')}
              className="p-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-sm flex items-center gap-1"
              title="示范朗读"
            >
              <span>🔊</span>
              <span className="text-xs font-semibold">示范</span>
            </button>
          </div>

          <div className="mt-3.5 space-y-1 text-center font-medium text-slate-800 text-sm sm:text-base leading-relaxed tracking-wider py-1 bg-emerald-50/30 rounded-xl">
            <p>一道残阳铺水中，半江瑟瑟半江红。</p>
            <p>可怜九月初三夜，露似珍珠月似弓。</p>
          </div>
        </div>

        {/* Recording Panel */}
        <div className="bg-[#eef5fc] border border-[#d0e3f7] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
            <span>🎤</span>
            <span>背诵录音 (录完回放，检查是否背对、字音是否读对)</span>
          </div>

          {/* Record and Play buttons */}
          <div className="flex items-center gap-3">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl shadow flex items-center justify-center gap-1.5 animate-pulse text-sm"
              >
                <span>⏹️</span>
                <span>停止录音</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="flex-1 bg-[#ea4c46] hover:bg-[#d93f39] text-white font-bold py-2.5 px-4 rounded-xl shadow flex items-center justify-center gap-1.5 text-sm active:scale-95 transition"
              >
                <span>🎤</span>
                <span>开始录音</span>
              </button>
            )}

            <button
              onClick={playRecordedAudio}
              className={`flex-1 ${
                isPlayingAudio ? 'bg-blue-700' : 'bg-[#3b82f6] hover:bg-blue-600'
              } text-white font-bold py-2.5 px-4 rounded-xl shadow flex items-center justify-center gap-1.5 text-sm active:scale-95 transition`}
            >
              <span>{isPlayingAudio ? '🔊' : '▶️'}</span>
              <span>播放录音</span>
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center py-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-900 tracking-widest font-mono">
              {formatTime(recordSeconds)}
            </span>
          </div>

          {/* Instructions */}
          <div className="bg-white/80 rounded-xl p-2.5 text-xs text-slate-600 leading-relaxed border border-blue-100 flex items-start gap-1.5">
            <span className="text-sm">💡</span>
            <p>
              点“开始录音”背诵，录完点“播放录音”回反对照原文：背错点“不通过”，背对点“通关”或“加入复习”巩固。
            </p>
          </div>

          {/* Pass / Fail Action Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleRecitationFail}
              className="flex-1 bg-[#f97316] hover:bg-orange-600 text-white font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-xs active:scale-95 transition flex items-center justify-center gap-1"
            >
              <span>❌</span>
              <span>不通过(次日继续)</span>
            </button>
            <button
              onClick={handleRecitationPass}
              className="flex-1 bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-500 font-bold py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-xs active:scale-95 transition flex items-center justify-center gap-1"
            >
              <span>✅</span>
              <span>背诵通关(+5分)</span>
            </button>
          </div>

          {/* Rules checkboxes */}
          <div className="pt-2 flex flex-wrap gap-3 text-xs text-emerald-900 font-medium">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={autoNext}
                onChange={(e) => setAutoNext(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>通关进入下一段</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={repeatTomorrow}
                onChange={(e) => setRepeatTomorrow(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>不通过次日重复</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAddToReview}
                onChange={(e) => setAutoAddToReview(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>难点自动进入复习清单</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 2: Word Dictation */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✏️</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                2. 词语听写 (每日10个)
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                三四年级重点词语滚动复习，写错/不熟自动加入复习清单
              </p>
            </div>
          </div>
        </div>

        {/* Audio control banner */}
        <div className="bg-[#e9f2fb] rounded-2xl p-3 flex items-center justify-between border border-blue-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔊</span>
            <span className="text-xs sm:text-sm font-bold text-blue-900">
              语音听写 (自动朗读)
            </span>
          </div>
          <span className="text-xs text-blue-700 font-medium">点右侧开始按钮</span>
        </div>

        {/* Start Dictation Loop Button */}
        <button
          onClick={handleStartDictationLoop}
          className={`w-full ${
            isDictatingLoop ? 'bg-orange-600' : 'bg-[#1e8e4e] hover:bg-[#187540]'
          } text-white font-bold py-3 px-4 rounded-2xl shadow-md text-sm sm:text-base flex items-center justify-center gap-2 transition active:scale-98`}
        >
          <span>{isDictatingLoop ? '⏹️ 停止听写' : '🔊 开始听写 (每词读3遍)'}</span>
          {isDictatingLoop && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              第 {dictationRepeatCount}/3 遍
            </span>
          )}
        </button>

        {/* Word Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {dictationWords.map((item, idx) => {
            const isCurrent = currentDictatingIndex === idx;
            const isWrong = wrongWordIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`relative p-2.5 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400 scale-102 shadow-sm'
                    : isWrong
                    ? 'border-red-300 bg-red-50/70'
                    : 'border-slate-200/90 bg-white hover:border-emerald-300'
                }`}
              >
                {/* Delete / Mark Wrong Icon */}
                <button
                  onClick={() => toggleWrongWord(item.id)}
                  title={isWrong ? '取消标记' : '标记为写错/未掌握'}
                  className={`absolute top-1 left-1.5 text-xs font-bold ${
                    isWrong ? 'text-red-500' : 'text-slate-300 hover:text-red-400'
                  }`}
                >
                  {isWrong ? '❌' : '✕'}
                </button>

                {/* Speaker icon */}
                <button
                  onClick={() => speakText(item.word, 'zh')}
                  title="单独读此词"
                  className="absolute top-1 right-1.5 text-xs text-blue-500 hover:text-blue-700 p-0.5"
                >
                  🔊
                </button>

                <div className="mt-2.5">
                  <div className="text-base sm:text-lg font-bold text-slate-800">
                    {item.word}
                  </div>
                  {showPinyin && (
                    <div className="text-[11px] text-emerald-600 font-mono mt-0.5">
                      {item.pinyin}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Dictation Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1"
          >
            <span>👁️</span>
            <span>{showPinyin ? '隐藏拼音' : '显示拼音'}</span>
          </button>
          <button
            onClick={handleFinishDictation}
            className={`font-bold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 shadow-xs transition ${
              dictationDone
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
          >
            <span>✅</span>
            <span>{dictationDone ? '听写已完成' : '听写完成(+5分)'}</span>
          </button>
        </div>

        {wrongWordIds.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-700 flex items-center justify-between">
            <span>已标记 {wrongWordIds.length} 个写错词语</span>
            <button
              onClick={() => {
                const words = dictationWords.filter((w) => wrongWordIds.includes(w.id));
                words.forEach((w) =>
                  onAddReviewItem({
                    type: 'mistake',
                    title: `词语听写: ${w.word}`,
                    source: '语文 · 词语听写',
                    date: new Date().toLocaleDateString('zh-CN'),
                    detail: `写错词：${w.word} (${w.pinyin})`,
                    completed: false,
                  })
                );
                sounds.coin();
                alert('已全部加入复习清单！');
              }}
              className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-xs hover:bg-red-700"
            >
              一键加入复习
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: Idiom Story */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📚</span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">
            3. 每日成语故事
          </h2>
        </div>

        <div className="bg-white border border-[#cbe6ce] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1">
              <span>画蛇添足</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                成语典故
              </span>
            </h3>
            <button
              onClick={() =>
                speakText(
                  '画蛇添足。古代楚国有人祭祀，赏给门客一壶酒。门客们商量说：大家一起喝不够，一个人喝才够。我们各自在地上画蛇，先画好的人喝这壶酒。一人先画好，拿起酒壶，看别人还没画完，便左手拿着酒壶，右手又在地上画：我还能给蛇添上脚呢！还没等他画完，另一个人已经画好了，夺过酒壶说：蛇本来没有脚，你怎能添上脚呢？说完就喝干了酒。那个给蛇添脚的人最终失去了酒。'
                )
              }
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
            >
              <span>🔊</span>
              <span>朗读故事</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed indent-5 pt-1">
            古代楚国有人祭祀，赏给门客一壶酒。门客们商量说：“大家一起喝不够，一个人喝才够。我们各自在地上画蛇，先画好的人喝这壶酒。”
            一人先画好，拿起酒壶，看别人还没画完，便左手拿着酒壶，右手又在地上画：“我还能给蛇添上脚呢！”
            还没等他画完，另一个人已经画好了，夺过酒壶说：“蛇本来没有脚，你怎能添上脚呢？”
            说完就喝干了酒。
          </p>

          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-amber-800 bg-amber-50/60 p-2.5 rounded-xl">
            💡 <strong>成语寓意：</strong> 做事不可自作聪明、多此一举，否则反而把事情弄糟。
          </div>
        </div>
      </div>

      {/* SECTION 4: Reading Timer */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⏱️</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                4. 课外读书 15分钟计时
              </h2>
              <p className="text-xs text-slate-400 font-medium">培养每日专注自主阅读习惯</p>
            </div>
          </div>
          <span className="text-lg font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
            {formatTime(readingTimeLeft)}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              sounds.click();
              setReadingTimerActive(!readingTimerActive);
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xs transition ${
              readingTimerActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {readingTimerActive ? '⏸️ 暂停阅读' : '▶️ 开始专注阅读'}
          </button>
          <button
            onClick={() => {
              sounds.click();
              setReadingTimerActive(false);
              setReadingTimeLeft(15 * 60);
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-semibold"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
};
