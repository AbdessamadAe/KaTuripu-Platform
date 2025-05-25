import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExercise } from "@/services/api/exerciseApi";

/**
 * Hook for updating an existing exercise
 */
export function useUpdateExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data, nodeId }: { id: string; data: any }) => updateExercise({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exercises', variables.nodeId] });
      queryClient.invalidateQueries({ queryKey: ['exercise', variables.id] });
    }
  });
}
