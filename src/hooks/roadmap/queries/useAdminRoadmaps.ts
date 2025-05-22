import { useQuery } from "@tanstack/react-query";
import { fetchAdminRoadmaps } from "@/services/api/roadmapApi";

/**
 * Hook to fetch all admin roadmaps
 */
export function useAdminRoadmaps() {
  return useQuery({
    queryKey: ['admin', 'roadmaps'],
    queryFn: fetchAdminRoadmaps,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}
