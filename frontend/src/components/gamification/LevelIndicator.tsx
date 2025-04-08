"use client";

import React from 'react';
import Link from 'next/link';
import { useGamification } from '@/contexts/GamificationContext';

const LevelIndicator: React.FC = () => {
  const { state, getCurrentLevel, getProgressToNextLevel } = useGamification();
  const currentLevel = getCurrentLevel();
  const progress = getProgressToNextLevel();

  return (
    <Link href="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className="bg-white/10 rounded-full w-10 h-10 flex items-center justify-center text-xl">
        {currentLevel.badge}
      </div>
      <div>
        <div className="flex items-center">
          <span className="text-sm font-medium">{state.points} نقطة</span>
        </div>
        <div className="h-1.5 w-20 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-400 transition-all"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

export default LevelIndicator; 