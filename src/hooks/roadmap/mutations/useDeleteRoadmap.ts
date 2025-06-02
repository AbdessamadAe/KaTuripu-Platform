import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoadmap } from "@/services/api/roadmapApi";

/**
 * Hook for deleting an existing roadmap
 */
export function useDeleteRoadmap() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteRoadmap,
    onSuccess: () => {
      // Invalidate and refetch roadmaps list
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmaps'] });
    }
  });
}
