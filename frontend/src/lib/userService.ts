// src/lib/userService.ts
import supabase from './supabase';

export interface UserProgress {
  completedExercises: string[];
}

/**
 * Fetch user progress data
 * @param userId User ID
 * @returns User progress data or null if not found
 */
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  if (!userId) return null;
  
  // Check if we're running in a browser environment where cache is available
  const isBrowser = typeof window !== 'undefined';
  
  // Use memory cache with TTL for server-side or non-browser environments
  const cacheKey = `user_progress_${userId}`;
  
  if (isBrowser) {
    // Try to get from session storage first (for browser environments)
    try {
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = Date.now();
        // Cache is valid for 2 minutes (120000ms)
        if (now - timestamp < 120000) {
          return data;
        }
        // Cache expired, continue to fetch new data
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
      // Continue with fetch on cache error
    }
  }
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('completedExercises')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
    
    const progressData = {
      completedExercises: data.completedExercises || []
    };
    
    // Update cache if in browser environment
    if (isBrowser) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: progressData,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error writing to cache:', error);
      }
    }
    
    return progressData;
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    return null;
  }
};

/**
 * Update completed exercises
 * @param userId User ID
 * @param completedExercises New array of completed exercise IDs
 * @returns Success status
 */
export const updateUserProgress = async (
  userId: string, 
  completedExercises: string[]
): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from('users')
      .update({
        completedExercises
      })
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating user progress:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserProgress:', error);
    return false;
  }
};

/**
 * Mark an exercise as completed
 * @param userId User ID
 * @param exerciseId Exercise ID to mark as completed
 * @returns Success status and updated user progress
 */
export const completeExercise = async (
  userId: string,
  exerciseId: string,
): Promise<{ success: boolean; progress: UserProgress | null }> => {
  if (!userId || !exerciseId) {
    return { success: false, progress: null };
  }
  
  try {
    // Get current user progress
    const currentProgress = await getUserProgress(userId);
    
    if (!currentProgress) {
      return { success: false, progress: null };
    }
    
    // Check if exercise is already completed
    if (currentProgress.completedExercises.includes(exerciseId)) {
      return { success: true, progress: currentProgress };
    }
    
    // Mark exercise as completed
    const updatedProgress: UserProgress = {
      completedExercises: [...currentProgress.completedExercises, exerciseId]
    };
    
    // Update in database
    const success = await updateUserProgress(
      userId,
      updatedProgress.completedExercises
    );
    
    // If successful, update the local cache to avoid refetching
    if (success && typeof window !== 'undefined') {
      try {
        const cacheKey = `user_progress_${userId}`;
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: updatedProgress,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error updating cache after completion:', error);
      }
    }
    
    return {
      success,
      progress: success ? updatedProgress : currentProgress
    };
  } catch (error) {
    console.error('Error in completeExercise:', error);
    return { success: false, progress: null };
  }
};

/**
 * Remove an exercise from completed list
 * @param userId User ID
 * @param exerciseId Exercise ID to unmark
 * @returns Success status and updated user progress
 */
export const uncompleteExercise = async (
  userId: string,
  exerciseId: string,
): Promise<{ success: boolean; progress: UserProgress | null }> => {
  if (!userId || !exerciseId) {
    return { success: false, progress: null };
  }
  
  try {
    // Get current user progress
    const currentProgress = await getUserProgress(userId);
    
    if (!currentProgress) {
      return { success: false, progress: null };
    }

    // If the exercise wasn't in the completed list, no action needed
    if (!currentProgress.completedExercises.includes(exerciseId)) {
      return { success: true, progress: currentProgress };
    } 
    // Remove exercise from completed list
    const updatedProgress: UserProgress = {
      completedExercises: currentProgress.completedExercises.filter(id => id !== exerciseId)
    };
    
    // Update in database
    const success = await updateUserProgress(
      userId,
      updatedProgress.completedExercises
    );
    
    // If successful, update the local cache to avoid refetching
    if (success && typeof window !== 'undefined') {
      try {
        const cacheKey = `user_progress_${userId}`;
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: updatedProgress,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error updating cache after unmarking completion:', error);
      }
    }
    
    return {
      success,
      progress: success ? updatedProgress : currentProgress
    };
  } catch (error) {
    console.error('Error in uncompleteExercise:', error);
    return { success: false, progress: null };
  }
};

/**
 * Get user progress for a specific roadmap
 * @param userId User ID
 * @param roadmapNodes Array of nodes in a roadmap
 * @returns An object with totalExercises, completedExercises and progress percentage
 */
export const getRoadmapProgress = async (
  userId: string,
  roadmapNodes: any[]
): Promise<{ total: number, completed: number, percentage: number }> => {
  if (!userId || !roadmapNodes?.length) {
    return { total: 0, completed: 0, percentage: 0 };
  }
  
  try {
    const progress = await getUserProgress(userId);
    
    if (!progress) {
      return { total: 0, completed: 0, percentage: 0 };
    }
    
    let total = 0;
    let completed = 0;
    
    // Count exercises and check if they're completed
    roadmapNodes.forEach(node => {
      if (node.exercises && Array.isArray(node.exercises)) {
        node.exercises.forEach((exercise: any) => {
          total++;
          if (progress.completedExercises.includes(exercise.id)) {
            completed++;
          }
        });
      }
    });
    
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    return { total, completed, percentage };
  } catch (error) {
    console.error('Error in getRoadmapProgress:', error);
    return { total: 0, completed: 0, percentage: 0 };
  }
};