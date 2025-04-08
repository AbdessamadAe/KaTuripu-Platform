"use client";

import React from 'react';
import { useGamification } from '@/contexts/GamificationContext';

const UserProfile: React.FC = () => {
  const { state, getCurrentLevel, getProgressToNextLevel } = useGamification();
  const currentLevel = getCurrentLevel();
  const progress = getProgressToNextLevel();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Level and Streak Badge */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="text-4xl">{currentLevel.badge}</div>
          <div>
            <h3 className="font-bold text-lg">{currentLevel.title}</h3>
            <p className="text-sm text-gray-600">المستوى {currentLevel.level}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-orange-100 px-3 py-1 rounded-full">
          <span className="text-lg mr-1">🔥</span>
          <span className="font-medium text-orange-700">{state.streak} أيام متتالية</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{state.points} نقطة</span>
          {progress.percentage < 100 && (
            <span className="text-gray-600">{progress.current}/{progress.next} إلى المستوى التالي</span>
          )}
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
      
      {/* Achievements */}
      <div>
        <h3 className="font-bold text-lg mb-3">الإنجازات</h3>
        <div className="grid grid-cols-2 gap-3">
          {state.achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-3 rounded-lg border ${
                achievement.unlocked 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50 opacity-70'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">
            {Object.keys(state.exercisesCompleted).length}
          </div>
          <div className="text-xs text-gray-600">تمارين مكتملة</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">
            {state.roadmapsStarted.length}
          </div>
          <div className="text-xs text-gray-600">خرائط مبدوءة</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">
            {state.roadmapsCompleted.length}
          </div>
          <div className="text-xs text-gray-600">خرائط مكتملة</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 