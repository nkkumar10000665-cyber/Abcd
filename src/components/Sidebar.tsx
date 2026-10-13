import React from 'react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  reviewCount: number;
  themeColor: 'green' | 'orange';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  reviewCount,
  themeColor,
}) => {
  const isGreen = themeColor === 'green';
  const bgColor = isGreen ? 'bg-[#1b633e]' : 'bg-[#e06716]';
  const activeBg = isGreen ? 'bg-[#288454]' : 'bg-[#f97316]';

  const menuItems: { id: TabType; label: string; icon: string; badge?: number }[] = [
    { id: 'dinosaur', label: '恐龙', icon: '🦕' },
    { id: 'daily', label: '每日打卡', icon: '🏠' },
    { id: 'chinese', label: '语文', icon: '📖' },
    { id: 'math', label: '数学', icon: '🔢' },
    { id: 'english', label: '英语', icon: '🇬🇧' },
    { id: 'sports', label: '运动', icon: '🏃' },
    { id: 'games', label: '闯关', icon: '🎮' },
    { id: 'points', label: '积分', icon: '🎁' },
    { id: 'review', label: '复习', icon: '🔄', badge: reviewCount },
  ];

  return (
    <aside
      className={`w-18 sm:w-20 md:w-22 flex-shrink-0 ${bgColor} text-white flex flex-col items-center py-3 select-none transition-colors duration-300 shadow-md z-20`}
    >
      <div className="flex flex-col items-center w-full space-y-1.5 sm:space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center w-14 sm:w-16 py-2 rounded-xl sm:rounded-2xl transition-all duration-150 ${
                isActive
                  ? `${activeBg} shadow-inner scale-105 font-bold`
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-300 rounded-r-full" />
              )}
              <span className="text-xl sm:text-2xl mb-0.5 filter drop-shadow">
                {item.icon}
              </span>
              <span className="text-[11px] sm:text-xs leading-none tracking-tight">
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight shadow">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
