import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExercise } from "@/services/api/exerciseApi";

/**
 * Hook for creating a new exercise
 */
export function useCreateExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      // Invalidate relevant queries after creating an exercise
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    }
  });
}
