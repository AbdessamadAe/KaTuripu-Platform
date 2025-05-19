import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEdge } from "@/services/api/edgeApi";

/**
 * Hook for creating a new edge between nodes in a roadmap
 */
export function useCreateEdge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ roadmapId, edge }: { roadmapId: string; edge: { source: string; target: string } }) => 
      createEdge(roadmapId, edge),
    onSuccess: (_, variables) => {
      // Invalidate the specific roadmap query
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap', variables.roadmapId] });
    }
  });
}
