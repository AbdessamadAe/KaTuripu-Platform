import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEdge } from "@/services/api/edgeApi";

/**
 * Hook for deleting an edge
 */
export function useDeleteEdge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteEdge,
    onSuccess: () => {
      // Invalidate all roadmap queries as we don't know which roadmap was affected
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    }
  });
}
