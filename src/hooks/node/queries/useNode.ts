import { useQuery } from "@tanstack/react-query";
import { ReactFlowNode } from "@/types/types";

/**
 * Fetch a node by ID from the API
 */
async function fetchNodeById(nodeId: string): Promise<ReactFlowNode> {
  const response = await fetch(`/api/node/${nodeId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch node');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch node');
  }
  
  // Transform the response to match ReactFlowNode structure
  return {
    id: data.node.id,
    type: data.node.type || 'progressNode',
    data: {
      label: data.node.label,
      description: data.node.description || '',
      progress: 0,
      total_exercises: data.node.total_exercises || 0,
      exercises: data.node.exercises || []
    },
    position: {
      x: data.node.positionX || 0,
      y: data.node.positionY || 0
    }
  };
}

/**
 * Hook to fetch a specific node by ID
 * @param nodeId The ID of the node to fetch
 */
export function useNode(nodeId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'node', nodeId],
    queryFn: () => fetchNodeById(nodeId as string),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!nodeId
  });
}
