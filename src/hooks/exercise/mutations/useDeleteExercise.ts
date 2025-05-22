import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExercise } from "@/services/api/exerciseApi";

/**
 * Hook for deleting an exercise
 */
export function useDeleteExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => {
      // Invalidate relevant queries after deleting an exercise
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    }
  });
}
