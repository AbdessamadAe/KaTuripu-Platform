/**
 * User metrics interface
 */
export interface UserMetrics {
  roadmapsStarted: number;
  roadmapsCompleted: number;
  exercisesCompleted: number;
  quizzesTaken: number;
  averageQuizScore: number;
}

/**
 * Fetch user metrics summary
 * @param userId ID of the user to fetch metrics for
 * @returns User metrics summary
 */
export async function fetchUserMetricsSummary(userId: string): Promise<UserMetrics> {
  try {
    const response = await fetch(`/api/user/${userId}/metrics/summary`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User metrics not found');
      } else if (response.status === 401) {
        throw new Error('Unauthorized');
      } else if (response.status === 403) {
        throw new Error('Permission denied');
      }
      throw new Error(`Failed to fetch user metrics: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    throw error;
  }
}