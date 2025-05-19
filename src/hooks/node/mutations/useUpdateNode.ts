import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNode } from "@/services/api/nodeApi";

/**
 * Hook for updating an existing node
 */
export function useUpdateNode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateNode,
    onSuccess: (data) => {
      console.log('Node updated successfully:', data);
      // Since we don't know which roadmap the node belongs to, invalidate all roadmap detail queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap'] });
    },
    onError: (error) => {
      console.error('Error updating node:', error);
    }
  });
}
