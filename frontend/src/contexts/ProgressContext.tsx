"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as userService from '@/lib/userService';
import { useAuth } from './AuthContext';
import { UserProgress } from '@/lib/userService';
import { RoadmapNodeType } from '@/types/types';

interface ProgressContextType {
  completedExercises: string[];
  isLoading: boolean;
  error: string | null;
  completeExercise: (exerciseId: string) => Promise<boolean>;
  uncompleteExercise: (exerciseId: string) => Promise<boolean>;
  isExerciseCompleted: (exerciseId: string) => boolean;
  getRoadmapProgress: (roadmapNodes: RoadmapNodeType[]) => Promise<{
    total: number;
    completed: number;
    percentage: number;
  }>;
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProgress = useCallback(async () => {
    if (!user?.id) {
      setProgress(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const userProgress = await userService.getUserProgress(user.id);
      setProgress(userProgress);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
      setError('Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch progress data when user changes
  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  const completeExercise = useCallback(
    async (exerciseId: string): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        const result = await userService.completeExercise(user.id, exerciseId);
        if (result.success && result.progress) {
          setProgress(result.progress);
        }
        return result.success;
      } catch (err) {
        console.error('Error completing exercise:', err);
        return false;
      }
    },
    [user?.id]
  );

  const uncompleteExercise = useCallback(
    async (exerciseId: string): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        const result = await userService.uncompleteExercise(user.id, exerciseId);
        if (result.success && result.progress) {
          setProgress(result.progress);
        }
        return result.success;
      } catch (err) {
        console.error('Error uncompleting exercise:', err);
        return false;
      }
    },
    [user?.id]
  );

  const isExerciseCompleted = useCallback(
    (exerciseId: string): boolean => {
      if (!progress) return false;
      return progress.completedExercises.includes(exerciseId);
    },
    [progress]
  );

  const getRoadmapProgress = useCallback(
    async (roadmapNodes: RoadmapNodeType[]) => {
      if (!user?.id) {
        return { total: 0, completed: 0, percentage: 0 };
      }

      try {
        return await userService.getRoadmapProgress(user.id, roadmapNodes);
      } catch (err) {
        console.error('Error getting roadmap progress:', err);
        return { total: 0, completed: 0, percentage: 0 };
      }
    },
    [user?.id]
  );

  const refreshProgress = useCallback(async () => {
    await fetchUserProgress();
  }, [fetchUserProgress]);

  const value = {
    completedExercises: progress?.completedExercises || [],
    isLoading,
    error,
    completeExercise,
    uncompleteExercise,
    isExerciseCompleted,
    getRoadmapProgress,
    refreshProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export default ProgressProvider;
