import React, { useState } from 'react';
import { RewardItem } from '../../types';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

interface PointsTabProps {
  points: number;
  streakDays: number;
  rewards: RewardItem[];
  onRedeemReward: (reward: RewardItem) => boolean;
  onAddReward: (name: string, cost: number, icon: string) => void;
  onDeleteReward: (id: string) => void;
  onResetPoints: () => void;
  redemptionHistory: { id: string; name: string; points: number; date: string }[];
}

export const PointsTab: React.FC<PointsTabProps> = ({
  points,
  streakDays,
  rewards,
  onRedeemReward,
  onAddReward,
  onDeleteReward,
  onResetPoints,
  redemptionHistory,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState(15);
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');
  const [showHistory, setShowHistory] = useState(false);

  const handleRedeemClick = (reward: RewardItem) => {
    sounds.click();
    if (points >= reward.points) {
      const ok = onRedeemReward(reward);
      if (ok) {
        sounds.fanfare();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        alert(`🎉 恭喜你成功兑换【${reward.name}】！快找爸爸妈妈领奖品吧！`);
      }
    } else {
      sounds.error();
      alert(`积分不足哦！兑换【${reward.name}】还需要 ${reward.points - points} 积分，继续加油打卡吧！`);
    }
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardName.trim()) return;
    onAddReward(newRewardName.trim(), Number(newRewardPoints) || 10, newRewardIcon);
    sounds.coin();
    setShowAddModal(false);
    setNewRewardName('');
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-16">
      {/* Top Orange Header Banner matching Screenshot 10/11 & 11/11 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#ff6b2b] via-[#ff7e36] to-[#f9570c] rounded-3xl p-6 text-white text-center shadow-lg">
        <div className="relative z-10">
          <div className="text-6xl sm:text-7xl font-black tracking-tight drop-shadow font-sans">
            {points}
          </div>
          <p className="text-base sm:text-lg font-bold text-white/95 mt-1">
            累计积分
          </p>

          <div className="inline-flex items-center gap-1.5 mt-3.5 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-xs">
            <span>🏆</span>
            <span>连续打卡 {streakDays} 天</span>
          </div>
        </div>
      </div>

      {/* Rules Card matching Screenshot 10/11 */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📋</span>
          <h3 className="text-base sm:text-lg font-bold text-slate-800">打卡规则</h3>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-base font-bold">☑️</span>
            <span>当日全部任务完成 = 获得1积分（各科通关额外奖励5~10分）</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-base font-bold">☑️</span>
            <span>积分永久累计，可随时兑换心仪奖励</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-base font-bold">☑️</span>
            <span>兑换后扣减对应积分，家长发放实体心愿</span>
          </div>
        </div>
      </div>

      {/* Rewards List matching Screenshot 10/11 & 11/11 */}
      <div className="bg-[#f7fcf8] border border-[#d8edd9] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎁</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              奖励阶梯
            </h3>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold"
          >
            {showHistory ? '查看奖励清单' : `兑换记录 (${redemptionHistory.length})`}
          </button>
        </div>

        {!showHistory ? (
          <div className="space-y-2.5">
            {rewards.map((reward) => {
              const canAfford = points >= reward.points;
              return (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:border-emerald-300 transition"
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="text-3xl">{reward.icon}</span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-800">
                        {reward.name}
                      </h4>
                      <p className="text-xs text-amber-600 font-bold">
                        需要 {reward.points} 积分
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Redeem / Lock Button */}
                    <button
                      onClick={() => handleRedeemClick(reward)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95 ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <span>{canAfford ? '🔓 兑换' : '🔒 积分不足'}</span>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        sounds.click();
                        onDeleteReward(reward.id);
                      }}
                      className="text-slate-300 hover:text-red-400 p-1 text-xs"
                      title="删除奖励"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add Reward Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full mt-2 py-3 border-2 border-dashed border-emerald-300 rounded-2xl text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100/50 transition flex items-center justify-center gap-1.5"
            >
              <span>+</span>
              <span>新增奖励心愿</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {redemptionHistory.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">暂无兑换记录，加油打卡赢积分吧！</p>
            ) : (
              redemptionHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">{h.name}</span>
                    <span className="text-slate-400 ml-2">{h.date}</span>
                  </div>
                  <span className="font-bold text-amber-600">-{h.points} 积分</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Management Actions matching Screenshot 10/11 & 11/11 */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <span>⚙️</span>
            <span>管理功能</span>
          </p>
          <button
            onClick={() => {
              if (window.confirm('确定要清零积分吗？（此操作不可恢复）')) {
                sounds.error();
                onResetPoints();
              }
            }}
            className="w-full bg-[#f05252] hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition"
          >
            🗑️ 清零积分
          </button>
        </div>
      </div>

      {/* Add Reward Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop">
          <form
            onSubmit={handleCreateReward}
            className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-emerald-100 space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-base">新增奖励项目</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                奖励名称
              </label>
              <input
                type="text"
                required
                value={newRewardName}
                onChange={(e) => setNewRewardName(e.target.value)}
                placeholder="例如：买一本心仪的漫画、看电影"
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                所需积分
              </label>
              <input
                type="number"
                min={1}
                required
                value={newRewardPoints}
                onChange={(e) => setNewRewardPoints(Number(e.target.value))}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                选择图标
              </label>
              <div className="flex gap-2">
                {['🎁', '🍦', '🧸', '🎮', '🚲', '🍕', '🎬', '📖'].map((ico) => (
                  <button
                    type="button"
                    key={ico}
                    onClick={() => setNewRewardIcon(ico)}
                    className={`text-xl p-1 rounded-lg border ${
                      newRewardIcon === ico ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                    }`}
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs sm:text-sm"
              >
                确认添加
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
