/**
 * Creates a new exercise
 */
export async function createExercise(exerciseData: any): Promise<any> {
  const response = await fetch('/api/exercise', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exerciseData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create exercise');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create exercise');
  }
  
  return result.exercise;
}

/**
 * Updates an existing exercise
 */
export async function updateExercise(params: { id: string; data: any }): Promise<any> {
  const { id, data } = params;
  const response = await fetch(`/api/exercise/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update exercise');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to update exercise');
  }
  
  return result.exercise;
}

/**
 * Deletes an exercise by ID
 */
export async function deleteExercise(exerciseId: string): Promise<void> {
  const response = await fetch(`/api/exercise/${exerciseId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete exercise');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete exercise');
  }
}
