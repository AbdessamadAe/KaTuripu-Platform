import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuizByRoadmap, submitQuizResult } from "@/services/api/quizApi";
import { QuizWithQuestions } from "@/services/quizService";

/**
 * Hook to fetch a quiz by roadmap ID
 * @param roadmapId ID of the roadmap associated with the quiz
 * @returns Query result containing the quiz data
 */
export const useQuizByRoadmap = (roadmapId: string) => {
  return useQuery<QuizWithQuestions | null, Error>({
    queryKey: ["quiz", roadmapId],
    queryFn: () => getQuizByRoadmap(roadmapId),
    enabled: !!roadmapId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to submit a quiz result
 * @returns Mutation function and state for submitting quiz results
 */
export const useSubmitQuizResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, quizId, score }: { userId: string; quizId: string; score: number }) =>
      submitQuizResult(userId, quizId, score),
    onSuccess: (_, { quizId, userId }) => {
      // Invalidate user quiz results
      queryClient.invalidateQueries({ queryKey: ["userQuizResults", userId] });
      // Invalidate the specific quiz
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
    },
  });
};
