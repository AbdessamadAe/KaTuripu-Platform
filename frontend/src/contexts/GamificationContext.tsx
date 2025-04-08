"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from "next-auth/react";

// Define types for gamification elements
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: Date;
};

export type Level = {
  level: number;
  minPoints: number;
  title: string;
  badge: string;
};

export type GamificationState = {
  points: number;
  streak: number;
  lastActivity: string | null;
  achievements: Achievement[];
  level: number;
  roadmapsStarted: string[];
  roadmapsCompleted: string[];
  exercisesCompleted: { [key: string]: boolean };
  lastVisit: string;
};

export type BadgeEventType = {
  type: 'achievement' | 'level' | 'points';
  message: string;
  icon?: string;
};

// Predefined levels
const LEVELS: Level[] = [
  { level: 1, minPoints: 0, title: "مبتدئ", badge: "🌱" },
  { level: 2, minPoints: 100, title: "متعلم", badge: "📚" },
  { level: 3, minPoints: 250, title: "طالب مجتهد", badge: "✏️" },
  { level: 4, minPoints: 500, title: "باحث", badge: "🔍" },
  { level: 5, minPoints: 1000, title: "عالم", badge: "🧠" },
  { level: 6, minPoints: 2000, title: "خبير", badge: "🏆" },
];

// Predefined achievements
const PREDEFINED_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_exercise',
    title: 'الخطوة الأولى',
    description: 'أكملت أول تمرين',
    icon: '🚀',
    unlocked: false
  },
  {
    id: 'first_roadmap',
    title: 'إنجاز مسار',
    description: 'أكملت أول خريطة طريق',
    icon: '🏁',
    unlocked: false
  },
  {
    id: 'streak_3',
    title: 'المثابرة',
    description: 'استخدام المنصة لمدة 3 أيام متتالية',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'ten_exercises',
    title: 'عشرة تمارين',
    description: 'أكملت 10 تمارين',
    icon: '💪',
    unlocked: false
  },
  {
    id: 'all_difficulty',
    title: 'متنوع المهارات',
    description: 'أكملت تمارين من جميع مستويات الصعوبة',
    icon: '🌟',
    unlocked: false
  }
];

type GamificationContextType = {
  state: GamificationState;
  addPoints: (points: number, reason: string) => void;
  completeExercise: (exerciseId: string) => void;
  startRoadmap: (roadmapId: string) => void;
  completeRoadmap: (roadmapId: string) => void;
  updateStreak: () => void;
  getCurrentLevel: () => Level;
  getProgressToNextLevel: () => { current: number, next: number, percentage: number };
  badgeEvent: BadgeEventType | null;
  clearBadgeEvent: () => void;
};

// Initial state
const initialState: GamificationState = {
  points: 0,
  streak: 0,
  lastActivity: null,
  achievements: PREDEFINED_ACHIEVEMENTS,
  level: 1,
  roadmapsStarted: [],
  roadmapsCompleted: [],
  exercisesCompleted: {},
  lastVisit: new Date().toISOString(),
};

