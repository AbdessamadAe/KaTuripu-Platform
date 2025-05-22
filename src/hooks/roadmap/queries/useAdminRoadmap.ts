import { useQuery } from "@tanstack/react-query";
import { fetchAdminRoadmap } from "@/services/api/roadmapApi";

/**
 * Hook to fetch a specific admin roadmap by ID
 * @param roadmapId The ID of the roadmap to fetch
 */
export function useAdminRoadmap(roadmapId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'roadmap', roadmapId],
    queryFn: () => fetchAdminRoadmap(roadmapId as string),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!roadmapId
  });
}
