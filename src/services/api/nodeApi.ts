import { ReactFlowNode } from "@/types/types";
import Logger from "@/utils/logger";

/**
 * Fetch a single node by ID
 */
export async function getNode(nodeId: string): Promise<ReactFlowNode> {
  const response = await fetch(`/api/node/${nodeId}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch node');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch node');
  }
  
  // Transform the response to match ReactFlowNode structure
  return {
    id: result.node.id,
    type: result.node.type || 'progressNode',
    data: {
      label: result.node.label,
      description: result.node.description || '',
      progress: 0,
      total_exercises: result.node.total_exercises || 0,
      exercises: result.node.exercises || []
    },
    position: {
      x: result.node.positionX || 0,
      y: result.node.positionY || 0
    }
  };
}

/**
 * Create a new node for a roadmap
 */
export async function createNode(roadmapId: string, node: Partial<ReactFlowNode>): Promise<ReactFlowNode> {
  const response = await fetch('/api/node', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roadmapId,
      label: node.data?.label,
      description: node.data?.description,
      type: 'progressNode',
      positionX: node.position?.x,
      positionY: node.position?.y
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create node');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create node');
  }
  
  // Transform the response to match ReactFlowNode structure
  return {
    id: result.node.id,
    type: result.node.type,
    data: {
      label: result.node.label,
      description: result.node.description || '',
      progress: 0,
      total_exercises: 0
    },
    position: {
      x: result.node.positionX || 0,
      y: result.node.positionY || 0
    }
  };
}

/**
 * Update an existing node
 */
export async function updateNode(node: ReactFlowNode): Promise<ReactFlowNode> {
  const nodeId = node?.id;
  console.log('API: Updating node:', nodeId, 'position:', node.position);
  
  const response = await fetch(`/api/node/${nodeId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      label: node.data.label,
      description: node.data.description,
      type: node.type,
      positionX: node.position.x,
      positionY: node.position.y
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('API: Failed to update node:', errorData);
    throw new Error(errorData.error || 'Failed to update node');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to update node');
  }
  
  return node; // Return the original node as we've already structured it correctly
}

/**
 * Delete a node by ID
 */
export async function deleteNode(nodeId: string): Promise<void> {
  const response = await fetch(`/api/node/${nodeId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete node');
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete node');
  }
}
