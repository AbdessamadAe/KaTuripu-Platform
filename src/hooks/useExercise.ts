import { useQuery, useMutation, useQueryClient, InvalidateQueryFilters } from "@tanstack/react-query";
import { Exercise } from "@prisma/client";
import { showAchievement } from "@/utils/utils";
import Logger from "@/utils/logger";

async function fetchExercise(exerciseId: string): Promise<Exercise> {
  const res = await fetch(`/api/exercise/${exerciseId}`);
  if (!res.ok) {
    throw new Error(`Error fetching exercise: ${res.statusText}`);
  }
  return res.json();
}

async function completeExerciseMutation(exerciseId: string) {
  const res = await fetch(`/api/user-progress/complete-exercise`, {
    method: "POST",
    body: JSON.stringify({ exerciseId: exerciseId })
  });

  if (!res.ok) {
    throw new Error(`Error completing exercise: ${res.statusText}`);
  }
  
  return res.json();
}

export function useExercise(exerciseId: string | null) {
  return useQuery({
    queryKey: ['exercise', exerciseId],
    queryFn: () => fetchExercise(exerciseId as string),
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    retryDelay: 1000,
    enabled: !!exerciseId
  });
}

export function useCompleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: string) => completeExerciseMutation(exerciseId),
    onMutate: async (exerciseId) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['exercise', exerciseId] });

      // Snapshot the previous value
      const previousExercise = queryClient.getQueryData(['exercise', exerciseId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['exercise', exerciseId], (old: any) => ({
        ...old,
        completed: true
      }));

      // Return a context object with the snapshotted value
      return { previousExercise };
    },
    onSuccess: (_, exerciseId, { previousExercise }) => {
      showAchievement("Well Done!", "Exercise Completed");
      // Get nodeId from the previous exercise to invalidate related queries
      const nodeId = (previousExercise as any)?.nodeId;
      if (nodeId) {
        queryClient.invalidateQueries(['exercises', nodeId] as InvalidateQueryFilters<readonly unknown[]>);
      }
    },
    onError: (error, exerciseId, context) => {
      Logger.error('Error completing exercise:', error);
      // Rollback to previous state on error
      if (context?.previousExercise) {
        queryClient.setQueryData(['exercise', exerciseId], context.previousExercise);
      }
    },
    onSettled: (_, __, exerciseId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['exercise', exerciseId] as InvalidateQueryFilters<readonly unknown[]>);
    },
  });
}

export function useExercisesByNodeId(nodeId: string | null) {
  return useQuery({
    queryKey: ['exercises', nodeId],
    queryFn: async () => {
      const res = await fetch(`/api/node/${nodeId}/exercise-list`);
      if (!res.ok) {
        throw new Error(`Error fetching exercises for node: ${res.statusText}`);
      }
      return res.json();
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!nodeId
  });
}