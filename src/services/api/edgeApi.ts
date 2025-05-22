import { ReactFlowEdge } from "@/types/types";

/**
 * Creates a new edge between nodes in a roadmap
 */
export async function createEdge(roadmapId: string, edge: { source: string; target: string }): Promise<ReactFlowEdge> {
  const response = await fetch('/api/edge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roadmapId,
      sourceNodeId: edge.source,
      targetNodeId: edge.target
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create edge');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create edge');
  }
  
  // Transform the response to match ReactFlowEdge structure
  return {
    id: result.edge.id,
    source: result.edge.sourceNodeId,
    target: result.edge.targetNodeId
  };
}

/**
 * Deletes an edge by ID
 */
export async function deleteEdge(edgeId: string): Promise<void> {
  const response = await fetch(`/api/edge?id=${edgeId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete edge');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete edge');
  }
}
