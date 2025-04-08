"use client";

import React, { useEffect, useState } from 'react';
import { useGamification, BadgeEventType } from '@/contexts/GamificationContext';

const BadgeNotification: React.FC = () => {
  const { badgeEvent, clearBadgeEvent } = useGamification();
  const [visible, setVisible] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<BadgeEventType | null>(null);
  
  useEffect(() => {
    if (badgeEvent) {
      setCurrentBadge(badgeEvent);
      setVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(clearBadgeEvent, 500); // Clear after exit animation
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [badgeEvent, clearBadgeEvent]);
  
  if (!currentBadge) return null;
  
  return (
    <div 
      className={`fixed top-24 right-4 z-50 transition-all duration-500 transform ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`
        rounded-lg p-4 shadow-lg flex items-center gap-3 max-w-xs
        ${currentBadge.type === 'achievement' ? 'bg-yellow-500 text-yellow-900' : 
          currentBadge.type === 'level' ? 'bg-purple-500 text-purple-900' : 
          'bg-blue-500 text-blue-900'}
      `}>
        {currentBadge.icon && (
          <div className="text-3xl">{currentBadge.icon}</div>
        )}
        <div className="flex-1">
          <p className="font-bold text-white">{currentBadge.message}</p>
        </div>
        <button 
          onClick={() => {
            setVisible(false);
            setTimeout(clearBadgeEvent, 500);
          }}
          className="text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default BadgeNotification; 