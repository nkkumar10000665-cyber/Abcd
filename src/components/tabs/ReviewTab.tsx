import React, { useState } from 'react';
import { ReviewItem } from '../../types';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface ReviewTabProps {
  items: ReviewItem[];
  onCompleteItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onCompleteAllCategory: (type: 'mistake' | 'difficulty') => void;
  onClearCategory: (type: 'mistake' | 'difficulty') => void;
  onAwardPoints: (points: number, reason: string) => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  items,
  onCompleteItem,
  onDeleteItem,
  onCompleteAllCategory,
  onClearCategory,
  onAwardPoints,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mistake' | 'difficulty'>('mistake');
  const [selectedItemDetail, setSelectedItemDetail] = useState<ReviewItem | null>(null);

  const mistakeItems = items.filter((i) => i.type === 'mistake' && !i.completed);
  const difficultyItems = items.filter((i) => i.type === 'difficulty' && !i.completed);

  const currentList = activeSubTab === 'mistake' ? mistakeItems : difficultyItems;

  const handleMasterClick = (item: ReviewItem) => {
    sounds.success();
    confetti({ particleCount: 50, spread: 50 });
    onCompleteItem(item.id);
    onAwardPoints(3, `巩固掌握复习题：${item.title}`);
  };

  const handleCompleteAll = () => {
    sounds.fanfare();
    confetti({ particleCount: 80, spread: 60 });
    onCompleteAllCategory(activeSubTab);
    onAwardPoints(10, `攻克全部${activeSubTab === 'mistake' ? '错题' : '难点'}`);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-16">
      {/* Top Review Summary Card matching Screenshot 1/11 & 3/11 */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-5 text-center shadow-xs space-y-2">
        <div className="inline-flex items-center justify-center gap-2">
          <span className="text-2xl bg-slate-200/60 p-2 rounded-xl">🔄</span>
          <h2 className="text-xl font-bold text-slate-800">复习清单</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          收纳标记为难点、不通过、听写错误、学习不熟的全部学习条目
        </p>

        <div className="pt-1">
          <span className="text-sm font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-4 py-1.5 rounded-full inline-block">
            错题 {mistakeItems.length} 条 · 难点 {difficultyItems.length} 条
          </span>
        </div>
      </div>

      {/* Sub Tabs: 错题复习 vs 难点复习 matching Screenshot 1/11 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            sounds.click();
            setActiveSubTab('mistake');
          }}
          className={`py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'mistake'
              ? 'bg-white text-slate-900 shadow-md border-2 border-emerald-500 scale-102'
              : 'bg-white/70 text-slate-500 hover:bg-white border border-slate-200'
          }`}
        >
          <span>📌</span>
          <span>错题复习 ({mistakeItems.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.click();
            setActiveSubTab('difficulty');
          }}
          className={`py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
            activeSubTab === 'difficulty'
              ? 'bg-white text-slate-900 shadow-md border-2 border-emerald-500 scale-102'
              : 'bg-white/70 text-slate-500 hover:bg-white border border-slate-200'
          }`}
        >
          <span>🔥</span>
          <span>难点复习 ({difficultyItems.length})</span>
        </button>
      </div>

      {/* List Content */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          // Empty State matching Screenshot 14/11
          <div className="bg-white border border-[#d8edd9] rounded-3xl p-8 text-center space-y-3 shadow-xs">
            <div className="text-5xl animate-float">📬</div>
            <h3 className="text-base font-bold text-slate-800">
              暂无{activeSubTab === 'mistake' ? '错题' : '难点'}内容
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              数学批改、英语测试、语文听写中做错或标记的题目会自动收集到这里
            </p>
          </div>
        ) : (
          currentList.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#cbe6ce] rounded-2xl p-4 shadow-xs flex items-center justify-between hover:border-emerald-400 transition"
            >
              <div className="flex items-start space-x-3 flex-1">
                <span className="text-2xl mt-0.5">
                  {item.type === 'mistake' ? '❌' : '🔥'}
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    来源: {item.source} · {item.date}
                  </p>
                </div>
              </div>

              {/* Action buttons: Mark Mastered, View, Delete matching Screenshot 1/11 */}
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <button
                  onClick={() => handleMasterClick(item)}
                  className="w-8 h-8 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm shadow-xs transition"
                  title="标记为已掌握"
                >
                  ✅
                </button>

                <button
                  onClick={() => {
                    sounds.click();
                    setSelectedItemDetail(item);
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm shadow-xs transition"
                  title="查看详情解析"
                >
                  👁️
                </button>

                <button
                  onClick={() => {
                    sounds.click();
                    onDeleteItem(item.id);
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center text-xs shadow-xs transition"
                  title="删除"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Management Card matching Screenshot 1/11 & 14/11 */}
      <div className="bg-white border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚙️</span>
          <h3 className="text-sm sm:text-base font-bold text-slate-800">复习管理</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCompleteAll}
            disabled={currentList.length === 0}
            className="bg-[#1e8e4e] hover:bg-[#187540] disabled:opacity-50 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 active:scale-98 transition"
          >
            <span>✅</span>
            <span>本类全部完成</span>
          </button>

          <button
            onClick={() => {
              sounds.click();
              if (window.confirm('确定要清空本类所有条目吗？')) {
                onClearCategory(activeSubTab);
              }
            }}
            disabled={currentList.length === 0}
            className="bg-[#ea4c46] hover:bg-[#d93f39] disabled:opacity-50 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 active:scale-98 transition"
          >
            <span>🗑️</span>
            <span>清空本类</span>
          </button>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-emerald-100 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {selectedItemDetail.type === 'mistake' ? '错题解析' : '难点指引'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedItemDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedItemDetail.detail || '暂无详细备忘，请巩固基础知识点并重新练习。'}
            </div>

            <p className="text-[11px] text-slate-400">
              记录时间：{selectedItemDetail.date} · 来源：{selectedItemDetail.source}
            </p>

            <button
              onClick={() => {
                handleMasterClick(selectedItemDetail);
                setSelectedItemDetail(null);
              }}
              className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-xs"
            >
              ✅ 已完全掌握，移出复习本
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
