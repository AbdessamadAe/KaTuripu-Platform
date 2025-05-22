import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNode } from "@/services/api/nodeApi";
import { ReactFlowNode } from "@/types/types";

/**
 * Hook for creating a new node in a roadmap
 */
export function useCreateNode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ roadmapId, node }: { roadmapId: string; node: Partial<ReactFlowNode> }) => 
      createNode(roadmapId, node),
    onSuccess: (_, variables) => {
      // Invalidate the specific roadmap query
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap', variables.roadmapId] });
    }
  });
}
