import { useQuery } from "@tanstack/react-query";
import { fetchUserMetricsSummary, UserMetrics } from "@/services/api/userApi";

/**
 * Hook to fetch user metrics summary
 * @param userId The ID of the user to fetch metrics for
 * @returns Query result containing user metrics
 */
export const useUserMetrics = (userId: string) => {
  return useQuery<UserMetrics, Error>({
    queryKey: ["userMetrics", userId],
    queryFn: () => fetchUserMetricsSummary(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
