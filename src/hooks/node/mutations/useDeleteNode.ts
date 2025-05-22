import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNode } from "@/services/api/nodeApi";

/**
 * Hook for deleting a node
 */
export function useDeleteNode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNode,
    onSuccess: () => {
      // Invalidate all roadmap queries as we don't know which roadmap was affected
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    }
  });
}
