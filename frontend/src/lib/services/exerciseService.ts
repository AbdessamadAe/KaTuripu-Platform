// src/lib/exerciseService.ts
import createClientForBrowser from '../db/client';
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
  const supabase = createClientForBrowser();
  try {
    const { data, error } = await supabase
      .from('exercises')
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
  const supabase = createClientForBrowser();
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
  const supabase = createClientForBrowser();
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
  const supabase = createClientForBrowser();
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