// Create the context
const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Provider component
export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [state, setState] = useState<GamificationState>(initialState);
  const [badgeEvent, setBadgeEvent] = useState<BadgeEventType | null>(null);

  // Load initial state from localStorage or database
  useEffect(() => {
    const loadState = async () => {
      if (session?.user) {
        // Load from database for authenticated users
        try {
          const response = await fetch('/api/gamification/state');
          if (response.ok) {
            const data = await response.json();
            setState(data);
          }
        } catch (error) {
          console.error('Failed to load gamification state:', error);
        }
      } else {
        // Load from localStorage for guest users
        const savedState = localStorage.getItem('gamificationState');
        if (savedState) {
          setState(JSON.parse(savedState));
        }
      }
    };

    loadState();
  }, [session]);

  // Save state to localStorage or database
  useEffect(() => {
    const saveState = async () => {
      if (session?.user) {
        // Save to database for authenticated users
        try {
          await fetch('/api/gamification/state', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(state),
          });
        } catch (error) {
          console.error('Failed to save gamification state:', error);
        }
      } else {
        // Save to localStorage for guest users
        localStorage.setItem('gamificationState', JSON.stringify(state));
      }
    };

    saveState();
  }, [state, session]);

  // Get current level based on points
  const getCurrentLevel = (): Level => {
    const currentLevel = LEVELS.reduce((prev, curr) => {
      return (state.points >= curr.minPoints) ? curr : prev;
    }, LEVELS[0]);
    
    return currentLevel;
  };

  // Calculate progress to next level
  const getProgressToNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const nextLevelIndex = LEVELS.findIndex(level => level.level === currentLevel.level) + 1;
    
    if (nextLevelIndex >= LEVELS.length) {
      // Max level reached
      return { current: 100, next: 100, percentage: 100 };
    }
    
    const nextLevel = LEVELS[nextLevelIndex];
    const currentPoints = state.points - currentLevel.minPoints;
    const pointsToNextLevel = nextLevel.minPoints - currentLevel.minPoints;
    const percentage = Math.min(Math.floor((currentPoints / pointsToNextLevel) * 100), 100);
    
    return { 
      current: currentPoints, 
      next: pointsToNextLevel,
      percentage 
    };
  };

  // Update the user's streak
  const updateStreak = () => {
    const today = new Date();
    const lastVisit = new Date(state.lastVisit);
    
    // Reset time components to compare only dates
    today.setHours(0, 0, 0, 0);
    lastVisit.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let newStreak = state.streak;
    
    if (diffDays === 1) {
      // Consecutive day
      newStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      newStreak = 1;
    }
    
    // Update streak achievements
    if (newStreak >= 7 && !state.achievements.some(a => a.id === 'streak_7')) {
      setState(prev => ({
        ...prev,
        achievements: [...prev.achievements, { id: 'streak_7', title: 'المثابرة طويلة المدى', description: 'استخدام المنصة لمدة 7 أيام متتالية', icon: '🔥', unlocked: false }],
      }));
    }
    if (newStreak >= 30 && !state.achievements.some(a => a.id === 'streak_30')) {
      setState(prev => ({
        ...prev,
        achievements: [...prev.achievements, { id: 'streak_30', title: 'المثابرة طويلة المدى', description: 'استخدام المنصة لمدة 30 يوم متتالية', icon: '🔥', unlocked: false }],
      }));
    }
    
    setState(prev => ({
      ...prev,
      streak: newStreak,
      lastVisit: new Date().toISOString()
    }));
  };

  // Add points and check for level up
  const addPoints = (points: number, reason: string) => {
    const prevLevel = getCurrentLevel().level;
    
    setState(prev => {
      const newPoints = prev.points + points;
      const newState = { ...prev, points: newPoints };
      
      // Check for new level
      const newLevel = LEVELS.reduce((prev, curr) => {
        return (newPoints >= curr.minPoints) ? curr : prev;
      }, LEVELS[0]);
      
      // If level up occurred, show notification
      if (newLevel.level > prevLevel) {
        setBadgeEvent({
          type: 'level',
          message: `ترقية إلى المستوى ${newLevel.level}: ${newLevel.title}`,
          icon: newLevel.badge
        });
      } else if (points > 0) {
        // Show points notification
        setBadgeEvent({
          type: 'points',
          message: `+${points} نقطة${reason ? ` - ${reason}` : ''}`,
          icon: '✨'
        });
      }
      
      return { ...newState, level: newLevel.level };
    });
  };

  // Mark an exercise as completed
  const completeExercise = (exerciseId: string) => {
    if (state.exercisesCompleted[exerciseId]) return;
    
    const exercise = PREDEFINED_ACHIEVEMENTS.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    // Add points based on difficulty
    const points = difficultyPoints[exercise.difficulty] || 10;
    addPoints(points, `إكمال تمرين (${exercise.difficulty})`);
    
    // Track completed exercises by difficulty
    const newCompletedExercises = {
      ...state.exercisesCompleted,
      [exerciseId]: true
    };
    
    // Check for difficulty-based achievements
    const achievementsToAdd = [];
    if (Object.values(newCompletedExercises).filter(Boolean).length >= 5 && !state.achievements.some(a => a.id === `${exercise.difficulty}_master`)) {
      achievementsToAdd.push({ ...exercise, unlocked: false });
    }
    
    // Check for all-difficulty achievement
    const hasAllDifficulties = Object.values(newCompletedExercises).every(Boolean);
    if (hasAllDifficulties && !state.achievements.some(a => a.id === 'all_difficulty')) {
      achievementsToAdd.push({ ...exercise, unlocked: false });
    }
    
    setState(prev => ({
      ...prev,
      exercisesCompleted: newCompletedExercises,
      achievements: [...prev.achievements, ...achievementsToAdd]
    }));
  };

  // Mark a roadmap as started
  const startRoadmap = (roadmapId: string) => {
    setState(prev => {
      if (prev.roadmapsStarted.includes(roadmapId)) return prev;
      
      return {
        ...prev,
        roadmapsStarted: [...prev.roadmapsStarted, roadmapId]
      };
    });
  };

  // Mark a roadmap as completed
  const completeRoadmap = (roadmapId: string) => {
    setState(prev => {
      if (prev.roadmapsCompleted.includes(roadmapId)) return prev;
      
      // Check for first roadmap achievement
      let updatedAchievements = [...prev.achievements];
      if (prev.roadmapsCompleted.length === 0) {
        updatedAchievements = updatedAchievements.map(a => 
          a.id === 'first_roadmap' ? { ...a, unlocked: true, date: new Date() } : a
        );
        
        setBadgeEvent({
          type: 'achievement',
          message: 'أنجزت: إنجاز مسار',
          icon: '🏁'
        });
      }
      
      // Add points for completing roadmap
      addPoints(100, 'إكمال خريطة');
      
      return {
        ...prev,
        roadmapsCompleted: [...prev.roadmapsCompleted, roadmapId],
        achievements: updatedAchievements
      };
    });
  };

  // Clear badge event
  const clearBadgeEvent = () => {
    setBadgeEvent(null);
  };

  return (
    <GamificationContext.Provider value={{
      state,
      addPoints,
      completeExercise,
      startRoadmap,
      completeRoadmap,
      updateStreak,
      getCurrentLevel,
      getProgressToNextLevel,
      badgeEvent,
      clearBadgeEvent
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

// Custom hook to use the gamification context
export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}; 