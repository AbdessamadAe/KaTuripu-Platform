import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoadmap } from "@/services/api/roadmapApi";

/**
 * Hook for updating an existing roadmap
 */
export function useUpdateRoadmap() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateRoadmap,
    onSuccess: (data) => {
      // Update both the list and the specific roadmap in cache
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmap', data.id] });
    }
  });
}
