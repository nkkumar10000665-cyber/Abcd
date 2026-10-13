import React, { useState } from 'react';
import { MathQuestion, ReviewItem } from '../../types';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface MathTabProps {
  onAddReviewItem: (item: Omit<ReviewItem, 'id'>) => void;
  onAwardPoints: (points: number, reason: string) => void;
  onCompleteTaskCategory: (categoryTitle: string) => void;
}

// Generates 40 realistic math questions matching screenshot 6/11
function generate40Questions(): MathQuestion[] {
  const templates = [
    { expr: '(5+3)×60=', ans: 480 },
    { expr: '179+96=', ans: 275 },
    { expr: '7×80=', ans: 560 },
    { expr: '2×9+26=', ans: 44 },
    { expr: '27+237=', ans: 264 },
    { expr: '136+214=', ans: 350 },
    { expr: '91×2=', ans: 182 },
    { expr: '221+324=', ans: 545 },
    { expr: '48×3=', ans: 144 },
    { expr: '292-271=', ans: 21 },
    { expr: '98×2=', ans: 196 },
    { expr: '71×9=', ans: 639 },
    { expr: '3×8+48=', ans: 72 },
    { expr: '483-417=', ans: 66 },
    { expr: '207÷3=', ans: 69 },
    { expr: '9×45=', ans: 405 },
    { expr: '55+145=', ans: 200 },
    { expr: '640÷8=', ans: 80 },
    { expr: '15×6=', ans: 90 },
    { expr: '84-39=', ans: 45 },
    { expr: '360÷6=', ans: 60 },
    { expr: '4×25=', ans: 100 },
    { expr: '(12+8)×5=', ans: 100 },
    { expr: '72÷9+12=', ans: 20 },
    { expr: '180+220=', ans: 400 },
    { expr: '350-180=', ans: 170 },
    { expr: '6×14=', ans: 84 },
    { expr: '81÷9×7=', ans: 63 },
    { expr: '120÷4=', ans: 30 },
    { expr: '45+155=', ans: 200 },
    { expr: '100-24×3=', ans: 28 },
    { expr: '16×5=', ans: 80 },
    { expr: '420÷70=', ans: 6 },
    { expr: '88+112=', ans: 200 },
    { expr: '75-28=', ans: 47 },
    { expr: '9×90=', ans: 810 },
    { expr: '63÷7+31=', ans: 40 },
    { expr: '25×4+50=', ans: 150 },
    { expr: '400-165=', ans: 235 },
    { expr: '50×60=', ans: 3000 },
  ];

  return templates.map((item, idx) => ({
    id: idx + 1,
    expr: item.expr,
    answer: item.ans,
    userAnswer: '',
  }));
}

