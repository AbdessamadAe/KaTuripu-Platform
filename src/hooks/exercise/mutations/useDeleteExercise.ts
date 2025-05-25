import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExercise } from "@/services/api/exerciseApi";

/**
 * Hook for deleting an exercise
 */
export function useDeleteExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ exerciseId, nodeId }: { exerciseId: string; nodeId: string }) => deleteExercise(exerciseId),
    onSuccess: (_, variables) => {
      console.log('Exercise deleted successfully:', variables);
      queryClient.invalidateQueries({ queryKey: ['exercises', variables.nodeId] });
      queryClient.invalidateQueries({ queryKey: ['exercise', variables.exerciseId] });
    }
  });
}
