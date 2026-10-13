import React from 'react';

interface HeaderProps {
  themeColor: 'green' | 'orange';
  onToggleTheme: () => void;
  onOpenQuickAdd: () => void;
  onOpenSettings: () => void;
  points: number;
}

export const Header: React.FC<HeaderProps> = ({
  themeColor,
  onToggleTheme,
  onOpenQuickAdd,
  onOpenSettings,
  points,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-emerald-100 px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xl shadow-xs">
          🦕
        </div>
        <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
          <span>恐龙学习工作台</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
            儿童专注版
          </span>
        </h1>
      </div>

      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Points Quick Capsule */}
        <div className="flex items-center bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs">
          <span className="mr-1">🎁</span>
          <span>{points} 分</span>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          title="新增任务"
          className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center font-bold text-lg shadow transition-transform"
        >
          +
        </button>

        {/* Theme Color Switcher */}
        <button
          onClick={onToggleTheme}
          title="切换界面风格(绿色/活力橙)"
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm transition-colors"
        >
          {themeColor === 'green' ? '🟢' : '🟠'}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title="设置与声音"
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs transition-colors"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
};
