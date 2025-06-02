import { QuizWithQuestions } from "../quizService";

/**
 * Fetch a quiz by roadmap ID
 * @param roadmapId ID of the roadmap
 * @returns Quiz with questions or null if no quiz exists
 */
export async function getQuizByRoadmap(roadmapId: string): Promise<QuizWithQuestions | null> {
  try {
    const response = await fetch(`/api/quiz/${roadmapId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch quiz: ${response.statusText}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quiz by roadmap:", error);
    throw error;
  }
}

/**
 * Submit a quiz result
 * @param userId User ID
 * @param quizId Quiz ID
 * @param score Score achieved
 * @returns The created or updated quiz result
 */
export async function submitQuizResult(userId: string, quizId: string, score: number) {
  try {
    const response = await fetch(`/api/quiz/result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, quizId, score }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit quiz result: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting quiz result:", error);
    throw error;
  }
}
