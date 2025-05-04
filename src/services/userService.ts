// src/lib/userService.ts
import { createClient } from '@/lib/db/server';


/**
 * Is exercise completed by user 
**/

export const isExerciseCompleted = async (exerciseId: string): Promise<boolean> => {
  const supabase = await createClient();
  
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return false;
    }

    const {data, error} = await supabase
      .from('user_completed_exercises')
      .select('exercise_id')
      .eq('user_id', user.id)
      .eq('exercise_id', exerciseId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return false;
      console.error(`Failed to check if exercise is completed: ${error.message}`);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isExerciseCompleted:', error);
    return false;
  }
}

/**
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


export const getUserProgressOnRoadmap = async (roadmapId: string) => {
  const supabase = await createClient();
  
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    if (!roadmapId) {
      return { success: false, error: "Roadmap ID is required", status: 400 };
    }
    
    const { data, error } = await supabase
      .from('user_roadmap_progress')
      .select('total_exercises, completed_exercises, progress_percent')
      .eq('user_id', user.id)
      .eq('roadmap_id', roadmapId)
      .single();

    if (error || !data) {
      return { success: false, error: "Roadmap progress not found", status: 404 };
    }

    return {
      success: true,
      userProgressOnRoadmap: {
        totalExercises: data.total_exercises,
        completedExercises: data.completed_exercises,
        progressPercent: data.progress_percent,
      }
    };
  } catch (error) {
    console.error('Error in getUserProgressOnRoadmap:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
};

export const getUserProgressOnNode = async (nodeId: string) => {
  const supabase = await createClient();
  
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    if (!nodeId) {
      return { success: false, error: "Node ID is required", status: 400 };
    }
    
    const { data, error } = await supabase
      .from('user_node_progress')
      .select('total_exercises, completed_exercises, progress_percent')
      .eq('user_id', user.id)
      .eq('node_id', nodeId)
      .single();

    if (error) {
      console.log('Error fetching user progress on node:', error);
    }

    return {
      success: true, 
      userProgressOnNode: {
        totalExercises: data?.total_exercises || null,
        completedExercises: data?.completed_exercises || 0,
        progressPercent: data?.progress_percent || 0,
      }
    };
  } catch (error) {
    console.error('Error in getUserProgressOnNode:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
};
