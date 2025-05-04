// src/lib/exerciseService.ts
import { createClient } from '@/lib/db/server';
import { Exercise } from '@/types/types';

/**
 * Exercise related service functions
 */

/**
 * Get exercise by ID
 * @param id Exercise ID
 * @returns Exercise data or null if not found
 */
export async function getExerciseById(id: string): Promise<{success: boolean, exercise?: Exercise | null, error?: string, status?: number}> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // For getExerciseById, we allow unauthenticated users to read exercises
    // but we keep the response structure consistent with other authenticated endpoints
    
    const { data, error } = await supabase.from('exercises')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return { success: false, error: "Exercise not found", status: 404 };
      console.error(`Failed to fetch exercise: ${error.message}`);
      return { success: false, error: "Failed to fetch exercise", status: 500 };
    }
    
    return { success: true, exercise: data as Exercise };
  } catch (error) {
    console.error('Error in getExerciseById:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}

/**
 * Create a new exercise
 * @param exercise Exercise data
 * @returns Created exercise or error
 */
export async function createExercise(exercise: Partial<Exercise>): Promise<{success: boolean, exercise?: Exercise, error?: string, status?: number}> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    const { data, error } = await supabase
      .from('exercises')
      .insert([exercise])
      .select()
      .single();
      
    if (error) {
      console.error(`Failed to create exercise: ${error.message}`);
      return { success: false, error: "Failed to create exercise", status: 500 };
    }
    
    return { success: true, exercise: data as Exercise };
  } catch (error) {
    console.error('Error in createExercise:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}

/**
 * Update an existing exercise
 * @param id Exercise ID
 * @param exercise Exercise data to update
 * @returns Success status
 */
export async function updateExercise(id: string, exercise: Partial<Exercise>): Promise<{success: boolean, error?: string, status?: number}> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    const { error } = await supabase
      .from('exercises')
      .update(exercise)
      .eq('id', id);
      
    if (error) {
      console.error(`Failed to update exercise: ${error.message}`);
      return { success: false, error: "Failed to update exercise", status: 500 };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in updateExercise:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}

/**
 * Delete an exercise
 * @param id Exercise ID
 * @returns Success status
 */
export async function deleteExercise(id: string): Promise<{success: boolean, error?: string, status?: number}> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    // First, remove all node-exercise relationships
    const { error: relError } = await supabase
      .from('node_exercises')
      .delete()
      .eq('exercise_id', id);
      
    if (relError) {
      console.error(`Failed to delete exercise relationships: ${relError.message}`);
      return { success: false, error: "Failed to delete exercise relationships", status: 500 };
    }
    
    // Then delete the exercise
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Failed to delete exercise: ${error.message}`);
      return { success: false, error: "Failed to delete exercise", status: 500 };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteExercise:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}

/**
 * Upload an image for an exercise question
 * @param exerciseId Exercise ID
 * @param file Image file to upload
 * @returns The public URL of the uploaded image
 */
export async function uploadQuestionImage(exerciseId: string, file: File): Promise<{success: boolean, imageUrl?: string, error?: string, status?: number}> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${exerciseId}-${Date.now()}.${fileExt}`;
    const filePath = `question_images/${fileName}`;
    
    // Upload the file to the "exercises" bucket
    const { error: uploadError } = await supabase.storage
      .from('exercises')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
      
    if (uploadError) {
      console.error(`Failed to upload image: ${uploadError.message}`);
      return { success: false, error: "Failed to upload question image", status: 500 };
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('exercises')
      .getPublicUrl(filePath);
      
    return { success: true, imageUrl: urlData.publicUrl };
  } catch (error) {
    console.error('Error uploading question image:', error);
    return { success: false, error: "Failed to upload question image", status: 500 };
  }
}

/**
 * Delete a question image from storage
 * @param imageUrl The URL of the image to delete
 * @returns Success status
 */
export async function deleteQuestionImage(imageUrl: string): Promise<{success: boolean, error?: string, status?: number}> {
  const supabase = await createClient();
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return { success: false, error: "Unauthorized", status: 401 };
    }
    
    // Extract the path from the URL
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'exercises');
    
    if (bucketIndex === -1) {
      return { success: false, error: "Invalid image URL format", status: 400 };
    }
    
    // Get the path within the bucket
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from('exercises')
      .remove([filePath]);
      
    if (error) {
      console.error(`Failed to delete image: ${error.message}`);
      return { success: false, error: "Failed to delete question image", status: 500 };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting question image:', error);
    return { success: false, error: "Internal Server Error", status: 500 };
  }
}