// src/lib/exerciseService.ts
import { createClient } from '@/lib/db/server';er';
import { Exercise } from '@/types/types';

/**
 * Exercise related service functions
 */

/**
 * Get exercise by ID
 * @param id Exercise ID
 * @returns Exercise data or null if not found
 */
export async function getExerciseById(id: string): Promise<Exercise | null> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('exercises')
      .select('*')
      .eq('id', id)
      .single();

      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch exercise: ${error.message}`);
    }
    
    return data as Exercise;
  } catch (error) {
    console.error('Error in getExerciseById:', error);
    throw error;
  }
}

/**
 * Create a new exercise
 * @param exercise Exercise data
 * @returns Created exercise
 */
export async function createExercise(exercise: Partial<Exercise>): Promise<Exercise> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('exercises')
      .insert([exercise])
      .select()
      .single();
      
    if (error) throw new Error(`Failed to create exercise: ${error.message}`);
    return data as Exercise;
  } catch (error) {
    console.error('Error in createExercise:', error);
    throw error;
  }
}

/**
 * Update an existing exercise
 * @param id Exercise ID
 * @param exercise Exercise data to update
 * @returns Success status
 */
export async function updateExercise(id: string, exercise: Partial<Exercise>): Promise<boolean> {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from('exercises')
      .update(exercise)
      .eq('id', id);
      
    if (error) throw new Error(`Failed to update exercise: ${error.message}`);
    return true;
  } catch (error) {
    console.error('Error in updateExercise:', error);
    throw error;
  }
}

/**
 * Delete an exercise
 * @param id Exercise ID
 * @returns Success status
 */
export async function deleteExercise(id: string): Promise<boolean> {
  const supabase = await createClient();
  try {
    // First, remove all node-exercise relationships
    const { error: relError } = await supabase
      .from('node_exercises')
      .delete()
      .eq('exercise_id', id);
      
    if (relError) throw new Error(`Failed to delete exercise relationships: ${relError.message}`);
    
    // Then delete the exercise
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);
      
    if (error) throw new Error(`Failed to delete exercise: ${error.message}`);
    return true;
  } catch (error) {
    console.error('Error in deleteExercise:', error);
    throw error;
  }
}

/**
 * Upload an image for an exercise question
 * @param exerciseId Exercise ID
 * @param file Image file to upload
 * @returns The public URL of the uploaded image
 */
export async function uploadQuestionImage(exerciseId: string, file: File): Promise<string> {
  const supabase = await createClient();
  try { 
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
      
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('exercises')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading question image:', error);
    throw new Error('Failed to upload question image. Please try again.');
  }
}

/**
 * Delete a question image from storage
 * @param imageUrl The URL of the image to delete
 * @returns Success status
 */
export async function deleteQuestionImage(imageUrl: string): Promise<boolean> {
  const supabase = await createClient();
  try {
    // Extract the path from the URL
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'exercises');
    
    if (bucketIndex === -1) {
      throw new Error('Invalid image URL format');
    }
    
    // Get the path within the bucket
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from('exercises')
      .remove([filePath]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting question image:', error);
    return false; // Don't throw here - it's not critical if image deletion fails
  }
}