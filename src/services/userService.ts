// src/lib/userService.ts
import { createClient } from '@/lib/db/server';
/**
 * ---------------to be removed---------------
 * Fetch user completed exercises
 */
export const getCompletedExercises = async (userId: string): Promise<string[] | null> => {
  const supabase = await createClient();
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('user_completed_exercises')
      .select('exercise_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching completed exercises:', error);
      return null;
    }

    return data.map((item: { exercise_id: string }) => item.exercise_id);
  } catch (error) {
    console.error('Error in getCompletedExercises:', error);
    return null;
  }
};

/**
 * Mark an exercise as completed and update node/roadmap progress
 */
export const completeExercise = async (
  userId: string,
  exerciseId: string,
  nodeId: string,
  roadmapId: string | undefined
): Promise<{ success: boolean }> => {
  const supabase = await createClient();
  if (!userId || !exerciseId) return { success: false };
  
  try {
    const { error } = await supabase.from('user_completed_exercises').insert({
      user_id: userId,
      exercise_id: exerciseId,
      node_id: nodeId,
      roadmap_id: roadmapId
    });
    return { success: true };
  } catch (error) {
    console.error('Error in completeExercise:', error);
    return { success: false };
  }
};

/**
 * Unmark a completed exercise and update node/roadmap progress
 */
export const uncompleteExercise = async (
  userId: string,
  exerciseId: string,
  nodeId: string,
  roadmapId: string | undefined
): Promise<{ success: boolean }> => {
  const supabase = await createClient();
  if (!userId || !exerciseId) return { success: false };
  
  try {

    const { error } = await supabase
      .from('user_completed_exercises')
      .delete()
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId);

    return { success: true };
  } catch (error) {
    console.error('Error in uncompleteExercise:', error);
    return { success: false };
  }
};


export const getUserProgressOnRoadmap = async (userId: string, roadmapId: string) => {
  const supabase = await createClient();
  if (!userId || !roadmapId) return null;
  
  try {
    const { data, error } = await supabase
      .from('user_roadmap_progress')
      .select('total_exercises, completed_exercises, progress_percent')
      .eq('user_id', userId)
      .eq('roadmap_id', roadmapId)
      .single();

    if (error || !data) return null;
    return {
      totalExercises: data.total_exercises,
      completedExercises: data.completed_exercises,
      progressPercent: data.progress_percent,
    };
  } catch (error) {
    console.error('Error in getUserProgressOnRoadmap:', error);
    return null;
  }
};

export const getUserProgressOnNode = async (userId: string, nodeId: string) => {
  const supabase = await createClient();
  if (!userId || !nodeId) return null;
  
  try {
    const { data, error } = await supabase
      .from('user_node_progress')
      .select('total_exercises, completed_exercises, progress_percent')
      .eq('user_id', userId)
      .eq('node_id', nodeId)
      .single();

    console.log(data);


    return {
      totalExercises: data?.total_exercises || null,
      completedExercises: data?.completed_exercises || 0,
      progressPercent: data?.progress_percent || 0,
    };
  } catch (error) {
    console.error('Error in getUserProgressOnNode:', error);
    return null;
  }
};
