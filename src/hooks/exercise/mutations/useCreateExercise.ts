import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExercise } from "@/services/api/exerciseApi";

/**
 * Hook for creating a new exercise
 */
export function useCreateExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createExercise,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exercises', variables.data.nodeId] });
    }
  });
}