export const MathTab: React.FC<MathTabProps> = ({
  onAddReviewItem,
  onAwardPoints,
  onCompleteTaskCategory,
}) => {
  const [questions, setQuestions] = useState<MathQuestion[]>(generate40Questions());
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Thinking Question State (鸡兔同笼)
  const [chickenInput, setChickenInput] = useState('');
  const [rabbitInput, setRabbitInput] = useState('');
  const [showThinkingAnswer, setShowThinkingAnswer] = useState(false);
  const [thinkingResult, setThinkingResult] = useState<'correct' | 'wrong' | null>(null);

  const handleInputChange = (id: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, userAnswer: val.trim() } : q))
    );
  };

  const handleCheckAll = () => {
    sounds.click();
    let correctCount = 0;
    const wrongList: MathQuestion[] = [];

    const updated = questions.map((q) => {
      const num = Number(q.userAnswer);
      const isOk = q.userAnswer !== '' && num === q.answer;
      if (isOk) {
        correctCount++;
      } else {
        wrongList.push(q);
      }
      return { ...q, isCorrect: isOk };
    });

    setQuestions(updated);
    setChecked(true);
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);

    if (finalScore >= 80) {
      sounds.fanfare();
      confetti({ particleCount: 100, spread: 70 });
      onAwardPoints(10, `数学口算40题获得 ${finalScore} 分`);
    } else {
      sounds.coin();
      onAwardPoints(5, '完成数学口算40题练习');
    }

    onCompleteTaskCategory('计算40题');

    // Automatically add mistakes to review list
    if (wrongList.length > 0) {
      wrongList.slice(0, 5).forEach((item) => {
        onAddReviewItem({
          type: 'mistake',
          title: `口算错题: ${item.expr}`,
          source: '数学 · 计算40题',
          date: new Date().toLocaleDateString('zh-CN'),
          detail: `原题: ${item.expr}，正确答案是 ${item.answer}，学生填写: ${item.userAnswer || '未作答'}`,
          completed: false,
        });
      });
    }
  };

  // Quick fill demo helper so user/reviewer can test instantly
  const handleAutoFill = () => {
    sounds.coin();
    setQuestions((prev) =>
      prev.map((q, idx) => ({
        ...q,
        // Make 38 correct, 2 mistakes for realism
        userAnswer: idx === 1 ? '300' : idx === 9 ? '30' : q.answer.toString(),
      }))
    );
  };

  const handleResetQuestions = () => {
    sounds.click();
    setQuestions(generate40Questions());
    setChecked(false);
    setScore(null);
  };

  const handleCheckThinking = () => {
    sounds.click();
    if (chickenInput === '23' && rabbitInput === '12') {
      sounds.fanfare();
      confetti({ particleCount: 70, spread: 60 });
      setThinkingResult('correct');
      onAwardPoints(5, '解出鸡兔同笼思维题');
      onCompleteTaskCategory('思维拔高');
    } else {
      sounds.error();
      setThinkingResult('wrong');
      onAddReviewItem({
        type: 'difficulty',
        title: '数学拔高: 鸡兔同笼',
        source: '数学 · 思维拔高',
        date: new Date().toLocaleDateString('zh-CN'),
        detail: '35个头，94只脚。假设全是鸡法：(94 - 35*2)/(4-2) = 12只兔，23只鸡',
        completed: false,
      });
    }
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto pb-16">
      {/* SECTION 1: 40 Calculation Questions */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Title & score summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧮</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                1. 计算40题
              </h2>
              <p className="text-xs text-slate-400 font-medium">口算 + 竖式 + 脱式混合</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAutoFill}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-semibold border border-emerald-200 transition"
              title="一键填入参考数据"
            >
              ⚡ 快速自测
            </button>
            <button
              onClick={handleResetQuestions}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold transition"
            >
              🔄 换一批
            </button>
          </div>
        </div>

        {/* Score banner if checked */}
        {checked && score !== null && (
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              score >= 90
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl">{score >= 90 ? '🌟' : '💪'}</span>
              <div>
                <p className="font-bold text-base">口算得分：{score} 分</p>
                <p className="text-xs opacity-80">
                  {score === 100
                    ? '太厉害了！全部答对！奖励10积分！'
                    : '已将做错题目自动同步至【复习清单】错题本！'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2-column Question Grid matching Screenshot 6/11 */}
        <div className="grid grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
          {questions.map((q) => {
            const hasChecked = checked;
            const isCorrect = q.isCorrect;
            return (
              <div
                key={q.id}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition ${
                  hasChecked
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/50'
                      : 'border-red-300 bg-red-50/60'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 font-mono">
                  {q.expr}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={q.userAnswer}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    placeholder="?"
                    className={`w-full text-center font-bold text-sm sm:text-base py-1 px-2 rounded-xl border transition focus:outline-none focus:ring-2 ${
                      hasChecked
                        ? isCorrect
                          ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                          : 'border-red-400 bg-red-100 text-red-900'
                        : 'border-slate-200 bg-slate-50 text-slate-800 focus:ring-emerald-400'
                    }`}
                  />
                  {hasChecked && !isCorrect && (
                    <span className="block text-[10px] text-red-600 font-bold mt-0.5">
                      答: {q.answer}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleCheckAll}
          className="w-full bg-[#1e8e4e] hover:bg-[#187540] active:scale-98 text-white font-bold py-3 rounded-2xl shadow-md text-sm sm:text-base flex items-center justify-center gap-2 transition"
        >
          <span>✏️</span>
          <span>一键批改 40 题 (错题自动入库)</span>
        </button>
      </div>

      {/* SECTION 2: Thinking Problem (鸡兔同笼) */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧠</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                2. 思维拔高 (每日1题)
              </h2>
              <p className="text-xs text-slate-400 font-medium">思维奥数 · 经典拓展</p>
            </div>
          </div>
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
            鸡兔同笼
          </span>
        </div>

        <div className="bg-white border border-[#cbe6ce] rounded-2xl p-4 space-y-3">
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            <strong>题目：</strong>
            有若干只鸡和兔在同一个笼子里，从上面数共有 <strong>35 个头</strong>，从下面数共有 <strong>94 只脚</strong>。求笼中各有几只鸡？几只兔？
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200">
              <label className="text-xs text-slate-600 font-bold block mb-1">
                🐔 鸡的数量:
              </label>
              <input
                type="number"
                value={chickenInput}
                onChange={(e) => setChickenInput(e.target.value)}
                placeholder="填写只数"
                className="w-full text-center py-1 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200">
              <label className="text-xs text-slate-600 font-bold block mb-1">
                🐰 兔的数量:
              </label>
              <input
                type="number"
                value={rabbitInput}
                onChange={(e) => setRabbitInput(e.target.value)}
                placeholder="填写只数"
                className="w-full text-center py-1 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCheckThinking}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs sm:text-sm transition"
            >
              提交检验
            </button>
            <button
              onClick={() => setShowThinkingAnswer(!showThinkingAnswer)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold"
            >
              {showThinkingAnswer ? '隐藏解析' : '💡 查看解析'}
            </button>
          </div>

          {thinkingResult === 'correct' && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-2.5 rounded-xl text-xs font-bold text-center">
              🎉 恭喜你答对啦！鸡 23 只，兔 12 只！获得 5 积分！
            </div>
          )}

          {thinkingResult === 'wrong' && (
            <div className="bg-red-50 border border-red-300 text-red-800 p-2.5 rounded-xl text-xs font-medium text-center">
              答案不对哦，已将“鸡兔同笼”自动加入【复习清单】难点库！
            </div>
          )}

          {showThinkingAnswer && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-1.5 animate-pop">
              <p className="font-bold text-slate-900">📖 思维点拨（假设法）：</p>
              <p>1. 假设笼子里全是鸡：35 × 2 = 70 只脚。</p>
              <p>2. 相比实际脚数少了：94 - 70 = 24 只脚。</p>
              <p>3. 每把1只鸡换成1只兔，增加 4 - 2 = 2 只脚。</p>
              <p>4. 兔子数量 = 24 ÷ 2 = <strong>12 只</strong>。</p>
              <p>5. 鸡的数量 = 35 - 12 = <strong>23 只</strong>。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
