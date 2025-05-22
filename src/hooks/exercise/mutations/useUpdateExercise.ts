import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExercise } from "@/services/api/exerciseApi";

/**
 * Hook for updating an existing exercise
 */
export function useUpdateExercise() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateExercise({ id, data }),
    onSuccess: () => {
      // Invalidate relevant queries after updating an exercise
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    }
  });
}
