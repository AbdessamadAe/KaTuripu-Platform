import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoadmap } from "@/services/api/roadmapApi";

/**
 * Hook for creating a new roadmap
 */
export function useCreateRoadmap() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createRoadmap,
    onSuccess: () => {
      // Invalidate and refetch roadmaps list
      queryClient.invalidateQueries({ queryKey: ['admin', 'roadmaps'] });
    }
  });
}
